import { sortPokemonById } from './utils/data.js';
import { displayMessage } from './utils/message.js';
import { fetchData } from './services/api.js';
import { filterState } from './filters.js';
import { showSpinner, hideSpinner } from './utils/spinner.js';
import { MESSAGE, MESSAGE_TYPE } from './constants/message';
import { API_PATHS } from './constants/api.js';
import { createCard } from './components/card.js';

export const initPokemonList = () => {
  const pokemonList = document.getElementById('pokemon-list');
  const loadMoreButton = document.createElement('button');
  loadMoreButton.id = 'load-more';
  loadMoreButton.className = 'pokemon-list__load-more';
  loadMoreButton.textContent = 'Load More';

  const searchInput = document.getElementById('search');
  let pokemonData = [];
  let filteredData = [];
  let currentIndex = 0;

  const showErrorMessage = (message) => displayMessage(pokemonList, message, MESSAGE_TYPE.ERROR, fetchPokemon);
  const showInfoMessage = (message) => displayMessage(pokemonList, message, MESSAGE_TYPE.INFO);

  const fetchPokemon = async () => {
    showSpinner(pokemonList);
    const { data, error } = await fetchData(API_PATHS.POKEDEX_NATIONAL);

    if (error) {
      hideSpinner();
      showErrorMessage(error);
      return;
    }

    pokemonData = sortPokemonById(data.pokemon_entries);
    displayPokemon(true);
    hideSpinner();
  };

  const fetchFilteredPokemon = async () => {
    const { types, colors, genders } = filterState;
    pokemonList.innerHTML = '';

    if (!types.size && !colors.size && !genders.size) {
      filteredData = [];
      await fetchPokemon();
      return;
    }

    showSpinner(pokemonList);

    const fetchTypePromises = Array.from(types).map(type => fetchData(`${API_PATHS.TYPE}/${type}`));
    const fetchColorPromises = Array.from(colors).map(color =>  fetchData(`${API_PATHS.COLOR}/${color}`));
    const fetchGenderPromises = Array.from(genders).map(gender => gender !== 'all' ? fetchData(`${API_PATHS.GENDER}/${gender}`) : null);

    const [typeResults, colorResults, genderResults] = await Promise.all([
      Promise.all(fetchTypePromises),
      Promise.all(fetchColorPromises),
      Promise.all(fetchGenderPromises),
    ]);

    const typeFiltered = new Set(typeResults.flatMap(result => result.data.pokemon.map(p => p.pokemon.name)));
    const colorFiltered = new Set(colorResults.flatMap(result => result.data.pokemon_species.map(p => p.name)));
    const genderFiltered = new Set(genderResults ? genderResults.flatMap(result => result?.data?.pokemon_species_details?.map(p => p.pokemon_species.name) || []) : pokemonData.map(p => p.pokemon_species.name));

    filteredData = pokemonData.filter(pokemon => {
      const name = pokemon.pokemon_species.name;
      const matchType = !types.size || typeFiltered.has(name);
      const matchColor = !colors.size || colorFiltered.has(name);
      const matchGender = !genders.size || genderFiltered.has(name);
      return matchType && matchColor && matchGender;
    });

    displayPokemon(true);
    hideSpinner();
};

  const displayPokemon = (reset = false) => {
    if (reset) {
      currentIndex = 0;
      pokemonList.innerHTML = '';
      const cardsContainer = document.createElement('div');
      cardsContainer.className = 'pokemon-list__cards';
      pokemonList.appendChild(cardsContainer);
    }

    const cardsContainer = document.querySelector('.pokemon-list__cards');
    const displayData = (filteredData.length ? filteredData : pokemonData).slice(currentIndex, currentIndex + 20);
    const cards = displayData.map(createCard);
    cardsContainer.append(...cards);
    currentIndex += 20;
    loadMoreButton.style.display = currentIndex >= (filteredData.length ? filteredData.length : pokemonData.length) ? 'none' : 'block';
    pokemonList.appendChild(loadMoreButton);
  };

  const filterPokemon = (searchTerm) => {
    const cardsContainer = document.querySelector('.pokemon-list__cards');
    cardsContainer.innerHTML = '';

    const dataToFilter = filteredData.length ? filteredData : pokemonData;

    let filteredPokemon;
    if (!isNaN(searchTerm)) {
      filteredPokemon = dataToFilter.filter(pokemon => pokemon.entry_number.toString().includes(searchTerm));
    } else {
      filteredPokemon = dataToFilter.filter(pokemon => pokemon.pokemon_species.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (!filteredPokemon.length) {
      showInfoMessage(MESSAGE.NO_RESULTS_FOUND);
      loadMoreButton.style.display = 'none';
      return;
    }

    const cards = filteredPokemon.map(createCard);
    cardsContainer.append(...cards);
    loadMoreButton.style.display = 'none';
};


  loadMoreButton.addEventListener('click', () => displayPokemon());

  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    if (searchTerm === '') return fetchFilteredPokemon();

    filterPokemon(searchTerm);
  });

  document.addEventListener('filterChange', fetchFilteredPokemon);

  fetchPokemon();
};
