import { updateFooter } from "./utils.js";
import { fetchMovies } from "./PokemonList.mjs";
import { loadMockyData, handleSearch } from "./Search.mjs";

document.addEventListener('DOMContentLoaded', () => {
    const footerElement = document.querySelector("footer");
    updateFooter(footerElement);

    const container = document.getElementById('movielist');

    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', (event) => {
            event.preventDefault();
            handleSearch(searchInput.value, container);
        });
    }
    
    
    fetchMovies(container);
    loadMockyData();

});

const videoModal = document.getElementById('videoModal');

// const closeModalButton = profileModal.getElementById('closeModal');
//     closeModalButton.addEventListener("click", () => {
//         videoModal.close();
//     });
