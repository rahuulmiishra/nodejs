import http from "node:http";

export default function MyExpress() {
  const expressObject = { listen: "", get: "", path: "", use: "" };
  const allRequests = [];
  const middlewares = [];

  const server = http.createServer(serverHandler);

  function applyMiddlewares(req, res, finalHandler) {
    let index = 0;

    function next() {
      const middleware = middlewares[index];
      index++;
      if (middleware) {
        middleware(req, res, next);
      } else {
        finalHandler();
      }
    }

    next();
  }

  expressObject.use = function (middleware) {
    middlewares.push(middleware);
  };

  expressObject.get = function (path, callback) {
    allRequests.push({ path, callback });
  };

  expressObject.post = function (path, callback) {
    allRequests.push({ path, callback });
  };

  function serverHandler(req, res) {
    const requestFromExpress = allRequests.find((r) => r.path === req.url);

    if (requestFromExpress) {
      applyMiddlewares(req, res, () => {
        requestFromExpress.callback(req, res);
      });
    } else {
      res.end("404: Not found");
    }
  }

  function serverListener(err) {
    if (err) {
      console.log("Fail to start");
      return;
    }

    console.log("server started at port 5000");
  }

  expressObject.listen = function (port = 5000, cb = serverListener) {
    server.listen(port, cb);
  };

  return expressObject;
}
