export const displayMessage = (container, message, type, retryCallback = null) => {
  container.innerHTML = `
    <p class="pokemon-list__info-message ${type}">${message}</p>
    ${retryCallback ? '<button id="retry-button" class="pokemon-list__retry-button">Retry</button>' : ''}
  `;

  if (retryCallback) {
    document.getElementById('retry-button').addEventListener('click', retryCallback);
  }
};
