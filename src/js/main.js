import { initPokemonList } from './pokemon-list.js';
import { initializeFilters } from './filters.js';

document.addEventListener('DOMContentLoaded', async () => {  
  // Initialize filters and Pokemon list
  initializeFilters();
  initPokemonList();
});
