// Init variables to be used
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

// Client Request and Response from the Server
app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res){
  // Receive dynamic data based on user input
  const query = req.body.cityName;
  const apiKey = "61577afa46d210cc1db752aac0490250"
  const unit = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;

  // Gets the data from the particular location
  https.get(url, function(response){
    console.log(response.statusCode);

    // Parse JSON data and send it over to the browser using express module.
    response.on("data", function(data){
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const iconURL = "http://openweathermap.org/img/wn/" + icon +"@2x.png"

      res.write("<p>The weather is currently " + weatherDescription + "</p>");
      res.write("<h1>The temperature in " + query +" is " + temp + " degrees Celcius.</h1>");
      res.write("<img src=" + iconURL + ">");
      res.send();
    });
  });
});


// Trigger Server to be enable at port 3000
app.listen(3000, function(){
  console.log("Server is running on port 3000.");
});
