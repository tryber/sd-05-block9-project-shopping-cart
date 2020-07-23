window.onload = function onload() { };
const novoCarrinho = () => {
  const new = JSON.parse(localStorage.getItem('myCart'));
  return new || [];
}
let cart = novoCarrinho();

const loading = document.querySelector('.loading');
let valorTot = 0;
let soma = 0;
let sub = 0;

// Salvar item no carrinho
function salvar() {
  localStorage.setItem('Cart Items', document.querySelector('.cart__items').innerHTML);
  localStorage.setItem('Total Price', document.querySelector('.total-price').innerHTML);
}

// Função pronta
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// Função pronta
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// Soma tot
async function somar() {
  const totalPrice = await document.querySelector('.total-price');
  if (localStorage.carrinho === undefined || localStorage.carrinho === '') {
    totalPrice.innerHTML = 0;
    salvar();
  } else {
    totalPrice.innerHTML = Math.round(((Math.round(valorTot * 100) / 100)
    + (Math.round(soma * 100) / 100) + (Math.round(sub * 100) / 100)) * 100) / 100;
  }
}

// Remover
function cartItemClickListener(event) {
  event.target.remove();
  salvar();
  eventSplit = event.target.innerText.split(' ');
  const valorRmv = eventSplit[eventSplit.length - 1];
  const valorRmv2 = valorRmv.split('$');
  sub -= valorRmv2[1];
  salvar();
  somar();
}

// Função pronta
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// carregar o carrinho
const carregar = () => {
  new()
  .map(itens => createCartItemElement(itens))
  .forEach((product) => {
    document.getElementsByClassName('.cart__items')[0].appendChild(product);
  });
  somar();
};

// Add no carrinho
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
  somar();
}

// Função pronta
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

// Limpar tudo
function clearAll() {
  const itemRmv = document.querySelectorAll('.cart__item');
  itemRmv.forEach((item) => {
    item.remove();
    localStorage.clear();
    valorTot = 0;
    soma = 0;
    sub = 0;
    somar();
    salvar();
  });
}

const botaoLimpar = document.querySelector('.empty-cart');
botaoLimpar.addEventListener('click', clearAll);

/* Função pronta
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
*/
 
window.onload = function onload() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then((data) => {
      data.results.forEach((result) => {
        const product = createProductItemElement({
          sku: result.id,
          name: result.title,
          image: result.thumbnail,
        });
        document.querySelector('.items').appendChild(product);
      });
      document.querySelector('.items').appendChild(product);
    });
  })
  .catch(() => console.log('Erro: API não encontrada'));  
  carregar();
  
  setTimeout(() => {
  loading.remove();
}, 2000);
