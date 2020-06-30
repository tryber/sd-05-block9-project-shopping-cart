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
  // coloque seu código aqui
  const itemToRemove = event.target;
  itemToRemove.classList = 'removing';
  const removingItem = document.getElementsByClassName('removing');
  while (removingItem.length > 0) {
    removingItem[0].parentNode.removeChild(removingItem[0]);
  }
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
    });
}

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
    })
    .then(() => {
      document.querySelectorAll('.item__add')
        .forEach(element => element.addEventListener('click', addToCart));
    })
    .then(() => {
      document.querySelectorAll('.cart__items')
        .forEach(element => element.addEventListener('click', cartItemClickListener));
    });
};
