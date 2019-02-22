var min_timer = 1705;
var max_timer = 1755;
var semestre = 4;

var valgfag = 0,
    kreative_fag = 0,
    obligatoriske_fag = 0,
    sso = true,
    ep = false,
    ba_fag = false,
    opgave = 0,
    totalTimer = 0,
    autoudfyldt = false,
    udvidede_fag = false,
    udvidet_fagpakke = false,
    merit = false,
    d = new Date(),
    valgfagsstimer = 0,
    tipTimer,
    mouseAction = 3000,
    startaar = 2018,
    startsemester = "Forår",
    saveData;


$(document).ready(function() {

    $(document).on("click touchend mousemove", function() {
        console.log("Clear timer");
        window.clearTimeout(tipTimer);
        //tipTimer = setTimeout(function() { help(); }, 30000);
    })


    $(".saveConsole").hide();
    //$(".instructionText").html("Her kan du få inspiration til at planlægge dit HF forløb. <br/>Objektet er et værktøj som kan hjælpe dig til at få overblik over en fuld HF, men KVUC kan ikke garantere, at den plan du laver her kan lade sig gøre i virkeligheden. <br><span class='instr_top'><span class=' glyphicon glyphicon-user'></span> <span>Placer 1-2 udvidede fagpakke fag og valgfag så du kommer op på mindst 1905 timer</span>");
    $('.instr_container').html(instruction_noLines("Her kan du få inspiration til at planlægge dit HF forløb. <br/>Objektet er et værktøj, som kan hjælpe dig til at få overblik over en fuld HF. Planen skal gennemgås og godkendes af en studievejleder  <span class='btn btn-video btn-info'>Instruktion <span class='glyphicon glyphicon-play'> </span></span><br><span class='instr_top'><span class=' glyphicon glyphicon-user'></span> Find de fag du ønsker, og træk dem fra faglisten til semesterkasserne.")); // Tilføjet af THAN d. 02/01-2018.
    $('.instr_container').append("");
    init();



    console.log("jsonData");
    console.log(jsonData);
    /*=======================================
    =            Event listening            =
    =======================================*/

    $(".btn-var").click(function() {
        nav_click($(this).html(), $(this));
    })

    $(".btn_exp").click(function() {
        clicked_btn_exp($(this));
    })

    $(".su_timer").click(function() {
        clicked_SU($(this));
    });

    $(".feedback_container").click(function() {
        clicked_feedback($(this));
    });
    $(".feedback_container").mouseover(function() {
        clicked_feedback($(this));
    });

    $(".feedback_container").mouseout(function() {
        $(".microhint").remove();
    });

    $(".download-btn").click(function() {
        download_word_file();
    });

    $(".send_email").click(function() {
        send_email();

    });

    $(".btn-var").mouseover(function() {
        var indeks = $(this).index(".btn-var");
        microhint($(this), jsonData.knaptekster[indeks], true);
    });

    $(".btn-var").mouseout(function() {
        $(".microhint").remove();
    });

    $(".vejl_link").click(function() {
        window.open("https://kvuc.dk/vejledning/hf-vejledningen/");
    });
    $(".tilmeld_link").click(function() {

        var tilmeld_fag = "https://tilmeld.kvuc.dk/?SelectedEducationType=Gym&SelectedCourseLevel=0-C&SelectedCourseLevel=B-A&SelectedSubjects=%5B";

        for (var i = 0; i < saveData[2].length; i++) {
            var fag = $("#" + saveData[2][i]).text(); //.split(" ", 1);
            fag = fag.substring(0, fag.length - 4);
            if (fag == "Kulturfagsk") {
                tilmeld_fag += "%22Gym%23%23%23historie%22%2C";
                tilmeld_fag += "%22Gym%23%23%23religion%22%2C";



            } else if (fag == "Naturfagsk") {

            } else {
                if (i !== saveData[2].length - 1) {
                    //alert("case1");
                    tilmeld_fag += "%22Gym%23%23%23" + fag + "%22%2C";
                } else {
                    //alert("case2");
                    tilmeld_fag += "%22Gym%23%23%23" + fag + "%22%5D";
                    //alert(fag)
                }
            }
        }
        //tilmeld_fag += "%22%5D";
        //alert(tilmeld_fag);

        //alert(tilmeld_fag);

        //alert(tilmeld_fag);

        alert(fag + "," + tilmeld_fag);
        window.open(tilmeld_fag);

        //https://tilmeld.kvuc.dk/?SelectedEducationType=Gym&SelectedSubjects=%5B%22Gym%23%23%23Engelsk%22%2C%22Gym%23%23%23Geografi%22%5D



        //3fag https://tilmeld.kvuc.dk/?SelectedEducationType=Gym&SelectedSubjects=%5B%22Gym%23%23%23Engelsk%22%2C%22Gym%23%23%23Filosofi%22%2C%22Gym%23%23%23Geografi%22%5D

    });

    $("body").click(function() {
        $(".overlay").fadeOut();
    });


    $(".btn-video").click(function() {

        UserMsgBox_xclick('body', '<div class="embed-responsive embed-responsive-16by9"><iframe class="embed-responsive-item" src="https://player.vimeo.com/video/306797454" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>');



    })
    addListeners();
    $(".new_window_link").remove();

    /*=====  End of Event listening  ======*/




    /*==================================
    =            Droppable afdeling            =
    ==================================*/



    $(".semester_content, .dragzone").droppable({

        accept: ".fag_btn",
        tolerance: "touch",
        drop: function(e, ui) {

            var microhint_streng = "<h4 class='micro_H4'>OBS</h4>";

            if ($(this).hasClass("semester_content")) {


                var this_id = ui.draggable.attr('class').split(" ")[0];
                var id_length = $("." + this_id).length;


                var indeks = $(this).index(".semester_content");
                var drop_title = $(this).find(".semester_title").html();

                if (check_fagprogression(this_id, indeks)) {
                    microhint_streng += check_fagprogression(this_id, indeks);
                }
                /*----------  Hvis SU er for højt i kasserne  ----------*/

                var this_sutimer = parseInt($(this).find(".su_display").html());

                /*----------  Hvi der er for mange timer allerede   ----------*/




                /*if (this_sutimer > 50 && $(this).index(".semester_content") != 0) {
                    console.log("FOR MANGE SU TIMER kaldt")
                    //microhint($(this), "OBS! Du har allerede " + this_sutimer + " SU timer i dette semester. Placer faget i et andet semester.", true);

                    microhint_streng += "Du har allerede " + this_sutimer + " SU timer i dette semester. Placer faget i et andet semester.<br/><br/>";

                    setTimeout(function() {
                        ui.draggable.animate({
                            left: 0,
                            top: 0
                        }, 500, function() {
                            ui.draggable.draggable({
                                revert: "invalid",
                                start: function() {
                                    $(".microhint").remove();
                                },
                                stack: "span"
                            });
                        });
                    }, 200);
                    sortDivs();
} */
                /*----------  Check om det er en SSO der bliver placeret uregelementeret  ----------*/




                if (ui.draggable.attr("id") == "fag_9" && (drop_title[0] == "E" || indeks < (semestre - 1))) {



                    setTimeout(function() {

                        ui.draggable.animate({
                            left: 0,
                            top: 0
                        }, 500, function() {
                            ui.draggable.draggable({
                                revert: "invalid",
                                start: function() {
                                    $(".microhint").remove();
                                },
                                stack: "span"
                            });
                        });

                        sortDivs();
                        //ui.draggable.appendTo(".dragzone");

                    }, 200);

                    microhint($("#fag_9"), "Du skal placere  SSO i det sidste forårssemester", true);

                    microhint_streng += "Du skal placere  SSO i det sidste forårssemester</li>"

                    sortDivs();



                    /*----------  Accept fag_btn:   ----------*/


                } else {
                    ui.draggable.addClass("dropped")
                    $(this).append(ui.draggable);
                    $(this).find(".draggable").css({

                        top: 0,
                        left: 0,
                        margin: "4px",
                    });

                    /*----------  Check for helårsfag:  ----------*/


                    /* Warning ved for mange fag: */




                    if (id_length < 2) {

                        if (ui.draggable.hasClass("helaar")) {

                            console.log("FG BTN: " + ui.draggable.index(".fag_btn"));

                            if (ui.draggable.html() == "Dansk 0-A") {

                                microhint_streng += ui.draggable.html() + " kan tages både halv og helårligt.<br/> Vi anbefaler, at du læser " + ui.draggable.html() + " over to semestre. <br/>Træk kopien af " + ui.draggable.html() + " knappen fra bunden og til et det efterfølgende semester.<br/><br/>";

                                //microhint(ui.draggable, ui.draggable.html() + " kan tages både halv og helårligt.<br/> Vi anbefaler, at du læser " + ui.draggable.html() + " over to semestre. <br/>Træk kopien af " + ui.draggable.html() + " knappen fra bunden og til et det efterfølgende semester.", true)
                            } else {
                                microhint_streng += ui.draggable.html() + " kan tages både halv og helårligt.<br/> Træk kopien af " + ui.draggable.html() + " knappen fra bunden og til et det efterfølgende semester, hvis du vil tage faget over to semestre.<br/><br/>";
                                //microhint(ui.draggable, ui.draggable.html() + " kan tages både halv og helårligt.<br/> Træk kopien af " + ui.draggable.html() + " knappen fra bunden og til et det efterfølgende semester, hvis du vil tage faget over to semestre.", true)
                            }


                            //ui.draggable.append("<div class='helaarlabel'>Helårligt</div>")


                            var klon = ui.draggable.clone().prependTo(".dragzone").addClass("clone"); //insertBefore("#fag_1");//prependTo(".dragzone");
                            klon.fadeOut(0).fadeIn(1000);
                            $(".dragzone").append(klon);
                            sortDivs();
                            $(".draggable").draggable({
                                revert: "invalid",
                                stack: "span",
                                start: function() {
                                    $(".microhint").remove();
                                }
                            });
                        }

                    } else if (id_length > 1 && ui.draggable.hasClass("helaar")) {

                        ui.draggable.addClass("helaarmode");


                        if ($("." + ui.draggable.attr("id")).eq(0).hasClass("dropped") && $("." + ui.draggable.attr("id")).eq(1).hasClass("dropped")) {
                            //alert("Der er tale om en dobbelt ost");
                            //alert("drop_container: " + indeks);
                            var container_indeks_0 = $("." + ui.draggable.attr("id")).eq(0).parent().parent().index();
                            var container_indeks_1 = $("." + ui.draggable.attr("id")).eq(1).parent().parent().index();

                            if ((container_indeks_1 - container_indeks_0) == 0) {
                                //microhint(ui.draggable, "Du skal placere faget i to forskellige semestre for at tage dem halvårligt", true);
                                microhint_streng += "Du skal placere " + ui.draggable.html() + " i to forskellige semestre for at tage faget helårligt<br/><br/>";

                                ui.draggable.animate({
                                    opacity: 0,

                                }, 1500, function() {

                                    $(".dragzone").append(ui.draggable);
                                    sortDivs();
                                    udregn_timer();
                                    ui.draggable.animate({
                                        opacity: 1,

                                    }, 500);
                                });
                            } else if ((container_indeks_1 - container_indeks_0) > 1) {
                                //microhint(ui.draggable, "Du skal placere faget umiddelbart før eller efter det semester, hvor du har placeret " + ui.draggable.html() + " Der må ikke være et tomt semester imellem.", true);
                                microhint_streng += "Du skal placere " + ui.draggable.html() + " umiddelbart før eller efter det semester, hvor du har placeret faget i forvejen. <br/><br/>";


                                ui.draggable.animate({
                                    opacity: 0,

                                }, 1500, function() {

                                    $(".dragzone").append(ui.draggable);
                                    sortDivs();
                                    udregn_timer();
                                    ui.draggable.animate({
                                        opacity: 1,

                                    }, 500);
                                });

                            }
                            //alert(indekseret);
                        }

                    }





                    /*----------  Check kreative fag  ----------*/

                    if (ui.draggable.hasClass("flexible")) {
                        if (kreative_fag < 2) {
                            //microhint(ui.draggable, "Du har placeret et kreativt fag. Du skal have et kreativt fag som obligatorisk. Derudover skal du vælge 3-5 valgfag.", true)
                            microhint_streng += "Du har placeret et kreativt fag. Du skal have et kreativt fag som obligatorisk. Derudover skal du vælge 3-5 valgfag.<br/><br/>";
                        }
                    }

                    /*----------  Check kreative fag  ----------*/
                    if (ui.draggable.hasClass("valgfag_andet")) {

                        //microhint(ui.draggable, "Du har placeret andet fag .")
                        var klon = ui.draggable.clone().prependTo(".dragzone");
                        klon.addClass("clone_valgfag");

                    }

                    /*------------- HVIS MERE END 3 FAG ALLEREDE: --------------*/

                    /*if ($(this).find(".fag_btn").length > 3 + $(this).find(".opgave").length) {

                        //microhint($(this), "Hvis du vil have mere end 3 fag pr semester, så skal du tage et eller flere fag på HF Online. Du kan ikke være sikker på at behovet kan opfyldes. <br/>Tal med vejledningen!", true)
                        microhint_streng += "Hvis du vil have mere end 3 fag pr semester, skal du tage et eller flere fag på HF Online. Du kan ikke være sikker på at behovet kan opfyldes.<br/><br/>";
                    }*/

                    /*------------- HVIS MERE END 3 FAG ALLEREDCE: --------------*/

                }


                /*----------  Dropped in Draggable /   ----------*/

            } else {
                ui.draggable.removeClass("dropped");
                ui.draggable.css("left", 0).css("top", 0);
                /*var place = ui.draggable.attr("id");
                place = place.substring(4, place.length);
                place = Number(place);
                console.log("type: " + typeof(place));

                var placering = $("#fag_" + (place + 1));

                // alert(placering);
                //placering.css("background-color", "red")


                ui.draggable.insertBefore(placering);*/
                $(this).append(ui.draggable);
                setTimeout(function() { sortDivs(); }, 5);

            }



            /*Udregne hvor mange kreative fag der er og fjern obl fra knapper hvis mere end en er placeret */

            var flexible_dropped = 0;


            $(".flexible").each(function(index) {
                if ($(this).hasClass("dropped")) {

                    flexible_dropped++
                }
            });

            /*if (flexible_dropped > 0) {
                $(".flexible").removeClass("obligatorisk btn-primary")
                $(".flexible").addClass("valgfag btn-success");

            } else {
                $(".flexible").addClass("obligatorisk btn-primary")
                $(".flexible").removeClass("valgfag btn-success");
            }*/

            var last_letter = ui.draggable.html();
            last_letter = last_letter[last_letter.length - 1]

            udregn_timer();

            console.log("hej");

            var this_sutimer = parseInt($(this).find(".su_display").html());

                if (this_sutimer > 30 && $(this).index(".semester_content") != 0) {
                    console.log("FOR MANGE SU TIMER kaldt")
                    //microhint($(this), "Du har nu " + this_sutimer + " SU timer i dette semester. Vi anbefaler max 30 timer", true);

                    microhint_streng += "Du har nu " + $(this).find(".su_display").html() + " SU timer i dette semester. Vi anbefaler max 30 timer<br/><br/>"

                }

                if (microhint_streng.length > 30) {

                    microhint_streng = microhint_streng.substring(0, microhint_streng.length - 5);
                    microhint($(this), microhint_streng);
                }

            



            set_height_containers();
            sortDivs();

        }

    });

    //$(".dragzone").droppable({});

    $(".draggable").draggable({
        revert: "invalid",
        start: function() {
            $(".microhint").remove();
        },
        stack: "span"
    });


    $(".btn_exp").eq(2).hide();
    $(".udvidet_fag_status, .udvidet_fag_ok_glyph, .ba").hide();


    $("#fag_9, #fag_10").css("background-color", "rgb(135, 150, 220");


    loadData();


    //clicked_feedback($(".feedback_container"));


    // Er objektet iframet?








});



/*=====  End of Droppable   ======*/


function init() {

    /* lav knapperne */



    for (var i = jsonData.knapper.length - 1; i >= 0; i--) {
        $(".knap_container").prepend("<button class='btn btn-sm btn-info btn-var'>" + jsonData.knapper[i].tekst + "</button>");
    }

    /* lav containere */

    $("#semester_app").append("<div class ='semester_container col-lg-3 col-md-4 col-sm-4 col-xs-6'><div class='semester_content '><div class='semester_title'>Tidligere gennemførte fag (Merit)</div><div class='su_timer'> SU timer: <span class='su_display'>0</span> </div>  </div></div>");

    for (var i = 0; i < 20; i++) {

        if (i % 2) {

            startsemester = "Forår";

        } else {
            startsemester = "Efterår";
            startaar++;

        }

        $("#semester_app").append("<div class ='semester_container col-lg-3 col-md-4 col-sm-4 col-xs-6'><div class='semester_content '><div class='semester_title'>" + startsemester + " " + startaar + "</div> <div class='su_timer'> SU timer: <span class='su_display'>0</span> </div> </div></div>");


        if (i > semestre) {
            $(".semester_container").eq(i).hide();
        }
        $(".semester_container").eq(20).hide();
    }


    /*lav fag_draggables */

    for (var i = 0; i < jsonData.fag.length; i++) {
        //console.log("I: " + i);
        $(".dragzone").append("<span id ='fag_" + i + "' timestamp ='" + i + "' class='fag_" + i + " btn btn-xs draggable fag_btn'>" + jsonData.fag[i].text + "</span"); //(<span class='num'>" + jsonData.fag[i].udd_timer + "/" + jsonData.fag[i].su_timer + "</span>)</span>");
        if (jsonData.fag[i].fagtype == "obligatorisk") {
            $(".fag_btn").eq(i).addClass("obligatorisk btn-primary");
        } else if (jsonData.fag[i].fagtype == "kreativt valgfag") {
            $(".fag_btn").eq(i).addClass("btn-success flexible valgfag");
        } else if (jsonData.fag[i].fagtype == "opgave") {
            $(".fag_btn").eq(i).addClass("btn-primary opgave");
        } else if (jsonData.fag[i].fagtype == "valgfag") {
            $(".fag_btn").eq(i).addClass("valgfag btn-success");
        } else if (jsonData.fag[i].fagtype == "udvidet") {
            $(".fag_btn").eq(i).addClass("udvidet btn-warning");
        } else if (jsonData.fag[i].fagtype == "udvidet ba") {
            $(".fag_btn").eq(i).addClass("udvidet ba btn-warning");
        } else if (jsonData.fag[i].fagtype == "udvidet valgfag") {
            $(".fag_btn").eq(i).addClass("udvidet valgfag btn-success");
        } else if (jsonData.fag[i].fagtype == "kreativt udvidet valgfag") {
            $(".fag_btn").eq(i).addClass("udvidet valgfag btn-success");
        } else if (jsonData.fag[i].fagtype == "andet valgfag") {
            $(".fag_btn").eq(i).addClass("valgfag_andet btn-success");
        }

        if (jsonData.fag[i].helaar == true) {
            $(".fag_btn").eq(i).addClass("helaar");
        }


    }



    $(".semester_container").eq(0).removeClass("col-lg-3 col-md-4 col-sm-4 col-xs-6").addClass("col-lg-6 col-md-8 col-sm-8 col-xs-12");

    $(".su_timer").eq(0).hide();
    $(".semester_container").eq(0).hide();

    if (window.location !== window.parent.location) {
        $("h1, .instr_container, .kvuc_link, .footerCopywrite").hide();
        $(".container-fluid").prepend($(".instr_top"));
        $(".feedback_container").css("margin-top", "0px")
        $(".instr_top").css("font-size", "18px").css("margin-left", "16px");
        $(".feedback_container").css("margin-top", "10px");

        function iframeResize() {
            var height = $('body').outerHeight(); // IMPORTANT: If body's height is set to 100% with CSS this will not work.
            parent.postMessage("resize::" + height, "*");
            //var pathname = window.location.pathname;
            /*var url = window.location.pathname;
            parent.postMessage("resizde::" + height + "url::" + url, "*");
           */

        }

        $(document).ready(function() {
            // Resize iframe
            setInterval(iframeResize, 200);
        });
    }

    inIframe();

}

function inIframe() {

    if (window.self !== window.top) {
        $(".container-fluid").css("margin", "0px");
        $(".container-fluid").css("padding-right", "5px")

    } else {
        //alert("not in frame");
    }
}


function make_overlay() {

    $(".dragzone").prepend("<div class='overlay'><span class='glyphicon glyphicon-move'></span>  Træk fagene op i de forskellige semestre </div>");
    //$(".overlay").on('click mouseover', function() {
    //  $(this).fadeOut(600);
    //});
};


function udregn_timer() {

    valgfag = 0;
    valgfagsstimer = 0;
    kreative_fag = 0;
    obligatoriske_fag = 0;
    sso = true;
    ep = false;
    ba_fag = false;
    opgave = 0;
    totalTimer = 0;
    valgfagsArray = [];

    var duplicate_fag_Array = [];

    saveData = [
        [udvidet_fagpakke, semestre, autoudfyldt, merit]
    ];

    /* ER der placeret flere af samme fag?? */

    $("#semester_app").find(".helaar").each(function(index) {

        var num_class = $(this).attr("class").split(" ")[0];

        var fagbtns_placeret = $("#semester_app").find("." + num_class).length;

        if (fagbtns_placeret > 1 && duplicate_fag_Array.indexOf(num_class) < 0) {
            duplicate_fag_Array.push(num_class);
        }

    })

    //console.log("duplicate_fag_Array: " + duplicate_fag_Array)



    totalTimer = 0;



    $(".semester_content").each(function(index) {

        saveData.push([]);

        var udd_timer = 0;
        var su_timer = 0;

        var semester_indeks = index;

        console.log("semester_indeks: " + semester_indeks);


        $(this).find($(".fag_btn")).each(function(index) {


            var indeks = $(this).attr("id");
            indeks = parseInt(indeks.substring(4, indeks.length));


            /**
             *
             * Indsæt Data i saveData*/

            saveData[semester_indeks + 1].push($(this).attr("id"));

            console.log("saveData: ", saveData);


            /*
             */


            /* check hvis der er en duplikate og halver timetallet */

            if (duplicate_fag_Array.indexOf("fag_" + indeks) > -1) {
                var timer = jsonData.fag[indeks].udd_timer / 2;
                su_timer += jsonData.fag[indeks].su_timer / 2;
            } else {
                var timer = jsonData.fag[indeks].udd_timer;
                su_timer += jsonData.fag[indeks].su_timer;
            }
            //console.log("timer: " + timer + ", SU-timer: " + su_timer);

            udd_timer += timer;


            /* adder antal af forskellige fag */

            if ($(this).hasClass("flexible")) {
                kreative_fag++;
                valgfag++;
            }

            if ($(this).hasClass("valgfag")) {
                valgfag++;

                valgfagsstimer += jsonData.fag[indeks].udd_timer;




            }

            if ($(this).hasClass("obligatorisk")) {
                obligatoriske_fag++;
            }

            if ($(this).hasClass("udvidet")) {
                udvidede_fag++;
            }

            if ($(this).hasClass("ba")) {
                ba_fag++;
            }

            if ($(this).hasClass("opgave")) {
                opgave++;
                //alert("tæller opgave op!")
            }

            console.log("udvidede_fag: " + udvidede_fag + "ba_fag: " + ba_fag);

        });



        su_timer = Math.round(su_timer * 100) / 100;

        $(".su_display").eq(index).html(su_timer.toString().replace(".", ","));
        if (su_timer >= 22.9 && su_timer <= 30.5) {
            $(".su_display").eq(index).addClass("su-success");
            $(".su_display").eq(index).removeClass("su-danger");
        } else {
            $(".su_display").eq(index).removeClass("su-success");
            $(".su_display").eq(index).addClass("su-danger");
        }

        totalTimer += udd_timer;

        $(".feedback").html(totalTimer); // + "/" + min_timer);


        //console.log("Num OBL: " + $(".semester_content > .obligatorisk").length + "dup: " + duplicate_fag_Array.length);
        //$(".su_timer").eq(index).html("ost");

        // if ($(this).find(".fag_btn").length > 3) {
        //   microhint($(this), "OBS! Hvis du vil have mere end 3 fag pr semester, så skal du tage et eller flere fag på HF Online", true)
        //}

    });

    if (kreative_fag > 0) {
        valgfagsstimer = valgfagsstimer - 75;
    }

    //console.log(index + ": " + udd_timer);
    //console.log("Flex fag: " + kreative_fag);

    if ($(".semester_content > .obligatorisk").length - duplicate_fag_Array.length > 8) {
        $(".obl_fag_ok_glyph").addClass("complete_ok_glyph");
        //animate_glyph($(".obl_fag_ok_glyph")); 
    } else {
        $(".obl_fag_ok_glyph").removeClass("complete_ok_glyph");
    }

    if (opgave > 1) {
        //alert("VI rammer: " + opgave)
        $(".opgave_ok_glyph").addClass("complete_ok_glyph");
    } else {
        $(".opgave_ok_glyph").removeClass("complete_ok_glyph");
    }


    if (kreative_fag > 0) {
        $(".krea_fag_ok_glyph").addClass("complete_ok_glyph");
    } else {
        $(".krea_fag_ok_glyph").removeClass("complete_ok_glyph");
    }
    if (udvidet_fagpakke != true) {
        if (valgfagsstimer > 449 && valgfagsstimer < 501) {
            $(".valgfag_ok_glyph").addClass("complete_ok_glyph");
        } else {
            $(".valgfag_ok_glyph").removeClass("complete_ok_glyph");
        }
    } else {
        if (valgfagsstimer > 449 && valgfagsstimer < 701) {
            $(".valgfag_ok_glyph").addClass("complete_ok_glyph");
        } else {
            $(".valgfag_ok_glyph").removeClass("complete_ok_glyph");
        }
    }


    if (udvidede_fag > 1 && ba_fag > 0) {
        $(".udvidet_fag_ok_glyph").addClass("complete_ok_glyph");
    } else {
        $(".udvidet_fag_ok_glyph").removeClass("complete_ok_glyph");
    }

    if (totalTimer >= min_timer && totalTimer <= max_timer) {
        $(".timer_ok_glyph").addClass("complete_ok_glyph");
    } else {
        $(".timer_ok_glyph").removeClass("complete_ok_glyph");
    }


    /* tjek obligatoriske fag */





    /*Check status for fag */



    $(".saveConsole").html(saveData);


    osc.save('timeData', saveData);

    var mh_count = $(".microhint").length;
    if (mh_count > 1) {
        $(".microhint").each(function() {
            $(this).css("margin-left", (100 - Math.random() * 200) + "px").css("margin-top", (20 - Math.random() * 40) + "px");
        });
    }


    console.log("udregn timer kaldt: " + mh_count);

}


function set_height_containers() {

    //$(".semester_content").css("min-height", "300px")



    var maks_height = 0;
    var height = 0;
    $(".semester_content").css("min-height", "70px");
    //console.log("SET HEIGHT CALLED: maks_height: " + maks_height);

    $(".semester_content").each(function(index) {



        height = $(this).css("height");
        //console.log("this_height: " + index + ": " + height);

        height = parseInt(height);

        if (height > maks_height) {
            maks_height = height;
            //console.log("Setting height: " + maks_height);
            maks_height = parseInt(maks_height);

        }
        //console.log("maks_height: " + maks_height);
        /*for (var i = 0; i < 10; i++) {
            $(".semester_content").eq(i).css("height", maks_height + "px");*/
    });
    //$(".semester_content").css("min-height", 110 + "px");
    $(".semester_content").css("min-height", maks_height + "px");
    if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
        $(".semester_content").css("height", 110 + "px"); //.css("overflow", "hidden");
    }



    //$(".semester_content").each(function(index) {

    //});

}



function nav_click(text, object) {

    var indeks = object.index(".btn-var");


    if (indeks == 3) {
        sortDivs();

        if ($(".semester_container").eq(0).is(":visible")) {
            console.log("IT IS VISIBLE!");
            $(".semester_container").eq(0).fadeOut();
            object.html("Vis tidligere gennemførte fag <span class='custom_glyphs glyphicon glyphicon-floppy-disk'></span>");
            $(".semester_container").eq(0).find(".fag_btn").appendTo(".dragzone");
            merit = false;
            sortDivs();
        } else {
            $(".semester_container").eq(0).fadeIn();
            object.html("Skjul tidligere gennemførte fag <span class='custom_glyphs glyphicon glyphicon-floppy-disk'></span>");
            merit = true;


        }
        udregn_timer();
    }

    if (indeks == 0) {
        if (semestre < 19) {
            semestre++;
            $(".semester_container").eq(semestre).fadeIn();
        } else {
            microhint($(".knap_container"), "Du kan maksimalt arbejde med 18 semestre", true);
        }

        udregn_timer();
    }
    if (indeks == 1) {
        if (semestre > 1) {
            $(".semester_container").eq(semestre).fadeOut();
            $(".semester_container").eq(semestre).find(".fag_btn").appendTo(".dragzone");

            semestre--;
        } else {
            microhint($(".knap_container"), "Du skal have minimum 1 semester");
        }
        sortDivs();
        udregn_timer();
    }

    if (indeks == 2) {

        if (udvidet_fagpakke == true) {

            object.html("Vis udvidet fagpakke <span class='custom_glyphs glyphicons glyphicons-education'></span>");
            $(".btn_exp").eq(2).fadeOut();
            $(".udvidet_fag_status, .udvidet_fag_ok_glyph, .ba").fadeOut();
            $(".ba").appendTo(".dragzone");
            sortDivs();

            min_timer = 1705;
            max_timer = 1755;

            udvidet_fagpakke = false;

        } else {

            udvidet_fagpakke = true;
            object.html("Skjul udvidet fagpakke <span class='custom_glyphs glyphicons glyphicons-education'></span>");
            $(".btn_exp").eq(2).fadeIn();
            $(".udvidet_fag_status, .udvidet_fag_ok_glyph, .ba").fadeIn();
            min_timer = 1905;
            max_timer = 1955;
        }

        udregn_timer();

    }
    if (indeks == 4) {



        UserMsgBox_xclick("body", "<h3>Vil du fylde semestrene ud automatisk?</h3><button class='btn_accept_udfyld btn-sm btn btn-success'>Ja - med grundpakken</button><button class='btn_accept_udfyld_udvidet btn-sm btn btn-success'>Ja - med den udvidede fagpakke</button><p>Klik på krydset for at gå tilbage</p>");

        $(".btn_accept_udfyld").click(function() {
            //object.html("Fjern alle fag <span class='custom_glyphs glyphicon glyphicon-remove'></span>");
            autoudfyldt = true
            autoudfyld("alm");
            $(".MsgBox_bgr").remove();
        })
        $(".btn_accept_udfyld_udvidet").click(function() {
            //object.html("Fjern alle fag <span class='custom_glyphs glyphicon glyphicon-remove'></span>");
            autoudfyldt = true
            autoudfyld("udvidet");
            $(".MsgBox_bgr").remove();
        })




        /*object.html("Automatisk udfyldning <span class='glyphicon glyphicon-folder-open'></span>");
            autoudfyldt = false;

         
            $(".clone").remove();*/


        udregn_timer();

    }
    if (indeks == 5) {
        UserMsgBox_xclick("body", "<h3>Fjern alle fag?</h3>  Er du sikker på, at du vil fjerne alle fag fra alle semestre?<br/><button class='btn_accept_udfyld btn-sm btn btn-success'>Ja</button><button class='btn_reject_udfyld btn-sm btn btn-danger'>Nej</button>");

        $(".btn_accept_udfyld").click(function() {


            $(".dropped").appendTo(".dragzone"); //each(function(index) {
            //console.log(index);
            //$(this).eq(index).prependTo(".dragzone");

            //$(".dropped").eq(index).fadeOut(0);

            //$(".dropped").eq(index).fadeIn(200 + Math.random() * 600);


            //});
            $(".MsgBox_bgr").remove();
            $(".clone, .clone_valgfag").remove();
            semestre = 5;

            $(".semester_container").each(function(index) {
                if (index > semestre) {
                    $(this).hide();
                } else if (index <= semestre) {
                    $(this).show();
                }
            })

            $(".semester_container").eq(0).hide();

            sortDivs();
            udregn_timer();
            set_height_containers();

            $(".dropped").each(function() {
                $(this).fadeOut(0).fadeIn(Math.random() * 500);
                $(this).removeClass("dropped");
            })

        });
        $(".btn_reject_udfyld").click(function() {
            $(".MsgBox_bgr").remove();
        })
    }

    if (indeks == 6) {
        help();
    }
}

function clicked_SU(object) {

    var parentID = object.parent().index(".semester_content");
    var SU_timer = object.find("span").text(); //.toString().replace("SU-timer:", "");
    var SU_timer_Int = SU_timer.replace(",", ".");
    //var SU_timer_Int = SU_timer_Int.replace("SU-timer:","");
    //console.log(typeof(SU_timer_Int) + ": " + SU_timer_Int);
    SU_timer_Int = parseFloat(SU_timer_Int);
    //console.log(typeof(SU_timer_Int) + ": " + SU_timer_Int);
    //console.log("SU_timer:  " + SU_timer + ", Int: " + SU_timer_Int);
    //var SU_timer = parseFloat(object.text().replace(/([^0-9\\.,])/g, ""));


    //alert (typeof(SU_timer) + ": " + SU_timer);
    if (SU_timer_Int < 23) {

        microhint(object, SU_timer + " SU-timer er ikke nok til at du kan få SU i " + $(".semester_title").eq(parentID).html() + ". <br/>Du skal have minimum 23 SU-timer om ugen for at være berettiget til SU. <br/>(Du kan nøjes med 17 timer, hvis du har et hjemmeboende barn under syv år.", true);
    } else if (SU_timer_Int > 30) {
        microhint(object, "Du har ret til SU i " + $(".semester_title").eq(parentID).html() + ", men " + SU_timer + " SU-timer er for mange timer i forhold til hvad vi anbefaler om ugen. Prøv at flytte et fag til et andet semester.", true);
    } else {
        microhint(object, SU_timer + " SU-timer gør, at du er berettiget til SU i " + $(".semester_title").eq(parentID).html() + " og er et fornuftigt antal timer på en uge.", true);
    }
}

function clicked_btn_exp(object) {
    var indeks = object.index(".btn_exp");
    console.log("HTML: " + indeks);

    if (indeks == 0) {
        microhint(object, "Du skal have alle fag, der er i de blå bokse. <br/>Derudover skal du skrive SSO (Større Skriftlig Opgave) og en EP (Eksamensprojekt)<br/>Det er også obligatorisk at have ét kreativt valgfag (Musik, Mediefag, Dramatik, Dans eller Billedkunst). <br/><br/><button class='btn_vis_v btn btn-sm btn-info btn-var'>Vis et forslag<span class='custom_glyphs glyphicon glyphicon-folder-open'></span></button>", true);
    } else if (indeks == 1) {
        microhint(object, "Du skal have 3-5 valgfag, enten: <br/><br/><ul class='inline_ul'><li>1 fag på 0-B niveau og 2 fag på C-B niveau</li><li>2 fag på 0-B niveau og 1 fag på 0-C niveau</li><li>1 fag på 0-B niveau, 1 fag på C-B niveau og 2 fag på 0-C niveau</li><li>3 fag på C-B niveau og 1 fag på 0-C niveau</li><li>4 fag på C-B niveau</li><li>2 fag på C-B niveau og 3 fag på 0-C niveau</li></ul><br/>Se to eksempler på en uddannelsesplan ved at trykke på knappen: <br/><br/><button class='btn_vis_v btn btn-sm btn-info btn-var'>Vis et forslag<span class='custom_glyphs glyphicon glyphicon-folder-open'></span></button>", true);
    } else if (indeks == 2) {
        microhint(object, "Du skal have to fag på B-A niveau ELLER et B-A niveau og et valgfag der løfter fra C til B-niveau. <br/>Husk at fagene skal være relevante for den uddannelse du drømmer om. <br/><br/><button class='btn_vis_v btn btn-sm btn-info btn-var'>Vis et forslag<span class='custom_glyphs glyphicon glyphicon-folder-open'></span></button>", true);
    }
    $(".btn_vis_v").click(function() {
        nav_click("text", $(".btn-var").eq(4));
    });


}

function clicked_feedback(object) {

    var HTML = "";

    HTML += " <ul class='inline_ul'><li> En fuld HF består af 1705  uddannelsestimer</li><li>En udvidet HF består af 1905 timer og giver adgang til universitetet.</li><li> Du skal som minimum have 23 SU-timer i hvert semester, for at modtage SU-støtte. (17 timer, hvis du har et hjemmeboende barn under syv år.) <br/>Vi anbefaler ikke, at du har mere end 30 SU-timer pr. semester. </li><li> Du skal have en bestemt fordeling af fag. Læs mere ved at trykke på:</li> </ul><button class='mh_button_0 btn btn-sm btn-primary btn_exp'>Obligatoriske fag </button>    <button class='mh_button_1 btn btn-sm btn-success btn_exp'>Valgfag </button>";

    microhint(object, HTML, true)
    $(".mh_button_1").click(function() {
        clicked_btn_exp($(".btn_exp").eq(1));

    });
    $(".mh_button_0").click(function() {
        clicked_btn_exp($(".btn_exp").eq(0));

    });



}


/*=========================================================================
=            Sektion der knytter sig til download af word fil            =
=========================================================================*/

function download_word_file() {
    console.log('\nEXTERNAL FUNCTION download_1 - CALLED');

    var HTML = wordTemplate_1();
    console.log("EXTERNAL FUNCTION download - converted: " + HTML);
    var converted = htmlDocx.asBlob(HTML);
    console.log("EXTERNAL FUNCTION download - converted: " + JSON.stringify(converted));
    saveAs(converted, 'Uddannelsesplan.docx'); // EVT indsæt dato her

    console.log(converted);
}

function wordTemplate_1() {
    var HTML = '';
    HTML += '<!DOCTYPE html>';
    HTML += '<html>';
    HTML += '<head>';
    HTML += '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />'; // Fixes issue with danish characters on Internet Explore 
    HTML += '<style type="text/css">';
    HTML += 'body {font-family: arial;}';
    HTML += 'h1 {}';
    HTML += 'h2 {}';
    HTML += 'h5 {}';
    HTML += 'h6 {}';
    HTML += '.selected {color: #56bfc5; width: 25%;}';
    HTML += 'p {font-size: 14px; margin-bottom: 5px}';
    HTML += 'table {padding: 8px; width: 100%;}';
    HTML += 'td {width: 25%;}';
    HTML += 'ul {font-size: 16px;}';
    HTML += '#author div {display: inline-block;}';
    HTML += '.instruction {}';
    HTML += '.gray {color: #666;}';
    HTML += '</style>';
    HTML += '</head>';
    HTML += '<body>';



    HTML += '<h2>Uddannelsesplan</h2>';

    $(".semester_container").each(function(index) {
        if ($(this).is(":visible")) {
            HTML += '<h3>' + $(".semester_title").eq(index).html() + '</h3>';
            HTML += '<ul>'; // + $(".semester_title").eq(index).html() + '</h2>';

            $(".semester_content").eq(index).find(".fag_btn").each(function() {
                HTML += "<li>" + $(this).html() + "</li>";
            });
            HTML += '</ul>';
            HTML += $(".su_timer").eq(index).html();
            HTML += '<hr/>';
        }
    });
    HTML += "<h5>Timeantal: " + totalTimer + "</h5>";
    HTML += '</body>';
    HTML += '</html>';
    // document.write(HTML);
    return HTML;
}

/*=====  End of Sektion der knytter sig til downloiad af word fil  ======*/

function send_email() {
    var HTML = "Her er min uddannelsesplan, som jeg håber kan danne baggrund for en samtale om min uddannelse%0D%0A%0D%0A";
    $(".semester_container").each(function(index) {
        if ($(this).is(":visible")) {
            HTML += $(".semester_title").eq(index).html() + ":%0D%0A";

            $(".semester_content").eq(index).find(".fag_btn").each(function() {
                HTML += $(this).html() + "%0D%0A";
            });

            HTML += "SU timer dette semester: " + $(".su_display").eq(index).html() + "%0D%0A%0D%0A";
        }

    });
    HTML += "Timeantal: " + totalTimer;
    window.location.href = "mailto:mail@hf@kvuc.dk?subject=Uddannelsesplan&body=" + HTML;
    //window.location.href = "mailto:name@mail.com?subject=The%20subject&amp;body=This%20is%20a%20message%20body":
    //<a href=">Send mail</a>
    console.log("HAI");
};



/*==================================
=            Autoudfyld            =
==================================*/

function autoudfyld(udfyld_type) {

    $(".microhint").fadeOut();

    $(".fag_btn").appendTo(".dragzone");

    $(".clone").remove();





    $(".semester_container").eq(0).hide();

    if (udfyld_type == "alm") {
        semestre = 5;
        //alert ("SÅ er der Pølle!");
        udvidet_fagpakke = false;
        //object.html("Deaktiver udvidet fagpakke <span class='custom_glyphs glyphicons glyphicons-education'></span>");
        $(".btn_exp").eq(2).fadeOut();
        $(".ba,  .udvidet_fag_status, .udvidet_fag_ok_glyph").fadeOut();
        $(".btn-var").eq(2).html("Vis udvidet fagpakke <span class='custom_glyphs glyphicons glyphicons-education'></span>");
        min_timer = 1705;
        max_timer = 1755;

        for (var i = 0; i < jsonData.fag.length; i++) {


            if (jsonData.fag[i].placering) {
                $(".semester_content").eq(jsonData.fag[i].placering).append($("#fag_" + i));
                $("#fag_" + i).addClass("dropped");
                $("#fag_" + i).fadeOut(0);

                $("#fag_" + i).fadeIn(200 + Math.random() * 600);


                if (jsonData.fag[i].helaar == true) {
                    console.log(jsonData.fag[i].text + " skal autoplaceres i " + jsonData.fag[i].placering);
                    var klon = $("#fag_" + i).clone().prependTo(".dragzone");
                    klon.addClass("clone");

                    if (jsonData.fag[i].placering_2) {
                        $(".semester_content").eq(jsonData.fag[i].placering_2).append(klon);
                    }
                }
            }
        }
    } else {

        udvidet_fagpakke = true;
        //object.html("Deaktiver udvidet fagpakke <span class='custom_glyphs glyphicons glyphicons-education'></span>");
        $(".btn_exp").eq(2).fadeIn();

        $(".ba,  .udvidet_fag_status, .udvidet_fag_ok_glyph").fadeIn();
        $(".btn-var").eq(2).html("Skjul udvidet fagpakke <span class='custom_glyphs glyphicons glyphicons-education'></span>");
        semestre = 7;
        min_timer = 1905;
        max_timer = 1955;


        $(".ba").fadeIn();

        for (var i = 0; i < jsonData.fag.length; i++) {
            if (jsonData.fag[i].placering_udvidet) {
                $(".semester_content").eq(jsonData.fag[i].placering_udvidet).append($("#fag_" + i));
                $("#fag_" + i).addClass("dropped");
                $("#fag_" + i).fadeOut(0);

                $("#fag_" + i).fadeIn(200 + Math.random() * 600);
                if (jsonData.fag[i].helaar == true) {
                    console.log(jsonData.fag[i].text + " skal autoplaceres i " + jsonData.fag[i].placering_udvidet);
                    var klon = $("#fag_" + i).clone().prependTo(".dragzone");
                    klon.addClass("clone");

                    if (jsonData.fag[i].placering_udvidet_2) {
                        $(".semester_content").eq(jsonData.fag[i].placering_udvidet_2).append(klon);
                    }

                }
            }
        }
    }



    $(".semester_container").each(function(index) {
        if (index > semestre || index == 0) {
            $(this).fadeOut();
        } else if (index < semestre + 1) {
            $(this).fadeIn();
        }
    })
    $(".draggable").draggable({
        revert: "invalid",
        start: function() {
            $(".microhint").remove();
        },
        stack: "span"
    });
    sortDivs();
    udregn_timer();
    set_height_containers();
    //$(".semester_content").eq(2).append($(".fag_btn").eq(3));
}

/*=====  End of Autoudfyld  ======*/


/*============================================
=            Sorter divs efter ID            =
============================================*/
function sortDivs() {

    $(".fag_btn").off("click");


    var myArray = $(".dragzone .fag_btn");
    var count = 0;

    // sort based on timestamp attribute
    myArray.sort(function(a, b) {

        // convert to integers from strings
        a = parseInt($(a).attr("timestamp"), 10);

        b = parseInt($(b).attr("timestamp"), 10);
        count += 2;
        // compare
        if (a > b) {
            return 1;
        } else if (a < b) {
            return -1;
        } else {
            return 0;
        }
    });

    // put sorted results back on page
    $(".dragzone").html(""); //(myArray);
    $(".dragzone").append(myArray);


    $(".fag_btn").draggable({
        revert: "invalid",
        start: function() {
            $(".microhint").remove();
        },
        stack: "span"
    });

    $(".fag_btn").each(function() {
        var indeks = $(this).attr("id");
        indeks = parseInt(indeks.substring(4, indeks.length));
        $(this).html(jsonData.fag[indeks].text);
    });

    //$(".flexible").eq(0).before("<br/>");

    //$(".udvidet").eq(0).before("<br/>");

    addListeners();
}

function addListeners() {
    $(".fag_btn").click(function() {

        //$(".microhint").remove();

        var indeks = $(this).attr("id");
        indeks = parseInt(indeks.substring(4, indeks.length));
        var su_string = jsonData.fag[indeks].su_timer.toString();

        su_string = su_string.replace(".", ",");
        if (jsonData.fag[indeks].forklaring) {
            microhint($(this), "<b>" + jsonData.fag[indeks].text + "</b> (" + jsonData.fag[indeks].fagtype + ")<br/><em>" + jsonData.fag[indeks].forklaring + "</em><br/>Uddannelsestimer: " + jsonData.fag[indeks].udd_timer + "<br/>SU-timer: " + su_string, true);
        } else {
            microhint($(this), "<b>" + jsonData.fag[indeks].text + "</b> (" + jsonData.fag[indeks].fagtype + ")<br/>Uddannelsestimer: " + jsonData.fag[indeks].udd_timer + "<br/>SU-timer: " + su_string, true);
        }
    });



}


/*=====  End of Sorter divs efter ID  ======*/


function loadData() {

    window.osc = Object.create(objectStorageClass);

    var TjsonData = osc.load('timeData');
    console.log('returnLastStudentSession - TjsonData: ' + JSON.stringify(TjsonData));



    if (TjsonData) {

        semestre = TjsonData[0][1];
        udvidet_fagpakke = TjsonData[0][0];
        autoudfyldt = false; //TjsonData[0][2];
        merit = TjsonData[0][3];

        $(".semester_container").each(function(index) {
            if (index > semestre) {
                $(this).hide();
            } else if (index <= semestre) {
                $(this).show();
            }
        })

        if (merit == false) {
            $(".semester_container").eq(0).hide();
            $(".btn-var").eq(3).html("Vis tidligere gennemførte fag <span class='custom_glyphs glyphicons glyphicons-floppy-disk'></span>");
        } else {
            $(".semester_container").eq(0).show();
            $(".btn-var").eq(3).html("Skjul tidligere gennemførte fag <span class='custom_glyphs glyphicons glyphicons-floppy-disk'></span>");
        }

        if (udvidet_fagpakke == true) {
            $(".btn-var").eq(2).html("Skjul udvidet fagpakke <span class='custom_glyphs glyphicons glyphicons-education'></span>");
            $(".btn_exp").eq(2).fadeIn(0);
            $(".ba,  .udvidet_fag_status, .udvidet_fag_ok_glyph").fadeIn(0);
            min_timer = 1905;
            max_timer = 1955;
        }


        for (var i = 1; i < semestre + 2; i++) {



            for (var o = 0; o < TjsonData[i].length; o++) {

                var fag = $("#" + TjsonData[i][o]);

                if ($(".semester_content").has(fag).length > 0) {
                    var klon = fag.clone();
                    klon.addClass("clone");
                    $(".semester_content").eq(i - 1).append(klon);
                    $(".dragzone").find("#" + TjsonData[i][o]).remove();
                } else {
                    $(".semester_content").eq(i - 1).append(fag);

                    if ($("#" + TjsonData[i][o]).hasClass("helaar")) {
                        var klon = fag.clone();
                        $(".dragzone").append(klon);
                    }
                }

                //console.log("NOGET AT FINDE? " + $(".semester_content").find(fag).length); 


                fag.addClass("dropped");

                console.log("TjsonfData: " + (i - 1) + ": " + TjsonData[i][o]);

            }
        }

        sortDivs();
        set_height_containers();
        udregn_timer();


        /*
            if (udfyld_type != "udvidet") {
                //alert ("SÅ er der Pølle!");
                udvidet_fagpakke = false;
                //object.html("Deaktiver udvidet fagpakke <span class='custom_glyphs glyphicons glyphicons-education'></span>");
                $(".btn_exp").eq(2).fadeOut();
                $(".udvidet").fadeOut();
                min_timer = 1705;
                max_timer = 1755;

                for (var i = 0; i < jsonData.fag.length; i++) {
                    if (jsonData.fag[i].placering) {
                        $(".semester_content").eq(jsonData.fag[i].placering).append($("#fag_" + i));
                        if (jsonData.fag[i].helaar == true) {
                            console.log(jsonData.fag[i].text + " skal autoplaceres i " + jsonData.fag[i].placering);
                            var klon = $("#fag_" + i).clone(); //.prependTo(".dragzone");
                            klon.addClass("clone");
                            $(".semester_content").eq(jsonData.fag[i].placering_2).append(klon);
                        }
                    }
                }
            }*/
    } else {
        console.log("INGEN DATA");
    }

    if ($(".dropped").length < 1) {
        microhint($(".feedback_container"), "<h4>Træk fagene til de forskellige semestre</h4><img src='img/intro.gif' class='drop_gif img-responsive'>", true);
    }
}

function help() {



    //if (!$(".obl_fag_ok_glyph").hasClass("complete_ok_glyph")) {
    //  alert("Du har ikke styr på de obligatoriske fag");
    //}

    if (!$(".obl_fag_ok_glyph").hasClass("complete_ok_glyph")) {

        $(".dragzone").find(".obligatorisk").each(function() {

            if (!$(this).hasClass("clone")) {
                var indeks = $(this).index(".obligatorisk");

                microhint($(".obligatorisk").eq(indeks), "Du mangler at placere obligatoriske fag, bl.a " + $(".obligatorisk").eq(indeks).html(), true);
                return false;
            }


        });
        $(".instr_top").html("<span class=' glyphicon glyphicon-user'></span> <span>Træk alle de obligatoriske fag til semestrene</span>");

    } else if (!$(".opgave_ok_glyph").hasClass("complete_ok_glyph")) {
        $(".dragzone").find(".opgave").each(function() {
            var indeks = $(this).index(".opgave");

            microhint($(".opgave").eq(indeks), "Du mangler at placere " + $(".opgave").eq(indeks).html(), true);
            return false;

        });
        $(".instr_top").html("<span class=' glyphicon glyphicon-user'></span> <span>Placer EP og SSO i det sidste forårssemester </span>");

    } else if (!$(".krea_fag_ok_glyph").hasClass("complete_ok_glyph")) {
        var rand_indeks = Math.floor(Math.random() * $(".flexible").length);


        microhint($(".flexible").eq(rand_indeks), "Du mangler at placere et kreativt 0-C fag som f.eks " + $(".flexible").eq(rand_indeks).html(), true); // + $(".flexible").eq(indeks).html());


        $(".instr_top").html("<span class=' glyphicon glyphicon-user'></span> <span>Placer et kreativt fag</span>");
    } else if (!$(".valgfag_ok_glyph").hasClass("complete_ok_glyph")) {

        console.log("Du har " + valgfagsstimer);

        var HTML = "Med de valgfag du allerede har placeret, kan opnå en fuld HF ved at vælge: <br/><br/><ul class='inline_ul'>";
        if (valgfagsstimer < 75) { // case 1 0-C fag
            var HTML = "Du skal have 3-5 valgfag, enten: <br/><br/><ul class='inline_ul'><li>1 fag på 0-B niveau og 2 fag på C-B niveau</li><li>2 fag på 0-B niveau og 1 fag på 0-C niveau</li><li>1 fag på 0-B niveau, 1 fag på C-B niveau og 2 fag på 0-C niveau</li><li>3 fag på C-B niveau og 1 fag på 0-C niveau</li><li>4 fag på C-B niveau</li><li>2 fag på C-B niveau og 3 fag på 0-C niveau</li></ul>";
        } else if (valgfagsstimer == 75) { // case 1 0-C fag
            HTML += "<li>2 0-B fag </li>";
            HTML += "<li>1 0-B fag, 1 C-B fag og 1 0-C fag </li>";
            HTML += "<li>3 C-B fag eller</li>";
            HTML += "<li>2 C-B fag og 2 0-C fag</li>";
        } else if (valgfagsstimer == 125) { // case 1 C-B fag
            HTML += "<li>1 0-B fag og 1 C-B fag</li>";
            HTML += "<li>1 0-B fag og 2 0-C fag </li>";
            HTML += "<li>1 C-B fag og 3 0-C fag </li>";
            HTML += "<li>2 C-B fag  og 1 0-C fag eller</li>";
            HTML += "<li>3 C-B fag </li>";
        } else if (valgfagsstimer == 150) { // case 2 0-C fag
            HTML += "<li>1 0-B fag, 1 C-B fag eller</li>";
            HTML += "<li>2 C-B fag og 2 0-C fag</li>";
        } else if (valgfagsstimer == 200) { // case 1 0-B fag eller 1 0-C og 1 C-B
            HTML += "<li>2 C-B fag</li>";
            HTML += "<li>1 0-B fag og 1 0-C fag eller </li>";
            HTML += "<li>1 C-B fag og 2 0-C fag </li>";
        } else if (valgfagsstimer == 225) { // case 3 0-C fag 
            HTML += "<li>2 C-B fag</li>";
        } else if (valgfagsstimer == 250) { // case 2 C-B fag 
            HTML += "<li>1 0-B fag</li>";
            HTML += "<li>1 C-B fag og 1 0-C fag eller </li>";
            HTML += "<li>2 C-B fag</li>";
        } else if (valgfagsstimer == 275) { // case 1 0-B fag og 1 0-C fag eller  1 C-B fag og 2 0-C fag
            HTML += "<li>1 0-B fag eller</li>";
            HTML += "<li>1 C-B fag og 1 0-C fag </li>";

        } else if (valgfagsstimer == 300) { // case 1 0-B fag og 1 0-C fag eller  1 C-B fag og 2 0-C fag
            HTML += "<li>1 0-B fag eller</li>";
            HTML += "<li>1 C-B fag og 1 0-C fag </li>";

        } else if (valgfagsstimer == 325) { // case 1 0-B fag og 1 0-C fag eller  1 C-B fag og 2 0-C fag
            HTML += "<li>1 C-B fag eller</li>";
            HTML += "<li>1 0-B fag</li>";

        } else if (valgfagsstimer == 350) { // case 1 0-B fag og 1 0-C fag eller  1 C-B fag og 2 0-C fag
            HTML += "<li>1 C-B fag eller</li>";
            HTML += "<li>2 0-C fag </li>";

        } else if (valgfagsstimer == 375) { // case 1 0-B fag og 1 0-C fag eller  1 C-B fag og 2 0-C fag
            HTML += "<li>1 C-B fag eller </li> ";
            HTML += "<li>1 0-C fag </li>";

        } else if (valgfagsstimer == 400) { // case 1 0-B fag og 1 0-C fag eller  1 C-B fag og 2 0-C fag
            HTML += "<li>1 0-C fag </li>";

        } else if (valgfagsstimer == 425) { // case 1 0-B fag og 1 0-C fag eller  1 C-B fag og 2 0-C fag
            HTML += "<li>1 0-C fag </li>";

        } else if (valgfagsstimer > 500) {
            var HTML = "Du har for mange valgfagstimer. Fjern et et eller flere valgfag";
        }

        HTML += "</ul>";



        microhint($(".glyphicon-question-sign"), HTML, true);
        $(".instr_top").html("<span class=' glyphicon glyphicon-user'></span> <span>Placer flere valgfag, så det passer med kravene til en fuld HF og evt. SU.</span>");

    } else if (!$(".udvidet_fag_ok_glyph").hasClass("complete_ok_glyph") && udvidet_fagpakke == true) {
        var rand_indeks = Math.floor(Math.random() * $(".udvidet").length);


        microhint($(".udvidet").eq(rand_indeks), "Du mangler at placere et udvidet fagpakkefag.", true); // som f.eks " + $(".flexible").eq(rand_indeks).html()); // + $(".flexible").eq(indeks).html());
        //$(".instructionText").html("Her kan du få inspiration til at planlægge dit HF forløb. <br/>Objektet er et værktøj som kan hjælpe dig til at få overblik over en fuld HF, men KVUC kan ikke garantere, at den plan du laver her kan lade sig gøre i virkeligheden. <br><span class='instr_top'><span class=' glyphicon glyphicon-user'></span> <span>Placer 1-2 udvidede fagpakke fag og valgfag så du kommer op på mindst 1905 timer</span>");


    } else if (!$(".timer_ok_glyph").hasClass("complete_ok_glyph")) {
        if (totalTimer > max_timer) {
            microhint($(".btn-var").eq(6), "Du har for mange timer, skift f.eks. et valgfag ud med et der har færre timer eller skift et B-A fag ud med et C-B fag.", true); // som f.eks " + $(".flexible").eq(rand_indeks).html()); // + $(".flexible").eq(indeks).html());
            //$(".instructionText").html("Her kan du planlægge dit HF forløb. Så er du forberedt til vejledning eller tilmelding.  <br><span class='instr_top'><span class=' glyphicon glyphicon-user'></span> <span>Du har for mange uddannelsestimer.</span>");
        } else {
            //$(".instructionText").html("Her kan du planlægge dit HF forløb. Så er du forberedt til vejledning eller tilmelding.  <br><span class='instr_top'><span class=' glyphicon glyphicon-user'></span> <span>Du har for få uddannelsestimer.</span>");
            if ($("#fag_58").hasClass("dropped")) {
                microhint($(".btn-var").eq(6), "Du har valgt ikke timer nok til en udvidet HF. <br/>Bemærk at Historie B-A tæller 50 timer (75 timer mindre end de andre B-A fag).<br/> <br/> Vælg et andet B-A fag eller tilføj endnu et valgfag.", true); // som f.eks " + $(".flexible").eq(rand_indeks).html()); // + $(".flexible").eq(indeks).html());     
            } else {
                microhint($(".btn-var").eq(6), "Du har ikke timer nok til en fuld HF. <br/> Tilføj et fag mere.", true); // som f.eks " + $(".flexible").eq(rand_indeks).html()); // + $(".flexible").eq(indeks).html());
            }
        }
    } else {
        microhint($(".glyphicon-question-sign"), "Du har sammensat en fuld HF <br/> Hent din uddannelsesplan, send en mail til vejledningen eller tag evt. et screenshot af siden.", true);
        //$(".instr_top").html("Her kan du planlægge dit HF forløb. Så er du forberedt til vejledning eller tilmelding.  <br><span class='instr_top'><span class=' glyphicon glyphicon-user'></span> <span>Du er klar til at gå videre med din studieplan.</span>");
    }

    $(".instr_top").fadeOut(0).fadeIn(500);
}

function check_fagprogression(objekt_id, droppable_indeks) {

    var progressions_problem = true;

    var objekt_HTML = $("#" + objekt_id).html();
    var objekt_fag = objekt_HTML.substring(0, objekt_HTML.length - 4);
    var objekt_niveau = objekt_HTML.substring(objekt_HTML.length - 3, objekt_HTML.length);

    if (objekt_niveau == "C-B" || objekt_niveau == "B-A") {

        $(".dropped").each(function() {
            var droppedfag = $(this).html();
            var dropped_string = droppedfag.substring(0, objekt_HTML.length - 4);
            var indeks = $(this).parent().index(".semester_content");
            //alert("indeks: " + indeks + ", droppable" + droppable_indeks);


            if (dropped_string == objekt_fag && indeks < droppable_indeks) {

                progressions_problem = false;
            }
        })
        if (progressions_problem == true) {
            if (objekt_niveau == "C-B") {
                return "Før du kan tage " + objekt_HTML + " skal du huske at tage " + objekt_fag + " på 0-C niveau i et tidligere semester.<br/><br/>";
                setTimeout(function() { microhint($("#" + objekt_id), "Før du kan tage " + objekt_HTML + " skal du huske at tage " + objekt_fag + " på 0-C niveau i et tidligere semester.", true); }, 100);
            } else if (objekt_niveau == "B-A") {
                return "Før du kan tage " + objekt_HTML + " skal du huske at tage " + objekt_fag + " på C-B eller 0-B niveau i et tidligere semester.<br/><br/>";
                setTimeout(function() { microhint($("#" + objekt_id), "Før du kan tage " + objekt_HTML + " skal du huske at tage " + objekt_fag + " på C-B eller 0-B niveau i et tidligere semester.", true); }, 100);
            }
        }
    }
}