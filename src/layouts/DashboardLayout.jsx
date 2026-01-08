import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Shield,
  FolderOpen,
  TrendingUp,
  Calendar,
  Rocket,
  MessageSquare,
  User,
  Settings,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  LogOut
} from "lucide-react";
import logo from "../assets/logo.png";
import { API_BASE_URL } from "../config/apiConfig";

export default function DashboardLayout() {
const [sidebarOpen, setSidebarOpen] = useState(false);
const [tickets, setTickets] = useState([]);
const [ticketLoading, setTicketLoading] = useState(true);

const navigate = useNavigate();
const token = localStorage.getItem("token");

// Fetch tickets for badge
useEffect(() => {
  const fetchTickets = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/tickets/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setTickets(data);
    } catch (err) {
      console.error(err);
    } finally {
      setTicketLoading(false);
    }
  };

  fetchTickets();
}, [token]);

const handleLogout = () => {
  localStorage.removeItem("token");
  sessionStorage.clear();
  navigate("/login");
};



  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-72 bg-white border-r border-gray-200 flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        shadow-xl lg:shadow-none
      `}
      >
        {/* Logo Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 p-6 border-b border-blue-500">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=200&fit=crop')] opacity-10 bg-cover bg-center"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                  <img src={logo} className="w-7 h-7 text-white" />
                </div>
                <h1 className="text-xl font-bold text-white">Craddule</h1>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-blue-100">Founder Console</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          <div>
            <SidebarLink
              to="/dashboard"
              label="Dashboard"
              icon={<LayoutDashboard className="w-5 h-5" />}
              onNavigate={() => setSidebarOpen(false)}
            />
          </div>

          <div>
            <SectionLabel label="Phase 1: Foundation" />
            <div className="space-y-1">
              <SidebarLink
                to="/dashboard/compliance"
                label="Compliance"
                icon={<Shield className="w-5 h-5" />}
                onNavigate={() => setSidebarOpen(false)}
              />
              <SidebarLink
                to="/dashboard/documents"
                label="Documents Vault"
                icon={<FolderOpen className="w-5 h-5" />}
                onNavigate={() => setSidebarOpen(false)}
              />
            </div>
          </div>

          <div>
            <SectionLabel label="Phase 2: Growth" />
            <div className="space-y-1">
              <SidebarLink
                to="/dashboard/strategy"
                label="Strategy"
                icon={<TrendingUp className="w-5 h-5" />}
                onNavigate={() => setSidebarOpen(false)}
              />
              <SidebarLink
                to="/dashboard/sessions"
                label="Strategy Sessions"
                icon={<Calendar className="w-5 h-5" />}
                onNavigate={() => setSidebarOpen(false)}
              />
            </div>
          </div>

          <div>
            <SectionLabel label="Phase 3: Scale" />
            <div className="space-y-1">
              <SidebarLink
                to="/dashboard/funding"
                label="Funding"
                icon={<Rocket className="w-5 h-5" />}
                onNavigate={() => setSidebarOpen(false)}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <div className="space-y-1">
              <SidebarLink
                to="/dashboard/messages"
                label="Messages & Tickets"
                icon={<MessageSquare className="w-5 h-5" />}
                onNavigate={() => setSidebarOpen(false)}
                badge={
                  ticketLoading
                    ? "..."
                    : tickets.filter((t) => t.status === "Under Review").length
                }
              />
              <SidebarLink
                to="/dashboard/profile"
                label="Founder Profile"
                icon={<User className="w-5 h-5" />}
                onNavigate={() => setSidebarOpen(false)}
              />
              <SidebarLink
                to="/dashboard/settings"
                label="Settings"
                icon={<Settings className="w-5 h-5" />}
                onNavigate={() => setSidebarOpen(false)}
              />
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 space-y-3">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
            <p className="text-sm font-medium text-gray-900 mb-1">Need Help?</p>
            <p className="text-xs text-gray-600 mb-3">
              Get support from our team
            </p>
            <button className="w-full px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
              Contact Support
            </button>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5
      text-sm font-semibold text-red-600
      border border-red-200 rounded-xl
      hover:bg-red-50 hover:border-red-300
      transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                <img src={logo} className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-lg font-bold text-gray-900">Craddule</h1>
            </div>
            <div className="w-10"></div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SectionLabel({ label }) {
  return (
    <div className="flex items-center gap-2 px-3 mb-2">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {label}
      </p>
    </div>
  );
}

function SidebarLink({ to, label, icon, badge, onNavigate }) {
  return (
    <NavLink
      to={to}
      end
      onClick={onNavigate}
      className={({ isActive }) =>
        `group flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 ${
          isActive
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`flex-shrink-0 ${
                isActive
                  ? "text-white"
                  : "text-gray-500 group-hover:text-blue-600"
              } transition-colors`}
            >
              {icon}
            </div>
            <span className="text-sm font-medium truncate">{label}</span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {badge && (
              <span
                className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {badge}
              </span>
            )}
            {isActive && <ChevronRight className="w-4 h-4 text-white" />}
          </div>
        </>
      )}
    </NavLink>
  );
}
