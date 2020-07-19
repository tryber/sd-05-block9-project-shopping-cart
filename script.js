let carrinho = [];
let lista = [];
let listaAdaptada = [];
let ol;

function apagaTutoo() {
  carrinho = [];
  ol.innerHTML = '';
  localStorage.setItem('carrinho', '');
}

const botaoLimpaTudo = document.querySelector('.empty-cart');
botaoLimpaTudo.addEventListener('click', apagaTutoo);

function cartItemClickListener(event) {
  const id = event.target.id;
  const procurado = carrinho.find(el => el.sku === id);
  const pos = carrinho.indexOf(procurado);
  carrinho.splice(pos, 1);
  ol.removeChild(event.target);
  localStorage.setItem('carrinho', carrinho.map(el => el.sku).join(','));
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.id = sku;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function criaListaDoCarrinho() {
  ol.innerHTML = '';
  carrinho.forEach(product => ol.appendChild(createCartItemElement(product)));
}

function getElementById(idBusca) {
  fetch(`https://api.mercadolibre.com/items/${idBusca}`)
  .then(response => response.json())
  .then(({ id, price, title }) => ({
    sku: id,
    salePrice: price,
    name: title,
  }))
  .then((obj) => {
    carrinho.push(obj);
    localStorage.setItem('carrinho', carrinho.map(el => el.sku).join(','));
    criaListaDoCarrinho(obj);
  });
}

function addItemToCart(evento) {
  const elemento = evento.target.parentElement;
  const idBusca = elemento.children[0].innerText;
  getElementById(idBusca);
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
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

function criaALista() {
  listaAdaptada.forEach((produto) => {
    const elemento = createProductItemElement(produto);
    elemento.lastElementChild.addEventListener('click', addItemToCart);
    document.querySelector('.items').appendChild(elemento);
  });
}

function dataFetcher() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(response => response.json())
  .then((response) => {
    lista = response.results;
  })
  .then(() => {
    listaAdaptada = (lista.map(({ id, title, thumbnail }) =>
    ({
      sku: id,
      name: title,
      image: thumbnail,
    })));
  })
  .then(() => {
    criaALista();
  });
}

window.onload = function onload() {
  ol = document.querySelector('.cart__items');
  dataFetcher();
  const local = localStorage.getItem('carrinho').split(',');
  if (localStorage.getItem('carrinho') !== '') local.forEach(el => getElementById(el));
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
