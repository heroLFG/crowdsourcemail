const crowdsourcemail = {
    
    showCrowdsourcemailApp: () => {
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
            crowdsourcemail.renderMailApp(data);
        });
    },

    renderMailApp: (mailData) => {
        const table = $('<table class="table table-striped"></table>');
        const tbody = $('<tbody></tbody>');
        $.each(mailData.results, (index, message) => {
            console.log('message', message);
            const messageListItem = crowdsourcemail.getMessageListItem(message);
            tbody.append(messageListItem);
        });
        table.append(tbody);
        const container = $('<div class="container-fluid bg-light"></div>');
        container.append(table);
        $('.app').html(container);
    },

    getMessageListItem: (message) => {
        const row = $('<tr></tr>');
        const text = $(`<td class="col-11"><div class="message"><span class="subject">${message.subject}</span><span class="text">${message.text}</span></div></td>`);
        const time = $(`<td class="col-1">${moment(message.processed).format("M/D/YY")}</td>`);
        row.append(text);
        row.append(time);
        return row;
    }

};
export default crowdsourcemail;
