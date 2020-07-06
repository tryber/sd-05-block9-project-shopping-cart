function saveCart() {
  const cart = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('carrinho', cart);
}

function load() {
  const cart = localStorage.getItem('carrinho');
  document.querySelector('.cart__items').innerHTML = cart;
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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  const eliminar = event.target;
  eliminar.remove();
  saveCart();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
// prettier-ignore
async function addToCart({ sku }) {
  await fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(response => response.json())
    .then((data) => {
      const ident = { sku: data.id, name: data.title, salePrice: data.price };
      const cartId = createCartItemElement(ident);
      document.querySelector('.cart__items').appendChild(cartId);
    });
  saveCart();
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const botao = createCustomElement(
    'button',
    'item__add',
    'Adicionar ao carrinho!',
  );
  botao.addEventListener('click', () => addToCart({ sku }));
  section.appendChild(botao);
  return section;
}
// prettier-ignore
window.onload = function onload() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then(data =>
      data.results.forEach((element) => {
        const product = createProductItemElement({
          sku: element.id,
          name: element.title,
          image: element.thumbnail,
        });
        document.querySelector('.items').appendChild(product);
      }),
    );
    load();
    document.querySelectorAll('.cart__item').forEach( item => 
      item.addEventListener('click', cartItemClickListener));
};
