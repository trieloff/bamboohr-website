export default function decorate(block) {
  if (block.classList.contains('normal-width')) block.parentElement.classList.add('normal-width');
}
