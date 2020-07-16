let ListaProdutos = [];
let produtos = [];
let cart = [];
window.onload = function onload() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    //Baixa os dados da api.
    .then(async (response)=> {
      const result = await response.json();
     ListaProdutos = result.results;
    })
    //Prenchendo a lista de produtos.
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
  //imprime total,que recebe como parametro total
}

function defineLista() {
  produtos.forEach(produto => {
    const { sku } = produto;
    const item = createProductItemElement(produto);
    item.lastElementChild.sku = sku;
    //item.lastElementChild.addEventListener('click',adicionaItemNoCarrinho);
    document.querySelector('.items').appendChild(item);
  })
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
