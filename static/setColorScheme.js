const applyIcon = (type) => {
  const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
  link.type = 'image/x-icon';
  link.rel = 'shortcut icon';

  if (type === 'dark') {
    link.href = '/favicon-white.ico';
  } else {
    link.href = '/favicon-dark.ico';
  }

  document.getElementsByTagName('head')[0].appendChild(link);
};

const activateDarkMode = () => {
  document.querySelector("link[rel='icon-white']").href = 'favicon-white.ico';
  document.querySelector("link[rel='icon-white']").rel = 'icon-white';
};

const activateLightMode = () => {
  document.querySelector("link[rel='icon-dark']").href = 'favicon-dark.ico';
  document.querySelector("link[rel='icon-dark']").rel = 'icon-dark';
};

export default () => {
  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isLightMode = window.matchMedia('(prefers-color-scheme: light)').matches;
  const isNotSpecified = window.matchMedia('(prefers-color-scheme: no-preference)').matches;
  const hasNoSupport = !isDarkMode && !isLightMode && !isNotSpecified;

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
    // Dark mode
    if (event.matches) {
      activateDarkMode();
    } else {
      activateLightMode();
    }
  });

  // set a dark theme during night time
  if (isNotSpecified || hasNoSupport) {
    const now = new Date();
    const hour = now.getHours();
    if (hour < 4 || hour >= 16) {
      activateDarkMode();
    }
  }
  activateDarkMode();
};
