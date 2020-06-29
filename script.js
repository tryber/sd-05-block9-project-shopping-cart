const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=';
const PRODUCT_ENDPOINT = 'https://api.mercadolibre.com/items/';

async function myBill() {
  const cartItemsPrices = await document.querySelectorAll('.item_cart_price');
  let amount = 0;
  cartItemsPrices.forEach(element => amount += Number(element.innerText));
  const totalPriceSpam = document.querySelector('.total-price');
  totalPriceSpam.innerText = `$${amount}`;
}

const saveCartToLocalStorage = () => {
  const cartItems = document.querySelector('.cart__items');
  localStorage.setItem('cartItems', cartItems.innerHTML);
  myBill();
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

function cartItemClickListener(event) {
  const cartItems = document.querySelector('.cart__items');
  cartItems.removeChild(event.target);
  saveCartToLocalStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.appendChild(createCustomElement('span', 'item_cart_sku', sku));
  li.appendChild(createCustomElement('span', 'item_cart_price', salePrice));
  li.addEventListener('click', cartItemClickListener);
  return li;
}


async function getProductDetails({ sku }) {
  const queryProductById = () => fetch(`${PRODUCT_ENDPOINT}${sku}`);
  const productDetails = await queryProductById();
  const { title: name, price: salePrice } = await productDetails.json();
  const cartItems = document.querySelector('.cart__items');
  const cartProduct = createCartItemElement({ sku, name, salePrice });
  cartItems.appendChild(cartProduct);
  saveCartToLocalStorage();
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

function queryProducts(term = 'computador') {
  return fetch(`${API_URL}${term}`);
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

const loadingCartFromLocalStorage = () => {
  const cartItems = document.querySelector('.cart__items');
  cartItems.innerHTML = localStorage.getItem('cartItems');
  document.querySelectorAll('.cart__item').forEach((item) => {
    item.addEventListener('click', cartItemClickListener);
  });
};

window.onload = () => {
  insertProducts();
  if (localStorage.getItem('cartItems')) loadingCartFromLocalStorage();
  myBill()
};
