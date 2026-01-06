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
  Shield
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config/apiConfig";

export default function FounderAIWalkthrough() {
  const [stage, setStage] = useState("chat"); // chat, generating, result, document
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I've reviewed your onboarding responses. Let's refine your business idea together. Tell me about your business in your own words - what are you building and why?"
    }
  ]);
  const [input, setInput] = useState("");
  const [finalIdea, setFinalIdea] = useState("");
  const [businessModel, setBusinessModel] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

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
          // Map backend roles to frontend roles
          const formattedMessages = data.data.map((msg) => ({
            role: msg.role === "ai" ? "assistant" : "user", // map 'ai' -> 'assistant'
            content: msg.content
          }));
          console.log(formattedMessages);
          setMessages(formattedMessages);
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
    setIsTyping(true); // Start typing indicator

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

      // Add AI response
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.data.content }
      ]);
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
      setIsTyping(false); // Stop typing indicator
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const generateBusinessModel = async () => {
    const userMessages = messages
      .filter((m) => m.role === "user")
      .map((m) => m.content)
      .join(" ");

    setFinalIdea(userMessages);
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

      setBusinessModel(data.data); // <-- THIS is what your DocumentStage and ResultStage need
      setStage("result");
    } catch (err) {
      console.error(err);
      setStage("chat");
      alert("Failed to generate business model. Try again.");
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
    setFinalIdea("");
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
            canGenerate={messages.filter((m) => m.role === "user").length >= 2}
            isTyping={isTyping}
          />
        )}

        {stage === "generating" && <GeneratingStage />}

        {stage === "result" && (
          <ResultStage
            businessModel={businessModel}
            onViewDocument={viewDocument}
          />
        )}

        {stage === "document" && (
          <DocumentStage
            businessModel={businessModel}
            onStartOver={startOver}
          />
        )}
      </div>
    </div>
  );
}

/* ---------- Chat Stage ---------- */
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
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Abby
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Let's refine your business idea together
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} role={msg.role} content={msg.content} />
        ))}

        {isTyping && (
          <div className="flex justify-start animate-fadeIn">
            <div className="max-w-[40%] rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm bg-gradient-to-br from-slate-100 to-slate-50 text-slate-800 border border-slate-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
              <span className="text-xs text-indigo-600">
                AI Assistant is typing...
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
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

        {/* Generate Button */}
        {canGenerate && (
          <button
            onClick={onGenerate}
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg py-3 px-6 font-semibold hover:from-indigo-700 hover:to-blue-700 transition flex items-center justify-center gap-2 shadow-lg animate-pulse"
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
    <div
      className={`flex ${
        isAI ? "justify-start" : "justify-end"
      } animate-fadeIn`}
    >
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

/* ---------- Generating Stage ---------- */
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

  useState(() => {
    setTimeout(() => setVisible(true), delay);
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


function ResultStage({ businessModel, onViewDocument }) {
  if (!businessModel) return null;

  const sections = [
    {
      title: "Problem Statement",
      value: businessModel.problemStatement,
      icon: Target,
      color: "blue",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Solution",
      value: businessModel.solution,
      icon: Rocket,
      color: "blue",
      gradient: "from-indigo-500 to-blue-500"
    },
    {
      title: "Target Market",
      value: businessModel.targetMarket,
      icon: Users,
      color: "indigo",
      gradient: "from-violet-500 to-purple-500"
    },
    {
      title: "Value Proposition",
      value: businessModel.valueProposition,
      icon: Sparkles,
      color: "pink",
      gradient: "from-pink-500 to-rose-500"
    },
    {
      title: "Revenue Model",
      value: businessModel.revenueModel,
      icon: DollarSign,
      color: "green",
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      title: "Key Metrics",
      value: businessModel.keyMetrics,
      icon: BarChart,
      color: "purple",
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      title: "Competitive Advantage",
      value: businessModel.competitiveAdvantage,
      icon: Award,
      color: "indigo",
      gradient: "from-amber-500 to-orange-500"
    },
    {
      title: "Go-to-Market Strategy",
      value: businessModel.goToMarket,
      icon: TrendingUp,
      color: "orange",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="p-8 md:p-12 max-h-[85vh] overflow-y-auto">
      {/* Animated Header */}
      <div className="flex items-center gap-4 mb-8 animate-fadeIn">
        <div className="relative">
          <div className="absolute inset-0 bg-green-500 rounded-xl blur-lg opacity-50 animate-pulse"></div>
          <div className="relative h-14 w-14 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg">
            <CheckCircle className="w-7 h-7 text-white" />
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Business Model Canvas
          </h1>
          <p className="text-slate-600 mt-1 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            AI-generated strategic framework
          </p>
        </div>
      </div>

      {/* Enhanced Sections Grid */}
      <div className="grid gap-4 mb-8">
        {sections
          .filter((s) => s.value)
          .map(({ title, value, icon, color, gradient }, index) => (
            <div
              key={title}
              className="animate-slideUp"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <EnhancedModelCard
                icon={icon}
                title={title}
                content={value}
                color={color}
                gradient={gradient}
              />
            </div>
          ))}
      </div>

      {/* Enhanced CTA */}
      <button
        onClick={onViewDocument}
        className="group w-full bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white rounded-xl py-5 px-6 font-semibold text-lg flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
        <FileText className="w-5 h-5 relative z-10" />
        <span className="relative z-10">View Full Document</span>
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
      </button>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.6s ease-out both;
        }
        .bg-size-200 {
          background-size: 200% 100%;
        }
        .bg-pos-0 {
          background-position: 0% 0%;
        }
        .bg-pos-100 {
          background-position: 100% 0%;
        }
      `}</style>
    </div>
  );
}

function EnhancedModelCard({ icon: Icon, title, content, color, gradient }) {
  const colorClasses = {
    blue: "from-blue-50 to-cyan-50 border-blue-200 text-blue-600",
    purple: "from-purple-50 to-violet-50 border-purple-200 text-purple-600",
    indigo: "from-indigo-50 to-blue-50 border-indigo-200 text-indigo-600",
    pink: "from-pink-50 to-rose-50 border-pink-200 text-pink-600",
    green: "from-emerald-50 to-teal-50 border-emerald-200 text-emerald-600",
    orange: "from-orange-50 to-amber-50 border-orange-200 text-orange-600"
  };

  return (
    <div
      className={`group bg-gradient-to-br ${colorClasses[color]} rounded-xl p-6 border-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.01] cursor-pointer`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`h-11 w-11 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md flex-shrink-0 group-hover:scale-110 transition-transform`}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-900 mb-2 text-base">{title}</h3>
          <p className="text-slate-700 text-sm leading-relaxed">{content}</p>
        </div>
      </div>
    </div>
  );
}

function DocumentStage({ businessModel, onStartOver }) {
  const handleExport = () => {
    alert("PDF export functionality would be implemented here");
  };

  return (
    <div className="p-8 md:p-12 max-h-[85vh] overflow-y-auto">
      {/* Enhanced Header */}
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

      {/* Enhanced Document Content */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-10 border-2 border-slate-200 shadow-inner space-y-8">
        <EnhancedDocumentSection
          title="Executive Summary"
          content="This business model addresses the critical challenge of cash flow management for small businesses through an AI-powered forecasting platform. By providing predictive insights rather than reactive reporting, we enable business owners to make proactive financial decisions."
          icon={Sparkles}
          gradient="from-amber-500 to-orange-500"
        />

        <EnhancedDocumentSection
          title="Problem Statement"
          content={businessModel.problemStatement}
          icon={Target}
          gradient="from-red-500 to-pink-500"
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
          gradient="from-purple-500 to-violet-500"
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
          gradient="from-indigo-500 to-purple-500"
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
          gradient="from-orange-500 to-red-500"
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

      {/* Enhanced Action Buttons */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={onStartOver}
          className="flex-1 bg-white border-2 border-slate-300 text-slate-700 rounded-xl py-4 px-6 font-semibold hover:bg-slate-50 hover:border-slate-400 transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md transform hover:scale-[1.02]"
        >
          <ArrowRight className="w-5 h-5 rotate-180" />
          Start Over
        </button>
        <button className="flex-1 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 text-white rounded-xl py-4 px-6 font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02]">
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

/* Add fadeIn animation via inline style simulation */
const style = document.createElement("style");
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
  }
`;
document.head.appendChild(style);
