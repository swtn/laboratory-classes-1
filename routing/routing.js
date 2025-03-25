// 📦 Zaimportuj moduł odpowiedzialne za routing poszczególnych części aplikacji.
// 📦 Zaimportuj obiekt STATUS_CODE.
const homeRouting = require('./home');
const productRouting = require('./product');
const logoutRouting = require('./logout');
const STATUS_CODE = require('../constants/statusCode');
const { log } = require('console');
const { request } = require('http');
// 🏗 Stwórz tutaj funkcję 'requestRouting', która będzie obsługiwać zapytania HTTP.
// Podpowiedź: const requestRouting = (request, response) => {
// 🏗 Tutaj stwórz logowanie do konsoli informacji, mówiące o typie logowania (INFO), dacie, metodzie oraz url żądania.
// 🏗 Tutaj stwórz podstawowy 'request routing' dla ścieżek '/', zawierającej /product' oraz '/logout'. Przekaż `request` i `routing` do odpowiednio routingu.
// 🏗 Obsłuż specjalny przypadek, jeśli użytkownik zostanie przekierowany na ścieżkę /kill, aplikacja się zamknie.
// 🏗 Stwórz również logowanie do konsoli informacji, mówiące o typie logowania (PROCESS), dacie oraz informację, że wylogowowyanie zostało wywołane a aplikacja zamknie się.
// 🏗 Tutaj stwórz obsługę przypadku, jeśli żądany URL nie istnieje. Zwróć wtedy błąd 404.
// 🏗 Stwórz również logowanie do konsoli informacji, mówiące o typie logowania (ERROR), dacie oraz informację, że żądany url nie istnieje.
//  };

const requestRouting = (request, response) => {
    const { url, method } = request;
    const date = new Date().toISOString();
    console.log(`INFO [${date}]: ${method} - ${url}`);

    if(url === "/"){
        homeRouting(method, response);
    }else if(url.includes("/product")){
        productRouting(url, method, request, response);
    }else if(url === "/logout"){
        logoutRouting(method, response);
    }else if(url === "/kill"){
        console.log(`PROCESS [${date}]: logout has been initiated nad the application will be closed`);
        process.exit();
    }else{
        console.error(`ERROR[${date}]: requested url ${url} doesnt exist`);
        response.statusCode = STATUS_CODE.NOT_FOUND;
        response.setHeader("Content-Type", "text/html");
        response.write("<h1>404 - Page not found</h1>");
        response.end();
    }
}
// 🔧 Wyeksportuj funkcję 'requestRouting', aby inne moduł mogły jej używać.
module.exports = requestRouting;