import { createOptimizedPicture, toClassName } from '../../scripts/scripts.js';
import { filterResults } from '../listing/listing.js';

export function createAppCard(app, prefix) {
  const card = document.createElement('li');
  card.className = `${prefix}-card`;
  const title = app.title.split(' - ')[0];
  const level = app.level ? `<img src="/blog/icons/${toClassName(app.level)}-badge.svg">` : '';
  const picture = createOptimizedPicture(app.image, title, false, [{ width: 750 }]).outerHTML;
  const searchTags = app.searchTags ? `<div class="${prefix}-card-search-tags"><span>${app.searchTags.split(',').join('</span><span>')}</span></div>` : '';
  card.innerHTML = `<div class="${prefix}-card-image">${picture}</div>
  <div class="${prefix}-card-body">
  <div class="${prefix}-card-header"><h4>${title}</h4>${level}</div>
  <div class="${prefix}-card-detail"><p>${app.description}</p>
  <a href="${app.path}">Learn More</a></div>
  ${searchTags}
  </div>`;
  return (card);
}

export default async function decorate(block, blockName) {
  const pathnames = [...block.querySelectorAll('a')].map((a) => new URL(a.href).pathname);
  const results = await filterResults(pathnames);
  block.textContent = '';
  const ul = document.createElement('ul');
  results.forEach((app) => {
    ul.append(createAppCard(app, blockName));
  });
  block.append(ul);
}
