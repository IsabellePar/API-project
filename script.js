async function countryFetch(countryName) {
  let response = await fetch(
    `https://restcountries.com/v3.1/name/${countryName}`
  );
  let data = await response.json();
  let relevant = await data.filter((element) =>
    element.name.common.toLowerCase().includes(countryName.toLowerCase())
  );
  return relevant;
}

let formRef = document.querySelector("#searchForm");
formRef.addEventListener("submit", async (event) => {
  event.preventDefault();
  let text = event.target.searchInput.value;
  let data = await countryFetch(text);
  cardMaker(data);
  event.target.searchInput.value = "";
});

function cardMaker(data) {
  let searchResults = document.querySelector("#searchResults");
  searchResults.innerHTML = "";
  data.forEach((element, index) => {
    let card = document.createElement("article");
    card.classList.add("card");
    card.id = index;

    card.innerHTML = `
  <figure>
    <img src="${element.flags ? element.flags.png : ""}" alt="Flag of ${
      element.name.common
    }">
  </figure>
  <div class="cardDescription">
    <h3>${element.name.common}</h3>
  </div>
`;
    searchResults.appendChild(card);
  });

  // Add event listeners for the cards to show modal on click
  let allCards = document.querySelectorAll(".card");
  allCards.forEach((card) => {
    card.addEventListener("click", (e) => {
      showModal(data[e.currentTarget.id]);
    });
  });
}

async function fetchAll() {
  let response = await fetch("https://restcountries.com/v3.1/all");
  let data = await response.json();

  //random numbers
  let shuffled = data.sort(function () {
    return 0.5 - Math.random();
  });
  let selected = shuffled.slice(0, 4);

  return selected;
}

async function callOnLoad() {
  let countries = await fetchAll();
  cardMaker(countries);
}

window.addEventListener("load", () => {
  callOnLoad();
  displayFavorites();
});

//#region MODAL
function showModal(countryData) {
  let modal = document.querySelector(".modal");
  let modalContent = document.querySelector("#modalContent");

  modalContent.innerHTML = `
    <figure>
      <img src="${
        countryData.flags ? countryData.flags.png : ""
      }" alt="Flag of ${countryData.name.common}">
    </figure>
    <div>
      <h3>${countryData.name.common}</h3>
      <p><strong>Capital:</strong> ${
        countryData.capital ? countryData.capital[0] : "N/A"
      }</p>
      <p><strong>Population:</strong> ${countryData.population.toLocaleString()}</p>
      <p><strong>Languages:</strong> ${
        countryData.languages
          ? Object.values(countryData.languages).join(", ")
          : "N/A"
      }</p>
    </div>
  `;

  let favoriteCountries =
    JSON.parse(localStorage.getItem("favoriteCountries")) || [];

  // Check if the country is already in favorites
  let isFavorite = favoriteCountries.some(
    (favoriteCountry) =>
      JSON.stringify(favoriteCountry) === JSON.stringify(countryData)
  );

  // Only add the favorite button if the country isn't in the list
  if (!isFavorite) {
    let favBtn = document.createElement("button");
    favBtn.classList.add("favoriteBtn");
    favBtn.textContent = "Add to favorites";
    favBtn.addEventListener("click", () => {
      favoriteCountries.push(countryData);
      localStorage.setItem(
        "favoriteCountries",
        JSON.stringify(favoriteCountries)
      );
      displayFavorites();
    });

    modalContent.appendChild(favBtn);
  }

  modal.style.display = "block";

  let span = document.querySelector(".close");
  span.addEventListener("click", () => {
    modal.style.display = "none";
    modal.style.zIndex = -1;
  });

  window.addEventListener("click", (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });
}

//#endregion

function displayFavorites() {
  let favoritesRef = document.querySelector(".favorite-content");
  favoritesRef.innerHTML = "";
  let favorites = JSON.parse(localStorage.getItem("favoriteCountries")) || [];
  favorites.forEach((country, index) => {
    favoritesRef.innerHTML += `<img id=${index} class="favorite" src=${country.flags.png}></img>`;
  });

  let allFavs = document.querySelectorAll(".favorite");
  allFavs.forEach((fav) => {
    fav.addEventListener("click", (e) => {
      showModal(favorites[e.currentTarget.id]);
    });
  });
}
