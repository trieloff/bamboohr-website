import {
    lookupPages,
    readBlockConfig,
  } from '../../scripts/scripts.js';

import { sortOptions } from '../app-cards/app-cards.js';
  
  
  export async function filterTerms(config, block) {
  
    await lookupPages([], 'hrGlossary');
    const index = window.pageIndex.hrGlossary;

    // sort alphabetically by term
    const sortBy = 'term';
    if (sortBy && sortOptions(sortBy)) index.data.sort(sortOptions(sortBy));
    
    const glossaryTermContainer = document.createElement('div');
    glossaryTermContainer.className = 'glossary-term-container';
    block.append(glossaryTermContainer);
    // const glossaryGroupContainer = document.createElement('div');
    // glossaryGroupContainer.className = 'glossary-group-container';
    // glossaryTermContainer.append(glossaryGroupContainer);

    index.data.forEach((glossaryItem) => {
      if (glossaryItem.term != '') {

        //grab the first letter of each term
        const term = glossaryItem.term;
        const glossaryLetter = term.charAt(0);
        if (glossaryLetter >= '0' && glossaryLetter <= '9') {
          glossaryItem.groupLetter = '#';
        } else {
          glossaryItem.groupLetter = glossaryLetter;
        }
        
      }
    });

    // Accepts the array and key
    const groupBy = (array, key) => {
      // Return the end result
      return array.reduce((result, currentValue) => {
        // If an array already present for key, push it to the array. Else create an array and push the object
        (result[currentValue[key]] = result[currentValue[key]] || []).push(
          currentValue
        );
        // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
        return result;
      }, {}); // empty object is the initial value for result object
    };

    // Group by first letter as key to the person array
    const glossaryGroupedByLetter = groupBy(index.data, 'groupLetter');
    
    //Converts objects to arrays
    const glossaryGroups = Object.entries(glossaryGroupedByLetter);

    glossaryGroups.forEach((glossaryGroup) => {
      if (glossaryGroup[0] != 'undefined') {
        const glossaryGroupContainer = document.createElement('div');
        glossaryGroupContainer.className = 'glossary-group-container';
        glossaryTermContainer.append(glossaryGroupContainer);
        const glossaryGroupLetter = document.createElement('div');
        glossaryGroupLetter.className = 'glossary-group-letter typ-title1';
        glossaryGroupContainer.append(glossaryGroupLetter);
        glossaryGroupLetter.textContent = glossaryGroup[0];
        glossaryGroupLetter.id = glossaryGroup[0];
        console.log(glossaryGroup[0]);

        glossaryGroup[1].forEach((glossaryGroupItem) => {
          const glossaryLink = document.createElement('a');
          glossaryLink.textContent = glossaryGroupItem.term;
          glossaryLink.href = glossaryGroupItem.path;
          glossaryLink.className = 'glossary-link';
          glossaryGroupContainer.append(glossaryLink);
        });
      }
    });
  }


  
  export default async function decorate(block) {
    const config = readBlockConfig(block);
    filterTerms(config, block);
    block.innerHTML = '';
  }
  