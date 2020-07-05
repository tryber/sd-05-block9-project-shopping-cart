const emptyCart = () => {
  const cartItems = document.querySelectorAll('.cart__item');
  cartItems.forEach(li => li.remove());
};

document.getElementsByClassName('empty-cart')[0].addEventListener('click', emptyCart);

const salvarCarrinho = () => {
  const carrinho = document.getElementById('cart_list').innerHTML;
  localStorage.setItem('carrinhosalvo', carrinho);
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
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener() {
  const item = event.target;
  const list = document.getElementById('cart_list');
  list.removeChild(item);
  salvarCarrinho();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function itemInfo(item) {
  const ItemID = item.firstChild.innerHTML;
  fetch(`https://api.mercadolibre.com/items/${ItemID}`)
    .then(response => response.json())
    .then((data) => {
      const iteminfoss = {
        sku: data.id,
        name: data.title,
        salePrice: data.price,
      };
      document.getElementById('cart_list').appendChild(createCartItemElement(iteminfoss));
    })
    .then(() => {
      salvarCarrinho();
    });
}

const apiUrl = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

const fetchList = () => fetch(apiUrl)
  .then(response => response.json())
  .then(data => data.results.forEach((element) => {
    const produto = {
      sku: element.id,
      name: element.title,
      image: element.thumbnail,
    };
    document.getElementsByClassName('items')[0].appendChild(createProductItemElement(produto));
    salvarCarrinho();
  }))
  .then(() => {
    document.getElementsByClassName('items')[0].addEventListener('click', event => itemInfo(event.target.parentNode));
  });

window.onload = function onload() {
  fetchList();
  document.getElementsByTagName('ol')[0].innerHTML = localStorage.getItem('carrinhosalvo');
};
