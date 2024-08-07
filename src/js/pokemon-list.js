import { sortPokemonById } from './utils/data.js';
import { displayMessage } from './utils/message.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ASSETS_URL = import.meta.env.VITE_ASSETS_BASE_URL;

export const initPokemonList = () => {
  const pokemonList = document.getElementById('pokemon-list');
  const loadMoreButton = document.createElement('button');
  loadMoreButton.id = 'load-more';
  loadMoreButton.className = 'pokemon-list__load-more';
  loadMoreButton.textContent = 'Load More';

  const searchInput = document.getElementById('search');
  let pokemonData = [];
  let currentIndex = 0;

  const showLoadingMessage = () => {
    displayMessage(pokemonList, 'Loading...', 'info');
  };

  const showErrorMessage = (message) => {
    displayMessage(pokemonList, message, 'error', fetchPokemon);
  };

  const fetchPokemon = async () => {
    showLoadingMessage();
    try {
      const response = await fetch(`${API_BASE_URL}/pokedex/national`);
      if (!response.ok) {
        showErrorMessage('Failed to load data. Please try again.');
        return;
      }
      const data = await response.json();
      pokemonData = sortPokemonById(data.pokemon_entries);
      displayPokemon(true);
    } catch (error) {
      console.error('Error fetching Pokemon data:', error);
      showErrorMessage('Failed to load data. Please check your connection and try again.');
    }
  };

  const createPokemonCard = (pokemon) => {
    const pokemonCard = document.createElement('div');
    pokemonCard.className = 'pokemon-list__card';
    pokemonCard.innerHTML = `
      <img src="${ASSETS_URL}${pokemon.entry_number.toString().padStart(3, '0')}.png" alt="${pokemon.pokemon_species.name}">
      <p>${pokemon.pokemon_species.name}</p>
    `;
    return pokemonCard;
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
    const cards = displayData.map(createPokemonCard);
    cardsContainer.append(...cards);
    currentIndex += 20;
    pokemonList.appendChild(loadMoreButton);
    loadMoreButton.style.display = currentIndex >= pokemonData.length ? 'none' : 'block';
  };

  const filterPokemon = (searchTerm) => {
    pokemonList.innerHTML = '';
    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'pokemon-list__cards';
    pokemonList.append(cardsContainer, loadMoreButton);

    if (!searchTerm) {
      loadMoreButton.style.display = 'block';
      displayPokemon(true);
      return;
    }
    
    const filteredPokemon = pokemonData.filter(pokemon => pokemon.pokemon_species.name.includes(searchTerm));

    if (!filteredPokemon.length) {
      displayMessage(pokemonList, 'No results found.', 'info');
      loadMoreButton.style.display = 'none';
      return;
    }
    
    const cards = filteredPokemon.map(createPokemonCard);
    cardsContainer.append(...cards);
    loadMoreButton.style.display = 'none';
  };

  loadMoreButton.addEventListener('click', () => displayPokemon());

  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    filterPokemon(searchTerm);
  });

  fetchPokemon();
};
