let nameH1;
let terrainSpan;
let populationSpan;
let charactersUl;
let filmsUl;
const baseUrl = `https://swapi2.azurewebsites.net/api`;

// Runs on page load
addEventListener('DOMContentLoaded', () => {
  nameH1 = document.querySelector('h1#name');
  terrainSpan = document.querySelector('span#terrain');
  populationSpan = document.querySelector('span#population');
  charactersUl = document.querySelector('#characters>ul');
  filmsUl = document.querySelector('#films>ul');
  const sp = new URLSearchParams(window.location.search)
  const id = sp.get('id')
  getPlanet(id)
});

async function getPlanet(id) {
  let planet;
  let storedPlanet = localStorage.getItem(`planet-${id}`);
  if(!storedPlanet){
    try {
      planet = await fetchPlanet(id)
      planet.characters = await fetchCharacters(planet)
      planet.films = await fetchFilms(planet)
      localStorage.setItem(`planet-${id}`, JSON.stringify(planet));
    }
    catch (ex) {
      console.error(`Error reading planet ${id} data.`, ex.message);
    }
  } else {
    planet = JSON.parse(storedPlanet);
  }
  renderPlanet(planet);

}
async function fetchPlanet(id) {
  let planetURL = `${baseUrl}/planets/${id}`;
  return await fetch(planetURL)
    .then(res => res.json())
}

async function fetchCharacters(planet) {
  const url = `${baseUrl}/planets/${planet?.id}/characters`;
  const characters = await fetch(url)
    .then(res => res.json())
  return characters;
}

async function fetchFilms(planet) {
  const url = `${baseUrl}/planets/${planet?.id}/films`;
  const films = await fetch(url)
    .then(res => res.json());
  return films;
}

const renderPlanet = planet => {
  document.title = `SWAPI - ${planet?.name}`;  // Just to make the browser tab say their name
  nameH1.textContent = planet?.name;
  terrainSpan.textContent = planet?.terrain;
  populationSpan.textContent = planet?.population;
  const charactersList = planet?.characters?.map(character => `<li><a href="/character.html?id=${character.id}">${character.name}</li>`)
  charactersUl.innerHTML = charactersList.join("");
  const filmsList = planet?.films?.map(film => `<li><a href="/films.html?id=${film.id}">${film.title}</li>`)
  filmsUl.innerHTML = filmsList.join("");
}
