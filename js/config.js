// ════════════════════════════════════════════════════════════════════
// config.js — 1/97 Batch Website Global Configuration
// Edit this file to control site-wide settings.
// ════════════════════════════════════════════════════════════════════

var SITE_CONFIG = {

    // ── Maintenance Mode ─────────────────────────────────────────────
    // true  = site shows maintenance page to all visitors
    // false = site is live for everyone
    maintenance: false,

    // ── Preview Bypass Key ───────────────────────────────────────────
    // While maintenance is true, YOU can still access the site by
    // opening any page with ?preview=YOUR_KEY in the URL.
    // Example: https://www.1of97navy.in/?preview=Navy@1997

    previewKey: 'Navy@1997',

    // ── Site Info ────────────────────────────────────────────────────
    siteName:    '1/97 Batch',
    siteTagline: 'Indian Navy Veterans',
    siteUrl:     'https://www.1of97navy.in',
    email:       'contact@1of97navy.in',
    motto:       'Together in Service. Together for Life.',

    // ── Cloudinary ───────────────────────────────────────────────────
    cloudName:   'y1x8pb8j',

    // ── Google Sheet CSV URLs ─────────────────────────────────────────
    sheets: {
        directory:     'https://docs.google.com/spreadsheets/d/e/2PACX-1vTbYF4OsWbMY0NfKvUYTyM0soo2ZZlD9OtC3w77RlINBT7BfyRHv7EK4iVTcqdwzPjfH9epRa8rEeWQ/pub?gid=1459106869&single=true&output=csv',
        serviceAwards: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRAZI1kffoAX_5NPl0rP54dR8vdqE1ogV7aUu25s50bM16uhGs82GhAgb7AkA5p-_zLsLcOWyUrvNwj/pub?gid=1685212684&single=true&output=csv',
        postService:   'https://docs.google.com/spreadsheets/d/e/2PACX-1vTfxGmTaCb8YXuwYYHgJrD_dYj8OIrF_AzUS7npAxAiNCzsvk8Sebpiaj8iAv53VxazvBmytsBjvN4E/pub?gid=1257503201&single=true&output=csv'
    },

    // ── Google Form Links ─────────────────────────────────────────────
    forms: {
        directory:     'https://docs.google.com/forms/d/e/1FAIpQLScYryCeRfNKNB2w4SrFzJbjQvI4JeBfpDGwBDWF4aZvbYWFuA/viewform?usp=header',
        serviceAwards: 'https://docs.google.com/forms/d/e/1FAIpQLSc5ibrKGwaxUwiv4K5dB8zTAaCxxfoFW1YFMoUvTCQkm7sabg/viewform?usp=publish-editor',
        postService:   'https://docs.google.com/forms/d/e/1FAIpQLSfhPGTYlBEWtOjXOc-3Kwz7miIYm3uZQP_jivEk8lOJ3XYtcA/viewform?usp=header'
    },

    // ── Social Links ──────────────────────────────────────────────────
    social: {
        Facebook:  'https://www.facebook.com/1of97navy',
        X:  'https://x.com/1of97navy',
        instagram: 'https://www.instagram.com/1of97navy',
		YouTube: 'https://www.youtube.com/1of97navy'
    },

    // ── Copyright ─────────────────────────────────────────────────────
    copyrightYear: '2026',
    builderName:   'Abhishek Kumar',
    builderUrl:    'https://www.abhishekindia.com'

};

// ════════════════════════════════════════════════════════════════════
// MAINTENANCE REDIRECT — do not edit below this line
// ════════════════════════════════════════════════════════════════════
(function () {

    // Not in maintenance mode — nothing to do
    if (!SITE_CONFIG.maintenance) return;

    // Already on maintenance page — don't redirect again
    if (window.location.pathname.indexOf('maintenance.html') !== -1) return;

    // Check for preview key in URL — ?preview=YOUR_KEY
    var params = new URLSearchParams(window.location.search);
    if (params.get('preview') === SITE_CONFIG.previewKey) {
        // Store access in sessionStorage — valid until tab is closed
        try { sessionStorage.setItem('navy_preview', SITE_CONFIG.previewKey); } catch(e) {}
    }

    // Allow if session access is valid
    try {
        if (sessionStorage.getItem('navy_preview') === SITE_CONFIG.previewKey) return;
    } catch(e) {}

    // Everyone else — redirect to maintenance page
    window.location.replace('/maintenance.html');

})();
