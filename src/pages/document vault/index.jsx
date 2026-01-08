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
  X
} from "lucide-react";
import { API_BASE_URL } from "../../config/apiConfig";

export default function DocumentsVault() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newDocument, setNewDocument] = useState({
    type: "CAC Certificate",
    fullName: "",
    grants: "",
    expiry: "",
    issueDate: "",
    documentNumber: ""
  });

  const requiredDocuments = [
    "CAC Certificate",
    "Industry License",
    "Tax Identification Number"
  ];

  const documentTypeConfig = {
    CAC1: {
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
    "Business Permit": {
      icon: <Shield className="w-5 h-5" />,
      image:
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=300&fit=crop"
    },
    "Environmental Clearance": {
      icon: <FileText className="w-5 h-5" />,
      image:
        "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=400&h=300&fit=crop"
    },
    "Fire Safety Certificate": {
      icon: <Shield className="w-5 h-5" />,
      image:
        "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=300&fit=crop"
    },
    "Health Permit": {
      icon: <FileText className="w-5 h-5" />,
      image:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop"
    },
    "Import License": {
      icon: <Receipt className="w-5 h-5" />,
      image:
        "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=400&h=300&fit=crop"
    },
    "Export License": {
      icon: <Receipt className="w-5 h-5" />,
      image:
        "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&h=300&fit=crop"
    },
    Other: {
      icon: <FileText className="w-5 h-5" />,
      image:
        "https://images.unsplash.com/photo-1568667256549-094345857637?w=400&h=300&fit=crop"
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

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
      console.log(data.documents);
      setDocuments(data.documents); // { success: true, documents }
    } catch (error) {
      console.error("Error fetching documents:", error);
      setDocuments([]);
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
      alert("Please fill in all required fields and select a file");
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("file", selectedFile);
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

      // ✅ refresh list
      await fetchDocuments();

      // ✅ reset + close
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

      // ✅ success feedback
      alert("✅ Document added successfully");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add document. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateStatus = (expiry) => {
    if (
      !expiry ||
      expiry === "None" ||
      expiry === "Perpetual" ||
      expiry === "0000-00-00"
    )
      return "Active";
    const expiryDate = new Date(expiry);
    const today = new Date();
    const daysUntilExpiry = Math.ceil(
      (expiryDate - today) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilExpiry < 0) return "Expired";
    if (daysUntilExpiry <= 60) return "Expiring Soon";
    return "Active";
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
        bg: "bg-gradient-to-r from-red-50 to-rose-50",
        text: "text-red-700",
        border: "border-red-200",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header with Image */}
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
                    All compliance documents stored securely. Access and
                    download anytime.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl px-3 py-2 sm:px-5 sm:py-3 text-center min-w-[80px] sm:min-w-[120px] shadow-lg">
                  <div className="text-xl sm:text-3xl font-bold text-white">
                    {documents.filter((d) => d.status === "Active").length}
                  </div>
                  <div className="text-[10px] sm:text-xs text-blue-100 mt-0.5 font-medium">
                    Active
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-700 hover:to-green-600 active:scale-95 transition-all shadow-md hover:shadow-lg font-medium text-sm w-full"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                Add Document
              </button>
            </div>
          </div>
        </header>

        {/* Missing Documents Alert */}
        {getMissingDocuments().length > 0 && (
          <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-2xl p-5 flex items-start gap-4 shadow-sm">
            <div className="bg-red-100 rounded-xl p-2">
              <Info className="w-6 h-6 text-red-600 flex-shrink-0" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 text-lg">
                Missing Required Documents
              </h3>
              <p className="text-sm text-red-700 mt-1">
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
                document(s) will expire soon. Renew them to maintain compliance.
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
              return (
                <div
                  key={doc.id}
                  className="bg-white border border-blue-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-blue-200"
                >
                  <div className="flex items-start gap-0">
                    {/* Side Image */}
                    <div className="w-64 h-full relative hidden lg:block">
                      <img
                        src={config.image}
                        alt={doc.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white"></div>
                    </div>

                    <div className="flex items-start gap-5 p-6 flex-1">
                      {/* Icon */}
                      <div
                        className={`rounded-xl p-3 shadow-sm ${
                          doc.status === "Active"
                            ? "bg-gradient-to-br from-green-50 to-emerald-50 text-green-600"
                            : doc.status === "Expiring Soon"
                            ? "bg-gradient-to-br from-amber-50 to-orange-50 text-amber-600"
                            : "bg-gradient-to-br from-red-50 to-rose-50 text-red-600"
                        }`}
                      >
                        {config.icon}
                      </div>

                      {/* Content */}
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
                          {getStatusBadge(doc.status)}
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                          <div className="flex items-start gap-2">
                            <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs text-slate-500 font-medium">
                                Grants
                              </p>
                              <p className="text-sm text-slate-700">
                                {doc.grants}
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
                                {doc.expiry || "Perpetual"}
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
                                {doc.documentNumber}
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
                                {doc.issueDate}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-3 border-t border-blue-100">
                          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg text-sm font-medium">
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-blue-200 hover:bg-blue-50 transition-colors text-sm font-medium text-slate-700">
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                          {doc.status === "Expiring Soon" && (
                            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg text-sm font-medium ml-auto">
                              Renew Now
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add Document Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
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
                    value={newDocument.type}
                    onChange={(e) =>
                      setNewDocument({
                        ...newDocument,
                        type: e.target.value
                      })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl"
                  >
                    <option value="CAC Certificate">CAC Certificate</option>
                    <option value="Industry License">Industry License</option>
                    <option value="Tax Identification Number">
                      Tax Identification Number
                    </option>
                    <option value="Tax Clearance Certificate">
                      Tax Clearance Certificate
                    </option>
                    <option value="Other">Any Other Document</option>
                  </select>
                </div>

                {newDocument.type === "Other" && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Document Name *
                    </label>
                    <input
                      type="text"
                      onChange={(e) =>
                        setNewDocument({
                          ...newDocument,
                          type: e.target.value
                        })
                      }
                      className="w-full px-4 py-2 border border-slate-300 rounded-xl"
                      placeholder="e.g., Environmental Permit"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Full Document Name *
                  </label>
                  <input
                    type="text"
                    value={newDocument.fullName}
                    onChange={(e) =>
                      setNewDocument({
                        ...newDocument,
                        fullName: e.target.value
                      })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Corporate Affairs Commission Registration"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Upload Document File *
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    className="w-full"
                  />
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
                      Expiry Date
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
                      placeholder="Leave empty for perpetual"
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
                    className="px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 transition-colors font-medium text-slate-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info Footer */}
        <div className=" from-blue-600 to-blue-500 rounded-2xl overflow-hidden shadow-xl">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&h=200&fit=crop"
              alt="Secure storage"
              className="w-full h-32 object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/95 to-blue-500/95"></div>
            <div className="absolute inset-0 flex items-center p-6">
              <div className="flex items-start gap-4 w-full">
                <div className="bg-white rounded-xl p-3 shadow-lg">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-xl text-white">
                    Secure Storage
                  </h3>
                  <p className="text-blue-50 mt-2 text-sm leading-relaxed">
                    All documents are encrypted and stored securely. You can
                    access them anytime and share them with authorized parties
                    through secure links.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
