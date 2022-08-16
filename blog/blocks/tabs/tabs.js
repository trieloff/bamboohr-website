/* TODO: use for skipping click/hover functions  */
const mediaQuery = window.matchMedia('(max-width: 600px)');

function openTab(e) {
  const { target } = e;
  const parent = target.parentNode;
  const selected = target.getAttribute('aria-selected') === 'true';

  // skip for custom styles on small screens
  if ((parent.classList.contains('style-1')
    || parent.classList.contains('style-2'))
    && mediaQuery.matches) return;

  // no bubbling plz
  if (target.classList.contains('tabs-title') && !selected) {
    // close all open tabs
    const openTitles = parent.querySelectorAll('[aria-selected="true"]');
    const openContent = parent.querySelectorAll('[aria-hidden="false"]');
    openTitles.forEach((tab) => tab.setAttribute('aria-selected', false));
    openContent.forEach((tab) => tab.setAttribute('aria-hidden', true));

    // open clicked tab
    target.setAttribute('aria-selected', true);
    const content = parent.querySelector(`[aria-labelledby="${target.id}"]`);
    content.setAttribute('aria-hidden', false);
  } else if (window.innerWidth < 600) {
    target.setAttribute('aria-selected', false);
    const content = parent.querySelector(`[aria-labelledby="${target.id}"]`);
    content.setAttribute('aria-hidden', true);
  }
}

function buildDotNav(count) {
  const dots = document.createElement('ol');
  dots.classList.add('tabs-dots');

  // make dots
  [...new Array(count).fill('').keys()].forEach(() => {
    const dot = document.createElement('li');
    dot.classList.add('tabs-dots-dot');
    dots.append(dot);
  });

  return dots;
}

export default function decorate(block) {
  // check for custom styles
  let customStyle;
  block.classList.forEach((value) => {
    if (value.match(/^style-\d$/)) {
      customStyle = value;
    }
  });

  [...block.children].forEach((tab) => {
    // setup tab title
    const title = tab.querySelector('h2');
    const anchor = title.querySelector('a');
    const open = title.querySelector('strong') !== null; // bold title indicates auto-open tab
    let titleElement;

    // manipulate for custom styles
    if (customStyle === 'style-2') {
      const subtitle = tab.querySelector('h3');

      if (anchor) {
        titleElement = anchor;
      } else {
        titleElement = document.createElement('div');
      }

      titleElement.setAttribute('id', title.getAttribute('id'));
      title.removeAttribute('id');
      title.innerHTML = title.textContent;
      title.classList.add('tabs-title-title');
      titleElement.textContent = '';
      titleElement.append(title);

      if (subtitle) {
        subtitle.classList.add('tabs-title-subtitle');
        titleElement.append(subtitle);
      }

      titleElement.addEventListener('mouseover', openTab);
    } else {
      titleElement = title;
      titleElement.innerHTML = title.textContent;
      titleElement.addEventListener('click', openTab);
    }

    titleElement.classList.add('tabs-title');
    titleElement.setAttribute('aria-selected', open);

    // setup tab content
    const content = tab.querySelector('div');
    content.classList.add('tabs-content');
    content.setAttribute('aria-labelledby', titleElement.id);
    content.setAttribute('aria-hidden', !open);

    // move tab and content to block root
    block.append(titleElement, content);
    tab.remove();
  });

  if (customStyle === 'style-1' || customStyle === 'style-2') {
    // count tabs
    const count = block.querySelectorAll('.tabs-title').length;

    // add dynamic grid number, +1 for dots
    block.style.gridTemplateRows = `repeat(${count + 1}, min-content)`;

    // add dots
    block.append(buildDotNav(count));
  }

  // if no tabs are open, open first tab by default
  if (!block.querySelector('.tabs-title[aria-selected="true"]')) {
    block.querySelector('.tabs-title').setAttribute('aria-selected', true);
    block.querySelector('.tabs-title + .tabs-content').setAttribute('aria-hidden', false);
  }
}
