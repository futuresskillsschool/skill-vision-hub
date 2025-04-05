
// Helper functions for career vision calculations

export const calculateRealism = (options: Record<string, string>): number => {
  // Realistic scoring logic
  return Object.values(options).filter(v => ['a', 'd', 'g'].includes(v)).length;
};

export const calculateInvestigative = (options: Record<string, string>): number => {
  // Investigative scoring logic
  return Object.values(options).filter(v => ['b', 'e', 'h'].includes(v)).length;
};

export const calculateArtistic = (options: Record<string, string>): number => {
  // Artistic scoring logic
  return Object.values(options).filter(v => ['c', 'f', 'i'].includes(v)).length;
};

export const calculateSocial = (options: Record<string, string>): number => {
  // Social scoring logic
  return Object.values(options).filter(v => ['j', 'm', 'p'].includes(v)).length;
};

export const calculateEnterprising = (options: Record<string, string>): number => {
  // Enterprising scoring logic
  return Object.values(options).filter(v => ['k', 'n', 'q'].includes(v)).length;
};

export const calculateConventional = (options: Record<string, string>): number => {
  // Conventional scoring logic
  return Object.values(options).filter(v => ['l', 'o', 'r'].includes(v)).length;
};
