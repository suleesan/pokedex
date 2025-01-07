import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./pokedex.css";
import { setSelectedPokemon, setPokemonDetails } from "./actions";
import { pokemonDictionary } from "./dictionary";

const Pokedex = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();
  const pokedexData = useSelector((state) => state.pokedexData);
  const selectedPokemon = useSelector((state) => state.selectedPokemon) || 1;

  const pokemonList = Object.keys(pokemonDictionary).map((name) => ({
    name,
    id: pokemonDictionary[name],
  }));

  // fetch bulbasaur upon first load
  useEffect(() => {
    const bulbasaurId = pokemonDictionary["bulbasaur"];

    if (!pokedexData[bulbasaurId]) {
      fetchPokemonDetails(bulbasaurId);
    }

    if (!selectedPokemon) {
      dispatch(setSelectedPokemon(bulbasaurId));
    }
  }, [dispatch, pokedexData, selectedPokemon]);

  const fetchPokemonDetails = async (id) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const data = await response.json();
      const speciesResponse = await fetch(data.species.url);
      const speciesData = await speciesResponse.json();

      const details = {
        name: data.name,
        img: data.sprites.front_default,
        types: data.types,
        desc:
          speciesData.flavor_text_entries.find(
            (entry) => entry.language.name === "en"
          )?.flavor_text || "No description available.",
      };

      dispatch(setPokemonDetails(id, details));
    } catch (error) {
      console.error("Error fetching Pokémon details:", error);
    }
  };

  const handlePokemonClick = (id) => {
    if (!pokedexData[id]) {
      fetchPokemonDetails(id);
    }
    dispatch(setSelectedPokemon(id));
  };

  const handleSearch = () => {
    if (!searchQuery) {
      alert("Please enter a Pokémon name.");
      return;
    }

    const match = pokemonList.find(
      (pokemon) => pokemon.name.toLowerCase() === searchQuery.toLowerCase()
    );

    if (match) {
      handlePokemonClick(match.id);
      const element = document.getElementById(match.id);
      if (element) {
        const container = document.getElementById("list");
        container.scrollTop = element.offsetTop - 275;
      }
    } else {
      alert("Pokémon not found.");
    }
  };

  return (
    <div id="container">
      <div id="header">
        <h1 id="title">Susan's Pokedex</h1>
        <p>Generations I - IV</p>
      </div>
      <div id="search-box">
        <input
          type="text"
          placeholder="Search Pokémon by name"
          value={searchQuery}
          id="input-form"
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <button id="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>

      <div id="content">
        <div id="list">
          {pokemonList.map((pokemon) => (
            <div
              key={pokemon.id}
              id={pokemon.id}
              className={`pokemon-name ${
                selectedPokemon === pokemon.id ? "active" : ""
              }`}
              onClick={() => handlePokemonClick(pokemon.id)}
            >
              {`${pokemon.id}. ${pokemon.name.toUpperCase()}`}
            </div>
          ))}
        </div>
        <div id="info">
          {selectedPokemon && pokedexData[selectedPokemon] ? (
            <>
              <div id="pokemon-box">
                <img
                  id="pokemon-img"
                  src={pokedexData[selectedPokemon].img}
                  alt="Pokemon"
                />
                <div id="pokemon-innerbox">
                  <div id="pokemon-name">
                    {pokedexData[selectedPokemon].name.toUpperCase()}
                  </div>
                  <div id="pokemon-types">
                    {pokedexData[selectedPokemon].types.map((type, index) => (
                      <span
                        key={index}
                        className={`type-box ${type.type.name}`}
                      >
                        {type.type.name.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div id="pokemon-description">
                {pokedexData[selectedPokemon].desc}
              </div>
            </>
          ) : (
            <>
              <div id="pokemon-box"></div>
              <div id="pokemon-description"></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Pokedex;
