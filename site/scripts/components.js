// FLOATING CARD
customElements.define(
	"floating-card",
	class extends HTMLElement {
		constructor() {
			super();
			this.childEl = this.children[0];
			this.multiplier = this.getAttribute("multiplier") || 20;
			this.perspective = this.getAttribute("perspective") || "1000px";
			this.transitionDuration = this.getAttribute("transitionDuration") || "0.2s";
			this.hoverScale = this.getAttribute("hoverScale") || "1.05";
		}

		// runs on component mount
		connectedCallback() {
			// set styles for elements
			Object.assign(this.style, {
				display: "block",
				perspective: this.perspective,
				transformStyle: "preserve-3d",
			});
			Object.assign(this.childEl.style, {
				transition: `transform ${this.transitionDuration}`,
			});

			// setup event listenters
			this.childEl.addEventListener("mousemove", this.animate.bind(this));
			this.childEl.addEventListener("mouseout", this.reset.bind(this));
		}

		// runs on component dismount
		disconnectedCallback() {
			// remove event listeners on dismount
			this.childEl.removeEventListener("mousemove", this.animate.bind(this));
			this.childEl.removeEventListener("mouseout", this.reset);
		}

		animate(e) {
			requestAnimationFrame(() => {
				const halfHeight = this.childEl.offsetHeight / 2;
				const halfWidth = this.childEl.offsetWidth / 2;
				const mouseY = e.offsetY;
				const mouseX = e.offsetX;
				const rotateY = -((mouseX - halfWidth) / halfWidth);
				const rotateX = (mouseY - halfHeight) / halfHeight;

				Object.assign(this.childEl.style, {
					transform: `
            rotateX(${rotateX * this.multiplier}deg)
            rotateY(${rotateY * this.multiplier}deg)
            scale(${this.hoverScale})
          `,
				});
			});
		}

		reset() {
			requestAnimationFrame(() => {
				Object.assign(this.childEl.style, {
					transform: `
            rotateX(0deg)
            rotateY(0deg)
            scale(1)
          `,
				});
			});
		}
	},
);

// CARD LAYOUT WRAPPER
customElements.define(
	"card-layout-wrapper",
	class extends HTMLElement {
		static observedAttributes = ["search"];

		constructor() {
			super();
			this.cardTemplate = this.querySelector("template");
			this.cards = [];
			this.search = "";
		}

		async connectedCallback() {
			this.cards = await this.fetchData();
			this.populateWithCards();
		}

		attributeChangedCallback(name, oldValue, newValue) {
			this.search = newValue;
			this.populateWithCards();
		}

		async fetchData() {
			const response = await fetch("https://fullsnack-server-production.up.railway.app/snacks");
			const data = await response.json();

			return data;
		}

		populateWithCards() {
			this.innerHTML = "";

			this.cards.forEach((data) => {
				const cardClone = this.cardTemplate.content.cloneNode(true);
				const containerEl = cardClone.getElementById("card");
				containerEl.dataset.data = JSON.stringify(data);

				if (!data.snack_name.toLowerCase().includes(this.search.toLowerCase())) return;

				this.append(cardClone);
			});
		}
	},
);

// SNACK CARD
customElements.define(
	"snack-card",
	class extends HTMLElement {
		constructor() {
			super();
			this.data = JSON.parse(this.getAttribute("data-data")) || {};
			this.titleEl = this.querySelector("#card-title");
			this.priceEl = this.querySelector("#card-price");
			this.descriptionEl = this.querySelector("#card-description");
			this.imageEl = this.querySelector("#card-image");
			this.addButtonEl = this.querySelector("#card-button-add");
			this.likeButtonEl = this.querySelector("#card-button-like");
		}

		connectedCallback() {
			this.setData();

			this.addButtonEl.addEventListener("click", this.handleAddButton.bind(this));
			this.likeButtonEl.addEventListener("click", this.handleLikeButton.bind(this));
		}

		setData() {
			const { snack_name, price, snack_description, image_url } = this.data;

			this.titleEl.textContent = snack_name;
			this.priceEl.textContent = `£${price}`;
			this.descriptionEl.textContent = snack_description;
			this.imageEl.src = image_url;
		}

		handleAddButton() {
			const cartDataRaw = window.localStorage.getItem("cart");
			const cartData = JSON.parse(cartDataRaw);
			let newCart = cartData ? [...cartData] : [];

			if (cartData?.find(({ id }) => id === this.data.snack_id)) {
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
				newCart.push({
					id: this.data.snack_id,
					quantity: 1,
					productData: this.data,
				});
			}

			window.localStorage.setItem("cart", JSON.stringify(newCart));
		}

		handleLikeButton() {
			console.log("not done yet");
		}
	},
);

// FLOATING TOOLBAR
customElements.define(
	"floating-toolbar",
	class extends HTMLElement {
		constructor() {
			super();
			this.cardLayoutWrapperEl = document.querySelector("card-layout-wrapper");
			this.searchEl = this.querySelector("#floating-toolbar-search");
		}

		connectedCallback() {
			this.searchEl.addEventListener("input", this.handleSearch.bind(this));
		}

		handleSearch(e) {
			this.cardLayoutWrapperEl.setAttribute("search", e.target.value);
		}
	},
);

// CART ITEM LAYOUT
customElements.define(
	"cart-item-layout",
	class extends HTMLElement {
		constructor() {
			super();
			this.itemTemplate = this.querySelector("template");
			this.listWrapperEl = this.querySelector("#cart-item-list-wrapper");
			this.cart = {};
		}

		connectedCallback() {
			this.cart = JSON.parse(localStorage.getItem("cart")) || {};
			this.populateWithItems();
		}

		populateWithItems() {
			this.listWrapperEl.innerHTML = "";

			this.cart.forEach((data) => {
				const itemClone = this.itemTemplate.content.cloneNode(true);
				const containerEl = itemClone.getElementById("card-item-list");
				containerEl.dataset.data = JSON.stringify(data);

				this.listWrapperEl.appendChild(itemClone);
			});
		}
	},
);

// CART ITEM LIST
customElements.define(
	"cart-item-list",
	class extends HTMLElement {
		constructor() {
			super();
			this.cart = {};
			this.data = {};
			this.imageEl = this.querySelector("#cart-item-image");
			this.titleEl = this.querySelector("#cart-item-title");
			this.vegetarianEl = this.querySelector("#cart-item-vegetarian");
			this.healthyEl = this.querySelector("#cart-item-healthy");
			this.removeEl = this.querySelector("#cart-item-remove");
			this.quantityEl = this.querySelector("#cart-item-quantity-input");
		}

		connectedCallback() {
			this.cart = JSON.parse(localStorage.getItem("cart")) || {};
			this.data = JSON.parse(this.getAttribute("data-data")) || {};
			this.populateWithData();

			this.removeEl.addEventListener("click", this.handleRemove.bind(this));
			this.quantityEl.addEventListener("input", this.handleQuantity.bind(this));
		}

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

			if (quantity <= 0) {
				this.handleRemove();
				return;
			}

			this.cart = this.cart.map((data) => ({
				...data,
				quantity: this.data.id === data.id ? quantity : data.quantity,
			}));

			localStorage.setItem("cart", JSON.stringify(this.cart));
		}

		handleRemove() {
			const removeId = this.data.id;
			this.cart = this.cart.filter(({ id }) => id !== removeId);
			localStorage.setItem("cart", JSON.stringify(this.cart));

			location.reload();
		}
	},
);
