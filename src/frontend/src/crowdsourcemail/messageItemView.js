import router from "../router/router";

class crowdsourcemailMessageItemView {

    id = null;
    tags = null;
    vote = 0;

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
            this.vote = data.user_mail_votes;
            data.user_mail_tags.forEach((tag_info) => this.tags[tag_info.tag.value] = true);

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

        colorClass = this.vote === 1 ? 'btn-primary' : defaultClass;
        const thumbUp = $(`<button class="float-end btn ${colorClass} btn-sm thumb-up m-1"><i class="fas fa-thumbs-up"></i></button>`);
        thumbUp.click(() => {
            let vote = 0;
            if (this.vote !== 1) {
                vote = 1;
            }
            this.doVote(vote);
        });

        colorClass = this.vote === -1 ? 'btn-primary' : defaultClass;
        const thumbDown = $(`<button class="float-end btn ${colorClass} btn-sm thumb-down m-1"><i class="fas fa-thumbs-down"></i></button>`);
        thumbDown.click(() => {
            let vote = 0;
            if (this.vote !== -1) {
                vote = -1;
            }
            this.doVote(vote);
        });

        rightSide.append(trash);
        rightSide.append(spam);
        rightSide.append(archive);
        rightSide.append(star);
        rightSide.append(thumbDown);
        rightSide.append(thumbUp);

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
                set: typeof this.tags[action] === 'undefined'
            })
        }).then((data) => {
            this.showMessage(this.id)
        });
    }

    doVote(vote) {
        const token = window.herolfg.token;
        const headers = {
            'Authorization': `Token ${token}`
        };
        $.ajax({
            type: 'POST',
            url: `/api/votes/`,
            contentType: 'application/json',
            headers,
            data: JSON.stringify({
                vote,
                message: this.id
            })
        }).then((data) => {
            this.showMessage(this.id)
        });
    }
};

export default crowdsourcemailMessageItemView;
