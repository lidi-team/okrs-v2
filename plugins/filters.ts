import Vue from 'vue';

Vue.filter('round', function (value: number): number {
  return Math.round(value * 100) / 100;
});

Vue.filter('isUpProgress', function (value: number): string {
  return value > 0 ? 'happy' : 'sad';
});

Vue.filter('verifyProgress', function (value: any): number {
  if (isNaN(value) || value === Infinity) {
    return 0;
  } else return Number(value);
});

Vue.filter('filterImage', function (value: string): string {
  return value ? value : 'https://thumbs.gfycat.com/ClearGiddyAmoeba-small.gif';
});

Vue.filter('textActiveEmployee', function (value: boolean): string {
  return value ? 'Hoạt động' : 'Tạm khóa';
});

Vue.filter('textActiveProject', function (value: boolean): string {
  return value ? 'Hoạt động' : 'Đã đóng';
});

Vue.filter('tagActive', function (value: boolean): string {
  return value ? 'success' : 'danger';
});

Vue.filter('customColors', function (percentage: number): string {
  if (percentage < 30) {
    return '#ec4899';
  } else if (percentage < 70) {
    return '#be185d';
  } else {
    return '#9d174d';
  }
});

Vue.filter('statusProgress', function (progress: number): string {
  return progress > 0 ? 'happy' : 'sad';
});
