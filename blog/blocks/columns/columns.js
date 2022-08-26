import { hasClassStartsWith, getValuesFromClassName } from '../../scripts/scripts.js';

export default function decorate(block) {
  console.log('BLOCK: ', block);
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

  if (hasClassStartsWith(block, 'margin-')) {
    // Default to target any picture element directly under a column
    let pictureSelector = '.column-flex-container > div > picture';

    const classNames = block.classList.values();

    for (const className of classNames) {
      // Handle margins on images
      if (className.startsWith('margin-') && !className.startsWith('margin-on-col')) {
        const marginParams = getValuesFromClassName(className, 'margin-');
        let sideParamIdx = 0;
        let columnParamIdx = 2;

        let marginValue = 0;

        if (marginParams[0] === 'negative') {
          sideParamIdx = 1;
          columnParamIdx = 3;

          if (marginParams.length > 2) {
            marginValue = marginParams[2] * -1;
          }
        } else {
          if (marginParams.length > 1) {
            marginValue = marginParams[1];
          }
        }

        // If the class includes an `on` param, then we can specify which column to target
        if (marginParams[columnParamIdx] != null && marginParams[columnParamIdx] === 'on') {
          const columnIdx = marginParams[columnParamIdx + 1];
          pictureSelector = `.column-flex-container > div:nth-child(${columnIdx}) > picture`;
        }

        const pictureElem = block.querySelector(pictureSelector);

        if (marginParams[sideParamIdx] === 'top') {
          pictureElem.style.marginTop = `${marginValue}px`;

        } else if (marginParams[sideParamIdx] === 'bottom') {
          pictureElem.style.marginBottom = `${marginValue}px`;
        }
      }
    }
  }

}