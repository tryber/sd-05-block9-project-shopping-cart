const apagarTodosOsItensDoCarrinho = () => {
  const ol = document.querySelector('ol');
  while (ol.hasChildNodes()) {
    ol.removeChild(ol.firstChild);
  }
};

const btnApagarTodosOsElementosDaLista = document.querySelector('.empty-cart');
btnApagarTodosOsElementosDaLista.addEventListener('click', apagarTodosOsItensDoCarrinho);

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const ol = document.querySelector('ol');
  const elementoQueGerouOEvento = event.target;
  ol.removeChild(elementoQueGerouOEvento);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: ${salePrice}`; // criar elementos carrinho
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addProdutosHtml = (param) => {
  const elementoOl = document.querySelector('ol');
  elementoOl.appendChild(createCartItemElement(param));
};

const mapeiaProduct = (data) => {
  const mapeiaApiProduct = ({
    sku: data.id,
    name: data.title,
    salePrice: data.price,
  });

  return mapeiaApiProduct;
};

const salvarLocalStorage = () => {
  const lista = [];
  const li = document.getElementsByClassName('cart__item');
  for (let i = 0; i < li.length; i += 1) {
    lista.push(li[i].innerHTML);
  }
  const listaEmTexto = JSON.stringify(lista);
  localStorage.setItem('lista', listaEmTexto);
};

const recuperaListaDoLocalStorage = () => {
  const listaEmTexto = localStorage.getItem('lista');
  if (listaEmTexto != null) {
    const list = JSON.parse(listaEmTexto);
    for (let i = 0; i < list.length; i += 1) {
      const ol = document.querySelector('ol');
      const li = document.createElement('li');
      li.innerHTML = list[i];
      ol.appendChild(li);
    }
  }
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
      addProdutosHtml(produtoMapeado);
      salvarLocalStorage(produtoMapeado);
    });
};

function addtoCartClickListener(event) {
  const sku = getSkuFromProductItem(event.target.parentElement);
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
  button.addEventListener('click', addtoCartClickListener);
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
  const items = document.querySelector('.items');
  items.appendChild(createCustomElement('span', 'loading', 'LOADING...'));
  fetchApi();
  setTimeout(() => {
    document.querySelector('.loading').remove();
  }, 700);
};

recuperaListaDoLocalStorage();

/*
  Quando eu crio elementos no HTML e preciso colocar um
  evento de click, eu acrescento na função que está criando os elementos.
*/
