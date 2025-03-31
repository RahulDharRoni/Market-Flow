const coinBtn = document.getElementById("coinBtn");
const coinCards = document.getElementById("coinCards");
const coinDetails = document.getElementById("coinDetails");
const filterInput = document.getElementById("filterInput");
const priceRange = document.getElementById("priceRange");
const optionFilter = document.getElementById("optionFilter");
let allCoins = [];

coinBtn.addEventListener("click", () => {
  coinCards.style.display = "grid";
  fetchCoinData();
});

async function fetchCoinData() {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets",
      {
        params: {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: 50,
          page: 1,
          sparkline: false,
        },
      }
    );

    allCoins = response.data;
    filterAndDisplayCoins();

    filterInput.addEventListener("input", filterAndDisplayCoins);
    priceRange.addEventListener("input", filterAndDisplayCoins);
    optionFilter.addEventListener("change", filterAndDisplayCoins);
  } catch (error) {
    console.error("Error fetching coin data:", error);
  }
}

function filterAndDisplayCoins() {
  let filteredCoins = allCoins;

  const searchTerm = filterInput.value.toLowerCase();
  const maxPrice = parseInt(priceRange.value);
  const selectedOption = optionFilter.value;

  if (searchTerm) {
    filteredCoins = filteredCoins.filter((coin) =>
      coin.name.toLowerCase().includes(searchTerm)
    );
  }

  if (selectedOption) {
    filteredCoins = filteredCoins.filter((coin) => {
      if (selectedOption === "high") return coin.market_cap > 1000000000;
      if (selectedOption === "medium")
        return coin.market_cap > 100000000 && coin.market_cap <= 1000000000;
      if (selectedOption === "low") return coin.market_cap <= 100000000;
    });
  }

  filteredCoins = filteredCoins.filter(
    (coin) => coin.current_price <= maxPrice
  );
  displayCoins(filteredCoins);
}

function displayCoins(coins) {
  coinCards.innerHTML = "";

  coins.forEach((coin) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
                    <img src="${coin.image}" alt="${coin.name}" width="100">
                    <h3>${coin.name}</h3>
                    <p>Current Price: $${coin.current_price}</p>
                    <p>Market Cap: $${coin.market_cap.toLocaleString()}</p>
                    <button onclick="fetchCoinDetails('${
                      coin.id
                    }')">Read More</button>
                `;
    coinCards.appendChild(card);
  });
}

async function fetchCoinDetails(id) {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${id}`
    );
    const coin = response.data;

    coinDetails.innerHTML = `
                    <h2>${coin.name} Details</h2>
                    <img src="${coin.image.large}" alt="${
      coin.name
    }" width="150">
                    <p><strong>Symbol:</strong> ${coin.symbol.toUpperCase()}</p>
                    <p><strong>Market Cap Rank:</strong> ${
                      coin.market_cap_rank
                    }</p>
                    <p><strong>Description:</strong> ${coin.description.en.slice(
                      0,
                      300
                    )}...</p>
                    <button onclick="coinDetails.style.display = 'none'; coinCards.style.display = 'grid';">Close</button>
                `;

    coinDetails.style.display = "block";
    coinCards.style.display = "none";
  } catch (error) {
    console.error("Error fetching coin details:", error);
  }
}
