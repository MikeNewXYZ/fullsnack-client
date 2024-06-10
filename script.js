const main = document.querySelector("main");
const searchInput = document.getElementById("search");
let snackArray = [];

function getSnacks() {
  fetch("https://fullsnack-server-production.up.railway.app/snacks")
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      showSnacks(data);
    });
}

getSnacks();

// add votes function
// search function

function showSnacks(data) {
  main.innerHTML = "";
  snackArray = data.map((card) => {
    const { snack_name, snack_description, price, image_url } = card;

    const cardEl = document.createElement("div");
    cardEl.classList.add("card");

    const cardImage = document.createElement("img");
    cardImage.src = image_url;

    cardEl.appendChild(cardImage);

    const cardDescription = document.createElement("div");
    cardDescription.classList.add("card-description");
    cardEl.appendChild(cardDescription);

    const snackName = document.createElement("h1");
    snackName.classList.add("snack-name");
    snackName.innerHTML = `${snack_name}`;
    cardDescription.appendChild(snackName);

    const snackDescription = document.createElement("p");
    snackDescription.classList.add("snack-description");
    snackDescription.innerHTML = `"${snack_description}"`;
    cardDescription.appendChild(snackDescription);

    const buyersInformation = document.createElement("div");
    buyersInformation.classList.add("info-to-buy");
    cardDescription.appendChild(buyersInformation);

    const priceInfo = document.createElement("div");
    priceInfo.classList.add("price");
    priceInfo.innerHTML = `£${price}`;
    buyersInformation.appendChild(priceInfo);

    const buttons = document.createElement("div");
    buttons.classList.add("buttons");
    buyersInformation.appendChild(buttons);

    const addButton = document.createElement("button");
    addButton.classList.add("add-button");
    addButton.innerHTML = `Add to cart`;
    buttons.appendChild(addButton);

    const likeButton = document.createElement("button");
    likeButton.classList.add("like-button");
    buttons.appendChild(likeButton);

    const likeIcon = document.createElement("i");
    likeIcon.classList.add("fa-solid", "fa-heart");
    likeButton.appendChild(likeIcon);

    main.appendChild(cardEl);
    return { element: cardEl, snack_name, snack_description, image_url };
  });
}
searchInput.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();
  snackArray.forEach((card) => {
    const isVisible = card.snack_name.toLowerCase().includes(value);
    card.element.classList.toggle("hide", !isVisible);
  });
});
