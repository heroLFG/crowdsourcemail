class settings {

    showSettingsApp() {
        const html =
`
<div class="container mx-auto p-5">
<div class="row g-8 g-m-5">
<form class="profile-form bg-light p-5 rounded border">
    <div class="form-check form-switch">
        <input class="form-check-input" type="checkbox" id="EmailsVisibleToNonMembers" disabled>
        <label class="form-check-label" for="EmailsVisibleToNonMembers">My Emails are Visible to Non Members</label>
    </div>
</form>
</div>
</div>
`;
        $('.app').html(html);
        this.getSettings();
    }

    getSettings() {
        const token = window.herolfg.token;
        const headers = {
            'Authorization': `Token ${token}`
        };
        $.ajax({
            type: 'GET',
            url: '/api/settings/',
            contentType: 'application/json',
            headers,
        }).then((settings) => {
            const emailsVisibleToNonMembers = settings.length && settings[0].key === 'EmailsVisibleToNonMembers';
            $('#EmailsVisibleToNonMembers')
                .prop('checked', emailsVisibleToNonMembers)
                .prop('disabled', false)
                .off('change')
                .change((e) => {
                    const checked = $(e.currentTarget).prop('checked');
                    console.log('setting changed', checked);
                    this.updateSettings('EmailsVisibleToNonMembers', checked);
                });
        });
    }

    updateSettings(setting, value) {
        const token = window.herolfg.token;
        const headers = {
            'Authorization': `Token ${token}`
        };
        const payload = {
            key: setting,
            value
        };
        $.ajax({
            type: 'POST',
            url: '/api/settings/',
            contentType: 'application/json',
            data: JSON.stringify(payload),
            headers,
        }).then((settings) => {
            this.getSettings();
        });
    }

};

export default settings;
