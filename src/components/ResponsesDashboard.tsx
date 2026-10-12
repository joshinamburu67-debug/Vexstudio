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
  Send
} from 'lucide-react';
import { TARGET_SURVEY_EMAIL } from '../services/gmail';

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
  const [selectedItem, setSelectedItem] = useState<SurveyResponse | null>(null);

  // Filtered list
  const filteredResponses = useMemo(() => {
    return responses.filter(item => {
      const matchesSearch =
        item.respondentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.biggestFrustration.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.desiredSolution.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = selectedRole === 'all' || item.respondentRole === selectedRole;
      return matchesSearch && matchesRole;
    });
  }, [responses, searchTerm, selectedRole]);

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
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors flex items-center gap-1"
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
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
