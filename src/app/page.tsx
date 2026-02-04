"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Bot,
  Zap,
  Shield,
  Code,
  ArrowLeft,
  MessageSquare,
  Sparkles,
  Check,
  Send,
  User,
  Menu,
  X,
} from "lucide-react";

// Animated Background Component
function AnimatedBackground() {
  // Generate random positions for floating elements
  const floatingElements = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      size: Math.random() * 300 + 100,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 20 + 20,
      delay: Math.random() * -20,
      opacity: Math.random() * 0.3 + 0.1,
      color: i % 3 === 0 ? "blue" : i % 3 === 1 ? "purple" : "cyan",
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient mesh background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />

      {/* Animated grid */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            animation: 'gridMove 20s linear infinite',
          }}
        />
      </div>

      {/* Floating gradient orbs */}
      {floatingElements.map((el) => (
        <div
          key={el.id}
          className="absolute rounded-full blur-3xl"
          style={{
            width: el.size,
            height: el.size,
            left: `${el.x}%`,
            top: `${el.y}%`,
            opacity: el.opacity,
            background: el.color === "blue"
              ? "radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)"
              : el.color === "purple"
              ? "radial-gradient(circle, rgba(147, 51, 234, 0.4) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(6, 182, 212, 0.4) 0%, transparent 70%)",
            animation: `float${el.id % 4} ${el.duration}s ease-in-out infinite`,
            animationDelay: `${el.delay}s`,
          }}
        />
      ))}

      {/* Animated particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-blue-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.2,
              animation: `particle ${Math.random() * 10 + 10}s linear infinite`,
              animationDelay: `${Math.random() * -10}s`,
            }}
          />
        ))}
      </div>

      {/* Glowing lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0)" />
            <stop offset="50%" stopColor="rgba(59, 130, 246, 0.5)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
          </linearGradient>
        </defs>
        <path
          d="M0,200 Q400,100 800,200 T1600,200"
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="2"
          className="animate-wave"
        />
        <path
          d="M0,400 Q400,300 800,400 T1600,400"
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="2"
          className="animate-wave"
          style={{ animationDelay: '-2s' }}
        />
      </svg>
    </div>
  );
}

// Animated chat messages
const chatMessages = [
  { role: "user", text: "שלום! מה אתם מציעים?" },
  { role: "bot", text: "שלום! אנחנו מציעים פתרונות AI מתקדמים לעסקים. איך אוכל לעזור לך היום? 😊" },
  { role: "user", text: "כמה זה עולה?" },
  { role: "bot", text: "יש לנו תוכניות החל מחינם! תוכל להתחיל עכשיו ולשדרג בכל עת שתרצה." },
  { role: "user", text: "מעולה! איך מתחילים?" },
  { role: "bot", text: "פשוט לחץ על 'התחל עכשיו', העלה את התוכן שלך, והצ'אטבוט שלך יהיה מוכן תוך דקות! 🚀" },
];

function AnimatedChat() {
  const [visibleMessages, setVisibleMessages] = useState<number>(0);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (visibleMessages < chatMessages.length) {
      setIsTyping(true);
      const typingDelay = chatMessages[visibleMessages].role === "bot" ? 1500 : 800;

      const timer = setTimeout(() => {
        setIsTyping(false);
        setVisibleMessages((prev) => prev + 1);
      }, typingDelay);

      return () => clearTimeout(timer);
    } else {
      // Reset animation after a pause
      const resetTimer = setTimeout(() => {
        setVisibleMessages(0);
      }, 3000);
      return () => clearTimeout(resetTimer);
    }
  }, [visibleMessages]);

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden w-full max-w-[320px] sm:max-w-md border border-gray-100">
      {/* Chat Header */}
      <div className="bg-gradient-to-l from-blue-500 to-blue-600 p-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
          <Bot className="h-6 w-6 text-white" />
        </div>
        <div className="text-white">
          <p className="font-semibold">הצ׳אטבוט שלך</p>
          <p className="text-xs text-blue-100">מוכן לעזור 24/7</p>
        </div>
        <div className="mr-auto flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
          <span className="text-xs text-blue-100">פעיל</span>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="p-4 h-80 overflow-y-auto bg-gray-50 space-y-3">
        {chatMessages.slice(0, visibleMessages).map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""} animate-fade-in`}
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0 ${
                msg.role === "user"
                  ? "bg-gradient-to-br from-blue-500 to-blue-600"
                  : "bg-gradient-to-br from-emerald-500 to-green-500"
              }`}
            >
              {msg.role === "user" ? (
                <User className="h-4 w-4 text-white" />
              ) : (
                <Bot className="h-4 w-4 text-white" />
              )}
            </div>
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                msg.role === "user"
                  ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                  : "bg-white shadow-sm border border-gray-100 text-gray-800"
              }`}
            >
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && visibleMessages < chatMessages.length && (
          <div className={`flex gap-2 ${chatMessages[visibleMessages].role === "user" ? "flex-row-reverse" : ""}`}>
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0 ${
                chatMessages[visibleMessages].role === "user"
                  ? "bg-gradient-to-br from-blue-500 to-blue-600"
                  : "bg-gradient-to-br from-emerald-500 to-green-500"
              }`}
            >
              {chatMessages[visibleMessages].role === "user" ? (
                <User className="h-4 w-4 text-white" />
              ) : (
                <Bot className="h-4 w-4 text-white" />
              )}
            </div>
            <div className="bg-white shadow-sm border border-gray-100 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chat Input */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-3">
          <input
            type="text"
            placeholder="הקלד הודעה..."
            className="flex-1 bg-transparent outline-none text-sm text-gray-600"
            readOnly
          />
          <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen bg-white relative">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || mobileMenuOpen ? "bg-white/95 backdrop-blur-md shadow-sm" : ""
        }`}
      >
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30">
                <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-l from-blue-600 to-blue-500 bg-clip-text text-transparent">
                ChatBot
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
                תכונות
              </a>
              <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">
                איך זה עובד
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">
                מחירים
              </a>
            </div>

            {/* Desktop buttons */}
            <div className="hidden sm:flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className="rounded-xl text-gray-600 hover:text-blue-600">
                  התחברות
                </Button>
              </Link>
              <Link href="/register">
                <Button className="rounded-xl bg-gradient-to-l from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/30">
                  הרשמה
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="sm:hidden flex h-10 w-10 items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "סגור תפריט" : "פתח תפריט"}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </nav>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <div className="flex flex-col gap-3">
                <a
                  href="#features"
                  className="text-gray-600 hover:text-blue-600 transition-colors py-2 text-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  תכונות
                </a>
                <a
                  href="#how-it-works"
                  className="text-gray-600 hover:text-blue-600 transition-colors py-2 text-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  איך זה עובד
                </a>
                <a
                  href="#pricing"
                  className="text-gray-600 hover:text-blue-600 transition-colors py-2 text-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  מחירים
                </a>
              </div>
              <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full rounded-xl text-gray-600">
                    התחברות
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full rounded-xl bg-gradient-to-l from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                    הרשמה
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <main className="relative pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Right side - Text (RTL) */}
            <div className="text-right order-1 lg:order-1">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                מבוסס בינה מלאכותית מתקדמת
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 sm:mb-6 leading-tight">
                צ׳אטבוט חכם
                <br />
                <span className="bg-gradient-to-l from-blue-600 to-blue-500 bg-clip-text text-transparent">
                  לעסק שלך
                </span>
              </h1>

              <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                צור צ׳אטבוט מותאם אישית תוך דקות. העלה מסמכים,
                הוסף לינקים, והטמע באתר שלך בשורת קוד אחת.
                הלקוחות שלך יקבלו מענה מיידי 24/7.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
                <Link href="/register" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto rounded-xl bg-gradient-to-l from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/30 text-base sm:text-lg px-6 sm:px-8 h-12 sm:h-14"
                  >
                    התחל עכשיו - חינם
                    <ArrowLeft className="h-5 w-5 mr-2" />
                  </Button>
                </Link>
                <Link href="#how-it-works" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-base sm:text-lg px-6 sm:px-8 h-12 sm:h-14"
                  >
                    איך זה עובד?
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-x-4 sm:gap-x-6 gap-y-2 text-xs sm:text-sm text-gray-500">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                  ללא כרטיס אשראי
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                  הגדרה ב-5 דקות
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                  תמיכה בעברית
                </div>
              </div>
            </div>

            {/* Left side - Animated Chat */}
            <div className="flex justify-center lg:justify-start order-2 lg:order-2 mt-8 lg:mt-0">
              <div className="relative">
                {/* Decorative elements - smaller on mobile */}
                <div className="absolute -top-4 -right-4 w-16 sm:w-24 h-16 sm:h-24 bg-blue-200 rounded-full blur-2xl opacity-50"></div>
                <div className="absolute -bottom-4 -left-4 w-20 sm:w-32 h-20 sm:h-32 bg-purple-200 rounded-full blur-2xl opacity-50"></div>

                <AnimatedChat />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 md:py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
              למה לבחור בנו?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              כל הכלים שאתה צריך ליצור צ׳אטבוט מקצועי לעסק שלך
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <div className="bg-white/80 backdrop-blur-sm p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg shadow-blue-500/30">
                <Zap className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">מהיר ופשוט</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                העלה מסמכים או הוסף לינקים, והצ׳אטבוט שלך מוכן לשימוש תוך דקות ספורות
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg shadow-emerald-500/30">
                <Shield className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">חכם ומדויק</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                מבוסס על טכנולוגיית AI מתקדמת שמבינה את התוכן שלך ועונה בצורה מדויקת
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1 sm:col-span-2 md:col-span-1">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg shadow-purple-500/30">
                <Code className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">הטמעה קלה</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                שורת קוד אחת - זה כל מה שצריך כדי להוסיף את הצ׳אטבוט לאתר שלך
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
              איך זה עובד?
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              ארבעה צעדים פשוטים להפעלת הצ׳אטבוט שלך
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {[
              { num: 1, title: "הירשם", desc: "צור חשבון חינמי תוך שניות" },
              { num: 2, title: "העלה תוכן", desc: "העלה מסמכים או הוסף לינקים" },
              { num: 3, title: "התאם אישית", desc: "הגדר את אופי הצ׳אטבוט" },
              { num: 4, title: "הטמע", desc: "הוסף שורת קוד לאתר שלך" },
            ].map((step) => (
              <div key={step.num} className="text-center group">
                <div className="relative mx-auto mb-3 sm:mb-4 md:mb-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl sm:rounded-2xl flex items-center justify-center text-lg sm:text-xl md:text-2xl font-bold shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform mx-auto">
                    {step.num}
                  </div>
                  {step.num < 4 && (
                    <div className="hidden md:block absolute top-1/2 -left-4 lg:-left-8 w-4 lg:w-8 h-0.5 bg-blue-200"></div>
                  )}
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-1 sm:mb-2">{step.title}</h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-10 md:mt-12">
            <Link href="/register">
              <Button
                size="lg"
                className="rounded-xl bg-gradient-to-l from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/30 text-base sm:text-lg px-6 sm:px-8 h-12 sm:h-auto"
              >
                התחל עכשיו
                <ArrowLeft className="h-5 w-5 mr-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="pricing" className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cGF0aCBkPSJNLTEwIDMwaDYwdjJoLTYweiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNhKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')] opacity-50"></div>
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                מוכן להתחיל?
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto">
                הצטרף לאלפי עסקים שכבר משתמשים בצ׳אטבוט שלנו לשיפור שירות הלקוחות
              </p>
              <Link href="/register">
                <Button
                  size="lg"
                  className="rounded-xl bg-white text-blue-600 hover:bg-blue-50 shadow-lg text-base sm:text-lg px-6 sm:px-8 h-12 sm:h-14"
                >
                  התחל עכשיו - חינם
                  <ArrowLeft className="h-5 w-5 mr-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-10 md:py-12 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-4 sm:gap-6 md:flex-row md:justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30">
                <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-l from-blue-600 to-blue-500 bg-clip-text text-transparent">
                ChatBot
              </span>
            </div>

            <div className="flex items-center gap-4 sm:gap-6 text-sm sm:text-base text-gray-500">
              <a href="#" className="hover:text-blue-600 transition-colors">תנאי שימוש</a>
              <a href="#" className="hover:text-blue-600 transition-colors">פרטיות</a>
              <a href="#" className="hover:text-blue-600 transition-colors">צור קשר</a>
            </div>

            <p className="text-gray-400 text-xs sm:text-sm">
              © 2024 ChatBot. כל הזכויות שמורות.
            </p>
          </div>
        </div>
      </footer>

      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }

        @keyframes gridMove {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(60px, 60px);
          }
        }

        @keyframes float0 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(30px, -30px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(40px, 10px) scale(1.05);
          }
        }

        @keyframes float1 {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          33% {
            transform: translate(-40px, 30px) rotate(5deg);
          }
          66% {
            transform: translate(30px, -40px) rotate(-5deg);
          }
        }

        @keyframes float2 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(50px, 50px) scale(1.2);
          }
        }

        @keyframes float3 {
          0%, 100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(-30px, 40px);
          }
          50% {
            transform: translate(40px, -30px);
          }
          75% {
            transform: translate(-20px, -20px);
          }
        }

        @keyframes particle {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-100vh) translateX(50px);
            opacity: 0;
          }
        }

        @keyframes wave {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-wave {
          animation: wave 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
