// ════════════════════════════════════════════════════════════════════
// header.js — 1/97 Batch Website
// Injects shared sitewide <head> tags, preconnects, and scripts.
// ════════════════════════════════════════════════════════════════════

(function () {

    // ── Force non-www domain ─────────────────────────────────────────
    // Safety net: redirect www requests to the canonical non-www domain.
    // The server/.htaccess redirect should still be used when available.
    if (window.location.hostname === 'www.1of97navy.in') {
        window.location.replace(
            'https://1of97navy.in' +
            window.location.pathname +
            window.location.search +
            window.location.hash
        );
        return;
    }

    var head = document.head;

    function meta(attrs) {
        var el = document.createElement('meta');
        Object.keys(attrs).forEach(function (k) { el.setAttribute(k, attrs[k]); });
        head.appendChild(el);
    }
    function link(attrs) {
        var el = document.createElement('link');
        Object.keys(attrs).forEach(function (k) { el.setAttribute(k, attrs[k]); });
        head.appendChild(el);
    }

    // ── SEO & Authorship Defaults ─────────────────────────────────────
    meta({ name: 'author', content: 'Abhishek Kumar' });
    meta({ name: 'robots', content: 'index, follow' });
    meta({ name: 'theme-color', content: '#0B1E3D' });
    meta({ name: 'msapplication-TileColor', content: '#0B1E3D' });

    // ── PWA & App Capabilities ───────────────────────────────────────
    meta({ name: 'mobile-web-app-capable',          content: 'yes' });
    meta({ name: 'apple-mobile-web-app-capable',    content: 'yes' });
    meta({ name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' });
    meta({ name: 'apple-mobile-web-app-title',      content: '1/97 Batch' });
    meta({ name: 'application-name',                content: '1/97 Batch' });

    // ── Favicon & App Icons ──────────────────────────────────────────
    link({ rel: 'icon',             type: 'image/x-icon', href: 'favicon.ico', sizes: 'any' });
    link({ rel: 'icon',             type: 'image/png',    sizes: '32x32', href: 'icons/icon-32x32.png' });
    link({ rel: 'icon',             type: 'image/png',    sizes: '16x16', href: 'icons/icon-16x16.png' });
    link({ rel: 'apple-touch-icon', sizes: '180x180',     href: 'icons/icon-192x192.png' });
    link({ rel: 'mask-icon',        href: 'icons/safari-pinned-tab.svg', color: '#C9A84C' });
    link({ rel: 'manifest',         href: 'manifest.json' });

    // ── Hreflang & Sitemap ───────────────────────────────────────────
    link({ rel: 'alternate', hreflang: 'en-IN',     href: window.location.href });
    link({ rel: 'alternate', hreflang: 'en',        href: window.location.href });
    link({ rel: 'alternate', hreflang: 'x-default', href: window.location.href });
    link({ rel: 'sitemap',   type: 'application/xml', href: '/sitemap.xml' });

    // ── Preconnect & DNS Prefetch ────────────────────────────────────
    link({ rel: 'preconnect',   href: 'https://fonts.googleapis.com' });
    link({ rel: 'preconnect',   href: 'https://fonts.gstatic.com', crossorigin: '' });
    link({ rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' });
    link({ rel: 'preconnect',   href: 'https://www.googletagmanager.com' });

    // ── config.js (Synchronous maintenance check) ────────────────────
    if (typeof SITE_CONFIG === 'undefined') {
        var configScript = document.createElement('script');
        configScript.src = 'js/config.js';
        configScript.async = false;
        head.insertBefore(configScript, head.firstChild);
    }

    // ── Google Analytics (gtag.js) ───────────────────────────────────
    var GA_ID = 'G-NN1NPJGY7L';
    var gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src   = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    head.appendChild(gaScript);

    var gaInit = document.createElement('script');
    gaInit.textContent = [
        'window.dataLayer = window.dataLayer || [];',
        'function gtag(){dataLayer.push(arguments);}',
        'gtag("js", new Date());',
        'gtag("config", "' + GA_ID + '");'
    ].join('\n');
    head.appendChild(gaInit);

})();

// ════════════════════════════════════════════════════════════════════
// PWA — Service Worker + Install Modal
// ════════════════════════════════════════════════════════════════════
(function () {

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
            navigator.serviceWorker.register('/service-worker.js')
                .then(function (reg) { console.log('SW registered:', reg.scope); })
                .catch(function (err) { console.error('SW failed:', err); });
        });
    }

    var style = document.createElement('style');
    style.textContent = [
        '#pwa-modal-overlay{display:none;position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,.7);backdrop-filter:blur(4px);z-index:9998;}',
        '#pwa-install-banner{display:none;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:90%;max-width:380px;background:#0B1D3A;color:#fff;border:2px solid #D4AF37;border-radius:16px;padding:24px;box-shadow:0 16px 36px rgba(0,0,0,.6);z-index:9999;flex-direction:column;align-items:center;text-align:center;gap:16px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;box-sizing:border-box;}',
        '#pwa-install-banner img{width:72px;height:72px;border-radius:16px;border:1px solid #D4AF37;flex-shrink:0;}',
        '.pwa-info{width:100%;}',
        '.pwa-title{font-weight:700;font-size:18px;color:#D4AF37;margin:0 0 6px;}',
        '.pwa-desc{font-size:14px;color:#E2E8F0;line-height:1.5;margin:0;}',
        '.pwa-actions{display:flex;flex-direction:column;width:100%;gap:10px;margin-top:8px;}',
        '.pwa-btn-install{background:#D4AF37;color:#0B1D3A;border:none;border-radius:8px;padding:12px;font-size:15px;font-weight:700;cursor:pointer;width:100%;}',
        '.pwa-btn-dismiss{background:transparent;color:#94A3B8;border:1px solid rgba(255,255,255,.15);border-radius:8px;padding:10px;font-size:14px;font-weight:500;cursor:pointer;width:100%;}'
    ].join('');
    document.head.appendChild(style);

    function injectModal() {
        if (document.getElementById('pwa-install-banner')) return;

        var overlay = document.createElement('div');
        overlay.id  = 'pwa-modal-overlay';

        var banner  = document.createElement('aside');
        banner.id   = 'pwa-install-banner';
        banner.setAttribute('aria-label', 'App Installation Prompt');
        banner.innerHTML = [
            '<img src="/icons/icon-192x192.png" alt="Navy 1/97 Crest">',
            '<div class="pwa-info">',
            '  <h3 class="pwa-title">Indian Navy 1/97 App</h3>',
            '  <p class="pwa-desc" id="pwa-desc-text">Install the batch portal for quick access, offline directories, and reunion updates.</p>',
            '</div>',
            '<div class="pwa-actions">',
            '  <button id="pwa-install-btn" class="pwa-btn-install">Install App</button>',
            '  <button id="pwa-close-btn"   class="pwa-btn-dismiss">Maybe Later</button>',
            '</div>'
        ].join('');

        document.body.appendChild(overlay);
        document.body.appendChild(banner);

        var deferredPrompt;

        function showModal() {
            overlay.style.display = 'block';
            banner.style.display  = 'flex';
        }
        function hideModal() {
            overlay.style.display = 'none';
            banner.style.display  = 'none';
        }

        var isIos = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
        var isStandalone = ('standalone' in navigator) && navigator.standalone;

        window.addEventListener('beforeinstallprompt', function (e) {
            e.preventDefault();
            deferredPrompt = e;
            if (!localStorage.getItem('pwa_prompt_dismissed')) showModal();
        });

        document.getElementById('pwa-install-btn').addEventListener('click', function () {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then(function (result) {
                    if (result.outcome === 'accepted') hideModal();
                    deferredPrompt = null;
                });
            }
        });

        if (isIos && !isStandalone && !localStorage.getItem('pwa_prompt_dismissed')) {
            document.getElementById('pwa-desc-text').innerHTML =
                'Tap the <strong>Share</strong> button (<span style="font-size:16px;">⎋</span>) below, then select <strong>Add to Home Screen</strong>.';
            document.getElementById('pwa-install-btn').style.display = 'none';
            showModal();
        }

        document.getElementById('pwa-close-btn').addEventListener('click', function () {
            hideModal();
            localStorage.setItem('pwa_prompt_dismissed', 'true');
        });
        overlay.addEventListener('click', hideModal);

        window.addEventListener('appinstalled', function () {
            hideModal();
            deferredPrompt = null;
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectModal);
    } else {
        injectModal();
    }

})();