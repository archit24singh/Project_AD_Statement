// Utility functions for file handling
export const generateFileName = (): string => {
  const timestamp = new Date().getTime();
  return `statement-${timestamp}.pdf`;
};