//Global variables
var searchHistory = [];
var renderedCities = [];
var weatherApiUrl = "https://api.openweathermap.org/data/2.5/onecall?";
var geocodeApiUrl = "http://api.openweathermap.org/geo/1.0/direct?";
var weatherApiKey = "dbfb252a5086fde6ee52e8be5d2fce7f";

//DOM elements
var historyDiv = $(".searchHistory");

// pulls saved history from localstorage
function pullHistory(){
    var pulledSearchHistory = JSON.parse(localStorage.getItem("history"));
    pulledSearchHistory !== null ? searchHistory = pulledSearchHistory : null;

    for(var i=0; i<searchHistory.length; i++){
        renderCityBtn(searchHistory[i]);
    }
    return;
}

// renders city button to page
function renderCityBtn(city){
    // checks if we have already rendered the city as a button
    if (!renderedCities.includes(city)){
        var buttonNode = $("<button>")
            .addClass("btn btn-secondary w-100 m-2 fs-5")
            .attr("data-index", city)
            .text(city);
        
        historyDiv.append(buttonNode);
        //check to see if city already in our searchHistory array so we don't duplicate
        !searchHistory.includes(city)? searchHistory.push(city) : null;
        renderedCities.push(city);
        saveHistory();

    }
    return;
}

//checks if city is valid, finds latitude and longitude | calls renderCityBtn and pullWeatherData
function findCityCoord(event){
    // checks for button click
    if (event.target.nodeName === "BUTTON"){
        // in case where we type and click submit we want to find the city we wrote in textarea tag
        if(event.target.dataset.index === "Submit"){
            var requestedCity = $(".form-control").val().toLowerCase();
        //in case where we want to click a button we already have in search history
        } else {
            var requestedCity = event.target.dataset.index;
        }

        if (requestedCity !== null && requestedCity !== "") {
            $.ajax({
                url: `${geocodeApiUrl}q=${requestedCity}&limit=3&appid=${weatherApiKey}`,
                method: "GET"
            }).then(function (response) {
                if (!response[0]) {
                    alert("Please enter a valid city");
                } else {
                    //save city coordinates and pass to weather API
                    var cityName = response[0].name;
                    var latitude = response[0].lat;
                    var longitude = response[0].lon;
                    renderCityBtn(cityName);
                    pullWeatherData(cityName, longitude, latitude);
                }
            }).catch(function (error){
                console.log(error);
            });
        }
    }
    return;
}

//API call to find weather data
function pullWeatherData(city, longitude, latitude){
    $.ajax({
        url: `${weatherApiUrl}lat=${latitude}&lon=${longitude}&units=imperial&appid=${weatherApiKey}`,
        method: "GET"
    }).then(response => {
        renderCurrentWeather(city, response);
        renderForecastWeather(city, response);
    }).catch(function (error) {
        console.log(error);
    })
    return;
}

//renders the current weather data to the page with obj from pullWeatherData
function renderCurrentWeather(city, data){
    // current weather data
    console.log(data);
    var currTemp = data.current.temp;
    var currWind = data.current.wind_speed;
    var currHumid = data.current.humidity;
    var currentUv = data.current.uvi;
    var currentIcon = `https://openweathermap.org/img/w/${data.current.weather[0].icon}.png`;

    $(".todayDate").text(`${city} (${moment().format("M/D/YYYY")})`);
    $(".todayIcon").removeClass("hide").attr("src", currentIcon).attr("alt", data.current.weather[0].description);
    $(".todayTemp").text(`${currTemp} °F`);
    $(".todayWind").text(`${currWind} MPH`);
    $(".todayHumid").text(`${currHumid} %`);
    $(".todayUV").addClass("bg-success rounded text-light p-2").text(currentUv);

    return;
}

//renders the forecast cards to page with obj from pullWeatherData
function renderForecastWeather(_city, data){
    document.querySelector(".card-list").innerHTML = "";

    for (var i=0; i<5; i++){
        var forecastTemp = data.daily[i].temp.day;
        var forecastWind = data.daily[i].wind_speed;
        var forecastHumid = data.daily[i].humidity;
        var forecastIcon = `https://openweathermap.org/img/w/${data.daily[i].weather[0].icon}.png`;

        var cardNode = $("<div>").addClass("card bg-secondary col-2 m-2 text-light");
        var cardBody = $("<div>").addClass("card-body");
        var dateTag = $("<h4>").addClass("mb-1").text(moment().add(i + 1, "d").format("M/D/YYYY"));
        var tempTag = $("<p>").addClass("fs-5").text(`Temp: ${forecastTemp} °F`);
        var windTag = $("<p>").addClass("fs-5").text(`Temp: ${forecastWind} MPH`);
        var humidTag = $("<p>").addClass("fs-5").text(`Temp: ${forecastHumid} %`);
        var iconTag = $("<img>").addClass("float-start").attr("height", "50px").attr("width", "50px").attr("src", forecastIcon);

        cardNode.append(dateTag);
        cardNode.append(iconTag);
        cardNode.append(tempTag);
        cardNode.append(windTag);
        cardNode.append(humidTag);

        cardNode.append(cardBody);
        $(".card-list").append(cardNode);

    }
    return;
}

//saves searchHistory array to localstorage
function saveHistory(){
    localStorage.setItem("history", JSON.stringify(searchHistory));
    return;
}

//Event Listeners
$(".search").on("click", findCityCoord);
$(".searchHistory").on("click", findCityCoord);
$(document).ready(pullHistory);