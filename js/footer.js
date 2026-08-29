// ════════════════════════════════════════════════════════════════════
// footer.js — 1/97 Batch Website
// Injects the full footer into every page.
//
// Usage: Add a placeholder div before closing </body>:
//   <div id="footer-placeholder"></div>
//   <script src="/footer.js"></script>
// ════════════════════════════════════════════════════════════════════

(function () {

    // ── Read from SITE_CONFIG if available, else use defaults ─────────
    var cfg   = (typeof SITE_CONFIG !== 'undefined') ? SITE_CONFIG : {};
    var email = cfg.email        || 'contact@1of97navy.in';
    var year  = cfg.copyrightYear || new Date().getFullYear();
    var bname = cfg.builderName  || 'Abhishek Kumar';
    var burl  = cfg.builderUrl   || 'https://www.abhishekindia.com';
    var motto = cfg.motto        || 'Together in Service. Together for Life.';
    var cfg_social = cfg.social || {};
    var social = {
        facebook:  cfg_social.Facebook  || cfg_social.facebook  || 'https://www.facebook.com/1of97navy',
        whatsapp:  cfg_social.WhatsApp  || cfg_social.whatsapp  || '#',
        instagram: cfg_social.Instagram || cfg_social.instagram || 'https://www.instagram.com/1of97navy',
        youtube:   cfg_social.YouTube   || cfg_social.youtube   || 'https://www.youtube.com/@1of97navy',
        x:         cfg_social.X         || cfg_social.twitter   || 'https://x.com/1of97navy'
    };

    // ── Footer HTML ───────────────────────────────────────────────────
    var html = '\
<div class="container-fluid footer py-5 wow fadeIn" data-wow-delay="0.1s">\
    <div class="container py-4">\
        <div class="row g-5">\
\
            <div class="col-lg-4 col-md-6">\
                <div class="footer-brand mb-2"><img src="icons/logo.png" alt="Indian Navy 1/97 Batch Veterans" class="img-fluid" style="max-height: 50px; width: auto;"></div>\
                <p class="footer-motto mb-3">&ldquo;' + motto + '&rdquo;</p>\
                <p class="small text-white-50">The official website of the Indian Navy 1/97 Batch veterans. Maintained by the batch, for the batch.</p>\
                <div class="d-flex gap-2 mt-3 flex-wrap">\
                    <a class="btn btn-square btn-outline-light rounded-circle" href="' + social.facebook  + '" target="_blank" rel="noopener noreferrer"><i class="fab fa-facebook-f"></i></a>\
                    <a class="btn btn-square btn-outline-light rounded-circle" href="' + social.instagram + '" target="_blank" rel="noopener noreferrer"><i class="fab fa-instagram"></i></a>\
                    <a class="btn btn-square btn-outline-light rounded-circle" href="' + social.x         + '" target="_blank" rel="noopener noreferrer"><i class="fab fa-twitter"></i></a>\
                    <a class="btn btn-square btn-outline-light rounded-circle" href="' + social.youtube   + '" target="_blank" rel="noopener noreferrer"><i class="fab fa-youtube"></i></a>\
                    ' + (social.whatsapp && social.whatsapp !== '#' ? '<a class="btn btn-square btn-outline-light rounded-circle" href="' + social.whatsapp + '" target="_blank" rel="noopener noreferrer"><i class="fab fa-whatsapp"></i></a>' : '') + '\
                </div>\
            </div>\
\
            <div class="col-lg-2 col-md-6">\
                <h5 class="text-white mb-3">Quick Links</h5>\
                <a class="btn btn-link text-white-50 p-0 d-block mb-2" href="/about.html">About the Batch</a>\
                <a class="btn btn-link text-white-50 p-0 d-block mb-2" href="/timeline.html">Our Timeline</a>\
                <a class="btn btn-link text-white-50 p-0 d-block mb-2" href="/ships.html">Ships &amp; Units</a>\
                <a class="btn btn-link text-white-50 p-0 d-block mb-2" href="/directory.html">Member Directory</a>\
                <a class="btn btn-link text-white-50 p-0 d-block mb-2" href="/memorial.html">Memorial Wall</a>\
            </div>\
\
            <div class="col-lg-2 col-md-6">\
                <h5 class="text-white mb-3">Memories</h5>\
                <a class="btn btn-link text-white-50 p-0 d-block mb-2" href="/gallery.html">Photo Gallery</a>\
                <a class="btn btn-link text-white-50 p-0 d-block mb-2" href="/achievements.html">Achievements</a>\
                <a class="btn btn-link text-white-50 p-0 d-block mb-2" href="/spotlight.html">Veteran Spotlight</a>\
                <a class="btn btn-link text-white-50 p-0 d-block mb-2" href="/reunions.html">Reunions</a>\
                <a class="btn btn-link text-white-50 p-0 d-block mb-2" href="/discussion.html">Discussion</a>\
            </div>\
\
            <div class="col-lg-4 col-md-6">\
                <h5 class="text-white mb-3">Get in Touch</h5>\
                <p class="text-white-50 small mb-3">For membership enquiries, content submissions, or corrections, reach out to the batch webmaster.</p>\
                <div class="d-flex mb-2 align-items-center">\
                    <i class="fa fa-envelope text-gold me-3"></i>\
                    <a href="mailto:' + email + '" class="text-white-50 small text-decoration-none text-hover-gold">' + email + '</a>\
                </div>\
                <div class="d-flex mb-4">\
                    <i class="fab fa-whatsapp text-gold me-3 mt-1"></i>\
                    <span class="text-white-50 small">Batch WhatsApp Group</span>\
                </div>\
                <a href="/login.html" class="btn btn-gold py-2 px-4 fw-bold">Member Login</a>\
            </div>\
\
        </div>\
        <div class="copyright mt-5 pt-3 text-center text-white-50 small">\
            <p class="mb-0">\
                &copy; ' + year + ' Indian Navy 1/97 Batch. All rights reserved. |\
                Built by <a href="' + burl + '" target="_blank" class="text-white-50">' + bname + '</a>\
                for the 1/97 Batch.\
            </p>\
        </div>\
    </div>\
</div>\
<a href="#" class="btn btn-primary btn-lg-square back-to-top"><i class="bi bi-arrow-up"></i></a>';

    // ── Inject into placeholder ───────────────────────────────────────
    var placeholder = document.getElementById('footer-placeholder');
    if (placeholder) {
        placeholder.innerHTML = html;
    } else {
        var wrapper = document.createElement('div');
        wrapper.innerHTML = html;
        document.body.appendChild(wrapper);
    }

})();