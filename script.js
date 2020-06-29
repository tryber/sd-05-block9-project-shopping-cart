// window.onload = function onload() { };

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

let cartSum = 0;

function cartItemClickListener(event) {
  // console.log(event.target.id);
  localStorage.removeItem(event.target.id);
  event.target.remove();
  console.log(event.target.className);
  const theoldtotal = parseInt(document.getElementsByClassName('total')[0].innerText, 10);
  cartSum = theoldtotal - parseInt(event.target.className, 10);
  document.getElementsByClassName('total')[0].innerText = theoldtotal - parseInt(event.target.className, 10);
}

// document.getElementsByClassName('total')[0].innerText

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.className = salePrice;
  li.id = sku;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  localStorage.setItem(sku, 'item');
  const oldtotal = parseInt(document.getElementsByClassName('total')[0].innerText, 10);
  cartSum = parseInt(salePrice, 10) + oldtotal;
  document.getElementsByClassName('total')[0].innerText = parseInt(salePrice, 10) + oldtotal;
  return li;
}

function adicionarItem(sku) {
  const linko = `https://api.mercadolibre.com/items/${sku}`;
  fetch(linko)
    .then(response => response.json())
    .then(data =>
      document.getElementsByClassName('cart__items')[0].appendChild(
        createCartItemElement({
          sku: data.id,
          name: data.title,
          salePrice: data.price,
        }),
      ),
    );
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  // section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  const btnCerto = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  btnCerto.addEventListener('click', () => {
    adicionarItem(sku);
  });
  section.appendChild(btnCerto);
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function historico() {
  for (let i = 0; i < localStorage.length; i += 1) {
    const hist = localStorage.key(i);
    adicionarItem(hist);
  }
}

function lixo() {
  const allcartitems = document.getElementsByTagName('li');
  for (let i = allcartitems.length - 1; i >= 0; i -= 1) {
    allcartitems[i].remove();
  }
  localStorage.clear();
  document.getElementsByClassName('total')[0].innerText = 0;
}

function createBtn() {
  const btnLixo = document.createElement('button');
  btnLixo.className = 'empty-cart';
  btnLixo.addEventListener('click', lixo);
  btnLixo.innerText = 'Esvaziar o carrinho';
  document.getElementsByClassName('place')[0].appendChild(btnLixo);
}

function createTotal() {
  const total = document.createElement('h2');
  total.className = 'total';
  total.innerText = 0;
  document.getElementsByClassName('total-price')[0].appendChild(total);
}
// document.getElementsByClassName('empty-cart')[0].addEventListener('click', lixo);

function loader(status = true) {
  const container = document.querySelector('.container');
  if (status) {
    const loading = document.createElement('div');
    loading.className = 'loading';
    loading.innerText = 'loooooading...';
    container.appendChild(loading);
  } else {
    const loading = document.querySelector('.loading');
    container.removeChild(loading);
  }
}

window.onload = function onload() {
  loader(true);
  setTimeout(() => {
    (document.querySelector('.loading').remove());
  }, 123);
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then(data =>
      data.results.forEach((obj) => {
        const product = {
          sku: obj.id,
          name: obj.title,
          image: obj.thumbnail,
        };
        const elem = createProductItemElement(product);
        document.getElementsByClassName('items')[0].appendChild(elem);
      },
      ),
    );
  historico();
  createBtn();
  createTotal();
  // somatotal.then((res)=>{document.getElementsByClassName('total')[0].innerText = res});
  // console.log(localStorage.key(2))
};

// const somaPreco = async (productPrice) => {
  //const totalPrice = document.querySelector('.total-price');
  // soma += productPrice;
  // soma = parseInt(productPrice);
// soma +=
//    (await Math.round(parseFloat(productPrice, 10).toFixed(2) * 100)) / 100;
//  totalPrice.innerHTML = soma;
//  };


// async function somatotal(){
// return 0
// }

// async function puxapromessa = () => {

//   const promessa = new Promise((resolve, reject) => { // resolve, reject

//     cartSum != 0 ? resolve(cartSum) : reject()
//   }
//   )

//   function suucesso(){document.getElementsByClassName('total')[0].innerText = cartSum};
//   function tentamais(){
//     document.getElementsByClassName('total')[0].innerText = 0;
//     console.log("deu ruim")}

//   promessa
//     .then(suucesso)
//     .catch(tentamais)
// }
