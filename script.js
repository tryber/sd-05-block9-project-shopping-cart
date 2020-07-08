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
function addCarrinho(evento) {
  const id = evento.target.parentElement.firstChild.innerHTML;
  const endPoint = `https://api.mercadolibre.com/items/${id}`;
  fetch(endPoint)
  .then(resposta => resposta.json())
  .then((item) => {
    const ol = document.getElementsByClassName('cart__items')[0];
    ol.appendChild(createCartItemElement(item));
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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

window.onload = function onload() {
  const endPoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(endPoint)
  .then(resposta => resposta.json())
  .then(resposta => resposta.results.forEach((produto) => {
    const items = document.getElementsByClassName('items')[0];
    items.appendChild(createProductItemElement(produto));
  }));
};
