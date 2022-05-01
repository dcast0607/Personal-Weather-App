var apiData = null;
var onecallData = null;
var parsedAPIData; 
var weatherBaseURL = "https://api.openweathermap.org/data/2.5/weather?q=";
var onecallBaseURL = "https://api.openweathermap.org/data/2.5/onecall?";
var apiKey = "&appid=f6943a0dceb882e5c00760c15511ba9d";
var units = "&units=imperial"

function apiFetchUVIndex (longitude, latitude) {
    var cityLongitude = "&lon=" + longitude;
    var cityLatitude = "lat=" + latitude;
    var fetchUVIndexEndpoint = onecallBaseURL + cityLatitude + cityLongitude + apiKey;
    console.log(fetchUVIndexEndpoint);
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      fetch(fetchUVIndexEndpoint, requestOptions)
      .then(response => response.json())
      .then(function(data) {
          onecallData = data;
          console.log(onecallData);
          console.log(onecallData.current.uvi);
          $("#cityUVIndexData").text("UV Index: " + onecallData.current.uvi);
      })
      .catch(error => console.log('error', error));
}

function addResponseDataToPage (apiResponse) {
    var responseData = apiResponse;
    console.log(responseData);
    console.log(responseData.name);
    $("#cityName").text(responseData.name);
    console.log(responseData.main.temp);
    $("#cityTemperatureData").text("Temperate: " + responseData.main.temp + "°F");
    console.log(responseData.wind.speed);
    $("#cityWindData").text("Wind: " + responseData.wind.speed + " MPH");
    console.log(responseData.main.humidity);
    $("#cityHumidityData").text("Humidity: " + responseData.main.humidity);
    apiFetchUVIndex (responseData.coord.lon, responseData.coord.lat);
}

function weatherSearch (e) {
    e.preventDefault();
    var userEntry = $("#form1").val();
    userEntry = encodeURI(userEntry);
    var finalRequestUrl = weatherBaseURL + userEntry + units + apiKey;
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      
      fetch(finalRequestUrl, requestOptions)
        .then(response => response.json())
        .then(function(data) {
            apiData = data;
            console.log(apiData);
            addResponseDataToPage(apiData);
        })
        .catch(error => console.log('error', error));
}

$("#searchButton").click(weatherSearch);
