import React, { useState, useEffect } from "react";
import './pokedex.css';

const Pokedex = () => {
  const [pokedex, setPokedex] = useState({});
  const [selectedPokemon, setSelectedPokemon] = useState(1);
  const [isLoading, setIsLoading] = useState(true); 
  const [searchQuery, setSearchQuery] = useState("");
  const [searchError, setSearchError] = useState(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const promises = [];
        const numPokemon = 493;
        for (let i = 1; i <= numPokemon; i++) { // Start from 1
          const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
          promises.push(fetch(url));
        }
        const responses = await Promise.all(promises);

        const newData = {}; // Create a new object to store the data
        for (let i = 0; i < responses.length; i++) {
          const pokemon = await responses[i].json();
          const pokemonName = pokemon.name;
          const pokemonType = pokemon.types;
          const pokemonImg = pokemon.sprites.front_default;
          const speciesRes = await fetch(pokemon.species.url);
          const speciesData = await speciesRes.json();
          const pokemonDesc = speciesData.flavor_text_entries[9].flavor_text;

          newData[i + 1] = { // Use newData to avoid setting state multiple times
            name: pokemonName,
            img: pokemonImg,
            types: pokemonType,
            desc: pokemonDesc,
          };
        }
        setPokedex(newData); // Update state once with all data
        setIsLoading(false); // Set loading to false when data is loaded
      } catch (error) {
        console.error("Error fetching Pokémon data:", error);
        setIsLoading(false); // Make sure loading is set to false in case of an error
      }
    };

    fetchPokemon();
  }, []);

  const updatePokemon = (id) => {
    setSelectedPokemon(id);
  };

  const handleSearch = () => {
    setSearchError(null);
  
    if (!searchQuery) {
      alert("Please enter a Pokémon name.");
      return;
    }
  
    const lowercaseQuery = searchQuery.toLowerCase();
  
    for (const id in pokedex) {
      if (pokedex[id].name.toLowerCase() === lowercaseQuery) {
        setSelectedPokemon(parseInt(id));
        // Scroll to the selected Pokemon
        const selectedPokemonElement = document.getElementById(id);
        if (selectedPokemonElement) {
          const container = document.getElementById("pokemon-list");
          container.scrollTop = selectedPokemonElement.offsetTop -200;
        }
        return; // Exit the loop once a match is found
      }
    }
  
    alert("Pokemon not found.")
  };
  
  return (
    <div id="container">
      {isLoading ? ( 
        <>
        <div id="loading-container">
          <div className="pokeball"></div>
          <h3>Note: This may take a while to load.</h3>
        </div>
        </>
      ) : (
        <>
          <div id="header">
            <h1 id="title">Susan's Pokedex</h1>
            <h4>Generations I-IV</h4>
          </div>
          <div id="search-box">
            <input
            type="text"
            placeholder="Search Pokémon by name"
            value={searchQuery}
            id="input-form"
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            />
            <button id="search-button" onClick={handleSearch}>Search</button>
          </div>
          <div id="content-box">
            <div id="pokemon-info">
              <img id="pokemon-img" src={pokedex[selectedPokemon]?.img} alt="Pokemon" />
              <div id="pokemon-types">
                {pokedex[selectedPokemon]?.types?.map((type, index) => (
                  <span key={index} className={`type-box ${type.type.name}`}>
                    {type.type.name.toUpperCase()}
                  </span>
                ))}
              </div>
              <div id="pokemon-description">{pokedex[selectedPokemon]?.desc}</div>
            </div>
            <div id="pokemon-list">
              {Object.keys(pokedex).map((id) => (
                <div
                  key={id}
                  id={id}
                  className={`pokemon-name ${selectedPokemon === id ? 'active' : ''}`}
                  onClick={() => updatePokemon(id)}
                >
                  {`${id}. ${pokedex[id]?.name.toUpperCase()}`}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Pokedex;
