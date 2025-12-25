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

export default function DashboardHome() {
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
            <PhaseCard
              icon={<Shield className="w-6 h-6" />}
              title="Phase 1: Compliance"
              progress={70}
              status="In Progress"
              description="Legal documentation and registration"
              color="blue"
              isActive={true}
            />
            <PhaseCard
              icon={<TrendingUp className="w-6 h-6" />}
              title="Phase 2: Strategy"
              progress={30}
              status="Locked"
              description="Business model and market analysis"
              color="indigo"
              isActive={false}
            />
            <PhaseCard
              icon={<Rocket className="w-6 h-6" />}
              title="Phase 3: Funding"
              progress={0}
              status="Locked"
              description="Investment readiness and pitch prep"
              color="blue"
              isActive={false}
            />
          </div>
        </section>

        {/* Next Action - Enhanced */}
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
                  Upload your CAC certificate to complete your compliance
                  documentation. This is the final document needed to unlock
                  Phase 2.
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

        {/* Stats Grid */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Quick Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InfoCard
              icon={<FileText className="w-5 h-5 text-blue-600" />}
              title="Documents"
              value="4 / 7"
              subtitle="Completed"
              progress={57}
              image="https://images.unsplash.com/photo-1568667256549-094345857637?w=400&h=300&fit=crop"
            />
            <InfoCard
              icon={<AlertCircle className="w-5 h-5 text-amber-600" />}
              title="Open Tickets"
              value="1"
              subtitle="Active support request"
              image="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop"
            />
            <InfoCard
              icon={<CheckCircle2 className="w-5 h-5 text-green-600" />}
              title="Milestones"
              value="3 / 12"
              subtitle="Completed"
              progress={25}
              image="https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop"
            />
          </div>
        </section>

        {/* Recent Activity */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Recent Activity
          </h2>
          <div className="space-y-4">
            <ActivityItem
              text="Certificate of Incorporation uploaded"
              time="2 hours ago"
              status="completed"
            />
            <ActivityItem
              text="Business Plan reviewed"
              time="1 day ago"
              status="completed"
            />
            <ActivityItem
              text="Support ticket opened for CAC registration"
              time="2 days ago"
              status="pending"
            />
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
    blue: "from-blue-500 to-blue-600"
  };

  const bgColorClasses = {
    blue: "bg-blue-50",
    indigo: "bg-indigo-50",
    blue: "bg-blue-50"
  };

  const iconColorClasses = {
    blue: "text-blue-600",
    indigo: "text-indigo-600",
    blue: "text-blue-600"
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
