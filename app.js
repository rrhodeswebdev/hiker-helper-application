//API endpoints
const GEOCODE_API = "https://maps.googleapis.com/maps/api/geocode/json"
const GETTRAIL_API = "https://www.hikingproject.com/data/get-trails"


//Capture user input, which should be a location
function userSubmitData() {
  $('.js-search-form').on('click', '.js-submit-btn', function(event) {
    event.preventDefault();

    let userValue = $('#input-field').val();

    fetchGoogleGeoData(userValue, fetchTrailData);

    userValue = $('#input-field').val("");
  })
}



//API request to Google Geocoding Data

function fetchGoogleGeoData(userValue, callback) {

  const query = {
    address: `${userValue}`,
    key: "AIzaSyCieNU3oVF-dQYP4iBWoQnc4hqA4zzd4i4"
  }

  console.log(query);

  $.getJSON(GEOCODE_API, query, callback);

}

//API request to REI Hiking Project

function fetchTrailData(data, query, callback) {

  let lat = data.results[0].geometry.location.lat;
  let lon = data.results[0].geometry.location.lng;

  const newQuery = {
    key: "200202949-be5202662091a9dc38356c0c802cd058",
    lat: lat,
    lon: lon,
    maxResults: 25,
    maxDistance: 20
  }

  createMap(newQuery);

  $.getJSON(GETTRAIL_API, newQuery, resultList)

};


//API request to Wunderground

function fetchWeatherData() {

}

//Display a map and list of trails around the location value

function createMap(newQuery) {
  $('#map').append(
    function initMap() {
      var myLatLng = {
        lat: newQuery.lat,
        lng: newQuery.lon
      };

      var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: myLatLng
      });
    });
};

function renderResults(item) {
  return `
    <div class="individual-trail">
      <h2>${item.name}</h2>
      <p><img src="${item.imgSmall}"</p>
      <p>Location: ${item.location}</p>
      <p>Hiker Rating: ${item.stars}</p>
      <p>${item.summary}</p>
    </div>
  `
}

function resultList(data) {

  console.log(data);

  let trailInfo = data.trails.map(item =>
    renderResults(item));

  $('.js-search-results').html(trailInfo);
}


function weatherUpdate() {

}

$(userSubmitData)
