import { createElem } from '../../scripts/scripts.js';

function setupImages(block) {
  const imageGroupContainer = createElem('div', 'image-group-container');
  const imageParents = block.querySelectorAll(':scope > div:nth-child(n + 2)');

  if (block.classList.contains('triple-hex')) {
    block.closest('.hero-container').classList.add('triple-hex');
  }

  imageParents.forEach((imageParent) => {
    const imageContainer = createElem('div', 'image-container');
    const caption = imageParent.querySelector(':scope > p:nth-child(2)');

    imageContainer.append(imageParent.querySelector('picture'));

    if (caption) imageContainer.append(caption);

    imageGroupContainer.append(imageContainer);
  });

  return imageGroupContainer;
}

function setupContent(block) {
  const content = block.querySelectorAll(':scope > div:first-child > div:first-child')?.item(0);
  const buttons = content.querySelectorAll(':scope .button-container');

  if (buttons.length > 0) {
    const ctaContainer = createElem('div', 'cta-container');

    buttons.forEach((button) => ctaContainer.append(button));
    content.append(ctaContainer);
  }

  return content;
}

export default function decorate(block) {
  const content = setupContent(block);
  const imagesContainer = setupImages(block);

  block.innerHTML = '';
  block.append(content, imagesContainer);
}
