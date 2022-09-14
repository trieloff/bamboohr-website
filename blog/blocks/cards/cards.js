export default function decorate(block) {
  const cards = block.querySelectorAll(':scope > div');

  if (block.classList.contains('full-width')) block.parentElement.classList.add('full-width');

  // convert "number" classes
  [...block.classList].forEach((name) => {
    if (!Number.isNaN(+name.split('').at(0))) {
      block.classList.remove(name);
      block.classList.add(`style-${name}`);
    }
  });

  // empty block
  block.textContent = '';
  cards.forEach((card) => {
    const contents = card.querySelectorAll(':scope > div');
    const icon = card.querySelector('span.icon');

    // loop children
    card.textContent = '';
    contents.forEach((content) => {
      const alignment = content.dataset.align;

      // set alignment
      if (alignment) card.dataset.align = alignment;

      // pull everything into one div
      [...content.children].forEach((element) => card.append(element));
    });

    const image = card.querySelector('picture');
    const title = card.querySelector('h4');

    // move icon out of p
    if (icon) card.prepend(icon);

    // clear out empties
    card.querySelectorAll(':scope > p:empty').forEach((empty) => empty.remove());

    // add image classes
    if (image) {
      card.classList.add('has-image');
      image.classList.add('image');
    }

    // add title class
    if (title) title.classList.add('title');

    // add card to block
    card.classList.add('card');
    block.append(card);
  });
}
