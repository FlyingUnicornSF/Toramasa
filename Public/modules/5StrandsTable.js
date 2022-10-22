class FiveStrandsTable {

  static columns = ['name', 'level', 'category', 'group'];

  static clearTable() {
    // clear table
    const tableBodys = document.getElementsByTagName('tbody');
    const tableBody = tableBodys[0];
    while (tableBody.children.length > 0) {
      tableBody.removeChild(tableBody.lastChild);
    }
  }

  /**
   *
   * @param {FooClassInstance} item
   */
  static makeRow(item) {
    const tableRow = document.createElement('tr');
    this.columns.forEach((column) => {
      const tableData = document.createElement('td');
      const innerText = document.createTextNode(item.get(column));
      tableData.appendChild(innerText);
      tableRow.appendChild(tableData);
      this.styleRow(tableRow, item.get('level'));
    });
    return tableRow;
  }

  static styleRow(tableRow, level) {
    switch (level) {
      case 3:
        tableRow.style.background = '#f361618f';
        break;
      case 2:
        tableRow.style.background = '#f1946491';
        break;
      case 1:
        tableRow.style.background = '#80cbbac2';
        break;
      case 0:
        tableRow.style.background = '#aedcefb0';
        break;
      case 'X':
        tableRow.style.background = '#f0efef';
      default:
        tableRow.style.background = '#f0efef';
        break;
    }
  }

  /**
   *
   * @param {arrayOfClassIntance} categoryItems
   */
   static makeGroupRows(categoryItems, tableBody) {
    categoryItems.forEach((element) => {
      const itemRow = this.makeRow(element);
      tableBody.appendChild(itemRow);
    });
  }

  static loadTable(tableData) {
    // console.log(groupedData)
    // style table
    // const table = document.querySelector('table');
    // table.style.borderCollapse = 'collapse';
    // table.style.border = '1px solid black';
    const tableBody = document.querySelector('#five-strands-test tbody');
    tableData.forEach((value, key) => {
      // group header row
      const groupRow = document.createElement('th');
      groupRow.setAttribute('colspan', 4);
      groupRow.textContent = key;
      // groupRow.style.border = '1px solid';
      tableBody.appendChild(groupRow);
      this.makeGroupRows(value, tableBody);
    });
  }
}

export {FiveStrandsTable}