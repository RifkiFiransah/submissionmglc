 require("dotenv").config();

 const Hapi = require("@hapi/hapi");
 const routes = require("../server/routes");
 const InputError = require("../exceptions/InputError");
 const loadModel = require("../services/loadModel");

 (async () => {
  const server = Hapi.server({
    port: 5000,
    host: "localhost",
    routes: {
      cors: {
        origin: ['*']
      }
    }
  })

  const model = await loadModel();
  server.app.model = model;

  server.route(routes);

  server.ext("onPreResponse", function(request, h) {
    const response = request.response;
    
    const contentLength = parseInt(request.headers['content-length'], 10);
    const maxSize = 1000000; // 1MB
    
    if(response instanceof InputError){
      const newResponse = h.response({
        status: 'fail',
        message: "Terjadi kesalahan dalam melakukan prediksi"
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }
  
    if (contentLength > maxSize) {
      return h.response({
        status: "fail",
        message: `Payload content length greater than maximum allowed: ${maxSize}`
      }).code(413).takeover();
    }
    
    if(response.isBoom){
      const newResponse = h.response({
        status: 'fail',
        message: response.message
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`\nServer start at: ${server.info.uri}`);
 })();