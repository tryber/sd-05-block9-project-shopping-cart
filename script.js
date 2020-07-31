let ListaProdutos = [];
let produtos = [];
let cart = null;

function atualizaItemNoStorage() {
  if (typeof Storage !== 'undefined') {
    cart = cart || JSON.parse(localStorage.getItem('cart'));
    if (!cart) cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
  } else {
    console.error('Navegador sem suporte para salvar pedido');
  }
}

function imprimeTotal(total) {
  document.querySelector('.total-price').innerText = total;
}

function calculaEImprimeTotal() {
  let total = 0;
  cart.forEach((element) => {
    total += element.salePrice;
  });
  imprimeTotal(total);
}

function cartItemClickListener(event) {
  const id = event.target.id;
  cart = cart.filter(element => element.id !== id);
  document.querySelector('.cart__items').removeChild(event.target);
  atualizaItemNoStorage();
  calculaEImprimeTotal();
}

function limpaTudo() {
  document.querySelector('.cart__items').innerHTML = '';
  cart = [];
  atualizaItemNoStorage();
  imprimeTotal(0);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function adicionaItemNoStorage(item) {
  cart.push(item);
  atualizaItemNoStorage();
}

function adicionaItemNoCarrinho(event) {
  const { sku: evsku } = event.target;
  let li = null;
  fetch(`https://api.mercadolibre.com/items/${evsku}`)
    .then(async (data) => {
      const { id: sku, title: name, price: salePrice } = await data.json();
      const result = { sku, name, salePrice };
      li = createCartItemElement(result);
      result.id = `${sku} ${cart.length} ${Math.round(Math.random() * 1E7)}`;
      li.id = result.id;
      adicionaItemNoStorage(result);
    })
    .then(() => {
      if (li) document.querySelector('.cart__items').appendChild(li);
      calculaEImprimeTotal();
    });
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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function defineLista() {
  produtos.forEach((produto) => {
    const { sku } = produto;
    const item = createProductItemElement(produto);
    item.lastElementChild.sku = sku;
    item.lastElementChild.addEventListener('click', adicionaItemNoCarrinho);
    document.querySelector('.items').appendChild(item);
  });
}

function pushList() {
  const price = createCustomElement('span', 'total-price', 0);
  let total = 0;
  cart.forEach((item) => {
    const li = createCartItemElement(item);
    li.id = item.id;
    total += item.salePrice;

    document.querySelector('.cart__items').appendChild(li);
  });
  document.querySelector('.cart').appendChild(price);
  printTotal(total);
}

window.onload = function onload() {
  document.querySelector('.empty-cart').addEventListener('click', limpaTudo);
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    // Baixa os dados da api.
    .then(async (response) => {
      const result = await response.json();
      ListaProdutos = result.results;
      atualizaItemNoStorage();
    })
    // Prenchendo a lista de produtos.
    .then(() => {
      produtos = ListaProdutos.map(({ id, title, thumbnail }) =>
      ({ sku: id, name: title, image: thumbnail }));
    })
    .then(() => {
      defineLista();
      pushList();
    });
};

setTimeout(() => {
  const loading = document.querySelector('.loading');
  loading.parentElement.removeChild(loading);
}, 3000);
