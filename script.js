const items = document.querySelector('.items');
const loading = document.createElement('span');
const cart = document.querySelector('.cart');
const cartItems = document.querySelector('.cart__items');
const clearButton = document.querySelector('.empty-cart');
loading.className = 'loading';
loading.innerHTML = 'loading...';
let cartArr = [];
let totalValue = 0;
const getObject = {
  method: 'GET',
};

window.onload = function onload() {
  cartItems.innerHTML = (localStorage.getItem('cart'));
};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
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

function cartItemClickListener(event) {
  console.log(event.target);
  return event.target;
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// ---------------------------------------------------

const createCartObjectItems = ({ id: sku, title: name, price: salePrice }) => {
  const itemsObj = {
    id: sku,
    name,
    price: salePrice,
  };
  cartArr.push(itemsObj);
  return cartArr;
};

// 5 - Create sum of item's prices
async function createSum(arr) {
  totalValue = await arr.reduce((acc, num) => acc + num.price, 0);
  return totalValue;
};

// 1 - function that creates a list of products
async function createListOfProducts(product) {
  const API_URL_1 = `https://api.mercadolibre.com/sites/MLB/search?q=${product}`;
  
  fetch(API_URL_1, getObject)
    .then(response => response.json())
    .then(data => data.results.forEach(item => document.querySelector('.items').appendChild(createProductItemElement(item))))
    .catch(() => console.log('Error on calling the MLB API'));
}

createListOfProducts('computador');

// 2 - add the product to the cart when the button is clicked
let itemId;
let API_URL_2 = `https://api.mercadolibre.com/items/${itemId}`;

items.addEventListener('click', (event) => {
  // gets products id
  itemId = event.target.parentElement.firstElementChild.innerText;
  API_URL_2 = `https://api.mercadolibre.com/items/${itemId}`;
  // send a request
  fetch(API_URL_2, getObject)
    .then(response => response.json())
    .then((item) => {
      localStorage.setItem('cartItemsObject', JSON.stringify(createCartObjectItems(item)));
      cartItems.appendChild(createCartItemElement(item));
    })
    .then(() => localStorage.setItem('cart', cartItems.innerHTML))
    .catch(() => console.log('Error trying to add a product to the cart'));
});

// 3 - Remove item from the cart
cartItems.addEventListener('click', () => {
  cartItemClickListener(event).remove();
  localStorage.setItem('cart', cartItems.innerHTML);
});

// 4 - Save to local storage
  // the response is at the function onload at the beginning

// 6 - clear button
clearButton.addEventListener('click', () => {
  cartItems.innerHTML = '';
  localStorage.setItem('cart', cartItems.innerHTML);
  document.querySelector('.total-price').innerText = 0;
  cartArr = [];
  localStorage.setItem('cartItemsObject', '');
});
