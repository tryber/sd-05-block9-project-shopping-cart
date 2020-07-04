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

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

async function updatePrice(preco) {
  const totalPrice = document.getElementById('total-price');
  const tempPrice = parseFloat(totalPrice.innerHTML) + preco;
  totalPrice.innerHTML = (Math.round(tempPrice * 100) / 100).toFixed(2);
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  // const fullCart = document.querySelector('.cart__items');
  // fullCart.removeChild(event.target);
  const itemToRemove = event.target;
  itemToRemove.classList = 'removing';
  const removingItem = document.getElementsByClassName('removing');
  const text = removingItem[0].innerHTML;
  const value = text.substring(text.indexOf('PRICE: $') + 8);
  updatePrice(-parseFloat(value));
  removingItem[0].parentNode.removeChild(removingItem[0]);
  localStorage.setItem('cartPrice', document.getElementById('total-price').innerHTML);
  localStorage.setItem('cartItem', document.getElementsByClassName('cart__items')[0].innerHTML);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addToCart(event) {
  const itemId = event.target.parentElement.firstChild.innerHTML;
  fetch(`https://api.mercadolibre.com/items/${itemId}`)
    .then(response => response.json())
    .then((data) => {
      const { id: sku, title: name, price: salePrice } = data;
      const cartItem = createCartItemElement({ sku, name, salePrice });
      document.querySelector('.cart__items').appendChild(cartItem);
      updatePrice(salePrice);
      localStorage.setItem('cartPrice', document.getElementById('total-price').innerHTML);
      localStorage.setItem('cartItem', document.getElementsByClassName('cart__items')[0].innerHTML);
    });
}

window.onload = function onload() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then((data) => {
      data.results.forEach((result) => {
        const product = createProductItemElement(result);
        document.querySelector('.items').appendChild(product);
      });
    })
    .then(() => {
      document.querySelectorAll('.item__add')
        .forEach(element => element.addEventListener('click', addToCart));
    })
    .then(() => {
      document.querySelectorAll('.cart__items')
        .forEach(element => element.addEventListener('click', cartItemClickListener));
    })
    .then(() => {
      if (localStorage.getItem('cartItem') != null) {
        document.getElementsByClassName('cart__items')[0].innerHTML = localStorage.getItem('cartItem');
        document.getElementById('total-price').innerHTML = localStorage.getItem('cartPrice');
      } else {
        localStorage.setItem('cartPrice', '0.00');
      }
    });
};
