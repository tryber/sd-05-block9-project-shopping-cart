window.onload = function onload() {
  const myObject = {
    method: 'GET',
    headers: { 'Accept': 'application/json' }
  };

  fetch("https://api.mercadolibre.com/sites/MLB/search?q=computador", myObject)
    .then(responde => responde.json())
    .then(data => {
      data.results.forEach(element => {
        const createProduct = createProductItemElement({
          sku: element.id,
          name: element.title,
          image: element.thumbnail
        });
        document.querySelectorAll(".items")[0].appendChild(createProduct);
      });
    })
};

function cartItemClickListener(event) {
  event.target.remove();
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
  const btnAddCart = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  btnAddCart.addEventListener('click', () => {
    addToCArt({ sku })
  });
  section.appendChild(btnAddCart);
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// function to add item to cart
async function addToCArt({ sku }) {
  const response = await fetch(`https://api.mercadolibre.com/items/${sku}`)
  const data = await response.json()
  const cart_item = document.querySelectorAll('.cart__items')[0];
  const addNewCArtItem = createCartItemElement({
    sku: data.id,
    name: data.title,
    salePrice: data.price,
  })
  cart_item.appendChild(addNewCArtItem);
}
