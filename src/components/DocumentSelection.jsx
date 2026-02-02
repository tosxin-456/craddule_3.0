import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../config/apiConfig";
import { CacComplianceForm } from "./CacComplianceForm";
import { FirsComplianceForm } from "./FirsComplianceForm";
import { ScumlComplianceForm } from "./ScumlComplianceForm";

export function DocumentSelectionModal() {
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [cacFormData, setCacFormData] = useState({});
  const [cacErrors, setCacErrors] = useState({});

  const token = localStorage.getItem("token");

  // Fetch user's existing selection
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
            // No selection → show modal
            setShowModal(true);
          } else {
            setSelectedDocs(docs);
          }
        }
      } catch (err) {
        console.error("Failed to fetch selection:", err);
        // toast.error("Failed to fetch your documents");
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

  if (fetching) {
    return (
      <div className="text-center text-blue-600 py-6">
        Loading your documents...
      </div>
    );
  }

  return (
    <>
      {/* Modal for first-time selection */}
      {showModal && (
        <div className="bg-white rounded-2xl shadow-lg max-w-2xl w-full p-6">
          <h3 className="text-lg font-semibold mb-2">
            Select Documents to Fill
          </h3>

          <p className="text-gray-600 mb-4">
            If the document you need isn’t listed, please contact{" "}
            <a
              href="mailto:info@craddule.com"
              className="text-blue-600 underline"
            >
              info@craddule.com
            </a>
            .
          </p>

          <div className="flex flex-col space-y-3">
            {["CAC", "FIRS", "SCUML"].map((doc) => (
              <label key={doc} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={doc}
                  checked={selectedDocs.includes(doc)}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedDocs((prev) =>
                      prev.includes(value)
                        ? prev.filter((d) => d !== value)
                        : [...prev, value]
                    );
                  }}
                  className="h-4 w-4"
                />
                <span>{doc}</span>
              </label>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-4 w-full px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold hover:from-blue-700 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Submit"}
          </button>
        </div>
      )}

      {/* Directly show forms if user has selected */}
      {!showModal && selectedDocs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedDocs.includes("CAC") && (
            <div className=" p-3 ">
              <CacComplianceForm
                formData={cacFormData}
                setFormData={setCacFormData}
                errors={cacErrors}
              />
            </div>
          )}

          {selectedDocs.includes("FIRS") && (
            <div className="p-3 ">
              <FirsComplianceForm />
            </div>
          )}

          {selectedDocs.includes("SCUML") && (
            <div className=" p-3 ">
              <ScumlComplianceForm />
            </div>
          )}
        </div>
      )}
    </>
  );
}
