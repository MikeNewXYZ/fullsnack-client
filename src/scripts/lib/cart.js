// Get elements.
const cartItemsWrapperEl = document.getElementById("cart-items-wrapper");
const checkoutEl = document.getElementById("floating-cart-checkout");
const cartItemTemplate = cartItemsWrapperEl.querySelector("template");

// Get data from local storage.
let cart = JSON.parse(localStorage.getItem("cart"));

// Create event listeners.
checkoutEl.addEventListener("click", handleCheckoutButton);

// Renders all cart items.
function renderCartItems() {
	cartItemsWrapperEl.innerHTML = "";

	cart.forEach((item) => {
		// Get product data.
		const { healthy, image_url, snack_name, price, vegetarian } = item.productData;

		// Create card clone.
		const cartItemClone = cartItemTemplate.content.cloneNode(true);

		// Get elements from cart item clone.
		const imageEl = cartItemClone.getElementById("cart-item-image");
		const titleEl = cartItemClone.getElementById("cart-item-title");
		const priceEl = cartItemClone.getElementById("cart-item-price");
		const vegetarianEl = cartItemClone.getElementById("cart-item-vegetarian");
		const healthyEl = cartItemClone.getElementById("cart-item-healthy");
		const removeEl = cartItemClone.getElementById("cart-item-remove");
		const quantityEl = cartItemClone.getElementById("cart-item-quantity-input");

		// Set product data to item.
		imageEl.src = image_url;
		titleEl.textContent = snack_name;
		priceEl.textContent = `£${price * item.quantity}`;
		vegetarianEl.textContent = vegetarian === 1 ? "- vegetarian" : "- not vegetarian";
		healthyEl.textContent = healthy === 1 ? "- healthy" : "- not healthy";
		quantityEl.value = item.quantity;

		// Init event listeners.
		removeEl.addEventListener("click", () => handleRemoveItem(item.id));
		quantityEl.addEventListener("input", (e) => handleQuantityInput(e, item, priceEl));

		cartItemsWrapperEl.appendChild(cartItemClone);
	});
}
renderCartItems();

// Removes cart item by id.
function handleRemoveItem(removeId) {
	cart = cart.filter(({ id }) => id !== removeId);
	localStorage.setItem("cart", JSON.stringify(cart));

	// Rerender cart items.
	renderCartItems();
}

// Update cart item quantity.
function handleQuantityInput(e, item, priceEl) {
	const quantity = parseInt(e.target.value);

	// Remove if quantity is equal or less than 0.
	if (quantity <= 0) {
		handleRemoveItem(item.id);
		return;
	}

	// Update total item price.
	priceEl.textContent = `£${item.productData.price * quantity}`;

	// Update new quantity on cart variable.
	cart = cart.map((data) => ({
		...data,
		quantity: item.id === data.id ? quantity : data.quantity,
	}));

	// Set new cart to local storage.
	localStorage.setItem("cart", JSON.stringify(cart));
}

async function handleCheckoutButton() {
	// Get cart data from local storage.
	// Get todays data and format it for the mysql database.
	const cart = JSON.parse(localStorage.getItem("cart"));
	const today = new Date().toJSON().slice(0, 10);

	// For each item in the cart send a POST request
	// to the backend, adding it to the orders collection.
	await cart.forEach(async (item) => {
		const body = {
			snack_id: item.id,
			order_date: today,
			quantity: item.quantity,
		};

		const response = await fetch("https://fullsnack-server-production.up.railway.app/orders", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});

		console.log(response);
	});

	// Remove everything in the local storage cart.
	localStorage.removeItem("cart");

	// Go to summary page.
	window.location = "./summary.html";
}
