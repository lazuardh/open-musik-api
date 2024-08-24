const Hapi = require("@hapi/hapi");

const init = async () => {
  const server = Hapi.server({
    port: 1000,
    host: "localhost",
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.start();
  console.log(`Server run in ${server.info.uri}`);
};

init();
