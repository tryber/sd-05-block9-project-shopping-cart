window.onload = function onload() {};

const adicionaLoading = () => {
  const elementoLoading = document.createElement('div');
  elementoLoading.className = 'loading';
  const pegaWrapper = document.getElementsByClassName('loading-wrapper')[0];
  pegaWrapper.appendChild(elementoLoading);
};

const removeLoading = () => {
  const pegaDivLoading = document.getElementsByClassName('loading')[0];
  pegaDivLoading.remove();
};

function calculaPrecoFinal() {
  const arraydeItensNoCarrinho = document.querySelectorAll('.cart__item');
  let soma = 0;
  arraydeItensNoCarrinho.forEach((item) => {
    const separadoPeloCifrao = item.innerHTML.split('$')[1];
    soma += parseFloat(separadoPeloCifrao, 10);
    const pegaPosicaoPrecoFinal = document.querySelector('.total-price');
    pegaPosicaoPrecoFinal.innerHTML = Math.round(soma * 100) / 100;
  });
  if (arraydeItensNoCarrinho.length === 0) {
    const pegaPosicaoPrecoFinal = document.querySelector('.total-price');
    pegaPosicaoPrecoFinal.innerHTML = 0;
  }
}

function salvarCompras() {
  localStorage.clear();
  const pegaItensCarrinho = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('conteudoCarrinho', pegaItensCarrinho);

  const pegaSomaFinal = document.querySelector('.total-price').innerHTML;
  localStorage.setItem('total-price', pegaSomaFinal);
}

function carregaListaCompras() {
  const pegaPosicaoListaCarrinhos = document.querySelector('.cart__items');
  pegaPosicaoListaCarrinhos.innerHTML = localStorage.getItem('conteudoCarrinho');

  const pegaSomaFinal = document.querySelector('.total-price');
  pegaSomaFinal.innerHTML = localStorage.getItem('total-price');
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
  event.target.remove();
  calculaPrecoFinal();
  salvarCompras();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function monitoraBotoesAdicionar(event) {
  const idSelecionado = getSkuFromProductItem(event.target.parentNode);
  const urlProduto = `https://api.mercadolibre.com/items/${idSelecionado}`;
  adicionaLoading();
  const response = await fetch(urlProduto);
  const data = await response.json();
  removeLoading();
  const itemCarrinho = createCartItemElement({
    sku: idSelecionado,
    name: data.title,
    salePrice: data.price,
  });
  const pegaPosicaoCarrinho = document.querySelector('.cart__items');
  pegaPosicaoCarrinho.appendChild(itemCarrinho);
  calculaPrecoFinal();
  salvarCompras();
}

function limpaCarrinho() {
  const pegaCarItems = document.querySelector('.cart__items');
  pegaCarItems.innerHTML = '';
  const pegaPosicaoPrecoFinal = document.querySelector('.total-price');
  pegaPosicaoPrecoFinal.innerHTML = '0';
  salvarCompras();
}

async function carregaItensPagina() {
  const URL = 'https://api.mercadolibre.com/sites/MLB/search?q=Computador';
  adicionaLoading();
  const response = await fetch(URL);
  const data = await response.json();
  const arrayResultados = data.results;
  removeLoading();
  //  adiciona cada um dos produtos na página
  arrayResultados.forEach((item) => {
    const produto = createProductItemElement({
      sku: item.id,
      name: item.title,
      image: item.thumbnail,
    });
    const pegaPosicaoClassItems = document.getElementsByClassName('items')[0];
    pegaPosicaoClassItems.appendChild(produto);
  });
  //  se houver algo salvo no localStorage - recarrega o carrinho
  carregaListaCompras();
  const pegaBotoesAdd = document.querySelectorAll('.item__add');
  pegaBotoesAdd.forEach(botao => botao.addEventListener('click', monitoraBotoesAdicionar));

  const pegaPosItensNoCarrinho = document.querySelector('.cart__items');
  pegaPosItensNoCarrinho.addEventListener('click', cartItemClickListener);

  const pegaPosBotaoLimpar = document.querySelector('.empty-cart');
  pegaPosBotaoLimpar.addEventListener('click', limpaCarrinho);
}
carregaItensPagina();
