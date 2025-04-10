const apiKey = `909bfc0e390cfccd8618b5ec5802f332`;
const listId = `8523840`;
const apiUrl = `https://api.themoviedb.org/3/list/${listId}?api_key=${apiKey}&language=en-US`;

const movielist = document.getElementById('movielist');

export async function fetchMovies() {
    let currentPage = 1;
    let totalPages = 1;

    try {
        const firstPageUrl = `${apiUrl}&page=${currentPage}`;
        const response = await fetch(firstPageUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} on page ${currentPage}`);
        }
        const data = await response.json();

        totalPages = data.total_pages || 1;
        data.items.forEach(media => {
            const movieCard = createMovieCard(media);
            movielist.appendChild(movieCard);
        });
        
        currentPage++;
        while (currentPage <= totalPages) {
            const nextPageUrl = `${apiUrl}&page=${currentPage}`;
            const nextPageResponse = await fetch(nextPageUrl);
            const pageData = await nextPageResponse.json();
            pageData.items.forEach(media => {
                const movieCard = createMovieCard(media);
                movielist.appendChild(movieCard);
            });

            currentPage++;
        }

    } catch (error) {
        console.error("Error fetching data:", error)

    }
}


function createMovieCard(media) {
    const {id, title, backdrop_path, release_date} = media;

    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-item");

    const year = release_date.split('-')[0];

    movieCard.innerHTML = `
        <a href="movie-details.html?id=${id}">
            <img src="https://image.tmdb.org/t/p/w500/${backdrop_path}" alt="${title} poster" width="300">
            <h3 class="title">${title}</h3>
            <p>(${year})</p>
        </a>
    `;
    return movieCard;
}