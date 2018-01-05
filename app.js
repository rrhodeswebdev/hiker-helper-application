//Capture user input, which should be a location
function userSubmitData() {
  $('.js-search-form').on('click', '.js-submit-btn', function(event) {
    event.preventDefault();

    console.log("user clicked");

    let userValue = $('#input-field').val();

    console.log(userValue);

    fetchGoogleMapData(userValue, fetchGoogleMapData);

    userValue = $('#input-field').val("");
  })
}

//API request to Google Maps

function fetchGoogleMapData(userValue, callback) {

}

//API request to REI Hiking Project

function fetchTrailData() {

}

//API request to Wunderground

function fetchWeatherData() {

}

//Display a map and list of trails around the location value

function renderResultList() {

}

//Display detailed information on a specific trail on the search results list

function renderDetailTrail() {

}


$(userSubmitData)
