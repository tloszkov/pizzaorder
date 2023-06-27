const express = require("express");
const path = require("path");
const fileReaderAsync = require("./fileReader");
const filePath = path.join(`${__dirname}/pizzas.json`);
const pizza = require("./pizzas.json");
const allergen = require("./Allergens.json");
const cors = require("cors");
const app = express();

const port = 9002;

const orderedPizzas = [];

app.use(express.json());

const loadPizza = async function () {
    const fileData = await fileReaderAsync(filePath);
    let dataList = await JSON.parse(fileData);
    let pizzaObjs = dataList.pizzas;
    console.log(pizzaObjs);
    return pizzaObjs;
}
loadPizza();

const loadAllergen = async function () {
    const fileData = await fileReaderAsync(filePath);
    let dataList = await JSON.parse(fileData);
    let allergenObjs = dataList.allergens;

    console.log(allergenObjs);
    return allergenObjs;
}
loadAllergen();

// Display pizzas
app.get('/api/pizza', (req, res) => {
    res.json(pizza.pizzas);
});

// Display allergens
app.get('/api/allergen', (req, res) => {
    res.json(allergen.allergens);
});

// Send new order
app.post('/api/order', (req, res) => {
    const pizzaData = req.body;
    console.log(pizzaData);

    // köztes lépésként dátum objektum beszurása/módosítása lehetséges
    /* {status: "NOT OK"}
    {status: "OK", date: "2023-06-27"} */

    orderedPizzas.push(pizzaData);
    pizzaData.date = new Date().toISOString().slice(0, 10);
    res.send(pizzaData);
    orderedPizzas.slice(0);
});

// Display orders
app.get('/api/order', (req, res) => {
    const pizzaData = req.body;
    console.log(pizzaData);

    /* res.send(pizzaData); */
    res.send(orderedPizzas);
});

app.listen(port, _ => console.log(`http://127.0.0.1:${port}`));

app.get("/", (req, res) => {
    res.redirect(301, '/pizza/list');
  });
  app.get(["/pizza/list"], (req, res, next) => {
    res.sendFile(path.join(`${__dirname}/../frontend/index.html`));
  });
  app.use('/public', express.static(`${__dirname}/../frontend/public`));