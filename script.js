const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=';
const PRODUCT_ENDPOINT = 'https://api.mercadolibre.com/items/';
let itemsInCart = [];

const queryProductById = sku => fetch(`${PRODUCT_ENDPOINT}${sku}`);

async function myBill() {
  let amount = 0;
  itemsInCart.forEach(async (item) => {
    const productDetailResponse = await queryProductById(item);
    const { price } = await productDetailResponse.json();
    amount += await price
    const totalPriceSpam = document.querySelector('.total-price');
    totalPriceSpam.innerText = `$${amount}`;
  });
}

const saveCartToLocalStorage = () => {
  localStorage.setItem('cartItems', JSON.stringify(itemsInCart));
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
  const sku = event.target.querySelector('.item_cart_sku').innerText;
  itemsInCart = itemsInCart.filter(
    item => item !== sku,
  );
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
  const productDetails = await queryProductById(sku);
  const { title: name, price: salePrice } = await productDetails.json();
  itemsInCart.push(sku);
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

// const loadingTime = (element) => {
//   element.innerHTML = '';
//   const spamLoading = createCustomElement('spam', 'loading', 'loading...');
//   element.innerHTML = spamLoading;
//   console.log('to loadando...', element);
// };

async function insertProducts() {
  const itemSection = document.querySelector('.items');
  const productsResponse = await queryProducts();
  const { results } = await productsResponse.json();
  results.forEach(({ id: sku, title: name, thumbnail: image }) => {
    const item = { sku, name, image };
    itemSection.appendChild(createProductItemElement(item));
  });
}

const loadingCartFromLocalStorage = () => {
  const itemsToLoad = JSON.parse(localStorage.getItem('cartItems'));
  itemsToLoad.forEach(sku => (getProductDetails({ sku })));
};

const cleanCartButton = document.querySelector('.empty-cart');

cleanCartButton.addEventListener('click', () => {
  document.querySelector('.cart__items').innerHTML = '';
  localStorage.removeItem('cartItems');
  myBill();
});

window.onload = () => {
  const items = document.querySelector('.items');
  // loadingTime(items.innerHTML);
  insertProducts();
  if (localStorage.getItem('cartItems')) loadingCartFromLocalStorage();
  myBill();
};
