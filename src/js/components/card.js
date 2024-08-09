import { getPokemonImageUrl } from '../services/api.js';
import { capitalize } from '../utils/text';

export const createCard = (pokemon) => {
  const pokemonCard = document.createElement('div');
  pokemonCard.className = 'pokemon-list__card';
  pokemonCard.innerHTML = `
    <img src="${getPokemonImageUrl(pokemon.entry_number)}" alt="${pokemon.pokemon_species.name}">
    <p>${capitalize(pokemon.pokemon_species.name)}</p>
  `;
  return pokemonCard;
};
