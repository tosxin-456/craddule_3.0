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
  FileText
} from "lucide-react";

export default function DocumentsVault() {
  const documents = [
    {
      id: 1,
      name: "CAC Certificate",
      fullName: "Corporate Affairs Commission Registration",
      grants: "Legal business existence and corporate identity",
      expiry: "Perpetual",
      status: "Active",
      issueDate: "January 15, 2024",
      documentNumber: "RC-1234567",
      icon: <Building2 className="w-5 h-5" />,
      image:
        "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      name: "Industry License",
      fullName: "Operational Business License",
      grants: "Authorization to operate in your business sector",
      expiry: "March 30, 2026",
      status: "Active",
      issueDate: "April 1, 2024",
      documentNumber: "IL-789456",
      icon: <Shield className="w-5 h-5" />,
      image:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      name: "Tax Identification Number",
      fullName: "TIN Certificate",
      grants: "Tax compliance and eligibility for government contracts",
      expiry: "None",
      status: "Active",
      issueDate: "February 10, 2024",
      documentNumber: "TIN-12345678-0001",
      icon: <Receipt className="w-5 h-5" />,
      image:
        "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=400&h=300&fit=crop"
    },
    {
      id: 4,
      name: "Tax Clearance Certificate",
      fullName: "Annual Tax Clearance",
      grants: "Eligibility for funding, banking services, and contracts",
      expiry: "January 31, 2026",
      status: "Expiring Soon",
      issueDate: "February 1, 2025",
      documentNumber: "TCC-2025-456789",
      icon: <FileText className="w-5 h-5" />,
      image:
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop"
    }
  ];

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
        <header className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
          <div className="relative h-32 bg-gradient-to-r from-blue-600 to-blue-400">
            <img
              src="https://images.unsplash.com/photo-1568667256549-094345857637?w=1200&h=300&fit=crop"
              alt="Document vault"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-blue-400/90"></div>
          </div>
          <div className="p-6 -mt-16 relative">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 bg-white rounded-xl px-4 py-2 shadow-md mb-3">
                  <FolderOpen className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-600">
                    Secure Vault
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Documents Vault
                </h1>
                <p className="text-slate-600 mt-2">
                  All processed compliance documents stored securely and
                  transparently. Access and download anytime.
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl px-6 py-4 text-center min-w-[140px] shadow-lg">
                <div className="text-3xl font-bold text-white">
                  {documents.filter((d) => d.status === "Active").length}
                </div>
                <div className="text-xs text-blue-100 mt-1 font-medium">
                  Active Documents
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Expiry Alert */}
        {documents.some((d) => d.status === "Expiring Soon") && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4 shadow-sm">
            <div className="bg-amber-100 rounded-xl p-2">
              <Clock className="w-6 h-6 text-amber-600 flex-shrink-0" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900 text-lg">
                Documents Expiring Soon
              </h3>
              <p className="text-sm text-amber-700 mt-1">
                {documents.filter((d) => d.status === "Expiring Soon").length}{" "}
                document(s) will expire soon. Renew them to maintain compliance.
              </p>
            </div>
          </div>
        )}

        {/* Documents Grid */}
        <div className="grid gap-5">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-white border border-blue-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-blue-200"
            >
              <div className="flex items-start gap-0">
                {/* Side Image */}
                <div className="w-64 h-full relative hidden lg:block">
                  <img
                    src={doc.image}
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
                    {doc.icon}
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
                          <p className="text-sm text-slate-700">{doc.grants}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Calendar className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-slate-500 font-medium">
                            Expiry Date
                          </p>
                          <p className="text-sm text-slate-700">{doc.expiry}</p>
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
          ))}
        </div>

        {/* Info Footer */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl overflow-hidden shadow-xl">
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
