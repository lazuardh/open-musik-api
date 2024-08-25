const Hapi = require("@hapi/hapi");
const albums = require("./api/albums");
const AlbumsService = require("./services/inMemory/AlbumsService");
const Vision = require("@hapi/vision");
const Handlebars = require("handlebars");
const path = require("path");
const AlbumValidator = require("./validator/albums");
const ClientError = require("./exceptions/ClientError");

const init = async () => {
  const albumsService = new AlbumsService();

  const server = Hapi.server({
    port: 5000,
    host: "localhost",
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.register(Vision);

  server.views({
    engines: {
      hbs: Handlebars,
    },
    path: path.join(__dirname, "..", "/views"),
  });

  server.route({
    method: "GET",
    path: "/",
    handler: (request, h) => {
      return h.view("index", {
        title: "Open-musik Api with Hapi.js",
        message:
          "Ini adalah template rendering engine menggunakan handlebars dan plugin vision",
      });
    },
  });

  await server.register({
    plugin: albums,
    options: {
      service: albumsService,
      validator: AlbumValidator,
    },
  });

  server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;
  
    // penanganan client error secara internal.
    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }
      
    return h.continue;
  });


  await server.start();
  console.log(`Server run in ${server.info.uri}`);
};

init();
