"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import {
  Loader2,
  Upload,
  Link as LinkIcon,
  Trash2,
  FileText,
  Globe,
  CheckCircle,
  XCircle,
  Clock,
  Database,
  FolderOpen,
  Plus,
  RefreshCw,
} from "lucide-react";

interface KnowledgeSource {
  id: string;
  type: string;
  name: string;
  url: string | null;
  status: string;
  error: string | null;
  createdAt: string;
}

// Polling interval in milliseconds
const POLL_INTERVAL = 3000;

export default function KnowledgePage() {
  const [sources, setSources] = useState<KnowledgeSource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isAddingUrl, setIsAddingUrl] = useState(false);
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [url, setUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Check if there are sources being processed
  const hasProcessingSources = sources.some(
    s => s.status === "processing" || s.status === "pending"
  );

  // Fetch sources
  const fetchSources = useCallback(async () => {
    try {
      const res = await fetch("/api/knowledge");
      if (res.ok) {
        const data = await res.json();
        setSources(data);
        return data;
      }
    } catch (error) {
      console.error("Error fetching sources:", error);
    }
    return null;
  }, []);

  // Start/stop polling based on processing status
  useEffect(() => {
    if (hasProcessingSources && !pollingRef.current) {
      console.log("Starting polling for status updates...");
      pollingRef.current = setInterval(fetchSources, POLL_INTERVAL);
    } else if (!hasProcessingSources && pollingRef.current) {
      console.log("Stopping polling - no more processing sources");
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [hasProcessingSources, fetchSources]);

  // Initial fetch
  useEffect(() => {
    fetchSources().finally(() => setIsLoading(false));
  }, [fetchSources]);


  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setIsUploading(true);
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      // Step 1: Upload files (quick - just saves to DB)
      const res = await fetch("/api/knowledge/upload", {
        method: "POST",
        body: formData,
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("השרת לא הגיב כראוי. נסה שוב.");
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "שגיאה בהעלאה");
      }

      // Add uploaded sources to local state - cron will process them
      const uploadedSources = Array.isArray(data) ? data : [data];
      setSources(prev => [...uploadedSources, ...prev]);

      toast({
        title: "הקבצים נוספו בהצלחה!",
        description: "המידע זמין לשימוש בצ'אט",
      });

    } catch (error: any) {
      toast({
        title: "שגיאה",
        description: error.message || "שגיאה בהעלאת הקובץ",
        variant: "destructive",
      });
      fetchSources();
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleAddUrl = async () => {
    if (!url.trim()) return;

    setIsAddingUrl(true);
    try {
      const res = await fetch("/api/knowledge/url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      // Check if response is JSON
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("השרת לא הגיב כראוי. נסה שוב.");
      }

      const data = await res.json();

      if (res.ok) {
        toast({
          title: "נוסף בהצלחה!",
          description: "הלינק נוסף למאגר הידע",
        });
        setUrl("");
        fetchSources();
      } else {
        throw new Error(data.error || "שגיאה בהוספת לינק");
      }
    } catch (error: any) {
      toast({
        title: "שגיאה",
        description: error.message || "שגיאה בהוספת לינק",
        variant: "destructive",
      });
      fetchSources(); // Refresh to see if source was added
    } finally {
      setIsAddingUrl(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/knowledge/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setSources(sources.filter((s) => s.id !== id));
        toast({
          title: "נמחק!",
          description: "המקור הוסר ממאגר הידע",
        });
      }
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "לא ניתן למחוק את המקור",
        variant: "destructive",
      });
    }
  };

  const handleRetry = async (id: string) => {
    setRetryingId(id);

    // Update local state to show processing
    setSources(sources.map(s =>
      s.id === id ? { ...s, status: "processing", error: null } : s
    ));

    try {
      const res = await fetch(`/api/knowledge/${id}/retry`, {
        method: "POST",
      });

      if (res.ok) {
        const updatedSource = await res.json();
        setSources(sources.map(s =>
          s.id === id ? updatedSource : s
        ));

        if (updatedSource.status === "ready") {
          toast({
            title: "עובד!",
            description: "המקור עובד בהצלחה",
          });
        } else {
          toast({
            title: "נכשל",
            description: updatedSource.error || "העיבוד נכשל",
            variant: "destructive",
          });
        }
      } else {
        throw new Error("Failed to retry");
      }
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "לא ניתן לעבד את המקור",
        variant: "destructive",
      });
      fetchSources(); // Refresh to get actual state
    } finally {
      setRetryingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ready":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
            <CheckCircle className="h-3.5 w-3.5" />
            מוכן
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            <XCircle className="h-3.5 w-3.5" />
            נכשל
          </span>
        );
      case "processing":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            מעבד...
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
            <Clock className="h-3.5 w-3.5" />
            ממתין
          </span>
        );
    }
  };

  const readyCount = sources.filter((s) => s.status === "ready").length;
  const processingCount = sources.filter((s) => s.status === "processing").length;
  const pendingCount = sources.filter((s) => s.status === "pending").length;
  const failedCount = sources.filter((s) => s.status === "failed").length;

  return (
    <div>
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-start sm:items-center gap-3 mb-2">
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/30 flex-shrink-0">
            <Database className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">מאגר ידע</h1>
            <p className="text-sm sm:text-base text-gray-500">הוסף מסמכים ולינקים כדי שהצ׳אטבוט יוכל לענות עליהם</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-violet-50 to-purple-100">
          <CardContent className="p-3 sm:p-5">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/30 flex-shrink-0">
                <FolderOpen className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 truncate">סה״כ מקורות</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-800">{sources.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-green-100">
          <CardContent className="p-3 sm:p-5">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 shadow-lg shadow-emerald-500/30 flex-shrink-0">
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600">מוכנים</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-800">{readyCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-100">
          <CardContent className="p-3 sm:p-5">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg shadow-blue-500/30 flex-shrink-0">
                <Loader2 className={`h-5 w-5 sm:h-6 sm:w-6 text-white ${processingCount > 0 ? "animate-spin" : ""}`} />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600">בעיבוד</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-800">{processingCount + pendingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-orange-100">
          <CardContent className="p-3 sm:p-5">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-orange-500 shadow-lg shadow-red-500/30 flex-shrink-0">
                <XCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600">נכשלו</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-800">{failedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="files" className="space-y-4 sm:space-y-6">
        <TabsList className="bg-white shadow-sm border-0 p-1 rounded-xl w-full sm:w-auto">
          <TabsTrigger
            value="files"
            className="rounded-lg flex-1 sm:flex-none text-sm sm:text-base data-[state=active]:bg-gradient-to-l data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
          >
            <Upload className="h-4 w-4 ml-1.5 sm:ml-2" />
            העלאת קבצים
          </TabsTrigger>
          <TabsTrigger
            value="urls"
            className="rounded-lg flex-1 sm:flex-none text-sm sm:text-base data-[state=active]:bg-gradient-to-l data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
          >
            <LinkIcon className="h-4 w-4 ml-1.5 sm:ml-2" />
            הוספת לינק
          </TabsTrigger>
        </TabsList>

        <TabsContent value="files">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-gray-800 text-lg sm:text-xl">העלאת קבצים</CardTitle>
              <CardDescription className="text-sm">העלה קבצי טקסט או PDF (עד 5MB)</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
              <div className="border-2 border-dashed border-blue-200 rounded-2xl p-6 sm:p-10 text-center bg-blue-50/50 hover:bg-blue-50 hover:border-blue-300 transition-all">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.md,.csv,.json,.pdf"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30 mb-3 sm:mb-4">
                    {isUploading ? (
                      <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 text-white animate-spin" />
                    ) : (
                      <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                    )}
                  </div>
                  <p className="text-sm sm:text-base text-gray-700 font-medium">
                    {isUploading ? "מעלה..." : "לחץ לבחירת קבצים או גרור לכאן"}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    PDF, TXT, MD, CSV, JSON עד 5MB
                  </p>
                </label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="urls">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-gray-800 text-lg sm:text-xl">הוספת לינק</CardTitle>
              <CardDescription className="text-sm">הוסף כתובת URL ונמשוך את התוכן אוטומטית</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/page"
                  dir="ltr"
                  className="rounded-xl border-gray-200 focus:border-blue-300 text-sm sm:text-base"
                />
                <Button
                  onClick={handleAddUrl}
                  disabled={isAddingUrl || !url.trim()}
                  className="bg-gradient-to-l from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/30 w-full sm:w-auto"
                >
                  {isAddingUrl ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Plus className="h-4 w-4 ml-2" />
                      הוסף
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Sources List */}
      <Card className="mt-4 sm:mt-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
        <div className="h-1 bg-gradient-to-l from-violet-500 to-purple-600"></div>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-gray-800 text-lg sm:text-xl">
            <Database className="h-4 w-4 sm:h-5 sm:w-5 text-violet-500" />
            מקורות ידע ({sources.length})
          </CardTitle>
          <CardDescription className="text-sm">כל המקורות שנוספו לצ׳אטבוט</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8 sm:py-12">
              <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 animate-spin text-blue-500 mb-3 sm:mb-4" />
              <p className="text-gray-500 text-sm sm:text-base">טוען מקורות...</p>
            </div>
          ) : sources.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-gray-100 mx-auto mb-3 sm:mb-4">
                <FolderOpen className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium text-sm sm:text-base">עדיין לא נוספו מקורות ידע</p>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">העלה קבצים או הוסף לינקים כדי להתחיל</p>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {sources.map((source) => (
                <div
                  key={source.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-blue-50/50 transition-colors gap-3 sm:gap-4"
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div
                      className={`flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-xl shadow-lg flex-shrink-0 ${
                        source.type === "file"
                          ? "bg-gradient-to-br from-blue-500 to-indigo-500 shadow-blue-500/20"
                          : "bg-gradient-to-br from-emerald-500 to-green-500 shadow-emerald-500/20"
                      }`}
                    >
                      {source.type === "file" ? (
                        <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      ) : (
                        <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-800 text-sm sm:text-base truncate">{source.name}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        {getStatusBadge(source.status)}
                        {source.error && (
                          <span className="text-xs text-red-500 truncate max-w-[150px] sm:max-w-none">({source.error})</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {/* Retry button for failed or pending sources */}
                    {(source.status === "failed" || source.status === "pending") && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRetry(source.id)}
                        disabled={retryingId === source.id}
                        className="rounded-xl hover:bg-blue-100 h-9 w-9 sm:h-10 sm:w-10"
                        title="נסה שוב"
                      >
                        {retryingId === source.id ? (
                          <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                        ) : (
                          <RefreshCw className="h-4 w-4 text-blue-500" />
                        )}
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(source.id)}
                      className="rounded-xl hover:bg-red-100 h-9 w-9 sm:h-10 sm:w-10"
                      title="מחק"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
