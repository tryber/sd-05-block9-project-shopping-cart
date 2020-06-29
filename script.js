// VARIÁVEIS
const cartItems = document.querySelector('.cart__items');
const cartSingleItem = document.querySelector('.cart__item');
const totalPrice = document.querySelector('.total-price');
const clearButton = document.querySelector('.empty-cart');
const loading = document.querySelector('.loading');

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

// requisito 5. faz a soma total
const sumTotal = () => {
  totalPrice[0].innerText = (
    [...cartSingleItem].map(item => item.innerHTML.match(/[\d.\d]+$/))
    .reduce((acc, add) => acc + parseFloat(add), 0) * 100) / 100;
};

// requisito 4. função que salva itens do carrinho
const saveCart = () => {
  localStorage.setItem('Cart Items', cartItems.innerHTML);
  localStorage.setItem('Total Price', totalPrice.innerHTML);
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

// requsisito 2. função que que pega infos sobre itens do carrinho
const getProductInfo = async (itemId) => {
  const product = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
  const productJson = await product.json();
  return productJson;
};

// requisito 2. função que adiciona ao carrinho
async function addToCart(sku) {
  const ol = document.getElementsByClassName('cart__items')[0];
  const product = await getProductInfo(sku)
    .then(productData =>
      createCartItemElement({
        sku: productData.id, name: productData.title, salePrice: productData.price,
      }),
    );
  ol.appendChild(product);
  sumTotal();
  saveCart();
}

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
  cartItems.innerHTML = '';
  saveCart();
  sumTotal();
}
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
setTimeout(() => {
  loading.remove();
}, 3000);