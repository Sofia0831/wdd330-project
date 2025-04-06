const apiKey = `909bfc0e390cfccd8618b5ec5802f332`;
const listId = `8523840`;
const apiUrl = `https://api.themoviedb.org/3/list/${listId}?api_key=${apiKey}&language=en-US`;

const movielist = document.getElementById('movielist');

export async function fetchMovies() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        data.items.forEach(media => {
            const movieCard = createMovieCard(media);
            movielist.appendChild(movieCard);
        });

    } catch (error) {
        console.error("Error fetching data:", error)

    }
}


function createMovieCard(media) {
    const {title, backdrop_path, release_date} = media;

    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-item");

    const year = release_date.split('-')[0];

    movieCard.innerHTML = `
        <a href="#">
            <img src="https://image.tmdb.org/t/p/w500/${backdrop_path}" alt="${title} poster" width="300">
            <h3 class="title">${title}</h3>
            <p>(${year})</p>
        </a>
    `;
    return movieCard;
}