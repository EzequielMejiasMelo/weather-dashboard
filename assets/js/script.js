//Global variables
var searchHistory = [];
var renderedCities = [];
var weatherApiUrl = "https://api.openweathermap.org/data/2.5/onecall?";
var geocodeApiUrl = "http://api.openweathermap.org/geo/1.0/direct?";
var weatherApiKey = "dbfb252a5086fde6ee52e8be5d2fce7f";

//DOM elements
var historyDiv = $(".searchHistory");

function pullHistory(){
    var temp = JSON.parse(localStorage.getItem("history"));
    temp !== null ? searchHistory = temp : null;

    for(var i=0; i<searchHistory.length; i++){
        initialRender(searchHistory[i]);
    }
}

function initialRender(city) {
    if (!renderedCities.includes(city)){
        var buttonNode = $("<button>")
            .addClass("btn btn-secondary w-100 m-2 fs-5")
            .attr("data-index", city)
            .text(city);
        
        historyDiv.append(buttonNode);
        renderedCities.push(city);
        findCityCoord(city);
    }
}

function renderCityBtn(event){
    if (event.target.dataset.index === "Submit") {
        var requestedCity = $(".form-control").val()
        if (!renderedCities.includes(requestedCity)){
            var buttonNode = $("<button>")
                .addClass("btn btn-secondary w-100 m-2 fs-5")
                .attr("data-index", requestedCity)
                .text(requestedCity);
            
            historyDiv.append(buttonNode);
            renderedCities.push(requestedCity);
        }
        findCityCoord(requestedCity);
    }
    return;
}

function findCityCoord(city){
    $.ajax({
        url: `${geocodeApiUrl}q=${city}&limit=3&appid=${weatherApiKey}`,
        method: "GET"
    }).then(function (response) {
        console.log("GET request from Geocode API \n-----------")
        console.log(response);
        var latitude = response[0].lat;
        var longitude = response[0].lon;
        renderCurrentWeather(city, latitude, longitude);
        renderForecastWeather(city, latitude, longitude);
    });
    return;
}

function renderCurrentWeather(city, latitude, longitude){
    $.ajax({
        url: `${weatherApiUrl}lat=${latitude}&lon=${longitude}&units=imperial&appid=${weatherApiKey}`,
        method: "GET"
    }).then(function (response) {
        var currTemp = response.current.temp;
        var currWind = response.current.wind;
        var currHumid = response.current.humidity;
        var currentUv = response.current.uvi;
        var currentIcon = `https://openweathermap.org/img/w/${response.current.weather[0].icon}.png`;

        $(".todayDate").text(city + " (" + moment().format("M/D/YYYY") + ") ");
        $(".todayIcon").attr("src", currentIcon).attr("alt", response.current.weather[0].description);
        $(".todayTemp").text(currTemp);
        $(".todayWind").text(currWind);
        $(".todayHumid").text(currHumid);
        $(".todayUV").text(currentUv);
    })

    return;
}

function renderForecastWeather(city, latitude, longitude){
    return;
}

function saveHistory(){
    localStorage.setItem("history", JSON.stringify(searchHistory));
    return;
}

//Event Listeners
historyDiv.on("click", renderCityBtn);