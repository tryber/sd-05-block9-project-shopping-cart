// async function getPrice() {
//   let sum = 0;
//   const localStorageKeys = Object.keys(localStorage);
//   for (item of localStorageKeys) {
//     const response = await fetch(`https://api.mercadolibre.com/items/${item}`);
//     const data = await response.json();
//     const itemPrice = data.price;
//     sum += Number(localStorage.getItem(item)) * itemPrice;
//   }
//   return sum;
// }

// async function getPrice() {
//   let sum = 0;
//   const localStorageKeys = Object.keys(localStorage);
//   for (let i = 0; i < localStorageKeys.length; i += 1) {
//     const response = await fetch(`https://api.mercadolibre.com/items/${localStorageKeys[i]}`);
//     const data = await response.json();
//     const itemPrice = data.price;
//     sum += Number(localStorage.getItem(localStorageKeys[i])) * itemPrice;
//   }
//   return sum;
// }

// async function totalPrice() {
//   const price = await getPrice();
//   const cartTag = document.querySelector('.cart');
//   cartTag.classList.add('total-price');
//   const priceTag = document.querySelector('.price');
//   priceTag.innerHTML = `${price}`;
//   cartTag.insertBefore(priceTag, document.querySelector('.empty-cart'));
//   return priceTag;
// }

function addLocalStorageKey(productSKU) {
  if (localStorage.getItem(productSKU) === null) return localStorage.setItem(productSKU, 1);
  return localStorage.setItem(productSKU, Number(localStorage.getItem(productSKU)) + 1);
}

function removeLocalStorageKey(productSKU) {
  if (localStorage.getItem(productSKU) === '1') return localStorage.removeItem(productSKU);
  return localStorage.setItem(productSKU, Number(localStorage.getItem(productSKU) - 1));
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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  const tagToBeRemoved = event.target;
  const productSKU = tagToBeRemoved.innerHTML.slice(5, 18);
  removeLocalStorageKey(productSKU);
  tagToBeRemoved.remove();
  // totalPrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addToCart(event) {
  const itemID = event.target.parentElement.firstChild.innerHTML;
  fetch(`https://api.mercadolibre.com/items/${itemID}`)
  .then(response => response.json())
  .then((data) => {
    const { id: sku, title: name, price: salePrice } = data;
    const cartItemElement = createCartItemElement({ sku, name, salePrice });
    cartItemElement.addEventListener('click', cartItemClickListener);
    const cart = document.getElementsByClassName('cart__items')[0];
    cart.appendChild(cartItemElement);
    addLocalStorageKey(sku);
    // totalPrice();
  });
}

function loadLocalStorage() {
  const localStorageKeys = Object.keys(localStorage);
  localStorageKeys.forEach((key) => {
    for (let i = 0; i < Number(localStorage.getItem(key)); i += 1) {
      fetch(`https://api.mercadolibre.com/items/${key}`)
      .then(response => response.json())
      .then((data) => {
        const { id: sku, title: name, price: salePrice } = data;
        const cartItemElement = createCartItemElement({ sku, name, salePrice });
        cartItemElement.addEventListener('click', cartItemClickListener);
        const cart = document.getElementsByClassName('cart__items')[0];
        cart.appendChild(cartItemElement);
      });
    }
  });
}

function clearCart() {
  const cartItemsContainer = document.querySelector('.cart__items');
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', function () {
    while (cartItemsContainer.firstChild) {
      removeLocalStorageKey(cartItemsContainer.lastChild.innerHTML.slice(5, 18));
      cartItemsContainer.removeChild(cartItemsContainer.lastChild);
    }
    // totalPrice();
  });
}

function loading() {
  const loadingTag = createCustomElement('div', 'loading', 'Carregando');
  const cart = document.querySelector('.cart__title');
  cart.appendChild(loadingTag);
}


window.onload = function onload() {
  loading();
  setTimeout(() => document.querySelector('.loading').remove(), 500);
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(response => response.json())
  .then((data) => {
    data.results.forEach((element) => {
      const { id: sku, title: name, thumbnail: image } = element;
      const productItem = createProductItemElement({ sku, name, image });
      const itemsSection = document.getElementsByClassName('items')[0];
      itemsSection.appendChild(productItem);
    });
  })
  .then(() => {
    const addButtons = document.querySelectorAll('.item__add'); //  Tem que ser querySelector, pq forEach não itera sobre uma HTML collection
    addButtons.forEach(element => element.addEventListener('click', addToCart));
  })
  .then(() => {
    loadLocalStorage();
  })
  .then(() => clearCart());
  // .then(() => totalPrice());
};
