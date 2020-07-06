function atualizaStorage() {
  const acessaItem = document.querySelector('.cart__items');
  localStorage.setItem('carrinho', acessaItem.innerHTML);
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  const pai = event.target.parentNode;
  pai.removeChild(event.target);
  // event.target.parentNode.removeChild(event.target);
  atualizaStorage();
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createCustomElement(element, className, innerText, id) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') {
    e.addEventListener('click', () => {
      fetch(`https://api.mercadolibre.com/items/${id}`)
      .then(response => response.json())
      .then(dados => createCartItemElement(dados))
      .then(li => document.querySelector('.cart__items').appendChild(li))
      .then(() => atualizaStorage());
    });
  }
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!', sku));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

window.onload = function onload() {
  const acessaItem = document.querySelector('.cart__items');
  const botao = document.querySelector('.empty-cart');
  botao.addEventListener('click', () => {
    acessaItem.innerHTML = null;
    atualizaStorage();
  }); // htmlelement.addEventListener('evento que estou esperando', função que devo realizar)
  acessaItem.innerHTML = localStorage.getItem('carrinho');
  if (acessaItem.children.length > 0) {
    for (let i = 0; i < acessaItem.children.length; i += 1) {
      acessaItem.children[i].addEventListener('click', cartItemClickListener);
    }
  }
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(response => response.json())
  .then(dados => dados.results.forEach(produto =>
    document.querySelector('.items').appendChild(
    createProductItemElement({ sku: produto.id, name: produto.title, image: produto.thumbnail }))));
};
