import { buildBlock, getMetadata, toClassName } from './scripts.js';

function buildForm(main) {
  const blockContent = [];
  blockContent.push(main.querySelector(':scope > div').innerHTML);

  const eventDate = new Date(getMetadata('event-date'));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  eventDate.setHours(0, 0, 0, 0);
  const formTitle = eventDate > today ? 'Register for the Webinar' : 'Watch Now';
  const formSubheading = getMetadata('form-subheading') || 'All you need to do is complete the form below.';

  let partners = getMetadata('partner');
  let logos = '';
  if (partners) {
    partners = [...partners.split(', ')];
    let partnerLogos = '<img src="/assets/partner-logos/bamboohr.svg" alt="BambooHR logo" />';
    partners.forEach((partner) => {
      partnerLogos += `<img src="/assets/partner-logos/${toClassName(partner)}.svg" alt="${partner} logo" />`;
    });
    logos = `<p class="form-logos">${partnerLogos}</p>`;
  }

  blockContent.push(`<p><strong>${formTitle}</strong></p><p>${formSubheading}</p>${logos}<p>form</p>`);
  
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

    const title = 'About the speakers';
    const titleBlock = buildBlock('title', title);
    titleBlock?.classList.add('title1', 'color-gray-12');
    titleBlock?.querySelector('div').setAttribute('data-align', 'center');
    main.querySelector('.speaker-container').append(titleBlock);

    const speakerBlock = buildBlock('speaker', []);
    speakerBlock.classList.add('style-2-columns');
    main.querySelector('.speaker-container').append(speakerBlock);
  }
}


export default async function decorateTemplate(main) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const formSubmit = urlParams.get('formSubmit');

  if (formSubmit && formSubmit === 'success') {
    main.innerHTML = '';
    document.body.classList.add('webinar-success');
  } else {
    buildForm(main);
    buildSpeaker(main);
  }
}
