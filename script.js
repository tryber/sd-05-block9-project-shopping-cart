let prices = [];
if (localStorage.getItem('prices') !== null) {
  const arrPrice = localStorage.getItem('prices').split(',');
  arrPrice.forEach((price) => {
    if (price !== '0' && price !== '') {
      prices.push(parseInt(price, 10));
    }
  });
}

const totalPriceElement = document.querySelectorAll('.total-price')[0];
const totalPrice = document.createElement('span');
totalPriceElement.appendChild(totalPrice);

async function sumProducts() {
  const totalItems = prices.reduce(((total, number) => total + number), 0);
  totalPrice.innerHTML = totalItems;
}

function setSavedCart() {
  const savedCart = document.getElementsByClassName('cart__items')[0];
  localStorage.setItem('SavedCart', savedCart.innerHTML);
  if (prices !== [0]) localStorage.setItem('prices', prices);
}

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
  const target = event.target;
  target.remove();
  prices.splice((prices.indexOf(parseInt(target.classList[1], 10))), 1);
  setSavedCart();
  sumProducts();
}

function clearAll() {
  const elementToRemove = document.querySelectorAll('.cart__item');
  elementToRemove.forEach((element) => {
    element.remove();
    localStorage.clear();
    totalPrice.innerHTML = 0;
    prices = [];
  });
}
const clearButton = document.getElementsByClassName('empty-cart')[0];
clearButton.addEventListener('click', clearAll);

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.classList.add(salePrice);
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  prices.push(salePrice);
  return li;
}

async function searchProduct(sku) {
  await fetch(`https://api.mercadolibre.com/items/${sku}`)
  .then(response => response.json())
  .then((data) => {
    const products = {
      sku: data.id,
      name: data.title,
      salePrice: data.price,
    };
    const sectionElement = document.getElementsByClassName('cart__items')[0];
    sectionElement.appendChild(createCartItemElement(products));
    setSavedCart();
    sumProducts();
  });
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const addCart = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  section.appendChild(addCart);
  addCart.addEventListener('click', function () {
    searchProduct(sku);
  });
  const sectionElement = document.getElementsByClassName('items')[0];
  sectionElement.appendChild(section);
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
.then(response => response.json())
.then((data) => {
  data.results.forEach((element) => {
    const product = {
      sku: element.id,
      name: element.title,
      image: element.thumbnail,
    };
    createProductItemElement(product);
  });
});

window.onload = function onload() {
  document.getElementsByClassName('cart__items')[0].innerHTML = localStorage.getItem('SavedCart');
  if (localStorage.getItem('SavedCart') !== undefined) {
    const addEvent = document.querySelectorAll('.cart__item');
    addEvent.forEach(item => item.addEventListener('click', cartItemClickListener));
  }
  sumProducts();
};
