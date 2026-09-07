// Analytics for evitakatrina.info: PostHog (EU, proxied through /ingest, see vercel.json) and
// Vercel Web Analytics. Both are cookieless: no banner needed.
//
// Self-exclusion: open any page with `?optout` once in a browser and neither tracker loads there
// again; `?optin` turns them back on. The flag lives in localStorage.
(function () {
  var optout = false;
  try {
    var q = new URLSearchParams(location.search);
    if (q.has('optout')) localStorage.setItem('evita:optout', '1');
    if (q.has('optin')) localStorage.removeItem('evita:optout');
    optout = localStorage.getItem('evita:optout') === '1';
  } catch (e) {}
  if (optout) return;

  // --- PostHog ---
  !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey canRenderSurveyAsync identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug getPageViewId captureTraceFeedback captureTraceMetric".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
  posthog.init('phc_xGy99rzKgXBch8rBgg5qnmG8S8ufyvgFzW5U55xhBGkL', {
    api_host: '/ingest',
    ui_host: 'https://eu.posthog.com',
    persistence: 'memory',
    // The library's own load-time pageview did not fire on this static site (script loads after
    // DOMContentLoaded), so the page view is sent explicitly below.
    capture_pageview: false,
    capture_pageleave: true,
    autocapture: true,
    capture_heatmaps: true,
    session_recording: { maskAllInputs: true },
    capture_performance: { web_vitals: true },
    defaults: '2025-05-24',
  });
  posthog.capture('$pageview');

  // --- Vercel Web Analytics ---
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
  var s = document.createElement('script');
  s.defer = true;
  s.src = '/_vercel/insights/script.js';
  document.head.appendChild(s);
})();
