export const showSpinner = (parentElement) => {
  const spinner = document.createElement('div');
  spinner.className = 'spinner';
  parentElement.appendChild(spinner);
};

export const hideSpinner = () => {
  const spinner = document.querySelector('.spinner');
  if (spinner) {
    spinner.remove();
  }
};
