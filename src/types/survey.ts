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
  'Working Professional / Individual',
  'Student / Learner',
  'Business Owner / Operations',
  'Freelancer / Consultant',
  'Software Developer / Engineer',
  'Creator / Designer',
  'Everyday User / Daily Problem Solver',
  'Other'
];

export const DEVICE_OPTIONS = [
  'Android Smartphone',
  'iPhone / iOS',
  'Windows PC / Laptop',
  'MacBook / macOS',
  'iPad / Android Tablet',
  'Linux / Other'
];

export const PAIN_POINT_OPTIONS = [
  { id: 'slow_workflows', label: 'Slow workflows & laggy systems wasting my time', icon: 'zap-off' },
  { id: 'confusing_processes', label: 'Overly complicated processes & confusing tools', icon: 'layout' },
  { id: 'repetitive_tasks', label: 'Repetitive manual tasks that drain hours each day', icon: 'clock' },
  { id: 'mobile_headaches', label: 'Inconvenient or broken experience on mobile phone', icon: 'smartphone' },
  { id: 'expensive_paywalls', label: 'Unfair prices & expensive subscription paywalls', icon: 'dollar-sign' },
  { id: 'lost_work', label: 'Lost work, unsaved progress, or disorganization', icon: 'wifi-off' },
  { id: 'hard_to_find', label: 'Hard to find information or organize daily tasks', icon: 'search' },
  { id: 'privacy_concerns', label: 'Data privacy, security, and spam concerns', icon: 'shield-alert' },
  { id: 'lack_of_support', label: 'Zero direct help or guidance when facing issues', icon: 'help-circle' }
];

export const FEATURE_WISHLIST_OPTIONS = [
  'Automates repetitive work to save hours',
  'Clean, dead-simple process with zero learning curve',
  'Instant speed & zero waiting around',
  'Smart AI assistance to do the heavy lifting',
  'Works seamlessly on mobile and desktop',
  'Reliable offline mode & automatic saving',
  'Direct problem-solving with no useless clutter',
  'Affordable or open free access for everyone',
  'Fast sharing & collaboration with team or family',
  'Strict privacy — 100% secure personal data'
];

