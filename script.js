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

function somando(valor) {
  const vlT = 0;
  return vlT + valor;
}

async function cartItemClickListener(a) {
  const myAddCart = document.querySelector('.items');
  let sum = a;
  myAddCart.addEventListener('click', (evento) => {
    const myret = evento.target.parentElement.querySelectorAll('span')[0].innerText;
    fetch(`https://api.mercadolibre.com/items/${myret}`)
    .then(response => response.json())
    .then(async (data) => {
      console.log(data);
      console.log(data.title);
      const mycart = await createCartItemElement({
        sku: data.id,
        name: data.title,
        salePrice: data.price,
      });
      document.querySelector('.cart__items').appendChild(mycart);
      sum += somando(data.price);
      saveObj = [];
      const obj = document.querySelector('.cart__items').cloneNode(true);
      saveObj.push(obj.outerHTML);
      localStorage.saveObject = JSON.stringify(saveObj);
      document.querySelector('.total-price').innerText = `${sum}`;
    });
  });
}

function rem() {
  const myRemCart = document.querySelector('.cart__items');
  myRemCart.addEventListener('click', (envent) => {
    console.log(event.target);
    document.querySelector('.cart__items').removeChild(envent.target);
    removeobj = [];
    const remotion = document.querySelector('.cart__items').cloneNode(true);
    removeobj.push(remotion.outerHTML);
    localStorage.saveObject = JSON.stringify(removeobj);
  });
}

//----------------------------------------------------------------------

const initCa = () => {
  const paste = '<span class="cart__title">Carrinho de compras</span>';
  if (localStorage.length === 1) {
    document.querySelector('.cart1').innerHTML =
    `${paste}
    ${JSON.parse(localStorage.saveObject)}`;
  } else {
    document.querySelector('.cart1').innerHTML =
  `${paste}
  <ol class="cart__items"></ol>`;
  }
};

const remAll = () => {
  const btnDel = document.querySelector('.empty-cart');
  btnDel.addEventListener('click', () => {
    localStorage.clear();
    initCa();
    document.querySelector('.total-price').innerText = '';
  });
};

// function loading(condition) {
//   const body = document.querySelector('.items');
//   if (condition) {
//     const div = document.createElement('div');
//     div.className = 'loading';
//     div.innerText = 'Carregando...';
//     console.log('carregando');
//     body.appendChild(div);
//   } else {
//     console.log('carregado');
//     body.removeChild(document.querySelector('.loading'));
//   }
// }

function loadAPI() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(response => response.json())
  .then((data) => {
    data.results.forEach((item) => {
      const product = createProductItemElement({
        sku: item.id,
        name: item.title,
        image: item.thumbnail,
      });
      document.querySelector('.items').appendChild(product);
    });
  })
  .then(setTimeout(() => document.querySelector('.loading').remove(), 1000))
}

window.onload = function onload() {
  loadAPI();
  initCa();
  rem();
  remAll();
  cartItemClickListener(0);
};
