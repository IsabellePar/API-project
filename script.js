async function countryFetch(countryName) {
  let response = await fetch(
    `https://restcountries.com/v3.1/name/${countryName}`
  );
  let data = await response.json();
  let relevant = await data.filter((element) =>
    element.name.common.toLowerCase().includes(countryName.toLowerCase())
  );
  //   console.log(relevant);

  return relevant;
}

//event listener
let formRef = document.querySelector("#searchForm");
formRef.addEventListener("submit", async (event) => {
  event.preventDefault();
  let text = event.target.searchInput.value;
  console.log(text);
  let test = await countryFetch(text);
  console.log(test);
  cardMaker(test);
});

function cardMaker(data) {
  let searchResults = document.querySelector("#searchResults");
  searchResults.innerHTML = "";
  data.forEach((element) => {
    let card = document.createElement("article");
    card.classList.add("card");

    card.innerHTML = `
  <figure>
    <img src="${element.flags ? element.flags.png : ""}" alt="Flag of ${
      element.name.common
    }">
  </figure>
  <div>
    <h3>${element.name.common}</h3>
  </div>
`;
    searchResults.appendChild(card);
  });
}
