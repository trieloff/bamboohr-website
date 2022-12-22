import {
  createOptimizedPicture,
  getMetadata,
} from '../../scripts/scripts.js';

function createContent() {
  const content = document.createElement('div');
  const presenter = getMetadata('presenter');
  const { title } = document;
  const description = getMetadata('description');
  const category = getMetadata('category');
  const dateString = getMetadata('presentation-date');
  const date = new Date(dateString);
  const presentationDate = date.toDateString();
  const presentationTime = date.toLocaleTimeString();
  const image = getMetadata('metadata-content-image');
  const picture = createOptimizedPicture(image, false, [{ width: '286' }]);

  content.innerHTML = `
    <div class="content-container">
      <div class="content-image">${picture.outerHTML}</div>
      <div class="content-body" am-region="${title}">
        <h3>${presenter}</h3>
        <h1>${title}</h1>
        <p>${description}</p>
        <span class="content-category">${category}</span> 
        <span class="content-date">${presentationDate} ${presentationTime}</span>
      </div>
    </div>`;
  return (content);
}

export default async function decorate(block) {
  block.append(createContent());
}
