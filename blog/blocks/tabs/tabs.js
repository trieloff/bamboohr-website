function openTab(e) {
  const { target } = e;
  const parent = target.parentNode;
  const selected = target.getAttribute('aria-selected') === 'true';
  if (!selected) {
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

export default function decorate(block) {
  [...block.children].forEach((tab) => {
    // setup tab title
    const title = tab.querySelector('h2');
    const open = title.querySelector('strong') !== null; // bold title indicates auto-open tab
    title.classList.add('tabs-title');
    title.setAttribute('aria-selected', open);
    title.innerHTML = title.textContent;
    title.addEventListener('click', openTab);
    // setup tab content
    const content = tab.querySelector('div');
    content.classList.add('tabs-content');
    content.setAttribute('aria-labelledby', title.id);
    content.setAttribute('aria-hidden', !open);
    // move tab and content to block root
    block.append(title, content);
    tab.remove();
  });
  // if no tabs are open, open first tab by default
  if (!block.querySelector('.tabs-title[aria-selected="true"]')) {
    block.querySelector('.tabs-title').setAttribute('aria-selected', true);
    block.querySelector('.tabs-title + .tabs-content').setAttribute('aria-hidden', false);
  }
}
