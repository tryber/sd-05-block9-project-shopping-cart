window.onload = function onload() { };

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
  // coloque seu código aqui
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// ---------------------------------------------------

// function that creates a list of products
async function createListOfProducts(product) {
  const API_URL = `https://api.mercadolibre.com/sites/MLB/search?q=${product}`;
  const getObject = {
    method: 'GET',
  };
  fetch(API_URL, getObject)
    .then(response => response.json())
    .then((data) => {
      data.results.forEach(item => document.querySelector('.items').appendChild(createProductItemElement(item)));
    })
    .catch(() => console.log('Error on calling the MLB API'));
}

createListOfProducts('computador');

// add the product to the cart when the button is clicked
const items = document.querySelector('.items');
items.addEventListener('click', (event) => {
  // gets products id
  const itemId = event.target.parentElement.firstElementChild.innerText;
  
  // send a request
  const API_URL = `https://api.mercadolibre.com/items/${itemId}`;
  const getObject = {
    method: 'GET',
  };

  fetch(API_URL, getObject)
    .then(response => response.json())
    .then((item) => {
      document.querySelector('.cart__items').appendChild(createCartItemElement(item));
    })
    .catch(() => console.log('Error trying to add a product to the cart'));
});
