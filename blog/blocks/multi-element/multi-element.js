export default function decorate(block) {
  const cols = block.querySelectorAll(':scope > div > div');

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
}
