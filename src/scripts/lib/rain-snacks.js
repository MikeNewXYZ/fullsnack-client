const snacks = [
	"../../src/assets/candy/bluesweet.png",
	"../../src/assets/candy/orangesweet.png",
	"../../src/assets/candy/greensweet.png",
	"../../src/assets/candy/redsweet.png",
	"../../src/assets/candy/donut.png",
	"../../src/assets/candy/cake.png",
	"../../src/assets/candy/cookie.png",
	"../../src/assets/candy/milkshake.png",
	"../../src/assets/candy/icecream.png",
	"../../src/assets/candy/icecream2.png",
	"../../src/assets/candy/marshmallow.png",
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
