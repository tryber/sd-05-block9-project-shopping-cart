const loadCart = () => {
  for (i = 0; i < 30; i += 1) {
    if (localStorage.getItem(`product${i}`) !== null) {
      const section = document.querySelector('.cart__items');
      const li = document.createElement('li');
      li.innerText = localStorage.getItem(`product${i}`);
      section.appendChild(li);
    }
  }
};

window.onload = function onload() {
  loadCart();
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

function cartItemClickListener(event) {
  const remove = event.target;
  remove.parentNode.removeChild(remove);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const saveCart = () => {
  const list = document.querySelectorAll('.cart__item');
  for (i = 0; i < list.length; i += 1) {
    localStorage.setItem(`product${i}`, list[i].textContent);
  }
};

fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(response => response.json())
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
            shopCart.appendChild(createCartItemElement(productCart));
            saveCart();
          });
      });
    }
  });
