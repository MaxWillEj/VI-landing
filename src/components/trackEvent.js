import mixpanel from "mixpanel-browser";

export const trackEvent = (event, props = {}) => {
  try {
    if (mixpanel?.__loaded && typeof mixpanel.track === "function") {
      mixpanel.track(event, props);
    }
  } catch (err) {
    console.warn(`Mixpanel failed to track ${event}:`, err);
  }
};