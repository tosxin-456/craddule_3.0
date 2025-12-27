import { useState } from "react";
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
  Edit3
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FounderAIWalkthrough() {
  const [stage, setStage] = useState("chat"); // chat, generating, result, document
  const [messages, setMessages] = useState([
    {
      role: "ai",
      content:
        "Hi! I've reviewed your onboarding responses. Let's refine your business idea together. Tell me about your business in your own words - what are you building and why?"
    }
  ]);
  const [input, setInput] = useState("");
  const [finalIdea, setFinalIdea] = useState("");

  const businessModel = {
    problemStatement:
      "Small businesses lack predictive cash flow visibility, leading to poor financial decisions and business failures.",
    solution:
      "AI-powered cash flow forecasting platform with actionable recommendations",
    targetMarket:
      "Small businesses (5-50 employees) in retail and hospitality sectors",
    valueProposition:
      "Save 30% of time on financial planning while improving cash flow prediction accuracy by 85%",
    revenueModel:
      "SaaS subscription: $99/month (Starter), $299/month (Professional), $599/month (Enterprise)",
    keyMetrics: "MRR, Customer Acquisition Cost, Churn Rate, Forecast Accuracy",
    competitiveAdvantage:
      "AI-driven predictions vs. static reporting from competitors",
    goToMarket:
      "Content marketing, partnerships with accounting firms, freemium model"
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponses = [
        "That's a great start! Let me understand better - who specifically experiences this problem? Can you describe your target customer in more detail?",
        "Interesting! And how are people currently solving this problem? What alternatives exist?",
        "Perfect. Now, what makes your solution different or better than what's out there? What's your unique advantage?",
        "Excellent insights! I think we have enough to generate a comprehensive business model. Would you like me to create it now?"
      ];

      const responseIndex = Math.min(
        messages.filter((m) => m.role === "user").length,
        aiResponses.length - 1
      );
      const aiMessage = { role: "ai", content: aiResponses[responseIndex] };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);

    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const generateBusinessModel = () => {
    // Capture the conversation as the final idea
    const userMessages = messages
      .filter((m) => m.role === "user")
      .map((m) => m.content)
      .join(" ");
    setFinalIdea(userMessages);
    setStage("generating");

    setTimeout(() => {
      setStage("result");
    }, 3000);
  };

  const viewDocument = () => {
    setStage("document");
  };

  const startOver = () => {
    setStage("chat");
    setMessages([
      {
        role: "ai",
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
  canGenerate
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
              AI Business Model Generator
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
  const isAI = role === "ai";

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

/* ---------- Result Stage ---------- */
function ResultStage({ businessModel, onViewDocument }) {
  return (
    <div className="p-8 md:p-12 max-h-[85vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="h-12 w-12 rounded-xl bg-green-500 flex items-center justify-center">
          <CheckCircle className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Business Model Generated!
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Here's your comprehensive business model
          </p>
        </div>
      </div>

      {/* Business Model Cards */}
      <div className="space-y-4 mb-6">
        <ModelCard
          icon={Target}
          title="Problem Statement"
          content={businessModel.problemStatement}
          color="blue"
        />
        <ModelCard
          icon={Rocket}
          title="Solution"
          content={businessModel.solution}
          color="blue"
        />
        <ModelCard
          icon={Users}
          title="Target Market"
          content={businessModel.targetMarket}
          color="indigo"
        />
        <ModelCard
          icon={Sparkles}
          title="Value Proposition"
          content={businessModel.valueProposition}
          color="pink"
        />
        <ModelCard
          icon={DollarSign}
          title="Revenue Model"
          content={businessModel.revenueModel}
          color="green"
        />
        <ModelCard
          icon={TrendingUp}
          title="Go-to-Market Strategy"
          content={businessModel.goToMarket}
          color="orange"
        />
      </div>

      {/* Action Button */}
      <button
        onClick={onViewDocument}
        className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl py-4 px-6 font-semibold text-lg hover:from-indigo-700 hover:to-blue-700 transition flex items-center justify-center gap-3 shadow-lg"
      >
        <FileText className="w-5 h-5" />
        View Full Document
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}

function ModelCard({ icon: Icon, title, content, color }) {
  const colorClasses = {
    blue: "from-blue-50 to-blue-100 border-blue-200 text-blue-600",
    purple: "from-purple-50 to-purple-100 border-purple-200 text-purple-600",
    indigo: "from-indigo-50 to-indigo-100 border-indigo-200 text-indigo-600",
    pink: "from-pink-50 to-pink-100 border-pink-200 text-pink-600",
    green: "from-green-50 to-green-100 border-green-200 text-green-600",
    orange: "from-orange-50 to-orange-100 border-orange-200 text-orange-600"
  };

  return (
    <div
      className={`bg-gradient-to-r ${colorClasses[color]} rounded-lg p-5 border`}
    >
      <div className="flex items-start gap-3">
        <Icon
          className={`w-5 h-5 mt-0.5 ${colorClasses[color].split(" ")[2]}`}
        />
        <div>
          <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
          <p className="text-slate-700 text-sm leading-relaxed">{content}</p>
        </div>
      </div>
    </div>
  );
}

/* ---------- Document Stage ---------- */
function DocumentStage({ businessModel, onStartOver }) {
  const navigate = useNavigate();

  return (
    <div className="p-8 md:p-12 max-h-[85vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Business Model Canvas
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Complete business model documentation
            </p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium">
          <Download className="w-4 h-4" />
          Export PDF
        </button>
      </div>

      {/* Document Content */}
      <div className="bg-slate-50 rounded-xl p-8 border border-slate-200 space-y-6">
        <DocumentSection
          title="Executive Summary"
          content="This business model addresses the critical challenge of cash flow management for small businesses through an AI-powered forecasting platform. By providing predictive insights rather than reactive reporting, we enable business owners to make proactive financial decisions."
        />

        <DocumentSection
          title="Problem Statement"
          content={businessModel.problemStatement}
        />

        <DocumentSection
          title="Solution Overview"
          content={businessModel.solution}
        />

        <DocumentSection
          title="Target Market"
          content={businessModel.targetMarket}
        />

        <DocumentSection
          title="Value Proposition"
          content={businessModel.valueProposition}
        />

        <DocumentSection
          title="Revenue Model"
          content={businessModel.revenueModel}
        />

        <DocumentSection
          title="Key Metrics"
          content={businessModel.keyMetrics}
        />

        <DocumentSection
          title="Competitive Advantage"
          content={businessModel.competitiveAdvantage}
        />

        <DocumentSection
          title="Go-to-Market Strategy"
          content={businessModel.goToMarket}
        />

        <div className="pt-6 border-t border-slate-300">
          <p className="text-xs text-slate-500 text-center">
            Generated by AI Business Model Generator •{" "}
            {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={onStartOver}
          className="flex-1 bg-white border border-slate-300 text-slate-700 rounded-lg py-3 px-4 font-medium hover:bg-slate-50 transition flex items-center justify-center gap-2"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          Start Over
        </button>
        <button
          onClick={() => navigate("/dashboard")}
          className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg py-3 px-4 font-medium hover:from-indigo-700 hover:to-blue-700 transition flex items-center justify-center gap-2"
        >
          Continue to Dashboard
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function DocumentSection({ title, content }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-slate-900 mb-2">{title}</h2>
      <p className="text-slate-700 leading-relaxed">{content}</p>
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
