const socket = io();

socket.on("allProducts", (data) => {
    renderProductos(data);
});

function addProductsIo() {
    const newProductIo = {
        title: document.getElementById("title").value, 
        category: document.getElementById("category").value,
        urlImage: document.getElementById("urlImage").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        stock: document.getElementById("stock").value,
        code: document.getElementById("code").value,
        
    }

    socket.emit("addProductsIo", newProductIo);
    
    socket.on("addProductsResponse", (response) => {
        if (response.success) { 
                      
            document.getElementById("productForm").reset();
            alert("el producto de ha creado correctamente"); 
        }else{
            alert("Ha ocurrido un error: " + (response.errorMessage));
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
                <h5 class="card-title text-center">${prod.id}</h5>
                <h5 class="card-title text-center">${prod.title}</h5>
                <p class="text-center">${prod.category}</p>
                <p class="text-center">$ ${prod.price}</p>
                <p class="text-center">stock: ${prod.stock}</p>
                <p class="text-center">code: ${prod.code}</p>
                <button class="btn btn-danger mt-auto" id="${prod.id}">Eliminar</button>
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
    console.log("Enviando ID para eliminar:", id);
    socket.emit('deleteProduct', id); 
    
    socket.on("deleteProductResponse", (response) => {
        if (response.success) { 
            alert("el producto se ha eliminado correctamente");           
        }else{
            alert("Ha ocurrido un error");
        }
    });

}