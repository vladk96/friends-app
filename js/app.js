const URL = 'https://randomuser.me/api/?results=30&inc=name,dob,gender,location,phone,picture';
let usersArray = [];

const handleErrors = (response) => {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

fetch(URL)
    .then(handleErrors)
    .then(res => res.json())
    .then(users => render(users.results))
    .catch(error => console.log(error));

const createCards = (prof) => {
    let cardContainer = document.createElement('div');
    cardContainer.classList.add('card-container');
    
    prof.forEach((item) => {
        let card = document.createElement('div');
        card.classList.add('card');

        card.innerHTML = `
            <div class="image">
                <img src="${item.picture.large}" alt="photo">
            </div>
            <div class="content">
                <a href="#" class="name">${item.name.first} ${item.name.last}</a>
                <p class="age">Age: ${item.dob.age}</p>
                <p class="gender">Gender: ${item.gender}</p>
                <p class="tel">Tel: ${item.phone}</p>
                <p class="city">City: ${item.location.city}</p>
            </div>`;
        cardContainer.appendChild(card);
    });
    document.querySelector('.main').appendChild(cardContainer);
}

const searchName = (e, users) => {
    const word = e.target.value.toLowerCase();

    usersArray = users.filter( (user) => {
        const fullName = user.name.first + ' ' + user.name.last;
        return fullName.includes(word);
    });

    document.querySelector('.main').innerHTML = '';
    createCards(usersArray);
}

const filterGender = (e, users) => {
    const gender = e.target.value;
    document.querySelector('.main').innerHTML = '';

    if (gender === 'all') {
        createCards(users);
    } else {
        createCards(users.filter( (user) => user.gender === gender));
    }
}

const sortAge = (e, users) => {
    const value = e.target.value;
    document.querySelector('.main').innerHTML = '';
    let arrayUsers = users.slice();
    if (value === 'increase') {
        createCards(arrayUsers.sort( (a, b) => a.dob.age - b.dob.age));
    } else if (value === 'descrease') {
        createCards(arrayUsers.sort( (a, b) => b.dob.age - a.dob.age));
    }
}

const sortName = (e, users) => {
    const value = e.target.value;
    document.querySelector('.main').innerHTML = '';
    let arrayUsers = users.slice();
    if (value === 'increase') {
        createCards(arrayUsers.sort( (a, b) => (a.name.first < b.name.first) ?  -1 : 1 ));
    } else if (value === 'descrease') {
        createCards(arrayUsers.sort( (a, b) => (a.name.first > b.name.first) ?  -1 : 1 ));
    }
}

const reset = () => {
    document.querySelector('.form').reset();
}

const render = (users) => {
    createCards(users);
    usersArray = users.slice();

    document.getElementById('search').addEventListener('keyup', (e) => {
        searchName(e, users);
    });
    document.getElementById('sort-gender').addEventListener('change', (e) => {
        filterGender(e, usersArray);
    });
    document.getElementById('sort-age').addEventListener('change', (e) => {
        sortAge(e, usersArray);
    });
    document.getElementById('sort-name').addEventListener('change', (e) => {
        sortName(e, usersArray);
    });
    document.querySelector('.reset').addEventListener('click', reset);
}