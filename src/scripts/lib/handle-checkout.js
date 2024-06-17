const checkoutEl = document.getElementById("floating-cart-checkout");

checkoutEl.addEventListener("click", async () => {
	// Get cart data from local storage.
	// Get todays data and format it for the mysql database.
	const cart = JSON.parse(localStorage.getItem("cart"));
	const today = new Date().toJSON().slice(0, 10);

	// For each item in the cart send a POST request
	// to the backend, adding it to the orders collection.
	await cart.forEach(async (item) => {
		const body = {
			snack_id: item.id,
			order_date: today,
			quantity: item.quantity,
		};

		const response = await fetch("https://fullsnack-server-production.up.railway.app/orders", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});
	});

	// Remove everything in the local storage cart.
	localStorage.removeItem("cart");

	// Go to summary page.
	window.location = "./summary.html";
});
