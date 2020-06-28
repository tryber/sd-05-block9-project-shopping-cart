let carrinhoSalvo = [] || JSON.parse(localStorage.getItem('carrinho'));
// console.log(carrinhoSalvo);
let total = 0
function salvaCarrinho() {
  localStorage.setItem('carrinho', JSON.stringify(carrinhoSalvo));
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

function cartItemClickListener(event) {
  const itemExcluido = event.target;
  const filtro = [];
  carrinhoSalvo.forEach((produto) => {
    const { sku, salePrice } = produto;
  // pega localStorage ( carrinho) e exclui item clicado
    if (!`${itemExcluido.innerHTML}`.includes(sku)) filtro.push(produto);
    total -= salePrice;
  });
  carrinhoSalvo = undefined;
  carrinhoSalvo = filtro;
  salvaCarrinho();
  // pega carrinho e exclui item clicado
  document.getElementsByTagName('ol')[0].removeChild(itemExcluido);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getSkuFromProductItem(item) {
  const itemClicado = item.target.sku;
  // faz uma requição do produto selecionado a API
  fetch(`https://api.mercadolibre.com/items/${itemClicado}`)
  .then(response => response.json())
  .then(function (produtoAdicionado) {
    // quebrando em informacoes do produto o objeto convertido
    const { id: sku, title: name, price: salePrice, thumbnail: image } = produtoAdicionado;
    // criando objeto para guardar no localStorage
    const novoItem = { sku, name, salePrice, image };
    carrinhoSalvo.push(novoItem);
    // console.log(carrinhoSalvo);
    const itemDoCarrinho = document.getElementsByTagName('ol')[0];
    // cria as informacoes do produto selecionado que serao exibidas
    const li = createCartItemElement({ sku, name, salePrice });
    // anexando o produto escolhido dentro do carrinho
    itemDoCarrinho.appendChild(li);
    // salvando no localStorage
    total += salePrice;
    salvaCarrinho();
  });
  // return item.querySelector('span.item__sku').innerText;
}

window.onload = function onload() {
  const items = document.getElementsByClassName('items')[0];
  const source = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

  fetch(source)
    .then(response => response.json())
    .then(function (object) {
      // console.log(object.results[0]);
      object.results.map(function (product) {
        //  quebrando os dados recebido em informacoes do produto
        const { id: sku, title: name, thumbnail: image } = product;
        // produto --codigo -----nome ---------- foto
        // passando os parametros para a funcao para personalizar
        const div = createProductItemElement({ sku, name, image });
        div.lastChild.sku = sku;
        // adicinando escuta a cada botao da lista de produtos
        div.lastChild.addEventListener('click', getSkuFromProductItem);
        // anexando o retorno da funcao (produto criado) dentro de um elemento do html.
        return items.appendChild(div);
      });
    });
  if (localStorage.getItem('carrinho') !== '') {
    carrinhoSalvo = [];
    carrinhoSalvo = (JSON.parse(localStorage.getItem('carrinho')));
    carrinhoSalvo.forEach(produto => document
      .getElementsByTagName('ol')[0].appendChild(createCartItemElement(produto)),
    );
  }
};
// const Carrinho = cartItemClickListener(evento)
// getSkuFromProductItem(item);
// createCartItemElement({ sku, name, salePrice });
