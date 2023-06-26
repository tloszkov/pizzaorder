const express = require("express");
const path = require("path");
const fileReaderAsync = require("./fileReader");
const filePath = path.join(`${__dirname}/pizzas.json`);
const pizza = require("./pizzas.json");
const allergen = require("./Allergens.json");
const cors = require("cors");
const app = express();

const port = 9002;

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


app.get('/api/pizza', (req, res) => {
    res.json(pizza.pizzas);
});

app.get('/api/allergen', (req, res) => {
    res.json(allergen.allergens);
});

app.listen(port, _ => console.log(`http://127.0.0.1:${port}`));

app.get("/", (req, res) => {
    res.redirect(301, '/pizza/list');
  });
  app.get(["/pizza/list"], (req, res, next) => {
    res.sendFile(path.join(`${__dirname}/../frontend/index.html`));
  });
  app.use('/public', express.static(`${__dirname}/../frontend/public`));