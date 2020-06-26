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
  console.log(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
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
        const produto = {};
        //  quebrando os dado recebido em informacoes do produto
        produto.sku = product.id;     // codigo do produto
        produto.name = product.title;     // nome do produto
        produto.image = product.thumbnail;      // foto do produto
        // passando os parametros para a funcao para personalizar
        const div = createProductItemElement(produto);
        // anexando o retorno da funcao (produto criado) dentro de um elemento do html.
        return items.appendChild(div);
      });
    });
};

getSkuFromProductItem(item);
createCartItemElement({ sku, name, salePrice });
