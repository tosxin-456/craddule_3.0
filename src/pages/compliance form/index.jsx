import { useParams } from "react-router-dom";
import { Save } from "lucide-react";

export default function ComplianceForm() {
  const { docType } = useParams();

  return (
    <div className="max-w-2xl space-y-6">
      <header>
        <h1 className="text-xl font-semibold">{titleMap[docType]}</h1>
        <p className="text-muted-foreground">
          Complete this form accurately. Craddule will review and process it.
        </p>
      </header>

      <form className="space-y-4">
        <Input label="Legal Business Name" />
        <Input label="Founder Full Name" />
        <Input label="Business Address" />
        <Input label="Identification Number" />

        <Upload label="Supporting Document (if any)" />

        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white"
        >
          <Save className="w-4 h-4" />
          Submit for Processing
        </button>
      </form>
    </div>
  );
}

const titleMap = {
  license: "Industry License Application",
  tin: "Tax Identification Application"
};

function Input({ label }) {
  return (
    <div className="space-y-1">
      <label className="text-sm">{label}</label>
      <input className="w-full border rounded-lg px-3 py-2" />
    </div>
  );
}

function Upload({ label }) {
  return (
    <div className="space-y-1">
      <label className="text-sm">{label}</label>
      <input type="file" className="w-full" />
    </div>
  );
}
