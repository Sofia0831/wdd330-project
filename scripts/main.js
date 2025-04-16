import { updateFooter } from "./utils.js";
import { fetchMovies, displayMovies, sortMovies } from "./PokemonList.mjs";
import { loadMockyData, handleSearch } from "./Search.mjs";

let currentList = [];
const recentContainer = document.getElementById('recent-searches');

loadMockyData();

document.addEventListener('DOMContentLoaded', async () => {
    const footerElement = document.querySelector("footer");
    updateFooter(footerElement);

    const container = document.getElementById('movielist');

    const sortSelect = document.getElementById('sort-select');
    const lastSort = localStorage.getItem('lastSort');
    let initialSort = 'default';
    if (lastSort && sortSelect) {
        sortSelect.value = lastSort;
        initialSort = lastSort;
    }

    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', function() {
        const inputValue = this.value;
        const lettersOnly = /^[a-zA-Z\s]*$/;
        if (!lettersOnly.test(inputValue)) {
            this.value = inputValue.replace(/[^a-zA-Z\s]/g, '');
            alert('Only letters and spaces are allowed.');
        }
        
    });
    
    const clearSearchButton = document.getElementById('clear-search-button');
    if (clearSearchButton) {
        clearSearchButton.addEventListener('click', () => {
            location.reload();
        });
    }

    const fullMovieList = await fetchMovies();
    currentList = [...fullMovieList];
    const initiallySortedMovies = sortMovies(currentList, initialSort);
    currentList = initiallySortedMovies;
    displayMovies(currentList, container);

    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            sortSelect.value = 'default';

            const searchResults = await handleSearch(searchInput.value, container);
            if (Array.isArray(searchResults)) {
                currentList = searchResults;
            }
            else {
                currentList = [];
            }

            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                localStorage.setItem('lastPokemonSearch', searchTerm);
                let recent = JSON.parse(localStorage.getItem('recentPokemonSearches')) || [];
                const termIndex = recent.findIndex(term => term.toLowerCase() === searchTerm.toLowerCase());
                if (termIndex !== -1) {
                    const existing = recent.splice(termIndex, 1)[0];
                    recent.unshift(existing);
                }
                else {
                    recent.unshift(searchTerm);
                }
                recent = recent.slice(0, 5);
                localStorage.setItem('recentPokemonSearches', JSON.stringify(recent));
                displayRecentSearches(recent);
            }
        });
    }

    const storedRecentSearches = JSON.parse(localStorage.getItem('recentPokemonSearches')) || [];
    displayRecentSearches(storedRecentSearches);

    sortSelect.addEventListener('change', (event) => {
        const sortByValue = event.target.value;
        localStorage.setItem('lastSort', sortByValue);
        const moviesToDisplay = sortMovies(currentList, sortByValue);
        displayMovies(moviesToDisplay, container);
        
    });

    const visitorInfo = document.querySelector("#here");
    const lastVisit = localStorage.getItem("lastVisit");
    const currentDate = new Date();

    if (lastVisit === null) {
    	visitorInfo.textContent = "";
    } else {
    	const lastVisitDate = new Date(lastVisit);
    	const timeDiff = currentDate.getTime() - lastVisitDate.getTime();
    	const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    	if (daysDiff < 1) {
    		visitorInfo.textContent = "Back so soon! Awesome!";
    	} else if (daysDiff === 1) {
    		visitorInfo.textContent = "You last visited 1 day ago.";
    	} else {
    		visitorInfo.textContent = `You last visited ${daysDiff} days ago.`;
    	}
    }

    localStorage.setItem("lastVisit", currentDate.toString());

    recentContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('recent-search-link')) {
            e.preventDefault();
            const term = e.target.dataset.term;
            const searchInput = document.getElementById('search-input');
            const container = document.getElementById('movielist');
            if (searchInput && container) {
                searchInput.value = term;
                handleSearch(term, container);
            }
        }
    });

});

function displayRecentSearches(searchTerms) {
    recentContainer.innerHTML = '<h4>Recent Searches:</h4>';
    if (searchTerms.length === 0) {
        recentContainer.innerHTML += 'You have no recent searches yet';
        return;
    }
    const list = document.createElement('ul');
    searchTerms.forEach(term => {
        const item = document.createElement('li');
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = term;
        link.classList.add('recent-search-link');
        link.dataset.term = term;
        item.appendChild(link);
        list.appendChild(item);
    });
    recentContainer.appendChild(list);

}

