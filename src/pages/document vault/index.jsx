import { useState, useEffect } from "react";
import {
  FolderOpen,
  Calendar,
  Info,
  Download,
  Eye,
  Shield,
  CheckCircle,
  Clock,
  Building2,
  Receipt,
  FileText,
  Plus,
  X,
  TrendingUp,
  Target,
  Sparkles
} from "lucide-react";
import { API_BASE_URL, IMAGE_URL } from "../../config/apiConfig";
import toast from "react-hot-toast";
import EnhancedAbbyDocuments from "../../components/EnhancedDocuments";

export default function DocumentsVault() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documentsAbby, setDocumentsAbby] = useState([]);

  const [activeTab, setActiveTab] = useState("compliance"); // ✅ NEW

  const [newDocument, setNewDocument] = useState({
    complianceId: "",
    type: "",
    fullName: "",
    grants: "",
    expiry: "",
    issueDate: "",
    documentNumber: ""
  });

  const documentTypeConfig = {
    CAC: {
      icon: <Building2 className="w-5 h-5" />,
      image:
        "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=300&fit=crop"
    },
    "CAC Certificate": {
      icon: <Building2 className="w-5 h-5" />,
      image:
        "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=300&fit=crop"
    },
    TIN: {
      icon: <Receipt className="w-5 h-5" />,
      image:
        "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=400&h=300&fit=crop"
    },
    "Tax Identification Number": {
      icon: <Receipt className="w-5 h-5" />,
      image:
        "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=400&h=300&fit=crop"
    },
    BRC: {
      icon: <Shield className="w-5 h-5" />,
      image:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop"
    },
    "Industry License": {
      icon: <Shield className="w-5 h-5" />,
      image:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop"
    },
    "Tax Clearance Certificate": {
      icon: <FileText className="w-5 h-5" />,
      image:
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop"
    },
    Other: {
      icon: <FileText className="w-5 h-5" />,
      image:
        "https://images.unsplash.com/photo-1568667256549-094345857637?w=400&h=300&fit=crop"
    }
  };

  const token = localStorage.getItem("token");
  const [complianceItems, setComplianceItems] = useState([]);

  const fetchComplianceItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/compliance`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (data.success) {
        setComplianceItems(data.items);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplianceItems();
    fetchAbbyDocuments();
    fetchDocuments();
  }, []);

  const formatBusinessModel = (bm) => `
BUSINESS MODEL

Problem Statement:
${bm.problemStatement || ""}

Solution:
${bm.solution || ""}

Target Market:
${bm.targetMarket || ""}

Value Proposition:
${bm.valueProposition || ""}

Revenue Model:
${bm.revenueModel || ""}

Key Metrics:
${bm.keyMetrics || ""}

Competitive Advantage:
${bm.competitiveAdvantage || ""}

Go-To-Market Strategy:
${bm.goToMarket || ""}
`;

  const formatMarketingPlan = (plan) => `
MARKETING PLAN

Target Audience:
${plan.targetAudience || ""}

Positioning:
${plan.positioning || ""}

Channels:
${plan.channels || ""}

Launch Strategy:
${plan.launchStrategy || ""}

Metrics:
${plan.metrics || ""}
`;

  const fetchDocuments = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/documents`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (!response.ok) throw new Error("Failed to fetch documents");

      const data = await response.json();
      setDocuments(data.documents || []);
    } catch (error) {
      console.error("Error fetching documents:", error);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAbbyDocuments = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/documents/abby`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (!response.ok) throw new Error("Failed to fetch Abby documents");

      const data = await response.json();
      setDocumentsAbby(data?.data || []);
    } catch (error) {
      console.error("Error fetching Abby documents:", error);
      setDocumentsAbby([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDocument = async () => {
    if (
      !newDocument.type ||
      !newDocument.fullName ||
      !newDocument.grants ||
      !newDocument.issueDate ||
      !newDocument.documentNumber ||
      !selectedFile
    ) {
      toast.error("Please fill in all required fields and select a file");
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();

      formData.append("file", selectedFile);
      formData.append("complianceId", newDocument.complianceId);
      formData.append("name", newDocument.type);
      formData.append("type", newDocument.type);
      formData.append("fullName", newDocument.fullName);
      formData.append("grants", newDocument.grants);
      formData.append("expiryDate", newDocument.expiry || "");
      formData.append("issueDate", newDocument.issueDate);
      formData.append("documentNumber", newDocument.documentNumber);

      const response = await fetch(`${API_BASE_URL}/documents`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (!response.ok) throw new Error("Failed to add document");

      await fetchDocuments();

      setShowAddModal(false);
      setSelectedFile(null);
      setNewDocument({
        type: "CAC Certificate",
        fullName: "",
        grants: "",
        expiry: "",
        issueDate: "",
        documentNumber: ""
      });

      toast.success("✅ Document added successfully");
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to add document. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateStatus = (expiryDate) => {
    if (!expiryDate) return "Active";
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) return "Expired";
    if (daysUntilExpiry <= 60) return "Expiring Soon";
    return "Active";
  };

  const parseGrants = (grantsData) => {
    if (!grantsData) return "N/A";
    try {
      const parsed = JSON.parse(grantsData);
      if (parsed.businessName) {
        return `Business Registration for ${parsed.businessName}`;
      }
      return grantsData;
    } catch {
      return grantsData;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    } catch {
      return dateString;
    }
  };

  const handleView = (fileUrl) => {
    if (!fileUrl) return toast.error("No file available to view");

    try {
      window.open(`${IMAGE_URL}${fileUrl}`, "_blank");
    } catch (err) {
      console.error(err);
      toast.error("Failed to view document");
    }
  };

  const handleDownload = async (fileUrl) => {
    if (!fileUrl) return toast.error("No file available");

    try {
      const res = await fetch(`${IMAGE_URL}${fileUrl}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = fileUrl.split("/").pop();
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Document downloaded successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to download document");
    }
  };

  const getMissingDocuments = () => {
    return documents.filter((doc) => !doc.fileUrl).map((doc) => doc.fullName);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      Active: {
        bg: "bg-gradient-to-r from-green-50 to-emerald-50",
        text: "text-green-700",
        border: "border-green-200",
        icon: <CheckCircle className="w-4 h-4" />
      },
      "Expiring Soon": {
        bg: "bg-gradient-to-r from-amber-50 to-orange-50",
        text: "text-amber-700",
        border: "border-amber-200",
        icon: <Clock className="w-4 h-4" />
      },
      Expired: {
        bg: "bg-gradient-to-r from-yellow-50 to-rose-50",
        text: "text-yellow-700",
        border: "border-yellow-200",
        icon: <Clock className="w-4 h-4" />
      }
    };

    const config = statusConfig[status];

    return (
      <span
        className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg border ${config.bg} ${config.text} ${config.border}`}
      >
        {config.icon}
        {status}
      </span>
    );
  };

  function DocumentStage({ aiResult, onStartOver }) {
    const { businessModel } = aiResult;

    const handleExport = () => {
      toast.error("PDF export functionality would be implemented here");
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
          {/* <button
            onClick={handleExport}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg text-sm font-semibold transform hover:scale-105"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button> */}
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
          <p className="text-slate-700 leading-relaxed text-[15px]">
            {content}
          </p>
        </div>
      </div>
    );
  }
  console.log(documentsAbby);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <header className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
          <div className="relative h-20 sm:h-28 bg-gradient-to-r from-blue-600 to-blue-400">
            <img
              src="https://images.unsplash.com/photo-1568667256549-094345857637?w=1200&h=300&fit=crop"
              alt="Document vault"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-blue-400/90"></div>
          </div>

          <div className="p-4 sm:p-6 -mt-10 sm:-mt-14 relative">
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 bg-white rounded-lg sm:rounded-xl px-3 py-1.5 shadow-md mb-2">
                    <FolderOpen className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-semibold text-blue-600">
                      Secure Vault
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-3xl font-bold text-slate-900">
                    Documents Vault
                  </h1>
                  <p className="text-xs sm:text-base text-slate-600 mt-1 leading-relaxed">
                    All compliance + Abby-generated documents stored securely.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl px-3 py-2 sm:px-5 sm:py-3 text-center min-w-[80px] sm:min-w-[120px] shadow-lg">
                  <div className="text-xl sm:text-3xl font-bold text-white">
                    {
                      documents.filter(
                        (d) => calculateStatus(d.expiryDate) === "Active"
                      ).length
                    }
                  </div>
                  <div className="text-[10px] sm:text-xs text-blue-100 mt-0.5 font-medium">
                    Active
                  </div>
                </div>
              </div>

              {/* Tabs + Add button */}
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                {/* ✅ TWO TABS */}
                <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl p-1 w-full sm:w-fit">
                  <button
                    onClick={() => setActiveTab("compliance")}
                    className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      activeTab === "compliance"
                        ? "bg-white shadow text-blue-700"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Compliance Documents
                  </button>

                  <button
                    onClick={() => setActiveTab("abby")}
                    className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 justify-center ${
                      activeTab === "abby"
                        ? "bg-white shadow text-blue-700"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    Abby Documents
                  </button>
                </div>

                {/* Add button only for compliance docs */}
                {activeTab === "compliance" && (
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-700 hover:to-green-600 active:scale-95 transition-all shadow-md hover:shadow-lg font-medium text-sm w-full sm:w-auto"
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                    Add Document
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* TAB 1: Compliance */}
        {activeTab === "compliance" && (
          <>
            {/* Missing Documents Alert */}
            {getMissingDocuments().length > 0 && (
              <div className="bg-gradient-to-r from-yellow-50 to-rose-50 border border-yellow-200 rounded-2xl p-5 flex items-start gap-4 shadow-sm">
                <div className="bg-yellow-100 rounded-xl p-2">
                  <Info className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-yellow-900 text-lg">
                    Missing Required Documents
                  </h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    You are missing {getMissingDocuments().length} required
                    document(s): {getMissingDocuments().join(", ")}
                  </p>
                </div>
              </div>
            )}

            {/* Expiry Alert */}
            {documents.some(
              (d) => calculateStatus(d.expiryDate) === "Expiring Soon"
            ) && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4 shadow-sm">
                <div className="bg-amber-100 rounded-xl p-2">
                  <Clock className="w-6 h-6 text-amber-600 flex-shrink-0" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-900 text-lg">
                    Documents Expiring Soon
                  </h3>
                  <p className="text-sm text-amber-700 mt-1">
                    {
                      documents.filter(
                        (d) => calculateStatus(d.expiryDate) === "Expiring Soon"
                      ).length
                    }{" "}
                    document(s) will expire soon. Renew them to maintain
                    compliance.
                  </p>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="bg-white rounded-2xl p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-slate-600 mt-4">Loading documents...</p>
              </div>
            ) : documents.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center">
                <FolderOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  No Documents Found
                </h3>
                <p className="text-slate-600 mb-4">
                  Start by adding your compliance documents
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Add Your First Document
                </button>
              </div>
            ) : (
              <div className="grid gap-5">
                {documents.map((doc) => {
                  const config =
                    documentTypeConfig[doc.name] || documentTypeConfig["Other"];
                  const currentStatus = calculateStatus(doc.expiryDate);
                  const displayGrants = parseGrants(doc.grants);
                  const displayExpiry = doc.expiryDate
                    ? formatDate(doc.expiryDate)
                    : "Perpetual";
                  const displayIssueDate = formatDate(doc.issueDate);

                  return (
                    <div
                      key={doc.id}
                      className="bg-white border border-blue-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-blue-200"
                    >
                      <div className="flex items-start gap-0">
                        <div className="w-64 h-full relative hidden lg:block">
                          <img
                            src={config.image}
                            alt={doc.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white"></div>
                        </div>

                        <div className="flex items-start gap-5 p-6 flex-1">
                          <div
                            className={`rounded-xl p-3 shadow-sm ${
                              currentStatus === "Active"
                                ? "bg-gradient-to-br from-green-50 to-emerald-50 text-green-600"
                                : currentStatus === "Expiring Soon"
                                  ? "bg-gradient-to-br from-amber-50 to-orange-50 text-amber-600"
                                  : "bg-gradient-to-br from-yellow-50 to-rose-50 text-yellow-600"
                            }`}
                          >
                            {config.icon}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <div>
                                <h3 className="text-xl font-semibold text-slate-900">
                                  {doc.name}
                                </h3>
                                <p className="text-sm text-slate-500 mt-0.5">
                                  {doc.fullName}
                                </p>
                              </div>
                              {getStatusBadge(currentStatus)}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                              <div className="flex items-start gap-2">
                                <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-xs text-slate-500 font-medium">
                                    Grants
                                  </p>
                                  <p className="text-sm text-slate-700">
                                    {displayGrants}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-start gap-2">
                                <Calendar className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-xs text-slate-500 font-medium">
                                    Expiry Date
                                  </p>
                                  <p className="text-sm text-slate-700">
                                    {displayExpiry}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-start gap-2">
                                <FileText className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-xs text-slate-500 font-medium">
                                    Document Number
                                  </p>
                                  <p className="text-sm text-slate-700 font-mono">
                                    {doc.documentNumber || "N/A"}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-start gap-2">
                                <Calendar className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-xs text-slate-500 font-medium">
                                    Issue Date
                                  </p>
                                  <p className="text-sm text-slate-700">
                                    {displayIssueDate}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 pt-3 border-t border-blue-100">
                              <button
                                onClick={() => handleView(doc.fileUrl)}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg text-sm font-medium"
                              >
                                <Eye className="w-4 h-4" />
                                View
                              </button>
                              <button
                                onClick={() => handleDownload(doc.fileUrl)}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-blue-200 hover:bg-blue-50 transition-colors text-sm font-medium text-slate-700"
                              >
                                <Download className="w-4 h-4" />
                                Download
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* TAB 2: Abby Documents */}
        {activeTab === "abby" && (
          <EnhancedAbbyDocuments
            documentsAbby={documentsAbby}
            loading={loading}
            fetchAbbyDocuments={fetchAbbyDocuments}
          />
        )}

        {/* Add Document Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
                <h2 className="text-2xl font-bold text-slate-900">
                  Add Document
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Document Type *
                  </label>
                  <select
                    value={newDocument.complianceId}
                    onChange={(e) => {
                      const selected = complianceItems.find(
                        (item) => item.id === Number(e.target.value)
                      );

                      if (!selected) return;

                      setNewDocument((prev) => ({
                        ...prev,
                        complianceId: selected.id,
                        type: selected.title,
                        fullName: selected.title
                      }));
                    }}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl
             focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select document type</option>
                    {complianceItems.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Upload Document File *
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
                       file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  {selectedFile && (
                    <p className="text-sm text-slate-600 mt-2">
                      Selected: {selectedFile.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    What This Document Grants *
                  </label>
                  <textarea
                    value={newDocument.grants}
                    onChange={(e) =>
                      setNewDocument({ ...newDocument, grants: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    placeholder="e.g., Legal business existence and corporate identity"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Issue Date *
                    </label>
                    <input
                      type="date"
                      value={newDocument.issueDate}
                      onChange={(e) =>
                        setNewDocument({
                          ...newDocument,
                          issueDate: e.target.value
                        })
                      }
                      className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Expiry Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={newDocument.expiry}
                      onChange={(e) =>
                        setNewDocument({
                          ...newDocument,
                          expiry: e.target.value
                        })
                      }
                      className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Document Number *
                  </label>
                  <input
                    type="text"
                    value={newDocument.documentNumber}
                    onChange={(e) =>
                      setNewDocument({
                        ...newDocument,
                        documentNumber: e.target.value
                      })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., RC-1234567"
                  />
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button
                    onClick={handleAddDocument}
                    disabled={isSubmitting}
                    className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all shadow-md ${
                      isSubmitting
                        ? "bg-slate-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white"
                    }`}
                  >
                    {isSubmitting ? "Uploading..." : "Add Document"}
                  </button>

                  <button
                    onClick={() => setShowAddModal(false)}
                    disabled={isSubmitting}
                    className="px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 transition-colors font-medium text-slate-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
