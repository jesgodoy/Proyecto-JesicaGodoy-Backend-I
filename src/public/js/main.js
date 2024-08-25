const socket = io();

socket.on("allProducts", (data) => {
    renderProductos(data);
});

function addProductsIo() {
    
    const titleElem = document.getElementById("title");
    const categoryElem = document.getElementById("category");
    const imgElem = document.getElementById("img");
    const descriptionElem = document.getElementById("description");
    const priceElem = document.getElementById("price");
    const stockElem = document.getElementById("stock");
    const codeElem = document.getElementById("code");

   
   
    const newProductIo = {
        title: titleElem.value,
        category: categoryElem.value,
        urlImage: imgElem.value, 
        description: descriptionElem.value,
        price: priceElem.value,
        stock: stockElem.value,
        code: codeElem.value,
    };


    socket.emit("addProductsIo", newProductIo);


    socket.once("addProductsResponse", (response) => {
        if (response.success) {
            alert("El producto se ha creado correctamente");
            document.getElementById("productForm").reset();
        } else {
            alert("Ha ocurrido un error: " + response.errorMessage);
        }
    });
}


document.getElementById("btnSend").addEventListener("click", (event) => {
    event.preventDefault();
    addProductsIo();
});

const renderProductos = (data) => {
    const productsContainer = document.getElementById("productsContainer");
    productsContainer.innerHTML = "";

    data.forEach(prod => {
        const card = document.createElement("div");
        card.className = "col-md-4 mb-2";
        card.innerHTML = `
        <div class="card h-100">
            <div class="card-body d-flex flex-column">
                <h5 class="card-title text-center">${prod._id}</h5>
                <h5 class="card-title text-center">${prod.title}</h5>
                <p class="text-center">${prod.category}</p>
                <p class="text-center">$ ${prod.price}</p>
                <p class="text-center">Stock: ${prod.stock}</p>
                <p class="text-center">Code: ${prod.code}</p>
                <button class="btn btn-danger mt-auto" id="${prod._id}">Eliminar</button>
            </div>
        </div>
        `;
        productsContainer.appendChild(card);
    });

    const deleteButtons = productsContainer.querySelectorAll("button");
    deleteButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            const id = e.target.getAttribute("id");
            deleteProductIo(id);
        });
    });
}

function deleteProductIo(id) {
    socket.emit('deleteProduct', id);

    socket.once("deleteProductResponse", (response) => {
        if (response.success) {
            alert("El producto se ha eliminado correctamente");
        } else {
            alert("Ha ocurrido un error: " + response.errorMessage);
        }
    });
}