// 4. function to get items from local Storage
const getCart = () => {
  const newCart = JSON.parse(localStorage.getItem('myCart'));
  return newCart || [];
};

let cart = getCart();

const saveCart = () => {
  localStorage.setItem('myCart', JSON.stringify(cart));
};

// 5. function to sum prices of items who was added to cart
const sumTotal = async () => {
  const total = document.querySelector('.total-price');
  total.innerText = cart.reduce((acc, item) => acc + item.salePrice, 0);
};

// 3. function to remove item drom the cart when clicked
function cartItemClickListener(event) {
  event.target.remove();
  const remakeCart = cart.filter(({ id }) => `${id}` !== event.target.id);
  cart = remakeCart;
  saveCart();
  sumTotal();
}

// DEFAULT - function to create an item to add to cart
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// 2. function to add item by id on the cart
async function addToCart({ sku }) {
  const response = await fetch(`https://api.mercadolibre.com/items/${sku}`);
  const data = await response.json();
  const cartItem = document.querySelectorAll('.cart__items')[0];
  const addNewCartItem = createCartItemElement({
    sku: data.id,
    name: data.title,
    salePrice: data.price,
  });
  cartItem.appendChild(addNewCartItem);
  saveCart();
  sumTotal();
}

// DEFAULT - function to create image to product item came from json
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// DEFAULT - function to create custom element with class and text
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// DEFAULT - function to create product item by json
// (edit function to add event on the 'add to cart' button)
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const btnAddCart = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  btnAddCart.addEventListener('click', () => {
    addToCart({ sku });
  });
  section.appendChild(btnAddCart);
  return section;
}

// 6. button to clean all items on the cart
async function clearCart() {
  const cartItems = document.getElementsByClassName('cart__items')[0];
  cartItems.innerHTML = '';
  cart = [];
  saveCart();
  sumTotal();
}

// 4. recovery all items saved on the local storage when page load
const loadCart = () => {
  getCart()
    .map(products => createCartItemElement(products))
    .forEach((singleProduct) => {
      document.getElementsByClassName('cart__items')[0].appendChild(singleProduct);
    });
  sumTotal();
};

window.onload = function () {
  const myObject = {
    method: 'GET',
    headers: { Accept: 'application/json' },
  };

  // 1. API request
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador', myObject)
    .then(response => response.json())
    .then((data) => {
      data.results.forEach((element) => {
        const createProduct = createProductItemElement({
          sku: element.id,
          name: element.title,
          image: element.thumbnail,
        });
        document.querySelectorAll('.items')[0]
          .appendChild(createProduct);
      });
    });
  loadCart();
};
