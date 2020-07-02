// requisito 4. função que carrega o carrinho com itens salvos
const getCart = () => {
  const newCart = JSON.parse(localStorage.getItem('cart'));
  return newCart || [];
};

let cart = getCart();

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

// requisito 5. faz a soma total
const sumTotal = async () => {
  const total = document.querySelector('.total-price');
  total.innerText = cart.reduce((total, item) => total + item.salePrice, 0);
};

// requisito 3. remove um item do carrinho quando clicado nele
function cartItemClickListener(event) {
  event.target.remove();
  saveCart();
  sumTotal();
}

// função veio pronta
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// requisito 2. função que adiciona ao carrinho


// função veio pronta e eu fiz modificações
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const buttonAdd = section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  buttonAdd.addEventListener('click', () => addToCart(sku));
  return section;
}

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

// requisito 5. botão que limpa o carrinho
async function clearAll() {
  document.getElementsByClassName('cart__items').innerHTML = '';
  saveCart();
  sumTotal();
}

const clearButton = document.querySelector('.empty-cart');
clearButton.addEventListener('click', clearAll);

// requisito 1. gerar lista de produtos
window.onload = function onload() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then((data) => {
      data.results.forEach((item) => {
        const singleItem = createProductItemElement({
          sku: item.id,
          name: item.title,
          image: item.thumbnail,
        });
        document.querySelector('.items').appendChild(singleItem);
      });
    })
    .catch(() => console.log('Error: Could not load the API'));
};

// requisito 7. função loading timeout
