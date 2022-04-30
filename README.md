# Personal-Weather-App

## Objective

Build a weather app that leverages the "Open Weather API." This app will allow a user to enter the name of a city and in return we will return the current weather forecast for that city. In addition to this, we will also produce a 5 day weather forecast for the user. 

Any searches that the user has performed will be saved to local storage so that the user can access this data in the future without having to type out the name of the city.

```Open Weather API Documentation: https://openweathermap.org/api/one-call-api```

#### Technical Requirements
```
GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
WHEN I view the UV index
THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city
```