const getCart = () => {
  const newCart = JSON.parse(localStorage.getItem('cart'));
  return newCart || [];
};

let cart = getCart();

const saveCart = () => {
  console.log(cart);
  localStorage.setItem('cart', JSON.stringify(cart));
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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
  const remakeCart = cart.filter(({ sku: id }) => id !== event.target.id);
  cart = remakeCart;
  saveCart();
  sumTotalPrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.id = sku;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

loadCart = () => {
  getCart()
    .map(product => createCartItemElement(product))
    .forEach(prod => {
      document.querySelector('.cart__items').appendChild(prod);
    });
    sumTotalPrice();
};

async function addToCart({ sku }) {
  await fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(response => response.json())
    .then(data => {
      const newCartItem = {
        sku: data.id,
        name: data.title,
        salePrice: data.price,
      };
      cart.push(newCartItem);
      document.querySelector('.cart__items').appendChild(createCartItemElement(newCartItem));
    });
  saveCart();
  sumTotalPrice();
}

const sumTotalPrice = async () => {
  const total = document.querySelector('.total-price');
  total.innerText = cart.reduce((acc, item) => acc + item.salePrice, 0);
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const addToCartBtn = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  addToCartBtn.addEventListener('click', () => {
    addToCart({ sku });
  });
  section.appendChild(addToCartBtn);
  return section;
}

window.onload = function onload() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then(data => {
      data.results.forEach(item => {
        const product = createProductItemElement({
          sku: item.id,
          name: item.title,
          image: item.thumbnail,
        });
        document.querySelector('.items').appendChild(product);
      });
    });
  loadCart();
};
