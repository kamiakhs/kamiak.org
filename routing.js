let mostRecentAddress;

function initMap() {
  const map = new google.maps.Map(document.getElementById('map'), {
    mapTypeControl: false,
    streetViewControl: false,
    center: {lat: 47.900769, lng: -122.301757},  // Kamiak
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
  placesService;
  optimizeWaypoints;
  avoid;
  waypointOrder;
  constructor(map) {
    this.map = map;
    this.originPlaceId = '';
    this.destinationPlaceId = '';
    this.waypointPlaceIds = [];
    this.travelMode = google.maps.TravelMode.DRIVING;
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer({map, panel});
    this.placesService = new google.maps.places.PlacesService(map);
    this.optimizeWaypoints = true;
    this.avoid = {ferries: false, highways: false, tolls: true};
    this.waypointOrder = [];
    
    let modes = [
      {id: 'changeModeWalking', enum: google.maps.TravelMode.WALKING},
      {id: 'changeModeBiking', enum: google.maps.TravelMode.BICYCLING},
      {id: 'changeModeTransit', enum: google.maps.TravelMode.TRANSIT},
      {id: 'changeModeDriving', enum: google.maps.TravelMode.DRIVING},
    ];
    for (const mode of modes) {
      let radioButton = document.getElementById(mode.id);
      radioButton.addEventListener("click", () => {
        this.travelMode = mode.enum;
        this.route();
      });
    }

    this.addAutocomplete(originInput, (place) => {
      this.originPlaceId = place.place_id;
    });

    this.addAutocomplete(destinationInput, (place) => {
      this.destinationPlaceId = place.place_id;
    });

    let switchControl = new mdc.switchControl.MDCSwitch(optimizationSwitch);
    optimizationSwitch.addEventListener('click', () => {
      this.optimizeWaypoints = switchControl.selected;
      this.route();
    });

    for (const type of Object.keys(this.avoid)) {
      let id = 'allow'+type[0].toUpperCase()+type.substring(1);
      let checkboxNode = document.getElementById(id).parentNode;
      let formFieldNode = checkboxNode.parentNode.parentNode;
      let checkbox = new mdc.checkbox.MDCCheckbox(checkboxNode);
      let formField = new mdc.formField.MDCFormField(formFieldNode);
      formField.input = checkbox;
      checkbox.checked = type != 'tolls';
      checkboxNode.addEventListener('click', () => {
        this.avoid[type] = !checkbox.checked;
        this.route();
      });
    }
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
    stops.style.display = '';
  }
  removeWaypoint(stop) {
    console.log(stop);
    let i = getStopIndex(stop);
    removeStop(stop);
    this.waypointPlaceIds.splice(i, 1);
    if (this.waypointPlaceIds.length == 0) {
      stops.style.display = 'none';
    }
    this.route();
  }
  addAutocomplete(input, callback) {
    let autocomplete = new google.maps.places.Autocomplete(input, {fields: ['place_id']});
    autocomplete.bindTo('bounds', map);
    autocomplete.addListener('place_changed', () => {
      let place = autocomplete.getPlace();
      console.log(place);
      if (!place.place_id) {
        window.alert('Please select an option from the dropdown list.');
        return;
      }
      window.autocomplete = autocomplete;
      callback(place);
      this.route();
    });
  }
  addWaypointAddress(address) {
    this.placesService.findPlaceFromQuery({
      query: address,
      fields: ['place_id'],
    }, (results, status) => {
      if (status != 'OK') {
        console.log('Not OK ', status);
        if (status == 'OVER_QUERY_LIMIT') {
          setTimeout(() => this.addWaypointAddress(address), 100);
        }
        return;
      }
      console.log(results);
      if (!results.length) {
        console.log('No results');
        return;
      }
      this.addWaypoint();
      let place = results[0];
      let stop = getLastStop();
      stop.querySelector('input').value = address;
      this.waypointPlaceIds.pop();
      this.waypointPlaceIds.push(place.place_id);
      console.log(address);
      if (address == mostRecentAddress) this.route();
    });
  }
  hasPlaceIds() {
    if (!this.originPlaceId || !this.destinationPlaceId) return false;
    for (const waypointPlaceId of this.waypointPlaceIds) {
      if (!waypointPlaceId) return false;
    }
    return true;
  }
  route() {
    if (!this.hasPlaceIds()) return;
    let waypoints = [];
    for (const waypointPlaceId of this.waypointPlaceIds) {
      waypoints.push({location: {placeId: waypointPlaceId}});
    }
    
    this.directionsService.route({
      origin: { placeId: this.originPlaceId },
      destination: { placeId: this.destinationPlaceId },
      travelMode: this.travelMode,
      waypoints,
      optimizeWaypoints: this.optimizeWaypoints,
      avoidFerries: this.avoid.ferries,
      avoidHighways: this.avoid.highways,
      avoidTolls: this.avoid.tolls,
    })
    .then((result) => {
      console.log(result);
      console.log(result.waypoint_order);
      directionsHeading.style.display = '';
      this.directionsRenderer.setDirections(result);
      let total = this.getTotalData(result);
      console.log(total);
      console.log(total.distance/1609, 'mi');
      console.log(`${total.duration/3600 | 0} hours, ${total.duration/60%60 | 0} minutes, ${total.duration%60 | 0} seconds`)
      this.waypointOrder = result.routes[0].waypoint_order;
    })
    .catch((e) => {
      window.alert(`Directions request failed due to ${e}`);
    });
  }
  getTotalData(result) {
    let total = {distance: 0, duration: 0};
    let route = result.routes[0];
    if (!route) return;
    for (let i = 0; i < route.legs.length; i++) {
      total.distance += route.legs[i].distance.value;
      total.duration += route.legs[i].duration.value;
    }
    return total;
  }
  getUrl() {
    if (!this.hasPlaceIds()) return;
    let url = 'https://www.google.com/maps/dir/';
    let placeNames = [];
    placeNames.push(encodeURIComponent(originInput.value));
    for (const i of this.waypointOrder) {
      placeNames.push(encodeURIComponent(stops.children[i].querySelector('input').value));
    }
    placeNames.push(encodeURIComponent(destinationInput.value));
    return url+placeNames.join('/');
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
      <button class="mdc-icon-button material-icons-outlined xButton" onclick="handler.removeWaypoint(this.parentNode);">
        <div class="mdc-icon-button__ripple"></div>
        cancel
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
const addStop = (stop) => stops.appendChild(stop);
const removeStop = (stop) => $(stop).remove();
const getStopIndex = (stop) => Array.from(stops.children).indexOf(stop);
const getLastStop = () => stops.children[stops.children.length-1];

$(uploadStops).on('change', () => {
  if (!('files' in uploadStops && uploadStops.files.length)) return;
  let file = uploadStops.files[0];
  readFile(file)
  .then(async (content) => {
    // let cnt = 0;
    for (const line of content.split(/\r?\n/g)) {
      console.log(line.trim());
      if (!line) continue;
      // if (cnt != 0 && cnt%10 == 0) {
      //   console.log('SLEEPING');
      //   await new Promise(r => setTimeout(r, 1000));
      //   console.log('DONE SLEEPING');
      // }
      // cnt++;
      mostRecentAddress = line.trim();
      handler.addWaypointAddress(mostRecentAddress);
    }
  })
  .catch((e) => console.error(e));
});
const readFile = (file) => {
  let reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
}


$('.mdc-radio').each(function () { new mdc.radio.MDCRadio(this); });
$('.mdc-form-field').each(function () { new mdc.formField.MDCFormField(this); });
$('.mdc-button').each(function () { new mdc.ripple.MDCRipple(this); });
$('.mdc-text-field').each(function () { new mdc.textField.MDCTextField(this); });
