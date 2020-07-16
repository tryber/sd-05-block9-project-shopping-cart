let ListaProdutos = [];
let produtos = [];
let cart = null;

window.onload = function onload() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(async (response)=> {
      const result = await response.json();
     ListaProdutos = result.results;
    })

    .then(() =>
      produtos = ListaProdutos.map(({ id, title, thumbnail }) => ({ sku: id, name: title, image: thumbnail })))
    .then(() => {
      defineLista();
      pushList();
      console.log("hbfkjhdsfjhsd");
    })
  };

function pushList() {
  const preco = createCustomElement('span', 'total-price', 0);
  let total = 0;
  cart.forEach(item => {
    const li = createCartItemElement(item)
    li.id = item.id;
    total += item.salePrice;
    document.querySelector('.cart__item').appendChild(li);
  })

  document.querySelector('.cart').appendChild(preco);
}

function listaDoCarrinho () {
  const preco = createCustomElement('span', 'total-price', 0);
  let total = 0;
  cart.forEach((item) => {
    const li = createCartItemElement(item);
    li.id = item.id;
    total += item.salePrice;
    document.querySelector('.cart__items').appendChild(li);
  });
  document.querySelector('.cart').appendChild(preco);
  //imprimeTotal(total);
}

function defineLista () {
  produtos.forEach(produto => {
    const { sku } = produtos;
    const item = createProductItemElement(produto);
    item.lastElementChild.sku = sku;
    item.lastElementChild.addEventListener('click', addItemToCart())
    document.querySelector('.items').appendChild(item);
  })
}

function addItemToCart (event) {
  const { sku:evsku } = event.target;
  let li = null;
  fetch(`https://api.mercadolibre.com/items/${evsku}`)
  .then(async (data) => {
    const { id: sku, title: name, price: salePrice } = await data.json();
    const result = { sku, name, salePrice };
    li = createCartItemElement(result);
    result.id = `${sku}${cart.length}${Math.round(Math.random() * 1E7)}`
    li.id = result.id;
    adicionaItemNoStorage(result);
  })
  .then(() => {
    if (li) document.querySelector('.cart__items').appendChild(li);
  })
}

function adicionaItemNoStorage (item) {
  cart.push(item);
  atualizaItemNoStorage();
}

function atualizaItemNoStorage() {
  if (typeof Storage != 'undefined') {
    cart = cart || JSON.parse(localstorage.getItem('cart'));
    if (!cart) cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
  } else {
    console.error('Esse navegador não salva pedidos.')
  }
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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}