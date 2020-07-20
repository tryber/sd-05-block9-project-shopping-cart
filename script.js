function atualizaValor(texto) {
  return parseFloat(texto.substr(texto.indexOf('PRICE: $') + 8));
}

function atualizarLocalStorage() {
  const ol = document.querySelector('ol');
  const valor = document.querySelector('.total-price');
  let total = 0;
  localStorage.setItem('ol', ol.innerHTML);
  [...ol.children].forEach((item) => {
    total += atualizaValor(item.innerText);
  });
  valor.innerHTML = total;
}

function resgataLocalStorage() {
  const ol = document.querySelector('ol');
  const valor = document.querySelector('.total-price');
  ol.innerHTML = localStorage.getItem('ol');
  valor.innerHTML = localStorage.getItem('valor');
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
  li.parentElement.removeChild(li);
  atualizarLocalStorage();
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function buscaId(evento) {
  const idDoProduto = evento.target.parentElement.firstChild.innerText;
  const carrinho = document.querySelector('.cart__items');
  fetch(`https://api.mercadolibre.com/items/${idDoProduto}`)
  .then(idProduto => idProduto.json())
  .then((objetoId) => {
    carrinho.appendChild(createCartItemElement(objetoId));
    atualizarLocalStorage();
  });
}

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  const botao = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  botao.addEventListener('click', buscaId);
  section.appendChild(botao);
  return section;
}

window.onload = function onload() {
  const ol = document.querySelector('ol');
  const botao = document.querySelector('.empty-cart');
  botao.addEventListener('click', () => {
    ol.innerHTML = '';
    atualizarLocalStorage();
  });
  resgataLocalStorage();
  for (let i = 0; i < ol.children.length; i += 1) {
    ol.children[i].addEventListener('click', cartItemClickListener);
  }
  const listaDeProdutos = document.querySelector('.items');
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(resposta => resposta.json())
  .then((objetoResposta) => {
    const arrayProdutos = objetoResposta.results;
    arrayProdutos.forEach(produto =>
      listaDeProdutos.appendChild(createProductItemElement(produto)));
    setTimeout(() => {
      const loading = document.querySelector('.loading');
      loading.parentElement.removeChild(loading);
    }, 3000);
  });
};
