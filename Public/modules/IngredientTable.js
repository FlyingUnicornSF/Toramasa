
import { FiveStrandsTable } from "./5StrandsTable.js";

class IngredientTable {
  static clearTable() {
    const tableEle = document.getElementById("igredient-table");
    if(!tableEle) return;
    tableEle.remove();
  }
  static createTable(output) {
    const table = document.createElement("table");
    table.setAttribute("id", "igredient-table");
    // table header
    const headerRow = document.createElement("thead");
    headerRow.setAttribute("colspan", "2");
    headerRow.innerText = `total # of ingredients: ${output.output.length}`;
    table.appendChild(headerRow);
    // table 2nd header
    const footerRow = document.createElement("thead");
    footerRow.setAttribute("colspan", "2");
    footerRow.innerText = `# of ingredients matched: ${output?.count}`;
    table.appendChild(footerRow);
    // rows
    output?.output?.forEach((element) => {
      const row = document.createElement("tr");
      const dataCellName = document.createElement("td");
      dataCellName.innerText = element.name;
      row.appendChild(dataCellName);
      const dataCellLevel = document.createElement("td");
      dataCellLevel.innerText = element.level;
      row.appendChild(dataCellLevel);
      FiveStrandsTable.styleRow(row, element.level);
      table.appendChild(row);
    });
    return table;
  }
}

export { IngredientTable };
