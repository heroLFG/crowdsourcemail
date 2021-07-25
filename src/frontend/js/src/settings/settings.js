const settings = {

    showSettingsApp: () => {
        const html =
`
<div class="container mx-auto p-5">
<div class="row g-8 g-m-5">
<form class="profile-form bg-light p-5 rounded border">
    <div class="form-check form-switch">
        <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault" disabled>
        <label class="form-check-label" for="flexSwitchCheckDefault">My Emails are Visible to Non Members</label>
    </div>
</form>
</div>
</div>
`;
        $('.app').html(html);
    }

};
export default settings;
