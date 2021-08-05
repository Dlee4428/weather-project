// Init variables to be used
const express = require("express");
const https = require("https");
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname));

// Client Request and Response from the Server
app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
});

// Handles Post request from user submission
app.post("/", function(req, res){
  // Receive dynamic data based on user input
  const query = req.body.cityName;
  const apiKey = "YOUR API KEY HERE - OPEN WEATHER NETWORK"
  const unit = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;

  // Gets the data from the particular location
  https.get(url, function(response){
    console.log(response.statusCode);

    // Parse JSON data and send it over to the browser using express module.
    response.on("data", function(data){
      const weatherData = JSON.parse(data);
  
      // Check if server status code is 200
      if (weatherData.cod == 200) {
        const temp = weatherData.main.temp;
        const weatherDescription = weatherData.weather[0].description;
        const icon = weatherData.weather[0].icon;
        const iconURL = "http://openweathermap.org/img/wn/" + icon +"@2x.png"
  
        res.send(
          `<!DOCTYPE html>
            <html lang="en" dir="ltr">
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
                <meta name="description" content="">
                <meta name="author" content="">

                <title>Success</title>
                
                <!-- Bootstrap core CSS -->
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
              </head>

              <body>
                <!-- Jumbotron for new bootstrap version-->
                <div class="bg-light p-5 rounded-lg m-3">
                  <div class="container">
                    <h1 class="display-4">Temperature in ${query} is ${temp}°C</h1>
                    <p class="lead"><img src="${iconURL}"> ${weatherDescription.toUpperCase()}</p>

                    <form action="/return" method="post">
                      <button class="btn btn-lg btn-success" type="submit" name="button">Search Another City</button>
                    </form>
                  </div>
                </div>
                <p class="text-center mt-5 mb-3 text-muted">Developed by Dong Hyeong Justin Lee, Openweather API</p>
              </body>
            </html>`);
      } else {
        res.sendFile(__dirname + "/failure.html");
      }
    });
  });
});

// Return to Home page to redirect to home route
app.post("/return", function(req, res){
  res.redirect("/");
})

// Listening on port 3000 and if it goes well then logging a message saying that the server is running
app.listen(process.env.PORT || 3000, function() {
  console.log("server is listening on port 3000");
});