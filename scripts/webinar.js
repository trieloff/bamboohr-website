import { buildBlock, getMetadata } from './scripts.js';

function buildForm(main) {
  const blockContent = [];
  blockContent.push(main.querySelector(':scope > div').innerHTML);

  const eventDate = new Date(getMetadata('event-date'));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  eventDate.setHours(0, 0, 0, 0);
  const formTitle = eventDate > today ? 'Register for the Webinar' : 'Watch Now';
  const formSubheading = getMetadata('form-subheading') || 'All you need to do is complete the form below.';
  blockContent.push(`<p><strong>${formTitle}</strong></p><p>${formSubheading}</p><p>form</p>`);
  
  const section = document.createElement('div');
  const block = buildBlock('form', [blockContent]);
  block?.classList?.add('grid-7-5', 'has-content', 'old-style');
  section.prepend(block);
  main.innerHTML = section.outerHTML;
}

async function buildSpeaker(main) {
  const speakers = getMetadata('speaker');
  if (speakers) {

    const container = buildBlock('speaker-container', []);
    main.append(container);
    const speakerBlock = buildBlock('speaker', [['']]);
    // console.log(speakerBlock);
    main.querySelector('.speaker-container').append(speakerBlock);
  }
}


export default async function decorateTemplate(main) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const formSubmit = urlParams.get('formSubmit');
  const category = getMetadata('category');

  if (formSubmit && formSubmit === 'success') {
    main.innerHTML = '';
    document.body.classList.add('webinar-success');
  } else {
    buildForm(main);
    buildSpeaker(main);
  }
}
