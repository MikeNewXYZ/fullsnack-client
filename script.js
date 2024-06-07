// add votes function
// search function


function showSnacks(data) {
  main.innerHTML = "";

  snackArray = data.map((card) => {
    const { name, image, description } = card;

    const cardImage = document.createElement("img");
    cardImage.src = image;
    cardImage.alt = name;

    cardEl.appendChild(cardImage);

    const cardDescription = document.createElement("div");
    cardDescription.classList.add("card-description");
    cardEl.appendChild(cardDescription);

    const snackName = document.createElement("h1");
    snackName.classList.add("snack-name");
    cardDescription.appendChild("snackName");

    const snackDescription = document.createElement("p");
    snackDescription.classList.add("snack-description");
    cardDescription.appendChild("snackDescription");

    const addButton = document.createElement("button");
    addButton.classList.add("add-button");
    cardDescription.appendChild(addButton);

    addButton.addEventListener("click", addToCart());
  });
}

function getSnacks() {
  fetch("")
    .then((res) => res.json())
    .then((data) => {
      showSnacks(data);
    });
}

const main = document.querySelector(main);
const cardEl = document.querySelector(".card");
