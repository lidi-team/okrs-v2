export default function debounce(func: any, wait: any, immediate: any): any {
  let timeout, args, context;
  const timestamp = 0;

  const later = function () {
    const last = +new Date() - timestamp;
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };
}
