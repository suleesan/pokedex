export const SET_SELECTED_POKEMON = "SET_SELECTED_POKEMON";
export const SET_POKEMON_DETAILS = "SET_POKEMON_DETAILS";

export const setSelectedPokemon = (id) => ({
  type: SET_SELECTED_POKEMON,
  payload: id,
});

export const setPokemonDetails = (id, details) => ({
  type: SET_POKEMON_DETAILS,
  payload: { id, details },
});
