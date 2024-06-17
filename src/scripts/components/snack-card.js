// The web components browser API is used here, go to the link below to find out more:
// https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements

// This custom element is a card item on the home page.
// It populates its self from data provided by the
// card-layout-wrapper component wrapper.
// It also handles adding itself to cart
// and updating its own quantity.

customElements.define(
	"snack-card",
	class extends HTMLElement {
		constructor() {
			super();
			// Get data passed down from card-layout-wrapper.
			this.data = JSON.parse(this.getAttribute("data-data")) || {};

			// Get refrences to every element that either needs
			// to be populated with data or needs event handling.
			// Also note that for some reason the ".getElementById"
			// method is not avaliable on "this".
			this.titleEl = this.querySelector("#card-title");
			this.priceEl = this.querySelector("#card-price");
			this.descriptionEl = this.querySelector("#card-description");
			this.imageEl = this.querySelector("#card-image");
			this.addButtonEl = this.querySelector("#card-button-add");
			this.likeButtonEl = this.querySelector("#card-button-like");
		}

		// Runs when component is first created.
		connectedCallback() {
			this.setData();

			this.addButtonEl.addEventListener("click", this.handleAddButton.bind(this));
			this.likeButtonEl.addEventListener("click", this.handleLikeButton.bind(this));
		}

		// Populate itself with data.
		setData() {
			const { snack_name, price, snack_description, image_url } = this.data;

			this.titleEl.textContent = snack_name;
			this.priceEl.textContent = `£${price}`;
			this.descriptionEl.textContent = snack_description;
			this.imageEl.src = image_url;
		}

		// When add button is clicked, then either
		// add a new item to the cart or update
		// an existing items quantity by 1.
		handleAddButton() {
			const cartDataRaw = window.localStorage.getItem("cart");
			const cartData = JSON.parse(cartDataRaw);
			let newCart = cartData ? [...cartData] : [];

			if (cartData?.find(({ id }) => id === this.data.snack_id)) {
				// Update existing items quantity by 1.
				newCart = newCart.map((data) => {
					if (data.id === this.data.snack_id) {
						return {
							id: data.id,
							quantity: data.quantity + 1,
							productData: this.data,
						};
					}
					return data;
				});
			} else {
				// Add new item to cart.
				newCart.push({
					id: this.data.snack_id,
					quantity: 1,
					productData: this.data,
				});
			}

			// Add a new cart item to local storage.
			window.localStorage.setItem("cart", JSON.stringify(newCart));
		}

		// TODO make like button work.
		handleLikeButton() {
			console.log("not done yet");
		}
	},
);
