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
  }
}

export default function decorate(block) {
  [...block.children].forEach((tab) => {
    // setup tab title
    const title = tab.querySelector('h2');
    title.classList.add('tabs-title');
    title.setAttribute('aria-selected', title.querySelector('strong') !== null); // bold title indicates auto-open tab
    title.addEventListener('click', openTab);
    // setup tab content
    const content = tab.querySelector('div');
    content.classList.add('tabs-content');
    content.setAttribute('aria-labelledby', title.id);
    content.setAttribute('aria-hidden', title.querySelector('strong') == null); // bold title indicates auto-open tab
    // move tab and content to block root
    block.append(title, content);
    tab.remove();
  });
}
