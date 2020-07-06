const botaoExcluirItems = document.querySelector('.empty-cart');
const totalPrice = document.querySelector('.total-price');
let soma = 0;
let subtracao = 0;

const salvaCarrinho = () => {
  const carrinhoSalvo = document.getElementsByTagName('ol')[0].innerHTML;
  localStorage.setItem('carrinho', carrinhoSalvo);
};

const somaPrice = () => {
  const total = (soma - subtracao);
  totalPrice.innerText = `${total}`;
  return total;
};

const limparCarrinho = () => {
  document.getElementsByTagName('ol')[0].innerHTML = '';
  localStorage.setItem('carrinho', '');
  soma = 0;
  somaPrice();
};

botaoExcluirItems.addEventListener('click', limparCarrinho);

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
  const itemExcluido = event.target;
  const valor = itemExcluido.innerText;
  subtracao += Number(valor.slice(valor.indexOf('$') + 1));
  if (somaPrice() === 0) {
    soma = 0;
    subtracao = 0;
  }
  const carrinhoDeCompras = document.getElementsByTagName('ol')[0];
  carrinhoDeCompras.removeChild(itemExcluido);
  salvaCarrinho();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getSkuFromProductItem(item) {
  fetch(`https://api.mercadolibre.com/items/${item}`)
  .then(response => response.json())
  .then(function (produtoAdicionado) {
    const { id: sku, title: name, price: salePrice } = produtoAdicionado;
    const itemDoCarrinho = document.getElementsByTagName('ol')[0];
    itemDoCarrinho.appendChild(createCartItemElement({ sku, name, salePrice }));
    salvaCarrinho();
    soma += salePrice;
    somaPrice();
  });
}

function createProductItemElement({ sku, name, image }) {
  const items = document.getElementsByClassName('items')[0];
  const section = document.createElement('section');
  //
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const div = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  //
  div.addEventListener('click', () => getSkuFromProductItem(sku));
  section.appendChild(div);
  items.appendChild(section);
}

const source = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

fetch(source)
  .then(response => response.json())
  .then(function (object) {
    object.results.map(function (product) {
      const { id: sku, title: name, thumbnail: image } = product;
      return createProductItemElement({ sku, name, image });
    });
  });

window.onload = function onload() {
  document.getElementsByTagName('ol')[0].innerHTML = localStorage.getItem('carrinho');
  if (localStorage.getItem('carrinho') !== undefined) {
    let carregaValor = 0;
    const excluirItems = document.getElementsByClassName('cart__item');
    Array.from(excluiItem).forEach(async (item) => {
      item.addEventListener('click', cartItemClickListener);
      const valor = item.innerText;
      carregaValor += Number(valor.slice(valor.indexOf('$') + 1));
    });
    soma = carregaValor;
    somaPrice();
  }
};
