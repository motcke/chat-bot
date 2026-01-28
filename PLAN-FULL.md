# תוכנית פיתוח מלאה - פלטפורמת צ'אטבוט SaaS

## סקירה כללית

פלטפורמה שמאפשרת לבעלי עסקים ליצור צ'אטבוט חכם מבוסס AI, מותאם אישית, ולהטמיע אותו באתר שלהם.

**יכולות עיקריות:**
- יצירת צ'אטבוט מותאם אישית
- העלאת מאגר ידע (קבצים ולינקים)
- תשובות חכמות מבוססות RAG
- הטמעה קלה באתר הלקוח
- ניתוח שיחות וסטטיסטיקות
- מודל עסקי עם תכניות מחיר

---

## טכנולוגיות

| רכיב | טכנולוגיה | הערות |
|------|-----------|-------|
| Frontend + Backend | **Next.js 14** (App Router) | Full-stack framework |
| Database | **Supabase** (PostgreSQL) | Database + Auth + Vectors |
| Vector DB | **pgvector** (Supabase) | וקטורים באותו DB |
| AI/LLM | **Anthropic Claude API** | מודל שפה |
| Embeddings | **OpenAI Embeddings** | text-embedding-3-small |
| Authentication | **Google OAuth** (ישיר) | התחברות עם Google |
| Styling | **Tailwind CSS** + **shadcn/ui** | UI Components |
| File Storage | **Local Storage** | אחסון קבצים בשרת |
| Cache | **Redis** / **Upstash** | Caching + Rate Limiting |
| Queue | **BullMQ** / **Inngest** | Background Jobs |
| Payments | **Stripe** | תשלומים ומנויים |
| Monitoring | **Sentry** | מעקב שגיאות |
| Analytics | **PostHog** | אנליטיקס |
| Logging | **Pino** | Structured Logging |
| Widget | **Vanilla JS** | להטמעה קלה |

### יתרונות הארכיטקטורה

1. **פשטות** - DB + Vectors במקום אחד (Supabase)
2. **עלות נמוכה** - Local Storage + Supabase Free Tier
3. **מהירות פיתוח** - פחות אינטגרציות
4. **תחזוקה קלה** - פחות שירותים לנהל

---

## מבנה הפרויקט

```
chatbot/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── (auth)/                 # דפי התחברות
│   │   │   ├── login/
│   │   │   └── callback/           # Google OAuth callback
│   │   ├── (dashboard)/            # דשבורד מוגן
│   │   │   ├── page.tsx            # דף ראשי - סטטיסטיקות
│   │   │   ├── settings/           # הגדרות צ'אטבוט
│   │   │   ├── knowledge/          # ניהול קבצים ולינקים
│   │   │   ├── conversations/      # היסטוריית שיחות
│   │   │   ├── playground/         # בדיקת הצ'אטבוט
│   │   │   ├── embed/              # הוראות הטמעה
│   │   │   ├── analytics/          # אנליטיקס ודוחות
│   │   │   ├── leads/              # ניהול לידים
│   │   │   ├── api-keys/           # ניהול API Keys
│   │   │   └── billing/            # חיוב ותשלום
│   │   ├── api/
│   │   │   ├── auth/               # Google OAuth endpoints
│   │   │   │   ├── google/
│   │   │   │   └── callback/
│   │   │   ├── chat/               # Chat API (לווידג'ט)
│   │   │   ├── knowledge/          # העלאת קבצים
│   │   │   ├── webhook/            # Web scraping
│   │   │   ├── webhooks/           # Stripe webhooks
│   │   │   └── health/             # Health check
│   │   └── widget/                 # Widget endpoint
│   ├── components/
│   │   ├── ui/                     # shadcn components
│   │   ├── chat/                   # רכיבי צ'אט
│   │   ├── dashboard/              # רכיבי דשבורד
│   │   └── analytics/              # גרפים וסטטיסטיקות
│   ├── lib/
│   │   ├── supabase.ts             # Supabase client
│   │   ├── anthropic.ts            # Claude API
│   │   ├── embeddings.ts           # OpenAI Embeddings
│   │   ├── vectors.ts              # pgvector operations
│   │   ├── cache.ts                # Redis/Upstash
│   │   ├── queue.ts                # BullMQ
│   │   ├── stripe.ts               # Stripe
│   │   ├── rate-limit.ts           # Rate limiting
│   │   ├── logger.ts               # Pino logger
│   │   ├── google-auth.ts          # Google OAuth
│   │   └── utils.ts                # Helper functions
│   ├── jobs/                       # Background jobs
│   │   ├── processFile.job.ts      # עיבוד קובץ
│   │   ├── scrapeUrl.job.ts        # סריקת URL
│   │   ├── generateEmbeddings.job.ts
│   │   └── cleanupSessions.job.ts
│   ├── middleware/
│   │   ├── auth.ts                 # Authentication
│   │   ├── rate-limit.ts           # Rate limiting
│   │   └── validate.ts             # Input validation
│   ├── validators/                 # Zod schemas
│   │   ├── chat.ts
│   │   ├── knowledge.ts
│   │   └── settings.ts
│   ├── types/
│   │   ├── index.ts
│   │   ├── chat.ts
│   │   └── api.ts
│   └── constants/
│       ├── plans.ts                # תכניות מחיר
│       └── limits.ts               # הגבלות
├── widget/                         # קוד הווידג'ט להטמעה
│   ├── src/
│   │   └── widget.ts
│   └── dist/
│       └── chatbot-widget.js
├── uploads/                        # תיקיית קבצים מקומית
│   └── .gitkeep
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── public/
├── docker-compose.yml              # Local development
├── .github/
│   └── workflows/
│       └── ci.yml                  # CI/CD
└── .env.example
```

---

## סכמת Database (Supabase)

```sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================
-- USERS & AUTHENTICATION
-- ============================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  google_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  image VARCHAR(500),
  
  -- Billing
  plan VARCHAR(50) DEFAULT 'free', -- free | pro | enterprise
  stripe_customer_id VARCHAR(255) UNIQUE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- API KEYS
-- ============================================

CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  key_hash VARCHAR(255) UNIQUE NOT NULL,  -- Hashed API key
  key_prefix VARCHAR(10) NOT NULL,         -- First 8 chars for display
  name VARCHAR(100) NOT NULL,              -- "Production", "Development"
  
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_api_keys_user ON api_keys(user_id);

-- ============================================
-- CHATBOT
-- ============================================

CREATE TABLE chatbots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Basic Settings
  name VARCHAR(255) NOT NULL,
  system_prompt TEXT,
  welcome_message VARCHAR(500) DEFAULT 'שלום! איך אוכל לעזור?',
  
  -- Appearance
  primary_color VARCHAR(7) DEFAULT '#3B82F6',
  position VARCHAR(20) DEFAULT 'bottom-right', -- bottom-right | bottom-left
  
  -- AI Settings
  temperature DECIMAL(2,1) DEFAULT 0.7,
  max_tokens INTEGER DEFAULT 1000,
  language VARCHAR(10) DEFAULT 'he',
  
  -- Security
  allowed_domains TEXT[], -- דומיינים מורשים לווידג'ט
  is_active BOOLEAN DEFAULT true,
  
  -- Usage Tracking
  monthly_messages INTEGER DEFAULT 0,
  total_messages INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chatbots_user ON chatbots(user_id);

-- ============================================
-- KNOWLEDGE BASE
-- ============================================

CREATE TABLE knowledge_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chatbot_id UUID REFERENCES chatbots(id) ON DELETE CASCADE,
  
  type VARCHAR(20) NOT NULL, -- "file" | "url" | "text"
  name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500),    -- נתיב מקומי לקובץ
  url VARCHAR(500),          -- לינק מקורי
  content TEXT,
  
  -- Processing
  status VARCHAR(20) DEFAULT 'pending', -- pending | processing | ready | failed
  error_message TEXT,
  
  -- Metadata
  file_size INTEGER,
  mime_type VARCHAR(100),
  chunks_count INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_knowledge_chatbot_status ON knowledge_sources(chatbot_id, status);

-- ============================================
-- KNOWLEDGE CHUNKS (עם וקטורים)
-- ============================================

CREATE TABLE knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  knowledge_source_id UUID REFERENCES knowledge_sources(id) ON DELETE CASCADE,
  chatbot_id UUID REFERENCES chatbots(id) ON DELETE CASCADE,
  
  content TEXT NOT NULL,
  embedding vector(1536), -- OpenAI embedding dimension
  
  -- Metadata
  chunk_index INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chunks_chatbot ON knowledge_chunks(chatbot_id);

-- Index for vector similarity search
CREATE INDEX idx_chunks_embedding ON knowledge_chunks 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- ============================================
-- CONVERSATIONS & MESSAGES
-- ============================================

CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chatbot_id UUID REFERENCES chatbots(id) ON DELETE CASCADE,
  
  session_id VARCHAR(255) NOT NULL,
  
  -- Visitor Info
  visitor_name VARCHAR(255),
  visitor_email VARCHAR(255),
  visitor_phone VARCHAR(50),
  
  -- Metadata
  user_agent TEXT,
  ip_address VARCHAR(45),
  referrer VARCHAR(500),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_conversations_chatbot ON conversations(chatbot_id, created_at);
CREATE INDEX idx_conversations_session ON conversations(session_id);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  
  role VARCHAR(20) NOT NULL, -- "user" | "assistant"
  content TEXT NOT NULL,
  
  -- AI Metadata
  tokens_used INTEGER,
  sources JSONB, -- מקורות RAG שהשתמשו בהם
  
  -- Feedback
  feedback VARCHAR(20), -- "positive" | "negative" | null
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at);

-- ============================================
-- LEADS
-- ============================================

CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chatbot_id UUID REFERENCES chatbots(id) ON DELETE CASCADE,
  
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  message TEXT,
  
  source VARCHAR(500), -- URL שממנו הגיע
  status VARCHAR(20) DEFAULT 'new', -- new | contacted | converted | closed
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_leads_chatbot ON leads(chatbot_id, created_at);
CREATE INDEX idx_leads_email ON leads(email);

-- ============================================
-- USAGE & BILLING
-- ============================================

CREATE TABLE usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  chatbot_id UUID,
  
  type VARCHAR(50) NOT NULL, -- "message" | "embedding" | "file_upload"
  tokens INTEGER,
  cost DECIMAL(10,6), -- עלות בדולרים
  
  metadata JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_usage_user ON usage_logs(user_id, created_at);
CREATE INDEX idx_usage_chatbot ON usage_logs(chatbot_id, created_at);

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id),
  
  stripe_subscription_id VARCHAR(255) UNIQUE,
  stripe_price_id VARCHAR(255),
  
  status VARCHAR(50), -- active | canceled | past_due
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function for vector similarity search
CREATE OR REPLACE FUNCTION match_chunks(
  query_embedding vector(1536),
  match_chatbot_id UUID,
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    kc.id,
    kc.content,
    1 - (kc.embedding <=> query_embedding) AS similarity
  FROM knowledge_chunks kc
  WHERE kc.chatbot_id = match_chatbot_id
    AND 1 - (kc.embedding <=> query_embedding) > match_threshold
  ORDER BY kc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_chatbots_updated_at
  BEFORE UPDATE ON chatbots
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_knowledge_sources_updated_at
  BEFORE UPDATE ON knowledge_sources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

## Google OAuth Authentication

```typescript
// src/lib/google-auth.ts

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL + '/api/auth/callback';

export function getGoogleAuthUrl(): string {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent',
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

export async function getGoogleTokens(code: string) {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    }),
  });

  return response.json();
}

export async function getGoogleUser(accessToken: string) {
  const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return response.json();
}
```

```typescript
// src/app/api/auth/google/route.ts

import { redirect } from 'next/navigation';
import { getGoogleAuthUrl } from '@/lib/google-auth';

export async function GET() {
  const url = getGoogleAuthUrl();
  redirect(url);
}
```

```typescript
// src/app/api/auth/callback/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getGoogleTokens, getGoogleUser } from '@/lib/google-auth';
import { supabase } from '@/lib/supabase';
import { createSession } from '@/lib/session';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  
  if (!code) {
    return NextResponse.redirect('/login?error=no_code');
  }

  const tokens = await getGoogleTokens(code);
  const googleUser = await getGoogleUser(tokens.access_token);

  // Upsert user
  const { data: user } = await supabase
    .from('users')
    .upsert({
      google_id: googleUser.id,
      email: googleUser.email,
      name: googleUser.name,
      image: googleUser.picture,
    }, { onConflict: 'google_id' })
    .select()
    .single();

  // Create session
  const session = await createSession(user.id);

  const response = NextResponse.redirect('/dashboard');
  response.cookies.set('session', session.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}
```

---

## Vector Search (pgvector)

```typescript
// src/lib/vectors.ts

import { supabase } from './supabase';
import { createEmbedding } from './embeddings';

export async function storeChunk(
  knowledgeSourceId: string,
  chatbotId: string,
  content: string,
  chunkIndex: number
) {
  const embedding = await createEmbedding(content);

  const { error } = await supabase
    .from('knowledge_chunks')
    .insert({
      knowledge_source_id: knowledgeSourceId,
      chatbot_id: chatbotId,
      content,
      embedding,
      chunk_index: chunkIndex,
    });

  if (error) throw error;
}

export async function searchSimilarChunks(
  chatbotId: string,
  query: string,
  limit: number = 5,
  threshold: number = 0.7
) {
  const queryEmbedding = await createEmbedding(query);

  const { data, error } = await supabase.rpc('match_chunks', {
    query_embedding: queryEmbedding,
    match_chatbot_id: chatbotId,
    match_threshold: threshold,
    match_count: limit,
  });

  if (error) throw error;
  return data;
}
```

```typescript
// src/lib/embeddings.ts

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function createEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });

  return response.data[0].embedding;
}
```

---

## Local File Storage

```typescript
// src/lib/file-storage.ts

import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

export async function saveFile(
  file: Buffer,
  originalName: string,
  chatbotId: string
): Promise<string> {
  const ext = path.extname(originalName);
  const fileName = `${chatbotId}/${randomUUID()}${ext}`;
  const filePath = path.join(UPLOAD_DIR, fileName);

  // Ensure directory exists
  await fs.mkdir(path.dirname(filePath), { recursive: true });

  await fs.writeFile(filePath, file);

  return fileName;
}

export async function readFile(fileName: string): Promise<Buffer> {
  const filePath = path.join(UPLOAD_DIR, fileName);
  return fs.readFile(filePath);
}

export async function deleteFile(fileName: string): Promise<void> {
  const filePath = path.join(UPLOAD_DIR, fileName);
  await fs.unlink(filePath);
}

export function getFilePath(fileName: string): string {
  return path.join(UPLOAD_DIR, fileName);
}
```

---

## תכניות מחיר

```typescript
// src/constants/plans.ts

export const PLANS = {
  free: {
    name: 'חינם',
    price: 0,
    limits: {
      chatbots: 1,
      messagesPerMonth: 100,
      knowledgeSources: 3,
      maxFileSize: 5 * 1024 * 1024, // 5MB
    },
    features: [
      'צ\'אטבוט אחד',
      '100 הודעות בחודש',
      '3 מקורות ידע',
      'אנליטיקס בסיסי',
    ],
  },
  pro: {
    name: 'מקצועי',
    price: 49, // ש"ח לחודש
    stripePriceId: 'price_xxx',
    limits: {
      chatbots: 5,
      messagesPerMonth: 5000,
      knowledgeSources: 50,
      maxFileSize: 25 * 1024 * 1024, // 25MB
    },
    features: [
      'עד 5 צ\'אטבוטים',
      '5,000 הודעות בחודש',
      '50 מקורות ידע',
      'אנליטיקס מתקדם',
      'איסוף לידים',
      'מיתוג מותאם',
      'תמיכה באימייל',
    ],
  },
  enterprise: {
    name: 'ארגוני',
    price: 199,
    stripePriceId: 'price_yyy',
    limits: {
      chatbots: -1, // unlimited
      messagesPerMonth: -1,
      knowledgeSources: -1,
      maxFileSize: 100 * 1024 * 1024, // 100MB
    },
    features: [
      'צ\'אטבוטים ללא הגבלה',
      'הודעות ללא הגבלה',
      'מקורות ידע ללא הגבלה',
      'כל התכונות',
      'API Access',
      'תמיכה עדיפה',
      'SLA',
      'Custom integrations',
    ],
  },
} as const;
```

---

## אבטחה

### Rate Limiting

```typescript
// src/lib/rate-limit.ts

export const RATE_LIMITS = {
  // בקשות לפי IP
  global: {
    requests: 100,
    window: 60, // שניות
  },
  // Chat API לפי session
  chat: {
    requests: 20,
    window: 60,
  },
  // API לפי API Key
  api: {
    requests: 1000,
    window: 3600, // שעה
  },
  // העלאת קבצים
  upload: {
    requests: 10,
    window: 3600,
  },
};
```

### Input Validation

```typescript
// src/validators/chat.ts
import { z } from 'zod';

export const chatMessageSchema = z.object({
  message: z
    .string()
    .min(1, 'הודעה ריקה')
    .max(4000, 'הודעה ארוכה מדי'),
  chatbotId: z.string().uuid(),
  sessionId: z.string().uuid(),
});

// src/validators/knowledge.ts
export const uploadFileSchema = z.object({
  file: z.object({
    size: z.number().max(25 * 1024 * 1024, 'קובץ גדול מדי'),
    type: z.enum([
      'application/pdf',
      'text/plain',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]),
  }),
});
```

### CORS

```typescript
// src/middleware/cors.ts

export function validateOrigin(
  origin: string,
  allowedDomains: string[]
): boolean {
  if (allowedDomains.length === 0) return true;
  
  return allowedDomains.some(domain => {
    if (domain.startsWith('*.')) {
      const suffix = domain.slice(1);
      return origin.endsWith(suffix);
    }
    return origin === domain || origin === `https://${domain}`;
  });
}
```

---

## תכונות עיקריות

### 1. מערכת התחברות
- התחברות עם Google OAuth
- Session management עם cookies

### 2. דשבורד ראשי
- סטטיסטיקות מהירות (שיחות, הודעות, לידים)
- גרף שיחות לפי יום
- שאלות נפוצות
- התראות על חריגה ממכסות

### 3. הגדרות צ'אטבוט (`/settings`)
- שם הצ'אטבוט
- System Prompt (הוראות לצ'אטבוט)
- הודעת פתיחה
- צבע ראשי
- מיקום הווידג'ט
- הגדרות AI (temperature, max tokens)
- דומיינים מורשים

### 4. מאגר ידע (`/knowledge`)
- העלאת קבצים (PDF, TXT, DOCX)
- הוספת לינקים (נמשך תוכן אוטומטית)
- הוספת טקסט ישירות
- סטטוס עיבוד לכל מקור
- מחיקת מקורות
- תצוגת כמות chunks

### 5. שיחות (`/conversations`)
- רשימת כל השיחות
- צפייה בשיחה מלאה
- חיפוש בשיחות
- סינון לפי תאריך/סטטוס
- ייצוא ל-CSV

### 6. בדיקת צ'אטבוט (`/playground`)
- ממשק צ'אט לבדיקה
- איפוס שיחה
- הצגת מקורות בתשובה

### 7. הטמעה (`/embed`)
- הצגת קוד HTML להטמעה
- תצוגה מקדימה של הווידג'ט
- ניהול API Keys
- הגדרת דומיינים מורשים

### 8. אנליטיקס (`/analytics`)
- גרף שיחות לפי יום/שבוע/חודש
- זמן תגובה ממוצע
- שאלות נפוצות (Word Cloud)
- שביעות רצון (מבוסס feedback)
- Top referrers
- שעות פעילות

### 9. לידים (`/leads`)
- רשימת לידים
- סטטוס ליד (חדש/נוצר קשר/הומר/נסגר)
- ייצוא ל-CSV
- Webhook לשליחה ל-CRM
- התראות אימייל על ליד חדש

### 10. חיוב (`/billing`)
- תכנית נוכחית
- שימוש חודשי
- שדרוג/שנמוך תכנית
- היסטוריית חיובים
- עדכון אמצעי תשלום

---

## איך RAG עובד

```
┌─────────────────────────────────────────────────────────────────┐
│                        הכנת מאגר הידע                           │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  1. העלאה   │───▶│  2. עיבוד   │───▶│ 3. Embedding│───▶│  4. אחסון   │
│  קובץ/URL   │    │   Chunking  │    │   OpenAI    │    │  pgvector   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        שאילתת משתמש                             │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  5. שאלה    │───▶│ 6. חיפוש   │───▶│  7. Context │───▶│  8. תשובה   │
│   Embedding │    │  pgvector   │    │   + Prompt  │    │   Claude    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

### Chunking Strategy

```typescript
const CHUNK_CONFIG = {
  chunkSize: 500,      // תווים
  chunkOverlap: 50,    // חפיפה בין chunks
  separators: ['\n\n', '\n', '. ', ' '],
};
```

---

## הווידג'ט

### קוד הטמעה

```html
<script
  src="https://your-domain.com/widget/chatbot.js"
  data-chatbot-id="xxx"
  data-position="bottom-right"
  data-primary-color="#3B82F6"
></script>
```

### יכולות הווידג'ט

- כפתור צף בפינת המסך
- חלון צ'אט אינטראקטיבי
- תשובות בזמן אמת (Streaming)
- Pre-chat form (איסוף פרטים)
- Quick Replies (כפתורי תשובה מהירה)
- Typing Indicator
- Sound Notification
- Offline Mode
- Persistent History (localStorage)
- תמיכה מלאה ב-RTL
- Responsive (mobile-friendly)

### Widget API

```typescript
// אתחול ידני
window.ChatbotWidget.init({
  chatbotId: 'xxx',
  position: 'bottom-right',
});

// פתיחה/סגירה
window.ChatbotWidget.open();
window.ChatbotWidget.close();

// שליחת הודעה
window.ChatbotWidget.sendMessage('שלום');

// Events
window.ChatbotWidget.on('open', () => {});
window.ChatbotWidget.on('close', () => {});
window.ChatbotWidget.on('message', (msg) => {});
window.ChatbotWidget.on('lead', (lead) => {});
```

---

## Background Jobs

### עיבוד קבצים

```typescript
// jobs/processFile.job.ts
export async function processFile(jobData: {
  knowledgeSourceId: string;
  filePath: string;
  mimeType: string;
}) {
  // 1. קריאת הקובץ מהדיסק המקומי
  // 2. חילוץ טקסט (pdf-parse / mammoth)
  // 3. Chunking
  // 4. יצירת Embeddings (OpenAI)
  // 5. שמירה ב-pgvector (Supabase)
  // 6. עדכון סטטוס ל-ready
}
```

### סריקת URL

```typescript
// jobs/scrapeUrl.job.ts
export async function scrapeUrl(jobData: {
  knowledgeSourceId: string;
  url: string;
}) {
  // 1. Fetch URL
  // 2. חילוץ תוכן (cheerio / puppeteer)
  // 3. ניקוי HTML
  // 4. Chunking
  // 5. יצירת Embeddings
  // 6. שמירה ב-pgvector
}
```

---

## שלבי מימוש

### שלב 1: תשתית בסיסית
- [ ] אתחול פרויקט Next.js 14
- [ ] הגדרת Supabase (DB + pgvector)
- [ ] הגדרת Google OAuth
- [ ] Layout בסיסי עם RTL
- [ ] הגדרת Redis/Upstash
- [ ] הגדרת Pino logger
- [ ] תיקיית uploads לקבצים

### שלב 2: דשבורד + אבטחה
- [ ] Middleware - Rate Limiting
- [ ] Input Validation (Zod)
- [ ] דף הגדרות צ'אטבוט
- [ ] דף מאגר ידע (UI בלבד)
- [ ] דף שיחות (ריק)
- [ ] Error handling גלובלי

### שלב 3: מערכת RAG
- [ ] הגדרת BullMQ/Inngest
- [ ] חיבור OpenAI Embeddings
- [ ] פונקציות pgvector
- [ ] Job: עיבוד קבצים (PDF, TXT, DOCX)
- [ ] Job: סריקת URLs
- [ ] Redis cache ל-embeddings

### שלב 4: Chat API
- [ ] API endpoint לצ'אט
- [ ] חיבור Claude API
- [ ] RAG - שליפת מידע רלוונטי
- [ ] Streaming responses
- [ ] שמירת שיחות ב-DB
- [ ] Feedback על תשובות

### שלב 5: Playground + Widget
- [ ] ממשק צ'אט לבדיקה (Playground)
- [ ] בניית הווידג'ט (Vanilla JS)
- [ ] Pre-chat form
- [ ] Quick Replies
- [ ] דף הוראות הטמעה
- [ ] ניהול API Keys

### שלב 6: Analytics + Leads
- [ ] Dashboard אנליטיקס
- [ ] גרפים (Recharts)
- [ ] ניהול לידים
- [ ] Webhook לשליחת לידים
- [ ] ייצוא ל-CSV

### שלב 7: Billing
- [ ] Stripe integration
- [ ] תכניות מחיר
- [ ] Usage tracking
- [ ] Subscription webhooks
- [ ] דף Billing

### שלב 8: Polish & Deploy
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests (Playwright)
- [ ] CI/CD (GitHub Actions)
- [ ] Sentry integration
- [ ] Documentation
- [ ] Performance optimization
- [ ] Deploy to production

---

## קבצים עיקריים

| קובץ | תיאור |
|------|-------|
| `package.json` | Dependencies |
| `src/app/layout.tsx` | Layout ראשי RTL |
| `src/app/(auth)/login/page.tsx` | התחברות |
| `src/app/api/auth/google/route.ts` | Google OAuth |
| `src/app/api/auth/callback/route.ts` | OAuth Callback |
| `src/app/(dashboard)/settings/page.tsx` | הגדרות צ'אטבוט |
| `src/app/(dashboard)/knowledge/page.tsx` | מאגר ידע |
| `src/app/(dashboard)/analytics/page.tsx` | אנליטיקס |
| `src/app/api/chat/route.ts` | Chat API |
| `src/lib/supabase.ts` | Supabase client |
| `src/lib/anthropic.ts` | חיבור Claude |
| `src/lib/embeddings.ts` | יצירת embeddings |
| `src/lib/vectors.ts` | פעולות pgvector |
| `src/lib/google-auth.ts` | Google OAuth |
| `src/lib/file-storage.ts` | אחסון קבצים מקומי |
| `src/lib/cache.ts` | Redis cache |
| `src/lib/queue.ts` | Background jobs |
| `src/lib/stripe.ts` | Stripe integration |
| `src/lib/rate-limit.ts` | Rate limiting |
| `src/middleware.ts` | Next.js middleware |
| `widget/src/widget.ts` | קוד הווידג'ט |
| `docker-compose.yml` | Local dev environment |
| `.github/workflows/ci.yml` | CI/CD |

---

## Environment Variables

```env
# .env.example

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="xxx"
SUPABASE_SERVICE_ROLE_KEY="xxx"

# Redis
REDIS_URL="redis://localhost:6379"

# Google OAuth
GOOGLE_CLIENT_ID="xxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="xxx"

# OpenAI
OPENAI_API_KEY="sk-xxx"

# Anthropic
ANTHROPIC_API_KEY="sk-ant-xxx"

# Stripe
STRIPE_SECRET_KEY="sk_xxx"
STRIPE_WEBHOOK_SECRET="whsec_xxx"
STRIPE_PRO_PRICE_ID="price_xxx"
STRIPE_ENTERPRISE_PRICE_ID="price_xxx"

# Sentry
SENTRY_DSN="https://xxx@sentry.io/xxx"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
SESSION_SECRET="your-32-char-secret"
```

---

## בדיקות

### Unit Tests
- [ ] Validators (Zod schemas)
- [ ] Utility functions
- [ ] Rate limiting logic
- [ ] Plan limits checking

### Integration Tests
- [ ] API endpoints
- [ ] Database operations
- [ ] Background jobs
- [ ] Stripe webhooks

### E2E Tests
- [ ] התחברות עם Google
- [ ] יצירת צ'אטבוט
- [ ] העלאת קובץ ובדיקת עיבוד
- [ ] צ'אט ובדיקת תשובות RAG
- [ ] הטמעת ווידג'ט
- [ ] שדרוג תכנית
