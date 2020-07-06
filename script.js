function atualizandoStorage() {
  const ol = document.getElementsByClassName('cart__items')[0];
  localStorage.setItem('carrinho', ol.innerHTML);
  const prices = document.querySelector('.total-price');
  localStorage.setItem('Soma da compra', prices.innerHTML);
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

async function valor(price) {
  const dinheirinho = document.querySelector('.total-price');
  // console.log(dinheirinho);
  dinheirinho.innerHTML = parseFloat(dinheirinho.innerHTML) + price;
  // console.log(dinheirinho);
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  atualizandoStorage();
  const father = event.target.parentNode;
  // console.log(event.target);
  let price = event.target.innerHTML;
  price = parseFloat(price.substr(price.indexOf('PRICE: $') + 8));
  valor(-price);
  father.removeChild(event.target);
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  valor(price);
  return li;
}

function createCustomElement(element, className, innerText, sku) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') {
    e.addEventListener('click', () => {
      fetch(`https://api.mercadolibre.com/items/${sku}`)
      .then(response => response.json())
      .then(dados => createCartItemElement(dados))
      .then(li => document.querySelectorAll('.cart__items')[0].appendChild(li))
      .then(() => atualizandoStorage());
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
  const ol = document.getElementsByClassName('cart__items')[0];
  const prices = document.querySelector('.total-price');
  document.querySelector('.empty-cart').addEventListener('click', () => {
    ol.innerHTML = '';
    prices.innerHTML = 0;
    atualizandoStorage();
  });
  ol.innerHTML = localStorage.getItem('carrinho');
  prices.innerHTML = localStorage.getItem('Soma da compra');
  if (localStorage.getItem('Soma da compra') !== null) {
    prices.innerHTML = localStorage.getItem('Soma da compra')
  }
  if (ol.children.length > 0) {
    for (let i = 0; i < ol.children.length; i += 1) {
      ol.children[i].addEventListener('click', this.cartItemClickListener);
    }
  }
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(response => response.json())
  .then(dados => dados.results.forEach(produto =>
    document.querySelector('.items').appendChild(
    createProductItemElement({ sku: produto.id, name: produto.title, image: produto.thumbnail }))));
};
