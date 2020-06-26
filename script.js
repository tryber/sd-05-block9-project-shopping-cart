window.onload = function onload() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(response => response.json())
    .then((data) => {
      data.results.forEach((product) => {
        const newProduct = createProductItemElement({
          sku: product.id,
          name: product.title,
          image: product.thumbnail,
        });
        const classItems = document.querySelector('.items');
        classItems.appendChild(newProduct);
      });
    });
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

// Você deve utilizar a função createProductItemElement(product)
// para criar os componentes HTML referentes a um produto.
// Adicione o elemento retornado da função createProductItemElement(product)
// como filho do elemento <section class="items">.
// Obs: as variáveis sku, no código fornecido, se referem aos campos id retornados pela API.
// cada item do API: 35: {id: "MLB1506111498", site_id: "MLB", title: "Cpu Monitor Dell Optiplex 3040 Core I5 6ger 8gb 500gb Novo", seller: {…}, price: 2699, …}

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
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
