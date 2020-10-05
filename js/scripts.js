/***
 * @author Michael Kobela <mkobela@gmail.com>
 ***/

/******************************************
Treehouse FSJS Techdegree:
Project 5 - Public API Request
******************************************/

// store results from fetch
let personArray = null;
let filteredPersonArray = null;

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

  const galleryElement = document.getElementById('gallery');
  galleryElement.innerHTML = "";
  
  // iterate for each person in array
  data.map((item, index) => createPersonHTML(item, index));

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
  const galleryElement = document.getElementById('gallery');
  galleryElement.insertAdjacentHTML('beforeend', personItem);
  
  // add event handler for modal popup
  const selector = `div[position="${index}"]`;
  document.querySelector(selector).addEventListener('click', showModal)
}

/***
 * @function createModalHTML
 * @property {object} person - person object
***/
function createModalHTML(position){

  // get selected person
  const person = filteredPersonArray[position];
  var currentPosition = position;

  const loc = person.location;
  const phone = formatPhone(person.phone);
  const dob = formatBirthdate(person.dob.date);

  const personModalHTML = createModalPersonHTML(person, true);
  
  // insert modal popup after the gallery
  document.getElementById('gallery').insertAdjacentHTML('afterEnd', personModalHTML);

  // add listener for click on close button
  const buttonElement = document.querySelector('#modal-close-btn');
  buttonElement.addEventListener('click', (e) => {
    // remove modal when x button clicked
    const modalElement = document.querySelector('.modal-container').remove();
  });

  // add listener for prev button
  const previousElement = document.querySelector('#modal-prev');
  previousElement.addEventListener('click', (e) => {
    // previous was clicked
    currentPosition = updateModalPerson(currentPosition, false);
  });

  // add listener for next button
  const nextElement = document.querySelector('#modal-next');
  nextElement.addEventListener('click', (e) => {
    // next was clicked
    currentPosition = updateModalPerson(currentPosition, true);
  });

  // show/hide nave buttons
  displayNavButtons(currentPosition);
}

/***
 * @function updateModalPerson
 * @property {number} currentPosition - current position in array
 * @returns {number} new current position
***/
function updateModalPerson(currentPosition, isNext){
  let person = null;

  // set new position
  if(isNext){
    if(currentPosition < filteredPersonArray.length){
      currentPosition += 1;
      person = filteredPersonArray[currentPosition];
    }
  }else{
    if(currentPosition > 0){
      currentPosition -= 1;
      person = filteredPersonArray[currentPosition];
    }
  }

  // hide next previous buttons as necessary
  displayNavButtons(currentPosition);

  if( person != null){
    const html = createModalPersonHTML(person, false);
    document.querySelector('.modal-info-container').innerHTML = "";
    document.querySelector('.modal-info-container').insertAdjacentHTML('beforeend', html);
  }

  return currentPosition;
}

/***
 * @function displayNavButtons
 * @property {number} position - current position in array
***/
function displayNavButtons(position){
  var prevDisplay = 'none';
  var nextDisplay = 'none';

  if(filteredPersonArray.length > 1){

    if(position < filteredPersonArray.length-1){
      // show next
      nextDisplay = 'block';
    }
    
    if (position > 0){
      // show previous
      prevDisplay = 'block';
    }
  }

  document.getElementById("modal-next").style.display = nextDisplay;
  document.getElementById("modal-prev").style.display = prevDisplay;
}

/***
 * @function createModalPersonHTML
 * @property {object} person - current position in array
 * @property {boolean} includeContainer - should the html have outer div
 * @returns {string} html string
***/
function createModalPersonHTML(person, includeContainer){

  const loc = person.location;
  const phone = formatPhone(person.phone);
  const dob = formatBirthdate(person.dob.date);

  let modalPersonHTML = '';
  
  // include outer conatiner if necessary
  if(includeContainer){
    modalPersonHTML = `<div class="modal-container">
      <div class="modal">
        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
        <div class="modal-info-container">
      `;
  }
  
  // add the person data
  modalPersonHTML += 
    `
        <img class="modal-img" src="${person.picture.medium}" alt="profile picture">
        <h3 id="name" class="modal-name cap">${person.name.first} ${person.name.last}</h3>
        <p class="modal-text">${person.email}</p>
        <p class="modal-text cap">${person.location.city}</p>
        <hr>
        <p class="modal-text">${phone}</p>
        <p class="modal-text">${loc.street.number} ${loc.street.name} ${loc.city}, ${loc.state} ${loc.postcode}</p>
        <p class="modal-text">Birthday: ${dob}</p>
  `;

  // finialize the outer div if necessary
  if(includeContainer){
    modalPersonHTML += 
    `     
        </div>
        </div>
        <div class="modal-btn-container">
          <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
          <button type="button" id="modal-next" class="modal-next btn">Next</button>
        </div>
    </div>
    `;
  }

  return modalPersonHTML;

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
  createModalHTML(position);
}

/***
 * @function addSearchForm - add search form to HTML
***/
function addSearchForm(){
  const searchContainer = document.querySelector('.search-container');

  const searchHTML = `
    <form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>`;

    searchContainer.innerHTML = searchHTML;
    searchContainer.addEventListener('input', (e) => {

      filteredPersonArray = personArray.filter(person => {
        const fullName = person.name.first + ' ' + person.name.last;

        if( fullName.toLowerCase().includes(e.target.value.toLowerCase())){
          return true;
        }
        return false;
      });

      createHTML(filteredPersonArray);
    });

}

// Start of program
addSearchForm();


//request data on each refresh
fetchData('https://randomuser.me/api/?page=1&results=12&nat=us')
  .then(data => { personArray = data.results;
                  filteredPersonArray = personArray;
                  return createHTML(personArray); 
                });