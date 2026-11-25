/*
 * Frontend deployment settings.
 * Leave empty for local same-origin use. For a separate frontend host (such as
 * Vercel), set this to the backend's stable HTTPS origin, with no trailing slash.
 * Example: window.SOUNDSENSE_API_BASE = 'https://api.example.com';
 */
window.SOUNDSENSE_API_BASE = window.SOUNDSENSE_API_BASE || 'https://alternate-evanescence-headers-orange.trycloudflare.com;

(function configureBackendRequests() {
  var base = String(window.SOUNDSENSE_API_BASE || '').replace(/\/+$/, '');
  if (!base) return;

  var browserFetch = window.fetch.bind(window);
  window.fetch = function (input, init) {
    if (typeof input === 'string' && input.charAt(0) === '/' && input.indexOf('/api/') === 0) {
      input = base + input;
    }
    return browserFetch(input, init);
  };
})();
