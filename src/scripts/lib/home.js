// TODO setup like button

// Get elements.
const cardsWrapperEl = document.getElementById("cards-wrapper");
const searchEl = document.getElementById("floating-toolbar-search");
const cardTemplate = cardsWrapperEl.querySelector("template");

// Set variables.
let allSnacks = [];

// Create event listeners.
searchEl.addEventListener("input", handleSearch);

async function renderCards() {
	const snacks = await fetchSnacks();

	allSnacks = snacks.map((snack) => {
		const { snack_name, price, snack_description, image_url } = snack;
		const cardClone = cardTemplate.content.cloneNode(true);

		// Get card clone elements.
		const titleEl = cardClone.getElementById("card-title");
		const priceEl = cardClone.getElementById("card-price");
		const descriptionEl = cardClone.getElementById("card-description");
		const imageEl = cardClone.getElementById("card-image");
		const addButtonEl = cardClone.getElementById("card-button-add");
		const likeButtonEl = cardClone.getElementById("card-button-like");

		// Set snack data to element.
		titleEl.textContent = snack_name;
		priceEl.textContent = `£${price}`;
		descriptionEl.textContent = snack_description;
		imageEl.src = image_url;

		// Create event listeners.
		addButtonEl.addEventListener("click", () => handleAddButton(snack));

		// Create reference to cardClone.
		// When card clones is appended to card wrapper
		// the card clone will be inaccessible so
		// a reference needs to be created.
		const cardRef = cardClone.children[0];

		// Append to wrapper.
		cardsWrapperEl.appendChild(cardClone);

		return {
			snack: snack,
			element: cardRef,
		};
	});
}
renderCards();

// Fetch snack data.
async function fetchSnacks() {
	const response = await fetch("https://fullsnack-server-production.up.railway.app/snacks");
	const data = await response.json();

	return data;
}

function handleAddButton(snack) {
	let cart = JSON.parse(localStorage.getItem("cart")) || [];

	// If item is already in cart.
	if (cart?.find((item) => item.id === snack.snack_id)) {
		// Find existing item and update quantity.
		cart = cart.map((item) => {
			if (item.id !== snack.snack_id) return item;

			return {
				id: item.id,
				quantity: item.quantity + 1,
				productData: snack,
			};
		});
	} else {
		// Add new item to cart.
		cart.push({
			id: snack.snack_id,
			quantity: 1,
			productData: snack,
		});
	}

	// Set new cart to local storage.
	localStorage.setItem("cart", JSON.stringify(cart));
}

function handleSearch(e) {
	const search = e.target.value;

	allSnacks.forEach(({ snack, element }) => {
		const isMatch = snack.snack_name.toLowerCase().includes(search);

		element.classList.toggle("utility-hide", !isMatch);
	});
}
