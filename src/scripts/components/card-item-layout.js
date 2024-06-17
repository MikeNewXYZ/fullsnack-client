// The web components browser API is used here, go to the link below to find out more:
// https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements

// This custom element is a wrapper for card-item-list.
// It gets the card-item-list template, then gets the
// cart data from local storage and the creates a
// card-item-list element for every item in cart data.

customElements.define(
	"cart-item-layout",
	class extends HTMLElement {
		constructor() {
			super();

			// Get template and wrapper element.
			this.itemTemplate = this.querySelector("template");
			this.listWrapperEl = this.querySelector("#cart-item-list-wrapper");

			// Init cart variable.
			this.cart = {};
		}

		// Runs when component first loads.
		connectedCallback() {
			// Set cart variable to the cart data from local storage.
			this.cart = JSON.parse(localStorage.getItem("cart")) || {};
			this.populateWithItems();
		}

		// Populate the list wrapper with card-item-list template.
		populateWithItems() {
			this.listWrapperEl.innerHTML = "";

			this.cart.forEach((data) => {
				// Clone template.
				const itemClone = this.itemTemplate.content.cloneNode(true);
				const containerEl = itemClone.getElementById("card-item-list");

				// Give each card-item-list a copy of its data.
				containerEl.dataset.data = JSON.stringify(data);

				// Append the clone to list wrapper.
				this.listWrapperEl.appendChild(itemClone);
			});
		}
	},
);
