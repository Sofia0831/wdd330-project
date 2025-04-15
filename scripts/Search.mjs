import { createMovieCard } from "./PokemonList.mjs";
const apiKey = `909bfc0e390cfccd8618b5ec5802f332`;

const mockyUrl = `https://run.mocky.io/v3/36153ceb-bec2-4ba3-ab65-135d97a2c933`;

let pokemonData = null;
let isLoading = false;
let loadFail = false;

const header = document.getElementById('search-result-header');

export async function loadMockyData() {
    if (pokemonData || isLoading || loadFail) {
        console.log("Mocky data loaded, loading, or failed");
        return;
    }

    isLoading = true;
    console.log("Loading data from Mocky");

    try {
        const response = await fetch(mockyUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        pokemonData = data;
        console.log("Data loaded successfully:" , pokemonData);
        loadFail = false;
    }
    catch (error) {
        console.error("Could not fetch mocky data:", error);
        pokemonData = null;
        loadFail = true;
    }
    finally {
        isLoading = false;
    }
    
}

async function fetchMoviebyIdSearch(movieId) {
    const apiUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            console.error(`Failed to fetch details for movie ID ${movieId}: ${response.status}`);
            return null;
        }
        return await response.json();
    }
    catch (error) {
        console.error(`Error fetching details for movie ID ${movieId}:`, error);
        return null;
    }
}

export async function handleSearch(pokemonName, container) {

    const lowercaseName = pokemonName?.toLowerCase().trim();

    if (!container) {
        console.error("handleSearch: Container element not provided!");
        return;
    }

    if (!lowercaseName) {
        console.log("Search term is empty.");
        return;
    }

    if (isLoading){
        console.log("Data still loading, please wait.");
        return;
    }
    
    if (!pokemonData) {
        console.error("Pokemon data failed to load");
        return;
    }

    const moviesForPokemon = pokemonData.pokemon_movies?.[lowercaseName];

    if (moviesForPokemon && moviesForPokemon.length > 0) {
        container.innerHTML = ``;
        header.innerHTML = `<h2>Found ${moviesForPokemon.length} movie(s) for "${pokemonName}"</h2>`;
        console.log(`Movies found for ${pokemonName}:`, moviesForPokemon);

        const detailPromises = moviesForPokemon.map(ref => fetchMoviebyIdSearch(ref.tmdb_id));

        try {
            const movieResults = await Promise.all(detailPromises);
            const validResults = movieResults.filter(details => details !== null);
            displaySearchResults(validResults, container);
        }
        catch (error) {
            console.error("Error fetching details for search results:", error);
        }
    }
    else {
        console.log(`No movies found for ${pokemonName}`);
        container.innerHTML =``;
        header.innerHTML = `<h2 class="no-results">Sorry no movies were found for "${pokemonName}"</h2>`;
    }
}

function displaySearchResults(movieDetailsArray, container) {

    if (!movieDetailsArray || movieDetailsArray.length === 0) {
        container.innerHTML = '<p>No movie details could be loaded for the results.</p>';
        return;
    }

    movieDetailsArray.forEach(detailedMovieData => {
        const movieCard = createMovieCard(detailedMovieData);
        const searchDiv = document.createElement('div');
        searchDiv.appendChild(movieCard);
        container.appendChild(searchDiv);
    });
}

