// ════════════════════════════════════════════════════════════════════
// auth.js — 1/97 Batch Website · Shared Google Auth State
// ════════════════════════════════════════════════════════════════════
// Include on every page that should reflect login state:
//   <script src="js/auth.js"></script>   (after nav.js)
//
// What it does:
//   • Reads saved Google user from localStorage
//   • Updates the navbar "Member Login" button to show
//     user avatar + name when logged in
//   • Provides NavAuth.getUser() for any page to read
//   • Handles sign-out from anywhere
// ════════════════════════════════════════════════════════════════════

const GOOGLE_CLIENT_ID = '500661556440-th99atls21okui7ilhggf06dulkcrnua.apps.googleusercontent.com';
const STORAGE_KEY      = 'navy_google_user';

var NavAuth = (function () {

    var _user = null; // { name, email, picture }

    // ── Read saved session ────────────────────────────────────────────
    function _loadFromStorage() {
        try {
            var stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                var parsed = JSON.parse(stored);
                if (parsed && parsed.email && parsed.name) {
                    _user = parsed;
                    return true;
                }
            }
        } catch(e) {}
        return false;
    }

    // ── Save session ──────────────────────────────────────────────────
    function _saveToStorage(user) {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(user)); } catch(e) {}
    }

    // ── Clear session ─────────────────────────────────────────────────
    function _clearStorage() {
        try { localStorage.removeItem(STORAGE_KEY); } catch(e) {}
    }

    // ── Update navbar button ──────────────────────────────────────────
    function _updateNavbar(user) {
        // Wait for nav to be injected by nav.js
        var attempts = 0;
        var poll = setInterval(function () {
            var loginBtn = document.querySelector('.btn-login');
            if (loginBtn) {
                clearInterval(poll);
                if (user) {
                    // Replace login button with user badge
                    loginBtn.outerHTML =
                        '<div class="nav-user-badge" id="nav-user-badge">' +
                            '<img src="' + user.picture + '" alt="' + user.name + '" ' +
                                 'onerror="this.src=\'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name) + '&background=1B3A6B&color=C9A84C&size=32\'">' +
                            '<span class="nav-user-name">' + user.name.split(' ')[0] + '</span>' +
                            '<button class="nav-signout-btn" onclick="NavAuth.signOut()" title="Sign Out">' +
                                '<i class="fa fa-sign-out-alt"></i>' +
                            '</button>' +
                        '</div>';

                    // Inject nav user badge styles if not already present
                    if (!document.getElementById('nav-auth-style')) {
                        var style = document.createElement('style');
                        style.id  = 'nav-auth-style';
                        style.textContent =
                            '.nav-user-badge{display:flex;align-items:center;gap:.4rem;' +
                                'background:rgba(255,255,255,.08);border:1px solid rgba(201,168,76,.3);' +
                                'border-radius:24px;padding:.25rem .75rem .25rem .25rem;cursor:default;}' +
                            '.nav-user-badge img{width:28px;height:28px;border-radius:50%;' +
                                'border:1.5px solid var(--gold,#C9A84C);flex-shrink:0;}' +
                            '.nav-user-name{color:#fff;font-size:.8rem;font-weight:600;' +
                                'max-width:90px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}' +
                            '.nav-signout-btn{background:none;border:none;color:rgba(255,255,255,.4);' +
                                'font-size:.72rem;cursor:pointer;padding:0 0 0 .35rem;' +
                                'transition:.2s;line-height:1;}' +
                            '.nav-signout-btn:hover{color:#e74c3c;}' +
                            '@media(max-width:991px){.nav-user-badge{margin:.5rem 1rem;}}';
                        document.head.appendChild(style);
                    }
                }
                // If not logged in — leave the "Member Login" button as-is
            }
            if (++attempts > 30) clearInterval(poll);
        }, 100);
    }

    // ── Parse JWT from Google ─────────────────────────────────────────
    function _parseJwt(token) {
        try {
            var base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
            return JSON.parse(atob(base64));
        } catch(e) { return null; }
    }

    // ── Public API ────────────────────────────────────────────────────
    return {

        // Call on every page — initialises auth state
        init: function (onLogin) {
            if (_loadFromStorage()) {
                _updateNavbar(_user);
                if (typeof onLogin === 'function') onLogin(_user);
            } else {
                _updateNavbar(null);
            }
        },

        // Called when Google returns credentials (from any page)
        handleCredential: function (response, redirectTo) {
            var payload = _parseJwt(response.credential);
            if (!payload) return;

            _user = {
                name:    payload.name,
                email:   payload.email,
                picture: payload.picture
            };

            _saveToStorage(_user);
            _updateNavbar(_user);

            // Fire event so any page listening can react immediately
            document.dispatchEvent(new CustomEvent('navauth:login', { detail: { user: _user } }));

            // Redirect after login if specified
            if (redirectTo) {
                window.location.href = redirectTo;
            } else if (typeof window._onNavAuthLogin === 'function') {
                window._onNavAuthLogin(_user);
            }
        },

        // Sign out from any page
        signOut: function () {
            if (typeof google !== 'undefined' && _user) {
                try {
                    google.accounts.id.disableAutoSelect();
                    google.accounts.id.revoke(_user.email, function() {});
                } catch(e) {}
            }
            _clearStorage();
            _user = null;

            // Fire signout event before reload
            document.dispatchEvent(new CustomEvent('navauth:signout', { detail: {} }));

            window.location.reload();
        },

        // Get current user (null if not logged in)
        getUser: function () { return _user; },

        // Check if logged in
        isLoggedIn: function () { return _user !== null; },

        // Client ID for use on login/profile pages
        clientId: GOOGLE_CLIENT_ID
    };

})();

// ── Auto-init on every page ───────────────────────────────────────────
// Fires 'navauth:ready' event so any page can react to auth state
document.addEventListener('DOMContentLoaded', function () {
    NavAuth.init(function(user) {
        // User is logged in — fire ready event with user
        document.dispatchEvent(new CustomEvent('navauth:ready', { detail: { user: user } }));
    });

    // Also fire ready event if NOT logged in — pages still need to render
    if (!NavAuth.isLoggedIn()) {
        document.dispatchEvent(new CustomEvent('navauth:ready', { detail: { user: null } }));
    }
});
