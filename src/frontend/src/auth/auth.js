import router from '../router/router.js';
import nav from '../nav/nav.js';

const auth = {

    showLogin: () => {
        const html = `
<div class="container p-5">
<div class="row g-8 g-m-5">
<form class="login-form bg-light p-5 rounded border">
    <div class="form-floating mb-3">
        <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com">
        <label for="floatingInput">Email address</label>
    </div>
    <div class="container">
        <button type="submit" class="btn btn-primary">Submit</button>
        <div class="btn btn-secondary use-google">Use Google</div>
    </div>
</form>
</div>
</div>`;
        $('.app').html(html);
        $('.app').find('.login-form').submit((e) => {
            const email = $('input[type="email"]').val();
            $.post('/auth/email/', {
                email
            }).then((data) => {
                auth.showAuth(email);
            });
            return false;
        });
        $('.app').find('.use-google').click(() => {
            console.log('use google clicked');
            gapi.auth2.getAuthInstance().signIn();
        });
    },

    showAuth: (email) => {
        const html = 
`
<div class="container p-5 bg-dark">
<div class="row g-8 g-m-5">
<form class="auth-form bg-light p-5 rounded border">
    <div class="form-floating mb-3">
        <input type="email" class="form-control" id="floatingEmailInput" value="${email}">
        <label for="floatingEmailInput">Email address</label>
    </div>
    <div class="form-floating mb-3">
        <input type="token" class="form-control" id="floatingInput">
        <label for="floatingInput">Token From Email</label>
    </div>
    <button type="submit" class="btn btn-primary">Submit</button>
</form>
</div>
</div>
`;
        $('.app').html(html);
        $('.app').find('.auth-form').submit((e) => {
            const email = $('input[type="email"]').val();
            const token = $('input[type="token"]').val();
            $.post('/auth/token/', {
                email,
                token
            }).then((data) => {
                window.herolfg.token = data.token;
                window.herolfg.profile.isAnonymous = false;
                window.herolfg.profile.email = email;
                localStorage.setItem('herolfg', JSON.stringify(window.herolfg));
                router.route(router.CROWDSOURCEMAIL_MESSAGE_LIST_VIEW);
                nav.updateNav();
            });
            return false;
        });
    }
};

export default auth;
