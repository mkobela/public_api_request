/***
 * @author Michael Kobela <mkobela@gmail.com>
 ***/

/******************************************
Treehouse FSJS Techdegree:
Project 5 - Public API Request
******************************************/

// person array from fetch
let personArray = null;

/***
 * @function checkStatus
 * @property {object} response - fetch response
 * @returns {Promise} - promise from fetch
***/
function checkStatus(response) {
  // check if fetch was successful
  if (response.ok) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}

/***
 * @function fetchData
 * @property {string} url - url
 * @returns {Promise} - promise from fetch
***/
function fetchData(url) {
  // fetch options, attempt to fix CORS issue
  const options = {
    mode: 'cors' // 'cors' by default
  };
  
  // send the request
  return fetch(url, options)
    .then(checkStatus)
    .then(res => res.json())
    .catch(error => errorHandler(error));
}

/***
 * @function errorHandler
 * @property {Error} error - error object
***/
function errorHandler(error){
  // show error in HTML
  document.querySelector('#gallery').innerHTML = 'Oops, could not fetch data. Please try again!';
}

/***
 * @function createHTML
 * @property {Error} error - error object
***/
function createHTML(data){
  // store date for modal displays
  personArray = data;

  // iterate for each person in array
  data.results.map((item, index) => createPersonHTML(item, index));
}

/***
 * @function createPersonHTML
 * @property {object} person - person object
 * @property {number} index - map index
***/
function createPersonHTML(person, index){

  // create literal template for a person
  let personItem = `
    <div class="card" position=${index}>
      <div class="card-img-container">
          <img class="card-img" src="${person.picture.large}" alt="profile picture">
      </div>
      <div class="card-info-container">
          <h3 id="name" class="card-name cap">${person.name.first} ${person.name.last}</h3>
          <p class="card-text">${person.email}</p>
          <p class="card-text cap">${person.location.city}, ${person.location.state}</p>
      </div>
    </div>
  `;

  // add person to the end of div
  document.getElementById('gallery').insertAdjacentHTML('beforeend', personItem);
  
  // add event handler for modal popup
  const selector = `div[position="${index}"]`;
  document.querySelector(selector).addEventListener('click', showModal)
}


/***
 * @function createModalHTML
 * @property {object} person - person object
***/
function createModalHTML(person){

  const loc = person.location;

  const phone = formatPhone(person.phone);
  const dob = formatBirthdate(person.dob.date);

  const personHTML = `
  <div class="modal-container">
      <div class="modal">
          <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
          <div class="modal-info-container">
              <img class="modal-img" src="${person.picture.medium}" alt="profile picture">
              <h3 id="name" class="modal-name cap">${person.name.first} ${person.name.last}</h3>
              <p class="modal-text">${person.email}</p>
              <p class="modal-text cap">${person.location.city}</p>
              <hr>
              <p class="modal-text">${phone}</p>
              <p class="modal-text">${loc.street.number} ${loc.street.name} ${loc.city}, ${loc.state} ${loc.postcode}</p>
              <p class="modal-text">Birthday: ${dob}</p>
          </div>
      </div>
  </div>
  `;

  // insert modal popup after the gallery
  document.getElementById('gallery').insertAdjacentHTML('afterEnd', personHTML);

  // add listener for click on close button
  const buttonElement = document.querySelector('#modal-close-btn');
  buttonElement.addEventListener('click', (e) => {
    // remove modal when x button clicked
    const modalElement = document.querySelector('.modal-container').remove();
  });
}

/***
 * @function formatPhone
 * @property {string} phone - phone number
 * @returns {string}
***/
function formatPhone(phone){
  // format phone to (XXX) XXX-XXXX
  if(phone.length >= 14){
    const formattedPhone = phone.substring(0, 5) + " " + phone.substring(6,15);
    return formattedPhone;
  }else {
    // string not long enough
    return phone;
  }
}
 
/***
 * @function formatBirthday
 * @property {string} dob - date of birth
 * @returns {string}
***/
function formatBirthdate(dob){
  // convert JSON string to date
  const date = new Date(dob);

  // format to MM/DD/YYYY
  const formattedDate = `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`;

  return formattedDate;
}

/***
 * @function showModal
 * @property {object} event - event object
***/
function showModal(e){
  // object requested person from array
  const position = parseInt(e.currentTarget.getAttribute('position'));

  // show modal for requested person
  createModalHTML(personArray.results[position]);
}

// Start of program, request data on each refresh
fetchData('https://randomuser.me/api/?page=1&results=12&nat=us')
  .then(data => { createHTML(data) })