const cart = () => {
  const carregado = JSON.parse(localStorage.getItem('compras'));
  return carregado || [];
};
const carrinho = cart();
const salvar = () => {
  localStorage.setItem('compras', JSON.stringify(carrinho));
};

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

/* function cartItemClickListener() {
  const itemRmv = event.target;
  itemRmv.classList = 'remove';
  const rmv = document.getElementsByClassName('remove');
} */

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addToCart({ sku }) {
  await fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(response => response.json())
    .then((data) => {
      const itemAdd = {
        name: data.title,
        salePrice: data.price,
        id: sku,
      };
      carrinho.push(itemAdd);
      const cartItems = document.getElementsByClassName('cart__items')[0];
      cartItems.appendChild(createCartItemElement(itemAdd));
    });
  salvar();
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const botaoAdd = section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  botaoAdd.addEventListener('click', () => {
    addToCart({ sku });
  });
  section.appendChild(botaoAdd);
  return section;
}

window.onload = function onload() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(async (response) => {
      response.json();
    })
    .then((data) => {
      data.results.forEach((result) => {
        const product = createProductItemElement({
          sku: result.id,
          name: result.title,
          mage: result.thumbnail,
        });
        document.querySelector('.items').appendChild(product);
      });
    });
};
