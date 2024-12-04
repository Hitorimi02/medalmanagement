function initializeMenu() {
    const menu = document.getElementById('menu');
    const menuButton = document.getElementById('menu-button');
    const closeMenuButton = document.getElementById('close-menu');

    if (menu && menuButton && closeMenuButton) {
        menuButton.addEventListener('click', () => {
            menu.classList.add('open');
        });

        closeMenuButton.addEventListener('click', () => {
            menu.classList.remove('open');
        });

        window.addEventListener('click', (e) => {
            if (!menu.contains(e.target) && !menuButton.contains(e.target)) {
                menu.classList.remove('open');
            }
        });
    }
}
