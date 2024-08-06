export const sortPokemonById = (pokemonData) => {
  return pokemonData.sort((a, b) => a.entry_number - b.entry_number);
};
