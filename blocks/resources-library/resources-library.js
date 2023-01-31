import {
    lookupPages,
    readBlockConfig,
  } from '../../scripts/scripts.js';

import { sortOptions } from '../app-cards/app-cards.js';

export function createResourceCard(app, prefix) {
    const card = document.createElement('div');
    card.className = `${prefix}-card`;
    const cardLinkText = app.formSubmitText ? app.formSubmitText : 'Free Download';

    card.innerHTML = `<a href="${app.path}"><img class="${prefix}-card-image" alt="${app.title}" src="${app.image}"></a><div class="${prefix}-card-copy-container"><p>${app.description}</p><a href="${app.path}" class="${prefix}-card-link">${cardLinkText}</a></div>`;
    return (card);
}
  
  export async function filterTerms(config, block) {
  
    await lookupPages([], 'resources');
    const index = window.pageIndex.resources;
    const sortBy = 'category';
    if (sortBy && sortOptions(sortBy)) index.data.sort(sortOptions(sortBy));
    const resourceLibraryContainer = document.createElement('div');
    resourceLibraryContainer.className = 'resource-library-container';
    block.append(resourceLibraryContainer);

    index.data.forEach((resourceCard) => {
      if (resourceCard.title != '') {
        const title = resourceCard.title;
        const category = resourceCard.category;
        resourceCard.groupCategory = category;
      }
    });

    const groupBy = (array, key) => {
      return array.reduce((result, currentValue) => {
        (result[currentValue[key]] = result[currentValue[key]] || []).push(
          currentValue
        );
        return result;
      }, {});
    };

    const resourcesGroupedByCategories = groupBy(index.data, 'groupCategory');
    
    const resourceGroups = Object.entries(resourcesGroupedByCategories);

    resourceGroups.forEach((resourceGroup) => {
      if (resourceGroup[0] != 'undefined') {
        const resourceGroupContainer = document.createElement('div');
        resourceGroupContainer.className = 'resource-group-container';
        resourceLibraryContainer.append(resourceGroupContainer);
        const resourceGroupCategory = document.createElement('div');
        resourceGroupCategory.className = 'resource-group-title typ-title1';
        resourceGroupContainer.append(resourceGroupCategory);
        const resourceGroupTitle = resourceGroup[0].charAt(0).toUpperCase() + resourceGroup[0].slice(1);;
        resourceGroupCategory.textContent = resourceGroupTitle;
        resourceGroupCategory.id = resourceGroup[0];

        resourceGroup[1].forEach((resourceGroupItem) => {
            const cardContainer = document.createElement('ul');
            if (resourceGroupItem.image != '') {
              cardContainer.append(createResourceCard(resourceGroupItem, 'resource'));
              resourceGroupContainer.append(cardContainer);
            }
        });
      }
    });
  }
  
  export default async function decorate(block) {
    const config = readBlockConfig(block);
    filterTerms(config, block);
    block.innerHTML = '';
  }
  