import React, { useState } from "react";
import {
  Target,
  TrendingUp,
  FileText,
  Sparkles,
  Download,
  Users,
  Award,
  BarChart,
  Rocket,
  DollarSign,
  Eye,
  RefreshCw
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Document, Paragraph, TextRun, Packer } from "docx";
import { saveAs } from "file-saver";

export default function EnhancedAbbyDocuments({
  documentsAbby,
  loading,
  fetchAbbyDocuments
}) {
  const [activeTab, setActiveTab] = useState("overview");

  const downloadDocx = async (content, filename) => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: content.split("\n").map(
            (line) =>
              new Paragraph({
                children: [new TextRun(line)]
              })
          )
        }
      ]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, filename.endsWith(".docx") ? filename : `${filename}.docx`);
  };

  const formatBusinessModel = (bm) => {
    return `
BUSINESS MODEL
==============

Problem Statement
-----------------
${bm.problemStatement || ""}

Solution
--------
${bm.solution || ""}

Target Market
-------------
${bm.targetMarket || ""}

Value Proposition
-----------------
${bm.valueProposition || ""}

Revenue Model
-------------
${bm.revenueModel || ""}

Key Metrics
-----------
${bm.keyMetrics || ""}

Competitive Advantage
---------------------
${bm.competitiveAdvantage || ""}

Go-To-Market Strategy
---------------------
${bm.goToMarket || ""}
`;
  };

  const formatMarketingPlan = (plan) => {
    return `
MARKETING PLAN
==============

Target Audience
---------------
${plan.targetAudience || ""}

Positioning
-----------
${plan.positioning || ""}

Channels
--------
${plan.channels || ""}

Launch Strategy
---------------
${plan.launchStrategy || ""}

Metrics
-------
${plan.metrics || ""}
`;
  };

  const downloadBusinessModel = () => {
    if (!documentsAbby?.businessModel) return;
    downloadDocx(
      formatBusinessModel(documentsAbby.businessModel),
      "business-model.docx"
    );
  };

  const downloadMarketingPlan = (index) => {
    if (!documentsAbby?.marketingPlans?.[index]) return;
    downloadDocx(
      formatMarketingPlan(documentsAbby.marketingPlans[index]),
      `marketing-plan-${index + 1}.docx`
    );
  };

  const downloadSummary = (index) => {
    if (!documentsAbby?.summaryDocuments?.[index]?.content) return;
    downloadDocx(
      documentsAbby.summaryDocuments[index].content,
      `summary-${index + 1}.docx`
    );
  };

  const downloadAll = () => {
    const allContent = `
${documentsAbby?.summaryDocuments?.[0]?.content || ""}

${"=".repeat(80)}

${formatBusinessModel(documentsAbby?.businessModel || {})}

${"=".repeat(80)}

${documentsAbby?.marketingPlans?.map((plan, i) => formatMarketingPlan(plan)).join("\n" + "=".repeat(80) + "\n") || ""}
`;
    downloadDocx(allContent, "complete-abby-documents.docx");
  };

  const hasContent =
    documentsAbby?.businessModel ||
    documentsAbby?.marketingPlans?.length > 0 ||
    documentsAbby?.summaryDocuments?.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Left Section */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold">Abby Documents</h1>
                <p className="text-slate-600 text-sm">
                  AI-generated documents from your Abby walkthrough
                </p>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={fetchAbbyDocuments}
                className="flex items-center gap-2 text-indigo-600 font-semibold px-4 py-2 rounded-full hover:bg-indigo-50 transition"
              >
                <RefreshCw className="w-5 h-5" />
                Refresh
              </button>

              {hasContent && (
                <button
                  onClick={downloadAll}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-indigo-700 transition"
                >
                  <Download className="w-5 h-5" />
                  Download All
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-xl p-20 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="text-slate-600 mt-4 font-medium">
              Loading Abby documents...
            </p>
          </div>
        ) : !hasContent ? (
          /* Empty State */
          <div className="bg-white rounded-2xl shadow-xl p-20 text-center">
            <Sparkles className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              No Abby Documents Yet
            </h3>
            <p className="text-slate-600">
              Start Abby walkthrough to generate your Business Model, Summary,
              and Marketing Plan.
            </p>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-xl mb-6 overflow-hidden">
              <div className="flex border-b border-slate-200 overflow-x-auto">
                <Tab
                  label="Overview"
                  icon={Eye}
                  active={activeTab === "overview"}
                  onClick={() => setActiveTab("overview")}
                />
                {documentsAbby.businessModel && (
                  <Tab
                    label="Business Model"
                    icon={Target}
                    active={activeTab === "business"}
                    onClick={() => setActiveTab("business")}
                  />
                )}
                {documentsAbby.marketingPlans?.length > 0 && (
                  <Tab
                    label="Marketing Plans"
                    icon={TrendingUp}
                    active={activeTab === "marketing"}
                    onClick={() => setActiveTab("marketing")}
                  />
                )}
                {documentsAbby.summaryDocuments?.length > 0 && (
                  <Tab
                    label="Summaries"
                    icon={FileText}
                    active={activeTab === "summary"}
                    onClick={() => setActiveTab("summary")}
                  />
                )}
              </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              {activeTab === "overview" && (
                <OverviewTab
                  documentsAbby={documentsAbby}
                  onDownloadBusiness={downloadBusinessModel}
                  onDownloadMarketing={downloadMarketingPlan}
                  onDownloadSummary={downloadSummary}
                />
              )}

              {activeTab === "business" && documentsAbby.businessModel && (
                <BusinessModelTab
                  data={documentsAbby.businessModel}
                  onDownload={downloadBusinessModel}
                />
              )}

              {activeTab === "marketing" && (
                <MarketingPlansTab
                  plans={documentsAbby.marketingPlans}
                  onDownload={downloadMarketingPlan}
                />
              )}

              {activeTab === "summary" && (
                <SummariesTab
                  summaries={documentsAbby.summaryDocuments}
                  onDownload={downloadSummary}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Tab({ label, icon: Icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-4 font-semibold transition whitespace-nowrap ${
        active
          ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
          : "text-slate-600 hover:text-slate-900"
      }`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );
}

function OverviewTab({
  documentsAbby,
  onDownloadBusiness,
  onDownloadMarketing,
  onDownloadSummary
}) {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {documentsAbby.businessModel && (
        <OverviewCard
          title="Business Model"
          icon={Target}
          onClick={onDownloadBusiness}
          description="Complete business strategy"
        />
      )}
      {documentsAbby.marketingPlans?.length > 0 && (
        <OverviewCard
          title={`Marketing Plan${documentsAbby.marketingPlans.length > 1 ? "s" : ""}`}
          icon={TrendingUp}
          onClick={() => onDownloadMarketing(0)}
          description={`${documentsAbby.marketingPlans.length} plan${documentsAbby.marketingPlans.length > 1 ? "s" : ""} available`}
        />
      )}
      {documentsAbby.summaryDocuments?.length > 0 && (
        <OverviewCard
          title={`Summar${documentsAbby.summaryDocuments.length > 1 ? "ies" : "y"}`}
          icon={FileText}
          onClick={() => onDownloadSummary(0)}
          description={`${documentsAbby.summaryDocuments.length} document${documentsAbby.summaryDocuments.length > 1 ? "s" : ""} available`}
        />
      )}
    </div>
  );
}

function OverviewCard({ title, icon: Icon, onClick, description }) {
  return (
    <div className="border-2 border-slate-200 rounded-xl p-6 hover:shadow-lg transition hover:border-indigo-200">
      <Icon className="w-8 h-8 text-indigo-600 mb-4" />
      <h3 className="font-bold mb-1">{title}</h3>
      <p className="text-sm text-slate-600 mb-4">{description}</p>
      <button
        onClick={onClick}
        className="text-indigo-600 font-semibold flex items-center gap-2 text-sm hover:gap-3 transition-all"
      >
        <Download className="w-4 h-4" />
        Download
      </button>
    </div>
  );
}

function BusinessModelTab({ data, onDownload }) {
  const sections = [
    ["Problem Statement", data.problemStatement, Target],
    ["Solution", data.solution, Rocket],
    ["Target Market", data.targetMarket, Users],
    ["Value Proposition", data.valueProposition, Sparkles],
    ["Revenue Model", data.revenueModel, DollarSign],
    ["Key Metrics", data.keyMetrics, BarChart],
    ["Competitive Advantage", data.competitiveAdvantage, Award],
    ["Go-To-Market Strategy", data.goToMarket, TrendingUp]
  ];

  return (
    <div className="space-y-4">
      <Header title="Business Model" onDownload={onDownload} />
      {sections.map(
        ([title, content, Icon]) =>
          content && (
            <Card key={title} title={title} content={content} icon={Icon} />
          )
      )}
    </div>
  );
}

function MarketingPlansTab({ plans, onDownload }) {
  const [selectedPlan, setSelectedPlan] = useState(0);

  if (!plans?.length) return null;

  const plan = plans[selectedPlan];
  const sections = [
    ["Target Audience", plan.targetAudience, Users],
    ["Positioning", plan.positioning, Award],
    ["Channels", plan.channels, TrendingUp],
    ["Launch Strategy", plan.launchStrategy, Rocket],
    ["Metrics", plan.metrics, BarChart]
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">Marketing Plans</h2>
          {plans.length > 1 && (
            <select
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(Number(e.target.value))}
              className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium"
            >
              {plans.map((_, i) => (
                <option key={i} value={i}>
                  Plan {i + 1}
                </option>
              ))}
            </select>
          )}
        </div>
        <button
          onClick={() => onDownload(selectedPlan)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
      </div>
      {sections.map(
        ([title, content, Icon]) =>
          content && (
            <Card key={title} title={title} content={content} icon={Icon} />
          )
      )}
    </div>
  );
}

function SummariesTab({ summaries, onDownload }) {
  const [selectedSummary, setSelectedSummary] = useState(0);

  if (!summaries?.length) return null;

  const summary = summaries[selectedSummary];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">Summaries</h2>
          {summaries.length > 1 && (
            <select
              value={selectedSummary}
              onChange={(e) => setSelectedSummary(Number(e.target.value))}
              className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium"
            >
              {summaries.map((_, i) => (
                <option key={i} value={i}>
                  Summary {i + 1}
                </option>
              ))}
            </select>
          )}
        </div>
        <button
          onClick={() => onDownload(selectedSummary)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
      </div>
      <div className="border border-slate-200 rounded-xl p-6 bg-white">
        <pre className="whitespace-pre-wrap text-slate-700 font-sans leading-relaxed">
          {summary.content || "No content available"}
        </pre>
      </div>
    </div>
  );
}

function Header({ title, onDownload }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold">{title}</h2>
      <button
        onClick={onDownload}
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition"
      >
        <Download className="w-4 h-4" />
        Download
      </button>
    </div>
  );
}

function Card({ title, content, icon: Icon }) {
  if (!content) return null;

  return (
    <div className="border border-slate-200 rounded-xl p-6 bg-white hover:shadow-md transition">
      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600">
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">{title}</h3>
      </div>
      <div className="prose prose-slate max-w-none prose-headings:font-semibold prose-h2:text-base prose-h3:text-sm prose-ul:pl-5 prose-li:marker:text-indigo-500">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
