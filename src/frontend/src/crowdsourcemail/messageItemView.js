import router from "../router/router";

class crowdsourcemailMessageItemView {

    showMessage(id) {
        const token = window.herolfg.token;
        const headers = {
            'Authorization': `Token ${token}`
        };
        $.ajax({
            type: 'GET',
            url: `/api/messages/${id}/`,
            contentType: 'application/json',
            headers,
        }).then((data) => {
            const bar = this.getActionBar();
            const message = this.getMessage(data);
            const container = $('<div class="bg-light"></div>');
            container.append(bar).append(message);
            $('.app').html(container);
        });
    }

    getMessage(message) {
        const date = moment(message.processed).format("M/D/YY");
        const container = $('<div class="container"></div>');
        const top = $(`
<div class="row p-5">
    <h2 class="col">${message.subject}</h2>
    <div class="col col-auto"></div>
    <div class="message-date text-end">${date}</div>
</div>
`);
        const bottom = $('<div class="text-body p-5"></div>');
        bottom.html(message.text);
        container.append(top).append(bottom);
        return container;
    }

    getActionBar() {
        const container = $('<div class="container-fluid"></div>');
        const back = $('<button class="btn btn-dark btn-sm back-to-messages m-1"></button');
        back.html('Back');
        back.click(() => router.route(router.CROWDSOURCEMAIL_MESSAGE_LIST_VIEW));
        container.append(back);
        return container;
    }
};

export default crowdsourcemailMessageItemView;
