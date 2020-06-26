
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
  // sku=id image=thumbnail name=title
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

/*
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
*/

window.onload = function onload() {
  const sectionItens = document.getElementsByClassName('items')[0];
  const CPUlibre = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(CPUlibre)
  .then(response => response.json())
  .then(data =>
    data.results.forEach((product) => {
      const INFOproduct = createProductItemElement({
        sku: product.id,
        name: product.title,
        image: product.thumbnail,
      });
      sectionItens.appendChild(INFOproduct);
    }),
  );
};
