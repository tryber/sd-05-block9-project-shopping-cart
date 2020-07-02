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

async function loadScreen() {
  const loadingText = createCustomElement('p', 'loading', 'loading...');
  document.querySelector('.container').appendChild(loadingText);
  setTimeout(() => { loadingText.remove(); }, 3000);
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function saveCart() {
  const myCart = document.getElementsByClassName('cart__items')[0];
  localStorage.setItem('My Cart', myCart.innerHTML);
}

async function addProduct({ sku }) {
  await fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(response => response.json())
    .then((data) => {
      const selectedItem = {
        sku: data.id,
        name: data.title,
        salePrice: data.price,
      };
      document.querySelector('.cart__items').appendChild(createCartItemElement(selectedItem));
      saveCart();
    });
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', () => addProduct({ sku }));

  return section;
}

function emptyCart() {
  document.querySelectorAll('.cart__item').forEach(item => item.remove());
}

window.onload = async function onload() {
  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then((data) => {
      data.results.forEach((product) => {
        const eachProduct = createProductItemElement({
          sku: product.id,
          name: product.title,
          image: product.thumbnail,
        });
        document.querySelector('.items').appendChild(eachProduct);
        document.getElementsByClassName('cart__items')[0].innerHTML = localStorage.getItem('My Cart');
      });
    })
    .then(loadScreen())
    .then(document.getElementsByClassName('empty-cart')[0].addEventListener('click', emptyCart));
};
