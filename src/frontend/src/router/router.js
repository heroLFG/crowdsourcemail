import auth from '../auth/auth.js';
import settings from '../settings/settings.js';
import crowdsourcemail from '../crowdsourcemail/crowdsourcemail.js';

const router = {
    
    route: (route) => {
        const routes = {
            settings: settings.showSettingsApp,
            login: auth.showLogin,
        };
        history.pushState({}, route, route);
        $('.nav-link').removeClass('active');
        if (!routes[route]) {
            route = 'crowdsourcemail';
        }
        if (route === 'crowdsourcemail') {
            const crowdMailApp = new crowdsourcemail();
            crowdMailApp.showCrowdsourcemailApp();
        } else {
            routes[route].call();
        }
        $(`.nav-link.${route}`).addClass('active');
    }

};
export default router;
