import css from './app.css';

import nav from '../nav/nav.js';
import router from '../router/router.js';

const app = {
    
    init: () => {
        const herolfg = localStorage.getItem('herolfg');
        window.herolfg = herolfg ? JSON.parse(herolfg) : '';
        if (!window.herolfg) {
            $.post('/auth/token/hero', {
                email: 'anonymous@herolfg.com',
                token: 'none'
            }).then((data) => {
                window.herolfg = { token: data.token, profile: { isAnonymous: true } };
                localStorage.setItem('herolfg', JSON.stringify(window.herolfg));
                nav.initNav();
                app.initApp();
            });
            return;
        }
        nav.initNav();
        app.initApp();
    },
    
    initApp: () => {
        window.onpopstate = ((state) => {
            const path = window.location.pathname;
            route(path.replaceAll('/', ''));
        });
        const path = window.location.pathname;
        const parts = path.split('/');
        router.route(router.getRouteFromPath(parts[1], parts[2]), parts[2]);
    }

};
export default app;
