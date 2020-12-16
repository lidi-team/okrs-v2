const lowPercent: number = 30;
const mediumPercent: number = 70;

export const customColors = (percentage: number): string => {
  if (percentage < lowPercent) {
    return '#DB2777'; // Purple-500
  } else if (percentage < mediumPercent) {
    return '#BE185D'; // Purple-600
  } else {
    return '#9D174D'; // primary-purple-4
  }
};
