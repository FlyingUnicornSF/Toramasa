
import { WholeData } from "./5StrandsDataParse.js";
import rawData from "./Raw5strandsDataArray.json" assert { type: "json" };
import { FiveStrandsTable } from "./5StrandsTable.js";
import {IngredientTable} from "./IngredientTable.js";


// window.addEventListener("DOMContentLoaded", (event) => {
//   console.log("DOM fully loaded and parsed");
//   const data = loadData();
//   loadCatFilterCheckBoxes(data);
//   FiveStrandsTable.loadTable(data);
//   const submitButon = document.querySelector("#submit-button");
//   submitButon.addEventListener("click", (event) => onSubmitHandler(event));
//   const resetButton = document.querySelector("#reset-button");
//   resetButton.addEventListener("click", () => onResetHandler());
//   const ingredientsSubmitButton = document.querySelector("#ingredient-submit");
//   ingredientsSubmitButton.addEventListener("click", (event) =>
//     ingredientsOnSubmitHandler(event)
//   );
//   const ingredientsResetButton = document.querySelector("#ingredient-reset");
//   ingredientsResetButton.addEventListener("click", (event) => ingredientResetHandler(event));
// });



(function(){
  console.log("DOM fully loaded and parsed");
  const data = loadData();
  loadCatFilterCheckBoxes(data);
  FiveStrandsTable.loadTable(data);
  const submitButon = document.querySelector("#submit-button");
  submitButon.addEventListener("click", (event) => onSubmitHandler(event));
  const resetButton = document.querySelector("#reset-button");
  resetButton.addEventListener("click", () => onResetHandler());
  const ingredientsSubmitButton = document.querySelector("#ingredient-submit");
  ingredientsSubmitButton.addEventListener("click", (event) =>
    ingredientsOnSubmitHandler(event)
  );
  const ingredientsResetButton = document.querySelector("#ingredient-reset");
  ingredientsResetButton.addEventListener("click", (event) => ingredientResetHandler(event));
})();
/**
 *
 * controllers
 */

function ingredientsOnSubmitHandler(event) {
  event.preventDefault(event);
  IngredientTable.clearTable()
  const elemArray = [...event.target.parentNode.parentNode.elements];
  let output;
  let ingredientsCount;
  elemArray.forEach((element) => {
    if (element.name === "ingredients") {
      ingredientsCount = element.value.split(",").length;
      output = searchIngredients(element.value);
      output?.output?.sort((a, b) => b.level - a.level);
    }
  });
  if (output?.output?.length > 0) {
    const table = IngredientTable.createTable(output);
    const divEle = document.querySelector("#right-container");
    divEle.appendChild(table);
  }
}


function onResetHandler() {
  FiveStrandsTable.clearTable();
  const tableData = loadData();
  FiveStrandsTable.loadTable(tableData);
}

function ingredientResetHandler(){
  IngredientTable.clearTable();
}

function onSubmitHandler(event) {
  event.preventDefault(event);
  // console.log(event.target.parentNode.parentNode.elements)
  let sortText;
  let filterMap;
  const elemArray = [...event.target.parentNode.parentNode.elements];
  elemArray.forEach((element) => {
    if (element.name === "search-text") {
      const searchText = element.value;
      if (searchText !== "") {
        filterMap = filterMap?.size > 0 ? filterMap : new Map();
        filterMap.set("searchText", searchText);
      }
    } else if (element.name === "sort-by-name") {
      if (element.checked) {
        sortText = "name";
      }
    } else if (element.name === "sort-by-level") {
      if (element.checked) {
        sortText = "level";
      }
    } else if (element.name === "cat-filter" && element.checked) {
      if (filterMap?.size > 0 && filterMap?.has("filterCategories")) {
        let categoryArray = filterMap.get("filterCategories");
        categoryArray.push(element.value);
        filterMap.set("filterCategories", categoryArray);
      } else {
        filterMap = new Map([["filterCategories", [element.value]]]);
      }
    } else if (elemArray.name === "level-filter" && element.checked) {

    }
  });

  const tableData = loadData(filterMap, sortText);
  // clear table
  FiveStrandsTable.clearTable();
  FiveStrandsTable.loadTable(tableData);
}

/**
 *
 * @param {Map<"searchText" | "filterCategories", string | string[]} filterBy
 * @param {string} sortBy
 * @returns
 */
function loadData(filterBy, sortBy) {
  // const data = new dataParser.WholeData(rawData);
  const data = new WholeData(rawData);
  // initial grouping
  data.initialDataGrouping();
  if (sortBy) {
    data.sortGroupedData(sortBy);
  }
  if (filterBy) {
    data.filterGroupedData(filterBy);
  }
  return data.displayData;
}

/**
 *
 * @param {string} value
 * @returns {{{"name" | "level": string | number}[]
 */
 function searchIngredients(value) {
  let ingredientArray = value.split(",");
  ingredientArray = ingredientArray.map((subtring) =>
    subtring.toLowerCase().trim()
  );
  /**@type {Map<string, Array<FooClassInstance>} */
  const data = new WholeData(rawData);
  data.parse5StrandsData();
  let output = [];
  let count = 0;

  ingredientArray.forEach((ingredient)=>{
    let level = -1;
    if(data.itemMap.has(ingredient.toLowerCase())) {
      count += 1;
      level = data.itemMap.get(ingredient.toLowerCase());
    }
    output.push({name: ingredient, level: level})
  })
  // output.sort((a, b)=> b.level - a.level);
  output = output.map((item)=> {item.level === -1 ? item.level = 'N/A' : item.level; return item;});
  return { output, count };
}

/**
 *
 * Rendering components
 *
 */

/**
 *
 * @param {Map<string, Array<FooClassInstance>} data
 */
function loadCatFilterCheckBoxes(data) {
  let fragment = new DocumentFragment();

  data.forEach((value, key) => {
    const checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("id", key);
    checkbox.setAttribute("name", "cat-filter");
    checkbox.setAttribute("value", key);
    const lable = document.createElement("label");
    lable.setAttribute("for", key);
    lable.innerText = key;
    fragment.appendChild(checkbox);
    fragment.appendChild(lable);
  });
  const fieldset = document.querySelector("fieldset");
  fieldset.appendChild(fragment);
}
