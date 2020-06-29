function carrinhoSalvo() {
  const cartLocal = document.getElementsByClassName('cart__items')[0];
  localStorage.setItem('CartLocal', cartLocal.innerHTML);
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

function cartItemClickListener(event) {
  // coloque seu código aqui
  const clicou = event.target;
  if (clicou.classList.contains('cart__item')) {
    clicou.remove();
  }
  carrinhoSalvo();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addToCarrinho({ sku }) {
  fetch(`https://api.mercadolibre.com/items/${sku}`)
  .then(response => response.json())
  .then((data) => {
    const item = document.querySelector('.cart__items');
    const novoItem = createCartItemElement({
      sku: data.id,
      name: data.title,
      salePrice: data.price,
    });
    item.appendChild(novoItem);
    carrinhoSalvo();
  });
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const botaoDeAdd = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  botaoDeAdd.addEventListener('click', () => {
    addToCarrinho({ sku });
  });
  section.appendChild(botaoDeAdd);
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(response => response.json())
  .then((data) => {
    data.results.forEach((item) => {
      const produto = createProductItemElement({
        sku: item.id,
        name: item.title,
        image: item.thumbnail,
      });
      document.querySelector('.items').appendChild(produto);
    });
  });

window.onload = function onload() {
  document.getElementsByClassName('cart__items')[0].innerHTML = localStorage.getItem('CartLocal');
  if (localStorage.getItem('CartLocal') !== undefined) {
    const evento = document.querySelectorAll('.cart__item');
    evento.forEach(item => item.addEventListener('click', cartItemClickListener));
  }
};
