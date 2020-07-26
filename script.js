function refreshLocalStorage() {
  localStorage.clear('cart');
  const cart = document.querySelector('.cart__items');
  const price = document.querySelector('.total-price');
  localStorage.setItem('cart', cart.innerHTML);
  localStorage.setItem('price', price.innerHTML);
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

const selectItems = document.getElementsByClassName('items')[0];
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

//implementando a lógica somar preços
let valorItem = 0;
let soma = 0;
async function somaTotal() {
  const totalPrice = await document.querySelector('.total-price');
  if (localStorage.cart === undefined || localStorage.cart === '') {
    totalPrice.innerHTML = 0;
    refreshLocalStorage();
  } else {
    totalPrice.innerHTML = Math.round(((Math.round(valorItem * 100) / 100))
    + (Math.round(soma * 100) * 100) / 100);
    refreshLocalStorage();
  }
}
