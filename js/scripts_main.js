function ds_btn_click() {
    sd_projects = document.getElementsByClassName("sd-projects");
    ds_projects = document.getElementsByClassName("ds-projects");
    var i;
    for (i = 0; i < sd_projects.length; i++) {
        //console.log(sd_projects[i]);
        (function (ind) {
            setTimeout(function () {
                sd_projects[ind].style.transition = "transform 1s";
                sd_projects[ind].style.transform = "translate(-1022%)";
            }, 100 + (200 * ind));
        })(i);
    }


    var j;
    for (j = 0; j < sd_projects.length; j++) {
        //console.log(sd_projects[i]);
        (function (ind2) {
            setTimeout(function () {

                ds_projects[ind2].style.transition = "transform 1s";
                ds_projects[ind2].style.transform = "translate(-1022%)";


            }, 700 + (200 * ind2));
        })(j);
    }
}

function ds_btn_click_mob() {
    sd_projects = document.getElementsByClassName("sd-projects");
    ds_projects = document.getElementsByClassName("ds-projects");
    var i;
    for (i = 0; i < sd_projects.length; i++) {
        //console.log(sd_projects[i]);
        (function (ind) {
            setTimeout(function () {
                sd_projects[ind].style.transition = "transform 0.75s";
                sd_projects[ind].style.transform = "translate(-333%)";
            }, 100 + (200 * ind));
        })(i);
    }


    var j;
    for (j = 0; j < sd_projects.length; j++) {
        //console.log(sd_projects[i]);
        (function (ind2) {
            setTimeout(function () {

                ds_projects[ind2].style.transition = "transform 0.75s";
                ds_projects[ind2].style.transform = "translate(-333%)";


            }, 700 + (200 * ind2));
        })(j);
    }
}


function sd_btn_click() {
    sd_projects = document.getElementsByClassName("sd-projects");
    ds_projects = document.getElementsByClassName("ds-projects");


    var j;
    for (j = 0; j < sd_projects.length; j++) {
        //console.log(sd_projects[i]);
        (function (ind2) {
            setTimeout(function () {
                ds_projects[ds_projects.length - ind2 - 1].style.transition = "transform 1s";
                ds_projects[ds_projects.length - ind2 - 1].style.transform = "translate(0)";


            }, 100 + (200 * ind2));
        })(j);
    }

    var i;
    for (i = 0; i < sd_projects.length; i++) {
        //console.log(sd_projects[i]);
        (function (ind) {
            setTimeout(function () {
                sd_projects[sd_projects.length - ind - 1].style.transition = "transform 1s";
                sd_projects[sd_projects.length - ind - 1].style.transform = "translate(0)";
            }, 700 + (200 * ind));
        })(i);
    }
}

function sd_btn_click_mob() {
    sd_projects = document.getElementsByClassName("sd-projects");
    ds_projects = document.getElementsByClassName("ds-projects");


    var j;
    for (j = 0; j < sd_projects.length; j++) {
        //console.log(sd_projects[i]);
        (function (ind2) {
            setTimeout(function () {
                ds_projects[ds_projects.length - ind2 - 1].style.transition = "transform 0.75s";
                ds_projects[ds_projects.length - ind2 - 1].style.transform = "translate(0)";


            }, 100 + (200 * ind2));
        })(j);
    }

    var i;
    for (i = 0; i < sd_projects.length; i++) {
        //console.log(sd_projects[i]);
        (function (ind) {
            setTimeout(function () {
                sd_projects[sd_projects.length - ind - 1].style.transition = "transform 0.75s";
                sd_projects[sd_projects.length - ind - 1].style.transform = "translate(0)";
            }, 700 + (200 * ind));
        })(i);
    }
}

function project_switch() {
    var w = window.innerWidth;
    var spans = document.getElementsByClassName("project-options");

    var i;
    for (i = 0; i < spans.length; i++) {
        var name = spans[i].classList[0];
        var display = window.getComputedStyle(spans[i]).getPropertyValue('display');
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
