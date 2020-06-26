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

// Requisito 2: babysteps
// 1. Criar function para adicionar id de produto no carrinho, que será o event aplicado ao btn
// Usando fetch e a url passada mas substituindo ItemID pelo id da API (sku no código fornecido)
// E usando como indicado createCartItemElement em filho do cart__items.
function addToCart({ sku }) {
  fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(response => response.json())
    .then((data) => {
      const cartItems = document.querySelector('.cart__items');
      const newCartItem = createCartItemElement({
        sku: data.id,
        name: data.title,
        salePrice: data.price,
      });
      cartItems.appendChild(newCartItem);
    });
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  // 2. (babystep do req. 2), armazenar o button que vai receber eventlistener
  // section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  const buttonAddToCart = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  buttonAddToCart.addEventListener('click', () => {
    addToCart({ sku });
  });
  section.appendChild(buttonAddToCart);
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
window.onload = function onload() {
  fetch(API_URL)
  .then(response => response.json())
    .then((data) => {
      data.results.forEach((product) => {
        const newProduct = createProductItemElement({
          sku: product.id,
          name: product.title,
          image: product.thumbnail,
        });
        const classItems = document.querySelector('.items');
        classItems.appendChild(newProduct);
      });
    });
};
