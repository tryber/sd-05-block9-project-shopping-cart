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
  const target = event.target;
  if (target.classList.contains('cart__item')) {
    target.remove();
  }
}

// function clearCart() {
//   document.querySelectorAll('.cart__item').forEach(item => item.remove());
// }

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addToCart(sku) {
  fetch(`https://api.mercadolibre.com/items/${sku}`)
  .then(response => response.json())
  .then((data) => {
    const cItem = document.querySelector('.cart__items');
    const addCItem = createCartItemElement({
      sku: data.id,
      name: data.title,
      salePrice: data.price,
    });
    cItem.appendChild(addCItem);
    const savedItems = document.getElementsByClassName('cart__items')[0];
    localStorage.setItem('savedItems', savedItems.innerHTML);
  });
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const buttonAdd = section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  buttonAdd.addEventListener('click', () => addToCart(sku));
  return section;
}

function clearCart (){
  const cartItems = document.getElementsByClassName('cart__items')[0];
  cartItems.innerHTML = '';
}
// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const apiUrl = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

window.onload = async function onload() { 
  await fetch(apiUrl)
    .then(response => response.json())
    .then((data) => {
      const addItem = document.querySelector('.items');
      for (let i = 0; i < data.results.length; i += 1) {
        const product = {
          sku: data.results[i].id,
          name: data.results[i].title,
          image: data.results[i].thumbnail,
        };
        addItem.appendChild(createProductItemElement(product));
        document.getElementsByClassName('cart__items')[0].innerHTML = localStorage.getItem('savedItems');
      }
    })
    .then(document.getElementsByClassName('empty-cart')[0].addEventListener('click', clearCart));
};

 
    
  
