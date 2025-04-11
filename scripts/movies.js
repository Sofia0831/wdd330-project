import { updateFooter } from "./utils.js";
import { GetMovieId, fetchMovieDetails, fetchMovieVideos} from "./PokemonDetails.mjs";

document.addEventListener('DOMContentLoaded', () => {
    const footerElement = document.querySelector("footer");
    updateFooter(footerElement);

});

const movieId = GetMovieId();

if (movieId) {
    fetchMovieDetails(movieId);
    fetchMovieVideos(movieId);
} else {
    console.error("No movie ID found in URL.");
    movieDetailsContainer.innerHTML = `<p>Error: No movie specified. Please go back <a href="index.html">home</a> and select a movie.</p>`;
}