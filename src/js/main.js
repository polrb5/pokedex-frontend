import { initPokemonList } from './pokemon-list.js';
import { initializeFilters } from './filters.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Dynamically import the header module
  await import('./header.js');
  
  // Initialize filters and Pokemon list
  initializeFilters();
  initPokemonList();
});
