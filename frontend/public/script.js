let orderID = 0;

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
    "id": orderID,
    "pizzas": [

    ],
    "customer": {
        "name": "",
        "email": "",
        "address": {
            "city": "",
            "street": ""
        }
    }
}

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

//Creating elements
function createHeader(id, text) {
    return `<header id="${id}">${text}</header>`;
}

function createTitle(id, title) {
    return `<h1 id="${id}">${title}</h1>`;
}

function createOrderButton(id, text) {
    return `<button id="${id}" class="order-button">${text}</button>`;
}

function createButton(id, text) {
    return `<button id="${id}">${text}</button>`;
}

function createInput(id, input) {
    return `<input id="${id}" class="input" type="text" placeholder="${input}"></input><br>`;
}

// Creating new div element for pizza lists
const defaultPizzaList = document.getElementById("default-pizza-list")
const filteredPizzaList = document.getElementById("filtered-pizza-list");

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

// Default display of all the pizzas
async function defaultDisplayPizza() {
    const pizzas = await readApi();
    let listItem = "";

    pizzas.map((pizza) => {
        let amountInput = createInput(`amount-input:${pizza.id}`, "Amount");
        let orderButton = createOrderButton(`order-button:${pizza.id}`, "Order");

        let pizzaInput = `<div id="${pizza.id}" class="default-pizza-items">${pizza.name}<br>${pizza.price}<br>${orderButton}<br>${amountInput}</div>`;
        listItem += pizzaInput;

    });

    return `<div id="default-pizza-list">
    ${listItem}
    </div>`;
}

// Display all filtered pizzas
function displayFilteredPizza(dataSet) {
    let listItem = "";

    dataSet.map((pizza) => {
        let amountInput = createInput(`amount-input:${pizza.id}`, "amount");
        let orderButton = createOrderButton(`order-button:${pizza.id}`, "Order");

        let pizzaInput = `<div id="${pizza.id}" class="filtered-pizza-items">${pizza.name}<br>${pizza.price}<br>${orderButton}<br>${amountInput}</div>`;
        listItem += pizzaInput;
    });

    return `<div id="filtered-pizza-list">
    ${listItem}
    </div>`;
}


//Filter Pizzas function and EvenetListener
const filterPizza = async function () {

    const pizzas = await readApi();
    const filter = document.getElementById('filter-button');

    filter.addEventListener('click', (event) => {
        event.preventDefault();

        let checkedAllergens = document.querySelectorAll('input[type="checkbox"]:checked');
        const selectedAllergens = [...checkedAllergens].map(element => parseInt(element.value));

        console.log(selectedAllergens);

        // TODO if selectedAllergens.length != 0
        if (selectedAllergens.length != 0) {

            const filteredPizzas = pizzas.filter(pizza => {
                return selectedAllergens.every(allergen => !pizza.allergens.includes(allergen));
            });

            document.querySelector('#default-pizza-list').innerHTML = "";

            rootElement.insertAdjacentHTML("afterend", displayFilteredPizza(filteredPizzas));
            orderPizza();
        } else {
            rootElement.innerHTML = '';
            document.querySelector('#filtered-pizza-list').remove();
            createForm();
            filterPizza();
        }
    });
}

function submitOrder() {
    const submitButton = document.querySelector("#submit-order");
    submitButton.addEventListener('click', () => {
        if (orderObject.pizzas.length > 0) {
            orderObject.customer.name = '';
            orderObject.customer.email = '';
            orderObject.customer.address.city = '';
            orderObject.customer.address.street = '';
            validationForm();
        }
    });
}

//TODO modify orderButton event listener to update pizza ID and pizza amount in orderObject
async function orderPizza() {
    const orderInput = document.querySelectorAll(".order-button");

    orderInput.forEach(orderB => {
        orderB.addEventListener('click', (event) => {

            let indexID = event.target.id.slice(event.target.id.indexOf(":") + 1);

            const amount = parseInt(document.getElementById(`amount-input:${indexID}`).value);
            const newOrderID = parseInt(indexID);

            let newOrder = { "id": newOrderID, "amount": amount };

            orderObject.pizzas.push(newOrder);

            console.log(orderObject);
        })
    })
}

async function pizzasName(){
    const pizzas = await readApi();
    const pizzaIds = orderObject.pizzas.map(element => element.id);
    console.log("file: script.js:247 ~ pizzasName ~ pizzaIds:", pizzaIds)
    const pizzasData = pizzaIds.map(element=>{
        pizzas.map(pizza =>{
           if(pizza.id === element){ return pizza.id}
        });
    });
    console.log("file: script.js:253 ~ pizzasData ~ pizzasData:", pizzasData[0])
    
}

function summerizeForm(){
    const sumarryForm = document.createElement('div');
    sumarryForm.id = "sumerize-form";
    document.body.append(sumarryForm);
    sumarryForm.innerHTML="<div>Summary:</div>"
    pizzasName();

}

function validationForm (){

    // summerizeForm();

    const defaultPizzaList = document.querySelector("#default-pizza-list");
    const filteredPizzaList = document.querySelector("#filtered-pizza-list");
    rootElement.innerHTML='';
    defaultPizzaList.innerHTML = '';

    const divForm = document.createElement('div');
    divForm.id = 'div-validation';

    const inputNameLabel = document.createElement('label');
    inputNameLabel.textContent = "Name :";
    const inputName = document.createElement('input');
    inputName.type = "text";
    inputName.placeholder = "Please enter your name."
    
    const inputEmailLabel = document.createElement('label');
    inputEmailLabel.textContent = "Email :";
    const inputEmail = document.createElement('input');
    inputEmail.type = "text";
    inputEmail.placeholder = "Please enter your email."
    
    const inputCityLabel = document.createElement('label');
    inputCityLabel.textContent = "City :";
    const inputCity = document.createElement('input');
    inputCity.type = "text";
    inputCity.placeholder = "Please enter your City."
    
    const inputStreetLabel = document.createElement('label');
    inputStreetLabel.textContent = "Street :";
    const inputStreet = document.createElement('input');
    inputStreet.type = "text";
    inputStreet.placeholder = "Please enter your street."

    const breakeLine = document.createElement('br');

    const sendButton = document.createElement('button');
    sendButton.textContent = "Send";
    sendButton.type = "submit";
    sendButton.id = "send"
    
    const backButton = document.createElement('button');
    backButton.textContent = "Back";
    backButton.id = "back"

    divForm.appendChild(inputNameLabel);
    divForm.appendChild(inputName);
    divForm.appendChild(inputEmailLabel);
    divForm.appendChild(inputEmail);
    divForm.appendChild(breakeLine);
    divForm.appendChild(inputCityLabel);
    divForm.appendChild(inputCity);
    divForm.appendChild(breakeLine);
    divForm.appendChild(inputStreetLabel);
    divForm.appendChild(inputStreet);
    divForm.appendChild(breakeLine);
    divForm.appendChild(sendButton);
    divForm.appendChild(backButton);
    
    const errorMessage = document.createElement('div');
    errorMessage.id = 'errorMessage';
    errorMessage.innerHTML='Please fill the inputfields!';
    errorMessage.style.visibility='hidden';
    divForm.appendChild(errorMessage);

    sendButton.addEventListener('click',()=> {
        if(inputName.value ==='' || inputEmail.value ==='' || inputCity.value ==='' || inputStreet.value ===''){
           errorMessage.style.visibility='visible' 
        }else{
            errorMessage.style.visibility='hidden';
            orderObject.customer.name = inputName.value;
            orderObject.customer.email = inputEmail.value;
            orderObject.customer.address.city = inputCity.value;
            orderObject.customer.address.street = inputStreet.value;
            
            orderObject.id = orderID++;
            customFetch("http://127.0.0.1:9002/api/order", "POST", orderObject);
            window.open("http://127.0.0.1:9002/api/order", "_blank");
            window.open("http://127.0.0.1:9002/api/validation", "_blank");
            orderObject.pizzas.splice(0);

            createPage();
            divForm.remove();
            orderObject.pizzas.splice(0);
            
        }
    });
    
    backButton.addEventListener('click',()=>{
        createPage();
        divForm.remove();
        orderObject.pizzas.splice(0);
    });
    document.body.appendChild(divForm);
    
}

async function createPage() {
    // document.body.innerHTML ='';
    createForm();
    filterPizza();
}

// Calling functions to post them on site
async function createForm() {

    rootElement.insertAdjacentHTML("beforeend", createTitle("title", "Pizza order App"));
    rootElement.insertAdjacentHTML("beforeend", createButton("submit-order", "Submit Order"));
    allergenOptions();
    rootElement.insertAdjacentHTML("afterend", await defaultDisplayPizza());
    rootElement.insertAdjacentHTML("beforeend", createButton("filter-button", "Filter"));
    await orderPizza();
    submitOrder();

}

//Loading functions on site
const loadEvent = () => {
   
    createPage();
    
};

window.addEventListener("load", loadEvent);


