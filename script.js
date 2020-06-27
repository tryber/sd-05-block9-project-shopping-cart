const items = document.querySelector('.items');
const loading = document.createElement('span');
const cart = document.querySelector('.cart');
loading.className = 'loading';
loading.innerHTML = 'loading...';
let cartArr = [];
let totalValue = 0;

window.onload = function onload() {
  document.querySelector('.cart__items').innerHTML = (localStorage.getItem('cart'));
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
  return event.target;
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  
  // console.log(cartArr)
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
    name: name,
    price: salePrice,
   }
  cartArr.push(itemsObj);
  return cartArr;
}

// 1 - function that creates a list of products


async function createListOfProducts(product) {
  const API_URL_1 = `https://api.mercadolibre.com/sites/MLB/search?q=${product}`;
  const getObject1 = {
    method: 'GET',
  };
  fetch(API_URL_1, getObject1)
    .then(response => response.json())
    .then(data => data.results.forEach(item => document.querySelector('.items').appendChild(createProductItemElement(item))))
    .catch(() => console.log('Error on calling the MLB API'));
}

createListOfProducts('computador');

// 2 - add the product to the cart when the button is clicked
let itemId;
let API_URL_2 = `https://api.mercadolibre.com/items/${itemId}`;
const getObject2 = {
  method: 'GET',
};

items.addEventListener('click', (event) => {
  // gets products id
  itemId = event.target.parentElement.firstElementChild.innerText;
  API_URL_2 = `https://api.mercadolibre.com/items/${itemId}`;
  // send a request
  fetch(API_URL_2, getObject2)
    .then(response => response.json())
    .then((item) => { async () => {
        const objectItemsResult = await createCartObjectItems(item);
        const sum = await createSum(objectItemsResult);
        return sum;
      }
      document.querySelector('.total-price').firstElementChild.innerText = createSum(createCartObjectItems(item));
      document.querySelector('.cart__items').appendChild(createCartItemElement(item));
    })
    .then(() => localStorage.setItem('cart', document.querySelector('.cart__items').innerHTML))
    .catch(() => console.log('Error trying to add a product to the cart'));
});

// 3 - Remove item from the cart
const cartItems = document.querySelector('.cart__items');
cartItems.addEventListener('click', () => {
  cartItemClickListener(event).remove();
  localStorage.setItem('cart', document.querySelector('.cart__items').innerHTML);
});

// 4 - Save to local storage
  // the response is at the function onload at the beginning

// 5 - Create sum of item's prices
const createSum = (arr) => {
  totalValue = arr.reduce((acc, num) => {
    return acc + num.price;
  }, 0);
  return totalValue;
}

// 6 - clear button
const clearButton = document.querySelector('.empty-cart');
clearButton.addEventListener('click', () => {
  cartItems.innerHTML = '';
  localStorage.setItem('cart', document.querySelector('.cart__items').innerHTML);
  document.querySelector('.total-price').firstElementChild.innerText = 0;
  cartArr = [];
  // console.log(cartArr)
});
