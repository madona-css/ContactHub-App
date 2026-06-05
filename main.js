const fullNameInput = document.querySelector('#nameInput');
const phoneInput = document.querySelector('#phoneInput');
const emailInput = document.querySelector('#emailInput');
const addressInput = document.querySelector('#addressInput');
const groupSelect = document.querySelector('#groupSelect');
const noteInput = document.querySelector('#noteInput');
const favoriteCheckbox = document.querySelector('#favoriteCheckbox');
const emergencyCheckbox = document.querySelector('#emergencyCheckbox');
const saveButton = document.querySelector('#saveBtn');
const contactList = document.querySelector('#contactList');
const emptyPage = document.querySelector('.empty-page');
const favCounter = document.querySelector('#favCounter');
const emergencyCounter = document.querySelector('#emergencyCounter');
const totalCounters = document.querySelectorAll('.totalCounter');
const favoritesCard = document.querySelector('#favoritesContacts');
const emergencyCard = document.querySelector('#emergencyContacts');
const searchInput=document.querySelector('#search')
const changeBtn = document.querySelector('#changeBtn');
let editIndex = null;
let contacts = JSON.parse(localStorage.getItem('contacts')) || [];

function randomColor() { return `hsl(${Math.floor(Math.random() * 360)},60% ,80%)`; }

searchInput.addEventListener('input', function () {
    displayContacts(searchInput.value);});


saveButton.addEventListener('click', function () {
    if (!fullNameInput.value || !phoneInput.value) { alert('Please fill in the required fields.'); return; }
    if (!/^[a-zA-Z\s]+$/.test(fullNameInput.value)) { alert('Please enter a valid name (letters and spaces only).'); return; }
    if (!/^[0-9]{10,15}$/.test(phoneInput.value)) { alert('Please enter a valid 10-15 digit phone number.'); return; }

    const contact = {
        profilePic: fullNameInput.value.trim().charAt(0).toUpperCase(),
        fullName: fullNameInput.value,
        phone: phoneInput.value,
        email: emailInput.value,
        address: addressInput.value,
        group: groupSelect.value,
        note: noteInput.value,
        isFavorite: favoriteCheckbox.checked,
        isEmergency: emergencyCheckbox.checked,
        color: randomColor()};

    if (editIndex === null) {
        contacts.push(contact);}
    else {
        contacts[editIndex] = contact;
        editIndex = null;
    }
    
    localStorage.setItem('contacts', JSON.stringify(contacts));
    displayContacts();
    updateCounters();
    displayFavoritesAndEmergencies();
    clearForm();
});



function displayContacts(searchTerm='') {
    if (contacts.length > 0) {
        emptyPage.style.display = 'none';
    } else {
        emptyPage.style.display = 'block';
    }
    contactList.innerHTML = '';
    const filteredContacts = contacts.filter(function (contact) {
        return (
            contact.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.phone.includes(searchTerm) ||
            contact.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });
     filteredContacts.forEach(function (contact, index) {
        const contactCard =
            `<div class="contact-card">
     <div class="d-flex gap-3 align-items-center">       
      <div class="profile-picture">
     <div class="image" style="background-color:${contact.color}">${contact.profilePic}</div>
     </div>
    <div>
    <h3>${contact.fullName}</h3>
    <p>${contact.phone}</p></div>
    </div>
    <p>${contact.email}</p>
    <p>${contact.address}</p>
    <p>${contact.group}</p>
    <p>${contact.note}</p>
    <div class="contact-actions d-flex justify-content-center align-items-center gap-2 mt-3">
    <button onclick="deleteContact(${index})" class="delete-btn"><i class="fa-solid fa-trash"></i></button>
    <button onclick="editContact(${index})" class="edit-btn"><i class="fa-solid fa-edit"></i></button>
    <p class="d-flex gap-2 justify-content-between align-items-center"><i class="fa-solid fa-star mx-2" onclick="toggleFavorite(${index})" style="cursor: pointer; color:${contact.isFavorite ? 'gold' : 'lightgray'};"></i>
    <i class="fa-solid fa-heart" onclick="toggleEmergency(${index})" style="cursor: pointer; color:${contact.isEmergency ? 'red' : 'lightgray'};"></i>
    <a href="tel:${contact.phone}"><i class="fa-solid fa-phone mx-3"></i></a>
    <a href="mailto:${contact.email}"><i class="fa-solid fa-envelope mx-1"></i></a>
    </p>
    </div>
    </div>`;
        contactList.innerHTML += contactCard;
    });
}



function displayFavoritesAndEmergencies() {
    favoritesCard.innerHTML = '';
    emergencyCard.innerHTML = '';
    let hasFavorites = false;
    let hasEmergencies = false;
    contacts.forEach(function (contact) {
        if (contact.isFavorite) {
            favoritesCard.innerHTML += `
           <div class="d-flex justify-content-between align-items-center">
                  <div>
                 <div class="d-flex gap-3 align-items-center">
                <div class="profile-picture">
               <div class="image" style="background-color:${contact.color}">${contact.profilePic}
               </div>
              </div>
               <div>
                <p class="mb-0">${contact.fullName}
                </p>
                <p>${contact.phone}
                </p>
                </div>
                </div>
                </div>
                <a href="tel:${contact.phone}"><i class="fa-solid fa-phone icon"></i>
                </a>
               </div> `;
            hasFavorites = true;
        }
        if (contact.isEmergency) {
            emergencyCard.innerHTML += `
                 <div class="d-flex justify-content-between align-items-center">
                  <div>
                 <div class="d-flex gap-3 align-items-center">
                  <div class="profile-picture">
                 <div class="image" style="background-color:${contact.color}">${contact.profilePic}
                </div>
                </div>
               <div> 
               <p class="mb-0">${contact.fullName}
                </p>
                <p>${contact.phone}
                </p>
                </div>
                </div>
                </div>
                <a href="tel:${contact.phone}"><i class="fa-solid fa-phone icon"></i>
                </a>
               </div>`;
            hasEmergencies = true;
        }
    })
    if (!hasFavorites) {
        favoritesCard.innerHTML = '<p class="card-text  py-3">No favorites yet.</p>';
    }
    if (!hasEmergencies) {
        emergencyCard.innerHTML = '<p class="card-text py-3" >No emergency contacts</p>';
    }
}



function deleteContact(index) {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!"
    }).
        then(function (result) {
            if (result.isConfirmed) {
                contacts.splice(index, 1);
                localStorage.setItem('contacts', JSON.stringify(contacts));
                displayContacts(); updateCounters(); displayFavoritesAndEmergencies();
                Swal.fire("Deleted!", "Your contact has been deleted.", "success");

            }
        });

}


function toggleFavorite(index) { contacts[index].isFavorite = !contacts[index].isFavorite;
     localStorage.setItem('contacts', JSON.stringify(contacts));
    displayContacts(); updateCounters(); displayFavoritesAndEmergencies();
}


function toggleEmergency(index) { contacts[index].isEmergency = !contacts[index].isEmergency; 
    localStorage.setItem('contacts', JSON.stringify(contacts)); 
    displayContacts(); updateCounters(); displayFavoritesAndEmergencies();
}



function updateCounters() {
    let favoriteCount = 0;
    let emergencies = 0;
    let totalCount = 0;
    contacts.forEach(function (contact) {
        if (contact.isFavorite) {
            favoriteCount++;
        }
        if (contact.isEmergency) {
            emergencies++;
        }
        totalCount++;
    });
    totalCounters.forEach(function (el) { el.textContent = totalCount; });
    favCounter.textContent = favoriteCount;
    emergencyCounter.textContent = emergencies;
}




function editContact(index) {
    const contact = contacts[index];
    console.log(contact.color);
    fullNameInput.value = contact.fullName;
    phoneInput.value = contact.phone;
    emailInput.value = contact.email;
    addressInput.value = contact.address;
    groupSelect.value = contact.group;
    noteInput.value = contact.note;
    favoriteCheckbox.checked = contact.isFavorite;
    emergencyCheckbox.checked = contact.isEmergency;
    const editProfilePic = document.querySelector('#editProfilePic');
    editProfilePic.textContent = contact.profilePic ;

    editIndex = index;
    const modal = new
        bootstrap.Modal(document.getElementById('contactModal'));
    modal.show();
    
}



function clearForm(){
    fullNameInput.value = '',
        phoneInput.value = '',
        emailInput.value = '',
        addressInput.value = '',
        groupSelect.value = '',
        noteInput.value = '',
        favoriteCheckbox.checked = false;
        emergencyCheckbox.checked = false;
    editIndex = null;
}


displayContacts();
updateCounters();
displayFavoritesAndEmergencies();
