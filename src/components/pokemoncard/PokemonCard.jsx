import axios from "axios";
import {useEffect, useState} from "react";
import './PokemonCard.css'
import Button from "../button/Button.jsx";

function PokemonCard() {
    const [pokemon, setPokemon] = useState([]);
    const [error, toggleError] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, toggleLoading] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        async function fetchPokemon() {
            toggleError(false);
            toggleLoading(true);

            try {
                const offset = (currentPage - 1) * 20; // Berekent de offset op basis van de huidige pagina
                const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`, {
                    signal: controller.signal,
                });
                const pokemonResults = response.data.results;

                // Dit maakt een array met de gegevens van elke Pokémon
                const pokemonDataArray = await Promise.all(pokemonResults.map(async (result) => {
                    const pokemonResponse = await axios.get(result.url);
                    return pokemonResponse.data;
                }));

                setPokemon(pokemonDataArray);
                console.log(pokemonDataArray)

            } catch (e) {
                // Het ging mis, kwam dat door het aborten van het request?
                if(axios.isCancel(e)) {
                    console.error('Request is gecancelled om memory leak te voorkomen');
                } else {
                    // Zo nee, dan is er iets anders aan de hand, log dit in console
                    console.error(e);
                }
                toggleError(true);
            } finally {
                toggleLoading(false);
            }
        }

        void fetchPokemon();
        return function cleanup() {
            controller.abort();
        }
    }, [currentPage]);

    // De "Volgende" knop is standaard niet uitgeschakeld. Het wordt uitgeschakeld wanneer de huidige pagina de eerste pagina is (pagina 1) om te voorkomen dat je naar negatieve paginanummers gaat.

    // Nog een vraag aan degene die nakijkt, zijn onderstaande functies voorbeelden die je apart als helperfuncties zou opslaan, of is het gebruikelijk dat deze in dit component blijven?
    const handleNextClick = () => {
        setCurrentPage(currentPage + 1);
    };
    const handlePrevClick = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="page-container">

            <div className="button-wrapper">
                <Button
                    text="vorige"
                    clickHandler={handlePrevClick}
                    disabled={currentPage === 1}
                />
                <Button
                    text="volgende"
                    clickHandler={handleNextClick}
                    disabled={false}
                />
            </div>

            <div className="inner-container">

                {error && <p className="error-message">Er is iets mis gegaan! De Pokemons spelen verstoppertje..</p>}
                {loading && <p className="loading-message">Loading..Pokemons incoming in 3..2..1..</p>}

                {pokemon.length > 0 && pokemon.map((pokemon) => (
                    <div key={pokemon.id} className="pokemon-card">
                        <h2>{pokemon.name}</h2>
                        <span>
                            <img src={pokemon.sprites && pokemon.sprites.front_default} alt=""/>
                        </span>
                        <h3>Moves: {pokemon.moves && pokemon.moves.length}</h3>
                        {/*of {pokemon.moves ? pokemon.moves.length : 0}*/}
                        <h3>Weight: {pokemon.weight}</h3>
                        <h3>Abilities:</h3>
                        <ul>
                            {pokemon.abilities && pokemon.abilities.map((abilityData, index) => (
                                <li key={index}
                                    className="abilities">
                                    {abilityData.ability.name}<
                                    /li>
                            ))}
                        </ul>
                    </div>
                ))}

            </div>

        </div>
    );
}

export default PokemonCard;