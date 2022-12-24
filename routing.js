// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script
// src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    mapTypeControl: false,
    center: { lat: 47.900769, lng: -122.301757 },
    zoom: 13,
  });

  window.map = map;
  window.handler = new AutocompleteDirectionsHandler(map);
}

class AutocompleteDirectionsHandler {
  map;
  originPlaceId;
  destinationPlaceId;
  waypointPlaceIds;
  travelMode;
  directionsService;
  directionsRenderer;
  constructor(map) {
    this.map = map;
    this.originPlaceId = '';
    this.destinationPlaceId = '';
    this.waypointPlaceIds = [];
    this.travelMode = google.maps.TravelMode.WALKING;
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    this.directionsRenderer.setMap(map);
    
    let modes = [
      {id: 'changeModeWalking', enum: google.maps.TravelMode.WALKING},
      {id: 'changeModeBiking', enum: google.maps.TravelMode.BICYCLING},
      {id: 'changeModeTransit', enum: google.maps.TravelMode.TRANSIT},
      {id: 'changeModeDriving', enum: google.maps.TravelMode.DRIVING},
    ];
    for (const mode of modes) {
      const radioButton = document.getElementById(mode.id);
      radioButton.addEventListener("click", () => {
        this.travelMode = mode.enum;
        this.route();
      });
    }

    this.addAutocomplete($('#originInput')[0], (place) => {
      this.originPlaceId = place.place_id;
    });

    this.addAutocomplete($('#destinationInput')[0], (place) => {
      this.destinationPlaceId = place.place_id;
    });
  }
  addWaypoint() {
    this.waypointPlaceIds.push('');
    let stop = makeStop();
    let input = stop.querySelector('input');
    this.addAutocomplete(input, (place) => {
      let i = getStopIndex(stop);
      console.log(i);
      this.waypointPlaceIds[i] = place.place_id;
    });
    addStop(stop);
  }
  removeWaypoint(stop) {
    console.log(stop);
    let i = getStopIndex(stop);
    removeStop(stop);
    this.waypointPlaceIds.splice(i, 1);
    this.route();
  }
  addAutocomplete(input, callback) {
    let autocomplete = new google.maps.places.Autocomplete(input, {fields: ['place_id']});
    autocomplete.bindTo('bounds', map);
    autocomplete.addListener('place_changed', () => {
      let place = autocomplete.getPlace();
      if (!place.place_id) {
        window.alert("Please select an option from the dropdown list.");
        return;
      }
      console.log(autocomplete);
      window.autocomplete = autocomplete;
      callback(place);
      this.route();
    });
  }
  route() {
    if (!this.originPlaceId || !this.destinationPlaceId) return;
    let waypoints = [];
    for (const waypointPlaceId of this.waypointPlaceIds) {
      if (!waypointPlaceId) return;
      waypoints.push({location: {placeId: waypointPlaceId}, stopover: true});
    }
    
    this.directionsService.route(
      {
        origin: { placeId: this.originPlaceId },
        destination: { placeId: this.destinationPlaceId },
        travelMode: this.travelMode,
        waypoints: waypoints,
        optimizeWaypoints: true,
      },
      (response, status) => {
        if (status === "OK") {
          console.log('OK', response);
          this.directionsRenderer.setDirections(response);
        } else {
          console.log('NOT OK', response);
          window.alert("Directions request failed due to " + status);
        }
      }
    );
  }
}

window.initMap = initMap;


// Dragbar handling
let $dragLeft = $('#dragLeft');
window.dragOffset = null;
// let dragOffset;
const drag = (e) => {
  // Remove current selection
  if (document.selection) {
    document.selection.empty();
  } else {
    window.getSelection().removeAllRanges();
  }
  $dragLeft.css('width', e.pageX-dragOffset+'px');
}
$('#dragBar').on('mousedown', (e) => {
  let rect = e.target.getBoundingClientRect();
  dragOffset = e.pageX-rect.left;
  $('html, body').css('cursor', 'col-resize');
  $(document).on('mousemove', drag);
});
$(document).on('mouseup', () => {
  if (dragOffset == null) return;
  dragOffset = null;
  $('html, body').css('cursor', '');
  $(document).off('mousemove', drag);
});

const makeStop = () => {
  let $stop = $(`
    <div class='row mainStart crossCenter fullWidth'>
      <i class="material-icons-outlined spaceAroundIcon">place</i>
      <label class="expand dense mdc-text-field mdc-text-field--outlined mdc-text-field--no-label">
        <span class="mdc-notched-outline">
          <span class="mdc-notched-outline__leading"></span>
          <span class="mdc-notched-outline__trailing"></span>
        </span>
        <input class="mdc-text-field__input" type="text" placeholder='Enter stop' aria-label="Label">
      </label>
      <button class="mdc-icon-button material-icons-outlined" onclick="handler.removeWaypoint(this.parentNode);">
        <div class="mdc-icon-button__ripple"></div>
        delete
      </button>
    </div>
  `);
  new mdc.textField.MDCTextField($stop.find('.mdc-text-field')[0]);
  $stop.find('.mdc-icon-button').each(function () {
    let iconButtonRipple = new mdc.ripple.MDCRipple(this);
    iconButtonRipple.unbounded = true;
  });
  return $stop[0];
}
const addStop = (stop) => $('#stops').append(stop);
const removeStop = (stop) => $(stop).remove();
const getStopIndex = (stop) => Array.from($('#stops')[0].children).indexOf(stop);


$('.mdc-radio').each(function () { new mdc.radio.MDCRadio(this); });
$('.mdc-form-field').each(function () { new mdc.formField.MDCFormField(this); });
$('.mdc-button').each(function () { new mdc.ripple.MDCRipple(this); });
$('.mdc-text-field').each(function () { new mdc.textField.MDCTextField(this); });