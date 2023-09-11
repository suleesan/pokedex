import React, { useState, useEffect } from "react";
import './pokedex.css';

const Pokedex = () => {
  const [pokedex, setPokedex] = useState({});
  const [selectedPokemon, setSelectedPokemon] = useState(1);
  const [isLoading, setIsLoading] = useState(true); // Add a loading state

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

  return (
    <div id="container">
      {isLoading ? ( // Show loading indicator while data is being fetched
        <>
          <div id="pokeball" class="pokeball"></div>
        </>
      ) : (
        <>
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
                  className={`pokemon-name ${selectedPokemon === parseInt(id) ? 'active' : ''}`}
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


