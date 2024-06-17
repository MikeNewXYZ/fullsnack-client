// The web components browser API is used here, go to the link below to find out more:
// https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements

// This custom element is a cart item on the cart page.
// It populates its self from data provided by the
// card-item-layout component wrapper.
// It also handles updating the quantity
// and removing itself.

customElements.define(
	"cart-item-list",
	class extends HTMLElement {
		constructor() {
			super();
			// Init cart and data variables.
			this.cart = {};
			this.data = {};

			// Get refrences to every element that either needs
			// to be populated with data or needs event handling.
			// Also note that for some reason the ".getElementById"
			// method is not avaliable on "this".
			this.imageEl = this.querySelector("#cart-item-image");
			this.titleEl = this.querySelector("#cart-item-title");
			this.vegetarianEl = this.querySelector("#cart-item-vegetarian");
			this.healthyEl = this.querySelector("#cart-item-healthy");
			this.removeEl = this.querySelector("#cart-item-remove");
			this.quantityEl = this.querySelector("#cart-item-quantity-input");
		}

		// Runs when component is first created.
		connectedCallback() {
			// Get the cart data from local storage and
			// get the data that has been passed down from
			// the card-item-layout component.
			this.cart = JSON.parse(localStorage.getItem("cart")) || {};
			this.data = JSON.parse(this.getAttribute("data-data")) || {};
			this.populateWithData();

			this.removeEl.addEventListener("click", this.handleRemove.bind(this));
			this.quantityEl.addEventListener("input", this.handleQuantity.bind(this));
		}

		// Populate itself with data.
		populateWithData() {
			const { healthy, image_url, snack_name, vegetarian } = this.data.productData;

			this.imageEl.src = image_url;
			this.titleEl.textContent = snack_name;
			this.vegetarianEl.textContent = vegetarian === 1 ? "i'm vegetarian" : "i'm not vegetarian";
			this.healthyEl.textContent = healthy === 1 ? "i'm healthy" : "i'm not healthy";
			this.quantityEl.value = this.data.quantity;
		}

		handleQuantity(e) {
			const quantity = parseInt(e.target.value);

			// If quantity is 0 or less than 0 then
			// it will remove itself.
			if (quantity <= 0) {
				this.handleRemove();
				return;
			}

			// Gets the cart data from local storage and
			// adjusts the quanity to the new one from
			// the input.
			this.cart = this.cart.map((data) => ({
				...data,
				quantity: this.data.id === data.id ? quantity : data.quantity,
			}));

			localStorage.setItem("cart", JSON.stringify(this.cart));
		}

		// Removes its self from the DOM
		// and the local storage cart item.
		handleRemove() {
			const removeId = this.data.id;
			this.cart = this.cart.filter(({ id }) => id !== removeId);
			localStorage.setItem("cart", JSON.stringify(this.cart));

			// Reloads the page to show updated items.
			location.reload();
		}
	},
);
