// VARIÁVEIS
const items = document.querySelector('.items');
// const cart = document.querySelector('.cart');
const cartItems = document.querySelector('.cart__items');
const totalPrice = document.querySelector('.total-price');
const clearButton = document.querySelector('.empty-cart');
let cartArray = [];

// FUNÇÕES
// requisito 4. carrega o carrinho através do local storage
window.onload = function onload() {
  cartItems.innerHTML = (localStorage.getItem('cart'));
};

// função veio pronta
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// função veio pronta
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// função veio pronta
function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

// função veio pronta
/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

// função veio semi-pronta (sem conteúdo)
function cartItemClickListener(event) {
  return event.target;
}

// função veio pronta
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// requisito 1. função que gera uma lista de produtos a partir da API
async function generatesProducts(product) {
  const apiProductURL = `https://api.mercadolibre.com/sites/MLB/search?q=${product}`;
  const getProduct = {
    method: 'GET',
  };
  fetch(apiProductURL, getProduct)
    .then(response => response.json())
    .then(data => data.results.forEach(item => items.appendChild(createProductItemElement(item))))
    .catch(() => console.log('Error: Could not load the API'));
}
generatesProducts('computador');

// requisito 2. função que cria um objeto para poder adicionar ao carrinho
const objectCart = ({ id: sku, title: name, price: salePrice }) => {
  const singleCartItem = {
    id: sku,
    name,
    price: salePrice,
  };
  cartArray.push(singleCartItem);
  return cartArray;
};

// requisito 5. soma o valor total
const sumTotal = (arr) => {
  totalValue = arr.reduce((acc, num) => acc + num.price, 0);
  return totalValue;
};

// requisito 2. adiciona ao carrinho ao clicar no botão
let itemId;
let apiItemURL = `https://api.mercadolibre.com/items/${itemId}`;
const getItem = {
  method: 'GET',
};
items.addEventListener('click', (event) => {
  itemId = event.target.parentElement.firstElementChild.innerText;
  apiItemURL = `https://api.mercadolibre.com/items/${itemId}`;
  fetch(apiItemURL, getItem)
    .then(response => response.json())
    .then((item) => {
      totalPrice.innerText = sumTotal(objectCart(item));
      cartItems.appendChild(createCartItemElement(item));
    })
    .then(() => localStorage.setItem('cart', cartItems.innerHTML))
    .catch(() => console.log('Error: Could not add product to cart'));
});

// requisito 6. botão limpar carrinho de compras
clearButton.addEventListener('click', () => {
  cartItems.innerHTML = '';
  localStorage.setItem('cart', cartItems.innerHTML);
  totalPrice.innerText = 0;
  cartArray = [];
});
