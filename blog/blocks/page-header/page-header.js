function createDiv(name, type, content) {
  const div = document.createElement('div');
  div.classList.add(`${name}-${type}`);
  div.append(content);
  return div;
}

export default async function decoratePageHeader(block, blockName) {
  const location = block.getAttribute('data-header-location');
  const resp = await fetch(`/${location}/header.plain.html`);
  const text = await resp.text();
  const html = document.createElement('div');
  html.innerHTML = text;
  const picture = html.querySelector('picture');
  const h1 = html.querySelector('h1')?.textContent;
  const h2 = html.querySelector('h2')?.textContent;
  if (picture && h1) {
    const h1OnPage = document.querySelector('h1');
    block.append(createDiv(blockName, 'image', picture));
    if (h1OnPage) {
      block.append(createDiv(blockName, 'title', h1));
    } else {
      const title = document.createElement('h1');
      title.textContent = h1;
      block.append(createDiv(blockName, 'title', title));
    }
    if (h2) block.append(createDiv(blockName, 'subtitle', h2));
  }
}
