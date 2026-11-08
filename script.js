document.addEventListener("DOMContentLoaded", function () {
    /* =========================
       Mobile Menu
    ========================= */

    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", function () {
            const isOpen = navMenu.classList.toggle("open");

            menuToggle.setAttribute("aria-expanded", isOpen);
            menuToggle.setAttribute(
                "aria-label",
                isOpen
                    ? "Close navigation menu"
                    : "Open navigation menu"
            );
        });

        const navLinks = navMenu.querySelectorAll("a");

        navLinks.forEach(function (link) {
            link.addEventListener("click", function () {
                navMenu.classList.remove("open");

                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute(
                    "aria-label",
                    "Open navigation menu"
                );
            });
        });
    }


    /* =========================
       Dark Mode
    ========================= */

    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = document.getElementById("themeIcon");
    const root = document.documentElement;

    if (themeToggle) {
        const savedTheme = localStorage.getItem("theme");

        if (savedTheme === "dark") {
            root.setAttribute("data-theme", "dark");
            if (themeIcon) {
                themeIcon.textContent = "\u2600";
            }
        }

        themeToggle.addEventListener("click", function () {
            const isDark = root.getAttribute("data-theme") === "dark";

            if (isDark) {
                root.removeAttribute("data-theme");
                localStorage.setItem("theme", "light");
                if (themeIcon) {
                    themeIcon.textContent = "\u263D";
                }
            } else {
                root.setAttribute("data-theme", "dark");
                localStorage.setItem("theme", "dark");
                if (themeIcon) {
                    themeIcon.textContent = "\u2600";
                }
            }
        });
    }


    /* =========================
       Mobile Bottom Navigation
    ========================= */

    const bottomNav = document.querySelector(".bottom-nav");
    const bottomNavLinks = document.querySelectorAll(".bottom-nav-link");

    if (!bottomNav || bottomNavLinks.length === 0) {
        return;
    }

    function moveFluidIndicator(link) {
        const navRect = bottomNav.getBoundingClientRect();
        const linkRect = link.getBoundingClientRect();

        const linkCenter =
            linkRect.left -
            navRect.left +
            linkRect.width / 2;

        const indicatorCenter = 6 + 22;
        const movement = linkCenter - indicatorCenter;

        bottomNav.style.setProperty(
            "--fluid-transform",
            `translateX(${movement}px)`
        );
    }

    function setActiveLink(link) {
        bottomNavLinks.forEach(function (navLink) {
            navLink.classList.remove("active");
            navLink.removeAttribute("aria-current");
        });

        link.classList.add("active");
        link.setAttribute("aria-current", "page");

        moveFluidIndicator(link);
    }

    bottomNavLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            setActiveLink(link);
        });
    });

    const currentActiveLink =
        document.querySelector(".bottom-nav-link.active") ||
        bottomNavLinks[0];

    setActiveLink(currentActiveLink);

    window.addEventListener("resize", function () {
        const activeLink =
            document.querySelector(".bottom-nav-link.active") ||
            bottomNavLinks[0];

        moveFluidIndicator(activeLink);
    });
});
