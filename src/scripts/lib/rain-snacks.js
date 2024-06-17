// Snacks will not show in development but will do in production.
// https://fullsnack-client-production.up.railway.app/summary.html
const snacks = [
	"../../assets/candy/bluesweet.png",
	"../../assets/candy/orangesweet.png",
	"../../assets/candy/greensweet.png",
	"../../assets/candy/redsweet.png",
	"../../assets/candy/donut.png",
	"../../assets/candy/cake.png",
	"../../assets/candy/cookie.png",
	"../../assets/candy/milkshake.png",
	"../../assets/candy/icecream.png",
	"../../assets/candy/icecream2.png",
	"../../assets/candy/marshmallow.png",
];

function createSnack() {
	const img = document.createElement("img");
	img.src = snacks[Math.floor(Math.random() * snacks.length)];
	img.className = "summary-snack";
	img.style.left = `${Math.random() * window.innerWidth}px`;
	img.style.top = `-${img.height}px`;

	const rotations = [0, 30, 330];
	const rotation = rotations[Math.floor(Math.random() * rotations.length)];
	img.style.transform = `rotate(${rotation}deg)`;

	document.body.appendChild(img);
	return img;
}

function animateSnack(snack) {
	const speed = Math.random() * 0.25 + 1;
	function fall() {
		const top = parseFloat(snack.style.top);
		if (top < window.innerHeight) {
			snack.style.top = `${top + speed}px`;
			requestAnimationFrame(fall);
		} else {
			snack.remove();
		}
	}
	fall();
}

function createRain() {
	const snack = createSnack();
	animateSnack(snack);
}

setInterval(createRain, 300);
