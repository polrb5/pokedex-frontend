document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById('header');
  header.innerHTML = `
    <img src="assets/images/logo.png" alt="Pokedex Logo" class="header__logo">
    <input type="text" id="search" placeholder="Search for a Pokemon" class="header__search">
  `;
});
