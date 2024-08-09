import { fetchData } from './services/api.js';
import { API_PATHS } from './constants/api.js';
import { displayMessage } from './utils/message.js';
import { MESSAGE, MESSAGE_TYPE } from './constants/message';
import { FILTER_TYPE } from './constants/filters';
import { capitalize } from './utils/text';

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
  const capitalizedLabel = capitalize(name)
  label.textContent = capitalizedLabel;

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

  itemContainer.append(...items.map(item => createFilterCheckbox(item.name, item.name, category)));

  section.appendChild(itemContainer);

  return section;
};

const createResetButton = () => {
  const resetButton = document.createElement('button');
  resetButton.className = 'filters__reset-button';
  resetButton.textContent = 'Reset All';
  resetButton.addEventListener('click', () => {
    Array.from(document.querySelectorAll('.filters__item input')).map(input => input.checked = false);
    filterState.types.clear();
    filterState.colors.clear();
    filterState.genders.clear();
    applyFilters();
    
    const searchInput = document.getElementById('search');
    if (searchInput) searchInput.value = '';
  });

  
  return resetButton;
};

export const initializeFilters = async () => {
  const filtersContainer = document.getElementById('filters');
  if (!filtersContainer) return displayMessage(filtersContainer, MESSAGE.NO_FILTERS_FOUND, MESSAGE_TYPE.ERROR);

  const [typesData, colorsData, gendersData] = await Promise.all([
    fetchData(API_PATHS.TYPE),
    fetchData(API_PATHS.COLOR),
    fetchData(API_PATHS.GENDER)
  ]);

  const handleFilterSection = (data, label, filterType) => {
    if (data.error) return displayMessage(filtersContainer, data.error, MESSAGE_TYPE.ERROR);

    const section = createFilterSection(label, data.data.results, filterType);
    filtersContainer.appendChild(section);
  };

  handleFilterSection(typesData, 'Type', FILTER_TYPE.TYPES);
  handleFilterSection(colorsData, 'Color', FILTER_TYPE.COLORS);
  handleFilterSection(gendersData, 'Gender', FILTER_TYPE.GENDER);

  const resetButton = createResetButton();
  filtersContainer.appendChild(resetButton);
};

const applyFilters = () => {
  const event = new CustomEvent('filterChange', { detail: filterState });
  document.dispatchEvent(event);
};
