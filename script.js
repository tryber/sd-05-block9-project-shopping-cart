function totalPrice() {
  const itemsCarrinho = document.querySelectorAll('.cart__item');
  let total = 0;
  itemsCarrinho.forEach((item) => {
    const descricaoItem = item.innerText;
    total += Number(descricaoItem.substring(descricaoItem.indexOf('$') + 1));
  });
  document.querySelector('.total-price').innerText = `${total.toFixed(2)}`;
}

function salvarDados() {
  const listaDados = document.querySelectorAll('.cart__item');
  const dados = [];
  listaDados.forEach((item) => {
    dados.push(item.innerText);
  });
  localStorage.setItem('carrinho', dados);
}

function cartItemClickListener(event) {
  evento = event.target;
  evento.parentElement.removeChild(evento);
  salvarDados();
  totalPrice();
}

function carregarDados() {
  const dados = localStorage.carrinho;
  if (dados !== undefined) {
    const listaDados = dados.split(',');
    if (listaDados.length > 1) {
      listaDados.forEach((item) => {
        const li = document.createElement('li');
        li.className = 'cart__item';
        li.innerText = item;
        li.addEventListener('click', cartItemClickListener);
        document.querySelector('.cart__items').appendChild(li);
      });
    }
  }
}

function limpar() {
  const itemsCarrinho = document.querySelectorAll('.cart__item');
  itemsCarrinho.forEach((elemento) => {
    elemento.parentElement.removeChild(elemento);
  });
  salvarDados();
  totalPrice();
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

// function getSkuFromProductItem(item) {
// return item.querySelector('span.item__sku').innerText;
// }

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// window.onload = function onload() { };

fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(response => response.json())
  .then((data) => {
    carregarDados();
    totalPrice();
    document.querySelector('.empty-cart').addEventListener('click', () => limpar());
    data.results.forEach((element) => {
      const product = createProductItemElement({
        sku: element.id,
        name: element.title,
        image: element.thumbnail,
      });
      document.querySelector('.items').appendChild(product);
    });
  })
  .then(() => {
    addBtns = document.querySelectorAll('.item__add');
    addBtns.forEach((btn) => {
      btn.addEventListener('click', (event) => {
        const evento = event.target;
        const idItem = evento.previousElementSibling.previousElementSibling
          .previousElementSibling.innerText;
        fetch(`https://api.mercadolibre.com/items/${idItem}`)
          .then(response => response.json())
          .then((data) => {
            const product = createCartItemElement({
              sku: data.id,
              name: data.title,
              salePrice: data.price,
            });
            document.querySelector('.cart__items').appendChild(product);
            salvarDados();
            totalPrice();
          });
      });
    });
  });
