const mediaQuery = window.matchMedia('(max-width: 768px)');

function moveImages(block, matched) {
  const images = block.querySelectorAll('.has-images');
  const p = block.querySelector('p:first-of-type');

  images.forEach((image) => {
    if (matched) {
      // move images into content section
      p.before(image);
    } else {
      // put 'em back
      block.querySelector(':scope > div').append(image);
    }
  });
}

export default function decorate(block) {
  const cols = block.querySelectorAll(':scope > div > div');

  if (block.classList.contains('full-width')) block.parentElement.classList.add('full-width');
  if (block.classList.contains('mid-width')) block.parentElement.classList.add('mid-width');

  // convert "number" classes
  [...block.classList].forEach((name) => {
    if (!Number.isNaN(+name.split('').at(0))) {
      block.classList.remove(name);
      block.classList.add(`style-${name}`);
    }
  });

  cols.forEach((col) => {
    const pictures = col.querySelectorAll('picture');

    if (pictures.length) {
      col.classList.add('has-images');

      // move to parent div and remove empty p
      pictures.forEach((picture) => {
        picture.parentNode.remove();
        col.append(picture);
      });
    }
  });

  // hero duplication
  if (block.classList.contains('hero') || !block.classList.contains('logo-cards')) {
    console.log(block);
    moveImages(block, mediaQuery.matches);

    mediaQuery.addEventListener('change', (event) => {
      moveImages(block, event.matches);
    });
  }
}
