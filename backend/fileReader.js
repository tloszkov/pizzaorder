const { readFile } = require("fs/promises");

const fileReaderAsync = async (filePath) => {
    try {
        return await readFile(filePath);
    } catch (error) {
        console.error(`File reading error: ${error.message}`);
    }
};

/* const loadPizza = async function () {
    const fileData = await fileReaderAsync(filePath);
    let dataList = await JSON.parse(fileData);
    let pizzaObjs = dataList.pizzas;
    return pizzaObjs;
}

const loadAllergen = async function () {
    const fileData = await fileReaderAsync(filePath);
    let dataList = await JSON.parse(fileData);
    let allergenObjs = dataList.allergens;

    return allergenObjs;
} */





module.exports = fileReaderAsync;
/* module.exports = loadPizza;
module.exports = loadAllergen; */

