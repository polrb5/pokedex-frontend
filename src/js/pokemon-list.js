import { sortPokemonById } from './utils/data.js';
import { displayMessage } from './utils/message.js';
import { fetchData, getPokemonUrls } from './services/api.js';
import { filterState } from './filters.js';
import { showSpinner, hideSpinner } from './utils/spinner.js';
import { MESSAGE, MESSAGE_TYPE } from './constants/message';
import { API_PATHS } from './constants/api';
import { createCard } from './components/card';

export const initPokemonList = () => {
  const pokemonList = document.getElementById('pokemon-list');
  const loadMoreButton = document.createElement('button');
  loadMoreButton.id = 'load-more';
  loadMoreButton.className = 'pokemon-list__load-more';
  loadMoreButton.textContent = 'Load More';

  const searchInput = document.getElementById('search');
  let pokemonData = [];
  let currentIndex = 0;

  const showErrorMessage = (message) => displayMessage(pokemonList, message, MESSAGE_TYPE.ERROR, fetchPokemon);
  const showInfoMessage = (message) => displayMessage(pokemonList, message, MESSAGE_TYPE.INFO);

  const fetchPokemon = async () => {
    showSpinner(pokemonList);
    const { data, error } = await fetchData(API_PATHS.POKEDEX_NATIONAL);

    if (error) {
      hideSpinner();
      return showErrorMessage(error);
    }

    pokemonData = sortPokemonById(data.pokemon_entries);
    displayPokemon(true);
    hideSpinner();
  };

  const fetchFilteredPokemon = async () => {
    const { types, colors, genders } = filterState;
    let filteredSets = [];
    showSpinner(pokemonList);
    pokemonList.innerHTML = '';

    if (!types.size && !colors.size && !genders.size) {
      await fetchPokemon();
      hideSpinner();
      return;
    }

    try {
      if (types.size) {
        const typePromises = Array.from(types).map(type => getPokemonUrls(`${API_PATHS.TYPES}/${type}`, 'pokemon', 'pokemon'));
        const typeResults = await Promise.all(typePromises);
        const flattenedTypeResults = typeResults.flat();
        if (flattenedTypeResults.length === 0) {
          showInfoMessage(MESSAGE.NO_ITEMS_FOR_FILTERS);
          hideSpinner();
          return;
        }
        filteredSets.push(new Set(flattenedTypeResults.map(p => p.url)));
      }
      if (colors.size) {
        const colorPromises = Array.from(colors).map(color => getPokemonUrls(`${API_PATHS.COLOR}/${color}`, 'pokemon_species'));
        const colorResults = await Promise.all(colorPromises);
        filteredSets.push(new Set(colorResults.flat().map(p => p.url)));
      }
      if (genders.size) {
        const genderPromises = Array.from(genders).map(gender => getPokemonUrls(`${API_PATHS.GENDER}/${gender}`, 'pokemon_species_details', 'pokemon_species'));
        const genderResults = await Promise.all(genderPromises);
        filteredSets.push(new Set(genderResults.flat().map(p => p.url)));
      }

      let intersectedUrls = filteredSets.reduce((a, b) => new Set([...a].filter(x => b.has(x))));

      const filteredPokemon = await Promise.all(Array.from(intersectedUrls).map(async (url) => {
        try {
          const response = await fetch(url);
          if (!response.ok) {
            showErrorMessage(MESSAGE.ERROR_FETCHING_DATA);
            return null;
          }
          const data = await response.json();
          return {
            entry_number: data.id,
            pokemon_species: {
              name: data.name,
              url: data.species.url,
            },
          };
        } catch (error) {
          showErrorMessage(error);
          return null;
        }
      }));

      pokemonData = sortPokemonById(filteredPokemon.filter(p => p));

      if (pokemonData.length === 0) {
        showInfoMessage(MESSAGE.NO_ITEMS_FOR_FILTERS);
      } else {
        displayPokemon(true);
      }
    } catch (error) {
      showErrorMessage(error);
    } finally {
      hideSpinner();
    }
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
    const displayData = pokemonData.slice(currentIndex, currentIndex + 20);
    const cards = displayData.map(createCard);
    cardsContainer.append(...cards);
    currentIndex += 20;
    pokemonList.appendChild(loadMoreButton);
    loadMoreButton.style.display = currentIndex >= pokemonData.length ? 'none' : 'block';
  };

  const filterPokemon = (searchTerm) => {
    const cardsContainer = document.querySelector('.pokemon-list__cards');
    cardsContainer.innerHTML = '';

    let filteredPokemon;
    if (!isNaN(searchTerm)) {
      filteredPokemon = pokemonData.filter(pokemon => pokemon.entry_number.toString().includes(searchTerm));
    } else {
      filteredPokemon = pokemonData.filter(pokemon => pokemon.pokemon_species.name.toLowerCase().includes(searchTerm.toLowerCase()));
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

  document.addEventListener('filterChange', () => {
    fetchFilteredPokemon();
  });

  fetchPokemon();
};
