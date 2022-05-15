import { readBlockConfig } from '../../scripts/scripts.js';

export default function decorate(block) {
  const config = readBlockConfig(block);
  const maxLevel = config.levels || 1;
  const showSubtree = config['show-subtree'] ? config['show-subtree'].toLowerCase().trim() : '';

  const title = document.createElement('div');
  title.className = 'toc-title';
  title.textContent = 'Table of Content';
  block.textContent = '';
  block.append(title);

  const tocItems = document.querySelectorAll('.default-content-wrapper h2, .default-content-wrapper h3, .default-content-wrapper h4, .default-content-wrapper h5');
  const olStack = [document.createElement('ol')];
  let lastChapter = '';
  tocItems.forEach((h) => {
    const hLevel = parseInt(h.tagName.substring(1), 10) - 1;
    const show = showSubtree ? (hLevel < 2 || lastChapter === showSubtree) : true;
    if (hLevel <= maxLevel && show) {
      while (hLevel > olStack.length) {
        const newOl = document.createElement('ol');
        olStack[olStack.length - 1].append(newOl);
        olStack.push(newOl);
      }
      while (hLevel < olStack.length) olStack.pop();
      const ol = olStack[hLevel - 1];
      const li = document.createElement('li');
      li.innerHTML = `<a href="#${h.id}">${h.textContent}</a>`;
      ol.append(li);
      if (hLevel === 1) lastChapter = h.textContent.toLowerCase().trim();
    }
  });
  block.append(olStack[0]);
}
