const result = document.querySelector('#result');
const form = document.querySelector('#form');
const paginateContent = document.querySelector('#paginate');
const registerPerPage = 40;

let totalPages;
let iterator;
actualPage = 1;

window.onload = () => {
    form.addEventListener('submit', validForm);
}

function validForm(e) {
    e.preventDefault();

    const Searchterm = document.querySelector('#term').value;

    if(Searchterm === '') {
        showError('Agrega un termino de busqueda');
        return;
    } 

    searchImages();
}

function searchImages() {

    const term = document.querySelector('#term').value;

    const key = '47650806-c0b80705062457dbd8c97b9fd';
    const url = `https://pixabay.com/api/?key=${key}&q=${term}&per_page=${registerPerPage}&page=${actualPage}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            totalPages = calculatePages(data.totalHits);
            showImages(data.hits)
        })
}

function *createPaginate(total) {
    for ( let i = 1; i <= total; i++ ) {
        yield i;
    }
}

function calculatePages(total) {
    return parseInt( Math.ceil( total / registerPerPage ) );
}

function showError(message) {
    const alertExist = document.querySelector('.error_message');

    if(!alertExist) {
        const alert = document.createElement('P');
        alert.classList.add('error_message');

        alert.innerHTML = `
            <strong>Error!</strong>
            <span>${message}</span>
        `;

        result.appendChild(alert);

        setTimeout(() => {
            alert.remove();
        }, 5000);
    }
}

function showImages(images) {
    while(result.firstChild) {
        result.removeChild(result.firstChild);
    }

    images.forEach(image => {
        const { previewURL, likes, views, largeImageURL } = image;

        result.innerHTML += `
            <div class="images_content">
                <div class="bg_img_content">
                    <img src="${previewURL}">

                    <div class="text_img_content">
                        <p>${likes} <span>Me Gusta</span></p>
                        <p>${views} <span>Veces Vista</span></p>
                        <a class="show_image_btn" href="${largeImageURL}" target="_blank" rel="noopener noreferrer">
                            Ver Imagen
                        </a>
                    </div>
                </div>
            </div>
        `;
    });

    while(paginateContent.firstChild) {
        paginateContent.removeChild(paginateContent.firstChild);
    }

    printPaginate();
}

function printPaginate() {
    iterator = createPaginate(totalPages)

    while(true) {
        const { value, done } = iterator.next();
        if(done) return;

        const buttom = document.createElement('A');
        buttom.href = '#';
        buttom.dataset.page = value;
        buttom.textContent = value;
        buttom.classList.add('paginate');

        buttom.onclick = () => {
            actualPage = value;

            searchImages();
        }

        paginateContent.appendChild(buttom);
    }
}
