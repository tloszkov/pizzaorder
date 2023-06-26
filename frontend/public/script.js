// Reading pizzas from API
async function readApi() {
    const apiData = await fetch(`http://127.0.0.1:9002/api/pizza`);
    const pizzaApiData = await apiData.json();
    return pizzaApiData;
}
async function readAllergen() {
    const apiData = await fetch(`http://127.0.0.1:9002/api/allergen`);
    const allergenApiData = await apiData.json();
    return allergenApiData;
}

const rootElement = document.getElementById("root");

/* let selectedAllergens = []; */

//Pizza object sample for POST (Order)
let packageSample = {
    "id": 7,
    "name": "Quatro formaggi",
    "ingredients": [
        "Mozarella",
        "Gorgonzola",
        "Parmesan",
        "Emmental"
    ],
    "price": 3200,
    "allergens": [
        1,
        3,
        9
    ]
}

function createHeader(id, text) {
    return `<header id="${id}">${text}</header>`;
}

function createTitle(id, title) {
    return `<h1 id="${id}">${title}</h1>`;
}

function createButton(id, text) {
    return `<button id="${id}">${text}</button>`;
}

async function allergenOptions() {
    const allergen = await readAllergen();
    const checkboxElement = document.createElement("div");
    checkboxElement.id = "allerg-boxes";

    allergen.map(item => {
        let option = `<form>
        <input
        type="checkbox"
        id="allerg-input"
        value="${item.id}" />
            <label>${item.id} - ${item.name}</label>
    </form>`;
        checkboxElement.innerHTML += option;

    });

    rootElement.appendChild(checkboxElement);
}

async function defaultDisplayPizza() {
    const pizza = await readApi()
    let listItem = "";

    pizza.map((pizza) => {
        let pizzaInput = `<li id="${pizza.id}">${pizza.name} - ${pizza.price}</li>`;
        listItem += pizzaInput
    });

    return `<ul id="pizza-object">
    ${listItem}
    </ul>`
}


//TODO filter pizzas by allergens
const filterPizza = async function (pizzaApiData, allergenApiData) {

    const pizzas = await readApi();
    const allergens = await readAllergen();
    const submit = document.getElementById('submit-button');

    //selectedAllergens is either an array or an object that contains strings of allergens
    //    these allergens have to be found by their IDs

    submit.addEventListener('click', (event) => {
        event.preventDefault();

        let checkedAllergens = document.querySelectorAll('input[type="checkbox"]:checked');
        const selectedAllergens = [...checkedAllergens].map(element => element.value);

      /*   function matchingPizzas() {
            const pizzaAllergens = pizzas.map(pizza => pizza.allergens.map(allerg => console.log(allerg)))
            console.log(pizzaAllergens);
            return selectedAllergens.every(item => {
                pizzaAllergens.includes(item)
            })
        }

        console.log(matchingPizzas()); */

        const filteredPizzas = pizzas.filter(pizza => {
            return pizza.allergens.some(allergen => selectedAllergens.includes(allergen));
        });
        console.log("filtered pizzas: " + filteredPizzas);

        // const filteredPizzas = pizzas.filter(element => !selectedAllergens.includes(element.allergens));
        // console.log("file: script.js:107 ~ submit.addEventListener ~ filteredPizzas:", filteredPizzas);


    });




    // selectedAllergens = returns ID/s



    // pizzaApiData.filter(element => element.allergens.includes(selectedAllergens))???

}

/* const displayFilteredPizza = function () {

    const pizzaElement = document.createElement('pizza');


} */

async function createForm() {

    rootElement.insertAdjacentHTML("beforeend", createTitle("title", "Pizza order App"));
    rootElement.insertAdjacentHTML("beforeend", createButton("order-button", "Order Pizza"));
    allergenOptions();
    rootElement.insertAdjacentHTML("beforeend", createButton("submit-button", "Submit"));
    /* if (selectedAllergens) {

    } */
    rootElement.insertAdjacentHTML("afterend", await defaultDisplayPizza());

}

const loadEvent = async () => {
    createForm();
    /* displayFilteredPizza(); */
    filterPizza();
};

window.addEventListener("load", loadEvent);


