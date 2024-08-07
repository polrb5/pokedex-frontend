document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById('header');
  header.innerHTML = `
    <div class="header__content">
      <img src="assets/images/logo.png" alt="Pokedex Logo" class="header__content__logo">
      <input type="text" id="search" placeholder="Search for a Pokemon" class="header__content__search">
    </div>
  `;
});
