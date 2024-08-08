import { fetchData } from './services/api.js';
import { API_PATHS } from './constants/api.js';
import { displayMessage } from './utils/message.js';
import { MESSAGE_TYPE } from './constants/message';
import { FILTER_TYPE } from './constants/filters';

export const filterState = {
  types: new Set(),
  colors: new Set(),
  genders: new Set(),
};

const createFilterCheckbox = (name, value, category) => {
  const container = document.createElement('div');
  container.className = 'filters__item';

  const input = document.createElement('input');
  input.type = 'checkbox';
  input.id = value;
  input.name = name;
  input.value = value;

  input.addEventListener('change', (e) => {
    const checked = e.target.checked;
    if (checked) {
      filterState[category].add(value);
    } else {
      filterState[category].delete(value);
    }
    applyFilters();
  });

  const label = document.createElement('label');
  label.htmlFor = value;
  label.textContent = name;

  container.appendChild(input);
  container.appendChild(label);

  return container;
};

const createFilterSection = (title, items, category) => {
  const section = document.createElement('section');
  section.className = 'filters__section';

  const header = document.createElement('h3');
  header.className = 'filters__header';
  header.textContent = title;
  section.appendChild(header);

  const sectionClass = category === FILTER_TYPE.TYPES ? 'filters__types' : category === FILTER_TYPE.COLORS ? 'filters__colors' : '';
  const itemContainer = document.createElement('div');
  itemContainer.className = sectionClass;
  items.forEach(item => {
    const filterCheckbox = createFilterCheckbox(item.name, item.name, category);
    itemContainer.appendChild(filterCheckbox);
  });
  section.appendChild(itemContainer);

  return section;
};

const createResetButton = () => {
  const resetButton = document.createElement('button');
  resetButton.className = 'filters__reset-button';
  resetButton.textContent = 'Reset Filters';
  resetButton.addEventListener('click', () => {
    document.querySelectorAll('.filters__item input').forEach(input => input.checked = false);
    filterState.types.clear();
    filterState.colors.clear();
    filterState.genders.clear();
    applyFilters();
  });
  return resetButton;
};

export const initializeFilters = async () => {
  const filtersContainer = document.getElementById('filters');
  if (!filtersContainer) {
    console.error('Filters container not found');
    return;
  }

  const [typesData, colorsData, gendersData] = await Promise.all([
    fetchData(API_PATHS.TYPES),
    fetchData(API_PATHS.COLOR),
    fetchData(API_PATHS.GENDER)
  ]);

  if (typesData.error) {
    displayMessage(filtersContainer, typesData.error, MESSAGE_TYPE.ERROR);
  } else {
    const typeSection = createFilterSection('Type', typesData.data.results, FILTER_TYPE.TYPES);
    filtersContainer.appendChild(typeSection);
  }

  if (colorsData.error) {
    displayMessage(filtersContainer, colorsData.error, MESSAGE_TYPE.ERROR);
  } else {
    const colorSection = createFilterSection('Color', colorsData.data.results, FILTER_TYPE.COLORS);
    filtersContainer.appendChild(colorSection);
  }

  if (gendersData.error) {
    displayMessage(filtersContainer, gendersData.error, MESSAGE_TYPE.ERROR);
  } else {
    const genderSection = createFilterSection('Gender', gendersData.data.results, FILTER_TYPE.GENDER);
    filtersContainer.appendChild(genderSection);
  }

  const resetButton = createResetButton();
  filtersContainer.appendChild(resetButton);
};

const applyFilters = () => {
  const event = new CustomEvent('filterChange', { detail: filterState });
  document.dispatchEvent(event);
};
