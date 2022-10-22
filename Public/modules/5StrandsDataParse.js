// import { createRequire } from "module";
// const require = createRequire(import.meta.url);
// const rawData = require("./Raw5strandsDataArray.json");
// const rawData = require("./Raw5strandsDataArray");
// import rawData from '../modules/Raw5strandsDataArray.json' assert {type: 'json'};

class Foo {
  constructor(name, category, group, level) {
    this.name = name;
    this.category = category.replace("(", "").replace(")", "");
    this.group = group;
    this.level = level;
  }
  get getName() {
    return this.name;
  }
  get getCategory() {
    return this.category;
  }
  get getGroup() {
    return this.group;
  }
  get getLevel() {
    return this.level;
  }
  get(item) {
    switch (item) {
      case "name":
        return this.name;
      case "category":
        return this.category;
      case "group":
        return this.group;
      case "level":
        return this.level;
      default:
        return null;
    }
  }
}

class WholeData {
  constructor(rawData) {
    this.data = rawData;
    /**@type {Array<FooClassInstance>} */
    this.parsedData = [];
    /**@type {Map<string, Array<FooClassInstance>} */
    this.groupedData = new Map();
    /**@type {Map<string, Array<FooClassInstance>} */
    this.sortedGroupedData = new Map();
    this.filteredGroupedData = new Map();
    /**@type {Map<string, Array<FooClassInstance>} */
    this.displayData = new Map();
    this.itemMap = new Map();
    this.parse5StrandsData = this.parse5StrandsData.bind(this);
    this.initialDataGrouping = this.initialDataGrouping.bind(this);
  }

  parse5StrandsData() {
    this.data.forEach((element) => {
      let name = element.name.trim().toLowerCase();
      if(name.endsWith(')') && element.category !== "(Synthetic Additive)") {
        const regex = /^([^()]+)\((.*)\)/
        const words = regex.exec(name);
        name = `${words[2].trim()} ${words[1].trim()}`.trim();
      }
      this.parsedData.push(
        new Foo(name, element.category, element.group, element.level)
      );
      this.itemMap.set(name, element.level);
    });
  }

  initialDataGrouping(groupCategory = "category") {
    this.parse5StrandsData();
    let output = this.groupedData;
    this.parsedData.forEach((element) => {
      let outputMapKey;
      if (groupCategory === "name") {
        outputMapKey = element.name;
        if (element.name.split(" ").length > 1) {
          outputMapKey = element.name.split(" ")[0];
          // console.log(element.name, outputMapKey);
        }
      } else {
        outputMapKey = element[`${groupCategory}`];
      }
      if (output.has(outputMapKey)) {
        let groupArray = output.get(outputMapKey);
        output.set(outputMapKey, [...groupArray, element]);
      } else {
        output.set(outputMapKey, [element]);
      }
    });
    this.displayData = new Map(output);
  }

  /**
   *
   * @param {Map<"searchText" | "filterCategories", string | string[]}  searchFilters
   */
  filterGroupedData(searchFilters) {
    console.log(searchFilters);
    // const filter = (typeof(filterCategory) === 'string' ? filterCategory.toLowerCase() : filterCategory);
    const filterCats = searchFilters?.get("filterCategories");
    const filterCategories = filterCats?.map((filter) => filter.toLowerCase());
    let searchText = searchFilters.get("searchText");
    searchText =
      typeof searchText === "string" ? searchText.toLowerCase() : searchText;
    const data = new Map(this.displayData);
    const output = new Map();
    data.forEach((value, key) => {
      // if(key.toLowerCase().includes(filter)) {
      if (filterCategories && filterCategories.includes(key.toLowerCase())) {
        output.set(key, value);
      } else {
        let newValue = [];
        value.forEach((element) => {
          if (
            searchText &&
            searchText !== '' &&
            (element.getName.toLowerCase().includes(searchText) ||
              element.getCategory.includes(searchText) ||
              element.getGroup.includes(searchText) ||
              element.getLevel === searchText)
          ) {
            newValue.push(element);
            output.set(key, newValue);
          }
        });
      }
    });
    this.displayData = new Map(output);
  }

  sortGroupedData(sortBy) {
    const sortText = sortBy.toLowerCase();
    const data = this.displayData;
    if (sortText === "level") {
      data.forEach((value, key) => {
        value.sort((a, b) => a.getLevel - b.getLevel);
      });
    } else if (sortText === "name") {
      data.forEach((value, key) => {
        value.sort((a, b) => {
          if (a.getName < b.getName) {
            return -1;
          }
          if (a.getName > b.getName) {
            return 1;
          }
          return 0;
        });
      });
    }
  }
}

export { WholeData };
