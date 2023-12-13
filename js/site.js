const API_KEY =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmY2U5NmYwNDIyODlhNWRjY2FiYmFjZDIzNTFiNzBhOCIsInN1YiI6IjY0YzE2ODMxZGY4NmE4MDBlNzgwMjQyNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.O2XFMmGJG8hkQnUFu7BbenNOkwlPw98z5SqCe4cJWJM";

async function getMovies() {
  try {
    const response = await fetch("https://api.themoviedb.org/3/movie/popular", {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

async function displayMovies() {
  const movieListDiv = document.getElementById("movie-list");
  const moviePosterTemplate = document.getElementById("movie-card-template");

  const data = await getMovies();

  const movies = data.results; // Movies is an array of objects

  movies.forEach((movie) => {
    const movieCard = moviePosterTemplate.content.cloneNode(true);

    const titleElement = movieCard.querySelector(".card-body > h5");
    titleElement.textContent = movie.title;

    const movieParagraphElement = movieCard.querySelector(".card-text");
    movieParagraphElement.textContent = movie.overview;

    const movieImgElement = movieCard.querySelector(".card img");
    movieImgElement.setAttribute(
      "src",
      `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    );

    const infoButton = movieCard.querySelector("button.btn");
    infoButton.setAttribute("data-movieId", movie.id);

    movieListDiv.appendChild(movieCard);
  });
}

async function showMovieDetails(btn) {
  const movieId = btn.getAttribute("data-movieId");
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}`,
    {
      headers: {Authorization: `Bearer ${API_KEY}`},
    }
  );
  const data = await response.json();

  const modalBody = document.querySelector("#movie-modal .modal-body");
  modalBody.innerHTML = "";

  // Create row
  const row = document.createElement("div");
  row.classList.add("row");

  // Create left column
  const leftCol = document.createElement("div");
  leftCol.classList.add("col-sm-6", "col-md-4");

  // Add movie poster to left column
  const poster = document.createElement("img");
  poster.src = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
  poster.classList.add("movie-poster", "img-fluid");
  leftCol.appendChild(poster);

  // Create right column
  const rightCol = document.createElement("div");
  rightCol.classList.add("col-sm-6", "col-md-8");

  // Add movie details to right column
  const title = document.createElement("h2");
  title.textContent = data.original_title;
  rightCol.appendChild(title);

  const details = [
    {label: "Rating", value: data.vote_average},
    {label: "Runtime", value: `${data.runtime} minutes`},
    {label: "Genres", value: getGenres(data.genres)},
    {label: "Plot", value: data.overview, class: "plot-summary"},
    {label: "Cast", value: ""},
  ];

  details.forEach((detail) => {
    const detailElement = document.createElement("div");
    detailElement.textContent = `${detail.label}: ${detail.value}`;
    if (detail.class) detailElement.classList.add(detail.class);
    rightCol.appendChild(detailElement);
  });

  // Function to get genres as a comma-separated string
  function getGenres(genres) {
    return genres && Array.isArray(genres)
      ? genres.map((genre) => genre.name).join(", ")
      : "N/A";
  }

  details.forEach((detail) => {
    const detailElement = document.createElement("div");
    detailElement.textContent = `${detail.label}: ${detail.value}`;
    if (detail.class) detailElement.classList.add(detail.class);
    rightCol.appendChild(detailElement);
  });

  // Append columns to row
  row.appendChild(leftCol);
  row.appendChild(rightCol);

  // Append row to modal body
  modalBody.appendChild(row);
}
