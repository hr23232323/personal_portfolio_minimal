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

function project_switch() {
    var spans = document.getElementsByClassName("project-options");
    var i;
    for (i = 0; i < spans.length; i++) {
        var name = spans[i].classList[0];
        var display = window.getComputedStyle(spans[i]).getPropertyValue('display');
        //console.log(name, display);
        if (name == "sd" && display == "block") {
            console.log("SHOW SD");
            sd_btn_click();
        } else if (name == "ds" && display == "block") {
            console.log("SHOW DS");
            ds_btn_click();
        }

    }
}
