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
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addToChart(event) {
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

function clearChart() {
  const chartItemsContainer = document.querySelector('.cart__items');
  const clearButton = document.querySelector('.empty-chart');
  clearButton.addEventListener('click', function () {
    while (chartItemsContainer.firstChild) {
      removeLocalStorageKey(chartItemsContainer.lastChild.innerHTML.slice(5, 18));
      chartItemsContainer.removeChild(chartItemsContainer.lastChild);
    }
  });
}

window.onload = function onload() {
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
    addButtons.forEach(element => element.addEventListener('click', addToChart));
  })
  .then(() => {
    loadLocalStorage();
  })
  .then(() => clearChart());
};

// async function totalPrice() {
//   let sum = 0;
//   const localStorageKeys = Object.keys(localStorage);
//   localStorageKeys.forEach(key => {
//     for(let i = 0; i < Number(localStorage.getItem(key)); i += 1) {
//       fetch(`https://api.mercadolibre.com/items/${key}`)
//       .then(response => response.json())
//       .then(data => {
//         const {price: salePrice} = data;
//         sum += salePrice;
//       })
//     }
//   })
//   await sum;
//   const cartTag = document.querySelector(".cart__title");
//   console.log(cartTag);
//   cartTag.classList.add('total-price');
//   const priceTag = createCustomElement('span', 'price', `Total: $ ${sum}`);
//   cartTag.appendChild(priceTag);
//   return await priceTag;
// }

// totalPrice();
