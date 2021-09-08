fetch('https://5dc588200bbd050014fb8ae1.mockapi.io/assessment')
    .then(response => response.json())
    .then(users => {
        data = {
            "showDetails": false,
            "users": users
        }
        var template = $('#profile-template').html();
        var templateScript = Handlebars.compile(template);
        var html = templateScript(data);
        $('#user-list').html(html);
    });