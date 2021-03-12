// Stock Watcher App
const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const path = require("path");
const request = require("request");
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 5000;

// user body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));

// iexapis API KEY: pk_2915dffcf93e4cc2bd318bb8f40bce4a
// financialmodelingprep API KEY: 1434a42143c40698efa9ab7e2cbdbec0

const url =
  "https://cloud.iexapis.com/stable/stock/fb/quote?token=pk_2915dffcf93e4cc2bd318bb8f40bce4a";
//"https://financialmodelingprep.com/api/v3/quote/AAPL,FB,GOOG?apikey=1434a42143c40698efa9ab7e2cbdbec0";

function call_api(finishedAPI, ticker) {
  request(
    "https://cloud.iexapis.com/stable/stock/" +
      ticker +
      "/quote?token=pk_2915dffcf93e4cc2bd318bb8f40bce4a",
    { json: true },
    (err, res, body) => {
      if (err) {
        return console.log(err);
      }
      if (res.statusCode === 200) {
        //console.log(body);
        finishedAPI(body);
      }
    }
  );
}

// Set Handlebars Middleware
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

const otherstuff = "hello there, this is other stuff!";

// Set handlebar index GET route
app.get("/", function (req, res) {
  call_api(function (doneAPI) {
    res.render("home", {
      stock: doneAPI,
    });
  }, "fb");
});

// Set handlebar index POST route
app.post("/", function (req, res) {
  call_api(function (doneAPI) {
    //console.log(doneAPI);
    //posted_stuff = req.body.stock_ticker;
    res.render("home", {
      stock: doneAPI,
    });
  }, req.body.stock_ticker);
});

// create about page route
app.get("/about.html", function (req, res) {
  res.render("about");
});

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => console.log("Server Listening on port " + PORT));
