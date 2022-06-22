export default function decorate(block, blockName) {
  block.classList.add(`${blockName}-${block.children.length}`);
}
