const API = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const OBJ = { method: 'GET' };

// Pegar elementos html

const Items = document.querySelector('.items');

// Colocar duas casas após a virgula

function dinheiro(num) {
  return (Math.round(num.toFixed(2) * 100) / 100);
}

/* Assim como no projeto em grupo, a função que atualiza o localStorage tem que ficar no começo
remove tudo e cria de novo(setItem)
*/

function atualizar() {
  const itens = document.querySelector('.cart__items').innerHTML;
  const total = document.querySelector('.total-price').innerHTML;
  localStorage.removeItem('carrinhoDeCompras');
  localStorage.removeItem('totalCompras');
  localStorage.setItem('carrinhoDeCompras', itens);
  localStorage.setItem('totalCompras', total);
}

// produtos na pagina inicial
function montarPag(prod) {
  const pagina = [];
  prod.results.forEach((elementos) => {
    pagina.push(elementos);
  });

// chama o id, nome e imagem dos produtos
  const todosProd = [];
  pagina.forEach((el) => {
    todosProd.push({
      sku: el.id,
      name: el.title,
      image: el.thumbnail,
    });
  });

  return todosProd;
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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Comprar'));

  return section;
}

function criaElementos(n) {
  n.forEach((objetos) => {
    Items.appendChild(createProductItemElement(objetos));
  });
}

// fazer soma
function somar(valor) {
  if (document.querySelector('.total-price').innerText) {
    const todosProdutos = document.querySelectorAll('.cart__item');
    const soma = [];
    todosProdutos.forEach((product) => {
      soma.push(product.innerHTML.match(/([0-9.]){1,}$/)[0]);
    });
    let resultado = 0;
    for (let i = 0; i < soma.length; i += 1) {
      const number = parseFloat(soma[i]);
      resultado += number;
    }
    return dinheiro(resultado);
  }
  return valor;
}

function atualizarPreco(valor) {
  document.querySelector('.total-price').innerText = valor;
}

function cartItemClickListener(event) {
  event.target.remove();
  const preco = somar();
  atualizarPreco(preco);
  atualizar();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function carrinho(data) {
  const objForCartItem = {
    sku: data.id,
    name: data.title,
    salePrice: data.price,
  };
  const li = createCartItemElement(objForCartItem);
  const ol = document.querySelector('.cart__items');
  ol.appendChild(li);
  const price = dinheiro(objForCartItem.salePrice);
  return price;
}

// funcao assincrona
const IdItem = async (id) => {
  const URL = `https://api.mercadolibre.com/items/${id}`;
  const response = await fetch(URL);
  const data = await response.json();
  const obj = await carrinho(data);
  const preco = await somar(obj);
  atualizarPreco(preco);
  atualizar();
};

const IdProd = (event) => {
  const acessarSection = event.target.parentNode;
  const idFirstElement = acessarSection.firstChild.innerText;
  IdItem(idFirstElement);
};

// botao adicionar
function queryButtons() {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((item) => {
    item.addEventListener('click', IdProd);
  });
}

// gravar o carrinho
function recuperaLocalStorage() {
  const dadosGravados = localStorage.getItem('carrinhoDeCompras');
  const total = localStorage.getItem('totalCompras');
  document.querySelector('.cart__items').innerHTML = dadosGravados;
  const cartItem = document.querySelectorAll('.cart__item');
  cartItem.forEach(elementos => elementos.addEventListener('click', cartItemClickListener));
  document.querySelector('.total-price').innerText = total;
}

// limpar carrinho, atualiza o localStorage
function emptycart() {
  const empt = document.querySelector('.empty-cart');
  empt.addEventListener('click', function () {
    document.querySelector('.cart__items').innerHTML = '';
    document.querySelector('.total-price').innerHTML = '';
    atualizar();
  });
  document.querySelector('.loading').remove();
}

// criar o loading
function loading() {
  document.querySelector('.loading').innerHTML = 'loading...';
}

// Fetch API retorna as promisses
window.onload = function onload() {
  recuperaLocalStorage();
  fetch(API, OBJ)
    .then(response => response.json())
    .then(jsonResponse => montarPag(jsonResponse))
    .then(n => criaElementos(n))
    .then(loading())
    .then(queryButtons)
    .then(emptycart);
};
setTimeout(() => {
  document.getElementsByClassName('loading')[0].remove();
}, 2000);
