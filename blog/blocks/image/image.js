import { buildFigure } from '../../scripts/scripts.js';

function buildColumns(rowEl, count) {
  const columnEls = Array.from(rowEl.children);
  columnEls.forEach((columnEl) => {
    const figEl = buildFigure(columnEl);
    columnEl.remove();
    rowEl.append(figEl);
  });
  rowEl.classList.add('image-list', `image-list-${count}`);
}

export default function decorateImage(blockEl) {
  const blockCount = blockEl.firstChild.childElementCount;
  if (blockCount > 1) {
    buildColumns(blockEl.firstChild, blockCount);
  } else {
    const figEl = buildFigure(blockEl.firstChild.firstChild);
    blockEl.innerHTML = '';
    blockEl.append(figEl);
  }
}
