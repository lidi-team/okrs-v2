const lowPercent: number = 30;
const mediumPercent: number = 70;

export const customColors = (percentage: number): string => {
  if (percentage < lowPercent) {
    return '#DB2777';
  } else if (percentage < mediumPercent) {
    return '#BE185D';
  } else {
    return '#9D174D';
  }
};

export const getStatusOfProgress = (progress: number): string => {
  return progress > 0 ? 'happy' : 'sad';
};
