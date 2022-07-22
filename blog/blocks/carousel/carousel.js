function selectButton(block, button, row, buttons) {
  block.scrollTo({ top: 0, left: row.offsetLeft - row.parentNode.offsetLeft, behavior: 'smooth' });
  buttons.forEach((r) => r.classList.remove('selected'));
  button.classList.add('selected');
}

export default function decorate(block) {
  const buttons = document.createElement('div');
  const autoPlayList = [];
  let carouselInterval = null;
  buttons.className = 'carousel-buttons';
  [...block.children].forEach((row, i) => {
    const classes = ['image', 'text'];
    classes.forEach((e, j) => {
      if (row.children[j]) row.children[j].classList.add(`carousel-${e}`);
    });
    /* buttons */
    const button = document.createElement('button');
    if (!i) button.classList.add('selected');
    button.addEventListener('click', () => {
      window.clearInterval(carouselInterval);
      selectButton(block, button, row, [...buttons.children]);
    });
    buttons.append(button);
    autoPlayList.push({ row, button });
  });
  block.parentElement.append(buttons);

  carouselInterval = window.setInterval(() => {
    autoPlayList.some((b, i) => {
      const isSelected = b.button.classList.contains('selected');
      if (isSelected) {
        const nextB = (i + 1 >= autoPlayList.length) ? autoPlayList[0] : autoPlayList[i + 1];
        selectButton(block, nextB.button, nextB.row, [b.button]);
      }
      return isSelected;
    });
  }, 5000);
}
