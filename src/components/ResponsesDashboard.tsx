import React, { useState, useMemo } from 'react';
import { SurveyResponse } from '../types/survey';
import {
  BarChart3,
  Search,
  Filter,
  Download,
  Mail,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Smartphone,
  Sparkles,
  Users,
  Star,
  Layers,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Send,
  Copy,
  Check,
  Lightbulb,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import { TARGET_SURVEY_EMAIL } from '../services/emailAutomation';
import { generateFeedbackInsights, FeedbackInsightReport } from '../services/aiInsights';

interface Props {
  responses: SurveyResponse[];
  isAdmin: boolean;
  currentUserEmail?: string;
  onResendEmail?: (response: SurveyResponse) => void;
  isResending?: boolean;
}

export const ResponsesDashboard: React.FC<Props> = ({
  responses,
  isAdmin,
  currentUserEmail,
  onResendEmail,
  isResending = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'beta' | 'sent' | 'pending'>('all');
  const [selectedItem, setSelectedItem] = useState<SurveyResponse | null>(null);

  // AI Insights State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiReport, setAiReport] = useState<FeedbackInsightReport | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);

  // Filtered list
  const filteredResponses = useMemo(() => {
    return responses.filter(item => {
      const matchesSearch =
        item.respondentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.biggestFrustration.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.desiredSolution.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = selectedRole === 'all' || item.respondentRole === selectedRole;

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'beta' && item.wantsBetaAccess) ||
        (statusFilter === 'sent' && item.emailStatus === 'sent') ||
        (statusFilter === 'pending' && item.emailStatus !== 'sent');

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [responses, searchTerm, selectedRole, statusFilter]);

  // Analytics Computations
  const stats = useMemo(() => {
    const total = responses.length;
    if (total === 0) {
      return {
        total: 0,
        avgPain: 0,
        betaRate: 0,
        deliveredRate: 0,
        topPainPoints: [] as { label: string; count: number }[],
        topFeatures: [] as { label: string; count: number }[],
        roleBreakdown: {} as { [key: string]: number }
      };
    }

    const totalPain = responses.reduce((acc, r) => acc + (r.painLevel || 3), 0);
    const betaCount = responses.filter(r => r.wantsBetaAccess).length;
    const deliveredCount = responses.filter(r => r.emailStatus === 'sent').length;

    // Pain point frequencies
    const painMap: { [key: string]: number } = {};
    responses.forEach(r => {
      r.painPoints?.forEach(p => {
        painMap[p] = (painMap[p] || 0) + 1;
      });
    });
    const topPainPoints = Object.entries(painMap)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Feature frequencies
    const featureMap: { [key: string]: number } = {};
    responses.forEach(r => {
      r.mustHaveFeatures?.forEach(f => {
        featureMap[f] = (featureMap[f] || 0) + 1;
      });
    });
    const topFeatures = Object.entries(featureMap)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Role breakdown
    const roleMap: { [key: string]: number } = {};
    responses.forEach(r => {
      const role = r.respondentRole || 'Other';
      roleMap[role] = (roleMap[role] || 0) + 1;
    });

    return {
      total,
      avgPain: Number((totalPain / total).toFixed(1)),
      betaRate: Math.round((betaCount / total) * 100),
      deliveredRate: Math.round((deliveredCount / total) * 100),
      topPainPoints,
      topFeatures,
      roleBreakdown: roleMap
    };
  }, [responses]);

  // CSV Export
  const exportToCSV = () => {
    if (responses.length === 0) return;
    const headers = [
      'ID',
      'Name',
      'Email',
      'Role',
      'Primary Device',
      'Pain Level',
      'Pain Points',
      'Biggest Frustration',
      'Desired Solution',
      'Must Have Features',
      'Killer Feature',
      'Beta Access',
      'Email Sent To',
      'Email Status',
      'Created At'
    ];

    const rows = responses.map(r => [
      `"${r.id}"`,
      `"${r.respondentName.replace(/"/g, '""')}"`,
      `"${r.userEmail}"`,
      `"${(r.respondentRole || '').replace(/"/g, '""')}"`,
      `"${(r.primaryDevice || '').replace(/"/g, '""')}"`,
      r.painLevel,
      `"${(r.painPoints || []).join('; ').replace(/"/g, '""')}"`,
      `"${(r.biggestFrustration || '').replace(/"/g, '""')}"`,
      `"${(r.desiredSolution || '').replace(/"/g, '""')}"`,
      `"${(r.mustHaveFeatures || []).join('; ').replace(/"/g, '""')}"`,
      `"${(r.killerFeature || '').replace(/"/g, '""')}"`,
      r.wantsBetaAccess ? 'Yes' : 'No',
      `"${r.emailSentTo}"`,
      `"${r.emailStatus}"`,
      `"${r.createdAt}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `vexlora-survey-responses-${new Date().toISOString().slice(0, 10)}.csv`);
    link.click();
    document.body.removeChild(link);
  };

  // AI Insights Generator (100% Free)
  const handleGenerateInsights = async () => {
    if (responses.length === 0) return;
    setIsAnalyzing(true);
    try {
      const report = await generateFeedbackInsights(responses);
      setAiReport(report);
      setIsAiModalOpen(true);
    } catch (err) {
      console.error('Failed to generate insights:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyReport = () => {
    if (!aiReport) return;
    const text = `=== Vexlora Product Intelligence Report ===
Total Submissions Evaluated: ${aiReport.totalAnalyzed}
Sentiment Score: ${aiReport.sentimentScore}

--- Executive Summary ---
${aiReport.executiveSummary}

--- Top Actionable Priorities ---
${aiReport.topPriorities.map((p, i) => `${i + 1}. ${p}`).join('\n')}

--- Strategic Roadmap Recommendations ---
${aiReport.recommendations.map(r => `• ${r}`).join('\n')}

Generated at: ${new Date().toLocaleString()}
`;
    navigator.clipboard.writeText(text);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      
      {/* Dashboard Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <BarChart3 className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Survey Submissions &amp; Analytics
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time feedback collected from users and automatically routed to{' '}
            <strong className="text-slate-800 font-semibold">{TARGET_SURVEY_EMAIL}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleGenerateInsights}
            disabled={responses.length === 0 || isAnalyzing}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 active:scale-98 rounded-xl transition-all shadow-md shadow-indigo-100 disabled:opacity-50 cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Analyzing Feedback...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>AI Insights &amp; Summary</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={exportToCSV}
            disabled={responses.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-all shadow-2xs disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Responses */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Total Responses</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {stats.total}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Live Firestore sync</p>
        </div>

        {/* Avg Pain Level */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Avg Frustration</span>
            <Star className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {stats.avgPain} <span className="text-sm font-normal text-slate-400">/ 5</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Software friction index</p>
        </div>

        {/* Beta Access Interest */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Beta Tester Opt-in</span>
            <Sparkles className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
            {stats.betaRate}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Users willing to test</p>
        </div>

        {/* Email Delivery to Vexlora */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Email Dispatch Rate</span>
            <Mail className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600">
            {stats.deliveredRate}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Routed to vexloraindia@gmail.com</p>
        </div>

      </div>

      {/* Aggregate Charts / Breakdowns */}
      {responses.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Top Pain Points Bar Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              Most Common Pain Points Reported
            </h3>
            
            <div className="space-y-3">
              {stats.topPainPoints.map((item, idx) => {
                const percent = Math.round((item.count / responses.length) * 100);
                return (
                  <div key={item.label} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-700 font-medium truncate max-w-[280px]">
                        {idx + 1}. {item.label}
                      </span>
                      <span className="text-slate-500 font-semibold">{item.count} votes ({percent}%)</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Requested Features */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
              Top Must-Have Features Wanted
            </h3>
            
            <div className="space-y-3">
              {stats.topFeatures.map((item, idx) => {
                const percent = Math.round((item.count / responses.length) * 100);
                return (
                  <div key={item.label} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-700 font-medium truncate max-w-[280px]">
                        {idx + 1}. {item.label}
                      </span>
                      <span className="text-slate-500 font-semibold">{item.count} votes ({percent}%)</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* Submissions List & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        
        {/* Controls */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50">
          
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by name, problem, or idea..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" />
              Role:
            </span>
            <select
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value)}
              className="text-xs py-2 px-3 rounded-xl border border-slate-300 bg-white text-slate-700 w-full sm:w-auto focus:border-indigo-600"
            >
              <option value="all">All Roles ({responses.length})</option>
              {Object.keys(stats.roleBreakdown).map(role => (
                <option key={role} value={role}>
                  {role} ({stats.roleBreakdown[role]})
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Quick Status Filter Tabs */}
        <div className="flex items-center gap-1.5 px-4 sm:px-5 py-2.5 border-b border-slate-100 overflow-x-auto text-xs bg-slate-50/50">
          <span className="text-slate-400 font-medium shrink-0 mr-1">Filter:</span>
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100 bg-white border border-slate-200'
            }`}
          >
            All ({responses.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('beta')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 cursor-pointer ${
              statusFilter === 'beta'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100 bg-white border border-slate-200'
            }`}
          >
            ⭐ Beta Testers ({responses.filter(r => r.wantsBetaAccess).length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('sent')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 cursor-pointer ${
              statusFilter === 'sent'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100 bg-white border border-slate-200'
            }`}
          >
            ✅ Emailed to Vexlora ({responses.filter(r => r.emailStatus === 'sent').length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 cursor-pointer ${
              statusFilter === 'pending'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100 bg-white border border-slate-200'
            }`}
          >
            ⚠️ Delivery Pending ({responses.filter(r => r.emailStatus !== 'sent').length})
          </button>
        </div>

        {/* Responses Table / Card List */}
        {filteredResponses.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
              <BarChart3 className="w-6 h-6" />
            </div>
            <p className="font-medium text-slate-800 text-sm">No survey responses found</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {responses.length === 0
                ? 'Be the first to submit feedback using the "Survey Form" tab above!'
                : 'Try adjusting your search terms or role filter.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredResponses.map(item => (
              <div
                key={item.id}
                className="p-5 sm:p-6 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-start justify-between gap-4"
              >
                
                {/* Content summary */}
                <div className="space-y-2 flex-1">
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {item.respondentName}
                    </span>
                    <span className="text-xs text-slate-400">({item.userEmail})</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                      {item.respondentRole}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-semibold">
                      Pain: {item.painLevel}/5
                    </span>
                    {item.wantsBetaAccess && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                        Beta Tester
                      </span>
                    )}
                  </div>

                  {/* Frustration snippet */}
                  <div className="text-xs text-slate-700 line-clamp-2">
                    <strong className="text-red-700 font-semibold">Problem: </strong>
                    {item.biggestFrustration}
                  </div>

                  {/* Desired solution snippet */}
                  <div className="text-xs text-slate-700 line-clamp-2">
                    <strong className="text-indigo-700 font-semibold">Suggested Solution: </strong>
                    {item.desiredSolution}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-slate-500">
                    <span className="text-slate-400">Device: {item.primaryDevice}</span>
                    <span>•</span>
                    <span>Created: {new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>

                </div>

                {/* Right side: Email status & actions */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-2.5 shrink-0">
                  
                  {/* Email status badge */}
                  <div className="flex items-center gap-1.5 text-xs">
                    {item.emailStatus === 'sent' ? (
                      <span className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/50">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Emailed to Vexlora
                      </span>
                    ) : item.emailStatus === 'failed' ? (
                      <span className="flex items-center gap-1 text-amber-700 font-semibold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/50">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        Email Pending
                      </span>
                    ) : (
                      <span className="text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-full">
                        Saved in DB
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`mailto:${item.userEmail}?subject=${encodeURIComponent(`Thank you for your Vexlora feedback, ${item.respondentName}`)}&body=${encodeURIComponent(`Hi ${item.respondentName},\n\nThank you for taking the time to share your feedback with Vexlora!\n\nWe noted your thoughts regarding:\n"${item.biggestFrustration}"\n\nWe are actively working on this and would love to stay in touch!\n\nBest regards,\nThe Vexlora Team\nvexloraindia@gmail.com`)}`}
                      className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1 cursor-pointer"
                      title={`Send email directly to ${item.userEmail}`}
                    >
                      <Mail className="w-3 h-3 text-indigo-500" />
                      Reply
                    </a>

                    {onResendEmail && item.emailStatus !== 'sent' && (
                      <button
                        type="button"
                        onClick={() => onResendEmail(item)}
                        disabled={isResending}
                        className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-indigo-200 text-indigo-700 hover:bg-indigo-50 transition-colors flex items-center gap-1"
                        title="Resend to vexloraindia@gmail.com"
                      >
                        <Send className="w-3 h-3" />
                        Resend
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setSelectedItem(item)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Details
                    </button>
                  </div>

                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* Detail Inspection Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-5 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">Full Response Details</h3>
                <p className="text-xs text-indigo-100">
                  Submitted by {selectedItem.respondentName} on {new Date(selectedItem.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs text-slate-700">
              
              {/* Profile Card */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 font-medium block">Respondent:</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedItem.respondentName}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Email:</span>
                  <span className="font-semibold text-indigo-600">{selectedItem.userEmail}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Role:</span>
                  <span className="font-medium text-slate-800">{selectedItem.respondentRole}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Primary Device:</span>
                  <span className="font-medium text-slate-800">{selectedItem.primaryDevice}</span>
                </div>
              </div>

              {/* Problems Section */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-sm border-b pb-1 text-red-600">
                  Problems &amp; Pain Points
                </h4>
                
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800">Frustration Rating:</span>
                  <span className="bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded-full">
                    {selectedItem.painLevel} / 5
                  </span>
                </div>

                <div>
                  <span className="font-semibold text-slate-800 block mb-1">Reported Pain Points:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedItem.painPoints?.map(p => (
                      <span key={p} className="bg-red-50 text-red-700 border border-red-200/60 px-2 py-0.5 rounded-md text-[11px]">
                        • {p}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-semibold text-slate-800 block mb-1">Daily Headache / Bottleneck:</span>
                  <div className="p-3 bg-red-50/50 rounded-xl border border-red-100 text-slate-800 whitespace-pre-wrap">
                    {selectedItem.biggestFrustration}
                  </div>
                </div>
              </div>

              {/* Suggestions Section */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-sm border-b pb-1 text-indigo-600">
                  Proposed Solutions &amp; Wishlist
                </h4>

                <div>
                  <span className="font-semibold text-slate-800 block mb-1">Desired App/Website:</span>
                  <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-slate-800 whitespace-pre-wrap">
                    {selectedItem.desiredSolution}
                  </div>
                </div>

                <div>
                  <span className="font-semibold text-slate-800 block mb-1">Must-Have Features:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedItem.mustHaveFeatures?.map(f => (
                      <span key={f} className="bg-indigo-50 text-indigo-700 border border-indigo-200/60 px-2 py-0.5 rounded-md text-[11px]">
                        ✔ {f}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedItem.killerFeature && (
                  <div>
                    <span className="font-semibold text-slate-800 block mb-1">Requested Killer Feature:</span>
                    <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900 font-medium">
                      {selectedItem.killerFeature}
                    </div>
                  </div>
                )}

                {selectedItem.additionalNotes && (
                  <div>
                    <span className="font-semibold text-slate-800 block mb-1">Additional Notes:</span>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 whitespace-pre-wrap">
                      {selectedItem.additionalNotes}
                    </div>
                  </div>
                )}
              </div>

              {/* Delivery Receipt */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800 block">Sent to Vexlora:</span>
                  <span className="text-slate-500">{selectedItem.emailSentTo}</span>
                </div>
                <span className="font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Status: {selectedItem.emailStatus}
                </span>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
              <a
                href={`mailto:${selectedItem.userEmail}?subject=${encodeURIComponent(`Regarding your Vexlora feedback, ${selectedItem.respondentName}`)}&body=${encodeURIComponent(`Hi ${selectedItem.respondentName},\n\nThank you for taking the time to share your feedback with Vexlora!\n\nWe are actively reviewing your thoughts on:\n"${selectedItem.biggestFrustration}"\n\n${selectedItem.wantsBetaAccess ? 'Since you opted in for early beta access, we will keep you directly posted as soon as preview builds are ready.\n\n' : ''}Best regards,\nThe Vexlora Team\nvexloraindia@gmail.com`)}`}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                Reply to {selectedItem.respondentName}
              </a>

              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* AI Product Insights Modal */}
      {isAiModalOpen && aiReport && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 px-6 py-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-xs">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">Vexlora Product Intelligence</h3>
                  <p className="text-xs text-indigo-100">
                    Executive Analysis of {aiReport.totalAnalyzed} Survey Responses • {aiReport.isAiGenerated ? 'Gemini AI Engine' : 'Built-in Analytics Engine'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAiModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs text-slate-700">
              
              {/* Sentiment & Volume Card */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 font-semibold block text-[11px] uppercase tracking-wider">User Sentiment Score</span>
                  <span className="text-sm font-bold text-slate-900">{aiReport.sentimentScore}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 font-semibold block text-[11px] uppercase tracking-wider">Responses Evaluated</span>
                  <span className="text-sm font-bold text-indigo-600">{aiReport.totalAnalyzed} submissions</span>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 text-indigo-600">
                  <TrendingUp className="w-4 h-4" />
                  Executive Summary
                </h4>
                <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100 text-slate-800 leading-relaxed text-xs">
                  {aiReport.executiveSummary}
                </div>
              </div>

              {/* Top Priorities */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 text-red-600">
                  <Lightbulb className="w-4 h-4" />
                  Top Actionable Priorities
                </h4>
                <div className="space-y-2">
                  {aiReport.topPriorities.map((item, idx) => (
                    <div key={idx} className="p-3 bg-red-50/50 rounded-xl border border-red-100 flex items-start gap-2.5">
                      <span className="w-5 h-5 bg-red-100 text-red-700 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-slate-800 leading-normal">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strategic Roadmap Recommendations */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                  Roadmap Recommendations
                </h4>
                <div className="space-y-2">
                  {aiReport.recommendations.map((rec, idx) => (
                    <div key={idx} className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-start gap-2.5">
                      <span className="text-emerald-600 font-bold shrink-0 mt-0.5">✔</span>
                      <span className="text-slate-800 leading-normal">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleCopyReport}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                {copiedReport ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copy Full Report</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsAiModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors cursor-pointer"
              >
                Close Report
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
