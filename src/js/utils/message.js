import clsx from 'clsx';

export const displayMessage = (container, message, type, retryCallback = null) => {
  container.innerHTML = `
    <p class="${clsx('info-message', { 'info-message--error': type === 'error' })}">${message}</p>
    ${retryCallback ? '<button id="retry-button" class="retry-button">Retry</button>' : ''}
  `;

  if (retryCallback) {
    document.getElementById('retry-button').addEventListener('click', retryCallback);
  }
};
