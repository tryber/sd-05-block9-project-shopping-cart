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

// ANCHOR

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  console.log(sku);
  section.appendChild(createCustomElement('span', 'item__title', name));
  console.log(name);

  section.appendChild(createProductImageElement(image));
  console.log(image);

  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );

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

// ANCHOR

window.onload = function onload() {
  const API_computador_URL =
    'https://api.mercadolibre.com/sites/MLB/search?q=$computador';

  const myObject = {
    method: 'GET',
    headers: { Accept: 'application/json' },
  };

  let allProducts = [];

  const fetchMercadoLivre = () => {
    fetch(API_computador_URL, myObject)
      .then((response) => response.json())
      .then((data) => {
        allProducts = data.results;
        return allProducts;
      })
      .then((produtos) => {
        produtos.forEach((produto) => {
          let obj = {
            sku: produto.id,
            name: produto.title,
            image: produto.thumbnail,
          };
          const items = document.getElementsByClassName('items')[0];
          let section = createProductItemElement(obj);
          items.appendChild(section);
        });
      });
  };

  fetchMercadoLivre();
};

// console.log(allProducts)
