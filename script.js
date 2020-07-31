function refreshStorage() {
  const itemsList = document.querySelector('.cart__items');
  const totalPrice = document.querySelector('.total-price');
  localStorage.setItem('cart item:', itemsList.innerHTML);
  localStorage.setItem('total price:', totalPrice.innerHTML);
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

async function calculateTotal(salePrice) {
  const totalPrice = document.querySelector('.total-price');
  totalPrice.innerText = ((Math.round((totalPrice.innerText) * 100) / 100) + salePrice).toFixed(2);
}

function cartItemClickListener(event) {
  const item = event.target;
  const text = event.target.innerText;
  if (item.parentNode) {
    const price = (Math.round(text.substr(text.indexOf('PRICE: $') + 8) * 100) / 100).toFixed(2);
    calculateTotal(-price);
    item.parentNode.removeChild(item);
  }
  refreshStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  calculateTotal(salePrice);
  return li;
}

function addToCart(event) {
  const button = event.target;
  const itemID = button.parentNode.firstChild.innerHTML;
  fetch(`https://api.mercadolibre.com/items/${itemID}`)
  .then(response => response.json())
  .then((data) => {
    const newCartItem = {
      sku: data.id,
      name: data.title,
      salePrice: data.price,
    };
    const itemsList = document.querySelector('.cart__items');
    itemsList.appendChild(createCartItemElement(newCartItem));
    refreshStorage();
  });
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') {
    e.addEventListener('click', addToCart);
  }
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function clearCart() {
  document.querySelector('.empty-cart').addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    document.querySelector('.total-price').innerText = '0.00';
    refreshStorage();
  });
}

window.onload = function onload() {
  setTimeout(() => {
    document.getElementsByClassName('loading')[0].remove();
  }, 300);
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then(data => data.results.forEach((item) => {
      const product = createProductItemElement({
        sku: item.id,
        name: item.title,
        image: item.thumbnail,
        salePrice: item.price,
      });
      document.getElementsByClassName('items')[0].appendChild(product);
    }))
    .then(() => {
      const itemStorage = localStorage.getItem('cart item:');
      const priceStorage = localStorage.getItem('total price:');
      const itemsCart = document.querySelector('.cart__items');
      const totalPrice = document.querySelector('.total-price');
      itemsCart.innerHTML = itemStorage;
      totalPrice.innerHTML = priceStorage;
      itemsCart.addEventListener('click', cartItemClickListener);
    })
    .then(() => clearCart());
};
