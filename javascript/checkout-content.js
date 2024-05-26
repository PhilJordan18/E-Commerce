//=================== Feature presque terminée il faut juste essayer de lier le panier à la carte principale qui affiche tous les articles ====================//
//===================Pour l'instant c'est incomplet, observer le lien go-back qui utilise le local-storage pour conserver les articles  du panier à son retour à la page principale ===========// 

document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalAmountElement = document.getElementById('total-amount');
    const discountAmountElement = document.getElementById('discount-amount');
    const tableBody = document.getElementById('table-products');
    const cartNotification = document.querySelector('.navbar-cart .icon-text');

    let cart = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    function renderCart() {
        cartItemsContainer.innerHTML = '';
        tableBody.innerHTML = '';
        let subTotal = 0;
        let taxes = 0;
        let totalAmount = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>No items in your cart</p>';
            tableBody.innerHTML = '<tr><td colspan="3">No items in your cart</td></tr>';
            updateCartNotification();
            updateTotals(0, 0, 0);
            return;
        }

        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('d-flex', 'align-items-center', 'mb-5');
            
            itemElement.innerHTML = `
                <div class="flex-shrink-0">
                    <img src="${item.image}" class="img-fluid" style="width: 150px;" alt="${item.name}">
                </div>
                <div class="flex-grow-1 ms-3">
                    <a href="#!" class="float-end text-black remove-item" data-id="${item.id}">
                        <i class="fa-solid fa-trash fa-bounce" style="color: #ff3e24;"></i>
                    </a>
                    <h5 class="text-primary">${item.name}</h5>
                    <h6 style="color: #9e9e9e;">Color: ${item.color}</h6>
                    <div class="d-flex align-items-center">
                        <p class="fw-bold mb-0 me-5 pe-3">${item.price}$</p>
                        <div class="def-number-input number-input safari_only">
                            <button class="minus" data-id="${item.id}">-</button>
                            <input class="quantity fw-bold text-black" min="0" name="quantity" value="${item.quantity}" type="number">
                            <button class="plus" data-id="${item.id}">+</button>
                        </div>
                    </div>
                </div>
            `;
            
            cartItemsContainer.appendChild(itemElement);

            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="checkout-product">
                    <div class="product-cart d-flex">
                        <div class="product-thumb">
                            <img src="${item.image}" width="30" height="30" alt="Product">
                        </div>
                        <div class="product-content media-body">
                            <h5 class="title">${item.name}</h5>
                            <ul>
                                <li>
                                    <a class="delete" href="#" data-id="${item.id}">
                                        <i class="fa-solid fa-trash fa-bounce" style="color: #ff3e24;"></i>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </td>
                <td class="checkout-quantity">
                    <div class="product-quantity d-inline-flex">
                        <button type="button" class="sub" data-id="${item.id}">
                            <i class="fa-solid fa-minus" style="color: #74C0FC;"></i>
                        </button>
                        <input type="text" value="${item.quantity}">
                        <button type="button" class="add" data-id="${item.id}">
                            <i class="fa-solid fa-plus" style="color: #B197FC;"></i>
                        </button>
                    </div>
                </td>
                <td class="checkout-price">
                    <p class="price">$${(item.price * item.quantity).toFixed(2)}</p>
                </td>
            `;
            tableBody.appendChild(row);

            subTotal += item.price * item.quantity;
        });

        taxes = subTotal * 0.14975;
        totalAmount = subTotal + taxes;

        updateTotals(subTotal, taxes, totalAmount);
        updateCartNotification();

        const deleteButtons = tableBody.querySelectorAll('.delete');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                const itemId = button.dataset.id;
                removeItem(itemId);
            });
        });

        const quantityInputs = tableBody.querySelectorAll('.product-quantity input');
        quantityInputs.forEach(input => {
            const addButton = input.nextElementSibling;
            const subButton = input.previousElementSibling;

            addButton.addEventListener('click', () => {
                const itemId = addButton.dataset.id;
                updateQuantity(itemId, 1);
            });

            subButton.addEventListener('click', () => {
                const itemId = subButton.dataset.id;
                updateQuantity(itemId, -1);
            });
        });
    }

    function updateCartNotification() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartNotification.textContent = totalItems;
    }

    function updateTotals(subTotal, taxes, totalAmount) {
        discountAmountElement.textContent = `${subTotal.toFixed(2)}$`;
        totalAmountElement.textContent = `${totalAmount.toFixed(2)}$`;
    }

    function removeItem(itemId) {
        cart = cart.filter(item => item.id !== itemId);
        localStorage.setItem('cartItems', JSON.stringify(cart));
        renderCart();
    }

    function updateQuantity(itemId, delta) {
        const item = cart.find(i => i.id === itemId);
        if (item) {
            item.quantity = Math.max(item.quantity + delta, 0);
            if (item.quantity === 0) {
                removeItem(itemId);
            } else {
                localStorage.setItem('cartItems', JSON.stringify(cart));
                renderCart();
            }
        }
    }

    renderCart();
});