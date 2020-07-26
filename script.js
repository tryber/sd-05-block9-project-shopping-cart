function refreshLocalStorage() {
  localStorage.clear('cart');
  const cart = document.querySelector('.cart__items');
  const price = document.querySelector('.total-price');
  localStorage.setItem('cart', cart.innerHTML);
  localStorage.setItem('price', price.innerHTML);
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
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

//  implementando a lógica somar preços
let valorItem = 0;
let soma = 0;
let subtracao = 0;
async function somaTotal() {
  const totalPrice = await document.querySelector('.total-price');
  if (localStorage.cart === undefined || localStorage.cart === '') {
    totalPrice.innerHTML = 0;
    refreshLocalStorage();
  } else {
    totalPrice.innerHTML = Math.round(((Math.round(valorItem * 100) / 100)
    + (Math.round(soma * 100) / 100) + (Math.round(subtracao * 100) / 100)) * 100) / 100;
    refreshLocalStorage();
  }
}

function cartItemClickListener(event) {
  event.target.classList.contains('select');
  event.target.classList.add('select');
  event.target.remove('select');
  refreshLocalStorage();
  eSplit = event.target.innerText.split(' ');
  const precoSelect = eSplit[eSplit.length - 1];
  const priceSelect = precoSelect.split('$');
  subtracao -= priceSelect[1];
  somaTotal();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getSkuFromProductItem(item) {
  fetch(`https://api.mercadolibre.com/items/${item}`)
  .then(response => response.json())
  .then((data) => {
    const adicionar = {
      sku: data.id,
      name: data.title,
      salePrice: data.price,
    };
    const parent = document.getElementsByClassName('cart__items')[0];
    parent.appendChild(createCartItemElement(adicionar));
    refreshLocalStorage();
    soma += data.price;
    somaTotal();
  });
}

function createList() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then((data) => {
      data.results.forEach((item) => {
        const produto = createProductItemElement({
          sku: item.id,
          name: item.title,
          image: item.thumbnail,
        });
        document.querySelector('.items').appendChild(produto);
      });
    })
    .then(() => {
      document.querySelectorAll('.item__add').forEach(addItem => addItem
      .addEventListener('click', () => {
        getSkuFromProductItem(addItem.parentElement.querySelector('span.item__sku').innerText);
      }));
    });
}

window.onload = function onload() {
  document.querySelector('.items').appendChild(createCustomElement('span', 'loading', 'loading...'));
  if (localStorage.getItem('cart') !== undefined) {
    document.getElementsByTagName('ol')[0].innerHTML = localStorage.getItem('cart');
    document.querySelectorAll('li').forEach(li => li.addEventListener('click', cartItemClickListener));
    document.querySelector('.total-price').innerHTML = localStorage.getItem('price');
    valorItem = document.querySelector('.total-price').innerHTML;
  }
  document.querySelectorAll('.empty-cart').forEach(empty => empty
  .addEventListener('click', () => {
    document.querySelector('ol').innerHTML = '';
    localStorage.removeItem('cart');
    valorItem = 0;
    soma = 0;
    subtracao = 0;
    refreshLocalStorage();
    somaTotal();
  }));
  setTimeout(() => {
    document.querySelector('.loading').remove();
  }, 2000);

  createList();
};
