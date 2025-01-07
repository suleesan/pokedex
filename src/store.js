import { configureStore } from "@reduxjs/toolkit";
import { SET_POKEMON_DETAILS, SET_SELECTED_POKEMON } from "./actions";

const initialState = {
  pokedexData: JSON.parse(localStorage.getItem("pokedexData")) || {},
  selectedPokemon: null,
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SELECTED_POKEMON:
      return { ...state, selectedPokemon: action.payload };
    case SET_POKEMON_DETAILS:
      const updatedDetails = {
        ...state.pokedexData,
        [action.payload.id]: action.payload.details,
      };
      localStorage.setItem("pokedexData", JSON.stringify(updatedDetails));
      return {
        ...state,
        pokedexData: updatedDetails,
      };

    default:
      return state;
  }
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
