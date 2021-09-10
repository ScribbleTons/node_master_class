/**
 *
 * Primary file for the API
 */

//Dependencies
const http = require("http");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;

//The server should respond to all request with a string
const server = http.createServer(function (req, res) {
  //GET and parse url
  const parsedUrl = url.parse(req.url, true);

  //Get the path
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");

  //Get query string parameters
  const queryStringObject = parsedUrl.query;

  //Get HTTP method
  const method = req.method.toLowerCase();

  //Get headers as object
  const header = req.headers;

  //Get a payload if any
  const decoder = new StringDecoder("utf-8");
  let buffer = "";

  req.on("data", function (data) {
    buffer += decoder.write(data);
  });

  req.on("end", function () {
    buffer += decoder.end();

    //Send the response
    res.end("Hello world\n");

    //Log the part on terminal
    console.group("Dev logs");
    console.log(`Request received on pathname: ${trimmedPath}`);
    console.log("query paramenters", queryStringObject);
    console.log("header", header);
    console.log("Body: " + buffer);
    console.groupEnd();
  });
});

//start the server and have it listen to a port
server.listen(3200, function () {
  console.log("listening on port 3200");
});
