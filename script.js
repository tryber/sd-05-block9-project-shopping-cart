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

function textoLoading() {
  const novoLoading = createCustomElement('h2', 'loading', 'loading...');
  document.querySelector('.container').appendChild(novoLoading);
  setTimeout(() => { novoLoading.remove(); }, 1500);
}

function guardandoLocal() {
  const itensSalvos = document.getElementsByClassName('cart__items')[0];
  localStorage.setItem('itensSalvos', itensSalvos.innerHTML);
}

function cartItemClickListener(event) {
  event.target.remove();
}

function limpandoCarrinho() {
  document.querySelectorAll('.cart__item').forEach(item => item.remove());
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function incrementandoCarrinho({ sku }) {
  await fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(response => response.json())
    .then((data) => {
      const produto = {
        sku: data.id,
        name: data.title,
        salePrice: data.price,
      };
      document
        .querySelector('.cart__items')
        .appendChild(createCartItemElement(produto));
      guardandoLocal();
    });
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section
    .appendChild(
      createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
    )
    .addEventListener('click', incrementandoCarrinho);
  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

window.onload = async function onload() {
  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then((data) => {
      data.results.forEach((item) => {
        const produtos = createProductItemElement({
          sku: item.id,
          name: item.title,
          image: item.thumbnail,
        });
        document.querySelector('.items').appendChild(produtos);
        document.getElementsByClassName('cart__items')[0].innerHTML = localStorage.getItem('itensSalvos');
      });
    })
    .then(document.getElementsByClassName('empty-cart')[0].addEventListener('click', limpandoCarrinho))
    .then(textoLoading());
};
