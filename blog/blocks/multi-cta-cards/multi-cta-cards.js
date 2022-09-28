import {
  createElem,
  decorateIcons,
  getValuesFromClassName,
  hasClassStartsWith,
} from '../../scripts/scripts.js';

const TOOLTIP_SHOW_CSS_CLASS = 'multi-cta-tooltip-show';
const TOOLTIP_IS_SHOWING_CSS_CLASS = 'multi-cta-tooltip-is-showing';

const bodyElem = document.querySelector('body');

const handleCloseTooltip = () => {
  if (bodyElem.classList.contains(TOOLTIP_IS_SHOWING_CSS_CLASS)) {
    const showedTooltipElems = document.querySelectorAll(`.${TOOLTIP_SHOW_CSS_CLASS}`);

    showedTooltipElems.forEach((showedTooltipElem) => {
      showedTooltipElem.classList.remove(TOOLTIP_SHOW_CSS_CLASS);
    });

    bodyElem.classList.remove(TOOLTIP_IS_SHOWING_CSS_CLASS);
  }
};

const handleLiClick = (evt) => {
  const liElem = evt.target.closest('li');
  const ulElem = evt.target.closest('ul');

  bodyElem.classList.add(TOOLTIP_IS_SHOWING_CSS_CLASS);

  const allLiElems = ulElem.querySelectorAll('li');

  const isShowed = liElem.classList.contains(TOOLTIP_SHOW_CSS_CLASS);

  allLiElems.forEach((allLiElem) => {
    allLiElem.classList.remove(TOOLTIP_SHOW_CSS_CLASS);
  });

  if (!isShowed) {
    liElem.classList.add(TOOLTIP_SHOW_CSS_CLASS);
  }

  bodyElem.addEventListener('click', handleCloseTooltip, { capture: true, once: true });
};

function buildTooltips(block) {
  const colElems = block.querySelectorAll(':scope > div:first-child > div');

  colElems.forEach((colElem, colIdx) => {
    colElem.classList.add('multi-cta-col');

    const colLiElems = colElem.querySelectorAll('li');

    colLiElems.forEach((colLiElem, colLiIdx) => {
      colLiElem.addEventListener('click', handleLiClick);

      const rowIdx = colLiIdx + 2;

      colLiElem.innerHTML = `<span>${colLiElem.innerHTML}</span>`;

      const tooltipElem = block.querySelector(`:scope > div:nth-child(${rowIdx}) > div:nth-child(${colIdx + 1})`);

      const tooltipButtonContainerElems = tooltipElem.querySelectorAll('.button-container');

      tooltipButtonContainerElems.forEach((tooltipButtonContainerElem) => {
        const tooltipAnchor = tooltipButtonContainerElem.querySelector('a');

        if (tooltipAnchor) {
          tooltipAnchor.removeAttribute('class');
          decorateIcons(tooltipAnchor);
        }
        tooltipButtonContainerElem.outerHTML = tooltipButtonContainerElem.innerHTML;
      });

      if (tooltipElem != null) {
        const tooltipContainerElem = createElem('div', 'multi-cta-tooltip-container');
        tooltipContainerElem.innerHTML = tooltipElem.innerHTML;
        tooltipElem.innerHTML = '';

        colLiElem.append(tooltipContainerElem);
      }
    });
  });
}

export default function decorate(block) {
  const columnContainerElem = block.querySelector(':scope > div:first-child');
  columnContainerElem?.classList.add('multi-cta-column-container');

  const columnElems = block.querySelectorAll(':scope > div:first-child > div');
  const colCount = [...columnElems].length;

  if (colCount > 2) {
    block.parentElement?.classList.add('multi-cta-wrapper-extended');
  }

  if (hasClassStartsWith(block, 'theme-on-col-')) {
    const classNames = [...block.classList];

    classNames.forEach((className) => {
      if (className.startsWith('theme-on-col-')) {
        const colorParams = getValuesFromClassName(className, 'theme-on-col-');

        const columnElem = block.querySelector(`:scope > div:first-child > div:nth-child(${colorParams[0]})`);

        columnElem.classList.add(colorParams[1]);
      }
    });
  }

  buildTooltips(block);
}
