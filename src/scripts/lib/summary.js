//Warning, this is based on a project I did long ago with PHP, jI ust converted the variables for JS.
//Please let me know if there are any incorrect terminologies/variables, thank you!
document.addEventListener("DOMContentLoaded", () => {
	const basket = JSON.parse(localStorage.getItem("basket")) || {};

	function updateBasketDisplay() {
		fetch("http://localhost:3000/orders")
			.then((response) => response.json())
			.then((data) => {
				const tbody = document.querySelector("tbody");
				tbody.innerHTML = "";
				let subtotal = 0;

				if (data.snacks.length === 0) {
					tbody.innerHTML =
						'<tr><td colspan="5" style="text-align:center;">There are no snacks in your basket.</td></tr>';
				} else {
					data.snacks.forEach((snacks) => {
						const total = snacks.price * basket[snacks.snack_id];
						subtotal += total;
						tbody.innerHTML += `
                                  <tr>
                                      <td class="image">
                                          <a href="index.html?page=product&id=${snacks.snack_id}">
                                              <img src="images/${snacks.image_url}" width="50" height="50" alt="${snacks.snack_name}">
                                          </a>
                                      </td>
                                      <td>
                                          <a href="index.html?page=product&id=${snacks.snack_id}">${snacks.snack_name}</a>
                                          <br>
                                          <a href="#" class="remove" data-id="${snacks.snack_id}">Remove</a>
                                      </td>
                                      <td class="price">£${snacks.price}</td>
                                      <td class="quantity">
                                          <input type="number" name="quantity-${snacks.snack_id}" value="${basket[snacks.snack_id]}" min="1" max="${snacks.quantity}" placeholder="Quantity" required>
                                      </td>
                                      <td class="price">£${total}</td>
                                  </tr>
                              `;
					});
				}
				document.querySelector(".subtotal .price").innerText = `£${subtotal.toFixed(2)}`;
			});
	}

	function saveBasket() {
		localStorage.setItem("basket", JSON.stringify(basket));
	}

	document.querySelector("tbody").addEventListener("change", (event) => {
		if (event.target.name.startsWith("quantity-")) {
			const id = event.target.name.replace("quantity-", "");
			basket[id] = parseInt(event.target.value);
			saveBasket();
			updateBasketDisplay();
		}
	});

	document.querySelector("tbody").addEventListener("click", (event) => {
		if (event.target.classList.contains("remove")) {
			event.preventDefault();
			const id = event.target.getAttribute("data-id");
			delete basket[id];
			saveBasket();
			updateBasketDisplay();
		}
	});

	document.querySelector("form").addEventListener("submit", (event) => {
		event.preventDefault();
		if (event.submitter.name === "placeorder") {
			fetch("http://localhost:3000/order_id", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(basket),
			}).then(() => {
				localStorage.removeItem("basket");
				window.location.href = "index.html?page=placeorder"; //Random link, will update once we get the stuff in order.
			});
		} else {
			updateBasketDisplay();
		}
	});

	updateBasketDisplay();
});
