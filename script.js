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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const productClicked = event.target;
  if (productClicked.classList.contains('cart__item')) {
    const info = productClicked.innerText.split(' ');
    let productsListStorage = localStorage.productsList.split(',');
    const index = productsListStorage.indexOf(info[1]);
    productsListStorage.splice(index, 1);
    localStorage.productsList = productsListStorage;
    productClicked.remove();
  }
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addToCart(ID) {
  fetch(`https://api.mercadolibre.com/items/${ID}`)
  .then(response => response.json())
  .then(function (data) {
    const productInformation = {
      sku: data.id,
      name: data.title,
      salePrice: data.price,
    };
    let productsListStorage = [];
    (localStorage.productsList) ? productsListStorage = [localStorage.productsList] : productsListStorage = [];
    productsListStorage.push(productInformation.sku);
    localStorage.productsList = productsListStorage;
    const productElement = createCartItemElement(productInformation);
    document.getElementsByClassName('cart__items')[0].appendChild(productElement);
  });
}

function loadProducts() {
  const productList = document.getElementsByClassName('items')[0];
  function getProduct(e) {
    const productSelected = e.target;
    if (productSelected.classList.contains('item__add')) {
      const productSelectedID = productSelected.parentNode.firstChild.innerText;
      addToCart(productSelectedID);
    }
  }
  productList.addEventListener('click', getProduct);
}

window.onload = function onload() {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(url)
    .then(response => response.json())
    .then(function (data) {
      data.results.forEach((element) => {
        const productInformation = {
          sku: element.id,
          name: element.title,
          image: element.thumbnail,
        };
        const productElement = createProductItemElement(productInformation);
        document.getElementsByClassName('items')[0].appendChild(productElement);
      });
    })
    .then(function () { loadProducts(); })
    .catch((error) => {
      document.getElementsByClassName('items')[0].innerHTML = error;
    });
};
