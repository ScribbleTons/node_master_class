/**
 *
 * Primary file for the API
 */

//Dependencies
const http = require("http");
const https = require("https");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const config = require("./config");
const fs = require("fs");

//Instantiating the HTTP server
const httpServer = http.createServer(function (req, res) {
  unifiedServer(req, res);
});

//start the HTTP server
httpServer.listen(config.httpPort, function () {
  console.log(
    `listening on port ${config.httpPort} in mode: ${config.envName}`
  );
});

//Instantiating the HTTPS server
const httpsServerOption = {
  key: fs.readFileSync("./https/private.pem"),
  cert: fs.readFileSync("./https/certificate.pem"),
};

const httpsServer = https.createServer(httpsServerOption, function (req, res) {
  unifiedServer(req, res);
});

//start the HTTPS server
httpsServer.listen(config.httpsPort, function () {
  console.log(
    `listening on port ${config.httpsPort} in mode: ${config.envName}`
  );
});

// Define a unified server for both http and https server
const unifiedServer = function (req, res) {
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

    //Choosing a handler to route the path to. If the handler is not found, 404 handler handles the request
    const chosenHandler =
      typeof router[trimmedPath] !== "undefined"
        ? router[trimmedPath]
        : handlers.notFound;
    //Construct the data to pass to the handler
    const data = {
      trimmedPath,
      queryStringObject,
      method,
      header,
      payload: buffer,
    };

    //Route the request to the chosen handler sepecified in the router
    chosenHandler(data, function (statusCode, payload) {
      //use the status code from the callback or default to 200
      statusCode = typeof statusCode == "number" ? statusCode : 200;

      //use the payload from the callback or default to empty object
      payload = typeof payload == "object" ? payload : {};

      //convert the payload to be sent to the user
      const payloadString = JSON.stringify(payload);

      //Return the strified payload as response to the user
      //specify content type
      res.setHeader("Content-Type", "application/json");
      //Send the response
      res.writeHead(statusCode);
      res.end(payloadString);

      //Log the part on terminal
      console.group("Dev logs");
      console.log(`payload string: ${statusCode} ${payloadString}`);
      console.groupEnd();
    });
  });
};

//define the handlers

const handlers = {};

//Sample route handler
handlers.ping = function (data, callback) {
  //Callback a HTTP status code and a payload object
  callback(200);
};

//404 handler
handlers.notFound = function (data, callback) {
  callback(404);
};

//Request router
const router = {
  ping: handlers.ping,
};
