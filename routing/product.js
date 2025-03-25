// 📦 Zaimportuj moduły 'fs' oraz 'STATUS_CODE' do obsługi produktów.
const fs = require("fs");
const STATUS_CODE = require("../constants/statusCode");
// 🏗 Stwórz funkcję 'productRouting', która obsłuży żądania dotyczące produktów.
function productRouting(url, method, request, response){
    if(url.includes("/product/add") && method === "GET"){
        renderAddProductPage(response);
    }else if(url.includes("/product/add") && method === "POST"){
        addNewProduct(request, response);
    }else if(url.includes("/product/new")){
        renderNewProductPage(response);
    }else{
        const date = new Date().toISOString();
        console.error(`ERROR [${date}]: requested url ${url} doesnt exist`);
        response.statusCode = STATUS_CODE.NOT_FOUND;
        response.setHeader("Content-Type", "text/html");
        response.write("<h1>404 - Page not found </h1>");
        response.end();
    }
}
// 🏗 Stwórz funkcję 'renderAddProductPage', która wyrenderuje stronę dodawania produktu.
function renderAddProductPage(response){
    response.setHeader("Content-Type", "text/html");
    response.write(`
        <html>
            <head><title>Add Product</title></head>
            <body>
                <h1>Add New Product</h1>
                <form method="POST" action="/product/add">
                    <input type="text" name="product" placeholder="Enter product name" required />
                    <button type="submit">Add</button>
                </form>
            </body>
        </html>
    `);
    response.end();
}
// 🏗 Stwórz funkcję 'renderNewProductPage', która wyświetli najnowszy produkt z pliku 'product.txt'.
// Podpowiedź: fileSystem.readFile(...);
function renderNewProductPage(response) {
    fs.readFile("product.txt", "utf-8", (err, data) => {
        response.setHeader("Content-Type", "text/html");
        if (err) {
            response.write("<h1>Error reading product</h1>");
        } else {
            response.write(`
                <html>
                    <head><title>Newest Product</title></head>
                    <body>
                        <h1>Newest Product</h1>
                        <p>${data}</p>
                    </body>
                </html>
            `);
        }
        response.end();
    });
}
// 🏗 Stwóz funkcję 'addNewProduct', która obsłuży dodawanie nowego produktu, zapisywanie go do pliku 'product.txt' oraz przeniesie użytkownika na stronę '/product/new'.
// Podpowiedź: fileSystem.writeFile(...);
// Podpowiedź: response.setHeader("Location", "/product/new");
function addNewProduct(request, response) {
    const body = [];

    request.on("data", chunk => {
        body.push(chunk);
    });

    request.on("end", () => {
        const parsedBody = Buffer.concat(body).toString();
        const productName = parsedBody.split("=")[1];
        const decodedProduct = decodeURIComponent(productName);

        fs.writeFile("product.txt", decodedProduct, err => {
            if (err) {
                response.statusCode = 500;
                response.end("Error saving product");
            } else {
                response.statusCode = STATUS_CODE.FOUND;
                response.setHeader("Location", "/product/new");
                response.end();
            }
        });
    });
}
// 🔧 Wyeksportuj funkcję 'productRouting', aby inne moduł mogły jej używać.
module.exports = productRouting;