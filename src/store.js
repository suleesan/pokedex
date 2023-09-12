import { createStore } from 'redux';

// Define initial state
const initialState = {
  pokedex: JSON.parse(localStorage.getItem('pokedexData')) || {}, // Initialize with data from local storage if available
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_POKEDEX':
      return { ...state, pokedex: action.payload };
    case 'SET_SELECTED_POKEMON':
      return { ...state, selectedPokemon: action.payload }; // Update selectedPokemon
    default:
      return state;
  }
};

// Create the Redux store
const store = createStore(rootReducer);

export default store;
