// server.js
const http2 = require("http2");
const fs = require("fs");

const options = {
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("cert.pem"),
};

// Create an HTTP/2 server
const server = http2.createSecureServer(options);

server.on("stream", (stream, headers) => {
  // This is the HTTP/2 equivalent of a request handler
  stream.respond({
    "content-type": "text/plain",
    ":status": 200,
  });
  stream.end("Hello from HTTP/2!");
});

server.listen(4433, () => {
  console.log("HTTP/2 server running at https://localhost:4433/");
});
