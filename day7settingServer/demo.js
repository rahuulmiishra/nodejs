const http = require("http");

http
  .createServer((req, res) => {
    res.writeHead(200, "good", { "access-control-allow-origin": "*" });

    // res.setHeader("Content-Type", "text/plain");

    let count = 0;
    const interval = setInterval(() => {
      res.write(`Chunk ${count}\n`);
      count++;

      if (count >= 5) {
        clearInterval(interval);
        res.end("All chunks sent\n"); // Marks the end
      }
    }, 3000);
  })
  .listen(3000);
