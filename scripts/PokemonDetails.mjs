const apiKey = `909bfc0e390cfccd8618b5ec5802f332`;

const moviedeets = document.getElementById('moviedeets');
const videodeets = document.getElementById('videodeets');

export function GetMovieId() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('id');
}

export async function fetchMovieDetails(movieId) {
    const apiUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const movieData = await response.json();
        moviedeets.innerHTML = '';
        const movieDetailsElement = displayMovieDetails(movieData);
        moviedeets.appendChild(movieDetailsElement);

    } catch (error) {
        console.error("Error fetching movie details:", error);
        moviedeets.innerHTML = `<p>Could not load movie details. Please try again later or go back <a href="index.html">home</a>.</p>`;
    }

}

function displayMovieDetails(movie) {
    const {title, poster_path, release_date, overview, original_title, genres, tagline, homepage} = movie;
    const movieDetailsCard = document.createElement('div');
    movieDetailsCard.classList.add("movie-details");

    const year = release_date.split('-')[0];
    const genreNames = (genres && genres.length > 0)?genres.map(genre => genre.name).join(', '): 'N/A';

    movieDetailsCard.innerHTML = `
    <div class="movie-detail">
        <img src="https://image.tmdb.org/t/p/w500/${poster_path}" alt="${title} poster" loading="lazy">
        <h1>${title} (${year})</h1>
            <h3 class="og-title">Original Title: ${original_title}</h3>
            <p class="genre">${genreNames}</p>
            <p class="date"><strong>Release Date:</strong> ${release_date}</p>
            <h3 class="ov">Overview</h3>
            <p class="tagline">${tagline}</p>
            <p class="desc">${overview}</p>
            <a class="see-more" href="${homepage}" target="__blank">See More</a>
        
    </div>
    `;

    return movieDetailsCard;
}

export async function fetchMovieVideos(movieId) {
    const apiUrl = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}&language=en-US`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const videosData = await response.json();
        videodeets.innerHTML = '<h2>Videos</h2>';
        displayMovieVideos(videosData.results);
    } catch (error) {
        console.error("Error fetching movie videos:", error);
        videodeets.innerHTML = `<p>Could not load movie videos.</p>`;
    }
}

// function displayMovieVideos(videos) {
//     if (videos && videos.length > 0) {
//         const vidDiv = document.createElement('div');
//         vidDiv.classList.add('videos-container');

//         videos.forEach(video => {
//             const { name, key, site, type } = video;
//             let videoUrl = '';
//             let videoElement;

//             if (site === 'YouTube') {
//                 videoUrl = `https://www.youtube.com/embed/${key}`;
//                 videoElement = `
//                     <div class="video-item">
//                         <iframe src="${videoUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
//                     </div>
//                 `;
//             } else if (site === 'Vimeo') {
//                 videoUrl = `https://player.vimeo.com/video/${key}`;
//                 videoElement = `
//                     <div class="video-item">
//                         <h3>${name} (${type})</h3>
//                         <iframe src="${videoUrl}" width="560" height="315" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
//                     </div>
//                 `;
//             }

//             if (videoElement) {
//                 vidDiv.innerHTML += videoElement;
//             }
//         });

//         videodeets.appendChild(vidDiv);
//     } else {
//         videodeets.innerHTML = '<p>No videos found for this movie.</p>';
//     }
// }

function displayMovieVideos(videos) {
    const youtubeVideos = Array.isArray(videos)
        ? videos.filter(v => v.site === 'YouTube' && v.key)
        : [];

    if (youtubeVideos.length > 0) {
        const vidDiv = document.createElement('div');
        vidDiv.classList.add('videos-container'); 

        youtubeVideos.forEach(video => {
            const { name, key, type } = video;


            const videoItem = document.createElement('div');
            videoItem.classList.add('video-item');

            const titleElement = document.createElement('h4');
            titleElement.textContent = `${name || 'Video'} (${type || 'Unknown Type'})`;
            videoItem.appendChild(titleElement);

     
            const iframeWrapper = document.createElement('div');
            iframeWrapper.classList.add('iframe-wrapper');

  
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${key}`;
            iframe.title = name || "YouTube video player";
            iframe.frameborder = "0";
            iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
            iframe.referrerpolicy = "strict-origin-when-cross-origin";
            iframe.allowfullscreen = true;
            iframe.loading = "lazy";

            iframeWrapper.appendChild(iframe);
            videoItem.appendChild(iframeWrapper);

            vidDiv.appendChild(videoItem);
        });

        videodeets.appendChild(vidDiv);

    } else {
        videodeets.innerHTML = '<p>No videos found for this movie.</p>';
    }
}

