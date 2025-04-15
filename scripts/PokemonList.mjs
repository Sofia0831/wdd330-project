const apiKey = `909bfc0e390cfccd8618b5ec5802f332`;
const listId = `8523840`;

export async function fetchMovies() {
    const apiUrl = `https://api.themoviedb.org/3/list/${listId}?api_key=${apiKey}&language=en-US`;

    let currentPage = 1;
    let totalPages = 1;
    const allMovies = [];

    try {
        const firstPageUrl = `${apiUrl}&page=${currentPage}`;
        const response = await fetch(firstPageUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} on page ${currentPage}`);
        }
        const data = await response.json();

        totalPages = data.total_pages || 1;
        if (data.items) {
            allMovies.push(...data.items);
        }

        // data.items.forEach(media => {
        //     const movieCard = createMovieCard(media);
        //     container.appendChild(movieCard);
        // });
        
        currentPage++;
        while (currentPage <= totalPages) {
            const nextPageUrl = `${apiUrl}&page=${currentPage}`;
            const nextPageResponse = await fetch(nextPageUrl);
            const pageData = await nextPageResponse.json();
            if (pageData.items) {
                allMovies.push(...pageData.items);
            }
            // pageData.items.forEach(media => {
            //     const movieCard = createMovieCard(media);
            //     container.appendChild(movieCard);
            // });

            currentPage++;
        }
        return allMovies;

    } catch (error) {
        console.error("Error fetching data:", error)
        return [];
    }
}

export function displayMovies(movieArray, container) {
    container.innerHTML = ``;
    if (!Array.isArray(movieArray)|| movieArray.length === 0) {
        container.innerHTML = `<p>No movies to display</p>`;
        return;
    }

    movieArray.forEach(movie => {
        const card = createMovieCard(movie);
        container.appendChild(card);
    });
}


export function createMovieCard(media) {
    const {id, title, backdrop_path, release_date} = media || {};
    if (!id) return null;

    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-item");

    const year = release_date.split('-')[0];

    movieCard.innerHTML = `
        <a href="movie-details.html?id=${id}" target="_blank">
            <img src="https://image.tmdb.org/t/p/w500/${backdrop_path}" alt="${title} poster" width="300">
            <h3 class="title">${title}</h3>
            <p>(${year})</p>
        </a>
    `;
    return movieCard;
}

export function sortMovies(movies, sortBy) {
    const sortedMovies = [...movies];

    switch (sortBy) {
        case 'title-asc':
            sortedMovies.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'title-desc':
            sortedMovies.sort((a, b) => b.title.localeCompare(a.title));
            break;
        case 'date-asc':
            sortedMovies.sort((a, b) => {
                if (!a.release_date && !b.release_date) return 0;
                if (!a.release_date) return 1; 
                if (!b.release_date) return -1;
                return a.release_date.localeCompare(b.release_date);
            });
            break;
        case 'date-desc':
            sortedMovies.sort((a, b) => {
                if (!a.release_date && !b.release_date) return 0;
                if (!a.release_date) return 1;
                if (!b.release_date) return -1;
                return b.release_date.localeCompare(a.release_date);
            });
            break;
        case 'default':
        default:
            break; 
    }
    return sortedMovies;
}