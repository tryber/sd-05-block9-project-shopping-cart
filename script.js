function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function cartItemClickListener(event) {
  const itemButton = event.target;
  itemButton.parentNode.removeChild(itemButton);
  const itemsList = document.querySelector('.cart__items');
  localStorage.setItem('cart item:', itemsList.innerHTML);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addToCart(event) {
  const button = event.target;
  const itemID = button.parentNode.firstChild.innerHTML;
  fetch(`https://api.mercadolibre.com/items/${itemID}`)
  .then(response => response.json())
  .then((data) => {
    const newCartItem = {
      sku: data.id,
      name: data.title,
      salePrice: data.price,
    };
    const itemsList = document.querySelector('.cart__items');
    itemsList.appendChild(createCartItemElement(newCartItem));
    localStorage.setItem('cart item:', itemsList.innerHTML);
  });
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') {
    e.addEventListener('click', addToCart);
  }
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

window.onload = function onload() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then(data => data.results.forEach((item) => {
      const product = createProductItemElement({
        sku: item.id,
        name: item.title,
        image: item.thumbnail,
      });
      document.getElementsByClassName('items')[0].appendChild(product);
    }))
    .then(() => {
      const storage = localStorage.getItem('cart item:');
      const itemsCart = document.querySelector('.cart__items');
      itemsCart.innerHTML = storage;
      itemsCart.addEventListener('click', cartItemClickListener);
    })
};
