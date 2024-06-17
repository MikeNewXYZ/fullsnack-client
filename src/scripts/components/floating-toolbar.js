// The web components browser API is used here, go to the link below to find out more:
// https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements

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
