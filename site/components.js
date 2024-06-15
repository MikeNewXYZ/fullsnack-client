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
			this.childEl.addEventListener("mouseout", this.reset);
		}

		// runs on component dismount
		disconnectedCallback() {
			// remove event listeners on dismount
			this.childEl.removeEventListener("mousemove", this.animate.bind(this));
			this.childEl.removeEventListener("mouseout", this.reset);
		}

		animate(e) {
			requestAnimationFrame(() => {
				const halfHeight = e.target.offsetHeight / 2;
				const halfWidth = e.target.offsetWidth / 2;
				const mouseY = e.offsetY;
				const mouseX = e.offsetX;
				const rotateY = -((mouseX - halfWidth) / halfWidth);
				const rotateX = (mouseY - halfHeight) / halfHeight;

				Object.assign(e.target.style, {
					transform: `
            rotateX(${rotateX * this.multiplier}deg)
            rotateY(${rotateY * this.multiplier}deg)
            scale(${this.hoverScale})
          `,
				});
			});
		}

		reset(e) {
			requestAnimationFrame(() => {
				Object.assign(e.target.style, {
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
