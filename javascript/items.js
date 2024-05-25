document.addEventListener('DOMContentLoaded', function () {
  const cardContainer = document.getElementById('cardContainer');

  fetch('./items.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur HTTP ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      data.forEach(item => {
        const colDiv = document.createElement('div');
        colDiv.classList.add('col-md-4', 'col-sm-6', 'mb-4');

        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card', 'border-secondary', 'h-100', 'd-flex', 'flex-column');

        const cardLink = document.createElement('a');
        cardLink.classList.add('text-decoration-none');
        cardLink.setAttribute('href', item.lien);

        const positionDiv = document.createElement('div');
        positionDiv.classList.add('position-relative');

        const badgeSpan = document.createElement('span');
        badgeSpan.classList.add('badge', 'badge-red', 'position-absolute', 'top-0', 'start-0', 'm-2', 'p-2');
        badgeSpan.textContent = item.rabais ? `Rabais ${item.rabais * 100}%` : '';

        const heartIcon = document.createElement('i');
        heartIcon.classList.add('fa-solid', 'fa-heart', 'position-absolute', 'top-0', 'end-0', 'm-2', 'p-2', 'text-danger');

        const img = document.createElement('img');
        img.classList.add('card-img-top', 'fixed-size-img');
        img.setAttribute('src', item.images);
        img.setAttribute('alt', item.nom);

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body', 'text-center', 'd-flex', 'flex-column', 'flex-grow-1');

        const titleH5 = document.createElement('h5');
        titleH5.classList.add('card-title', 'item-title');
        titleH5.textContent = item.nom;

        const subtitleH6 = document.createElement('h6');
        subtitleH6.classList.add('card-subtitle', 'mb-2', 'item-info');
        subtitleH6.textContent = `${item.prix.toFixed(2)} $`;

        const cardFooter = document.createElement('div');
        cardFooter.classList.add('card-footer', 'text-center', 'd-flex', 'flex-column');

        const addToCartButton = document.createElement('button');
        addToCartButton.classList.add('btn', 'btn-outline-secondary', 'btn-block', 'mb-2', 'add-to-cart');
        addToCartButton.textContent = 'ADD TO CART';
        addToCartButton.dataset.productName = item.nom;
        addToCartButton.dataset.productPrice = item.prix;
        addToCartButton.dataset.productImage = item.images;
        addToCartButton.dataset.productSize = item.taille || '';

        // Ajout de l'écouteur d'événement ici
        addToCartButton.addEventListener('click', () => {
          const itemToAdd = {
            nom: addToCartButton.dataset.productName,
            images: addToCartButton.dataset.productImage,
            prix: parseFloat(addToCartButton.dataset.productPrice),
            taille: addToCartButton.dataset.productSize,
            rabais: parseFloat(addToCartButton.dataset.productDiscount) || 0
          };
          addToCart(itemToAdd);
        });

        const seeMoreLink = document.createElement('a');
        seeMoreLink.classList.add('btn', 'btn-outline-secondary', 'btn-block');
        seeMoreLink.textContent = 'SEE MORE';

        // Construction de la structure de la carte
        cardContainer.appendChild(colDiv);
        colDiv.appendChild(cardDiv);
        cardDiv.appendChild(cardLink);
        cardLink.appendChild(positionDiv);
        positionDiv.appendChild(badgeSpan);
        positionDiv.appendChild(heartIcon);
        positionDiv.appendChild(img);
        cardLink.appendChild(cardBody);
        cardBody.appendChild(titleH5);
        cardBody.appendChild(subtitleH6);
        cardDiv.appendChild(cardFooter);
        cardFooter.appendChild(addToCartButton);
        cardFooter.appendChild(seeMoreLink);
      });
    })
    .catch(error => {
      console.error('Erreur lors de la récupération des données JSON :', error);
    });

  renderCart();  
});

let items = [];

//================= Fonction pour ajouter l'article au panier =================//
function addToCart(item) {
  const existingItem = items.find(i => i.name === item.nom && i.size === item.taille);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    items.push({ name: item.nom, image: item.images, price: item.prix, rabais: item.rabais, size: item.taille, quantity: 1 });
  }
  updateCartNotification();
  renderCart();
}

//================= Fonction pour mettre à jour la pastille du panier =================//
function updateCartNotification() {
  const cartNotification = document.querySelector('.navbar-cart .icon-text');
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  cartNotification.textContent = totalItems;
}

//================= Fonction pour mettre à jour le rendu du panier =================//
function renderCart() {
  const tableBody = document.querySelector('#table-products');
  tableBody.innerHTML = '';

  items.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="checkout-product">
        <div class="product-cart d-flex">
          <div class="product-thumb">
            <img src="${item.image} width="30" height="30" alt="Product">
          </div>
          <div class="product-content media-body">
            <h5 class="title">${item.name}</h5>
            <ul>
              <li>
                <a class="delete" href="#" data-name="${item.name}" data-size="${item.size}">
                  <i class="fa-solid fa-trash fa-bounce" style="color: #ff3e24;"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </td>
      <td class="checkout-quantity">
        <div class="product-quantity d-inline-flex">
          <button type="button" class="sub" data-name="${item.name}" data-size="${item.size}">
          <i class="fa-solid fa-minus" style="color: #74C0FC;"></i>
          </button>
          <input type="text" value="${item.quantity}">
          <button type="button" class="add" data-name="${item.name}" data-size="${item.size}">
          <i class="fa-solid fa-plus" style="color: #B197FC;"></i>
          </button>
        </div>
      </td>
      <td class="checkout-price">
        <p class="price">$${(item.price * (1 - (item.rabais || 0))).toFixed(2)}</p>
      </td>
    `;
    tableBody.appendChild(row);
  });

  const { subTotal, taxes, total } = calculateTotals();
  const totalsElement = document.querySelector('.checkout-footer');
  totalsElement.innerHTML = `
    <div class="checkout-sub-total d-flex justify-content-between">
      <p class="value">Subtotal Price:</p>
      <p class="price">$${subTotal.toFixed(2)}</p>
    </div>
    <div class="checkout-sub-total d-flex justify-content-between">
      <p class="value">Taxes:</p>
      <p class="price">${taxes.toFixed(2)}</p>
    </div>
    <div class="checkout-total d-flex justify-content-between">
      <div class="value">Total:</div>
      <div class="price">$${total.toFixed(2)}</div>
    </div>
    <a href="checkout.html" class="btn btn-primary btn-block">Checkout</a>
  `;

  const deleteButtons = tableBody.querySelectorAll('.delete');
  deleteButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const itemName = button.dataset.name;
      const itemSize = button.dataset.size;
      const confirmDelete = confirm(`Are you sure you want to remove item "${itemName}" from your cart ?`);
      if (confirmDelete) {
        removeFromCart(itemName, itemSize);
      }
    });
  });

  const quantityInputs = tableBody.querySelectorAll('.product-quantity input');
  quantityInputs.forEach(input => {
    const addButton = input.nextElementSibling;
    const subButton = input.previousElementSibling;

    addButton.addEventListener('click', () => {
      const itemName = addButton.dataset.name;
      const itemSize = addButton.dataset.size;
      updateQuantity(itemName, itemSize, 1);
    });

    subButton.addEventListener('click', () => {
      const itemName = subButton.dataset.name;
      const itemSize = subButton.dataset.size;
      updateQuantity(itemName, itemSize, -1);
    });
  });
}

//================= Fonction pour supprimer un item =================//
function removeFromCart(name, size) {
  items = items.filter(item => !(item.name === name && item.size === size));
  updateCartNotification();
  renderCart();
}

//================= Fonction pour la mise à jour de la quantité =================//
function updateQuantity(name, size, delta) {
  const item = items.find(i => i.name === name && i.size === size);
  if (item) {
    item.quantity = Math.max(item.quantity + delta, 0);
    updateCartNotification();
    renderCart();
  }
}

//================= Fonction pour les calculs de factures =================//
function calculateTotals() {
  let subTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const taxes = subTotal * 0.14975;

  // Appliquer les rabais s'il y en a
  items.forEach(item => {
    if (item.rabais) {
      const rabais = item.price * item.rabais;
      subTotal -= rabais * item.quantity;
    }
  });

  const total = subTotal + taxes;
  return { subTotal, taxes, total };
}
