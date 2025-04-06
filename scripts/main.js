import { updateFooter } from "./utils.js";
import { fetchMovies } from "./PokemonList.mjs";

document.addEventListener('DOMContentLoaded', () => {
    const footerElement = document.querySelector("footer");
    updateFooter(footerElement);

});


fetchMovies();