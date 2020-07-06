window.onload = function onload() {
  const myObject = {
    method: 'GET',
    headers: { 'Accept': 'application/json' }
  };
  // API request
  fetch("https://api.mercadolibre.com/sites/MLB/search?q=computador", myObject)
    .then(responde => responde.json())
    .then(data => {
      data.results.forEach(element => {
        const createProduct = createProductItemElement({
          sku: element.id,
          name: element.title,
          image: element.thumbnail
        });
        document.querySelectorAll(".items")[0].appendChild(createProduct);
      });

    })
};

const loading = () =>
  document
    .querySelector('.load-container')
    .appendChild(createCustomElement('span', 'loading', 'loading...'));



// getItem from localStorage
const getItem = () => {
  const newCart = JSON.parse(localStorage.getItem('myCart'));
  return newCart || [];
};

let cart = getItem();

// save localStorage
const saveCart = async () => {
  localStorage.setItem('myCart', JSON.stringify(cart));
};

const sum = async () => {
  const totalPrice = document.querySelector('.total-price');
  totalPrice.innerText = cart.reduce((a, b) => a + b.salePrice, 0)
}

function cartItemClickListener(event) {
  event.target.remove();
  saveCart()
  sum()
}

//function to create image to product
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// function to create custom element with class and text
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// function to create product item by json
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const btnAddCart = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  btnAddCart.addEventListener('click', () => {
    addToCArt({ sku })
  });
  section.appendChild(btnAddCart);
  return section;
}

const loadCart = () => {
  getCart()
    .map(products => createCartItemElement(products))
    .forEach((singleProduct) => {
      document.getElementsByClassName('cart__items')[0].appendChild(singleProduct);
    });
  sumTotal();
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// function to clean cart
async function clearCart() {
  const cartItems = document.getElementsByClassName('cart__items')[0];
  cartItems.innerHTML = '';
  cart = [];
  saveCart();
  sumTotal();
}

const clearButton = document.querySelector('.empty-cart');
clearButton.addEventListener('click', clearCart);


// fucntion to create element by json
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// function to add item to cart
async function addToCArt({ sku }) {
  const response = await fetch(`https://api.mercadolibre.com/items/${sku}`)
  const data = await response.json()
  const cart_item = document.querySelectorAll('.cart__items')[0];
  const addNewCArtItem = createCartItemElement({
    sku: data.id,
    name: data.title,
    salePrice: data.price,
  })
  cart_item.appendChild(addNewCArtItem)
  sum()
  saveCart()
}






