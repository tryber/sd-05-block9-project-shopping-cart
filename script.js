function atualizaValor(texto) {
  return parseFloat(texto.innerText.substr(texto.innerText.indexOf('PRICE: $') + 8));
}

async function valorTotal() {
  const listaDeItens = document.getElementsByClassName('cart__items')[0];
  const itens = [...listaDeItens.children];
  const valorDeTudo = itens.reduce((acumulador, atual) => (acumulador + atualizaValor(atual)), 0);
  document.querySelector('.total-price').innerHTML = valorDeTudo;
}
/* valor.innerHTML = Array.from(ol.innerHTML).reduce((acumulador, atual) => 
  acumulador + (atualizaValor(atual)), 0);
document.querySelector('.total-price').innerHTML = valor; */

function atualizarLocalStorage() {
  const ol = document.querySelector('ol');
  const valor = document.querySelector('.total-price');
  localStorage.setItem('ol', ol.innerHTML);
  localStorage.setItem('valor', valor.innerHTML);
}

function resgataLocalStorage() {
  const valor = document.querySelector('.total-price');
  const ol = document.querySelector('ol');
  ol.innerHTML = localStorage.getItem('ol');
  valor.innerHTML = localStorage.getItem('valor');
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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// removendo o item da lista ao ser clicado
function cartItemClickListener(event) {
  const itemLiClicado = event.target;
  itemLiClicado.parentElement.removeChild(itemLiClicado);
  atualizarLocalStorage();
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// objetoId é um objeto com todos os dados do elemento retornado pela API
function buscaId(evento) {
  const idDoProduto = evento.target.parentElement.firstChild.innerText;
  const carrinho = document.querySelector('ol.cart__items');
  fetch(`https://api.mercadolibre.com/items/${idDoProduto}`)
  .then(idListaDeProdutos => idListaDeProdutos.json())
  .then((objetoId) => {
    carrinho.appendChild(createCartItemElement(objetoId));
    atualizarLocalStorage();
  });
}

// sku é o id
// esta função cria a section e cria spans, img e button como filhas de section
// que são criados chamando a função de cima que recebe 3 param, o elemento
// a ser criado, a classe e o valor

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  const botao = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  botao.addEventListener('click', buscaId);
  section.appendChild(botao);
  return section;
}

window.onload = function onload() {
  const ol = document.querySelector('ol');
  const botaoLimpaTudo = document.querySelector('button.empty-cart');
  botaoLimpaTudo.addEventListener('click', function () {
    ol.innerHTML = '';
    atualizarLocalStorage();
  });
  resgataLocalStorage();
  for (let i = 0; i < ol.children.length; i += 1) {
    ol.children[i].addEventListener('click', cartItemClickListener);
  }
  const listaDeProdutos = document.querySelector('section.items');
  // fetch requer uma , retorna rejected ou resolved, é assíncrono
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  // then recebe como param uma arrow function e coloca todo o valor da requisição na resposta:
  // resposta é param da gunção e só pode ser acessada e existe dentro da arrow function
  // json é um método e requer uso de () para ser chmado e aqui ele converte o resultado
  // da requisição em um objeto
  .then(resposta => resposta.json())
  // .then é em cascata, sempre guarda o dado do then de cima para ser usado no próximo
  .then((objetoResposta) => {
    const arrayProdutos = objetoResposta.results;
    arrayProdutos.forEach(produto =>
      listaDeProdutos.appendChild(createProductItemElement(produto)));
    // acessando a propriedade results do objetoRespost
    // incluindo o texto loading:
    setTimeout(() => {
      const loading = document.querySelector('span.loading');
      loading.parentElement.removeChild(loading);
    }, 3000);
  });
};
