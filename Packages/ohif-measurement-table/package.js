Package.describe({
    name: 'ohif:measurement-table',
    summary: 'OHIF Measurement table',
    version: '0.0.1'
});

Npm.depends({
    'dicomweb-client': 'file:///Users/Erik/Projects/OHIF/dicomweb-client'//'0.2.0'
});

Package.onUse(function(api) {
    api.versionsFrom('1.6');

    api.use('ecmascript');

    // Our custom packages
    api.use('ohif:cornerstone');
    api.use('ohif:core');
    api.use('ohif:cornerstone-settings');
    api.use('ohif:viewerbase');
    api.use('ohif:measurements');
    api.use('ohif:wadoproxy');

    api.mainModule('client/index.js', 'client');
});
