
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

// sku é o id
// esta função cria a section e cria spans, img e button como filhas de section
// que são criados chamando a função de cima que recebe 3 param, o elemento
// a ser criado, a classe e o valor

function createProductItemElement({ id, title, thunbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thunbnail));
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

window.onload = function onload() {
  const produtos = document.querySelector('section.items');
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
      produtos.appendChild(createProductItemElement(produto)));
    // acessando a propriedade results do objetoRespost
  });
};
