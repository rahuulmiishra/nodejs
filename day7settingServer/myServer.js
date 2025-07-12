import http from "node:http";
// 1nginx revers
//
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "url";
import { URL } from "url";
// __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = http.createServer(serverHandlerForPdf);

server.listen(3000, serverListener);

function serverListener(error) {
  if (error) {
    console.log("Failed to start Server");
    return;
  }

  console.log("Server Started");
}

function serverHandler(req, response) {
  const fullUrl = new URL(req.url, `http://${req.headers.host}`);
  // req.url => /path?queryParams
  console.log(fullUrl.pathname); // e.g. "/api"
  console.log(fullUrl.searchParams); // e.g. ?id=123&name=John
  console.log(fullUrl.searchParams.get("data")); // "123"
  console.log(fullUrl.searchParams.get("product")); // "123"
  response.end(
    `<h1> ${fullUrl.searchParams.get(
      "product"
    )}Hey there ${fullUrl.searchParams.get("data")} </h1>`
  );
}

function serverHandlerForBody(req, response) {
  let body = "";

  req.on("data", (chunk) => {
    console.log("c", chunk);
    body += chunk;
  });

  req.on("end", () => {
    console.log("Body received:", body);

    try {
      const parsed = JSON.parse(body);
      console.log("Parsed body:", parsed);
    } catch {
      console.log("Plain text or form data:", body);
    }
  });
  response.end("Data");
}

/* ** 

 Reading Headers

**/
/* ** 

 Returning Header
  console.log(request.headers);
**/

function serverHandlerStaticWebSite(request, response) {
  const loc = path.join(__dirname, "./assets/index.html");
  fs.readFile(loc, function (err, data) {
    // response.setHeader("Content-Type", "text/html");
    response.end(data);
  });
}

function serverHandlerForReactApp(req, res) {
  let reqPath = req.url === "/" ? "/index.html" : req.url;
  let filePath = path.join("./assets/dist", reqPath);
  const ext = path.extname(filePath).toLowerCase();

  const mimeTypes = {
    ".html": "text/html",
    ".js": "application/javascript",
    ".css": "text/css",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".json": "application/json",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
  };

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (!err) {
      // File exists, serve it
      const contentType = mimeTypes[ext] || "application/octet-stream";
      res.writeHead(200, { "Content-Type": contentType });

      fs.createReadStream(filePath).pipe(res);
    } else {
      // File not found — assume it's a React Router route, serve index.html
      const indexPath = path.join("./assets/dist", "index.html");
      fs.readFile(indexPath, (err, content) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("500 Server Error");
        } else {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(content);
        }
      });
    }
  });
}

function serverHandlerForImage(request, response) {
  const loc = path.join(__dirname, "./assets/img.avif");
  fs.readFile("./assets/img.avif", function (err, data) {
    response.setHeader("Content-Type", "image/avif");
    response.setHeader(
      "Content-Disposition",
      'attachment; filename="image.avif"'
    );
    response.end(data);
  });
}

function serverHandlerForAudio(request, response) {
  const loc = path.join(__dirname, "./assets/audio.mp3");
  fs.readFile(loc, function (err, data) {
    response.setHeader("Content-Type", "audio/mpeg");
    // response.setHeader("Content-Disposition", 'inline; filename="image.avif"');
    response.end(data);
  });
}

function serverHandlerForVideo(request, response) {
  const loc = path.join(__dirname, "./assets/vid.mp4");
  fs.readFile(loc, function (err, data) {
    response.setHeader("Content-Type", "video/mp4");
    // response.setHeader(
    //   "Content-Disposition",
    //   'attachment; filename="image.mp4"'
    // );
    response.end(data);
  });
}

function serverHandlerForPdf(request, response) {
  if (request.url === "/login" && request.method === "post") {
    return;
  }

  if (request.url === "/logout") {
    return;
  }

  if (request.url === "/getData") {
    return;
  }

  const loc = path.join(__dirname, "./assets/resume.pdf");
  fs.readFile(loc, function (err, data) {
    response.setHeader("Content-Type", "application/pdf");
    // response.setHeader("Content-Disposition", 'inline; filename="image.avif"');
    response.end(data);
  });
}
