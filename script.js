window.onload = function onload() { };

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

function cartItemClickListener(event) {
  // console.log(event.target.id);
  localStorage.removeItem(event.target.id);
  event.target.remove();
  console.log(event.target.className);
  const theoldtotal = parseInt(document.getElementsByClassName('total')[0].innerText);
  document.getElementsByClassName('total')[0].innerText = theoldtotal - parseInt(event.target.className);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.className = salePrice;
  li.id = sku;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  localStorage.setItem(sku, 'item');
  const oldtotal = parseInt(document.getElementsByClassName('total')[0].innerText);
  document.getElementsByClassName('total')[0].innerText = parseInt(salePrice) + oldtotal;
  return li;
}

function adicionarItem(sku) {
  const linko = `https://api.mercadolibre.com/items/${sku}`;
  fetch(linko)
    .then(response => response.json())
    .then(data =>
      document.getElementsByClassName('cart__items')[0].appendChild(
        createCartItemElement({
          sku: data.id,
          name: data.title,
          salePrice: data.price,
        }),
      ),
    );
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  // section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  const btnCerto = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  btnCerto.addEventListener('click', () => {
    adicionarItem(sku);
  });
  section.appendChild(btnCerto);
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function historico() {
  for (let i = 0; i < localStorage.length; i += 1) {
    const hist = localStorage.key(i);
    adicionarItem(hist);
  }
}

function lixo() {
  const allcartitems = document.getElementsByTagName('li');
  for (let i = allcartitems.length - 1; i >= 0; i -= 1) {
    allcartitems[i].remove();
  }
  localStorage.clear();
  document.getElementsByClassName('total')[0].innerText = 0;
}

function createBtn() {
  const btnLixo = document.createElement('button');
  btnLixo.className = 'empty-cart';
  btnLixo.addEventListener('click', lixo);
  btnLixo.innerText = 'Esvaziar o carrinho';
  document.getElementsByClassName('place')[0].appendChild(btnLixo);
}

function createTotal() {
  const total = document.createElement('h2');
  total.className = 'total';
  total.innerText = '0';
  document.getElementsByClassName('total-price')[0].appendChild(total)
}
// document.getElementsByClassName('empty-cart')[0].addEventListener('click', lixo);

window.onload = function onload() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then(data =>
      data.results.forEach((obj) => {
        const product = {
          sku: obj.id,
          name: obj.title,
          image: obj.thumbnail,
        };
        const elem = createProductItemElement(product);
        document.getElementsByClassName('items')[0].appendChild(elem);
      },
      ),
    );
  historico();
  createBtn();
  createTotal();
  // console.log(localStorage.key(2))
};
