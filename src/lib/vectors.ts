import { prisma } from "./prisma";
import { createEmbedding, createEmbeddings, chunkText } from "./embeddings";
import { withRetry } from "./withRetry";

// Maximum chunks to process - prevents timeout on very large files
const MAX_CHUNKS = 30;

export async function indexKnowledge(
  chatbotId: string,
  sourceId: string,
  content: string
): Promise<void> {
  console.log("indexKnowledge started for source:", sourceId);
  console.log("Content length:", content.length);

  // Use larger chunk size (2500) to reduce number of API calls
  let chunks = chunkText(content, 2500, 300);
  console.log("Created chunks:", chunks.length);

  if (chunks.length === 0) {
    throw new Error("No chunks created from content");
  }

  // Limit chunks to prevent timeout
  if (chunks.length > MAX_CHUNKS) {
    console.log(`Limiting chunks from ${chunks.length} to ${MAX_CHUNKS}`);
    chunks = chunks.slice(0, MAX_CHUNKS);
  }

  console.log("Creating embeddings...");
  const embeddings = await createEmbeddings(chunks);
  console.log("Embeddings created:", embeddings.length);

  // Delete existing chunks for this source
  console.log("Deleting existing chunks...");
  await withRetry(() =>
    prisma.knowledgeChunk.deleteMany({
      where: { sourceId },
    })
  );
  console.log("Existing chunks deleted");

  // Batch INSERT - much faster than inserting one by one
  console.log("Inserting chunks in batch...");

  // Build VALUES for batch insert
  const values: string[] = [];
  for (let i = 0; i < chunks.length; i++) {
    const chunkId = `chunk_${sourceId}_${i}`;
    const embeddingStr = `[${embeddings[i].join(",")}]`;
    // Escape single quotes in content for SQL
    const escapedContent = chunks[i].replace(/'/g, "''");
    values.push(`('${chunkId}', '${sourceId}', '${chatbotId}', '${escapedContent}', '${embeddingStr}'::vector, ${i}, NOW())`);
  }

  // Execute single batch INSERT instead of loop
  const batchInsertSQL = `
    INSERT INTO "KnowledgeChunk" (id, "sourceId", "chatbotId", content, embedding, "chunkIndex", "createdAt")
    VALUES ${values.join(', ')}
  `;

  try {
    await withRetry(() => prisma.$executeRawUnsafe(batchInsertSQL));
    console.log(`All ${chunks.length} chunks inserted in single batch`);
  } catch (insertError: any) {
    console.error("Batch insert failed:", insertError?.message);
    throw insertError;
  }
}

export async function deleteKnowledge(sourceId: string): Promise<void> {
  await withRetry(() =>
    prisma.knowledgeChunk.deleteMany({
      where: { sourceId },
    })
  );
}

export async function queryKnowledge(
  chatbotId: string,
  query: string,
  topK: number = 5
): Promise<string[]> {
  const queryEmbedding = await createEmbedding(query);
  const embeddingArray = `[${queryEmbedding.join(",")}]`;

  // Use cosine similarity search with pgvector
  const results = await withRetry(() =>
    prisma.$queryRaw<{ content: string; similarity: number }[]>`
      SELECT
        content,
        1 - (embedding <=> ${embeddingArray}::vector) as similarity
      FROM "KnowledgeChunk"
      WHERE "chatbotId" = ${chatbotId}
        AND embedding IS NOT NULL
      ORDER BY embedding <=> ${embeddingArray}::vector
      LIMIT ${topK}
    `
  );

  return results.map((r: { content: string }) => r.content);
}
