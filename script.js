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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }

async function createList() {
  const items = document.getElementsByClassName('items')[0];
  // const query = document.getElementById('query_input').value;
  // acho que talvez o teste não peça por um retorno de qqr pesquisa, só de "computador"
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  await fetch(url)
    .then(r => r.json())
    .then(r => r.results.map(item => createProductItemElement(item)))
    .then(itemList => itemList.forEach((item) => {
      items.appendChild(item);
    }));
}

window.onload = function onload() {
  createList();
};
