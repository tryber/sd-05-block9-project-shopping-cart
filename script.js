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
//   return item.querySelector('span.item__sku').innerText;
// }

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  return li;
}

function cartItemClickListener() {
  const myAddCart = document.querySelector('.items');
  myAddCart.addEventListener('click', (evento) => {
    const myret = evento.target.parentElement.querySelectorAll('span')[0].innerText;
    fetch(`https://api.mercadolibre.com/items/${myret}`)
    .then(response => response.json())
    .then((data) => {
      console.log(data);
      console.log(data.price);
      console.log(data.id);
      console.log(data.title);
      const mycart = createCartItemElement({
        sku: data.id,
        name: data.title,
        salePrice: data.price,
      });
      document.querySelector('.cart__items').appendChild(mycart);
    });
  });
  // adicionar item ^
  // remover item
  const myRemCart = document.querySelector('.cart__items');
  myRemCart.addEventListener('click', (envent) => {
    console.log(event.target);
    document.querySelector('.cart__items').removeChild(envent.target);
  });

  // coloque seu código aqui
}
//----------------------------------------------------------------------
window.onload = function onload() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(response => response.json())
  .then((data) => {
// foreach para criar cada produto
    data.results.forEach((item) => {
      const product = createProductItemElement({
        sku: item.id,
        name: item.title,
        image: item.thumbnail,
      });
      document.querySelector('.items').appendChild(product);
    });
    // aqui acaba o foreach
  });
// aqui acaba o segundo then
// aqui começa o req 2
  cartItemClickListener();
};
