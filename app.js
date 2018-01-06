//API endpoints

const GEOCODE_API = "https://maps.googleapis.com/maps/api/geocode/json"
const GETTRAIL_API = "https://www.hikingproject.com/data/get-trails"

//Capture user input, which should be a location
function userSubmitData() {
  $('.js-search-form').on('click', '.js-submit-btn', function(event) {
    event.preventDefault();

    console.log("user clicked");

    let userValue = $('#input-field').val();

    console.log(userValue);

    fetchGoogleGeoData(userValue, renderResultList);

    userValue = $('#input-field').val("");
  })
}

//API request to Google Maps

function fetchGoogleGeoData(userValue, callback) {

  const query = {
    address:`${userValue}`,
    key: "AIzaSyCieNU3oVF-dQYP4iBWoQnc4hqA4zzd4i4"
  }

  console.log(query);

$.getJSON(GEOCODE_API, query, callback);

}

//API request to REI Hiking Project

function fetchTrailData() {

}

//API request to Wunderground

function fetchWeatherData() {

}

//Display a map and list of trails around the location value

function renderResultList(data) {

let lat = data.results.geometry
let lon = data.results.geometry

console.log(lat);
console.log(lon);

}

//Display detailed information on a specific trail on the search results list

function renderDetailTrail() {

}


$(userSubmitData)
