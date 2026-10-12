export interface SurveyResponse {
  id: string;
  userId: string;
  userEmail: string;
  respondentName: string;
  respondentRole: string;
  primaryDevice: string;
  painPoints: string[];
  biggestFrustration: string;
  painLevel: number; // 1 - 5
  desiredSolution: string;
  mustHaveFeatures: string[];
  killerFeature: string;
  wantsBetaAccess: boolean;
  additionalNotes?: string;
  emailSentTo: string;
  emailStatus: 'sent' | 'pending' | 'failed' | 'draft';
  createdAt: string;
  updatedAt: string;
}

export interface SurveyFormData {
  respondentName: string;
  respondentRole: string;
  primaryDevice: string;
  painPoints: string[];
  biggestFrustration: string;
  painLevel: number;
  desiredSolution: string;
  mustHaveFeatures: string[];
  killerFeature: string;
  wantsBetaAccess: boolean;
  additionalNotes: string;
}

export const ROLE_OPTIONS = [
  'Software Developer / Engineer',
  'Student / Learner',
  'Startup Founder / Entrepreneur',
  'Product Manager / Designer',
  'Business Owner / Operations',
  'Freelancer / Consultant',
  'Everyday App & Web User',
  'Other'
];

export const DEVICE_OPTIONS = [
  'Android Smartphone',
  'iPhone / iOS',
  'Windows PC / Laptop',
  'MacBook / macOS',
  'iPad / Android Tablet',
  'Linux / Chromebook'
];

export const PAIN_POINT_OPTIONS = [
  { id: 'slow_loading', label: 'Slow loading speeds & laggy UI', icon: 'zap-off' },
  { id: 'cluttered_ui', label: 'Overly complex, confusing interface', icon: 'layout' },
  { id: 'ads_and_popups', label: 'Intrusive advertisements & popup banners', icon: 'bell-off' },
  { id: 'poor_mobile_design', label: 'Poor mobile responsiveness / buggy on phone', icon: 'smartphone' },
  { id: 'expensive_paywalls', label: 'Expensive subscriptions & unexpected paywalls', icon: 'dollar-sign' },
  { id: 'offline_unavailable', label: 'Zero offline functionality or lost unsaved work', icon: 'wifi-off' },
  { id: 'weak_search', label: 'Bad search / hard to find what I need', icon: 'search' },
  { id: 'data_privacy', label: 'Excessive permissions & privacy concerns', icon: 'shield-alert' },
  { id: 'lack_of_support', label: 'No customer support or helpful guidance', icon: 'help-circle' }
];

export const FEATURE_WISHLIST_OPTIONS = [
  'Lightning-fast performance & instant load',
  'Minimalist, distraction-free clean design',
  'Reliable offline support & local autosave',
  'Intelligent AI assistant / automated shortcuts',
  'No ads, no tracking, strict privacy',
  'Seamless cross-device sync (Mobile & Desktop)',
  'Affordable or generous free tier',
  'One-click sharing & collaboration',
  'Dark mode & customizable theme',
  'Keyboard shortcuts & power-user tools'
];
