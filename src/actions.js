export const SET_POKEDEX = 'SET_POKEDEX';
export const SET_SELECTED_POKEMON = 'SET_SELECTED_POKEMON';

export const setPokedex = (data) => {
  // Store the data in local storage
  localStorage.setItem('pokedexData', JSON.stringify(data));

  return {
    type: SET_POKEDEX,
    payload: data,
  };
};

export const setSelectedPokemon = (id) => ({
  type: SET_SELECTED_POKEMON,
  payload: id,
});
