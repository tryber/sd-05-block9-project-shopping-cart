let prices = [];
if (localStorage.getItem('prices') !== null) {
  const priceSplit = localStorage.getItem('prices').split(',');
  priceSplit.forEach((number) => {
    if (number !== '0' && number !== '') {
      prices.push(parseFloat(number, 10));
    }
  });
}

const totalElementFather = document.querySelectorAll('.total-price')[0];
const totalElement = document.createElement('span');
totalElementFather.appendChild(totalElement);

async function sumItems() {
  const totalSum = await prices.reduce(((total, number) => total + number), 0);
  totalElement.innerHTML = totalSum;
}

function savingCart() {
  const cartItems = document.getElementsByClassName('cart__items')[0];
  localStorage.setItem('cart', cartItems.innerHTML);
  if (prices !== [0]) localStorage.setItem('prices', prices);
}

function cartItemClickListener(event) {
  const target = event.target;
  target.remove();
  prices.splice((prices.indexOf(parseFloat(target.classList[1], 10))), 1);
  savingCart();
  sumItems();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.classList.add(salePrice);
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  prices.push(salePrice);
  return li;
}

function searchInfo(sku) {
  fetch(`https://api.mercadolibre.com/items/${sku}`)
  .then(response => response.json())
  .then((data) => {
    const neededInfo = {
      sku: data.id,
      name: data.title,
      salePrice: data.price,
    };
    const fatherCart = document.getElementsByClassName('cart__items')[0];
    fatherCart.appendChild(createCartItemElement(neededInfo));
    savingCart();
    sumItems();
  });
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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const addToChart = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  section.appendChild(addToChart);
  addToChart.addEventListener('click', function () {
    searchInfo(sku);
  });
  const fatherElement = document.getElementsByClassName('items')[0];
  fatherElement.appendChild(section);
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

function clearAll() {
  const elementsToRemove = document.querySelectorAll('.cart__item');
  elementsToRemove.forEach((element) => {
    element.remove();
    localStorage.clear();
    totalElement.innerHTML = 0;
    prices = [];
  });
}

const buttonClear = document.getElementsByClassName('empty-cart')[0];
buttonClear.addEventListener('click', clearAll);

const loading = () => {
  const load = document.querySelector('.load-container');
  load.appendChild(createCustomElement('span', 'loading', 'loading'));
};

window.onload = function onload() {
  loading();
  setTimeout(() => {
    document.querySelector('.loading').remove();
  }, 1000);
  document.getElementsByClassName('cart__items')[0].innerHTML = localStorage.getItem('cart');
  if (localStorage.getItem('cart') !== undefined) {
    const eventAdder = document.querySelectorAll('.cart__item');
    eventAdder.forEach(item => item.addEventListener('click', cartItemClickListener));
  }
  sumItems();
};
