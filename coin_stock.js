const coinBtn = document.getElementById("coinBtn");
const stockBtn = document.getElementById("stockBtn");
const coinCards = document.getElementById("coinCards");
const stockCard = document.getElementById("stockCard");
const coinDetails = document.getElementById("coinDetails");

coinBtn.addEventListener("click", () => {
  coinCards.style.display = "grid";
  stockCard.style.display = "none";
  coinDetails.style.display = "none";
  fetchCoinData();
});

stockBtn.addEventListener("click", () => {
  stockCard.style.display = "block";
  coinCards.style.display = "none";
  coinDetails.style.display = "none";
});

async function fetchCoinData() {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets",
      {
        params: {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: 16,
          page: 1,
          sparkline: false,
        },
      }
    );

    const coins = response.data;
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
  } catch (error) {
    console.error("Error fetching coin data:", error);
  }
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
                    <button onclick="coinDetails.style.display = 'none'">Close</button>
                `;

    coinDetails.style.display = "block";
    coinCards.style.display = "none";
  } catch (error) {
    console.error("Error fetching coin details:", error);
  }
}
