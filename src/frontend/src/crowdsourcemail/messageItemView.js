import router from "../router/router";

class crowdsourcemailMessageItemView {

    id = null;
    tags = null;

    showMessage(id) {
        this.id = id;
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
            this.tags = {};
            data.mail_tags.forEach((tag) => this.tags[tag.value] = tag.user_count);
            console.log('tags', this.tags);

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
        const container = $('<div class="container-fluid message-action-bar"></div>');
        const row = $('<div class="row"></div>');
        container.append(row);
        const leftSide = $('<div class="left-side float-start col"></div>');
        const rightSide = $('<div class="right-side float-end col-12 col-sm-6"></div>');

        const back = $('<button class="col float-start btn btn-dark btn-sm back-to-messages m-1"></button');
        back.html('Back');
        back.click(() => router.route(router.CROWDSOURCEMAIL_MESSAGE_LIST_VIEW));
        leftSide.append(back);
        row.append(leftSide);

        row.append('<div class="col-auto"></div>');

        const defaultClass = 'btn-dark';
        let colorClass = this.tags['star'] ? 'btn-primary' : defaultClass;
        const star = $(`<button class="col float-end btn ${colorClass} btn-sm star m-1"></button>`);
        star.html('Star');
        star.click(() => {
            this.doAction('star');
        });

        colorClass = this.tags['archive'] ? 'btn-primary' : defaultClass;
        const archive = $(`<button class="col float-end btn ${colorClass} btn-sm archive m-1"></button>`);
        archive.html('Archive');
        archive.click(() => {
            this.doAction('archive');
        });

        colorClass = this.tags['spam'] ? 'btn-primary' : defaultClass;
        const spam = $(`<button class="col float-end btn ${colorClass} btn-sm spam m-1"></button>`);
        spam.html('Spam');
        spam.click(() => {
            this.doAction('spam');
        });

        colorClass = this.tags['trash'] ? 'btn-primary' : defaultClass;
        const trash = $(`<button class="col float-end btn ${colorClass} btn-sm trash m-1"></button>`);
        trash.html('Trash');
        trash.click(() => {
            this.doAction('trash');
        });
        rightSide.append(trash);
        rightSide.append(spam);
        rightSide.append(archive);
        rightSide.append(star);

        row.append(rightSide);
        return container;
    }

    doAction(action) {
        const token = window.herolfg.token;
        const headers = {
            'Authorization': `Token ${token}`
        };
        $.ajax({
            type: 'POST',
            url: `/api/tags/`,
            contentType: 'application/json',
            headers,
            data: JSON.stringify({
                value: action,
                message: this.id,
                set: this.tags[action] === null || this.tags[action] === 0
            })
        }).then((data) => {
            this.showMessage(this.id)
        });
    }
};

export default crowdsourcemailMessageItemView;
