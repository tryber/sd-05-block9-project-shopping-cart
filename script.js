let productsList = [];
let cart = null;
let products = [];
const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

function refreshItemInStorage() {
  if (typeof Storage !== 'undefined') {
    cart = cart || JSON.parse(localStorage.getItem('cart'));
    localStorage.setItem('cart', JSON.stringify(cart || []));
  } else {
    console.error('Este navegador não tem suporte para salvar seus pedidos.');
  }
}

/* -------------- Personalizadas ---------------- */

function addItemInStorage(item) {
  cart.push(item);
  refreshItemInStorage();
}

function addItemInCart(ev) {
  const { sku: evSku } = ev.target;
  let li = null;
  fetch(`https://api.mercadolibre.com/items/${evSku}`)
    .then(async (data) => {
      const { id: sku, title: name, price: salePrice } = await data.json();
      const result = { sku, name, salePrice };
      li = createCartItemElement(result);
      // Save in localstorage
      addItemInStorage(result);
    })
    .then(() => {
      if (li) document.querySelector('.cart__items').appendChild(li);
      calcAndPrintTotal();
    })
    .catch((error) => {
      console.error(error);
    });
}

function calcAndPrintTotal() {
  let total = 0;
  cart.forEach(({ salePrice }) => {
    total += salePrice;
  });
  printTotal(total);
}

function printTotal(total) {
  document.querySelector('.total-price').innerText = `$${total.toFixed(2)}`;
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
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const { sku } = event.target;
  cart = cart.filter(({ sku: id }) => id !== sku);
  document.querySelector('.cart__items').removeChild(event.target);
  refreshItemInStorage();
  calcAndPrintTotal();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.sku = sku;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

/* ----------------- */

function definesList() {
  products.forEach((product) => {
    const { sku } = product;
    const item = createProductItemElement(product);
    item.lastElementChild.sku = sku;
    item.lastElementChild.addEventListener('click', addItemInCart);
    document.querySelector('.items').appendChild(item);
  });
}

function pushList() {
  const price = createCustomElement('span', 'total-price', 0);
  let total = 0;
  cart.forEach((item) => {
    const li = createCartItemElement(item);
    total += item.salePrice;

    document.querySelector('.cart__items').appendChild(li);
  });
  document.querySelector('.cart').appendChild(price);
  printTotal(total);
}

function loadAll() {
  fetch(endpoint)
  // Baixa dados da API
  .then(async (data) => {
    const result = await data.json();
    productsList = result.results;
  })
  // Preenche lista de produtos
  .then(() => {
    products = productsList.map(({ id, title: t, thumbnail }) => ({
      sku: id,
      name: t,
      image: thumbnail,
    }));
  })
  // Define a lista
  .then(() => {
    definesList();
    pushList();
  })
  .catch((err) => {
    console.error('Error!', err);
  });
}

window.onload = function onload() {
  loadAll();
  refreshItemInStorage();
};
