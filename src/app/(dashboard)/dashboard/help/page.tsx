"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import {
  HelpCircle,
  Copy,
  Check,
  Code,
  FileCode,
  Globe,
  Braces,
  Terminal,
  Smartphone,
  Layout,
} from "lucide-react";

export default function HelpPage() {
  const [copied, setCopied] = useState<string | null>(null);
  const [chatbotId, setChatbotId] = useState<string>("");
  const [baseUrl, setBaseUrl] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    // Fetch chatbot ID
    fetch("/api/chatbot")
      .then((res) => res.json())
      .then((data) => {
        if (data.id) {
          setChatbotId(data.id);
        }
      })
      .catch(console.error);

    // Get base URL
    setBaseUrl(window.location.origin);
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    toast({
      title: "הועתק!",
      description: "הקוד הועתק ללוח",
    });
    setTimeout(() => setCopied(null), 2000);
  };

  const CodeBlock = ({ code, language, id }: { code: string; language: string; id: string }) => (
    <div className="relative">
      <div className="absolute top-3 left-3 flex items-center gap-2">
        <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">{language}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => copyToClipboard(code, id)}
          className="h-8 px-2 text-gray-400 hover:text-white hover:bg-gray-700"
        >
          {copied === id ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
      <pre className="bg-gray-900 text-gray-100 p-4 pt-12 rounded-xl overflow-x-auto text-sm" dir="ltr">
        <code>{code}</code>
      </pre>
    </div>
  );

  const htmlCode = `<!-- הוסף לפני תג הסגירה של body -->
<script>
  window.chatbotConfig = {
    chatbotId: "${chatbotId || "YOUR_CHATBOT_ID"}",
    apiUrl: "${baseUrl}"
  };
</script>
<script src="${baseUrl}/widget/chatbot.js" defer></script>`;

  const reactCode = `// components/Chatbot.tsx
"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    chatbotConfig?: {
      chatbotId: string;
      apiUrl: string;
    };
  }
}

export function Chatbot() {
  useEffect(() => {
    // Configure chatbot
    window.chatbotConfig = {
      chatbotId: "${chatbotId || "YOUR_CHATBOT_ID"}",
      apiUrl: "${baseUrl}"
    };

    // Load widget script
    const script = document.createElement("script");
    script.src = "${baseUrl}/widget/chatbot.js";
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup
      const widget = document.getElementById("chatbot-widget");
      if (widget) widget.remove();
      script.remove();
    };
  }, []);

  return null;
}

// Usage in your app:
// import { Chatbot } from "./components/Chatbot";
// <Chatbot />`;

  const nextjsCode = `// app/layout.tsx או pages/_app.tsx
import Script from "next/script";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        {children}

        {/* Chatbot Widget */}
        <Script id="chatbot-config" strategy="beforeInteractive">
          {\`
            window.chatbotConfig = {
              chatbotId: "${chatbotId || "YOUR_CHATBOT_ID"}",
              apiUrl: "${baseUrl}"
            };
          \`}
        </Script>
        <Script
          src="${baseUrl}/widget/chatbot.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}`;

  const vueCode = `<!-- App.vue או main component -->
<template>
  <div id="app">
    <!-- Your app content -->
  </div>
</template>

<script>
export default {
  name: "App",
  mounted() {
    // Configure chatbot
    window.chatbotConfig = {
      chatbotId: "${chatbotId || "YOUR_CHATBOT_ID"}",
      apiUrl: "${baseUrl}"
    };

    // Load widget script
    const script = document.createElement("script");
    script.src = "${baseUrl}/widget/chatbot.js";
    script.defer = true;
    document.body.appendChild(script);
  },
  beforeUnmount() {
    // Cleanup
    const widget = document.getElementById("chatbot-widget");
    if (widget) widget.remove();
  }
};
</script>`;

  const angularCode = `// app.component.ts
import { Component, OnInit, OnDestroy } from "@angular/core";

declare global {
  interface Window {
    chatbotConfig?: {
      chatbotId: string;
      apiUrl: string;
    };
  }
}

@Component({
  selector: "app-root",
  template: \`<router-outlet></router-outlet>\`
})
export class AppComponent implements OnInit, OnDestroy {
  private script: HTMLScriptElement | null = null;

  ngOnInit() {
    // Configure chatbot
    window.chatbotConfig = {
      chatbotId: "${chatbotId || "YOUR_CHATBOT_ID"}",
      apiUrl: "${baseUrl}"
    };

    // Load widget script
    this.script = document.createElement("script");
    this.script.src = "${baseUrl}/widget/chatbot.js";
    this.script.defer = true;
    document.body.appendChild(this.script);
  }

  ngOnDestroy() {
    // Cleanup
    const widget = document.getElementById("chatbot-widget");
    if (widget) widget.remove();
    if (this.script) this.script.remove();
  }
}`;

  const wordpressCode = `<?php
// הוסף לקובץ functions.php של התבנית שלך

function add_chatbot_widget() {
    ?>
    <script>
        window.chatbotConfig = {
            chatbotId: "${chatbotId || "YOUR_CHATBOT_ID"}",
            apiUrl: "${baseUrl}"
        };
    </script>
    <script src="${baseUrl}/widget/chatbot.js" defer></script>
    <?php
}
add_action('wp_footer', 'add_chatbot_widget');
?>

<!-- או הוסף ישירות לתבנית footer.php לפני </body> -->`;

  const shopifyCode = `<!-- הוסף ל-theme.liquid לפני תג הסגירה של </body> -->
<!-- או דרך Online Store > Themes > Edit Code > theme.liquid -->

<script>
  window.chatbotConfig = {
    chatbotId: "${chatbotId || "YOUR_CHATBOT_ID"}",
    apiUrl: "${baseUrl}"
  };
</script>
<script src="${baseUrl}/widget/chatbot.js" defer></script>`;

  const wixCode = `// Wix - הוסף דרך Dev Mode
// Site > Add Site Code > Body End

<script>
  window.chatbotConfig = {
    chatbotId: "${chatbotId || "YOUR_CHATBOT_ID"}",
    apiUrl: "${baseUrl}"
  };
</script>
<script src="${baseUrl}/widget/chatbot.js" defer></script>`;

  const phpCode = `<!-- הוסף לקובץ PHP שלך לפני </body> -->
<?php
\$chatbotId = "${chatbotId || "YOUR_CHATBOT_ID"}";
\$apiUrl = "${baseUrl}";
?>

<script>
    window.chatbotConfig = {
        chatbotId: "<?php echo \$chatbotId; ?>",
        apiUrl: "<?php echo \$apiUrl; ?>"
    };
</script>
<script src="<?php echo \$apiUrl; ?>/widget/chatbot.js" defer></script>`;

  const pythonFlaskCode = `# Flask - templates/base.html
<!DOCTYPE html>
<html>
<head>
    <title>{% block title %}{% endblock %}</title>
</head>
<body>
    {% block content %}{% endblock %}

    <!-- Chatbot Widget -->
    <script>
        window.chatbotConfig = {
            chatbotId: "${chatbotId || "YOUR_CHATBOT_ID"}",
            apiUrl: "${baseUrl}"
        };
    </script>
    <script src="${baseUrl}/widget/chatbot.js" defer></script>
</body>
</html>`;

  const djangoCode = `<!-- Django - base.html template -->
<!DOCTYPE html>
<html>
<head>
    <title>{% block title %}{% endblock %}</title>
</head>
<body>
    {% block content %}{% endblock %}

    <!-- Chatbot Widget -->
    <script>
        window.chatbotConfig = {
            chatbotId: "${chatbotId || "YOUR_CHATBOT_ID"}",
            apiUrl: "${baseUrl}"
        };
    </script>
    <script src="${baseUrl}/widget/chatbot.js" defer></script>
</body>
</html>`;

  const rubyRailsCode = `<%# Rails - app/views/layouts/application.html.erb %>
<!DOCTYPE html>
<html>
<head>
    <title><%= content_for?(:title) ? yield(:title) : "App" %></title>
    <%= csrf_meta_tags %>
    <%= csp_meta_tag %>
    <%= stylesheet_link_tag "application" %>
</head>
<body>
    <%= yield %>

    <!-- Chatbot Widget -->
    <script>
        window.chatbotConfig = {
            chatbotId: "${chatbotId || "YOUR_CHATBOT_ID"}",
            apiUrl: "${baseUrl}"
        };
    </script>
    <script src="${baseUrl}/widget/chatbot.js" defer></script>
</body>
</html>`;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/30">
            <HelpCircle className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">מדריך הטמעה</h1>
            <p className="text-gray-500">איך להטמיע את הצ׳אטבוט באתר שלך</p>
          </div>
        </div>
      </div>

      {/* Chatbot ID Card */}
      <Card className="mb-8 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-100">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">מזהה הצ׳אטבוט שלך</p>
              <p className="text-lg font-mono font-bold text-gray-800" dir="ltr">
                {chatbotId || "טוען..."}
              </p>
            </div>
            <Button
              onClick={() => copyToClipboard(chatbotId, "chatbot-id")}
              className="bg-gradient-to-l from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/30"
            >
              {copied === "chatbot-id" ? (
                <Check className="h-4 w-4 ml-2" />
              ) : (
                <Copy className="h-4 w-4 ml-2" />
              )}
              העתק
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Start */}
      <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
        <div className="h-1 bg-gradient-to-l from-emerald-500 to-green-500"></div>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Globe className="h-5 w-5 text-emerald-500" />
            התחלה מהירה - HTML
          </CardTitle>
          <CardDescription>
            הדרך הפשוטה ביותר להוסיף את הצ׳אטבוט לאתר שלך
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CodeBlock code={htmlCode} language="HTML" id="html" />
        </CardContent>
      </Card>

      {/* Framework Guides */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
        <div className="h-1 bg-gradient-to-l from-purple-500 to-pink-500"></div>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Code className="h-5 w-5 text-purple-500" />
            הטמעה לפי פלטפורמה
          </CardTitle>
          <CardDescription>
            בחר את הפלטפורמה או שפת התכנות שלך
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="react" className="space-y-6">
            <TabsList className="flex flex-wrap gap-2 bg-gray-100 p-2 rounded-xl h-auto">
              <TabsTrigger value="react" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Braces className="h-4 w-4 ml-2" />
                React
              </TabsTrigger>
              <TabsTrigger value="nextjs" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <FileCode className="h-4 w-4 ml-2" />
                Next.js
              </TabsTrigger>
              <TabsTrigger value="vue" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Layout className="h-4 w-4 ml-2" />
                Vue.js
              </TabsTrigger>
              <TabsTrigger value="angular" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Terminal className="h-4 w-4 ml-2" />
                Angular
              </TabsTrigger>
              <TabsTrigger value="wordpress" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Globe className="h-4 w-4 ml-2" />
                WordPress
              </TabsTrigger>
              <TabsTrigger value="shopify" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Smartphone className="h-4 w-4 ml-2" />
                Shopify
              </TabsTrigger>
              <TabsTrigger value="wix" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Layout className="h-4 w-4 ml-2" />
                Wix
              </TabsTrigger>
              <TabsTrigger value="php" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <FileCode className="h-4 w-4 ml-2" />
                PHP
              </TabsTrigger>
              <TabsTrigger value="python" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Terminal className="h-4 w-4 ml-2" />
                Python
              </TabsTrigger>
              <TabsTrigger value="ruby" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Braces className="h-4 w-4 ml-2" />
                Ruby
              </TabsTrigger>
            </TabsList>

            <TabsContent value="react">
              <CodeBlock code={reactCode} language="TypeScript / React" id="react" />
            </TabsContent>

            <TabsContent value="nextjs">
              <CodeBlock code={nextjsCode} language="TypeScript / Next.js" id="nextjs" />
            </TabsContent>

            <TabsContent value="vue">
              <CodeBlock code={vueCode} language="Vue.js" id="vue" />
            </TabsContent>

            <TabsContent value="angular">
              <CodeBlock code={angularCode} language="TypeScript / Angular" id="angular" />
            </TabsContent>

            <TabsContent value="wordpress">
              <CodeBlock code={wordpressCode} language="PHP / WordPress" id="wordpress" />
            </TabsContent>

            <TabsContent value="shopify">
              <CodeBlock code={shopifyCode} language="Liquid / Shopify" id="shopify" />
            </TabsContent>

            <TabsContent value="wix">
              <CodeBlock code={wixCode} language="Wix Velo" id="wix" />
            </TabsContent>

            <TabsContent value="php">
              <CodeBlock code={phpCode} language="PHP" id="php" />
            </TabsContent>

            <TabsContent value="python">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800">Flask</h3>
                <CodeBlock code={pythonFlaskCode} language="Python / Flask" id="flask" />
                <h3 className="font-semibold text-gray-800 mt-6">Django</h3>
                <CodeBlock code={djangoCode} language="Python / Django" id="django" />
              </div>
            </TabsContent>

            <TabsContent value="ruby">
              <CodeBlock code={rubyRailsCode} language="Ruby on Rails" id="rails" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="mt-8 border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <HelpCircle className="h-5 w-5 text-amber-500" />
            טיפים חשובים
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-2 w-2 rounded-full bg-amber-500 flex-shrink-0"></span>
              <span>הקפד להוסיף את הקוד <strong>לפני</strong> תג הסגירה של <code className="bg-amber-200 px-1 rounded">&lt;/body&gt;</code></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-2 w-2 rounded-full bg-amber-500 flex-shrink-0"></span>
              <span>הצ׳אטבוט יופיע בפינה הימנית התחתונה של האתר</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-2 w-2 rounded-full bg-amber-500 flex-shrink-0"></span>
              <span>וודא שהדומיין שלך מורשה בהגדרות הצ׳אטבוט</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-2 w-2 rounded-full bg-amber-500 flex-shrink-0"></span>
              <span>לבדיקה מקומית, השתמש ב-<code className="bg-amber-200 px-1 rounded">localhost</code></span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
