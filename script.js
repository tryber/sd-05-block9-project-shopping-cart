const selectItems = document.getElementsByClassName('items')[0];
const removeapps = document.querySelector('.empty-cart');
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function removerItens() {
  document.getElementsByClassName('cart__items')[0].innerHTML = '';
  localStorage.setItem('cart', '');
}
removeapps.addEventListener('click', removerItens);

function saveLocalStorage() {
  const ol = document.querySelector('.cart__items');
  localStorage.setItem('cart', ol.innerHTML);
}
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  const eventClick = event.target;
  eventClick.remove();
  saveLocalStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.addEventListener('click', cartItemClickListener);
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  return li;
}
function idProducts(item) {
  const callOl = document.querySelector('.cart__items');
  const url = `https://api.mercadolibre.com/items/${item}`;
  fetch(url)
    .then(response => response.json())
    .then(function (clickButoon) {
      const { id: sku, title: name, price: salePrice } = clickButoon;
      callOl.appendChild(createCartItemElement({ sku, name, salePrice }));
      saveLocalStorage();
    });
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const addEvent = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  addEvent.addEventListener('click', () => idProducts(sku));
  section.appendChild(addEvent);
  selectItems.appendChild(section);
  saveLocalStorage();
  return section;
}

// function idProducts(item) {
//   return item.querySelector('span.item__sku').innerText;
// }
const initializing =
  'https://api.mercadolibre.com/sites/MLB/search?q=computador';

// idProducts();
window.onload = function onload() {
  setTimeout(() => {
    document.querySelector('.loading').remove();
  }, 1000);
  if (localStorage.getItem('cart') !== null) {
    document.getElementsByTagName('ol')[0].innerHTML = localStorage.getItem('cart');
    const receive = document.querySelectorAll('.cart__item');
    receive.forEach((loading) => {
      loading.addEventListener('click', cartItemClickListener);
    });
  }
  fetch(initializing)
    .then(response => response.json())
    .then(function (obj) {
      obj.results.map((objProducts) => {
        const { id: sku, title: name, thumbnail: image } = objProducts;
        return createProductItemElement({ sku, name, image });
      });
    });
};
