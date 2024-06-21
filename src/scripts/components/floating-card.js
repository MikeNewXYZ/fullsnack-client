// The web components browser API is used here, go to the link below to find out more:
// https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements

customElements.define(
	"floating-card",
	class extends HTMLElement {
		constructor() {
			super();

			// Get the first child element.
			this.childEl = this.children[0];

			// Read attributes or set default values.
			this.multiplier = this.getAttribute("multiplier") || 20;
			this.perspective = this.getAttribute("perspective") || "1000px";
			this.transitionDuration = this.getAttribute("transitionDuration") || "0.2s";
			this.hoverScale = this.getAttribute("hoverScale") || "1.05";
			this.dimensions = { top: 0, left: 0, halfHeight: 0, halfWidth: 0 };

			// Bind methods to "this" context.
			this.animate = this.animate.bind(this);
			this.reset = this.reset.bind(this);
			this.updateDimensions = this.updateDimensions.bind(this);
		}

		connectedCallback() {
			// Initialize dimensions.
			this.updateDimensions();

			// Set styles for the parent and child elements.
			Object.assign(this.style, {
				display: "block",
				perspective: this.perspective,
				transformStyle: "preserve-3d",
			});
			Object.assign(this.childEl.style, {
				transition: `transform ${this.transitionDuration}`,
			});

			// Set up event listeners.
			this.childEl.addEventListener("mousemove", this.animate);
			this.childEl.addEventListener("mouseout", this.reset);
			window.addEventListener("resize", this.updateDimensions);
			window.addEventListener("scroll", this.updateDimensions);
		}

		disconnectedCallback() {
			// Remove event listeners.
			this.childEl.removeEventListener("mousemove", this.animate);
			this.childEl.removeEventListener("mouseout", this.reset);
			window.removeEventListener("resize", this.updateDimensions);
			window.removeEventListener("scroll", this.updateDimensions);
		}

		// Get the dimensions of the child element.
		updateDimensions() {
			const { top, left, height, width } = this.childEl.getBoundingClientRect();
			this.dimensions = {
				top,
				left,
				halfHeight: height / 2,
				halfWidth: width / 2,
			};
		}

		// Animate the child element based on mouse position.
		animate(e) {
			requestAnimationFrame(() => {
				const { top, left, halfHeight, halfWidth, scrollY } = this.dimensions;
				const mouseY = e.clientY - top;
				const mouseX = e.clientX - left;
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

		// Reset transform styles to initial state.
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
