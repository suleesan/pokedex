import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./pokedex.css";
import { setPokedex, setSelectedPokemon } from "./actions";

const Pokedex = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const pokedex = useSelector((state) => state.pokedex);
  let selectedPokemon = useSelector((state) => state.selectedPokemon) || 1;
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const cachedData = localStorage.getItem("pokedexData");
        if (cachedData) {
          dispatch(setPokedex(JSON.parse(cachedData)));
          setIsLoading(false);
          return;
        }

        // if cached data not found, fetch from API
        const promises = [];
        const numPokemon = 50;
        for (let i = 1; i <= numPokemon; i++) {
          const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
          promises.push(fetch(url));
        }
        const responses = await Promise.all(promises);

        const newData = {};
        for (let i = 0; i < responses.length; i++) {
          const pokemon = await responses[i].json();
          const pokemonName = pokemon.name;
          const pokemonType = pokemon.types;
          const pokemonImg = pokemon.sprites.front_default;
          const speciesRes = await fetch(pokemon.species.url);
          const speciesData = await speciesRes.json();
          const pokemonDesc = speciesData.flavor_text_entries[9].flavor_text;

          newData[i + 1] = {
            name: pokemonName,
            img: pokemonImg,
            types: pokemonType,
            desc: pokemonDesc,
          };
        }

        dispatch(setPokedex(newData));
        localStorage.setItem("pokedexData", JSON.stringify(newData));
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching Pokémon data:", error);
        setIsLoading(false);
      }
    };

    fetchPokemon();
  }, [dispatch]);

  // Define a new function to handle Pokémon clicks
  const handlePokemonClick = (id) => {
    dispatch(setSelectedPokemon(id));
  };

  const handleSearch = () => {
    if (!searchQuery) {
      alert("Please enter a Pokémon name.");
      return;
    }
    const lowercaseQuery = searchQuery.toLowerCase();
    for (const id in pokedex) {
      if (pokedex[id].name.toLowerCase() === lowercaseQuery) {
        dispatch(setSelectedPokemon(id));

        // Scroll to the selected Pokemon
        const selectedPokemonElement = document.getElementById(id);
        if (selectedPokemonElement) {
          const container = document.getElementById("list");
          container.scrollTop = selectedPokemonElement.offsetTop - 275;
        }
        return;
      }
    }
    alert("Pokemon not found.");
  };

  return (
    <div id="container">
      {isLoading ? (
        <>
          <div id="loading-container">
            <div className="pokeball"></div>
            <h3>Loading...</h3>
            <h3>(This may take a while to load)</h3>
          </div>
        </>
      ) : (
        <div id="container">
          <div id="top-navigation">
            <div id="header">
              <h1 id="title">Susan's Pokedex</h1>
              <h4>First 50 Pokemon</h4>
              <p>More Pokemon to be added!</p>
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
          </div>

          <div id="content">
            <div id="list">
              {Object.keys(pokedex).map((id) => (
                <div
                  key={id}
                  id={id}
                  className={`pokemon-name ${
                    selectedPokemon === id ? "active" : ""
                  }`}
                  onClick={() => handlePokemonClick(id)}
                >
                  {`${id}. ${pokedex[id]?.name.toUpperCase()}`}
                </div>
              ))}
            </div>
            <div id="info">
              <div id="pokemon-box">
                <img
                  id="pokemon-img"
                  src={pokedex[selectedPokemon]?.img}
                  alt="Pokemon"
                />
                <div id="pokemon-innerbox">
                  <div id="pokemon-name">
                    {pokedex[selectedPokemon]?.name.toUpperCase()}
                  </div>
                  <div id="pokemon-types">
                    {pokedex[selectedPokemon]?.types?.map((type, index) => (
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
                {pokedex[selectedPokemon]?.desc}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pokedex;
