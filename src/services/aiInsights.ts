import { SurveyResponse } from '../types/survey';

export interface FeedbackInsightReport {
  executiveSummary: string;
  topPriorities: string[];
  sentimentScore: string;
  recommendations: string[];
  totalAnalyzed: number;
  isAiGenerated: boolean;
}

/**
 * Generates an executive feedback insight report.
 * 100% Free:
 * - Uses Google Gemini free-tier if VITE_GEMINI_API_KEY is configured.
 * - Otherwise falls back to an intelligent client-side analytical synthesizer.
 */
export async function generateFeedbackInsights(
  responses: SurveyResponse[]
): Promise<FeedbackInsightReport> {
  if (!responses || responses.length === 0) {
    return {
      executiveSummary: 'No feedback submissions recorded yet.',
      topPriorities: [],
      sentimentScore: 'N/A',
      recommendations: ['Share the survey link to gather user feedback.'],
      totalAnalyzed: 0,
      isAiGenerated: false
    };
  }

  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (import.meta as any).env?.GEMINI_API_KEY;

  if (apiKey && typeof apiKey === 'string' && apiKey.trim().length > 10) {
    try {
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey: apiKey.trim() });

      const simplifiedData = responses.slice(0, 30).map(r => ({
        role: r.respondentRole,
        painLevel: r.painLevel,
        painPoints: r.painPoints,
        biggestFrustration: r.biggestFrustration,
        desiredSolution: r.desiredSolution,
        mustHaveFeatures: r.mustHaveFeatures,
        killerFeature: r.killerFeature,
        wantsBeta: r.wantsBetaAccess
      }));

      const prompt = `You are a Problem Solving & Product Strategy Expert analyzing problem submissions for Vexlora. The mission is: 'Tell us your problem, let us solve it. Save your time and get big outputs with real solutions.' Analyze how to best solve these real user and people problems and identify their biggest time drains:
Analyze these ${responses.length} survey responses:
${JSON.stringify(simplifiedData, null, 2)}

Respond with a JSON object in exactly this format:
{
  "executiveSummary": "2-3 sentences summarizing user feedback trends and major market opportunity.",
  "topPriorities": ["Priority 1", "Priority 2", "Priority 3"],
  "sentimentScore": "e.g. 78% Critical / High Frustration",
  "recommendations": ["Actionable recommendation 1", "Actionable recommendation 2", "Actionable recommendation 3"]
}`;

      const res = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      const text = res.text || '';
      const cleanJson = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      return {
        executiveSummary: parsed.executiveSummary || 'Feedback analysis generated successfully.',
        topPriorities: parsed.topPriorities || [],
        sentimentScore: parsed.sentimentScore || 'High User Interest',
        recommendations: parsed.recommendations || [],
        totalAnalyzed: responses.length,
        isAiGenerated: true
      };
    } catch (err) {
      console.warn('Gemini API call skipped or failed, falling back to local analysis engine:', err);
      // Fall through to local analytical engine
    }
  }

  // 100% Free Local Analytical Engine (Runs instantly without API keys or servers)
  return generateLocalInsights(responses);
}

/**
 * Pure client-side analytical synthesizer (Zero rupees, zero dependencies)
 */
function generateLocalInsights(responses: SurveyResponse[]): FeedbackInsightReport {
  const total = responses.length;
  const avgPain = (responses.reduce((sum, r) => sum + (r.painLevel || 3), 0) / total).toFixed(1);
  const betaOptIns = responses.filter(r => r.wantsBetaAccess).length;
  const betaPct = Math.round((betaOptIns / total) * 100);

  // Pain point counts
  const painFreq: { [key: string]: number } = {};
  responses.forEach(r => {
    r.painPoints?.forEach(p => {
      painFreq[p] = (painFreq[p] || 0) + 1;
    });
  });
  const topPains = Object.entries(painFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([p]) => p);

  // Feature frequencies
  const featureFreq: { [key: string]: number } = {};
  responses.forEach(r => {
    r.mustHaveFeatures?.forEach(f => {
      featureFreq[f] = (featureFreq[f] || 0) + 1;
    });
  });
  const topFeatures = Object.entries(featureFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([f]) => f);

  const topPriorities = [
    topPains[0] ? `Directly eliminate user friction with "${topPains[0]}"` : 'Streamline core workflows',
    topFeatures[0] ? `Prioritize implementation of "${topFeatures[0]}" in early beta` : 'Focus on performance & fast load speeds',
    topFeatures[1] ? `Deliver "${topFeatures[1]}" to satisfy power users` : 'Ensure reliable offline support'
  ];

  const recommendations = [
    `Reach out to the ${betaOptIns} respondents (${betaPct}%) who explicitly requested early beta access.`,
    `Focus marketing messaging on solving user frustration (average severity ${avgPain}/5.0).`,
    `Highlight "${topFeatures[0] || 'lightning-fast speed'}" as the core differentiator on the landing page.`
  ];

  const summary = `Based on ${total} submitted user responses, users report an average frustration level of ${avgPain}/5.0 with existing tools. The strongest market demand centers on solving "${topPains[0] || 'slow performance'}" while delivering "${topFeatures[0] || 'minimalist design'}", with ${betaPct}% of respondents actively requesting early beta tester access.`;

  return {
    executiveSummary: summary,
    topPriorities,
    sentimentScore: Number(avgPain) >= 3.8 ? '🔥 High Frustration / Strong Pain Point' : '⚖️ Moderate Frustration',
    recommendations,
    totalAnalyzed: total,
    isAiGenerated: false
  };
}
