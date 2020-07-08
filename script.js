function valor(li) {
  return parseFloat(li.innerText.substr(li.innerText.indexOf('PRICE: $') + 8));
}

async function total() {
  const ol = document.getElementsByClassName('cart__items')[0];
  const filhos = [...ol.children];
  const valorTotal = filhos.reduce((totalF, atual) => (totalF + valor(atual)), 0);
  document.querySelector('.total-price').innerHTML = valorTotal;
}

function atualizaStorage() {
  const ol = document.getElementsByClassName('cart__items')[0];
  localStorage.setItem('cart', ol.innerHTML);
  total();
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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const li = event.target;
  const pai = li.parentElement;
  pai.removeChild(li);
  atualizaStorage();
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addCarrinho(evento) {
  const id = evento.target.parentElement.firstChild.innerHTML;
  const endPoint = `https://api.mercadolibre.com/items/${id}`;
  fetch(endPoint)
  .then(resposta => resposta.json())
  .then((item) => {
    const ol = document.getElementsByClassName('cart__items')[0];
    ol.appendChild(createCartItemElement(item));
    atualizaStorage();
  });
  // const novoItem = {sku:item.id, name:item.title, salesPrice:item.price}
  // const {sku:id, name:title, salesPrice:price} = item
}

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  const botao = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  botao.addEventListener('click', addCarrinho);
  section.appendChild(botao);

  return section;
}

window.onload = function onload() {
  const endPoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const ol = document.getElementsByClassName('cart__items')[0];
  ol.innerHTML = localStorage.getItem('cart');
  for (let posicao = 0; posicao < ol.children.length; posicao += 1) {
    ol.children[posicao].addEventListener('click', cartItemClickListener);
  }
  document.querySelector('.empty-cart').addEventListener('click', () => {
    ol.innerHTML = '';
    atualizaStorage();
  });
  total();
  fetch(endPoint)
  .then(resposta => resposta.json())
  .then(resposta => resposta.results.forEach((produto) => {
    const items = document.getElementsByClassName('items')[0];
    items.appendChild(createProductItemElement(produto));
  }));
  setTimeout(() => {
    const loading = document.querySelector('.loading');
    loading.parentElement.removeChild(loading);
  }, 3000);
};
