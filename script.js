window.onload = function onload() { };

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

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function adicionarItem({ sku }) {
  const linko = `https://api.mercadolibre.com/items/${sku}`;
  fetch(linko)
    .then(response => response.json())
    .then(data =>
      document.getElementsByClassName('cart__items')[0].appendChild(
        createCartItemElement({
          sku: data.id,
          name: data.title,
          salePrice: data.price,
        }),
      ),
    );
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  // section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  const btnCerto = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  btnCerto.addEventListener('click', () => {
    adicionarItem({ sku });
  });
  section.appendChild(btnCerto);
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

window.onload = function onload() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then(data =>
      data.results.forEach((obj) => {
        const product = {
          sku: obj.id,
          name: obj.title,
          image: obj.thumbnail,
        };
        const elem = createProductItemElement(product);
        document.getElementsByClassName('items')[0].appendChild(elem);
      },
      ),
    );
};
