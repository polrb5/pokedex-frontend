import { initPokemonList } from './pokemon-list.js';
import { initializeFilters } from './filters.js';

document.addEventListener('DOMContentLoaded', async () => {  
  initializeFilters();
  initPokemonList();
});
