const baseUrl = `https://swapi2.azurewebsites.net/api`;

// Runs on page load
addEventListener('DOMContentLoaded', () => {
    
    nameH1 = document.querySelector('h1#film');
    charactersUl = document.querySelector('#characters>ul');
    planetsUl = document.querySelector('#planets>ul');
    
    const sp = new URLSearchParams(window.location.search)
    const id = sp.get('id')
    getFilm(id)
  });
  
async function getFilm(id) {
    let film;
    try {
        film = await fetchFilm(id)
        film.characters = await fetchCharacters(film)
        film.planets = await fetchPlanets(film)
    }
    catch (ex) {
        console.error(`Error reading film ${id} data.`, ex.message);
    }
    renderFilm(film);
}

async function fetchFilm(id) {
    let filmUrl = `${baseUrl}/films/${id}`;
    return await fetch(filmUrl)
      .then(res => res.json())
}

async function fetchCharacters(film) {
    const url = `${baseUrl}/films/${film?.id}/characters`;
    const characters = await fetch(url)
      .then(res => res.json())
    return characters;
}

async function fetchPlanets(film) {
    const url = `${baseUrl}/films/${film?.id}/planets`;
    const planets = await fetch(url)
      .then(res => res.json())
    return planets;
}

const renderFilm = film => {
    document.title = `SWAPI - ${film?.title}`;  // Just to make the browser tab say their name
    nameH1.textContent = film?.title;
    const charactersList = film?.characters?.map(character => `<li><a href="/character.html?id=${character.id}">${character.name}</li>`);
    charactersUl.innerHTML = charactersList.join("");
    const planetsList = film?.planets?.map(planet => `<li><a href="/planet.html?id=${planet.id}">${planet.name}</li>`);
    planetsUl.innerHTML = planetsList.join("");
  }
