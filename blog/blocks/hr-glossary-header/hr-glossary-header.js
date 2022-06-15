function createDiv(name, type, content) {
  const div = document.createElement('div');
  div.classList.add(`${name}-${type}`);
  div.append(content);
  return div;
}

export default async function decorateGlossaryHeader(block, blockName) {
  const resp = await fetch(`/${blockName.replace('-header', '')}/header.plain.html`);
  const text = await resp.text();
  const html = document.createElement('div');
  html.innerHTML = text;
  const picture = html.querySelector('picture');
  const h1 = html.querySelector('h1')?.textContent;
  const h2 = html.querySelector('h2')?.textContent;
  if (picture && h1) {
    block.append(createDiv(blockName, 'image', picture));
    block.append(createDiv(blockName, 'title', h1));
    if (h2) block.append(createDiv(blockName, 'subtitle', h2));
  }
}
