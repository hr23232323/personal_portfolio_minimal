function ds_btn_click() {
    sd_projects = document.getElementsByClassName("sd-projects");
    ds_projects = document.getElementsByClassName("ds-projects");
    var i;
    for (i = 0; i < sd_projects.length; i++) {
        (function (ind) {
            setTimeout(function () {
                sd_projects[ds_projects.length - ind - 1].style.transition = "transform 1s";
                sd_projects[ds_projects.length - ind - 1].style.transform = "translate(0)";
            }, 100 + (200 * ind));
        })(i);
    }


    var j;
    for (j = 0; j < sd_projects.length; j++) {
        (function (ind2) {
            setTimeout(function () {

                ds_projects[ds_projects.length - ind2 - 1].style.transition = "transform 1s";
                ds_projects[ds_projects.length - ind2 - 1].style.transform = "translate(0)";


            }, 700 + (200 * ind2));
        })(j);
    }
}

function ds_btn_click_mob() {
    sd_projects = document.getElementsByClassName("sd-projects");
    ds_projects = document.getElementsByClassName("ds-projects");
    var i;
    for (i = 0; i < sd_projects.length; i++) {
        (function (ind) {
            setTimeout(function () {
                sd_projects[sd_projects.length - ind - 1].style.transition = "transform 0.75s";
                sd_projects[sd_projects.length - ind - 1].style.transform = "translate(0)";
            }, 100 + (200 * ind));
        })(i);
    }


    var j;
    for (j = 0; j < sd_projects.length; j++) {
        (function (ind2) {
            setTimeout(function () {

                ds_projects[ds_projects.length - ind2 - 1].style.transition = "transform 0.75s";
                ds_projects[ds_projects.length - ind2 - 1].style.transform = "translate(0)";


            }, 700 + (200 * ind2));
        })(j);
    }
}


function sd_btn_click() {
    sd_projects = document.getElementsByClassName("sd-projects");
    ds_projects = document.getElementsByClassName("ds-projects");


    var j;
    for (j = 0; j < ds_projects.length; j++) {
        (function (ind2) {
            setTimeout(function () {
                ds_projects[ind2].style.transition = "transform 1s";
                ds_projects[ind2].style.transform = "translate(-1022%)";

            }, 100 + (200 * ind2));
        })(j);
    }

    var i;
    for (i = 0; i < sd_projects.length; i++) {
        (function (ind) {
            setTimeout(function () {
                sd_projects[ind].style.transition = "transform 1s";
                sd_projects[ind].style.transform = "translate(-1022%)";
            }, 700 + (200 * ind));
        })(i);
    }
}

function sd_btn_click_mob() {
    sd_projects = document.getElementsByClassName("sd-projects");
    ds_projects = document.getElementsByClassName("ds-projects");


    var j;
    for (j = 0; j < ds_projects.length; j++) {
        (function (ind2) {
            setTimeout(function () {
                ds_projects[ind2].style.transition = "transform 0.75s";
                ds_projects[ind2].style.transform = "translate(-333%)";

            }, 100 + (200 * ind2));
        })(j);
    }

    var i;
    for (i = 0; i < sd_projects.length; i++) {
        (function (ind) {
            setTimeout(function () {
                sd_projects[ind].style.transition = "transform 0.75s";
                sd_projects[ind].style.transform = "translate(-333%)";
            }, 700 + (200 * ind));
        })(i);
    }
}

/*function project_switch() {
    var w = window.innerWidth;
    var spans = document.getElementsByClassName("project-options");
    console.log(spans)

    var i;
    for (i = 0; i < spans.length; i++) {
        var name = spans[i].classList[0];
        var display = window.getComputedStyle(spans[i]).getPropertyValue('display');
        console.log(name)
        console.log(display)

        //console.log(name, display);
        if (w > 800) {
            if (name == "sd" && display == "block") {
                sd_btn_click();
            } else if (name == "ds" && display == "block") {
                ds_btn_click();
            }

        } else {
            if (name == "sd" && display == "block") {
                sd_btn_click_mob();
            } else if (name == "ds" && display == "block") {
                ds_btn_click_mob();
            }
        }
    }
}*/

/*function project_switch() {
    var w = window.innerWidth;
    var btns = document.getElementsByClassName("project-options");

    var i;
    console.log(this)
    for (i = 0; i < btns.length; i++) {
        //btns[i].classList.toggle("active");
        var name = btns[i].classList[0];
        var display = btns[i].classList[2];
        //var display = window.getComputedStyle(btns[i]).getPropertyValue('display');
        console.log(name)
        console.log(display)

        //console.log(name, display);
        if (w > 800) {
            if (name == "sd" && display == "active") {
                ds_btn_click();
            } else if (name == "ds" && display == "active") {
                sd_btn_click();
            }

        } else {
            if (name == "sd" && display == "active") {
                sd_btn_click_mob();
            } else if (name == "ds" && display == "active") {
                ds_btn_click_mob();
            }
        }
    }
    switch_active(btns)
}*/



var btns = document.getElementsByClassName("project-options")
for (var btn of btns) {
    btn.addEventListener("click", function (event) {
        project_switch(btns, event.target);
    });
}

function project_switch(btns, clicked_btn) {
    var w = window.innerWidth;
    var name = clicked_btn.classList[0];
    var display = clicked_btn.classList[2];
    if (display == "active") {
        // do nothing 
    } else {
        if (w > 800) {
            if (name == "sd") {
                sd_btn_click();
            } else {
                ds_btn_click();
            }

        } else {
            if (name == "sd") {
                sd_btn_click_mob();
            } else {
                ds_btn_click_mob();
            }

        }
        switch_active(btns)
    }
}

function switch_active(btns) {
    for (j = 0; j < btns.length; j++) {
        btns[j].classList.toggle("active");
        btns[j].classList.toggle("inactive");
    }
}


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

function change_text(div_id, link_id) {
    var exp_divs = document.getElementsByClassName("exp-text");
    var i;
    for (i = 0; i < exp_divs.length; i++) {
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



var exp_links = document.getElementsByClassName("exp-link");
for (var link of exp_links) {
    link.addEventListener("click", function (event) {
        change_exp_text(event.target.id);
    });
}

var flkty = new Flickity('.main-gallery', {
    // options
    cellAlign: 'left',
    contain: true
});

var landing_div = document.getElementsByClassName("landing-page")[0]
var icon_list = document.getElementsByClassName("fa-icon")

document.addEventListener("scroll", function () {
    var landing_btm = landing_div.getBoundingClientRect().bottom
    for (var icon of icon_list) {
        icon_btm = icon.getBoundingClientRect().bottom
        if (landing_btm < icon_btm) {
            icon.style.color = "var(--text-primary)"
        } else {
            icon.style.color = "var(--bg-primary)"
        }
    }
})
