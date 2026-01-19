import { useEffect, useState } from "react";
import {
  Sparkles,
  ArrowRight,
  Send,
  Lightbulb,
  FileText,
  Download,
  Rocket,
  Target,
  Users,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Zap,
  Edit3,
  BarChart,
  Award,
  Globe,
  Heart,
  Shield,
  Eye,
  Home,
  LayoutDashboard
} from "lucide-react";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

import { API_BASE_URL } from "../../config/apiConfig";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function FounderAIWalkthrough() {
  const [stage, setStage] = useState("chat");
  const [activeTab, setActiveTab] = useState("overview");
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I've reviewed your onboarding responses. Let's refine your business idea together. Tell me about your business in your own words - what are you building and why?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/conversations`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });

        const data = await res.json();

        if (data.success && Array.isArray(data.data)) {
          // Format messages
          const formattedMessages = data.data.map((msg) => ({
            role: msg.role === "ai" ? "assistant" : "user",
            content: msg.content
          }));

          console.log(formattedMessages);
          setMessages(formattedMessages);

          // ✅ also set the ready flag
          setReady(data.ready || false);
        }
      } catch (err) {
        console.error("Failed to fetch messages", err);
      }
    };

    fetchMessages();
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch(`${API_BASE_URL}/conversations/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ message: input })
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to get AI response");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.data.content }
      ]);

      // ✅ backend is the source of truth
      if (typeof data.ready === "boolean") {
        setReady(data.ready);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Oops! Something went wrong. Please try again."
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const generateBusinessModel = async () => {
    setStage("generating");

    try {
      const res = await fetch(`${API_BASE_URL}/business/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ userId: localStorage.getItem("userId") })
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to generate");
      console.log(data);
      setAiResult(data.data);
      setStage("result");
    } catch (err) {
      console.error(err);
      setStage("chat");
      toast.error("Failed to generate business model. Try again.");
    }
  };

  const viewDocument = () => {
    setStage("document");
  };

  const startOver = () => {
    setStage("chat");
    setMessages([
      {
        role: "assistant",
        content:
          "Hi! I've reviewed your onboarding responses. Let's refine your business idea together. Tell me about your business in your own words - what are you building and why?"
      }
    ]);
    setInput("");
    setAiResult(null);
    setReady(false); // ✅ important
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {stage === "chat" && (
          <ChatStage
            messages={messages}
            input={input}
            setInput={setInput}
            sendMessage={sendMessage}
            handleKeyPress={handleKeyPress}
            onGenerate={generateBusinessModel}
            canGenerate={ready}
            isTyping={isTyping}
          />
        )}

        {stage === "generating" && <GeneratingStage />}

        {stage === "result" && aiResult && (
          <ResultStage aiResult={aiResult} onViewDocument={viewDocument} />
        )}

        {stage === "document" && aiResult && (
          <DocumentStage aiResult={aiResult} onStartOver={startOver} />
        )}
      </div>
    </div>
  );
}

function ChatStage({
  messages,
  input,
  setInput,
  sendMessage,
  handleKeyPress,
  onGenerate,
  canGenerate,
  isTyping
}) {
  return (
    <div className="flex flex-col h-[85vh]">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Abby</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Let's refine your business idea together
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} role={msg.role} content={msg.content} />
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-[40%] rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm bg-gradient-to-br from-slate-100 to-slate-50 text-slate-800 border border-slate-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
              <span className="text-xs text-indigo-600">
                AI Assistant is typing...
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-slate-200 bg-slate-50">
        <div className="flex gap-3 mb-3">
          <textarea
            rows={3}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your response... (Press Enter to send, Shift+Enter for new line)"
            className="flex-1 rounded-lg border-2 border-slate-300 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="h-12 w-12 flex items-center justify-center rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed self-end"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {canGenerate && (
          <button
            onClick={onGenerate}
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg py-3 px-6 font-semibold hover:from-indigo-700 hover:to-blue-700 transition flex items-center justify-center gap-2 shadow-lg"
          >
            <Zap className="w-5 h-5" />
            Generate Business Model
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}

function MessageBubble({ role, content }) {
  const isAI = role === "assistant";

  return (
    <div className={`flex ${isAI ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm ${
          isAI
            ? "bg-gradient-to-br from-slate-100 to-slate-50 text-slate-800 border border-slate-200"
            : "bg-gradient-to-br from-indigo-600 to-indigo-700 text-white"
        }`}
      >
        {isAI && (
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-semibold text-indigo-600">
              AI Assistant
            </span>
          </div>
        )}
        <p className="whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
}

function GeneratingStage() {
  return (
    <div className="p-8 md:p-12 flex flex-col items-center justify-center min-h-[500px]">
      <div className="relative mb-6">
        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center animate-pulse">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 animate-ping opacity-20"></div>
      </div>

      <h2 className="text-2xl font-bold text-slate-900 mb-3">
        Generating Your Business Model
      </h2>
      <p className="text-slate-600 text-center max-w-md mb-8">
        Our AI is analyzing your idea and creating a comprehensive business
        model...
      </p>

      <div className="space-y-3 w-full max-w-md">
        <LoadingStep text="Analyzing market opportunity" delay={0} />
        <LoadingStep text="Defining value proposition" delay={400} />
        <LoadingStep text="Identifying revenue streams" delay={800} />
        <LoadingStep text="Mapping go-to-market strategy" delay={1200} />
      </div>
    </div>
  );
}

function LoadingStep({ text, delay }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg bg-slate-50 transition-all duration-500 ${
        visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
      }`}
    >
      <div className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></div>
      <span className="text-sm text-slate-700">{text}</span>
    </div>
  );
}

function ResultStage({ aiResult, onViewDocument }) {
  const { businessModel, marketingPlan, summaryDocument } = aiResult || {};

  const positioning = marketingPlan?.positioning;
  const targetAudience = marketingPlan?.targetAudience;
  const launchStrategy = marketingPlan?.launchStrategy;

  const [activeTab, setActiveTab] = useState("overview");
  console.log(aiResult);

  const downloadDocx = async (content, filename) => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: content.split("\n").map(
            (line) =>
              new Paragraph({
                children: [new TextRun(line)]
              })
          )
        }
      ]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, filename.endsWith(".docx") ? filename : `${filename}.docx`);
  };

  const downloadBusinessModel = () => {
    if (!businessModel) return;

    const content = `
BUSINESS MODEL
==============

Problem Statement
-----------------
${businessModel.problemStatement || ""}

Solution
--------
${businessModel.solution || ""}

Target Market
-------------
${businessModel.targetMarket || ""}

Value Proposition
-----------------
${businessModel.valueProposition || ""}

Revenue Model
-------------
${businessModel.revenueModel || ""}

Key Metrics
-----------
${businessModel.keyMetrics || ""}

Competitive Advantage
---------------------
${businessModel.competitiveAdvantage || ""}

Go-To-Market Strategy
---------------------
${businessModel.goToMarket || ""}
`;

    downloadDocx(content, "business-model.docx");
  };

  const downloadMarketingPlan = () => {
    if (!marketingPlan) return;

    const content = `
MARKETING PLAN
==============

Target Audience
---------------
${marketingPlan.targetAudience || ""}

Positioning
-----------
${marketingPlan.positioning || ""}

Channels
--------
${marketingPlan.channels || ""}

Launch Strategy
---------------
${marketingPlan.launchStrategy || ""}

Metrics
-------
${marketingPlan.metrics || ""}
`;

    downloadDocx(content, "marketing-plan.docx");
  };

  const downloadSummary = () => {
    if (!summaryDocument?.content) return;
    downloadDocx(summaryDocument.content, "startup-summary.md");
  };

  const downloadAll = () => {
    downloadDocx(
      `${summaryDocument?.content || ""}

${"=".repeat(80)}

${businessModel?.problemStatement || ""}

${"=".repeat(80)}

${marketingPlan?.launchStrategy || ""}`,
      "complete-startup-strategy.docx"
    );
  };

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Left Section: Icon + Title */}
            <div className="flex items-center gap-4 flex-wrap">
              {/* Icon */}
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>

              {/* Title & Subtitle */}
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold">AI Strategy Overview</h1>
                <p className="text-slate-600 flex items-center gap-2 text-sm">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Business, marketing & launch breakdown
                </p>
              </div>
            </div>

            {/* Right Section: Dashboard Link + Download */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Dashboard Link */}
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-2 text-indigo-600 font-semibold px-4 py-2 rounded-full hover:bg-indigo-50 hover:text-indigo-800 transition"
              >
                <LayoutDashboard className="w-5 h-5" />
                Go To Dashboard
              </button>

              {/* Download All */}
              <button
                onClick={downloadAll}
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-indigo-700 transition"
              >
                <Download className="w-5 h-5" />
                Download All
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl mb-6 overflow-hidden">
          <div className="flex border-b border-slate-200 overflow-x-auto">
            <Tab
              label="Overview"
              icon={Eye}
              active={activeTab === "overview"}
              onClick={() => setActiveTab("overview")}
            />
            <Tab
              label="Business Model"
              icon={Target}
              active={activeTab === "business"}
              onClick={() => setActiveTab("business")}
            />
            <Tab
              label="Marketing Plan"
              icon={TrendingUp}
              active={activeTab === "marketing"}
              onClick={() => setActiveTab("marketing")}
            />
            <Tab
              label="Summary"
              icon={FileText}
              active={activeTab === "summary"}
              onClick={() => setActiveTab("summary")}
            />
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          {activeTab === "overview" && (
            <OverviewTab
              onBusiness={downloadBusinessModel}
              onMarketing={downloadMarketingPlan}
              onSummary={downloadSummary}
            />
          )}

          {activeTab === "business" && (
            <BusinessModelTab
              data={businessModel}
              onDownload={downloadBusinessModel}
            />
          )}

          {activeTab === "marketing" && (
            <MarketingPlanTab
              data={marketingPlan}
              onDownload={downloadMarketingPlan}
            />
          )}

          {activeTab === "summary" && (
            <SummaryTab data={summaryDocument} onDownload={downloadSummary} />
          )}
        </div>
      </div>
    </div>
  );
}

function Tab({ label, icon: Icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-4 font-semibold transition ${
        active
          ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
          : "text-slate-600 hover:text-slate-900"
      }`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );
}

function OverviewTab({ onBusiness, onMarketing, onSummary }) {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <OverviewCard title="Business Model" icon={Target} onClick={onBusiness} />
      <OverviewCard
        title="Marketing Plan"
        icon={TrendingUp}
        onClick={onMarketing}
      />
      <OverviewCard title="Full Summary" icon={FileText} onClick={onSummary} />
    </div>
  );
}

function OverviewCard({ title, icon: Icon, onClick }) {
  return (
    <div className="border-2 border-slate-200 rounded-xl p-6 hover:shadow-lg transition">
      <Icon className="w-8 h-8 text-indigo-600 mb-4" />
      <h3 className="font-bold mb-2">{title}</h3>
      <button
        onClick={onClick}
        className="text-indigo-600 font-semibold flex items-center gap-2 text-sm"
      >
        <Download className="w-4 h-4" />
        Download
      </button>
    </div>
  );
}

function BusinessModelTab({ data, onDownload }) {
  if (!data) return null;

  const sections = [
    ["Problem Statement", data.problemStatement, Target],
    ["Solution", data.solution, Rocket],
    ["Target Market", data.targetMarket, Users],
    ["Value Proposition", data.valueProposition, Sparkles],
    ["Revenue Model", data.revenueModel, DollarSign],
    ["Key Metrics", data.keyMetrics, BarChart],
    ["Competitive Advantage", data.competitiveAdvantage, Award],
    ["Go-To-Market Strategy", data.goToMarket, TrendingUp]
  ];

  return (
    <div className="space-y-4">
      <Header title="Business Model" onDownload={onDownload} />
      {sections.map(([title, content, Icon]) => (
        <Card key={title} title={title} content={content} icon={Icon} />
      ))}
    </div>
  );
}

function MarketingPlanTab({ data, onDownload }) {
  if (!data) return null;

  const sections = [
    ["Target Audience", data.targetAudience, Users],
    ["Positioning", data.positioning, Award],
    ["Channels", data.channels, TrendingUp],
    ["Launch Strategy", data.launchStrategy, Rocket],
    ["Metrics", data.metrics, BarChart]
  ];

  return (
    <div className="space-y-4">
      <Header title="Marketing Plan" onDownload={onDownload} />
      {sections.map(([title, content, Icon]) => (
        <Card key={title} title={title} content={content} icon={Icon} />
      ))}
    </div>
  );
}

function SummaryTab({ data, onDownload }) {
  if (!data?.content) return null;

  return (
    <div>
      <Header title="Startup Summary" onDownload={onDownload} />
      <pre className="whitespace-pre-wrap text-slate-700 bg-slate-50 p-6 rounded-xl border">
        {data.content}
      </pre>
    </div>
  );
}

function Header({ title, onDownload }) {
  return (
    <div className="flex justify-between mb-6">
      <h2 className="text-2xl font-bold">{title}</h2>
      <button
        onClick={onDownload}
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
      >
        <Download className="w-4 h-4" />
        Download
      </button>
    </div>
  );
}

function Card({ title, content, icon: Icon }) {
  if (!content) return null;

  return (
    <div className="border border-slate-200 rounded-xl p-6 bg-white hover:shadow-md transition">
      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600">
          <Icon className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-slate-800">{title}</h3>
      </div>

      <div className="prose prose-slate max-w-none prose-headings:font-semibold prose-h2:text-base prose-h3:text-sm prose-ul:pl-5 prose-li:marker:text-indigo-500">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>
    </div>
  );
}

function DocumentStage({ aiResult, onStartOver }) {
  const { businessModel } = aiResult;

  const handleExport = () => {
    alert("PDF export functionality would be implemented here");
  };

  const handleDashboard = () => {
    navigate;
  };

  return (
    <div className="p-8 md:p-12 max-h-[85vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl blur-md opacity-40"></div>
            <div className="relative h-14 w-14 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
              <FileText className="w-7 h-7 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Business Model Canvas
            </h1>
            <p className="text-slate-600 mt-1 flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-500" />
              Complete strategic documentation
            </p>
          </div>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg text-sm font-semibold transform hover:scale-105"
        >
          <Download className="w-4 h-4" />
          Export PDF
        </button>
      </div>

      <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-10 border-2 border-slate-200 shadow-inner space-y-8">
        <EnhancedDocumentSection
          title="Executive Summary"
          content="This business model addresses critical market needs through innovative solutions. By providing comprehensive insights and strategic planning, we enable businesses to make informed decisions and achieve sustainable growth."
          icon={Sparkles}
          gradient="from-amber-500 to-orange-500"
        />

        <EnhancedDocumentSection
          title="Problem Statement"
          content={businessModel.problemStatement}
          icon={Target}
          gradient="from-yellow-500 to-pink-500"
        />

        <EnhancedDocumentSection
          title="Solution Overview"
          content={businessModel.solution}
          icon={Rocket}
          gradient="from-blue-500 to-indigo-500"
        />

        <EnhancedDocumentSection
          title="Target Market"
          content={businessModel.targetMarket}
          icon={Users}
          gradient="from-yellow-500 to-violet-500"
        />

        <EnhancedDocumentSection
          title="Value Proposition"
          content={businessModel.valueProposition}
          icon={Heart}
          gradient="from-pink-500 to-rose-500"
        />

        <EnhancedDocumentSection
          title="Revenue Model"
          content={businessModel.revenueModel}
          icon={DollarSign}
          gradient="from-emerald-500 to-teal-500"
        />

        <EnhancedDocumentSection
          title="Key Metrics"
          content={businessModel.keyMetrics}
          icon={BarChart}
          gradient="from-indigo-500 to-yellow-500"
        />

        <EnhancedDocumentSection
          title="Competitive Advantage"
          content={businessModel.competitiveAdvantage}
          icon={Shield}
          gradient="from-cyan-500 to-blue-500"
        />

        <EnhancedDocumentSection
          title="Go-to-Market Strategy"
          content={businessModel.goToMarket}
          icon={TrendingUp}
          gradient="from-orange-500 to-yellow-500"
        />

        <div className="pt-8 border-t-2 border-slate-300">
          <p className="text-xs text-slate-500 text-center font-medium">
            Generated by AI Business Model Generator •{" "}
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric"
            })}
          </p>
        </div>
      </div>

      <div className="flex gap-4 mt-8">
        <button
          onClick={onStartOver}
          className="flex-1 bg-white border-2 border-slate-300 text-slate-700 rounded-xl py-4 px-6 font-semibold hover:bg-slate-50 hover:border-slate-400 transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md transform hover:scale-[1.02]"
        >
          <ArrowRight className="w-5 h-5 rotate-180" />
          Start Over
        </button>
        <button
          onClick={handleDashboard}
          className="flex-1 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 text-white rounded-xl py-4 px-6 font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
        >
          Continue to Dashboard
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function EnhancedDocumentSection({ title, content, icon: Icon, gradient }) {
  return (
    <div className="group">
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`h-10 w-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      </div>
      <div className="pl-[52px]">
        <p className="text-slate-700 leading-relaxed text-[15px]">{content}</p>
      </div>
    </div>
  );
}
