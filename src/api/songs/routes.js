const routes = (handler) => [
    {
        method: 'POST',
        path: '/songs',
        handler: handler.postSongHandler,
        options: {
            auth: 'openmusikapp__jwt',
        },
    },
    {
        method: 'GET',
        path: '/songs',
        handler: handler.getSongsHandler,
        options: {
            auth: 'openmusikapp__jwt',
        },
    },
    {
        method: 'GET',
        path: '/songs/{id}',
        handler: handler.getSongHandlerById,
        options: {
            auth: 'openmusikapp__jwt',
        },
    },
    {
        method: 'PUT',
        path: '/songs/{id}',
        handler: handler.putSongHandlerById,
        options: {
            auth: 'openmusikapp__jwt',
        },
    },
    {
        method: 'DELETE',
        path: '/songs/{id}',
        handler: handler.deleteSongHandler,
        options: {
            auth: 'openmusikapp__jwt',
        },
    }
];


module.exports = routes;
