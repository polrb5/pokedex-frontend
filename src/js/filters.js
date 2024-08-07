// filters.js
import { fetchData } from './services/api.js';
import { API_PATHS } from './constants/api.js';

const filterState = {
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

  items.forEach(item => {
    const filterCheckbox = createFilterCheckbox(item.name, item.name, category);
    section.appendChild(filterCheckbox);
  });

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

const displayErrorMessage = (message) => {
  const errorMessage = document.createElement('p');
  errorMessage.className = 'filters__error-message';
  errorMessage.textContent = message;
  return errorMessage;
};

export const initializeFilters = async () => {
  const filtersContainer = document.getElementById('filters');
  if (!filtersContainer) {
    console.error('Filters container not found');
    return;
  }

  const [typesData, colorsData, gendersData] = await Promise.all([
    fetchData(API_PATHS.TYPES),
    fetchData(API_PATHS.COLORS),
    fetchData(API_PATHS.GENDERS)
  ]);

  if (typesData.error) {
    filtersContainer.appendChild(displayErrorMessage(typesData.error));
  } else {
    const typeSection = createFilterSection('Type', typesData.results, 'types');
    filtersContainer.appendChild(typeSection);
  }

  if (colorsData.error) {
    filtersContainer.appendChild(displayErrorMessage(colorsData.error));
  } else {
    const colorSection = createFilterSection('Color', colorsData.results, 'colors');
    filtersContainer.appendChild(colorSection);
  }

  if (gendersData.error) {
    filtersContainer.appendChild(displayErrorMessage(gendersData.error));
  } else {
    const genderSection = createFilterSection('Gender', gendersData.results, 'genders');
    filtersContainer.appendChild(genderSection);
  }

  const resetButton = createResetButton();
  filtersContainer.appendChild(resetButton);
  console.log('initializeFilters ~ filtersContainer:', filtersContainer);
};

const applyFilters = () => {
  const event = new CustomEvent('filterChange', { detail: filterState });
  document.dispatchEvent(event);
};
