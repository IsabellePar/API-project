console.log("Hello, World!");

async function countryFetch(countryName) {
  let response = await fetch(
    `https://restcountries.com/v3.1/name/${countryName}`
  );
  let data = await response.json();
  let relevant = {
    country: data[0].name.common,
  };

  return data;
}

async function logCountryData(str) {
  try {
    let data = await countryFetch(str);

    data.forEach((element) => {
      if (element.name.common.toLowerCase().includes(str.toLowerCase())) {
        console.log(element.name.common);
      }
    });
  } catch (error) {
    console.error(error);
  }
}

logCountryData("den");
