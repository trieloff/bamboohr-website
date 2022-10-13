import { readBlockConfig, createElem } from '../../scripts/scripts.js';

const loadWistia = () => {
  const scriptElem = createElem('script');
  scriptElem.setAttribute('charset', 'ISO-8859-1');
  scriptElem.setAttribute('src', '//fast.wistia.com/assets/external/E-v1.js');
  scriptElem.setAttribute('async', '');

  const modalContainerElem = createElem('div', 'modal-container');
  const modalContentElem = createElem('div', 'modal-content');
  modalContainerElem.append(modalContentElem);

  document.querySelector('body')?.append(modalContainerElem, scriptElem);

  // this script is use for defining Wistia
  window.wistiaInitQueue = window.wistiaInitQueue || [];
  window.wistiaInitQueue.push((W) => {
    // TODO: consider removing this console.log, I can't imagine it is actually necessary.
    // eslint-disable-next-line no-console
    console.log('Wistia library loaded and available in the W argument!', W);
  });
};

loadWistia();

const handleCloseClick = (evt) => {
  evt.preventDefault();

  if (!evt.target.closest('.modal-content')) {
    const bodyElem = document.querySelector('body');
    bodyElem.classList.remove('modal--open');
  }
};

const handleThumbClick = (evt) => {
  evt.preventDefault();

  const wistiaThumbElem = evt.target.closest('.wistia');

  const modalContainerElem = document.querySelector('.modal-container');
  modalContainerElem.addEventListener('click', handleCloseClick, { once: true });

  const modalContentElem = modalContainerElem.querySelector('.modal-content');

  const { wistiaId } = wistiaThumbElem.dataset;
  const { wistiaMinQuality } = wistiaThumbElem.dataset;

  const wistiaElem = createElem('div', 'wistia-content');

  if (wistiaId) {
    // Should probably construct this differently for better security
    let wistiaEmbedMarkup = `<script src="https://fast.wistia.com/embed/medias/${wistiaId}.jsonp" async></script>`;
    wistiaEmbedMarkup += `<div class="wistia_embed wistia_async_${wistiaId}" videoFoam=true`;
    if (wistiaMinQuality) {
      wistiaEmbedMarkup += ` qualityMin="${wistiaMinQuality}"`;
    }
    wistiaEmbedMarkup += ' style="height:auto;position:relative;width:100%"></div>';

    wistiaElem.innerHTML = wistiaEmbedMarkup;
  }

  modalContentElem.append(wistiaElem);
  const bodyElem = document.querySelector('body');
  bodyElem.classList.add('modal--open');
};

export default function decorate(block) {
  const ref = block;

  const config = readBlockConfig(block);

  const thumbnailImgElem = ref.querySelector('picture');

  block.dataset.wistiaId = config['wistia-id'];
  if (config['wistia-min-quality']) {
    block.dataset.wistiaMinQuality = config['wistia-min-quality'];
  }

  const playBtnElem = createElem('div', 'wistia-play-btn');

  block.innerHTML = '';

  block.append(thumbnailImgElem, playBtnElem);

  block.addEventListener('click', handleThumbClick);
}
