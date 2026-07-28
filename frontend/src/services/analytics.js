const GTM_ID = 'GTM-WQSZ5KZL';
const POSTHOG_KEY = 'phc_xAvL2Iq4tFmANRE7kzbKwaSqp1HJjN7x48s3vr0CMjs';
const POSTHOG_HOST = 'https://us.i.posthog.com';

const loadGoogleTagManager = () => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  document.head.appendChild(script);
};

const loadPostHog = () => {
  const posthog = (window.posthog = window.posthog || []);
  if (posthog.__SV) return;

  posthog._i = [];
  posthog.init = (key, options, name = 'posthog') => {
    const queue = name === 'posthog' ? posthog : (posthog[name] = []);
    const methods = [
      'capture',
      'captureException',
      'identify',
      'setPersonProperties',
      'reset',
      'opt_in_capturing',
      'opt_out_capturing',
      'getFeatureFlag',
      'isFeatureEnabled',
      'onFeatureFlags',
    ];

    queue.people = queue.people || [];
    methods.forEach((method) => {
      queue[method] = (...args) => queue.push([method, ...args]);
    });

    const script = document.createElement('script');
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.src = `${options.api_host.replace('.i.posthog.com', '-assets.i.posthog.com')}/static/array.js`;
    document.head.appendChild(script);
    posthog._i.push([key, options, name]);
  };
  posthog.__SV = 1;

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    person_profiles: 'identified_only',
    session_recording: {
      recordCrossOriginIframes: true,
      capturePerformance: false,
    },
  });
};

export const startAnalytics = () => {
  loadGoogleTagManager();
  loadPostHog();
};
