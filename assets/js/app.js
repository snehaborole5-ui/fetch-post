const cl = console.log;

const spinner = document.getElementById('spinner');
const productContainer = document.getElementById('productContainer');
const productForm = document.getElementById('productForm');
const titleControl = document.getElementById('title');
const priceControl = document.getElementById('price');
const brandControl = document.getElementById('brand');
const ratingControl = document.getElementById('rating');
const userIdControl = document.getElementById('userId');
const thumbnailControl = document.getElementById('thumbnail');
const addProductBtn = document.getElementById('addProductBtn');
const updateProductBtn = document.getElementById('updateProductBtn');

const BASE_URL = `https://promise-crud-sneha-b21-default-rtdb.asia-southeast1.firebasedatabase.app`;
const PRODUCT_URL = `${BASE_URL}/realproducts.json`;

let productArr = [];

function snackbar(msg, icon) {
    Swal.fire({
        title: msg,
        icon: icon,
        timer: 2000,
        showConfirmButton: false
    });
}

function tooltip() {
    $(function () {
        $('[data-toggle="tooltip"]').tooltip({ trigger: 'hover' });
    });
}


function fetchProducts() {
    spinner.classList.remove('d-none');
    fetch(PRODUCT_URL, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then((res) => res.json())
    .then((data) => {
        if (data) {
            
            productArr = Object.keys(data).map(key => {
                return { ...data[key], id: key };
            });
            createProducts(productArr.reverse());
        } else {
            productContainer.innerHTML = '';
        }
    })
    .catch((err) => {
        snackbar(err.message, 'error');
    })
    .finally(() => {
        spinner.classList.add('d-none');
    });
}

fetchProducts();


function createProducts(arr) {
    let result = ``;
    arr.forEach(ele => {
        result += `
            <div class="col-md-4 my-4" id="${ele.id}">
                <div class="card h-100">
                    <img src="${ele.thumbnail}" class="card-img-top" alt="${ele.title}" style="height: 200px; object-fit: cover;">
                    <div class="card-header" data-toggle="tooltip" data-placement="top" title="${ele.title}">
                        <h2>${ele.title}</h2>
                    </div>
                    <div class="card-body">
                        <p><strong>Brand:</strong> ${ele.brand}</p>
                        <p><strong>Price:</strong> $${ele.price}</p>
                        <p><strong>Rating:</strong> ${ele.rating} ⭐</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-sm btn-success" onclick="onEdit('${ele.id}')">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="onRemove('${ele.id}')">Remove</button>
                    </div>
                </div>
            </div>`;
    });
    productContainer.innerHTML = result;
    tooltip();
}

// 3. Form Submit (Create Product)
function onsubmithandl(ele) {
    spinner.classList.remove('d-none');
    ele.preventDefault();

    let newProduct = {
        title: titleControl.value,
        price: Number(priceControl.value),
        brand: brandControl.value,
        rating: Number(ratingControl.value),
        userId: userIdControl.value,
        thumbnail: thumbnailControl.value
    };

    fetch(PRODUCT_URL, {
        method: 'POST',
        body: JSON.stringify(newProduct),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then((res) => res.json())
    .then((data) => {
        newProduct.id = data.name; 
        createNewproduct(newProduct);
    })
    .catch((err) => {
        snackbar(err.message, 'error');
    })
    .finally(() => {
        spinner.classList.add('d-none');
    });
}

function createNewproduct(res) {
    let div = document.createElement('div');
    div.className = `col-md-4 my-4`;
    div.id = res.id;

    div.innerHTML = `
        <div class="card h-100">
            <img src="${res.thumbnail}" class="card-img-top" alt="${res.title}" style="height: 200px; object-fit: cover;">
            <div class="card-header" data-toggle="tooltip" data-placement="top" title="${res.title}">
                <h2>${res.title}</h2>
            </div>
            <div class="card-body">
                <p><strong>Brand:</strong> ${res.brand}</p>
                <p><strong>Price:</strong> $${res.price}</p>
                <p><strong>Rating:</strong> ${res.rating} ⭐</p>
            </div>
            <div class="card-footer d-flex justify-content-between">
                <button class="btn btn-sm btn-success" onclick="onEdit('${res.id}')">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="onRemove('${res.id}')">Remove</button>
            </div>
        </div>`;

    productContainer.prepend(div);
    productForm.reset();
    tooltip();
    
    
    snackbar(`The New Product with Id ${res.id} Is Added Successfully!!`, 'success');
}


function onEdit(id) {
    spinner.classList.remove('d-none');
    let editId = id;
    localStorage.setItem('EditId', editId);

    let editURl = `${BASE_URL}/realproducts/${editId}.json`;

    fetch(editURl, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then((res) => res.json())
    .then((data) => {
        if (data) {
            PatchData(data);
        } else {
            snackbar("Product data format is wrong or empty!", "error");
        }
    })
    .catch((err) => {
        snackbar(err.message, 'error');
    })
    .finally(() => {
        spinner.classList.add('d-none');
    });
}

function PatchData(res) {
    titleControl.value = res.title || '';
    priceControl.value = res.price || '';
    brandControl.value = res.brand || '';
    // Rating number aslyamule nehami string format madhe form control la dene safe aste
    ratingControl.value = res.rating ? res.rating.toString() : '';
    userIdControl.value = res.userId || '';
    thumbnailControl.value = res.thumbnail || '';

    addProductBtn.classList.add('d-none');
    updateProductBtn.classList.remove('d-none');

    productForm.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}


function onupdatehandl() {
    spinner.classList.remove('d-none');
    let updateId = localStorage.getItem('EditId');
    let udpateUrl = `${BASE_URL}/realproducts/${updateId}.json`;

    let updateObj = {
        title: titleControl.value,
        price: Number(priceControl.value),
        brand: brandControl.value,
        rating: Number(ratingControl.value),
        userId: userIdControl.value,
        thumbnail: thumbnailControl.value
    };

    fetch(udpateUrl, {
        method: 'PUT',
        body: JSON.stringify(updateObj),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then((res) => res.json())
    .then((data) => {
        
        data.id = updateId;
        UpdateonUI(data);
    })
    .catch((err) => {
        snackbar(err.message, 'error');
    })
    .finally(() => {
        spinner.classList.add('d-none');
    });
}

function UpdateonUI(res) {
    let div = document.getElementById(res.id);
    div.innerHTML = `
        <div class="card h-100">
            <img src="${res.thumbnail}" class="card-img-top" alt="${res.title}" style="height: 200px; object-fit: cover;">
            <div class="card-header" data-toggle="tooltip" data-placement="top" title="${res.title}">
                <h2>${res.title}</h2>
            </div>
            <div class="card-body">
                <p><strong>Brand:</strong> ${res.brand}</p>
                <p><strong>Price:</strong> $${res.price}</p>
                <p><strong>Rating:</strong> ${res.rating} ⭐</p>
            </div>
            <div class="card-footer d-flex justify-content-between">
                <button class="btn btn-sm btn-success" onclick="onEdit('${res.id}')">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="onRemove('${res.id}')">Remove</button>
            </div>
        </div>`;

    addProductBtn.classList.remove('d-none');
    updateProductBtn.classList.add('d-none');
    tooltip();
    productForm.reset();
    snackbar(`The Product With Id ${res.id} Is Updated Successfully!!`, 'success');

    div.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });

    div.classList.add('highlight');
    setTimeout(() => {
        div.classList.remove('highlight');
    }, 4000);
}

// 6. Delete Action
function onRemove(id) {
    let removeId = id;
    localStorage.setItem('RemoveId', removeId);
    
    Swal.fire({
        title: `Are You Sure You Want To Remove Product With Id ${id} ?`,
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    })
    .then((result) => {
        if (result.isConfirmed) {
            spinner.classList.remove('d-none');
            let removeURL = `${BASE_URL}/realproducts/${removeId}.json`;

            fetch(removeURL, {
                method: 'DELETE',
                headers: {
                    "Content-Type": 'application/json'
                }
            })
            .then((res) => res.json())
            .then(() => {
                let idFromStorage = localStorage.getItem('RemoveId');
                const targetElement = document.getElementById(idFromStorage);
                if (targetElement) {
                    targetElement.remove();
                }
                snackbar(`The Product With Id ${idFromStorage} Is Removed !!`, 'success');
            })
            .catch((err) => {
                snackbar(err.message, 'error');
            })
            .finally(() => {
                spinner.classList.add('d-none');
            });
        }
    });
}

productForm.addEventListener('submit', onsubmithandl);
updateProductBtn.addEventListener('click', onupdatehandl);