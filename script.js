window.onload = function onload() { };

// Variáveis globais

// Função fornecida
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

const fetchProductData = async (itemId) => {
  const product = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
  const productJson = await product.json();
  return productJson;
};

// Função fornecida
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// Faz a soma total
const sumItens = () => {
  const Itens = document.querySelectorAll('.cart__item');
  document.getElementsByClassName('total-price')[0].innerText = (
    [...Itens].map(item => item.innerHTML.match(/[\d.\d]+$/))
    .reduce((acc, add) => acc + parseFloat(add), 0) * 100) / 100;
};

const saveCart = () => {
  localStorage.setItem('Cart Items', document.querySelector('.cart__items').innerHTML);
  localStorage.setItem('Total Price', document.querySelector('.total-price').innerHTML);
};

// Remover item do carrinho
function cartItemClickListener(event) {
  event.target.remove();
  saveCart();
  sumItens();
}

// Função fornecida
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Função para armazenar itens selecionados para o carrinho
async function addToCart(sku) {
  const ol = document.getElementsByClassName('cart__items')[0];
  const product = await fetchProductData(sku)
    .then(productData =>
      createCartItemElement({
        sku: productData.id, name: productData.title, salePrice: productData.price,
      }),
    );
  ol.appendChild(product);
  sumItens();
  saveCart();
}

// Função fornecida
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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// Função para limpar o carrinho
function clearAll() {
  const itemRemove = document.querySelectorAll('.cart__item');
  itemRemove.forEach((item) => {
    item.remove();
    localStorage.clear();
    sumItens();
    saveCart();
  });
}

// Fetch para puxar os dados dos produtos através da API
window.onload = function onload() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
    .then(response => response.json())
    .then((data) => {
      data.results.forEach((element) => {
        const itemInfo = createProductItemElement({
          sku: element.id,
          name: element.title,
          image: element.thumbnail,
        });
        document.querySelector('.items').appendChild(itemInfo);
      });
    })
  .catch(() => console.log('API apresenta erro!'));
  const emptyCartBtt = document.querySelector('.empty-cart');
  emptyCartBtt.addEventListener('click', clearAll);
};
