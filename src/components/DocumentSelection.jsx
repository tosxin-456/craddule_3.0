import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../config/apiConfig";
import { CacComplianceForm } from "./CacComplianceForm";
import { FirsComplianceForm } from "./FirsComplianceForm";
import { ScumlComplianceForm } from "./ScumlComplianceForm";
import { Building2, Receipt, Shield, CheckCircle2 } from "lucide-react";

export function DocumentSelectionModal() {
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [cacFormData, setCacFormData] = useState({});
  const [cacErrors, setCacErrors] = useState({});

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchSelection = async () => {
      setFetching(true);
      try {
        const res = await fetch(`${API_BASE_URL}/document-selection`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          const docs = data.selection?.selectedDocuments || [];
          if (docs.length === 0) {
            setShowModal(true);
          } else {
            setSelectedDocs(docs);
          }
        }
      } catch (err) {
        console.error("Failed to fetch selection:", err);
      } finally {
        setFetching(false);
      }
    };
    fetchSelection();
  }, [token]);

  const handleSubmit = async () => {
    if (selectedDocs.length === 0) {
      toast.error("Please select at least one document!");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/document-selection`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ selectedDocuments: selectedDocs })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Documents saved successfully!");
        setShowModal(false);
      } else {
        toast.error(data.message || "Failed to save documents");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while saving");
    } finally {
      setLoading(false);
    }
  };

  const docOptions = [
    {
      label: "CAC",
      value: "CAC",
      description: "Company registration & compliance",
      icon: <Building2 className="w-5 h-5 text-emerald-600" />,
      bg: "from-emerald-100 to-teal-100",
      border: "border-emerald-300",
      ring: "ring-emerald-400"
    },
    {
      label: "TIN",
      value: "FIRS",
      description: "Tax Identification Number",
      icon: <Receipt className="w-5 h-5 text-blue-600" />,
      bg: "from-blue-100 to-indigo-100",
      border: "border-blue-300",
      ring: "ring-blue-400"
    },
    {
      label: "SCUML",
      value: "SCUML",
      description: "Special Control Unit registration",
      icon: <Shield className="w-5 h-5 text-purple-600" />,
      bg: "from-purple-100 to-indigo-100",
      border: "border-purple-300",
      ring: "ring-purple-400"
    }
  ];

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-blue-200 border-t-blue-600 animate-spin" />
        <p className="text-sm text-gray-400 font-medium">
          Loading your documents…
        </p>
      </div>
    );
  }

  return (
    <>
      {/* First-time selection modal */}
      {showModal && (
        <div className="flex items-center justify-center min-h-[60vh] px-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm w-full max-w-md overflow-hidden">
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900 tracking-tight">
                Choose your documents
              </h3>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Select the registrations you'd like us to handle for you.
              </p>
            </div>

            {/* Options */}
            <div className="px-6 py-4 flex flex-col gap-3">
              {docOptions.map((doc) => {
                const isSelected = selectedDocs.includes(doc.value);
                return (
                  <button
                    key={doc.value}
                    onClick={() =>
                      setSelectedDocs((prev) =>
                        prev.includes(doc.value)
                          ? prev.filter((d) => d !== doc.value)
                          : [...prev, doc.value]
                      )
                    }
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                      isSelected
                        ? `${doc.border} bg-gray-50 ${doc.ring} ring-1`
                        : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${doc.bg} flex items-center justify-center shrink-0`}
                    >
                      {doc.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">
                        {doc.label}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {doc.description}
                      </p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                        isSelected
                          ? "bg-gray-900 border-gray-900"
                          : "border-gray-300"
                      }`}
                    >
                      {isSelected && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 flex flex-col gap-3">
              <button
                onClick={handleSubmit}
                disabled={loading || selectedDocs.length === 0}
                className="w-full py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Saving…"
                  : `Continue with ${selectedDocs.length || 0} selected`}
              </button>
              <p className="text-center text-xs text-gray-400">
                Don't see what you need?{" "}
                <a
                  href="mailto:info@craddule.com"
                  className="text-blue-500 hover:underline"
                >
                  Contact us
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Forms grid — equal height columns */}
      {!showModal && selectedDocs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:auto-rows-fr">
          {selectedDocs.includes("CAC") && (
            <div className="flex flex-col h-full">
              <CacComplianceForm
                formData={cacFormData}
                setFormData={setCacFormData}
                errors={cacErrors}
              />
            </div>
          )}
          {selectedDocs.includes("FIRS") && (
            <div className="flex flex-col h-full">
              <FirsComplianceForm />
            </div>
          )}
          {selectedDocs.includes("SCUML") && (
            <div className="flex flex-col h-full">
              <ScumlComplianceForm />
            </div>
          )}
        </div>
      )}
    </>
  );
}
