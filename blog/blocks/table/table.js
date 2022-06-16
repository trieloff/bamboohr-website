export default async function decorate(block) {
  const table = document.createElement('table');
  const head = document.createElement('thead');
  const body = document.createElement('tbody');
  // build rows
  block.querySelectorAll(':scope > div').forEach((row, i) => {
    const tr = document.createElement('tr');
    // build cells
    row.querySelectorAll('div').forEach((col) => {
      const cell = i > 0 ? document.createElement('td') : document.createElement('th');
      cell.innerHTML = col.innerHTML;
      tr.append(cell);
    });
    i > 0 ? body.append(tr) : head.append(tr);
  });
  // populate table
  table.append(head, body);
  block.innerHTML = table.outerHTML;
}
