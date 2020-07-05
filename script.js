let valStorage = 0;
let soma = 0;
let subtração = 0;

// salvar objeto carrinho
function salvar() {
  localStorage.clear('carrinho');
  const cartSave = document.getElementsByTagName('ol')[0].innerHTML;
  const priceSave = document.querySelector('.total-price').innerHTML;
  localStorage.setItem('carrinho', cartSave);
  localStorage.setItem('price', priceSave);
}

// carregando a foto para o produto
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// carregando as informações para o produto
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// Formato dos produtos da carregados
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// Criar valor total
async function somaAll() {
  const totalPrice = await document.querySelector('.total-price');

  if (localStorage.carrinho === undefined || localStorage.carrinho === '') {
    totalPrice.innerHTML = 0;
    console.log(localStorage);
    salvar();
  } else {
    totalPrice.innerHTML = Math.round(((Math.round(valStorage * 100) / 100)
    + (Math.round(soma * 100) / 100) + (Math.round(subtração * 100) / 100)) * 100) / 100;
    console.log(totalPrice.innerHTML);
    console.log(valStorage);
    console.log(soma);
    console.log(subtração);
    salvar();
  }
}

// Romação de item do carrinho
function cartItemClickListener(event) {
  event.target.classList.contains('select');
  event.target.classList.add('select');
  event.target.remove('select');
  salvar();
  eventSplit = event.target.innerText.split(' ');
  const priceSelect = eventSplit[eventSplit.length - 1];
  const priceSel = priceSelect.split('$');
  subtração -= priceSel[1];
  console.log(subtração);
  somaAll();
}

// Formato do itrm do carrinho
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// carregar itens de produtos no carrinho após apertarem o botão.
function getSkuFromProductItem(item) {
  fetch(`https://api.mercadolibre.com/items/${item}`)
  .then(response => response.json())
  .then((data) => {
    const productAdd = {
      sku: data.id,
      name: data.title,
      salePrice: data.price,
    };
    const cartPai = document.getElementsByClassName('cart__items')[0];
    cartPai.appendChild(createCartItemElement(productAdd));
    salvar();
    soma += data.price;
    console.log(soma);
    somaAll();
  });
}

// Carregar lista de produtos na pagina
function ciateList() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then((data) => {
      data.results.forEach((item) => {
        const product = createProductItemElement({
          sku: item.id,
          name: item.title,
          image: item.thumbnail,
        });
        document.querySelector('.items').appendChild(product);
      });
    })
    // colocando item no carrinho ao apertar o botão
    .then(() => {
      document.querySelectorAll('.item__add').forEach(addItem => addItem
      .addEventListener('click', () => {
        getSkuFromProductItem(addItem.parentElement.querySelector('span.item__sku').innerText);
      }));
    });
}

// chamar a função no final
window.onload = function onload() {
  // retornar localStoreg
  if (localStorage.getItem('carrinho') !== undefined) {
    document.getElementsByTagName('ol')[0].innerHTML = localStorage.getItem('carrinho');
    document.querySelectorAll('li').forEach(li => li.addEventListener('click', cartItemClickListener));
    document.querySelector('.total-price').innerHTML = localStorage.getItem('price');
    console.log(document.querySelector('.total-price').innerHTML);
    valStorage = document.querySelector('.total-price').innerHTML;
  }

  // limpar carrinho
  document.querySelectorAll('.empty-cart').forEach(empty => empty
  .addEventListener('click', () => {
    document.querySelector('ol').innerHTML = '';
    localStorage.removeItem('carrinho');
    valStorage = 0;
    soma = 0;
    subtração = 0;
    salvar();
    somaAll();
  }));

  ciateList();
};
