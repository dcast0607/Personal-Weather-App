var apiData = null;
var onecallData = null;
var fiveDayData = null;
var userEntry = null;
var localStorageIndex = 1;
var retrieveLocalStorageIndex = 1;
var excludeParameters = "&exclude=current,minutely,hourly";
var weatherBaseURL = "https://api.openweathermap.org/data/2.5/weather?q=";
var onecallBaseURL = "https://api.openweathermap.org/data/2.5/onecall?";
var fiveDayForecastBaseURL = "https://api.openweathermap.org/data/2.5/onecall?"
var apiKey = "&appid=f6943a0dceb882e5c00760c15511ba9d";
var units = "&units=imperial";


function pushLocalDataToPage() {
    console.log($("#localStorageKeyButton").val());
}

//This function is called each time we retrieve a key and it's value from local storage.
//We first check if the key has a value, if it does, we then print that information onto
//the "Past Searches" section.
function retrieveCityNameAddToPage (index, localStorageKeyValue) {
    var localStorageKeyValueIndex = index;
    var retrievedLocalStorageValue = localStorageKeyValue;
    if (retrievedLocalStorageValue === null ) {
        console.log("Done unloading local storage");
    }
    //Using a template literal to create the element that will hold our local storage data.
    else {
        var searchedCityListings = `
        <li id="pastSearchesListItem${localStorageKeyValueIndex}" class="searchedListItem searchedListItemContainer">
            <button id="localStorageKeyButton${localStorageKeyValueIndex}" type="button" class="searchedListItem searchedListItemContainer"
            value="${retrievedLocalStorageValue}">
            ${retrievedLocalStorageValue}
            </button>
        </li>
    `
    };
    //Newly created template literal element is added to the parent item "pastSearchesList"
$("#pastSearchesList").append(searchedCityListings);
//Add counter to "retrieveLocalStorageIndex" to keep track of what elements are being created.
retrieveLocalStorageIndex++;
//If there is data is the "Past Searches" container, we make sure that the clear button
//is visible.
$("#clearLocalStorage").removeClass("buttonVisibility");
}

function addFiveDayForecastData (data) {
    var fiveDayResponseData = data;
    console.log(fiveDayResponseData);
    var dailyForecastContainer = `
        <div id="dailyForecastGrid" class="dailyForecastGridContainer">

        </div>
    `
    $("#dailyForecastContainerBox").append(dailyForecastContainer);

    for (var i = 1; i < 6 ; i++) {
        var isoDate = fiveDayResponseData.daily[i].dt;
        var dateConverted = moment.unix(isoDate);
        var dailyForecastContainerItems = `
            <div id="grid-item${i}" class="grid-item">
                <h4 class="dailyForecastHeader">${moment.unix(isoDate).format("MMMM Do, YYYY")}</h4>
                <h4 class="dailyForecastHeader">&#x2601;</h4>
                <ul>
                    <li id="dailyForecastItemTemp${i}" class="dailyForecastItemStyling">Temperature: </li>
                    <li id="dailyForecastItemWind${i}" class="dailyForecastItemStyling">Wind: </li>
                    <li id="dailyForecastItemHumidity${i}" class="dailyForecastItemStyling">Humidity: </li>
                </ul>
            </div>
        `
        $("#dailyForecastGrid").append(dailyForecastContainerItems);
    }

    for (var i = 1; i < 6; i++) {
        var fiveDayForecastTemp = "Temperature: " + fiveDayResponseData.daily[i].temp.day + "°F";
        var fiveDayForecastWind = "Wind: " + fiveDayResponseData.daily[i].wind_speed + " MPH";
        var fiveDayForecastHumidity = "Humidity: " + fiveDayResponseData.daily[i].humidity;
        console.log(fiveDayForecastTemp);
        console.log(fiveDayForecastWind);
        console.log(fiveDayForecastHumidity);
        $("#dailyForecastItemTemp"+ i).text(fiveDayForecastTemp);
        $("#dailyForecastItemWind"+ i).text(fiveDayForecastWind);
        $("#dailyForecastItemHumidity"+ i).text(fiveDayForecastHumidity);
    }
}


function fetchFiveDayForecast (longitude, latitude) {
    var cityLongitude = "&lon=" + longitude;
    var cityLatitude = "lat=" + latitude;
    var fetchFiveDayForecastEndpoint = fiveDayForecastBaseURL + cityLatitude + cityLongitude + excludeParameters + units + apiKey;
    console.log(fetchFiveDayForecastEndpoint);
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      fetch(fetchFiveDayForecastEndpoint, requestOptions)
      .then(response => response.json())
      .then(function(data) {
          fiveDayData = data;
          console.log(fiveDayData);
          addFiveDayForecastData(fiveDayData);
      })
      .catch(error => console.log('error', error));
}

function recordCityName () {
    searchedCityNameData = window.localStorage.getItem("cityName" + localStorageIndex);
    console.log(searchedCityNameData);
    var searchedCityListings = `
        <li id="pastSearchesListItem${localStorageIndex}" class="searchedListItem searchedListItemContainer">
            ${searchedCityNameData}
        </li>
    `
    $("#pastSearchesList").append(searchedCityListings);
    retrieveLocalStorageIndex++;
    $("#clearLocalStorage").removeClass("buttonVisibility");
};


function saveCityNameToLocalStorage(userEntry) {
    var cityName;
    cityName = decodeURIComponent(userEntry);
    console.log(cityName);
    console.log(localStorageIndex);
    window.localStorage.setItem("cityName" + localStorageIndex, cityName);
    recordCityName();
    localStorageIndex++;
}

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

function displayDate () {
    setInterval(function () {
        var currentDayText = moment().format("MMMM Do, YYYY");
        $("#currentDay").text(" - " + currentDayText);
    }, 1000)
}

//Clearing the last entry to make sure we don't keep populating new data on top
//of existing data. Using the remove method to remove the container that is holding
//the data that needs to be cleared.
function clearLastEntry() {
    $("#dailyForecastGrid").remove();
}

function addResponseDataToPage (apiResponse) {
    clearLastEntry();
    displayDate();
    var responseData = apiResponse;
    $("#cityName").text(responseData.name);
    $("#cityTemperatureData").text("Temperate: " + responseData.main.temp + "°F");
    $("#cityWindData").text("Wind: " + responseData.wind.speed + " MPH");
    $("#cityHumidityData").text("Humidity: " + responseData.main.humidity);
    apiFetchUVIndex (responseData.coord.lon, responseData.coord.lat);
    fetchFiveDayForecast(responseData.coord.lon, responseData.coord.lat);
}

//Function below is used to construct the URL that we will be using to construct
//our URL, once the URL has been constructed, we then make the request to the API.
function makeCurrentWeatherAPIRequest (userEntry) { 
    var encodedUserEntry = userEntry;
    var finalRequestUrl = weatherBaseURL + encodedUserEntry + units + apiKey;
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    //Retrieving response data and passing that data to a different function, the
    //data from the API response will be used to populate data onto our webpage.
    fetch(finalRequestUrl, requestOptions)
        .then(response => response.json())
        .then(function(data) {
            apiData = data;
            console.log(apiData);
            //Data is passed over to a separate function. This function will parse
            //through the data being returned and it will add this data to our page.
            addResponseDataToPage(apiData);
        })
        .catch(function (error) {
            //When our request errors out, we display and error message to the user
            //and ask them to try again.
            window.alert("Invalid city name, please try again!");
        });
}

//When the user clicks on the search function we call this function. The function
//will first check if the user has entered a value, if the user has not entered
//a value we will display an alert to the user to ask them to enter a city name. 
function searchValidation (e) {
    e.preventDefault();
    //Checking null entry.
    if ($("#form1").val() === "") {
        window.alert("Please make sure that you enter a valid city.")
    }
    //If the user enters a valid entry, we fetch the current weather data from the
    //Open Weather API. 
    else {
        //We are also encoding the user's input to make sure that
        //we don't run into any random issues with white spaces.
        userEntry = $("#form1").val();
        userEntry = encodeURI(userEntry);
        //Encoded user entry is being passed over to the function that will make our
        //request.
        makeCurrentWeatherAPIRequest(userEntry);
        //When this is a new entry, we also save the query request to local storage
        //so that it can be displayed to the user under the "Past Searches" container.
        saveCityNameToLocalStorage(userEntry);
    }
}


//Checks for data stored in local storage. The way I have structured the data is
//store items in an order with an index value associated to them. Since the data 
//is being stored in order, I really only need to just check if there's a value in
//the first key. 👍
function checkLocalStorageData () {
    var localStorageKeyIndex = "cityName1";
    var localStorageKeyValue = localStorage.getItem(localStorageKeyIndex);
    if (localStorageKeyValue === null ) {
        console.log("There's nothing in local storage.");
    }
    //When there is data in the first key, we cycle through the keys and user 
    //another function to render the data on the page. 
    else {
        while (localStorageKeyValue) {
            localStorageKeyValue = localStorage.getItem("cityName" + localStorageIndex);
            retrieveCityNameAddToPage(localStorageIndex, localStorageKeyValue);
            localStorageIndex++;
        };
    //Should only execute is there is data in the local storage. Our loop goes
    //1 past the actual number of keys available in local storage. To keep our local
    //keys and new keys in sync, we must decrease that index by 1. 
    localStorageIndex = localStorageIndex - 1;
    }; 
}

//When the user clicks on the "clear storage" button we will dump the data that
//exists in the local storage and reload the page. We will also add a "buttonVisibility"
//class to the button to hide it when there is no local storage.
//Commented and Refactored 👍 
function clearPage() {
    localStorage.clear();
    location.reload();
    $("#clearLocalStorage").addClass("buttonVisibility");
}

//The first event listener here is being used to look at the "search button"
//found under the search city text box. When the user clicks on this button
//it will initialize our app and trigger additional requests to fetch data
//from the OpenWeather API and display that data to the user. The click of 
//the button will call the "searchValidation" function. 
//This is commented and refactored 👍 
$("#searchButton").click(searchValidation);
//The second event listener here is being used to give the user an option to
//clear their local storage. 
//This is commented and refactored 👍 
$("#clearLocalStorage").click(clearPage);
//Creating a function that will check if there is any data in local storage, 
//if there is data in local storage then we call a function to display this data
//upon page load.
//This is commented and refactored 👍  
$(document).ready(checkLocalStorageData);
