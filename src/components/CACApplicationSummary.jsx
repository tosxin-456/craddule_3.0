import {
  Building2,
  CheckCircle2,
  Clock,
  XCircle,
  Circle,
  AlertCircle,
  Eye
} from "lucide-react";

const CACApplicationSummary = ({ application, setIsOpen }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return <CheckCircle2 className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Circle className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-50 rounded-lg">
            <Building2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              CAC Application
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">Registration Details</p>
          </div>
        </div>
        <span
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 ${getStatusColor(application.status)}`}
        >
          {getStatusIcon(application.status)}
          <span>
            {application.status?.charAt(0).toUpperCase() +
              application.status?.slice(1)}
          </span>
        </span>
      </div>

      {/* Content */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Business Name
            </p>
            <p className="text-sm font-semibold text-gray-900">
              {application.businessName || "N/A"}
            </p>
          </div>

          {application.alternativeBusinessName && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Alternative Name
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {application.alternativeBusinessName}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Business Type
            </p>
            <p className="text-sm font-semibold text-gray-900">
              {application.businessType || "N/A"}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Nature of Business
            </p>
            <p className="text-sm font-semibold text-gray-900">
              {application.natureOfBusiness || "N/A"}
            </p>
          </div>
        </div>

        {application.businessAddress && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Business Address
            </p>
            <p className="text-sm font-semibold text-gray-900">
              {application.businessAddress}
            </p>
          </div>
        )}

        {application.rcNumber && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              RC Number
            </p>
            <p className="text-sm font-semibold text-gray-900 font-mono">
              {application.rcNumber}
            </p>
          </div>
        )}

        {application.adminFeedback && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-blue-700 mb-1.5">
                  Admin Feedback
                </p>
                <p className="text-sm text-blue-900 leading-relaxed">
                  {application.adminFeedback}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="mt-6 w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-medium hover:from-emerald-700 hover:to-teal-700 transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 group"
      >
        <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
        View Full Application
      </button>
    </div>
  );
};

export default CACApplicationSummary;
