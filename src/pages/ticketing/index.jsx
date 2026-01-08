import { useEffect, useState } from "react";
import {
  LifeBuoy,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
  Filter,
  Search,
  Calendar,
  Tag
} from "lucide-react";
import { API_BASE_URL } from "../../config/apiConfig";

export default function FounderTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
    category: "Compliance Review Request",
    phase: "Phase 1",
    priority: "Medium"
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/tickets/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setTickets(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleCreateTicket = async () => {
    try {
      await fetch(`${API_BASE_URL}/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newTicket)
      });
      setModalOpen(false);
      setNewTicket({
        title: "",
        description: "",
        category: "Compliance Review Request",
        phase: "Phase 1"
      });
      fetchTickets();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredTickets = tickets
    .filter(
      (ticket) => filterStatus === "all" || ticket.status === filterStatus
    )
    .filter(
      (ticket) =>
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const stats = {
    open: tickets.filter((t) => t.status === "Open").length,
    inReview: tickets.filter((t) => t.status === "Under Review").length,
    resolved: tickets.filter((t) => t.status === "Resolved").length,
    total: tickets.length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center shadow-lg">
                <LifeBuoy className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Support Tickets
                </h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  Manage your requests and track their progress
                </p>
              </div>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-5 rounded-lg font-medium transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              New Ticket
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <StatCard
              label="Open"
              value={stats.open}
              icon={AlertCircle}
              color="text-blue-600"
              bgColor="bg-blue-50"
            />
            <StatCard
              label="In Review"
              value={stats.inReview}
              icon={Clock}
              color="text-amber-600"
              bgColor="bg-amber-50"
            />
            <StatCard
              label="Resolved"
              value={stats.resolved}
              icon={CheckCircle2}
              color="text-emerald-600"
              bgColor="bg-emerald-50"
            />
            <StatCard
              label="Total"
              value={stats.total}
              icon={LifeBuoy}
              color="text-slate-600"
              bgColor="bg-slate-50"
            />
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search tickets..."
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="Open">Open</option>
                <option value="Under Review">Under Review</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tickets List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="font-semibold text-slate-900 text-lg">
              Your Tickets
              <span className="ml-2 text-sm font-normal text-slate-500">
                ({filteredTickets.length})
              </span>
            </h2>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredTickets.length === 0 && (
              <div className="p-12 text-center">
                <LifeBuoy className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No tickets found</p>
                <p className="text-sm text-slate-400 mt-1">
                  {searchQuery || filterStatus !== "all"
                    ? "Try adjusting your filters"
                    : "Create your first ticket to get started"}
                </p>
              </div>
            )}
            {filteredTickets.map((ticket) => (
              <TicketRow key={ticket.id} ticket={ticket} />
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">
                Create New Ticket
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Brief description of your request"
                  className="w-full border border-slate-200 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newTicket.title}
                  onChange={(e) =>
                    setNewTicket({ ...newTicket, title: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Provide detailed information about your request"
                  className="w-full border border-slate-200 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
                  value={newTicket.description}
                  onChange={(e) =>
                    setNewTicket({ ...newTicket, description: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Category
                  </label>
                  <select
                    className="w-full border border-slate-200 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    value={newTicket.category}
                    onChange={(e) =>
                      setNewTicket({ ...newTicket, category: e.target.value })
                    }
                  >
                    <option>Compliance Review Request</option>
                    <option>Strategy Clarification</option>
                    <option>Funding Eligibility Review</option>
                    <option>Unlock / Exception Request</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phase
                  </label>
                  <select
                    className="w-full border border-slate-200 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    value={newTicket.phase}
                    onChange={(e) =>
                      setNewTicket({ ...newTicket, phase: e.target.value })
                    }
                  >
                    <option>Phase 1</option>
                    <option>Phase 2</option>
                    <option>Phase 3</option>
                    <option>System</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Priority
                </label>
                <select
                  className="w-full border border-slate-200 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  value={newTicket.priority}
                  onChange={(e) =>
                    setNewTicket({ ...newTicket, priority: e.target.value })
                  }
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Urgent</option>
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
              <button
                className="px-5 py-2.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors font-medium text-slate-700"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors font-medium shadow-sm"
                onClick={handleCreateTicket}
              >
                Create Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Components ---------- */
function StatCard({ label, value, icon: Icon, color, bgColor }) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-lg border border-slate-100 bg-slate-50/50">
      <div className={`${bgColor} p-2.5 rounded-lg`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-xs text-slate-500 font-medium">{label}</p>
      </div>
    </div>
  );
}

function TicketRow({ ticket }) {
  const statusConfig = {
    Open: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200"
    },
    "Under Review": {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200"
    },
    Resolved: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200"
    }
  };

  const priorityConfig = {
    Low: { text: "text-slate-600", dot: "bg-slate-400" },
    Medium: { text: "text-blue-600", dot: "bg-blue-500" },
    High: { text: "text-orange-600", dot: "bg-orange-500" },
    Urgent: { text: "text-red-600", dot: "bg-red-500" }
  };

  const config = statusConfig[ticket.status] || statusConfig["Open"];
  const priorityStyle =
    priorityConfig[ticket.priority] || priorityConfig["Medium"];

  const date = new Date(ticket.submittedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  return (
    <div className="p-6 hover:bg-slate-50 transition-colors cursor-pointer">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3 mb-2">
            <h3 className="font-semibold text-slate-900 text-base">
              {ticket.title}
            </h3>
          </div>

          <p className="text-sm text-slate-600 mb-3 line-clamp-2">
            {ticket.description}
          </p>

          {ticket.adminReply && (
            <div className="mb-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
              <p className="text-xs font-semibold text-blue-900 mb-1">
                Admin Reply
              </p>
              <p className="text-sm text-blue-800 line-clamp-2">
                {ticket.adminReply}
              </p>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              {ticket.category}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {date}
            </span>
            <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-700 font-medium">
              {ticket.phase}
            </span>
            <span
              className={`flex items-center gap-1.5 ${priorityStyle.text} font-medium`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${priorityStyle.dot}`}
              ></span>
              {ticket.priority}
            </span>
          </div>
        </div>

        <div>
          <span
            className={`inline-flex text-xs font-semibold px-3 py-1.5 rounded-full border ${config.bg} ${config.text} ${config.border}`}
          >
            {ticket.status}
          </span>
        </div>
      </div>
    </div>
  );
}
