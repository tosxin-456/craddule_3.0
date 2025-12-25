import {
  Calendar,
  Clock,
  CheckCircle,
  MessageSquare,
  Video,
  User,
  FileText,
  Download,
  X,
  Plus,
  Filter,
  AlertCircle,
  Phone
} from "lucide-react";
import { useState } from "react";

export default function StrategySessions() {
  const [selectedSession, setSelectedSession] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");

  const sessions = [
    {
      id: "STR-1024",
      date: "Jan 12, 2025",
      time: "10:00 AM",
      duration: "60 mins",
      status: "Completed",
      feedbackReady: true,
      advisor: "Adebayo Ogunlesi",
      advisorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      topic: "Business Scaling Strategy",
      summary:
        "Discussed expansion plans, market positioning, and resource allocation for Q1 2025.",
      actionItems: [
        "Review partnership proposals by Jan 20",
        "Update financial projections",
        "Schedule team meeting for implementation"
      ],
      meetingLink: null,
      notes: "Great session focused on sustainable growth strategies."
    },
    {
      id: "STR-1041",
      date: "Jan 25, 2025",
      time: "2:00 PM",
      duration: "45 mins",
      status: "Scheduled",
      feedbackReady: false,
      advisor: "Chioma Ifeanyi",
      advisorImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
      topic: "Compliance & Risk Management",
      summary: null,
      actionItems: [],
      meetingLink: "https://meet.craddule.com/str-1041",
      notes: null
    },
    {
      id: "STR-1038",
      date: "Jan 18, 2025",
      time: "11:30 AM",
      duration: "60 mins",
      status: "Completed",
      feedbackReady: true,
      advisor: "Emeka Okafor",
      advisorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
      topic: "Financial Planning & Funding",
      summary:
        "Explored funding options, investor readiness, and financial health metrics.",
      actionItems: [
        "Prepare pitch deck",
        "Research potential investors",
        "Update cap table"
      ],
      meetingLink: null,
      notes: "Valuable insights on approaching Series A funding."
    },
    {
      id: "STR-1050",
      date: "Feb 2, 2025",
      time: "3:30 PM",
      duration: "45 mins",
      status: "Scheduled",
      feedbackReady: false,
      advisor: "Fatima Abdullahi",
      advisorImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
      topic: "Marketing & Customer Acquisition",
      summary: null,
      actionItems: [],
      meetingLink: "https://meet.craddule.com/str-1050",
      notes: null
    }
  ];

  const filteredSessions =
    filterStatus === "All"
      ? sessions
      : sessions.filter((s) => s.status === filterStatus);

  const stats = {
    total: sessions.length,
    completed: sessions.filter((s) => s.status === "Completed").length,
    scheduled: sessions.filter((s) => s.status === "Scheduled").length,
    feedbackPending: sessions.filter(
      (s) => s.status === "Completed" && s.feedbackReady
    ).length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <header className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-3 shadow-md">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                  Strategy Sessions
                </h1>
                <p className="text-slate-600 mt-1 text-sm md:text-base">
                  Track scheduled calls, feedback, and readiness outcomes with
                  expert advisors.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowBookingModal(true)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg font-medium text-sm whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Book Session
            </button>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-slate-600">
                  Total Sessions
                </p>
                <p className="text-xl md:text-2xl font-bold text-slate-900 mt-1">
                  {stats.total}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-green-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-slate-600">Completed</p>
                <p className="text-xl md:text-2xl font-bold text-green-600 mt-1">
                  {stats.completed}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-slate-600">Scheduled</p>
                <p className="text-xl md:text-2xl font-bold text-blue-600 mt-1">
                  {stats.scheduled}
                </p>
              </div>
              <Clock className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-slate-600">
                  Feedback Ready
                </p>
                <p className="text-xl md:text-2xl font-bold text-blue-600 mt-1">
                  {stats.feedbackPending}
                </p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-400" />
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <Filter className="w-4 h-4 text-blue-600" />
            Filter by:
          </div>
          <div className="flex flex-wrap gap-2">
            {["All", "Scheduled", "Completed"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filterStatus === status
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                    : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Sessions List */}
        <div className="space-y-4">
          {filteredSessions.map((session) => (
            <div
              key={session.id}
              className="bg-white border border-blue-100 rounded-2xl p-4 md:p-5 hover:shadow-lg transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                {/* Advisor Image */}
                <div className="flex items-center gap-3 lg:flex-col lg:items-center">
                  <img
                    src={session.advisorImage}
                    alt={session.advisor}
                    className="w-16 h-16 rounded-xl object-cover border-2 border-blue-200"
                  />
                  <div
                    className={`rounded-lg px-2 py-1 lg:mt-2 ${
                      session.status === "Completed"
                        ? "bg-green-50 text-green-600"
                        : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    {session.status === "Completed" ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Video className="w-4 h-4" />
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-semibold text-slate-900">
                          {session.topic}
                        </h3>
                        <span className="text-sm text-slate-500 font-mono">
                          #{session.id}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-slate-600 flex-wrap">
                        <span className="flex items-center gap-1.5">
                          <User className="w-4 h-4" />
                          {session.advisor}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          {session.date}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          {session.time} ({session.duration})
                        </span>
                      </div>
                    </div>
                    <StatusBadge status={session.status} />
                  </div>

                  {session.summary && (
                    <p className="text-sm text-slate-700 bg-slate-50 rounded-lg p-3">
                      {session.summary}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <button
                      onClick={() => setSelectedSession(session)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md text-sm font-medium"
                    >
                      <FileText className="w-4 h-4" />
                      View Details
                    </button>

                    {session.feedbackReady && (
                      <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-300 hover:bg-blue-50 transition-colors text-sm font-medium text-blue-700">
                        <MessageSquare className="w-4 h-4" />
                        View Feedback
                      </button>
                    )}

                    {session.meetingLink && (
                      <a
                        href={session.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-sm hover:shadow-md text-sm font-medium"
                      >
                        <Video className="w-4 h-4" />
                        Join Meeting
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredSessions.length === 0 && (
          <div className="bg-white rounded-xl p-8 text-center border border-blue-100 shadow-sm">
            <Calendar className="w-12 h-12 text-blue-300 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-900 mb-1">
              No sessions found
            </h3>
            <p className="text-sm text-slate-600">
              Try adjusting your filters or book a new session.
            </p>
          </div>
        )}
      </div>

      {/* Session Details Modal */}
      {selectedSession && (
        <SessionDetailsModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
        />
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <BookingModal onClose={() => setShowBookingModal(false)} />
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const config = {
    Completed: {
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200",
      icon: <CheckCircle className="w-4 h-4" />
    },
    Scheduled: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      icon: <Clock className="w-4 h-4" />
    },
    Cancelled: {
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
      icon: <AlertCircle className="w-4 h-4" />
    }
  };

  const style = config[status];

  return (
    <span
      className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg border ${style.bg} ${style.text} ${style.border} whitespace-nowrap`}
    >
      {style.icon}
      {status}
    </span>
  );
}

function SessionDetailsModal({ session, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-blue-100">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-2.5">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {session.topic}
              </h2>
              <p className="text-sm text-slate-600 mt-0.5">Session #{session.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6 space-y-5">
          {/* Advisor Info with Image */}
          <div className="flex items-center gap-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
            <img
              src={session.advisorImage}
              alt={session.advisor}
              className="w-16 h-16 rounded-xl object-cover border-2 border-blue-200"
            />
            <div className="flex-1">
              <p className="text-xs text-slate-500 font-medium mb-0.5">Expert Advisor</p>
              <p className="text-base font-semibold text-slate-900">
                {session.advisor}
              </p>
            </div>
            <StatusBadge status={session.status} />
          </div>

          {/* Session Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500 font-medium mb-1">
                Date & Time
              </p>
              <p className="text-sm text-slate-900">
                {session.date} at {session.time}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium mb-1">
                Duration
              </p>
              <p className="text-sm text-slate-900">{session.duration}</p>
            </div>
          </div>

          {/* Summary */}
          {session.summary && (
            <div>
              <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Summary
              </h3>
              <p className="text-sm text-slate-700 bg-slate-50 rounded-lg p-4">
                {session.summary}
              </p>
            </div>
          )}

          {/* Action Items */}
          {session.actionItems.length > 0 && (
            <div>
              <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Action Items
              </h3>
              <ul className="space-y-2">
                {session.actionItems.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-slate-700"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Notes */}
          {session.notes && (
            <div>
              <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Notes
              </h3>
              <p className="text-sm text-slate-700 bg-blue-50 rounded-lg p-4 border border-blue-100">
                {session.notes}
              </p>
            </div>
          )}

          {/* Meeting Link */}
          {session.meetingLink && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900 font-medium mb-2">
                Ready to join?
              </p>
              <a
                href={session.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md text-sm font-medium"
              >
                <Video className="w-4 h-4" />
                Join Meeting Now
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-blue-300 hover:bg-white transition-colors font-medium text-sm"
          >
            Close
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md font-medium text-sm">
            <Download className="w-4 h-4" />
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
}

function BookingModal({ onClose }) {
  const [formData, setFormData] = useState({
    topic: "",
    advisor: "",
    date: "",
    time: "",
    notes: ""
  });

  const advisors = [
    {
      name: "Adebayo Ogunlesi",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
    },
    {
      name: "Chioma Ifeanyi",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop"
    },
    {
      name: "Emeka Okafor",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
    },
    {
      name: "Fatima Abdullahi",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop"
    }
  ];

  const topics = [
    "Business Scaling Strategy",
    "Compliance & Risk Management",
    "Financial Planning & Funding",
    "Marketing & Customer Acquisition",
    "Operations & Efficiency",
    "Other"
  ];

  const handleSubmit = () => {
    if (
      !formData.topic ||
      !formData.advisor ||
      !formData.date ||
      !formData.time
    ) {
      alert("Please fill in all required fields");
      return;
    }
    alert("Session booked successfully!");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-blue-100">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-2.5">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Book Strategy Session
              </h2>
              <p className="text-sm text-slate-600 mt-0.5">
                Schedule a call with an expert advisor
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Session Topic <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.topic}
              onChange={(e) =>
                setFormData({ ...formData, topic: e.target.value })
              }
            >
              <option value="">Select a topic</option>
              {topics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Preferred Advisor <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.advisor}
              onChange={(e) =>
                setFormData({ ...formData, advisor: e.target.value })
              }
            >
              <option value="">Select an advisor</option>
              {advisors.map((advisor) => (
                <option key={advisor.name} value={advisor.name}>
                  {advisor.name}
                </option>
              ))}
            </select>
            {/* Show selected advisor image */}
            {formData.advisor && (
              <div className="mt-2 flex items-center gap-2 bg-blue-50 rounded-lg p-2 border border-blue-100">
                <img
                  src={advisors.find((a) => a.name === formData.advisor)?.image}
                  alt={formData.advisor}
                  className="w-10 h-10 rounded-lg object-cover border border-blue-200"
                />
                <span className="text-sm text-slate-700 font-medium">
                  {formData.advisor}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Additional Notes
            </label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Any specific topics or questions you'd like to discuss..."
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-slate-700">
              <strong>Duration:</strong> 45-60 minutes
            </p>
            <p className="text-xs text-slate-600 mt-1">
              You'll receive a confirmation email with meeting details.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-white transition-colors font-medium text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors font-medium text-sm"
          >
            Book Session
          </button>
        </div>
      </div>
    </div>
  );
}
