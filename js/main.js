/*SITE CONFIG*/

const SITE_CONFIG = {

    getBasePath() {

        const pathParts = window.location.pathname.split("/");

        // GitHub Pages project site
        if (window.location.hostname.includes("github.io")) {
            return "/" + pathParts[1];
        }

        // Localhost / custom domain
        return "";
    }

};


/*COMPONENT LOADER*/

async function loadComponent(componentName, placeholderId) {

    const basePath = SITE_CONFIG.getBasePath();
    const componentURL = `${basePath}/${componentName}`;

    try {

        const response = await fetch(componentURL);

        if (!response.ok) {
            throw new Error(
                `Failed to load ${componentName}: ${response.status}`
            );
        }

        let html = await response.text();

        // Replace {{BASE}} inside components
        html = html.replaceAll("{{BASE}}", basePath);

        const placeholder = document.getElementById(placeholderId);

        if (placeholder) {
            placeholder.innerHTML = html;
        }

    } catch (error) {

        console.error(
            "Component load failed:",
            componentName,
            error
        );

    }

}


/*SECTION TITLE SCROLL ANIMATION*/

function initSectionTitleAnimation() {

    const titles = document.querySelectorAll(".section-title");

    if (!titles.length) return;

    const observer = new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                }

            });

        },
        {
            threshold: 0.5
        }
    );

    titles.forEach(title => {
        observer.observe(title);
    });

}


/*HERO PARALLAX*/

function initHeroParallax() {

    const heroImage = document.querySelector(".hero-parallax");

    if (!heroImage) return;

    window.addEventListener("scroll", () => {

        heroImage.style.transform =
            `translateY(${window.scrollY * 0.3}px)`;

    });

}


/*UNIVERSAL CAROUSEL ENGINE*/

function initCarousel(
    containerSelector,
    slideSelector,
    nextSelector,
    prevSelector,
    dotSelector
) {

    const carousel =
        document.querySelector(containerSelector);

    if (!carousel) return;

    const slides =
        carousel.querySelectorAll(slideSelector);

    const dots =
        carousel.querySelectorAll(dotSelector);

    const nextBtn =
        carousel.querySelector(nextSelector);

    const prevBtn =
        carousel.querySelector(prevSelector);

    if (!slides.length) return;

    let currentIndex = 0;
    let intervalId = null;

    const autoDelay = 15000;


    /*SHOW SLIDE*/

    function showSlide(index) {

        slides.forEach(slide => {
            slide.classList.remove("active");
        });

        dots.forEach(dot => {
            dot.classList.remove("active");
        });

        slides[index]?.classList.add("active");
        dots[index]?.classList.add("active");

        currentIndex = index;

    }


    /*NEXT SLIDE*/

    function nextSlide() {

        const nextIndex =
            (currentIndex + 1) % slides.length;

        showSlide(nextIndex);

    }


    /*PREVIOUS SLIDE*/

    function prevSlide() {

        const previousIndex =
            (currentIndex - 1 + slides.length) %
            slides.length;

        showSlide(previousIndex);

    }


    /*AUTO PLAY*/

    function startAuto() {

        stopAuto();

        intervalId = setInterval(
            nextSlide,
            autoDelay
        );

    }


    /*STOP AUTO PLAY*/

    function stopAuto() {

        if (intervalId !== null) {

            clearInterval(intervalId);

            intervalId = null;
        }

    }


    /*RESET AUTO PLAY*/

    function resetAuto() {

        startAuto();

    }


    /*NEXT BUTTON*/

    nextBtn?.addEventListener("click", () => {

        nextSlide();
        resetAuto();

    });


    /*PREVIOUS BUTTON*/

    prevBtn?.addEventListener("click", () => {

        prevSlide();
        resetAuto();

    });


    /*DOT NAVIGATION*/

    dots.forEach((dot, index) => {

        dot.addEventListener("click", () => {

            showSlide(index);
            resetAuto();

        });

    });


    /*PAUSE WHEN MOUSE IS OVER CAROUSEL*/

    carousel.addEventListener(
        "mouseenter",
        stopAuto
    );


    /*RESUME WHEN MOUSE LEAVES*/

    carousel.addEventListener(
        "mouseleave",
        startAuto
    );


    /*INITIALIZE*/

    showSlide(0);
    startAuto();

}


/*HEADER DROPDOWN*/

function initHeaderDropdown() {

    const toggle =
        document.querySelector(".games-toggle");

    const dropdown =
        document.querySelector(".dropdown-content");

    if (!toggle || !dropdown) return;


    /*TOGGLE DROPDOWN*/

    toggle.addEventListener("click", event => {

        event.stopPropagation();

        dropdown.classList.toggle("show");

    });


    /*CLOSE DROPDOWN WHEN CLICKING ELSEWHERE*/

    document.addEventListener("click", () => {

        dropdown.classList.remove("show");

    });

}


/*MOBILE MENU*/

function initMobileMenus() {

    const mobileToggle =
        document.querySelector(".mobile-menu-toggle");

    const nav =
        document.querySelector(".header-nav");

    if (!mobileToggle || !nav) return;


    /*OPEN / CLOSE MOBILE MENU*/

    mobileToggle.addEventListener("click", event => {

        event.stopPropagation();

        nav.classList.toggle("show");

    });


    /*CLOSE WHEN CLICKING ELSEWHERE*/

    document.addEventListener("click", () => {

        nav.classList.remove("show");

    });

}


/*DOM READY*/

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        /*LOAD SHARED COMPONENTS*/

        await loadComponent(
            "header.html",
            "header-placeholder"
        );

        await loadComponent(
            "footer.html",
            "footer-placeholder"
        );


        /*INITIALIZE GENERAL SYSTEMS*/

        initSectionTitleAnimation();

        initHeroParallax();


        /*MAIN CAROUSEL*/

        initCarousel(
            ".carousel",
            ".carousel-slide",
            ".next",
            ".prev",
            ".dot"
        );


        /*GAME CAROUSEL*/

        initCarousel(
            ".game-carousel",
            ".game-carousel-slide",
            ".game-next",
            ".game-prev",
            ".game-carousel .dot"
        );


        /*HEADER SYSTEMS*/

        initHeaderDropdown();

        initMobileMenus();

    }
);