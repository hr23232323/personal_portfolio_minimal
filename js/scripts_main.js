/* ============================================================
   SCRIPTS_MAIN.JS - INTERACTIVE FEATURES
   ============================================================
   Handles all interactive functionality for the portfolio:
   - Project carousel filtering (Data Science vs Software Development)
   - Social icon color changes on scroll
   - Experience section switching (legacy, currently unused)

   KEY VARIABLES:
   - btns: Project filter buttons (Data Science / Software Development)
   - landing_div: Hero section (used for scroll detection)
   - icon_list: Social media icons (color changes on scroll)

   RESPONSIVE:
   - Desktop animations (1s): -1022% translate
   - Mobile animations (0.75s): -333% translate due to column layout
============================================================ */

/* ============================================================
   PROJECT CAROUSEL - Data Science Projects
   Animates SD projects back into view when Data Science tab is clicked
   Desktop: 1s animation, staggered timing
   ============================================================ */
function ds_btn_click() {
    sd_projects = document.getElementsByClassName("sd-projects");
    ds_projects = document.getElementsByClassName("ds-projects");

    /* Animate SD projects out with stagger */
    for (var i = 0; i < sd_projects.length; i++) {
        (function (ind) {
            setTimeout(function () {
                sd_projects[ds_projects.length - ind - 1].style.transition = "transform 1s";
                sd_projects[ds_projects.length - ind - 1].style.transform = "translate(0)";
            }, 100 + (200 * ind));
        })(i);
    }

    /* Animate DS projects in with stagger (delayed start) */
    for (var j = 0; j < sd_projects.length; j++) {
        (function (ind2) {
            setTimeout(function () {
                ds_projects[ds_projects.length - ind2 - 1].style.transition = "transform 1s";
                ds_projects[ds_projects.length - ind2 - 1].style.transform = "translate(0)";
            }, 700 + (200 * ind2));
        })(j);
    }
}

/* Mobile version of Data Science projects animation (faster) */
function ds_btn_click_mob() {
    sd_projects = document.getElementsByClassName("sd-projects");
    ds_projects = document.getElementsByClassName("ds-projects");

    /* Animate SD projects out with stagger */
    for (var i = 0; i < sd_projects.length; i++) {
        (function (ind) {
            setTimeout(function () {
                sd_projects[sd_projects.length - ind - 1].style.transition = "transform 0.75s";
                sd_projects[sd_projects.length - ind - 1].style.transform = "translate(0)";
            }, 100 + (200 * ind));
        })(i);
    }

    /* Animate DS projects in with stagger (delayed start) */
    for (var j = 0; j < sd_projects.length; j++) {
        (function (ind2) {
            setTimeout(function () {
                ds_projects[ds_projects.length - ind2 - 1].style.transition = "transform 0.75s";
                ds_projects[ds_projects.length - ind2 - 1].style.transform = "translate(0)";
            }, 700 + (200 * ind2));
        })(j);
    }
}


/* ============================================================
   PROJECT CAROUSEL - Software Development Projects
   Animates DS projects out of view when SD tab is clicked
   Desktop: 1s animation with -1022% translate
   ============================================================ */
function sd_btn_click() {
    sd_projects = document.getElementsByClassName("sd-projects");
    ds_projects = document.getElementsByClassName("ds-projects");

    /* Animate DS projects out with stagger */
    for (var j = 0; j < ds_projects.length; j++) {
        (function (ind2) {
            setTimeout(function () {
                ds_projects[ind2].style.transition = "transform 1s";
                ds_projects[ind2].style.transform = "translate(-1022%)";
            }, 100 + (200 * ind2));
        })(j);
    }

    /* Animate SD projects in with stagger (delayed start) */
    for (var i = 0; i < sd_projects.length; i++) {
        (function (ind) {
            setTimeout(function () {
                sd_projects[ind].style.transition = "transform 1s";
                sd_projects[ind].style.transform = "translate(-1022%)";
            }, 700 + (200 * ind));
        })(i);
    }
}

/* Mobile version of Software Development projects animation (faster, smaller translate) */
function sd_btn_click_mob() {
    sd_projects = document.getElementsByClassName("sd-projects");
    ds_projects = document.getElementsByClassName("ds-projects");

    /* Animate DS projects out with stagger */
    for (var j = 0; j < ds_projects.length; j++) {
        (function (ind2) {
            setTimeout(function () {
                ds_projects[ind2].style.transition = "transform 0.75s";
                ds_projects[ind2].style.transform = "translate(-333%)";
            }, 100 + (200 * ind2));
        })(j);
    }

    /* Animate SD projects in with stagger (delayed start) */
    for (var i = 0; i < sd_projects.length; i++) {
        (function (ind) {
            setTimeout(function () {
                sd_projects[ind].style.transition = "transform 0.75s";
                sd_projects[ind].style.transform = "translate(-333%)";
            }, 700 + (200 * ind));
        })(i);
    }
}

/* ============================================================
   PROJECT CAROUSEL - Button Controls
   Handles clicks on "Data Science" and "Software Development" tabs
   ============================================================ */

/* Attach click listeners to both project filter buttons */
var btns = document.getElementsByClassName("project-options")
for (var btn of btns) {
    btn.addEventListener("click", function (event) {
        project_switch(btns, event.target);
    });
}

/**
 * Switches project carousel based on clicked button
 * @param {HTMLCollection} btns - All project option buttons
 * @param {HTMLElement} clicked_btn - The button that was clicked (ds or sd)
 */
function project_switch(btns, clicked_btn) {
    var w = window.innerWidth;
    var name = clicked_btn.classList[0];       /* "ds" or "sd" */
    var display = clicked_btn.classList[2];    /* "active" or "inactive" */

    /* Only proceed if button is not already active */
    if (display == "active") {
        return; /* Already on this tab */
    }

    /* Call appropriate animation based on screen size */
    if (w > 800) {
        /* Desktop animations */
        if (name == "sd") {
            sd_btn_click();
        } else {
            ds_btn_click();
        }
    } else {
        /* Mobile animations */
        if (name == "sd") {
            sd_btn_click_mob();
        } else {
            ds_btn_click_mob();
        }
    }

    /* Toggle active/inactive state on both buttons */
    switch_active(btns)
}

/**
 * Toggles active and inactive classes on all project buttons
 * @param {HTMLCollection} btns - All project option buttons
 */
function switch_active(btns) {
    for (var j = 0; j < btns.length; j++) {
        btns[j].classList.toggle("active");
        btns[j].classList.toggle("inactive");
    }
}


/* ============================================================
   EXPERIENCE SWITCHING (Legacy - Currently Unused)
   Originally used to show/hide experience items based on clicked links.
   Now experience items are displayed inline instead.
   Keeping code for potential future use.
   ============================================================ */

/**
 * Routes experience link clicks to text changing function
 * @param {string} exp_link_id - ID of clicked experience link
 */
function change_exp_text(exp_link_id) {
    switch (exp_link_id) {
        case 'exp-1-link':
            change_text("exp-1", exp_link_id);
            break;
        case 'exp-2-link':
            change_text("exp-2", exp_link_id);
            break;
        case 'exp-3-link':
            change_text("exp-3", exp_link_id);
            break;
    }
}

/**
 * Shows/hides experience text blocks and updates active state
 * @param {string} div_id - ID of experience block to show
 * @param {string} link_id - ID of link that was clicked
 */
function change_text(div_id, link_id) {
    var exp_divs = document.getElementsByClassName("exp-text");
    for (var i = 0; i < exp_divs.length; i++) {
        if (exp_divs[i].id == div_id) {
            exp_divs[i].classList.remove("inactive");
        } else {
            exp_divs[i].classList.add("inactive");
        }
    }

    var exp_links = document.getElementsByClassName("exp-link");
    for (i = 0; i < exp_links.length; i++) {
        if (exp_links[i].id == link_id) {
            exp_links[i].classList.add("active");
        } else {
            exp_links[i].classList.remove("active");
        }
    }
}

/* Attach click listeners to experience links (if elements exist) */
var exp_links = document.getElementsByClassName("exp-link");
for (var link of exp_links) {
    link.addEventListener("click", function (event) {
        change_exp_text(event.target.id);
    });
}

/* ============================================================
   SCROLL EFFECT - Dynamic icon color
   Changes social icon colors based on scroll position
   - Over hero section: white text (--bg-primary)
   - Over main content: dark text (--text-primary)
   ============================================================ */

var landing_div = document.getElementsByClassName("landing-page")[0];
var icon_list = document.getElementsByClassName("fa-icon");

/**
 * Updates social icon colors on scroll
 * White icons over hero section, dark icons over main content
 */
document.addEventListener("scroll", function () {
    var landing_btm = landing_div.getBoundingClientRect().bottom;

    for (var icon of icon_list) {
        var icon_btm = icon.getBoundingClientRect().bottom;

        /* If hero section is above icons, use dark text color */
        if (landing_btm < icon_btm) {
            icon.style.color = "var(--text-primary)";
        } else {
            /* If icons are still over hero, use white text */
            icon.style.color = "var(--bg-primary)";
        }
    }
});
