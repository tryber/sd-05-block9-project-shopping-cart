// const itemClicado = document.querySelector('')
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
<<<<<<< HEAD
  return item.target.sku;
  //return item.querySelector('span.item__sku').innerText;
=======
  return item.querySelector('span.item__sku').innerText;
>>>>>>> refs/remotes/origin/Elisangelo-project-shopping-cart
}

function cartItemClickListener(event) {
  const itemClicado = getSkuFromProductItem(event);
  // faz uma requição do produto selecionado a API
  fetch(`https://api.mercadolibre.com/items/${itemClicado}`)
  .then(response => response.json())
  .then(function (produtoAdicionado) {
    // quebrando em informacoes do produto o objeto convertido
    const { id: sku, title: name, thumbnail: image, price: salePrice } = produtoAdicionado;
    const carrinho = document.getElementsByTagName('ol')[0];
    // cria as informacoes que serao exibidas
    const ol = createCartItemElement({ sku, name, salePrice });
    const img = document.createElement('div');
    img.appendChild(createProductImageElement(image));
    // anexando o produto escolhido dentro do carrinho
    return carrinho.appendChild(img).appendChild(ol);
  });
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
<<<<<<< HEAD
  li.addEventListener('click', getSkuFromProductItem);
=======
  li.addEventListener('click', cartItemClickListener);
>>>>>>> refs/remotes/origin/Elisangelo-project-shopping-cart
  return li;
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
        div.addEventListener('click', cartItemClickListener);
        // anexando o retorno da funcao (produto criado) dentro de um elemento do html.
        return items.appendChild(div);
      });
    });
};

// getSkuFromProductItem(item);
// createCartItemElement({ sku, name, salePrice });
