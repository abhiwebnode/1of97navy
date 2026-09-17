// ════════════════════════════════════════════════════════════════════
// auth.js — 1/97 Batch Website · Shared Google Auth State
// ════════════════════════════════════════════════════════════════════

const GOOGLE_CLIENT_ID = '500661556440-th99atls21okui7ilhggf06dulkcrnua.apps.googleusercontent.com';
const STORAGE_KEY      = 'navy_google_user';

var NavAuth = (function () {
    var _user = null; // { name, email, picture }

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

    function _saveToStorage(user) {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(user)); } catch(e) {}
    }

    function _clearStorage() {
        try { localStorage.removeItem(STORAGE_KEY); } catch(e) {}
    }

    function _updateNavbar(user) {
        var attempts = 0;
        var poll = setInterval(function () {
            var loginBtn = document.querySelector('.btn-login');
            var existingBadge = document.getElementById('nav-user-badge');

            if (user) {
                if (existingBadge) { clearInterval(poll); return; }
                if (loginBtn) {
                    clearInterval(poll);
                    loginBtn.outerHTML =
                        '<div class="nav-user-badge" id="nav-user-badge">' +
                            '<img src="' + (user.picture || '') + '" alt="' + user.name + '" ' +
                                 'onerror="this.src=\'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name) + '&background=1B3A6B&color=C9A84C&size=32\'">' +
                            '<span class="nav-user-name">' + user.name.split(' ')[0] + '</span>' +
                            '<button class="nav-signout-btn" onclick="NavAuth.signOut()" title="Sign Out">' +
                                '<i class="fa fa-sign-out-alt"></i>' +
                            '</button>' +
                        '</div>';

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
            } else {
                if (existingBadge) {
                    existingBadge.outerHTML = '<a href="/login.html" class="btn-login">Member Login</a>';
                }
                if (loginBtn) { clearInterval(poll); }
            }
            if (++attempts > 35) clearInterval(poll);
        }, 100);
    }

    function _parseJwt(token) {
        try {
            var base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
            return JSON.parse(decodeURIComponent(escape(window.atob(base64))));
        } catch(e) { 
            try {
                var base64Alt = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
                return JSON.parse(atob(base64Alt));
            } catch(err) { return null; }
        }
    }

    // ── Directory CSV URL for email verification ──────────────────────
    var DIRECTORY_CSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTbYF4OsWbMY0NfKvUYTyM0soo2ZZlD9OtC3w77RlINBT7BfyRHv7EK4iVTcqdwzPjfH9epRa8rEeWQ/pub?gid=1459106869&single=true&output=csv';

    var _verifiedCache = null;

    function _verifyEmailInDirectory(email, callback) {
        if (_verifiedCache !== null) {
            callback(_verifiedCache.has(email.toLowerCase()));
            return;
        }

        fetch(DIRECTORY_CSV)
            .then(function(res) { return res.text(); })
            .then(function(text) {
                // FIXED: Valid newline split
                var lines = text.trim().split('\n');
                var headers = _parseCSVLine(lines[0]);
                var emailCol = -1;
                
                for (var i = 0; i < headers.length; i++) {
                    if (headers[i].toLowerCase().indexOf('email') !== -1) {
                        emailCol = i;
                        break;
                    }
                }

                _verifiedCache = new Set();
                if (emailCol >= 0) {
                    for (var j = 1; j < lines.length; j++) {
                        var cols = _parseCSVLine(lines[j]);
                        var eml = (cols[emailCol] || '').trim().toLowerCase();
                        if (eml) _verifiedCache.add(eml);
                    }
                }

                callback(_verifiedCache.has(email.toLowerCase()));
            })
            .catch(function() {
                console.warn('NavAuth: Directory verification failed — allowing login');
                callback(true);
            });
    }

    function _parseCSVLine(line) {
        var result = [], cur = '', inQ = false;
        for (var i = 0; i < line.length; i++) {
            var ch = line[i];
            if (ch === '"') { inQ = !inQ; }
            else if (ch === ',' && !inQ) { result.push(cur); cur = ''; }
            else { cur += ch; }
        }
        result.push(cur);
        return result;
    }

    _loadFromStorage();

    return {
        init: function (onLogin) {
            if (_loadFromStorage()) {
                _updateNavbar(_user);
                if (typeof onLogin === 'function') onLogin(_user);
                return _user;
            } else {
                _updateNavbar(null);
                return null;
            }
        },

        handleCredential: function (response, redirectTo) {
            if (!response || !response.credential) return;
            var payload = _parseJwt(response.credential);
            if (!payload) return;

            var pendingUser = {
                name:    payload.name || payload.given_name || 'Member',
                email:   payload.email,
                picture: payload.picture
            };

            _verifyEmailInDirectory(pendingUser.email, function(isVerified) {
                if (!isVerified) {
                    document.dispatchEvent(new CustomEvent('navauth:rejected', {
                        detail: { email: pendingUser.email }
                    }));
                    return;
                }

                _user = pendingUser;
                _saveToStorage(_user);
                _updateNavbar(_user);

                document.dispatchEvent(new CustomEvent('navauth:login', { detail: { user: _user } }));

                if (redirectTo) {
                    window.location.href = redirectTo;
                } else if (typeof window._onNavAuthLogin === 'function') {
                    window._onNavAuthLogin(_user);
                }
            });
        },

        signOut: function () {
            if (typeof google !== 'undefined' && google.accounts && google.accounts.id && _user) {
                try {
                    google.accounts.id.disableAutoSelect();
                    google.accounts.id.revoke(_user.email, function() {});
                } catch(e) {}
            }
            _clearStorage();
            _user = null;

            document.dispatchEvent(new CustomEvent('navauth:signout', { detail: {} }));
            window.location.reload();
        },

        getUser: function () { 
            if (!_user) _loadFromStorage();
            return _user; 
        },

        isLoggedIn: function () { 
            if (!_user) _loadFromStorage();
            return _user !== null; 
        },

        clientId: GOOGLE_CLIENT_ID
    };
})();

// ── Global rejection handler ──────────────────────────────────────────
document.addEventListener('navauth:rejected', function(e) {
    var isLoginPage = window.location.pathname.indexOf('login.html') !== -1;
    if (!isLoginPage) {
        var email = (e.detail && e.detail.email) ? e.detail.email : '';
        window.location.href = 'login.html?rejected=1&email=' + encodeURIComponent(email);
    }
});

window.addEventListener('storage', function(e) {
    if (e.key === STORAGE_KEY) {
        if (e.newValue) {
            NavAuth.init(function(u) {
                document.dispatchEvent(new CustomEvent('navauth:login', { detail: { user: u } }));
            });
        } else {
            NavAuth.init();
            document.dispatchEvent(new CustomEvent('navauth:signout', { detail: {} }));
        }
    }
});

(function() {
    function fireReady() {
        var user = NavAuth.init();
        document.dispatchEvent(new CustomEvent('navauth:ready', { detail: { user: user } }));
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fireReady);
    } else {
        fireReady();
    }
})();