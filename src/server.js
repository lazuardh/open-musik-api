require("dotenv").config();

const Hapi = require("@hapi/hapi");
const Jwt = require('@hapi/jwt');
const albums = require("./api/albums");
const AlbumsService = require("./services/postgres/AlbumsService");
const Vision = require("@hapi/vision");
const Handlebars = require("handlebars");
const path = require("path");
const AlbumValidator = require("./validator/albums");
const ClientError = require("./exceptions/ClientError");
const songs = require("./api/songs");
const SongsService = require("./services/postgres/SongsService");
const SongValidator = require("./validator/songs");
const users = require("./api/users");
const UsersService = require("./services/postgres/UsersService");
const UserValidator = require("./validator/users");
const authentications = require('./api/authentication');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentication');

const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.register(Vision);

  await server. register([
    {
      plugin: Jwt,
    }
  ]);

  server.auth.strategy('openmusikapp__jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

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

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: AlbumValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UserValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
  ]);

  server.ext("onPreResponse", (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;

    // penanganan client error secara internal.
    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: "fail",
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
