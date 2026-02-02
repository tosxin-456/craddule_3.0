import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { API_BASE_URL, IMAGE_URL } from "../config/apiConfig";
import {
  X,
  Upload,
  Plus,
  Trash2,
  FileText,
  Users,
  AlertCircle,
  Shield,
  Building2,
  ExternalLink
} from "lucide-react";

// ================= REUSABLE COMPONENTS (OUTSIDE MAIN COMPONENT) =================
const Input = ({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
  className = "",
  value,
  onChange
}) => (
  <div className={className}>
    {label && (
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <input
      type={type}
      name={name}
      placeholder={placeholder || label}
      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
      value={value || ""}
      onChange={onChange}
      required={required}
    />
  </div>
);

const TextArea = ({
  label,
  name,
  placeholder,
  required = false,
  rows = 3,
  value,
  onChange
}) => (
  <div>
    {label && (
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <textarea
      name={name}
      placeholder={placeholder || label}
      rows={rows}
      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none resize-none"
      value={value || ""}
      onChange={onChange}
      required={required}
    />
  </div>
);

const Select = ({
  label,
  name,
  options,
  required = false,
  value,
  onChange
}) => (
  <div>
    {label && (
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <select
      name={name}
      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none bg-white"
      value={value || ""}
      onChange={onChange}
      required={required}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

const FileUpload = ({
  label,
  name,
  description,
  onChange,
  fileName,
  fileUrl
}) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1.5">
      {label}
    </label>
    <div className="relative">
      <input
        type="file"
        name={name}
        onChange={onChange}
        className="hidden"
        id={name}
        accept="image/*"
      />
      <label
        htmlFor={name}
        className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all"
      >
        <Upload className="w-5 h-5 text-slate-400" />
        <span className="text-sm text-slate-600">
          {fileName || "Choose image to upload"}
        </span>
      </label>
    </div>
    {description && (
      <p className="text-xs text-slate-500 mt-1">{description}</p>
    )}
    {fileUrl && (
      <a
        href={`${IMAGE_URL}${fileUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 hover:underline"
      >
        <ExternalLink className="w-4 h-4" />
        View uploaded file
      </a>
    )}
  </div>
);

const SCUMLApplicationSummary = ({ application, onViewFull }) => {
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
        return "✓";
      case "pending":
        return "⏳";
      case "rejected":
        return "✗";
      default:
        return "•";
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl border-2 border-gray-200 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-800">
            SCUML Registration
          </h3>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(application.status)}`}
        >
          {getStatusIcon(application.status)}{" "}
          {application.status?.charAt(0).toUpperCase() +
            application.status?.slice(1)}
        </span>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Cooperative Name</p>
            <p className="text-sm font-medium text-gray-900">
              {application.cooperativeName || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Cooperative Type</p>
            <p className="text-sm font-medium text-gray-900">
              {application.cooperativeType || "N/A"}
            </p>
          </div>
        </div>

        {application.adminFeedback && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-700 font-medium mb-1">
              Admin Feedback
            </p>
            <p className="text-sm text-blue-900">{application.adminFeedback}</p>
          </div>
        )}
      </div>

      <button
        onClick={onViewFull}
        className="mt-4 w-full px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-medium hover:from-purple-700 hover:to-indigo-700 transition-all shadow hover:shadow-md"
      >
        View Full Application
      </button>
    </div>
  );
};

// ================= MAIN COMPONENT =================
export function ScumlComplianceForm() {
  const [formData, setFormData] = useState({
    registrationType: "",
    cooperativeType: "",

    // Cooperative Details
    cooperativeName: "",
    alternativeName: "",
    registeredAddress: "",
    contactAddress: "",
    stateOfOperation: "",
    lgaOfOperation: "",
    dateOfFormation: "",
    membershipSize: "",
    sharesValue: "",
    entranceFee: "",

    // Contact Information
    cooperativeEmail: "",
    cooperativePhone: "",
    websiteUrl: "",

    // Leadership
    president: "",
    vicePresident: "",
    secretary: "",
    treasurer: "",

    // Objectives and Activities
    mainObjectives: "",
    businessActivities: "",
    sourceOfFunds: "",
    projectedAnnualTurnover: "",

    // Members
    members: [],

    // Executive Committee
    executiveCommittee: [],

    // Board of Directors/Trustees
    boardMembers: [],

    // Supervisory Committee
    supervisoryCommittee: [],

    // Bank Details
    bankName: "",
    accountNumber: "",
    accountName: "",

    // Registration Details
    previousRegistration: "",
    previousRegNumber: "",
    affiliatedUnion: "",
    affiliatedFederation: "",

    // Documents
    constitution: null,
    minutesOfFormation: null,
    membersList: null,
    financialStatement: null,
    businessPlan: null,
    utilityBill: null,
    cacCertificate: null,
    taxClearance: null,
    passportPhotos: null,
    affidavit: null,

    // Document URLs
    constitutionUrl: "",
    minutesOfFormationUrl: "",
    membersListUrl: "",
    financialStatementUrl: "",
    businessPlanUrl: "",
    utilityBillUrl: "",
    cacCertificateUrl: "",
    taxClearanceUrl: "",
    passportPhotosUrl: "",
    affidavitUrl: ""
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [hasApplication, setHasApplication] = useState(false);
  const [applicationData, setApplicationData] = useState(null);

  const token = localStorage.getItem("token");

  const parseJsonSafe = (str) => {
    if (!str) return [];
    try {
      const parsed = JSON.parse(str);
      // Sometimes it's double stringified
      return Array.isArray(parsed) ? parsed : JSON.parse(parsed);
    } catch {
      return [];
    }
  };

  useEffect(() => {
    setFetching(true);

    // Safe parser for fields that can be array or JSON string
    const parseJsonSafe = (field) => {
      if (!field) return [];
      if (Array.isArray(field)) return field;
      try {
        return JSON.parse(field);
      } catch {
        return [];
      }
    };

    const fetchScumlApplication = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/scuml-application`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const text = await res.text();
        if (!text) throw new Error("Empty response from server");

        const data = JSON.parse(text);
        console.log(data);

        if (data.success && data.application) {
          const app = data.application;
          console.log(app);

          setHasApplication(true);
          setApplicationData(app);

          setFormData({
            ...app,
            members: parseJsonSafe(app.members),
            executiveCommittee: parseJsonSafe(app.executiveCommittee),
            boardMembers: parseJsonSafe(app.boardMembers),
            supervisoryCommittee: parseJsonSafe(app.supervisoryCommittee),

            // Keep file URLs
            constitutionUrl: app.constitution || "",
            minutesOfFormationUrl: app.minutesOfFormation || "",
            membersListUrl: app.membersList || "",
            financialStatementUrl: app.financialStatement || "",
            businessPlanUrl: app.businessPlan || "",
            utilityBillUrl: app.utilityBill || "",
            cacCertificateUrl: app.cacCertificate || "",
            taxClearanceUrl: app.taxClearance || "",
            passportPhotosUrl: app.passportPhotos || "",
            affidavitUrl: app.affidavit || ""
          });
        }
      } catch (err) {
        console.error("Failed to fetch SCUML application:", err);
        toast.error("Failed to fetch your SCUML application");
      } finally {
        setFetching(false);
      }
    };

    fetchScumlApplication();
  }, [isOpen, token]);

  const handleClose = () => setIsOpen(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      // Validate that it's an image
      const file = files[0];
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload only image files");
        return;
      }
      setFormData((prev) => ({ ...prev, [name]: file }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayChange = (field, index, key, value) => {
    const arr = [...(formData[field] || [])];
    arr[index] = { ...arr[index], [key]: value };
    setFormData((prev) => ({ ...prev, [field]: arr }));
  };

  const addArrayItem = (field) => {
    setFormData((prev) => ({ ...prev, [field]: [...(prev[field] || []), {}] }));
  };

  const removeArrayItem = (field, index) => {
    const arr = [...(formData[field] || [])];
    arr.splice(index, 1);
    setFormData((prev) => ({ ...prev, [field]: arr }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.registrationType) {
      toast.error("Please select a registration type");
      return;
    }

    if (!formData.cooperativeType) {
      toast.error("Please select cooperative type");
      return;
    }

    if (!formData.cooperativeName) {
      toast.error("Cooperative name is required");
      return;
    }

    setLoading(true);
    try {
      const body = new FormData();

      for (const key in formData) {
        if (Array.isArray(formData[key])) {
          body.append(key, JSON.stringify(formData[key]));
        } else if (formData[key] instanceof File) {
          body.append(key, formData[key]);
        } else if (!key.endsWith("Url")) {
          // Don't send URL fields back
          body.append(key, formData[key] || "");
        }
      }

      const res = await fetch(`${API_BASE_URL}/scuml-application`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body
      });

      const data = await res.json();
      if (data.success) {
        toast.success("SCUML application saved successfully!");
        handleClose();
        // Refresh the application data
        window.location.reload();
      } else {
        toast.error(data.message || "Failed to save SCUML application");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while saving your application");
    } finally {
      setLoading(false);
    }
  };

  const shouldShowSection = (section) => {
    const { registrationType, cooperativeType } = formData;

    const sectionMap = {
      cooperative: true,
      members: true,
      executive: true,
      board: cooperativeType !== "Primary Society",
      supervisory: true,
      leadership: true,
      objectives: true
    };

    return sectionMap[section] || false;
  };

  const nigerianStates = [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "FCT",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara"
  ];

  return (
    <>
      <div className="text-center my-6">
        {hasApplication && applicationData ? (
          <SCUMLApplicationSummary
            application={applicationData}
            onViewFull={() => setIsOpen(true)}
          />
        ) : (
          <button
            onClick={() => setIsOpen(true)}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Shield className="w-5 h-5 inline-block mr-2 -mt-0.5" />
            Open SCUML Registration Form
          </button>
        )}
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full relative overflow-hidden max-h-[95vh] flex flex-col">
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-purple-600" />
                  SCUML Registration Form
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Special Control Unit Against Money Laundering - Cooperative
                  Registration
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-slate-100 transition"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {fetching ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
                  <p className="text-purple-600 font-medium">
                    Loading your application...
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Registration Type Selection */}
                  <section className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="p-2 bg-purple-600 rounded-lg">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">
                          Registration Information
                        </h4>
                        <p className="text-sm text-slate-600">
                          Select the type of cooperative registration
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Select
                        label="Registration Type"
                        name="registrationType"
                        required
                        value={formData.registrationType}
                        onChange={handleChange}
                        options={[
                          { value: "", label: "Select Registration Type" },
                          {
                            value: "New Registration",
                            label: "New Cooperative Registration"
                          },
                          {
                            value: "Re-registration",
                            label: "Re-registration"
                          },
                          {
                            value: "Amendment",
                            label: "Amendment of Constitution"
                          },
                          { value: "Change of Name", label: "Change of Name" }
                        ]}
                      />

                      <Select
                        label="Cooperative Type"
                        name="cooperativeType"
                        required
                        value={formData.cooperativeType}
                        onChange={handleChange}
                        options={[
                          { value: "", label: "Select Cooperative Type" },
                          {
                            value: "Primary Society",
                            label: "Primary Cooperative Society"
                          },
                          {
                            value: "Cooperative Union",
                            label: "Cooperative Union"
                          },
                          {
                            value: "Cooperative Federation",
                            label: "Cooperative Federation"
                          },
                          {
                            value: "Thrift & Credit",
                            label: "Thrift & Credit Society"
                          },
                          {
                            value: "Multipurpose",
                            label: "Multipurpose Cooperative"
                          },
                          { value: "Producer", label: "Producer Cooperative" },
                          { value: "Consumer", label: "Consumer Cooperative" },
                          { value: "Housing", label: "Housing Cooperative" },
                          {
                            value: "Transport",
                            label: "Transport Cooperative"
                          },
                          {
                            value: "Agricultural",
                            label: "Agricultural Cooperative"
                          }
                        ]}
                      />
                    </div>

                    {formData.registrationType && formData.cooperativeType && (
                      <div className="mt-4 p-4 bg-white rounded-lg border border-purple-200">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                          <div className="text-sm">
                            <p className="font-semibold text-slate-900 mb-1">
                              {formData.registrationType} -{" "}
                              {formData.cooperativeType}
                            </p>
                            <p className="text-slate-600">
                              {formData.cooperativeType === "Primary Society" &&
                                "Primary cooperative societies are formed by at least 10 individuals with common economic interests."}
                              {formData.cooperativeType ===
                                "Cooperative Union" &&
                                "Cooperative unions are formed by at least 5 registered primary societies."}
                              {formData.cooperativeType ===
                                "Cooperative Federation" &&
                                "Cooperative federations are formed by at least 3 registered cooperative unions."}
                              {![
                                "Primary Society",
                                "Cooperative Union",
                                "Cooperative Federation"
                              ].includes(formData.cooperativeType) &&
                                "Please ensure all required documents and information are provided for registration."}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </section>

                  {formData.cooperativeType && (
                    <>
                      {/* ================= COOPERATIVE DETAILS ================= */}
                      <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                        <div className="flex items-start gap-3 mb-6">
                          <div className="p-2 bg-emerald-100 rounded-lg">
                            <Building2 className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-slate-900">
                              Cooperative Details
                            </h4>
                            <p className="text-sm text-slate-600">
                              Provide basic information about the cooperative
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            label="Cooperative Name (1st Choice)"
                            name="cooperativeName"
                            placeholder="Enter primary name choice"
                            required
                            className="md:col-span-2"
                            value={formData.cooperativeName}
                            onChange={handleChange}
                          />

                          <Input
                            label="Alternative Name (2nd Choice)"
                            name="alternativeName"
                            placeholder="Enter alternative name"
                            value={formData.alternativeName}
                            onChange={handleChange}
                          />

                          <Input
                            label="Date of Formation"
                            name="dateOfFormation"
                            type="date"
                            required
                            value={formData.dateOfFormation}
                            onChange={handleChange}
                          />

                          <TextArea
                            label="Registered Office Address"
                            name="registeredAddress"
                            placeholder="Enter complete registered address"
                            required
                            value={formData.registeredAddress}
                            onChange={handleChange}
                          />

                          <TextArea
                            label="Contact/Correspondence Address"
                            name="contactAddress"
                            placeholder="Enter contact address"
                            value={formData.contactAddress}
                            onChange={handleChange}
                          />

                          <div className="grid grid-cols-2 gap-4">
                            <Select
                              label="State of Operation"
                              name="stateOfOperation"
                              required
                              value={formData.stateOfOperation}
                              onChange={handleChange}
                              options={[
                                { value: "", label: "Select State" },
                                ...nigerianStates.map((state) => ({
                                  value: state,
                                  label: state
                                }))
                              ]}
                            />

                            <Input
                              label="LGA of Operation"
                              name="lgaOfOperation"
                              placeholder="Enter LGA"
                              required
                              value={formData.lgaOfOperation}
                              onChange={handleChange}
                            />
                          </div>

                          <Input
                            label="Membership Size"
                            name="membershipSize"
                            type="number"
                            placeholder="Total number of members"
                            required
                            value={formData.membershipSize}
                            onChange={handleChange}
                          />

                          <Input
                            label="Value of Shares (NGN)"
                            name="sharesValue"
                            type="number"
                            placeholder="Nominal value per share"
                            required
                            value={formData.sharesValue}
                            onChange={handleChange}
                          />

                          <Input
                            label="Entrance Fee (NGN)"
                            name="entranceFee"
                            type="number"
                            placeholder="Entrance fee amount"
                            value={formData.entranceFee}
                            onChange={handleChange}
                          />

                          <Input
                            label="Projected Annual Turnover (NGN)"
                            name="projectedAnnualTurnover"
                            type="number"
                            placeholder="Estimated annual turnover"
                            value={formData.projectedAnnualTurnover}
                            onChange={handleChange}
                          />

                          <Input
                            label="Cooperative Email"
                            name="cooperativeEmail"
                            type="email"
                            placeholder="cooperative@example.com"
                            required
                            value={formData.cooperativeEmail}
                            onChange={handleChange}
                          />

                          <Input
                            label="Cooperative Phone"
                            name="cooperativePhone"
                            type="tel"
                            placeholder="Contact phone number"
                            required
                            value={formData.cooperativePhone}
                            onChange={handleChange}
                          />

                          <Input
                            label="Website URL (if any)"
                            name="websiteUrl"
                            type="url"
                            placeholder="https://www.example.com"
                            className="md:col-span-2"
                            value={formData.websiteUrl}
                            onChange={handleChange}
                          />
                        </div>
                      </section>

                      {/* ================= OBJECTIVES & ACTIVITIES ================= */}
                      {shouldShowSection("objectives") && (
                        <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                          <div className="flex items-start gap-3 mb-6">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <FileText className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-slate-900">
                                Objectives & Activities
                              </h4>
                              <p className="text-sm text-slate-600">
                                Define the cooperative's purpose and operations
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-4">
                            <TextArea
                              label="Main Objectives"
                              name="mainObjectives"
                              placeholder="Describe the main objectives of the cooperative"
                              rows={4}
                              required
                              value={formData.mainObjectives}
                              onChange={handleChange}
                            />

                            <TextArea
                              label="Business Activities"
                              name="businessActivities"
                              placeholder="Describe the business activities and operations"
                              rows={4}
                              required
                              value={formData.businessActivities}
                              onChange={handleChange}
                            />

                            <TextArea
                              label="Source of Funds"
                              name="sourceOfFunds"
                              placeholder="Describe sources of funds (member contributions, loans, grants, etc.)"
                              rows={3}
                              value={formData.sourceOfFunds}
                              onChange={handleChange}
                            />
                          </div>
                        </section>
                      )}

                      {/* ================= LEADERSHIP POSITIONS ================= */}
                      {shouldShowSection("leadership") && (
                        <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                          <div className="flex items-start gap-3 mb-6">
                            <div className="p-2 bg-indigo-100 rounded-lg">
                              <Users className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-slate-900">
                                Leadership Positions
                              </h4>
                              <p className="text-sm text-slate-600">
                                Key officers of the cooperative
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                              label="President/Chairman"
                              name="president"
                              placeholder="Full name of President/Chairman"
                              required
                              value={formData.president}
                              onChange={handleChange}
                            />

                            <Input
                              label="Vice President/Vice Chairman"
                              name="vicePresident"
                              placeholder="Full name of Vice President"
                              value={formData.vicePresident}
                              onChange={handleChange}
                            />

                            <Input
                              label="Secretary"
                              name="secretary"
                              placeholder="Full name of Secretary"
                              required
                              value={formData.secretary}
                              onChange={handleChange}
                            />

                            <Input
                              label="Treasurer"
                              name="treasurer"
                              placeholder="Full name of Treasurer"
                              required
                              value={formData.treasurer}
                              onChange={handleChange}
                            />
                          </div>
                        </section>
                      )}

                      {/* ================= MEMBERS ================= */}
                      {shouldShowSection("members") && (
                        <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                          <div className="flex items-start justify-between mb-6">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-teal-100 rounded-lg">
                                <Users className="w-5 h-5 text-teal-600" />
                              </div>
                              <div>
                                <h4 className="text-lg font-bold text-slate-900">
                                  Members
                                </h4>
                                <p className="text-sm text-slate-600">
                                  Add cooperative members (minimum 10 for
                                  Primary Society)
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => addArrayItem("members")}
                              className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all text-sm font-medium"
                            >
                              <Plus className="w-4 h-4" />
                              Add Member
                            </button>
                          </div>

                          {(formData.members || []).length === 0 ? (
                            <div className="text-center py-8 text-slate-500">
                              <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                              <p>
                                No members added yet. Click "Add Member" to get
                                started.
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {formData.members.map((member, index) => (
                                <div
                                  key={index}
                                  className="border-2 border-slate-200 rounded-xl p-5 bg-slate-50 relative hover:border-teal-300 transition-all"
                                >
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeArrayItem("members", index)
                                    }
                                    className="absolute top-4 right-4 p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                                    title="Remove"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>

                                  <h5 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
                                    <span className="w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center text-xs">
                                      {index + 1}
                                    </span>
                                    Member {index + 1}
                                  </h5>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                      type="text"
                                      placeholder="Full Name *"
                                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none bg-white"
                                      value={member.fullName || ""}
                                      onChange={(e) =>
                                        handleArrayChange(
                                          "members",
                                          index,
                                          "fullName",
                                          e.target.value
                                        )
                                      }
                                    />

                                    <input
                                      type="email"
                                      placeholder="Email Address"
                                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none bg-white"
                                      value={member.email || ""}
                                      onChange={(e) =>
                                        handleArrayChange(
                                          "members",
                                          index,
                                          "email",
                                          e.target.value
                                        )
                                      }
                                    />

                                    <input
                                      type="tel"
                                      placeholder="Phone Number *"
                                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none bg-white"
                                      value={member.phoneNumber || ""}
                                      onChange={(e) =>
                                        handleArrayChange(
                                          "members",
                                          index,
                                          "phoneNumber",
                                          e.target.value
                                        )
                                      }
                                    />

                                    <input
                                      type="date"
                                      placeholder="Date of Birth"
                                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none bg-white"
                                      value={member.dob || ""}
                                      onChange={(e) =>
                                        handleArrayChange(
                                          "members",
                                          index,
                                          "dob",
                                          e.target.value
                                        )
                                      }
                                    />

                                    <select
                                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none bg-white"
                                      value={member.gender || ""}
                                      onChange={(e) =>
                                        handleArrayChange(
                                          "members",
                                          index,
                                          "gender",
                                          e.target.value
                                        )
                                      }
                                    >
                                      <option value="">Select Gender</option>
                                      <option value="Male">Male</option>
                                      <option value="Female">Female</option>
                                    </select>

                                    <input
                                      type="text"
                                      placeholder="Occupation"
                                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none bg-white"
                                      value={member.occupation || ""}
                                      onChange={(e) =>
                                        handleArrayChange(
                                          "members",
                                          index,
                                          "occupation",
                                          e.target.value
                                        )
                                      }
                                    />

                                    <input
                                      type="text"
                                      placeholder="Address *"
                                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none bg-white md:col-span-2"
                                      value={member.address || ""}
                                      onChange={(e) =>
                                        handleArrayChange(
                                          "members",
                                          index,
                                          "address",
                                          e.target.value
                                        )
                                      }
                                    />

                                    <input
                                      type="text"
                                      placeholder="NIN (National ID Number)"
                                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none bg-white"
                                      value={member.nin || ""}
                                      onChange={(e) =>
                                        handleArrayChange(
                                          "members",
                                          index,
                                          "nin",
                                          e.target.value
                                        )
                                      }
                                    />

                                    <input
                                      type="number"
                                      placeholder="Number of Shares"
                                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none bg-white"
                                      value={member.numberOfShares || ""}
                                      onChange={(e) =>
                                        handleArrayChange(
                                          "members",
                                          index,
                                          "numberOfShares",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {(formData.members || []).length > 0 && (
                            <div className="mt-4 p-4 bg-teal-50 border border-teal-200 rounded-lg">
                              <p className="text-sm text-teal-900">
                                <strong>Total Members:</strong>{" "}
                                {formData.members.length}
                                {formData.cooperativeType ===
                                  "Primary Society" &&
                                  formData.members.length < 10 && (
                                    <span className="text-amber-700 ml-2">
                                      (Minimum 10 required)
                                    </span>
                                  )}
                              </p>
                            </div>
                          )}
                        </section>
                      )}

                      {/* Continue with executive committee, board members, supervisory committee sections... */}
                      {/* Apply the same pattern: all inputs with value/onChange props */}

                      {/* ================= REGISTRATION DETAILS ================= */}
                      <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                        <div className="flex items-start gap-3 mb-6">
                          <div className="p-2 bg-amber-100 rounded-lg">
                            <FileText className="w-5 h-5 text-amber-600" />
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-slate-900">
                              Registration Details
                            </h4>
                            <p className="text-sm text-slate-600">
                              Previous registration and affiliation information
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Select
                            label="Previously Registered?"
                            name="previousRegistration"
                            value={formData.previousRegistration}
                            onChange={handleChange}
                            options={[
                              { value: "", label: "Select Option" },
                              { value: "Yes", label: "Yes" },
                              { value: "No", label: "No" }
                            ]}
                          />

                          {formData.previousRegistration === "Yes" && (
                            <Input
                              label="Previous Registration Number"
                              name="previousRegNumber"
                              placeholder="Enter previous reg number"
                              value={formData.previousRegNumber}
                              onChange={handleChange}
                            />
                          )}

                          <Input
                            label="Affiliated Union (if any)"
                            name="affiliatedUnion"
                            placeholder="Name of affiliated union"
                            value={formData.affiliatedUnion}
                            onChange={handleChange}
                          />

                          <Input
                            label="Affiliated Federation (if any)"
                            name="affiliatedFederation"
                            placeholder="Name of affiliated federation"
                            value={formData.affiliatedFederation}
                            onChange={handleChange}
                          />
                        </div>
                      </section>

                      {/* ================= BANK DETAILS ================= */}
                      <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                        <div className="flex items-start gap-3 mb-6">
                          <div className="p-2 bg-rose-100 rounded-lg">
                            <FileText className="w-5 h-5 text-rose-600" />
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-slate-900">
                              Bank Details
                            </h4>
                            <p className="text-sm text-slate-600">
                              Cooperative bank account information
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Input
                            label="Bank Name"
                            name="bankName"
                            placeholder="Enter bank name"
                            required
                            value={formData.bankName}
                            onChange={handleChange}
                          />

                          <Input
                            label="Account Number"
                            name="accountNumber"
                            placeholder="Enter account number"
                            required
                            value={formData.accountNumber}
                            onChange={handleChange}
                          />

                          <Input
                            label="Account Name"
                            name="accountName"
                            placeholder="Enter account name"
                            required
                            value={formData.accountName}
                            onChange={handleChange}
                          />
                        </div>
                      </section>

                      {/* ================= DOCUMENT UPLOADS ================= */}
                      <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                        <div className="flex items-start gap-3 mb-6">
                          <div className="p-2 bg-orange-100 rounded-lg">
                            <FileText className="w-5 h-5 text-orange-600" />
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-slate-900">
                              Supporting Documents
                            </h4>
                            <p className="text-sm text-slate-600">
                              Upload required documents (images only)
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FileUpload
                            label="Cooperative Constitution *"
                            name="constitution"
                            description="Constitution/Bye-laws of the cooperative (image)"
                            onChange={handleChange}
                            fileName={formData.constitution?.name}
                            fileUrl={formData.constitutionUrl}
                          />

                          <FileUpload
                            label="Minutes of Formation Meeting *"
                            name="minutesOfFormation"
                            description="Minutes of the formation/inaugural meeting (image)"
                            onChange={handleChange}
                            fileName={formData.minutesOfFormation?.name}
                            fileUrl={formData.minutesOfFormationUrl}
                          />

                          <FileUpload
                            label="Members List *"
                            name="membersList"
                            description="Complete list of members with signatures (image)"
                            onChange={handleChange}
                            fileName={formData.membersList?.name}
                            fileUrl={formData.membersListUrl}
                          />

                          <FileUpload
                            label="Financial Statement"
                            name="financialStatement"
                            description="Audited financial statement (image, if applicable)"
                            onChange={handleChange}
                            fileName={formData.financialStatement?.name}
                            fileUrl={formData.financialStatementUrl}
                          />

                          <FileUpload
                            label="Business Plan"
                            name="businessPlan"
                            description="Detailed business plan (image)"
                            onChange={handleChange}
                            fileName={formData.businessPlan?.name}
                            fileUrl={formData.businessPlanUrl}
                          />

                          <FileUpload
                            label="Utility Bill"
                            name="utilityBill"
                            description="Proof of registered address (image)"
                            onChange={handleChange}
                            fileName={formData.utilityBill?.name}
                            fileUrl={formData.utilityBillUrl}
                          />

                          <FileUpload
                            label="CAC Certificate"
                            name="cacCertificate"
                            description="Certificate of incorporation (image, if registered with CAC)"
                            onChange={handleChange}
                            fileName={formData.cacCertificate?.name}
                            fileUrl={formData.cacCertificateUrl}
                          />

                          <FileUpload
                            label="Tax Clearance"
                            name="taxClearance"
                            description="Tax clearance certificate (image)"
                            onChange={handleChange}
                            fileName={formData.taxClearance?.name}
                            fileUrl={formData.taxClearanceUrl}
                          />

                          <FileUpload
                            label="Passport Photographs"
                            name="passportPhotos"
                            description="Passport photos of all executive members (image)"
                            onChange={handleChange}
                            fileName={formData.passportPhotos?.name}
                            fileUrl={formData.passportPhotosUrl}
                          />

                          <FileUpload
                            label="Affidavit/Statutory Declaration"
                            name="affidavit"
                            description="Sworn affidavit from officers (image)"
                            onChange={handleChange}
                            fileName={formData.affidavit?.name}
                            fileUrl={formData.affidavitUrl}
                          />
                        </div>
                      </section>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            {!fetching && formData.cooperativeType && (
              <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving Application...
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      Submit SCUML Application
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
