// salvar objeto carrinho
function salvar() {
  localStorage.clear('carrinho');
  const cartSave = document.getElementsByTagName('ol')[0].innerHTML;
  console.log(cartSave);
  localStorage.setItem('carrinho', cartSave);
}

// carregando a foto para o produto
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// carregando as informações para o produto
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// Formato dos produtos da carregados
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// Romação de item do carrinho
function cartItemClickListener(event) {
  event.target.classList.contains('select');
  event.target.classList.add('select');
  event.target.remove('select');
  salvar();
}

// Formato do itrm do carrinho
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// carregar itens de produtos no carrinho após apertarem o botão.
function getSkuFromProductItem(item) {
  fetch(`https://api.mercadolibre.com/items/${item}`)
  .then(response => response.json())
  .then((data) => {
    const productAdd = {
      sku: data.id,
      name: data.title,
      salePrice: data.price,
    };
    const cartPai = document.getElementsByClassName('cart__items')[0];
    cartPai.appendChild(createCartItemElement(productAdd));

    salvar();
  });
}

// Carregar lista de produtos na pagina
function ciateList() {
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
    // colocando item no carrinho ao apertar o botão
    .then(() => {
      document.querySelectorAll('.item__add').forEach(addItem => addItem
      .addEventListener('click', () => {
        getSkuFromProductItem(addItem.parentElement.querySelector('span.item__sku').innerText);
      }));
    });
}

// chamar a função no final
window.onload = function onload() {
  // retornar localStoreg
  if (localStorage.getItem('carrinho') !== undefined) {
    document.getElementsByTagName('ol')[0].innerHTML = localStorage.getItem('carrinho');
    document.querySelectorAll('li').forEach(li => li.addEventListener('click', cartItemClickListener));
  }

  // limpar carrinho
  document.querySelectorAll('.empty-cart').forEach(empty => empty
  .addEventListener('click', () => {
    document.querySelector('ol').innerHTML = '';
    localStorage.removeItem('carrinho');
  }));

  ciateList();
};
