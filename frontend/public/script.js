// Reading pizzas from API
async function readApi() {
    const apiData = await fetch(`http://127.0.0.1:9002/api/pizza`);
    const pizzaApiData = await apiData.json();
    return pizzaApiData;
}

// Reading allergens form API
async function readAllergen() {
    const apiData = await fetch(`http://127.0.0.1:9002/api/allergen`);
    const allergenApiData = await apiData.json();
    return allergenApiData;
}

//Creating RootElement
const rootElement = document.getElementById("root");



//Sample order object
const orderObject = {
    "id": 1,
    "pizzas": [
        { "id": 1, "amount": 2 }
    ],
    "customer": {
        "name": "John Doe",
        "email": "jd@example.com",
        "address": {
            "city": "Palermo",
            "street": "Via Appia 6"
        }
    }
}

/* customFetch("http://127.0.0.1:9002/api/order","POST",orderObject) */

//Custom fetch() function
function customFetch(url, type, data) {
    if (type === "GET") {
        fetch(url, {
            method: type,
            headers: {
                "Content-type": "application/json",
            }
        })
            .then((res) => {
                if (res.ok) {
                    console.log("HTTP request SUCCESSFUL");
                } else {
                    console.log("HTTP request FAILED");
                }
                return res.json()
            })
            .then((data) => console.log(data))
            .catch((error) => console.log(error))
    }
    if (type === "POST" || type === "PUT") {
        fetch(url, {
            method: type,
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({ data })
        })
            .then((res) => {
                if (res.ok) {
                    console.log("HTTP request SUCCESSFUL");
                } else {
                    console.log("HTTP request FAILED");
                }
                return res.json()
            })
                /* .then((data) => data.status === "OK") */
            .catch((error) => console.log(error))
    }
    if (type === "DELETE") {
        fetch(url, {
            method: type,
            headers: {
                "Content-type": "application/json",
            }
        })
            .then((res) => {
                if (res.ok) {
                    console.log("HTTP request SUCCESSFUL");
                } else {
                    console.log("HTTP request FAILED");
                }
            })
            .catch((error) => console.log(error))
    }
}

/* let selectedAllergens = []; */

//Creating elements
function createHeader(id, text) {
    return `<header id="${id}">${text}</header>`;
}

function createTitle(id, title) {
    return `<h1 id="${id}">${title}</h1>`;
}

function createButton(id, text) {
    return `<button id="${id}">${text}</button>`;
}

function createInput(id, input) {
    return `<input id="${id}" class="input" type="text" placeholder="${input}"></input><br>`;
}


// Creating and posting allergen checkboxes to site
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

// Default siplay of all the pizzas
async function defaultDisplayPizza() {
    const pizzas = await readApi();
    let listItem = "";
    let orderButton = createButton("order-button", "Order");
    let amountInput = createInput("amount-input", "Amount")


    pizzas.map((pizza) => {
        let pizzaInput = `<li id="${pizza.id}">${pizza.name} - ${pizza.price} ${orderButton} ${amountInput}</li>`;
        listItem += pizzaInput;
    });

    return `<div id="default-pizza-list"><ul id="pizza-object">
    ${listItem}
    </ul></div>`;
}

// Display of filteres list pizzas
function displayFilteredPizza(dataSet) {
    let listItem = "";
    let orderButton = createButton("order-button", "Order");
    let amountInput = createInput("amount-input", "amount");

    dataSet.map((pizza) => {
        let pizzaInput = `<li id="${pizza.id}">${pizza.name} - ${pizza.price} ${orderButton} ${amountInput}</li>`;
        listItem += pizzaInput;
    });

    return `<div id="filtered-pizzalist"><ul id="pizza-object">
    ${listItem}
    </ul></div>`;
}


//Filter Pizzas function and EvenetListener
const filterPizza = async function (pizzaApiData, allergenApiData) {

    const pizzas = await readApi();
    const allergens = await readAllergen();
    const filter = document.getElementById('filter-button');

    filter.addEventListener('click', (event) => {
        event.preventDefault();

        let checkedAllergens = document.querySelectorAll('input[type="checkbox"]:checked');
        const selectedAllergens = [...checkedAllergens].map(element => parseInt(element.value));

        console.log(selectedAllergens);

        const filteredPizzas = pizzas.filter(pizza => {
            return selectedAllergens.every(allergen => !pizza.allergens.includes(allergen));
        });
        console.log("filtered pizzas: " + JSON.stringify(filteredPizzas));

        document.querySelector('#default-pizza-list').remove();
        rootElement.insertAdjacentHTML("afterend", displayFilteredPizza(filteredPizzas));
    });

}

function submitOrder() {
    const submitButton = document.querySelector("#submit-order");

    submitButton.addEventListener('click', (event) => {
        //console.log(event.target);
        // possible redirect functionality to see order page after clicking submit


        customFetch("http://127.0.0.1:9002/api/order", "POST", orderObject);

    })
}

//TODO create an array to store ordered pizza ID and amount
//TODO modify orderButton event listener to update pizza ID and pizza amount in orderObject
async function orderPizza() {
    const orderButton = document.getElementsByTagName("li");
    orderButton.addEventListener('click', (event) => {
        console.log("file: script.js:235 ~ orderButton.addEventListener ~ event:", event);

    });
}

// Calling element functions to post them on site
async function createForm() {

    rootElement.insertAdjacentHTML("beforeend", createTitle("title", "Pizza order App"));
    rootElement.insertAdjacentHTML("beforeend", createButton("submit-order", "Submit Order"));
    allergenOptions();
    rootElement.insertAdjacentHTML("afterend", await defaultDisplayPizza());
    rootElement.insertAdjacentHTML("beforeend", createButton("filter-button", "Filter"));
    submitOrder();
    // orderPizza();

}

//Loading functions on site
const loadEvent = () => {
    createForm();
    //submitOrder();
    filterPizza();
    // orderPizza();
};

window.addEventListener("load", loadEvent);


