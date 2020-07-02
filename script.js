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

async function loadingAPI() {
  const loading = createCustomElement('p', 'loading', 'loading products...');
  document.querySelector('.container').appendChild(loading);
  setTimeout(() => loading.remove(), 2000);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  const getProducts = document.querySelector('.cart__items');
  getProducts.removeChild(event.target);
}

// function loadedCart() {
//   localStorage.setItem('Cart Items', document.querySelectorAll('.cart__items').innerHTML);
// }

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addProductToCart({ sku }) {
  fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(response => response.json())
    .then((data) => {
      const createItem = {
        sku: data.id,
        name: data.title,
        salePrice: data.price,
      };
      document.querySelector('.cart__items').appendChild(createCartItemElement(createItem));
    });
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const addToCart = section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  addToCart.addEventListener('click', () => addProductToCart({ sku }));

  return section;
}

window.onload = async function onload() {
  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then((data) => {
      const getSection = document.querySelector('.items');
      data.results.forEach((item) => {
        const createObj = createProductItemElement({
          sku: item.id,
          name: item.title,
          image: item.thumbnail,
        });
        getSection.appendChild(createObj);
      });
    });
    loadingAPI();
    // loadedCart();
};
