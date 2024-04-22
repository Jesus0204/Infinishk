$(document).ready(function () {

    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function () {

        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        $(".navbar-burger").toggleClass("is-active");
        $(".navbar-menu").toggleClass("is-active");

    });
});

const click_target = (element) => {
    if (window.innerWidth < 1024) {
        // Get the target from the "data-target" attribute
        const target = element.dataset.target;
        const $target = document.getElementById(target);

        if ($target.style.display === "block") {
            $target.style.display = "none";
        } else {
            $target.style.display = "block";
        }
    }
}

function navbar_movil() {
    const $navDropdowns = document.querySelectorAll(".navbar-item.has-dropdown");
    if ($navDropdowns.length > 0) {
        $navDropdowns.forEach((el) => {
            // Agarrar al hijo para solo sea cuando dan click ahi
            const navbar_link = el.firstElementChild;
            const target = el.dataset.target;
            const $target = document.getElementById(target);
            $target.style.display = "none";
        });
    }

    const $navbaritem = document.querySelectorAll(".navbar-item");
    if ($navbaritem.length > 0) {
        $navbaritem.forEach((el) => {
            el.classList.add('main_menu');
        });
    }

    const $navbarlink = document.querySelectorAll(".navbar-link");
    if ($navbarlink.length > 0) {
        $navbarlink.forEach((el) => {
            el.classList.add('main_menu');
        });
    }
}

// Regresas las variables a como estaban antes
function navbar_desktop() {
    const $navDropdowns = document.querySelectorAll(".navbar-item.has-dropdown");
    if ($navDropdowns.length > 0) {
        $navDropdowns.forEach((el) => {
            // Agarrar al hijo para solo sea cuando dan click ahi
            const navbar_link = el.firstElementChild;
            const target = el.dataset.target;
            const $target = document.getElementById(target);
            $target.style.display = "";
        });

    }

    const $navbaritem = document.querySelectorAll(".navbar-item");
    if ($navbaritem.length > 0) {
        $navbaritem.forEach((el) => {
            el.classList.remove('main_menu');
        });
    }

    const $navbarlink = document.querySelectorAll(".navbar-link");
    if ($navbarlink.length > 0) {
        $navbarlink.forEach((el) => {
            el.classList.remove('main_menu');
        });
    }
}

if (window.matchMedia("(max-width: 1023px)").matches) {
    navbar_movil();
};

window.addEventListener('resize', () => {
    const configuracion = document.getElementById('configuracion');
    if (window.innerWidth >= 1024) {
        if (configuracion){
            configuracion.style.width = '115%';
        }
        navbar_desktop();
    } else {
        if (configuracion) {
            configuracion.style.width = '100%';
        }
        navbar_movil();
    }
});