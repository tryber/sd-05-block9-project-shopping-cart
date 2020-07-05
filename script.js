/*
function* generatorId() {
  let id = 1;
  while (true) {
    yield id;
    id += 1;
  }
}
*/

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText, id) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (id !== undefined) {
    e.id = id;
  }
  return e;
}

function getSkuFromProductItem(item) {
  const id = item.querySelector('span.item__sku').innerText;
  item.classList.toggle('selected');
  return id;
}

function updateOl() {
  const ol = document.getElementsByClassName('cart__items')[0];
  localStorage.setItem('cartNow', ol.innerHTML);
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  const father = event.target.parentNode;
  father.removeChild(event.target);
  updateOl();
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getClickList(event) {
  if (event.target.className === 'item__add') {
    const id = getSkuFromProductItem(event.target.parentNode);
    fetch(`https://api.mercadolibre.com/items/${id}`)
    .then(response => response.json())
    .then((data) => {
      const ol = document.getElementsByClassName('cart__items')[0];
      ol.appendChild(createCartItemElement(data));
    })
    .then(() => updateOl());
  }
}

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id, id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  section.addEventListener('click', getClickList);
  return section;
}

window.onload = function onload() {
  const ol = document.getElementsByClassName('cart__items')[0];
  ol.innerHTML = localStorage.getItem('cartNow');
  if (ol.children.length > 0) {
    for (let i = 0; i < ol.children.length; i += 1) {
      ol.children[i].addEventListener('click', cartItemClickListener);
    }
  }
  const sectionProducts = document.getElementsByClassName('items')[0];
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const resultSummom = [];
  fetch(url)
  .then(data => data.json())
  .then(data => data.results.forEach((result) => {
    sectionProducts.appendChild(createProductItemElement(result));
    resultSummom.push(result);
  }))
  .then(data => data);
};
