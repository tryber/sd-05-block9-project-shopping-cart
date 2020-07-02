// requisito 4. função que gera o carrinho
/* const getCart = () => {
  const newCart = JSON.parse(localStorage.getItem('cart'));
  return newCart;
}; s
let cart = getCart();
*/

// requisito 4. função que salva itens do carrinho
const saveCart = () => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

// função fornecida
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// função fornecida
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}
/* 
// requisito 3. remove um item do carrinho quando clicado nele
function cartItemClickListener(event) {
  event.target.remove();
  saveCart();
  sumTotal();
}

 */// função fornecida mas fiz alterações
function createCartItemElement({ name, salePrice, id }) {
  const li = document.createElement('li');
  const span = document.createElement('span');
  span.className = 'span__item';
  li.className = 'cart__item';
  li.id = id;
  li.innerText = `SKU: ${id} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  span.appendChild(li);
  return span;
}
/* 
// requisito 5. faz a soma total
const sumTotal = async () => {
  const total = document.querySelector('.total-price');
  total.innerText = cart.reduce((total, item) => total + item.salePrice, 0);
};

// requisito 4. carrega o carrinho a partir do local storage
const loadCart = () => {
  getCart()
  .map(products => createCartItemElement(products))
  .forEach((singleProduct) => {
    document.getElementsByClassName('.cart__items').appendChild(singleProduct);
  });
  sumTotal();
};
 */
// requisito 2. função que adiciona ao carrinho
async function addToCart({ sku }) {
  await fetch(`https://api.mercadolibre.com/items/${sku}`)
  .then(response => response.json())
  .then((data) => {
    const newCartItem = {
      sku: data.id,
      name: data.title,
      salePrice: data.price,
      id: Math.floor(Math.random() * 9999999),
    };
    cart.push(newCartItem);
    document.getElementsByClassName('.cart__items').appendChild(createCartItemElement(newCartItem));
  });
 // saveCart();
 // sumTotal();
}

// função fornecida mas fiz modificações
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const buttonAdd = section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  buttonAdd.addEventListener('click', () => addToCart({ sku }));
  section.appendChild(buttonAdd);
  return section;
}

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */
/* 
// requisito 6. botão que limpa o carrinho
async function clearCart() {
  const cartItems = document.getElementsByClassName('.cart-items');
  cartItems.innerHTML = '';
  cart = [];
  saveCart();
  sumTotal();
}

const clearButton = document.querySelector('.empty-cart');
clearButton.addEventListener('click', clearCart);
 */

// requisito 7. loading
const loading = () => {
  const load = document.querySelector('.load-container');
  load.appendChild(createCustomElement('span', 'loading', 'loading'));
};

// requisito 4. carrega itens salvos do carrinho
window.onload = function onload() {
  loading();
  setTimeout(() => {
    document.querySelector('.loading').remove();
  }, 1000);
  document.getElementsByClassName('cart__items')[0].innerHTML = localStorage.getItem('cart');
  if (localStorage.getItem('cart') !== undefined) {
    const eventAdder = document.querySelectorAll('.cart__item');
    eventAdder.forEach(item => item.addEventListener('click', cartItemClickListener));
  }
  sumTotal();
};

// requisito 1. gerar lista de produtos
function getProductsList() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then((data) => {
      data.results.forEach((item) => {
        const singleProduct = createProductItemElement({
          sku: item.id,
          name: item.title,
          image: item.thumbnail,
        });
        document.querySelector('.items').appendChild(singleProduct);
      });
    })
    .catch(() => console.log('Error: Could not load the API'));
  // loadCart();
};
