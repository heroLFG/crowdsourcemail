function load() {
    $(document).ready(() => {
        init();
    });

    function init() {
        const herolfg = localStorage.getItem('herolfg');
        window.herolfg = herolfg ? JSON.parse(herolfg) : '';
        if (!window.herolfg) {
            $.post('/auth/token/hero', {
                email: 'anonymous@herolfg.com',
                token: 'none'
            }).then((data) => {
                window.herolfg = { token: data.token, profile: { isAnonymous: true } };
                localStorage.setItem('herolfg', JSON.stringify(window.herolfg));
                initNav();
                initApp();
            });
            return;
        }
        initNav();
        initApp();
    }

    /* begin auth */
    function showLogin() {
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
                showAuth(email);
            });
            return false;
        });
    }

    function showAuth(email) {
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
                route('crowdsourcemail');
                updateNav();
            });
            return false;
        });
    }
    /* end auth */

    function initNav() {
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
            route('crowdsourcemail');
        });
        $('.settings').click(() => {
            route('settings');
        });
        $('.login').click(() => {
            route('login');
        });
        $('.logout').click(() => {
            localStorage.setItem('herolfg', '');
            init();
        });
        updateNav();
    }

    function updateNav() {
        if (!window.herolfg.profile.isAnonymous) {
            $('.nav-link.settings').removeClass('hidden');
            $('.nav-link.login').addClass('hidden');
            $('.nav-link.logout').removeClass('hidden');
        }
    }

    function initApp() {
        window.onpopstate = ((state) => {
            const path = window.location.pathname;
            route(path.replaceAll('/', ''));
        });
        const path = window.location.pathname;
        route(path.replaceAll('/', ''));
    }

    function route(route) {
        const routes = {
            crowdsourcemail: showCrowdsourcemailApp,
            settings: showSettingsApp,
            login: showLogin,
        };
        history.pushState({}, route, route);
        $('.nav-link').removeClass('active');
        if (!routes[route]) {
            route = 'crowdsourcemail';
        }
        routes[route].call();
        $(`.nav-link.${route}`).addClass('active');
    }

    /* begin settings app */
    function showSettingsApp() {
        const html =
`
<div class="container mx-auto p-5">
<div class="row g-8 g-m-5">
<form class="profile-form bg-light p-5 rounded border">
    <div class="form-check form-switch">
        <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault" disabled>
        <label class="form-check-label" for="flexSwitchCheckDefault">My Emails are Visible to Non Members</label>
    </div>
</form>
</div>
</div>
`;
        $('.app').html(html);
    }
    /* end settings app */

    /* begin crowdsourcemail app */
    function showCrowdsourcemailApp() {
        let token = window.herolfg.token;
        let url = '/api/messages/';
        let headers = {
            'Authorization': `Token ${token}`
        };
        $.ajax({
            type: 'GET',
            url,
            contentType: 'application/json',
            headers,
        }).then((data) => {
            renderMailApp(data);
        });
    }

    function renderMailApp(mailData) {
        const table = $('<table class="table table-striped"></table>');
        const tbody = $('<tbody></tbody>');
        $.each(mailData.results, (index, message) => {
            console.log('message', message);
            const messageListItem = getMessageListItem(message);
            tbody.append(messageListItem);
        });
        table.append(tbody);
        const container = $('<div class="container-fluid bg-light"></div>');
        container.append(table);
        $('.app').html(container);
    }

    function getMessageListItem(message) {
        const row = $('<tr></tr>');
        const text = $(`<td class="col-11"><div class="message"><span class="subject">${message.subject}</span><span class="text">${message.text}</span></div></td>`);
        const time = $(`<td class="col-1">${moment(message.processed).format("M/D/YY")}</td>`);
        row.append(text);
        row.append(time);
        return row;
    }
    /* end crowdsourcemail app */
}

load();
