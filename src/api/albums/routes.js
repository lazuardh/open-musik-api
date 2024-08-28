const routes = (handler) => [
    {
        method: 'POST',
        path: '/albums',
        handler:  handler.postAlbumHandler,
        options: {
            auth: 'openmusikapp__jwt',
        },
    },
    {
        method: 'GET',
        path: '/albums/{id}',
        handler: handler.getAlbumHandlerById,
        options: {
            auth: 'openmusikapp__jwt',
        },
    },
    {
        method: 'PUT',
        path: '/albums/{id}',
        handler: handler.putAlbumHandlerById,
        options: {
            auth: 'openmusikapp__jwt',
        },
    },
    {
        method: 'DELETE',
        path: '/albums/{id}',
        handler: handler.deleteAlbumHandler,
        options: {
            auth: 'openmusikapp__jwt',
        },
    }
];

module.exports = routes;