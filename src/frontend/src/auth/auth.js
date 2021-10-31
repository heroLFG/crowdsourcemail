import router from '../router/router.js';
import nav from '../nav/nav.js';

const auth = {

    showPlayground: () => {
        const html = `
<div class="container p-5">
    <h3 class="help-info">Use the secret password to create and/or signin as a fake test user.</h3>
    <div class="row g-8 g-m-5">
        <form class="playground-form bg-light p-5 rounded border">
            <div class="form-floating mb-3">
                <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com">
                <label for="floatingInput">Email address</label>
            </div>
            <div class="form-floating mb-3">
                <input type="password" class="form-control" id="password" placeholder="name@example.com">
                <label for="password">Password</label>
            </div>
            <div class="form-floating mb-3">
                <input type="password" class="form-control" id="confirm-password" placeholder="name@example.com">
                <label for="confirm-password">Confirm Password</label>
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
    </div>
    <div id="test-users"></div>
</div>`;
        $('.app').html(html);
        $('.app').find('.playground-form').submit((e) => {
            const email = $('input[type="email"]').val();
            const password = $('input#password').val();
            const confirmPassword = $('input#confirm-password').val();
            $.post('/auth/playground/', {
                email,
                password,
                confirmPassword
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

        const token = window.herolfg.token;
        if (!token) {
            return;
        }

        const headers = {
            'Authorization': `Token ${token}`
        };
        $.ajax({
            type: 'GET',
            url: `/api/playground/`,
            contentType: 'application/json',
            headers
        }).then((data) => {
            const table = $('<table class="table table-striped table-hover"></table>');
            const tbody = $('<tbody></tbody>');
            $.each(data, (userId, userEmail) => {
                tbody.append(`<tr data-id="${userId}"><td>${userEmail}</td></tr>`);
            });
            table.append(tbody);
            const container = $(`<div class="bg-light"></div>`);
            container.append(table);
            $('#test-users').html(container);
            $("#test-users").prepend(`<h3 class="help-info">List of fake test users to impersonate during development of beta MVP</h3>`);
            $('#test-users tr').click((e) => {
                console.log('just login with the above form using the secret password');
            });
            this.updateActionBarState();
        });
    },

    showLogin: () => {
        const html = `
<div class="container p-5">
<div class="row g-8 g-m-5">
<form class="login-form bg-light p-5 rounded border">
    <div class="form-floating mb-3">
        <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com">
        <label for="floatingInput">Email address</label>
    </div>
    <button type="submit" class="btn btn-primary">Submit</button>
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
