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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));

  const addCart = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  section.appendChild(addCart);
  addCart.addEventListener('click', function () {
    searchProduct(sku);
  });
  const sectionElement = document.getElementsByClassName('items')[0];
  sectionElement.appendChild(section);

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(response => response.json())
  .then((data) => {
    data.results.forEach((element) => {
      const produto = {
        sku: element.id,
        name: element.title,
        image: element.thumbnail,
      };
      createProductItemElement(produto);
    });
  });

const loading = () => {
  const load = document.querySelector('.load-container');
  load.appendChild(createCustomElement('span', 'loading', 'loading...'));
};

window.onload = function onload() {
  loading();
  setTimeout(() => {
    (document.querySelector('.loading').remove());
  }, 1000);

  document.getElementsByClassName('cart__items')[0].innerHTML = localStorage.getItem('SavedCart');
  if (localStorage.getItem('SavedCart') !== undefined) {
    const addEvent = document.querySelectorAll('.cart__item');
    addEvent.forEach(item => item.addEventListener('click', cartItemClickListener));
  }
  sumProducts();
};
