const lowPercent: number = 30;
const mediumPercent: number = 70;

export const customColors = (percentage: number): string => {
  if (percentage < lowPercent) {
    return '#ec4899';
  } else if (percentage < mediumPercent) {
    return '#be185d';
  } else {
    return '#9d174d';
  }
};
