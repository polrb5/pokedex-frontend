import { initPokemonList } from './pokemon-list.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize components
  import('./header.js');
  import('./filters.js');
  initPokemonList();
});
