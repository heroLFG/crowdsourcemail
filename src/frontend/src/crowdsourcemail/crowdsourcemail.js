import router from "../router/router";

class crowdsourcemail {
    
    pageSize = 20;
    mailData =  null;
    nextButton = null;
    previousButton = null;

    showCrowdsourcemailApp(url = null) {
        const token = window.herolfg.token;
        if (url === null) {
            url = `/api/messages/?page_size=${this.pageSize}`;
        }
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
        });
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
        row.append(text);
        row.append(time);
        return row;
    }

    getActionBar() {
        let start = 1;
        if (this.mailData.next) {
            const nextPage = parseInt(this.mailData.next.split('?page=')[1], 10);
            start = ((nextPage - 2) * this.pageSize) + 1;
        } else if (this.mailData.previous) {
            let prevPage = 1;
            const parts = this.mailData.previous.split('?page=');
            if (parts.length === 2) {
                prevPage = parseInt(parts[1], 10);
            }
            start = ((prevPage) * this.pageSize) + 1;
        }
        const end = start + this.mailData.results.length - 1;

        const rightSide = $('<div class="float-end"></div>');

        this.previousButton = $('<button class="m-1 btn btn-dark btn-sm previous-page">prev</button>');
        this.previousButton.click(() => this.showPreviousPage());

        this.nextButton = $('<button class="m-1 btn btn-dark btn-sm next-page">next</button>');
        this.nextButton.click(() => this.showNextPage());
        
        const bar = $(`<div class="col-auto"></div><span class="m-1">${start} - ${end} of ${this.mailData.count}</span>`);
        rightSide.append(bar).append(this.previousButton).append(this.nextButton);

        const container = $('<div class="container-fluid"></div>');
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
