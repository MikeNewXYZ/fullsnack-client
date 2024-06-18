// Get elements.
const cartItemsWrapperEl = document.getElementById("cart-items-wrapper");
const cartItemTemplate = cartItemsWrapperEl.querySelector("template");

// Get data from local storage.
let cart = JSON.parse(localStorage.getItem("cart"));

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
