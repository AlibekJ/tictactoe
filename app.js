"use strict";
console.log("starting tictactoe");
global.colors = require("colors");


(async () => {


  const fs = require("fs");
  const Koa = require("koa");
  const logger = require("koa-logger")
  const route = require("koa-route");
  const koaBody = require("koa-body");
  const compress = require("koa-compress")
  const serve = require("koa-static");
  const path = require("path");
  const range = require("koa-range");

  const app = new Koa();
  let serverHTTP;
  serverHTTP = require("http").createServer(app.callback());



  const tictactoe = require("./tictactoe_controller");


  const cors = require("@koa/cors"); //!!! Change access control origin
  app.use(cors());





  app.use(compress())
  app.use(logger());

  app.use(koaBody({
    multipart: true,
    jsonLimit: 10000000 * 1024 * 1024, //!!! Set realistic limits
    formLimit: 10000000 * 1024 * 1024,
    textLimit: 10000000 * 1024 * 1024,
    maxFields: 1000000,
    maxFieldsSize: 20000 * 1024 * 1024,
    formidable: {
      maxFields: 10000000,
      maxFieldsSize: 200000 * 1024 * 1024,
    }
  }));



  app.use(range);


  app.use(serve(path.join(__dirname, "public"), {
    maxage: 1000000
  }));


  app.use(route.get("/ping", tictactoe.ping));
  app.use(route.post("/start", tictactoe.start));
  app.use(route.post("/join/:roomId", tictactoe.join));



  //routes above do not require authentication
  app.use(async (ctx, next) => {
    await tictactoe.checkToken(ctx, app);
    await next();
  });




  //routes below do require authentication
  //----------------------------------------------------------------------------------------
  //----------------------------------------------------------------------------------------
  //----------------------------------------------------------------------------------------
  //----------------------------------------------------------------------------------------
  //----------------------------------------------------------------------------------------
  //----------------------------------------------------------------------------------------
  //----------------------------------------------------------------------------------------




  app.use(route.get("/state", tictactoe.state));
  app.use(route.post("/move/:x/:y", tictactoe.move));













  process.on('unhandledRejection', (reason, promise) => {
    console.error("unhandledRejection", reason);
  });






  serverHTTP.listen(process.env.PORT || 6000);
  console.log("development".yellow, "on port ".green + (process.env.PORT || 6000));








})();