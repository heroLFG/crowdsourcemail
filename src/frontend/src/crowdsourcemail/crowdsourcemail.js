import router from "../router/router";

class crowdsourcemail {
    
    pageSize = 20;
    mailData =  null;
    nextButton = null;
    previousButton = null;
    tags = null;
    filter = 'all';

    titleCase(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    showCrowdsourcemailApp(url = null) {
        const token = window.herolfg.token;
        const previousUrl = router.getPreviousApi();
        if (url === null) {
            url = previousUrl;
        }
        if (url === null) {
            url = `/api/messages/?page_size=${this.pageSize}&filter=${this.filter}`;
        }
        router.setPreviousApi(url);
        const headers = {
            'Authorization': `Token ${token}`
        };
        $.ajax({
            type: 'GET',
            url,
            contentType: 'application/json',
            headers,
        }).then((data) => {
            this.mailData = data;
            this.renderMailApp();
            this.updateFilters();
        });
    }

    updateFilters() {
        const token = window.herolfg.token;
        const headers = {
            'Authorization': `Token ${token}`
        };
        $.ajax({
            type: 'GET',
            url: '/api/tags/',
            contentType: 'application/json',
            headers,
        }).then((tags) => {
            this.tags = {};
            tags.forEach((tag) => this.tags[tag.value] = tag.user_count);
            console.log('tags', this.tags);
            this.renderFilters();
        });
    }

    renderFilters() {
        const dropdown = $(
`
<div class="dropdown">
  <button class="filter-button m-1 btn btn-secondary btn-sm dropdown-toggle" type="button" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">
    ${this.titleCase(this.filter)} Messages
  </button>
  <ul class="filter-dropdown dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownMenuButton2">
    <li><a data-val="all" class="all dropdown-item active" href="">All Messages</a></li>
    <li><a data-val="star" class="star dropdown-item" href="">Star Messages</a></li>
    <li><a data-val="archive" class="archive dropdown-item" href="">Archive Messages</a></li>
    <li><a data-val="spam" class="spam dropdown-item" href="">Spam Messages</a></li>
    <li><a data-val="trash" class="trash dropdown-item" href="">Trash Messages</a></li>
  </ul>
</div>
`
        );
        $('.filter-dropdown').html(dropdown);
        $('.filter-dropdown .dropdown-item').click((e) => this.filterMessages(e));
    }

    filterMessages(event) {
        event.preventDefault();
        this.filter = $(event.currentTarget).attr('data-val');
        $('.filter-button').html(`${this.titleCase(this.filter)} Messages`);
        this.showCrowdsourcemailApp();
    }

    renderMailApp() {
        const table = $('<table class="table table-striped table-hover"></table>');
        const tbody = $('<tbody></tbody>');
        $.each(this.mailData.results, (index, message) => {
            const messageListItem = this.getMessageListItem(message);
            tbody.append(messageListItem);
        });
        table.append(tbody);
        const container = $('<div class="bg-light"></div>');
        const actionBar = this.getActionBar();
        container.append(actionBar);
        container.append(table);
        $('.app').html(container);
        $('.app tr').click((e) => {
            const messageId = $(e.currentTarget).attr('data-id');
            router.route(router.CROWDSOURCEMAIL_MESSAGE_ITEM_VIEW, messageId);
        });
        this.updateActionBarState();
    }

    getMessageListItem(message) {
        const row = $(`<tr data-id="${message.id}"></tr>`);
        const text = $(`<td class="col-auto"><div class="message"><span class="subject">${message.subject}</span><span class="text">${message.text}</span></div></td>`);
        const time = $(`<td class="date-column">${moment(message.processed).format("M/D/YY")}</td>`);
        if (this.filter && this.filter !== 'all') {
            const count = $(`<td class="count-column">${message.mail_tags_count}</td>`);
            row.append(count);
        }
        row.append(text);
        row.append(time);
        return row;
    }

    getActionBar() {
        let start = 1;
        if (this.mailData.next) {
            const nextPage = parseInt((new URLSearchParams(this.mailData.next)).get('page'), 10);
            start = ((nextPage - 2) * this.pageSize) + 1;
        } else if (this.mailData.previous) {
            let prevPage = 1;
            const page = parseInt((new URLSearchParams(this.mailData.previous)).get('page'), 10);
            if (page) {
                prevPage = page;
            }
            start = ((prevPage) * this.pageSize) + 1;
        }
        const end = start + this.mailData.results.length - 1;

        const leftSide = $('<div class="float-start"><div class="filter-dropdown"></div></div>');

        const rightSide = $('<div class="float-end"></div>');

        if (this.mailData.count === 0) {
            rightSide.append('<div class="p-2">No Messages</div>');
        } else {
            this.previousButton = $('<button class="m-1 btn btn-dark btn-sm previous-page">prev</button>');
            this.previousButton.click(() => this.showPreviousPage());
            this.nextButton = $('<button class="m-1 btn btn-dark btn-sm next-page">next</button>');
            this.nextButton.click(() => this.showNextPage());
            const bar = $(`<div class="col-auto"></div><span class="m-1">${start} - ${end} of ${this.mailData.count}</span>`);
            rightSide.append(bar).append(this.previousButton).append(this.nextButton);
        }

        const container = $('<div class="container-fluid action-bar"></div>');
        container.append(leftSide);
        container.append(rightSide);
        return container;
    }

    showPreviousPage() {
        this.showCrowdsourcemailApp(this.mailData.previous);
    }

    showNextPage() {
        this.showCrowdsourcemailApp(this.mailData.next);
    }

    updateActionBarState() {
        this.nextButton.prop('disabled', this.mailData.next === null);
        this.previousButton.prop('disabled', this.mailData.previous === null);
    }
};
export default crowdsourcemail;
