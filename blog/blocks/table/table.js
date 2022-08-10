import {
  toClassName,
} from '../../scripts/scripts.js';

function buildTableCell(col, rowIndex, header, isComparisonTable) {
  const levels = ['pro', 'elite', 'bamboohr-product'];
  const cell = rowIndex > 0 ? document.createElement('td') : document.createElement('th');
  if (isComparisonTable && rowIndex === 3) {
    const levelClass = toClassName(col.textContent?.trim().toLowerCase());
    const levelIdx = levels.indexOf(levelClass);
    if (levelIdx >= 0) {
      cell.innerHTML = `<img src="/blog/icons/${levelClass}-badge.svg">`;
      if (levelIdx < 2) header?.classList.add(`${levelClass}-ribbon`);
    } else cell.innerHTML = col.innerHTML;
  } else cell.innerHTML = col.innerHTML;

  return cell;
}

function buildMobileTables(block, tableData, colCnt, isComparisonTable) {
  const mobileTableContainer = document.createElement('div');
  mobileTableContainer.className = 'table-mobile-container';
  block.append(mobileTableContainer);
  const tables = [];

  // Create a two column table for each col outside the first.
  // Each table includes col 0 (comparison labels) + a data column
  for (let i = 0; i < colCnt - 1; i += 1) {
    tables.push({
      table: document.createElement('table'),
      head: document.createElement('thead'),
      body: document.createElement('tbody'),
      currentRow: null,
      header: null,
    });
    tables[i].table.classList.add('table-mobile');
  }

  // build rows
  tableData.forEach((row, i) => {
    // Create a new row in each table.
    tables.forEach((t) => {
      t.currentRow = document.createElement('tr');
    });
    // build cells
    row.querySelectorAll('div').forEach((col, j) => {
      const header = (j > 0) ? tables[j - 1].header : null;
      const cell = buildTableCell(col, i, header, isComparisonTable);

      if (j === 0) {
        // Add col 0 (comparison labels) to every table
        tables.forEach((t, z) => t.currentRow.append(z > 0 ? cell.cloneNode(true) : cell));
      } else {
        // Save the header for markup later based on level found in row 3
        if (i === 0) tables[j - 1].header = cell;
        // Add data col to each table
        tables[j - 1].currentRow.append(cell);
      }
    });

    // Add each new row to its table
    tables.forEach((t) => {
      if (i > 0) t.body.append(t.currentRow);
      else t.head.append(t.currentRow);
      t.currentRow = null;
    });
  });

  // Add the tables to the mobleTableContainer.
  tables.forEach((t) => {
    // Populate each table.
    t.table.append(t.head, t.body);
    mobileTableContainer.append(t.table);
  });
}

export default async function decorate(block) {
  const table = document.createElement('table');
  const head = document.createElement('thead');
  const body = document.createElement('tbody');
  const headers = [];
  const tableData = block.querySelectorAll(':scope > div');
  let colCnt = -1;
  const isComparisonTable = block.classList.contains('comparison');
  const isDataSync = block.classList.contains('comparison');
  const isXY = block.classList.contains('xy');

  table.classList.add('table-desktop');
  if (!isComparisonTable && !isDataSync) {
    table.classList.add('Table');
    head.classList.add('Table__headerGroup');
    body.classList.add('Table__bodyGroup');
  }
  // build rows
  tableData.forEach((row, i) => {
    const tr = document.createElement('tr');
    const colData = row.querySelectorAll('div');
    if (colCnt === -1) colCnt = colData.length;
    // build cells
    colData.forEach((col, j) => {
      const cell = buildTableCell(col, i, headers[j], isComparisonTable);
      if (i === 0) {
        headers.push(cell);
        if (!isComparisonTable && !isDataSync) cell.classList.add('Table__th');
      } else if (!isComparisonTable && !isDataSync) {
        if (j === 0 && isXY) {
          cell.classList.add('Table__th', 'bhrcolor-gray8-background');
        } else cell.classList.add('Table__td');
      }
      tr.append(cell);
    });
    if (i > 0) body.append(tr);
    else head.append(tr);
  });
  // populate table
  table.append(head, body);
  block.innerHTML = table.outerHTML;

  if (isComparisonTable) {
    buildMobileTables(block, tableData, colCnt, isComparisonTable);
  }
}
