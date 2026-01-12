import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Lock,
  TrendingUp,
  FileText,
  AlertCircle,
  ArrowRight,
  Upload,
  Target,
  Rocket,
  Shield
} from "lucide-react";
import { API_BASE_URL } from "../../config/apiConfig";

export default function DashboardHome() {
  const [data, setData] = useState(null);

  const [tickets, setTickets] = useState([]);
  const [ticketLoading, setTicketLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
    fetchProgress();
  }, []);

  const token = localStorage.getItem("token");

  const fetchTickets = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/tickets/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setTickets(data);
      setTicketLoading(false);
    } catch (err) {
      console.error(err);
      setTicketLoading(false);
    }
  };

  const fetchProgress = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/progress`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    }
  };

  if (!data) return <p className="p-8">Loading...</p>;

  const { phases, nextAction, stats, recentActivity } = data;

  const phaseIcons = {
    "Phase 1: Compliance": <Shield className="w-6 h-6" />,
    "Phase 2: Strategy": <TrendingUp className="w-6 h-6" />,
    "Phase 3: Funding": <Rocket className="w-6 h-6" />
  };

  const phaseColors = {
    "Phase 1: Compliance": "blue",
    "Phase 2: Strategy": "indigo",
    "Phase 3: Funding": "blue"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=400&fit=crop"
            alt="background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative px-8 py-12">
          <div className="flex items-center gap-3 mb-3">
            <Rocket className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Founder Dashboard</h1>
          </div>
          <p className="text-blue-100 text-lg max-w-2xl">
            Your journey from compliance to funding readiness, simplified and
            tracked.
          </p>
        </div>
      </div>

      <div className="px-8 py-8 space-y-8 max-w-7xl mx-auto">
        {/* Progress Overview */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Your Progress
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {phases.map((phase) => (
              <PhaseCard
                key={phase.title}
                icon={phaseIcons[phase.title]}
                title={phase.title}
                progress={phase.progress}
                status={phase.status}
                description={
                  phase.title === "Phase 1: Regulatory Compliance"
                    ? "Legal documentation and registration"
                    : phase.title === "Phase 2: Strategy"
                    ? "Business model and market analysis"
                    : "Investment readiness and pitch prep"
                }
                color={phaseColors[phase.title]}
                isActive={phase.status !== "Locked"}
              />
            ))}
          </div>
        </section>

        {/* Next Action */}
        {nextAction && (
          <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg">
            <div className="absolute right-0 top-0 opacity-10">
              <img
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=400&fit=crop"
                alt="action"
                className="w-96 h-full object-cover"
              />
            </div>
            <div className="relative p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Next Required Action
                  </h3>
                  <p className="text-blue-100 mb-6 max-w-xl">
                    {nextAction.description}
                  </p>
                  <button className="group px-6 py-3 bg-white text-blue-700 rounded-xl font-medium hover:bg-blue-50 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl">
                    <Upload className="w-4 h-4" />
                    Upload Document
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Stats Grid */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Quick Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InfoCard
              icon={<FileText className="w-5 h-5 text-blue-600" />}
              title="Documents"
              value={`${stats.documents}`}
              subtitle="Total documents to uploaded"
            />
            <InfoCard
              icon={<AlertCircle className="w-5 h-5 text-amber-600" />}
              title="Open Tickets"
              value={ticketLoading ? "..." : tickets.length}
              subtitle="Your open support requests"
            />

            <InfoCard
              icon={<CheckCircle2 className="w-5 h-5 text-green-600" />}
              title="Milestones"
              value={`${stats.milestones}`}
              subtitle="Compliance completed"
            />
          </div>
        </section>

        {/* Recent Activity */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentActivity.map((item, idx) => (
              <ActivityItem
                key={idx}
                text={item.text}
                time={new Date(item.time).toLocaleString()}
                status={item.status}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function PhaseCard({
  icon,
  title,
  progress,
  status,
  description,
  color,
  isActive
}) {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    indigo: "from-indigo-500 to-indigo-600",
    prurple: "from-prurple-500 to-prurple-600"
  };

  const bgColorClasses = {
    blue: "bg-blue-50",
    indigo: "bg-indigo-50",
    yellow: "bg-yellow-50"
  };

  const iconColorClasses = {
    blue: "text-blue-600",
    indigo: "text-indigo-600",
    yellow: "text-yellow-600"
  };

  return (
    <div
      className={`relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md ${
        !isActive && "opacity-75"
      }`}
    >
      <div
        className={`absolute top-0 right-0 w-32 h-32 ${bgColorClasses[color]} rounded-full -mr-16 -mt-16 opacity-50`}
      ></div>

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2 rounded-xl ${bgColorClasses[color]}`}>
            <div className={iconColorClasses[color]}>
              {isActive ? icon : <Lock className="w-6 h-6" />}
            </div>
          </div>
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full ${
              isActive
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {status}
          </span>
        </div>

        <h4 className="font-semibold text-gray-800 mb-1">{title}</h4>
        <p className="text-sm text-gray-500 mb-4">{description}</p>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-semibold text-gray-800">{progress}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className={`h-2 rounded-full bg-gradient-to-r ${colorClasses[color]} transition-all duration-500`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, title, value, subtitle, progress, image }) {
  return (
    <div className="relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100 group hover:shadow-md transition-all">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity">
        <img src={image} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="relative p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-50 rounded-lg">{icon}</div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
        </div>
        <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
        <p className="text-sm text-gray-500">{subtitle}</p>

        {progress !== undefined && (
          <div className="mt-4">
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ActivityItem({ text, time, status }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
      <div
        className={`p-2 rounded-full ${
          status === "completed" ? "bg-green-100" : "bg-amber-100"
        }`}
      >
        {status === "completed" ? (
          <CheckCircle2 className="w-4 h-4 text-green-600" />
        ) : (
          <AlertCircle className="w-4 h-4 text-amber-600" />
        )}
      </div>
      <div className="flex-1">
        <p className="text-gray-800 font-medium">{text}</p>
        <p className="text-sm text-gray-500">{time}</p>
      </div>
    </div>
  );
}
