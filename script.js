
async function sumPrices() {
  const cartItens = document.querySelectorAll('.cart__item');
  const priceArray = [...cartItens].map(item => item.innerHTML.match(/[\d.\d]+$/));
  const totalPricePlace = document.getElementsByClassName('total-price')[0];
  totalPricePlace.innerHTML = priceArray.reduce((acc, num) => acc + parseFloat(num), 0);
}

function cartItemClickListener(event) {
  const remove = event.target;
  remove.parentNode.removeChild(remove);
  sumPrices();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function loadCart() {
  const cart = document.querySelector('.cart__items');
  for (i = 0; i < 30; i += 1) {
    const storage = localStorage.getItem(`product${i}`);
    if (localStorage.getItem(`product${i}`) !== null) {
      fetch(`https://api.mercadolibre.com/items/${storage}`)
      .then(response => response.json())
      .then((dataSave) => {
        const product = {
          sku: dataSave.id,
          name: dataSave.title,
          salePrice: dataSave.price,
        };
        sumPrices();
        cart.appendChild(createCartItemElement(product));
      });
    }
  }
}

window.onload = function onload() {
  loadCart();
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', function () {
    document.querySelector('.cart__items').innerText = [];
  });
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

fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(async response => response.json())
  .then((data) => {
    const section = document.querySelector('.items');
    for (let i = 0; i < data.results.length; i += 1) {
      const product = {
        sku: data.results[i].id,
        name: data.results[i].title,
        image: data.results[i].thumbnail,
      };
      section.appendChild(createProductItemElement(product)).addEventListener('click', () => {
        fetch(`https://api.mercadolibre.com/items/${product.sku}`)
          .then(response => response.json())
          .then((dataCart) => {
            const shopCart = document.querySelector('.cart__items');
            const productCart = {
              sku: dataCart.id,
              name: dataCart.title,
              salePrice: dataCart.price,
            };
            sumPrices();
            shopCart.appendChild(createCartItemElement(productCart));
            const list = document.querySelectorAll('.cart__item');
            for (i = 0; i < list.length; i += 1) {
              if (localStorage.getItem(`product${i}`) === null) {
                localStorage.setItem(`product${i}`, productCart.sku);
              }
            }
          });
      });
    }
    setTimeout(() => {
      const loading = document.querySelector('.loading');
      loading.parentElement.removeChild(loading);
    }, 3000);
  });
