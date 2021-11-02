import router from '../router/router.js';
import app from '../app/app.js';

const nav = {
    
    initNav: () => {
        const html =
`
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
<div class="container-fluid">
<a class="navbar-brand" href="#"></a>
<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
<span class="navbar-toggler-icon"></span>
</button>
<div class="collapse navbar-collapse" id="navbarNavDropdown">
<ul class="navbar-nav">
<li class="nav-item">
  <a class="nav-link ${router.CROWDSOURCEMAIL_MESSAGE_LIST_VIEW}" aria-current="page">Crowdsource Mail</a>
</li>
<li class="nav-item">
  <a class="nav-link settings hidden">Settings</a>
</li>
<li class="nav-item">
  <a class="nav-link login">Login</a>
</li>
<li class="nav-item">
  <a class="nav-link logout hidden">Logout <span class="email-display"></span></a>
</li>
</ul>
</div>
</div>
</nav>
`;
        $('.main-nav').html(html);
        $(`.${router.CROWDSOURCEMAIL_MESSAGE_LIST_VIEW}`).click(() => {
            router.route(router.CROWDSOURCEMAIL_MESSAGE_LIST_VIEW);
        });
        $('.settings').click(() => {
            router.route('settings');
        });
        $('.login').click(() => {
            router.route('login');
        });
        $('.logout').click(() => {
            localStorage.setItem('herolfg', '');
            app.init();
        });
        nav.updateNav();
    },

    
    updateNav: () => {
        if (!window.herolfg.profile.isAnonymous) {
            const email = window.herolfg.profile.email;
            $('.nav-link.settings').removeClass('hidden');
            $('.nav-link.login').addClass('hidden');
            $('.nav-link.logout').removeClass('hidden').find('.email-display').html(email);
        }
    }

};

export default nav;
