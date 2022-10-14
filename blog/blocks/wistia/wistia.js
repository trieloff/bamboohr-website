import { readBlockConfig, createElem } from '../../scripts/scripts.js';

let loaded = false;

const loadWistia = () => {
  if (loaded) return;
  const scriptElem = createElem('script');
  scriptElem.setAttribute('async', '');
  scriptElem.setAttribute('src', '//fast.wistia.com/assets/external/E-v1.js');

  const modalWrapperElem = createElem('div', 'modal-wrapper');
  modalWrapperElem.classList.add('wistia-modal');
  const modalElem = createElem('div', 'modal');
  const modalCloseElem = createElem('div', 'modal-close');
  const modalContentElem = createElem('div', 'modal-content');
  modalElem.append(modalCloseElem, modalContentElem);
  modalWrapperElem.append(modalElem);

  document.querySelector('body')?.append(modalWrapperElem, scriptElem);

  // this script is use for defining Wistia
  window.wistiaInitQueue = window.wistiaInitQueue || [];

  loaded = true;
};

loadWistia();

const handleCloseClick = (evt) => {
  // no bubbles
  evt.stopImmediatePropagation();

  // skip children clicks
  if (
    !evt.target.classList.contains('modal-wrapper') &&
    !evt.target.classList.contains('modal-close')
  ) {
    return;
  }

  const wrapperElem = evt.target.closest('.modal-wrapper');

  // hide modal
  const bodyElem = document.querySelector('body');
  bodyElem.classList.remove('modal-open');
  wrapperElem.classList.remove('visible');

  // remove existing player
  wrapperElem.querySelector('.wistia_embed').remove();
};

const handleThumbClick = (evt) => {
  evt.preventDefault();

  const wistiaThumbElem = evt.target.closest('.wistia');

  const modalWrapperElem = document.querySelector('.modal-wrapper');
  modalWrapperElem.addEventListener('click', handleCloseClick);
  const modalCloseElem = modalWrapperElem.querySelector('.modal-close');
  modalCloseElem.addEventListener('click', handleCloseClick);
  const modalContentElem = modalWrapperElem.querySelector('.modal-content');

  const { wistiaId, wistiaMinQuality } = wistiaThumbElem.dataset;

  if (wistiaId) {
    const embedElem = createElem('div', 'wistia_embed');
    embedElem.classList.add(`wistia_async_${wistiaId}`);
    embedElem.setAttribute('videoFoam', 'true');
    embedElem.setAttribute('style', 'height: auto; position: relative; width: 100%;');

    if (wistiaMinQuality) embedElem.setAttribute('qualityMin', wistiaMinQuality);

    modalContentElem.append(embedElem);

    const bodyElem = document.querySelector('body');
    bodyElem.classList.add('modal-open');
    modalWrapperElem.classList.add('visible');

    // play it again, sam
    window._wq = window._wq || [];
    _wq.push({
      id: wistiaId,
      onReady: (video) => video.play(),
    });
  }
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
