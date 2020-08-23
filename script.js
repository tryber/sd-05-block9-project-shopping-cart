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
function addToCart(ItemID) {
  fetch(`https://api.mercadolibre.com/items/${ItemID.sku}`)
  .then(response => response.json())
  .then((data) => {
    const addCart = {
      sku: data.id,
      name: data.title,
      salePrice: data.price,
    };
    document.querySelector('.cart__items').appendChild(createCartItemElement(addCart));
  });
} // copiado o fetch de onload porem com novo link, valor de ItemID sendo sku para recuperar id

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', () => { addToCart({ sku }); }); // após mudar evento de add2cart p/ sku parou de dar undefined
  return section;
}

window.onload = function onload() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
    .then(r => r.json()) // transformar dados em json.
    .then(data =>
      data.results.forEach((item) => {
        const product = createProductItemElement({
          sku: item.id,
          name: item.title,
          image: item.thumbnail,
        });
        document.querySelector('.items').appendChild(product);
      }),
    );
};
