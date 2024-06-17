// The web components browser API is used here, go to the link below to find out more:
// https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements

// This custom elements wrappes the snack-card elements
// on the home page. It gets the data from the backend
// and then creates a snack-card element for each item
// fetched from the snacks API.

customElements.define(
	"card-layout-wrapper",
	class extends HTMLElement {
		// Runs "attributeChangedCallback" everytime
		// the "search" attributes value is modified.
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

		// Gets the new value in the search attribute
		// and then populates the snack cards again.
		attributeChangedCallback(name, oldValue, newValue) {
			this.search = newValue;
			this.populateWithCards();
		}

		// Fetches snack data from API.
		async fetchData() {
			const response = await fetch("https://fullsnack-server-production.up.railway.app/snacks");
			const data = await response.json();

			return data;
		}

		// Creates a new card for each item in the this.cards variable.
		populateWithCards() {
			this.innerHTML = "";

			this.cards.forEach((data) => {
				// Clone the card template.
				const cardClone = this.cardTemplate.content.cloneNode(true);
				const containerEl = cardClone.getElementById("card");

				// Give each snack-card a copy of its data.
				containerEl.dataset.data = JSON.stringify(data);

				// If snack name does not include value from the search
				// attribute then return (dont render the card on the page).
				if (!data.snack_name.toLowerCase().includes(this.search.toLowerCase())) return;

				this.append(cardClone);
			});
		}
	},
);
