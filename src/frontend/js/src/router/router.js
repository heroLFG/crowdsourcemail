import auth from '../auth/auth.js';
import settings from '../settings/settings.js';
import crowdsourcemail from '../crowdsourcemail/crowdsourcemail.js';

const router = {
    
    route: (route) => {
        const routes = {
            crowdsourcemail: crowdsourcemail.showCrowdsourcemailApp,
            settings: settings.showSettingsApp,
            login: auth.showLogin,
        };
        history.pushState({}, route, route);
        $('.nav-link').removeClass('active');
        if (!routes[route]) {
            route = 'crowdsourcemail';
        }
        routes[route].call();
        $(`.nav-link.${route}`).addClass('active');
    }

};
export default router;
