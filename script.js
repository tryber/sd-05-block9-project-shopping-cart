function carrinhoCompras() {
  localStorage.setItem('li do carrinho', document.getElementsByClassName('cart__items')[0].innerHTML);
}

async function clearStorageAndList(event) { // line 73
  event.innerHTML = ''; // eslint-disable-line no-param-reassign
  await localStorage.removeItem('li do carrinho', document.getElementsByClassName('cart__items')[0].innerHTML);
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

async function sumPrices() {
  const carrinho = await document.querySelectorAll('.cart__item');
  const numPrice = await [...carrinho].map(elem => elem.textContent.match(/[0-9.0-9]+$/))
  .reduce((accumul, valor) => accumul + parseFloat(valor), 0);
  document.querySelector('.total-price').innerHTML = `${numPrice}`;
}

async function cartItemClickListener(event) {
  await event.remove();
  await carrinhoCompras();
  await sumPrices();
}


function createCartItemElement(data) {
  // console.log(data);
  const { sku, name, salePrice } = data;
  // console.log(sku, name, salePrice);
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', () => cartItemClickListener(li));
  return li;
}


async function addToCart(skuId) { // async para declarar que a função é async de forma sincrona
  const addLibre = `https://api.mercadolibre.com/items/${skuId}`;
  const getOlList = document.querySelector('.cart__items');
  await fetch(addLibre) // o await tem a função de esperar a anterior acabar
  .then(response => response.json())
  .then(data => getOlList.appendChild(createCartItemElement({
    sku: data.id,
    name: data.title,
    salePrice: data.base_price,
  })));
  await carrinhoCompras();
  await sumPrices();
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  // sku=id image=thumbnail name=title
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', () => addToCart(sku));

  return section;
}

function createBtnAndClickListener() {
  const listaCart = document.getElementsByClassName('cart__items')[0];
  const section = document.createElement('section');
  section.className = 'cartItem';

  section.appendChild(createCustomElement('button', 'empty-cart', 'Limpar Carrinho')).addEventListener('click', () => clearStorageAndList(listaCart));

  return section;
}

// async function getPrice() {

// }

window.onload = async function onload() {
  const sectionCart = document.getElementsByClassName('cart')[0];
  sectionCart.appendChild(createBtnAndClickListener());
  const sectionItens = document.getElementsByClassName('items')[0];
  const CPUlibre = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  await fetch(CPUlibre)
  .then(response => response.json())
  .then(data =>
    data.results.forEach((product) => {
      const INFOproduct = createProductItemElement({
        sku: product.id,
        name: product.title,
        image: product.thumbnail,
      });
      sectionItens.appendChild(INFOproduct);
    }),
  );
  document.getElementsByClassName('cart__items')[0].innerHTML = localStorage.getItem('li do carrinho');
  document.querySelectorAll('li').forEach(elem => elem.addEventListener('click', () => cartItemClickListener(elem)));
  await sumPrices();
};
