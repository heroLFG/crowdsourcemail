import auth from '../auth/auth.js';
import settings from '../settings/settings.js';
import crowdsourcemail from '../crowdsourcemail/crowdsourcemail.js';
import crowdsourcemailMessageItemView from '../crowdsourcemail/messageItemView.js';

const router = {
    CROWDSOURCEMAIL_MESSAGE_LIST_VIEW: 'crowdsourcemailMessageListView',
    CROWDSOURCEMAIL_MESSAGE_ITEM_VIEW: 'crowdsourcemailMessageItemView',
    route: (route, id = null) => {
        const routes = {
            settings: settings.showSettingsApp,
            login: auth.showLogin
        };

        if (typeof routes[route] !== 'undefined') {
            routes[route].call();
        } else if (route === router.CROWDSOURCEMAIL_MESSAGE_ITEM_VIEW) {
            const crowdMailMessageView = new crowdsourcemailMessageItemView();
            crowdMailMessageView.showMessage(id);
        } else {
            route = router.CROWDSOURCEMAIL_MESSAGE_LIST_VIEW;
            const crowdMailApp = new crowdsourcemail();
            crowdMailApp.showCrowdsourcemailApp();
        }

        const url = router.getUrl(route, id);
        history.pushState({id}, route, url);
        const nav = $(`.nav-link.${route}`);
        if (nav) {
            $('.nav-link').removeClass('active');
            nav.addClass('active');
        }
    },
    getUrl: (route, id = null) => {
        let url = `/${route}`;
        if (route === router.CROWDSOURCEMAIL_MESSAGE_LIST_VIEW) {
            url = '/messages';
        }
        if (route === router.CROWDSOURCEMAIL_MESSAGE_ITEM_VIEW) {
            url = `/messages/${id}`;
        }
        return url;
    },
    getRouteFromPath: (path, id = null) => {
        let route = path;
        if (route === 'messages') {
            route = router.CROWDSOURCEMAIL_MESSAGE_LIST_VIEW;
            if (id) {
                route = router.CROWDSOURCEMAIL_MESSAGE_ITEM_VIEW;
            }
        }
        return route;
    }

};
export default router;
