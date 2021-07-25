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
  <a class="nav-link crowdsourcemail" aria-current="page">Crowdsource Mail</a>
</li>
<li class="nav-item">
  <a class="nav-link settings hidden">Settings</a>
</li>
<li class="nav-item">
  <a class="nav-link login">Login</a>
</li>
<li class="nav-item">
  <a class="nav-link logout hidden">Logout</a>
</li>
</ul>
</div>
</div>
</nav>
`;
        $('.main-nav').html(html);
        $('.crowdsourcemail').click(() => {
            router.route('crowdsourcemail');
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
            $('.nav-link.settings').removeClass('hidden');
            $('.nav-link.login').addClass('hidden');
            $('.nav-link.logout').removeClass('hidden');
        }
    }

};

export default nav;
