// window.onload = function onload() {
//   insertProducts();
// };

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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const btnAddToChart = createCustomElement(
    'button',
    'item__add',
    'Adicionar ao carrinho!',
  );
  btnAddToChart.addEventListener('click', () => {
    getProductDetails({ sku });
  });
  section.appendChild(btnAddToChart);

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener() {
  const cart__Items = document.querySelector('.cart__items');
  cart__Items.appendChild(createCartItemElement(item));
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Pegando a lista de computadores

const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=';
const PRODUCT_ENDPOINT = 'https://api.mercadolibre.com/items/';

function queryProducts(term = 'computador') {
  return fetch(`${API_URL}${term}`);
}

async function getProductDetails({ sku }) {
  console.log(`${PRODUCT_ENDPOINT}${sku}`);
  const queryProductById = () => fetch(`${PRODUCT_ENDPOINT}${sku}`);
  const productDetails = await queryProductById();
  const { title: name, price: salePrice } = await productDetails.json();
  const cart__items = document.querySelector('.cart__items');
  const cart_Product = createCartItemElement({ sku, name, salePrice });
  cart__items.appendChild(cart_Product);
}

async function insertProducts() {
  const productsResponse = await queryProducts();
  const { results } = await productsResponse.json();
  results.forEach(({ id: sku, title: name, thumbnail: image }) => {
    const item = { sku, name, image };
    const itemSection = document.querySelector('.items');
    itemSection.appendChild(createProductItemElement(item));
  });
}

window.onload = () => {
  insertProducts();
};
const itemButtons = document.getElementsByClassName('item__add');
