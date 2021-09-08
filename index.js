/**
 *
 * Primary file for the API
 */

//Dependencies
const http = require("http");
const url = require("url");

//The server should respond to all request with a string
const server = http.createServer(function (req, res) {
  //GET and parse url
  const parsedUrl = url.parse(req.url, true);

  //Get the path
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");
  //Send the response
  res.end("Hello world\n");
  //Log the part on terminal
  console.log("Request received on pathname: " + trimmedPath);
});

//start the server and have it listen to a port
server.listen(3200, function () {
  console.log("listening on port 3200");
});
