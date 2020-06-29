// 3. Remove items from cart when you click on it 
function cartItemClickListener(event) {
  event.target.remove();
}

// Provided function, necessary for 2. and 3. to work
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// 2. Created function to add ids of products in cart
function addToCart({ sku }) {
  fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(response => response.json())
    .then((data) => {
      const cartItems = document.querySelector('.cart__items');
      const newCartItem = createCartItemElement({
        sku: data.id,
        name: data.title,
        salePrice: data.price,
      });
      cartItems.appendChild(newCartItem);
    });
}

// Provided function, used in 2. to access and store API button
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  // section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  const buttonAddToCart = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  buttonAddToCart.addEventListener('click', () => {
    addToCart({ sku });
  });
  section.appendChild(buttonAddToCart);
  return section;
}

// 4. Created function, to maintain cart on localStorage
function keepCartStored() {
  localStorage.setItem('Cart Items', document.querySelector('.cart__items').innerHTML);
}

// Provided function, looks like it could have been of use for requirement 2.
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// Provided function
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// Provided function
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// 1. Fetch the API on your html page
const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
window.onload = function onload() {
  fetch(API_URL)
  .then(response => response.json())
    .then((data) => {
      data.results.forEach((product) => {
        const newProduct = createProductItemElement({
          sku: product.id,
          name: product.title,
          image: product.thumbnail,
        });
        const classItems = document.querySelector('.items');
        classItems.appendChild(newProduct);
      });
    });
};
