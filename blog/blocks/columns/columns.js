export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  if (block.classList.contains('small-icons')) {
    cols[0].parentElement.classList.add('column-small-icons-container');
    cols.forEach((col) => col.classList.add(`icon-${cols.length}-cols`));
  } else if (cols.length === 2) {
    // Looking for sub types like: 8-4, 6-6, 3-9 or 2-10
    const columnSubType = [...block.classList].find((c) => c.length < 6 && c.includes('-'));
    const splitVals = columnSubType?.split('-');

    // Make sure all splitVals are 1-2 digit numbers
    if (columnSubType && splitVals.every((s) => s.match(/^\d{1,2}$/))) {
      cols[0].parentElement.classList.add('column-flex-container');
      cols.forEach((col, i) => col.classList.add(`column${splitVals[i]}`));

      if (columnSubType === '5-3') {
        const colContainer = cols[0].parentElement;
        const newCol0 = document.createElement('div');
        newCol0.classList.add('column2');
        colContainer.insertBefore(newCol0, cols[0]);

        const newCol3 = document.createElement('div');
        newCol3.classList.add('column2');
        colContainer.appendChild(newCol3);
      }
    }
  }
}
