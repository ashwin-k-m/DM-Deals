const dropdowns = document.querySelectorAll('.dropdown-toggle');
dropdowns.forEach(dropdown => {
    dropdown.addEventListener('click', function (e) {
        const parent = this.parentNode;
        parent.classList.toggle('show');
    });
});

document.addEventListener('click', function (e) {
    if (!e.target.matches('.dropdown-toggle')) {
        document.querySelectorAll('.dropdown').forEach(dropdown => {
            dropdown.classList.remove('show');
        });
    }
});