const fetch = require('node-fetch');

if (!globalThis.fetch) {
    globalThis.fetch = fetch;
}

const Hapi = require('@hapi/hapi');
const SearchUsersRoute = require('./routes/search_users.route');

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    server.route([
        SearchUsersRoute
    ]);

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();