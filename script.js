// SELETORES
const items = document.querySelector('.items');
const cartItems = document.querySelector('.cart__items');
const totalPrice = document.querySelector('.total-price');
const clearButton = document.querySelector('.empty-cart');

// FUNÇÕES
// requisito 4. carrega o carrinho através do local storage
window.onload = function loadCart() {
  cartItems.innerHTML = (localStorage.getItem('cart'));
};

// função veio pronta
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// função veio pronta
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// função veio pronta mas não usei pra nada
/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

// requisito 5. soma o valor total
const sumTotal = (arr) => {
  let cartTotalValue = 0;
  cartTotalValue = arr.reduce((acc, num) => acc + num.price, 0);
  totalPrice.innerText = cartTotalValue;
  return cartTotalValue;
};

// requisito 3. remove o item do carrinho ao clicar nele
function cartItemClickListener(event) {
  event.target.remove();
  const remakeCart = cart.filter(({ id }) => `${id}` !== event.target.id);
  remakeCart();
  sumTotal();
  localStorage.setItem('cart', cartItems.innerHTML);
}

// função veio pronta e eu fiz alterações
function createCartItemElement({ name, salePrice, id }) {
  const li = document.createElement('li');
  const span = document.createElement('span');
  li.className = 'cart__item';
  li.innerText = `${name} | R$${salePrice}`;
  li.id = id;
  span.appendChild(li);
  span.addEventListener('click', cartItemClickListener);
  return span;
}

// requisito 6. botão limpar carrinho de compras
clearButton.addEventListener('click', () => {
  cartItems.innerHTML = '';
  totalPrice.innerText = 0;
  localStorage.setItem('cart', cartItems.innerHTML);
});


// requisito 2. função que cria um objeto para poder adicionar ao carrinho
async function addToCart({ sku }) {
  await fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(response => response.json())
    .then((data) => {
      const singleCartItem = {
        sku: data.id,
        name: data.title,
        image: data.thumbnail,
        salePrice: data.price,
      };
      cart.push(singleCartItem);
      cartItems.appendChild(createCartItemElement(singleCartItem));
    });
  localStorage.setItem('cart', cartItems.innerHTML);
  sumTotal();
}

// função veio pronta e eu fiz alterações
function createProductItemElement({ id: sku, title: name, thumbnail: image, price: salePrice }) {
  const section = document.createElement('section');
  const buttonAddToCart = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('span', 'item__price', salePrice));
  section.appendChild(buttonAddToCart);
  buttonAddToCart.addEventListener('click', addToCart({ sku }));
  return section;
}

// requisito 1. função que gera uma lista de produtos a partir da API
async function generatesProducts(product) {
  const apiProductURL = `https://api.mercadolibre.com/sites/MLB/search?q=${product}`;
  const getProduct = {
    method: 'GET',
  };
  fetch(apiProductURL, getProduct)
    .then(response => response.json())
    .then(data => data.results.forEach(item => items.appendChild(createProductItemElement(item))))
    .catch(() => console.log('Error: Could not load the API'));
}
generatesProducts('computador');

// como eu estava fazendo antes
/* const objectCart = ({ id: sku, title: name, price: salePrice }) => {
  const singleCartItem = {
    id: sku,
    title: name,
    price: salePrice,
  };
  cartArray.push(singleCartItem);
  return cartArray;
};

// requisito 2. adiciona ao carrinho ao clicar no botão
let itemId;
let apiItemURL = `https://api.mercadolibre.com/items/${itemId}`;
const getItem = {
  method: 'GET',
};
items.addEventListener('click', (event) => {
  itemId = event.target.parentElement.firstElementChild.innerText;
  apiItemURL = `https://api.mercadolibre.com/items/${itemId}`;
  fetch(apiItemURL, getItem)
    .then(response => response.json())
    .then((item) => {
      totalPrice.innerText = sumTotal(objectCart(item));
      cartItems.appendChild(createCartItemElement(item));
    })
    .then(() => localStorage.setItem('cart', cartItems.innerHTML))
    .catch(() => console.log('Error: Could not add product to cart'));
});
 */
