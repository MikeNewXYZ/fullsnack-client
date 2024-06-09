const main = document.querySelector("main");
let snackArray = [];

function getSnacks() {
	fetch("http://localhost:5050/snacks")
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
		const { snack_name, snack_description, image_url } = card;

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
		snackDescription.innerHTML = `${snack_description}`;
		cardDescription.appendChild(snackDescription);

		const buttons = document.createElement("div");
		buttons.classList.add("buttons");
		snackDescription.appendChild(buttons);

		const addButton = document.createElement("button");
		addButton.classList.add("add-button");
		addButton.addEventListener("click", () => {
			const prevCart = JSON.parse(window.localStorage.getItem("cart"));
			const cart = { cart: [...prevCart.cart, card] };

			window.localStorage.setItem("cart", JSON.stringify(cart));
		});

		buttons.appendChild(addButton);

		const likeButton = document.createElement("button");
		likeButton.classList.add("like-button");
		buttons.appendChild(likeButton);

		const likeIcon = document.createElement("i");
		likeIcon.classList.add("fa-solid", "fa-heart");
		likeButton.appendChild(likeIcon);

		main.appendChild(cardEl);
		return { snack_name, snack_description, image_url };

		// addButton.addEventListener("click", addToCart());
		//likeIcon.addEventListener("click", addToVotes());
	});
}
