import MyExpress from "./myExpress.js";
const app = MyExpress();

app.use(MyExpress.json()); // So Express know you're using JSON

app.get("/", (request, response) => {
  response.end("this is managed by my express");
});

// // POST a JSON object and get it back
app.post("/create", (request, response) => {
  const body = request.body;
  console.log(body);
  response.end("data submitted");
});

app.listen(5001);
