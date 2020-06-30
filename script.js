// 5. a) Get prices (to be accumulated) directly on html cart
// b) sum all prices and show the result
// c) write addToCart as async await to get rid of the delay
const getAndSumPrices = () => {
  const cartItens = document.querySelectorAll('.cart__item');
  const priceArray = [...cartItens].map(item => item.innerHTML.match(/[\d.\d]+$/));
  const totalPricePlace = document.getElementsByClassName('total-price')[0];
  totalPricePlace.innerHTML = priceArray.reduce((acc, num) => acc + parseFloat(num), 0);
};

// 3. Remove items from cart when you click on it
function cartItemClickListener(event) {
  event.target.remove();
  getAndSumPrices();
}

// Provided function, necessary for 2. and 3. to work
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// 2. Created function to add ids of products in cart
async function addToCart({ sku }) {
  const response = await fetch(`https://api.mercadolibre.com/items/${sku}`);
  const data = await response.json();
  const cartItems = document.querySelector('.cart__items');
  const newCartItem = createCartItemElement({
    sku: data.id,
    name: data.title,
    salePrice: data.price,
  });
  cartItems.appendChild(newCartItem);
  getAndSumPrices();
};

// Provided function
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// Provided function
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// Provided function, used in 2. to access and store API button
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  // section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  const buttonAddToCart = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  buttonAddToCart.addEventListener('click', () => {
    addToCart({ sku });
  });
  section.appendChild(buttonAddToCart);
  return section;
}

// Provided function, looks like it could have been of use for requirement 2.
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// 4. Created function, to maintain cart content on localStorage
// function keepCartStored() {
//   localStorage.setItem('Cart Items', document.querySelector('.cart__items').innerHTML);
// }
// does not work, work on progress, must be on onload and fetch

// 6. Created function to empty cart, event listener in window load
const emptyCart = () => {
  const cartItems = document.querySelectorAll('.cart__item');
  cartItems.forEach(item => item.remove());
};

// 1. Fetch the API on your html page
// 7. Loading text until API is available
const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
window.onload = function onload() {
  fetch(API_URL)
  .then(response => response.json())
    .then((data) => {
      data.results.forEach((product) => {
        const newProduct = createProductItemElement({
          sku: product.id,
          name: product.title,
          image: product.thumbnail,
        });
        const classItems = document.querySelector('.items');
        classItems.appendChild(newProduct);
      });
    })
    .then(setTimeout(() => document.querySelector('.loading').remove(), 1000))
    .then(document.getElementsByClassName('empty-cart')[0].addEventListener('click', emptyCart));
};
