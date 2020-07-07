function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

async function totalPrice(price) {
  const total = document.getElementById('total-price');
  total.innerHTML = parseFloat(total.innerHTML) + price;
}

function refreshLocalStorage() {
  const cart = document.querySelector('.cart__items');
  const total = document.getElementById('total-price');
  localStorage.setItem('cart', cart.innerHTML);
  localStorage.setItem('totalCart', total.innerHTML);
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  const pai = event.target.parentNode;
  const text = event.target.innerHTML;
  const value = parseFloat(text.substr(text.indexOf('PRICE: $') + 8));
  totalPrice(-value);
  pai.removeChild(event.target);
  refreshLocalStorage();
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.id = id;
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  totalPrice(price);
  return li;
}

function createCustomElement(element, className, innerText, id) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') {
    e.addEventListener('click', () => {
      fetch(`https://api.mercadolibre.com/items/${id}`)
      .then(response => response.json())
      .then(dados => createCartItemElement(dados))
      .then(li => document.querySelector('.cart__items').appendChild(li))
      .then(() => refreshLocalStorage());
    });
  }
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!', sku));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function starting() {
  const cart = document.querySelector('.cart__items');
  const total = document.getElementById('total-price');
  document.getElementById('empty-cart').addEventListener('click', () => {
    cart.innerHTML = '';
    total.innerHTML = 0;
    refreshLocalStorage();
  });
  cart.innerHTML = localStorage.getItem('cart');
  if (localStorage.getItem('totalCart') !== null) {
    total.innerHTML = localStorage.getItem('totalCart');
  }
  if (cart.children.length > 0) {
    for (let i = 0; i < cart.children.length; i += 1) {
      cart.children[i].addEventListener('click', cartItemClickListener);
    }
  }
}

window.onload = function onload() {
  starting();
  const loading = document.getElementsByClassName('loading')[0];
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(response => response.json())
  .then((dados) => {
    setTimeout(() => {
      document.getElementsByClassName('loading')[0].parentNode.removeChild(loading);
    }, 3000);
    dados.results.forEach(produto =>
    document.querySelector('.items').appendChild(
    createProductItemElement({ sku: produto.id, name: produto.title, image: produto.thumbnail })));
  });
};
