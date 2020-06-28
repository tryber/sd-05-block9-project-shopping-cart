window.onload = function onload() { };
// Variáveis globais

// Função fornecida
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// Função fornecida
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// Salvar o carrinho de compras
const saveCart = () => {
  localStorage.setItem('Cart Items', document.querySelector('.cart__items').innerHTML);
};

// Remover item do carrinho
function cartItemClickListener(event) {
  event.target.remove();
}

// Esvaziar o carrinho
function emptyCart() {
  const list = document.getElementsByClassName('cart__items')[0];
  list.innerHTML = '';
  saveCart();
}

// Função fornecida
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Criando o objeto para ser adicionado ao carrinho de compras
function cartShop({ sku }) {
  fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(response => response.json())
    .then((data) => {
      const cartItem = document.querySelector('.cart__items')[0];
      const cartActual = createCartItemElement({
        sku: data.id,
        name: data.title,
        salePrice: data.price,
      });
      cartItem.appendChild(cartActual);
      return cartActual;
    });
}

// Função fornecida
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const buttonAdd = section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  buttonAdd.addEventListener('click', () => cartShop(sku));
  return section;
}

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

// Fetch para puxar os dados dos produtos através da API
window.onload = function onload() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
    .then(response => response.json())
    .then((data) => {
      data.results.forEach((element) => {
        const itemInfo = createProductItemElement({
          sku: element.id,
          name: element.title,
          image: element.thumbnail,
        });
        document.querySelector('.items').appendChild(itemInfo);
      });
    })
  .catch(() => console.log('API apresenta erro!'));
};
