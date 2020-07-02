function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: ${salePrice}`; // criar elementos carrinho
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addProdutosHtml = (param) => {
  const elementoOl = document.getElementsByClassName('cart__items')[0];
  elementoOl.appendChild(param);
};

const mapeiaProduct = (data) => {
  const mapeiaApiProduct = ({
    sku: data.id,
    name: data.title,
    salePrice: data.price,
  });

  return mapeiaApiProduct;
};

const getProduct = (sku) => {
  const API_PRODUCT = `https://api.mercadolibre.com/items/${sku}`; // fetch sku
  const myProduct = {
    method: 'GET',
  };
  fetch(API_PRODUCT, myProduct)
    .then(response => response.json())
    .then((data) => {
      console.log(data);
      const produtoMapeado = mapeiaProduct(data);
      const elementosCriados = createCartItemElement(produtoMapeado);
      addProdutosHtml(elementosCriados);
    });
};

function cartItemClickListener(event) {
  const sku = getSkuFromProductItem(event.target.parentElement);
  console.log(sku);
  getProduct(sku);
}

const mapeiaData = (data) => {
  const { results } = data;
  const mapeiaAPI = results.map(elementos => ({
    sku: elementos.id,
    name: elementos.title,
    image: elementos.thumbnail,
  }));

  console.log(mapeiaAPI);
  return mapeiaAPI;
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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', cartItemClickListener);
  section.appendChild(button);
  return section;
}

const addElementos = (data) => {
  const section = document.getElementsByClassName('items')[0];
  data.forEach((elemento) => {
    section.appendChild(createProductItemElement(elemento));
  });
};

const renderContent = (data) => {
  const mapData = mapeiaData(data);
  addElementos(mapData);
};

const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const fetchApi = () => {
  const myObject = {
    method: 'GET',
  };
  fetch(API_URL, myObject)
    .then(response => response.json())
    .then((data) => {
      renderContent(data);
    });
};

window.onload = function onload() {
  fetchApi();
};

/*
  Quando eu crio elementos no HTML e preciso colocar um
  evento de click, eu acrescento na função que está criando os elementos.
*/
