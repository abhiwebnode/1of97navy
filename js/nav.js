// ════════════════════════════════════════════════════════════════════
// nav.js — 1/97 Batch Website
// Injects the full navbar into every page.
//
// Usage: Add a placeholder div + script at top of <body>:
//   <div id="nav-placeholder"></div>
//   <script src="/nav.js"></script>
//
// Active nav item: add data-page="pageid" to <body> tag:
//   <body data-page="directory">
//
// Page IDs: home | about | members | memories | achievements |
//           reunions | discussion | memorial
// ════════════════════════════════════════════════════════════════════

(function () {

    // ── Detect active page ────────────────────────────────────────────
    var page = document.body.getAttribute('data-page') || '';
    var path = window.location.pathname;

    function isActive(id) {
        if (page) return page === id;
        // Fallback — detect from URL path
        var map = {
            home:         ['/', '/index.html'],
            about:        ['/about.html', '/history.html', '/timeline.html', '/ships.html'],
            members:      ['/directory.html', '/shipmates.html', '/profile.html'],
            memories:     ['/gallery.html'],
            achievements: ['/achievements.html', '/service-awards.html', '/spotlight.html', '/postservice.html', '/socialwork.html'],
            reunions:     ['/reunions.html'],
            discussion:   ['/discussion.html'],
            memorial:     ['/memorial.html']
        };
        return (map[id] || []).some(function (p) { return path.endsWith(p); });
    }

    function activeClass(id) {
        return isActive(id) ? ' active' : '';
    }

    // ── Navbar HTML ───────────────────────────────────────────────────
// ── Navbar HTML ───────────────────────────────────────────────────
var html = '\
<div class="container-fluid fixed-top px-0">\
    <div class="top-bar text-white-50 row gx-0 align-items-center d-none d-lg-flex py-1">\
        <div class="col-lg-6 px-5 text-start">\
            <small class="ms-4"><i class="fa fa-envelope me-2"></i>' + (typeof SITE_CONFIG!=="undefined" ? SITE_CONFIG.email : "contact@1of97navy.in") + '</small>\
        </div>\
        <div class="col-lg-6 px-5 text-end">\
            <small>Follow us:</small>\
            <a class="text-white-50 ms-3" href="https://www.facebook.com/1of97navy"><i class="fab fa-facebook-f"></i></a>\
            <a class="text-white-50 ms-3" href="https://www.instagram.com/1of97navy"><i class="fab fa-instagram"></i></a>\
			<a class="text-white-50 ms-3" href="https://x.com/1of97navy"><i class="fab fa-twitter"></i></a>\
			<a class="text-white-50 ms-3" href="https://www.youtube.com/1of97navy"><i class="fab fa-youtube"></i></a>\
        </div>\
    </div>\
    <nav class="navbar navbar-expand-lg navbar-dark py-lg-0 px-lg-5">\
        <a href="/index.html" class="navbar-brand ms-4 ms-lg-0">\
            <div class="batch-name"><img src="icons/logo.png" alt="Indian Navy 1/97 Batch Veterans" class="img-fluid" style="max-height: 50px; width: auto;"></div>\
        </a>\
        <button type="button" class="navbar-toggler me-4" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">\
            <span class="navbar-toggler-icon"></span>\
        </button>\
        <div class="collapse navbar-collapse" id="navbarCollapse">\
            <div class="navbar-nav ms-auto p-4 p-lg-0">\
                <a href="/index.html" class="nav-item nav-link' + activeClass('home') + '">Home</a>\
                <div class="nav-item dropdown">\
                    <a href="#" class="nav-link dropdown-toggle' + activeClass('about') + '" data-bs-toggle="dropdown">About</a>\
                    <div class="dropdown-menu m-0">\
                        <a href="/about.html"    class="dropdown-item">About 1/97 Batch</a>\
                        <a href="/history.html"  class="dropdown-item">Batch History</a>\
                        <a href="/timeline.html" class="dropdown-item">Our Journey / Timeline</a>\
                        <a href="/ships.html"    class="dropdown-item">Ships &amp; Units</a>\
                    </div>\
                </div>\
                <div class="nav-item dropdown">\
                    <a href="#" class="nav-link dropdown-toggle' + activeClass('members') + '" data-bs-toggle="dropdown">Members</a>\
                    <div class="dropdown-menu m-0">\
                        <a href="/directory.html" class="dropdown-item">Member Directory</a>\
                        <a href="/shipmates.html" class="dropdown-item">Find a Shipmate</a>\
                        <a href="/profile.html"   class="dropdown-item">My Profile</a>\
                    </div>\
                </div>\
                <div class="nav-item dropdown">\
                    <a href="#" class="nav-link dropdown-toggle' + activeClass('memories') + '" data-bs-toggle="dropdown">Memories</a>\
                    <div class="dropdown-menu m-0">\
                        <a href="/gallery.html"             class="dropdown-item">Photo Gallery</a>\
                        <a href="/gallery.html?album=training" class="dropdown-item">Training Days</a>\
                        <a href="/gallery.html?album=ships"    class="dropdown-item">Ships &amp; Deployments</a>\
                        <a href="/gallery.html?album=reunions" class="dropdown-item">Reunions</a>\
                        <a href="/gallery.html?album=personal" class="dropdown-item">Personal Memories</a>\
                    </div>\
                </div>\
                <div class="nav-item dropdown">\
                    <a href="#" class="nav-link dropdown-toggle' + activeClass('achievements') + '" data-bs-toggle="dropdown">Achievements</a>\
                    <div class="dropdown-menu m-0">\
                        <a href="/achievements.html"   class="dropdown-item">Achievements Home</a>\
                        <a href="/service-awards.html" class="dropdown-item">Service Awards</a>\
                        <a href="/spotlight.html"      class="dropdown-item">Veteran Spotlight</a>\
                        <a href="/postservice.html"    class="dropdown-item">Post-Service Achievements</a>\
                        <a href="/socialwork.html"     class="dropdown-item">Social Work</a>\
                    </div>\
                </div>\
                <a href="/reunions.html"  class="nav-item nav-link' + activeClass('reunions')   + '">Reunions</a>\
                <a href="/discussion.html" class="nav-item nav-link' + activeClass('discussion') + '">Discussion</a>\
                <a href="/memorial.html"  class="nav-item nav-link' + activeClass('memorial')   + '">Memorial</a>\
            </div>\
            <div class="d-flex align-items-center ms-2 p-4 p-lg-0">\
                <a href="/login.html" class="btn-login">Member Login</a>\
            </div>\
        </div>\
    </nav>\
</div>';

    // ── Inject into placeholder ───────────────────────────────────────
    var placeholder = document.getElementById('nav-placeholder');
    if (placeholder) {
        placeholder.innerHTML = html;
    } else {
        // Fallback — prepend to body if no placeholder found
        var wrapper = document.createElement('div');
        wrapper.innerHTML = html;
        document.body.insertBefore(wrapper, document.body.firstChild);
    }

})();
