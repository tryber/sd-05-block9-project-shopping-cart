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
  const carrinhoDeCompras = document.getElementsByTagName('ol')[0];
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
    fetch(`https://api.mercadolibre.com/items/{$itemClicado}`)
    .then(responde => responde.json())
    .then(function (produtoAdicionado) {
      const { id: sku, title: name, price: salePrice } = produtoAdicionado;
      const itemDoCarrinho = document.getElementsByTagName('ol')[0];
      const li = createCartItemElement({ sku, name, salePRice });
    })
}

window.onload = function onload() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(response => response.json())
  .then(function (object) {
    object.results.map(function (product) {
      const produto = {};
      produto.sku = product.id;
      produto.name = product.title;
      produto.image = product.thumbnail;
      const div = createProductItemElement(produto);
      const section = document.querySelector('.items');
      return section.appendChild(div);
    });
  });
};
