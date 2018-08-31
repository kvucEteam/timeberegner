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
    startaar = 2018;
startsemester = "Efterår";



$(document).ready(function() {

    $(document).on("click touchend mousemove", function() {
        console.log("Clear timer");
        window.clearTimeout(tipTimer);

        tipTimer = setTimeout(function() { help(); }, 30000);
    })


    $(".saveConsole").hide();

    $('.instr_container').html(instruction_noLines("Her kan du planlægge dit HF forløb så du er forberedt til vejledning eller tilmelding. <br>Find de fag du ønsker og træk dem fra faglisten til semesterkasserne. ")); // Tilføjet af THAN d. 02/01-2018.

    init();


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

    $(".download-btn").click(function() {
        download_word_file();
    });

    $(".send_email").click(function() {
        send_email();

    });

    $("body").click(function() {
        $(".overlay").fadeOut();
    });

    addListeners();

    /*=====  End of Event listening  ======*/

    function init() {

        /* lav knapperne */

        

        for (var i = 0; i < jsonData.knapper.length; i++) {
            $(".knap_container").append("<button class='btn btn-sm btn-info btn-var'>" + jsonData.knapper[i].tekst + "</button>");
        }

        /* lav containere */

$("#semester_app").append("<div class ='semester_container col-lg-3 col-md-4 col-sm-4 col-xs-6'><div class='semester_content '><div class='semester_title'>Tidligere gennemførte fag (Merit)</div><div class='su_timer'> SU timer: <span class='su_display'>0</span> </div>  </div></div>");
        
        for (var i = 0; i < 20; i++) {

            if (i % 2) {
                startsemester = "Forår";
startaar ++;
            } else {
                startsemester = "Efterår";
                
            }
            
            $("#semester_app").append("<div class ='semester_container col-lg-3 col-md-4 col-sm-4 col-xs-6'><div class='semester_content '><div class='semester_title'>" + startsemester + " " + startaar + "</div> <div class='su_timer'> SU timer: <span class='su_display'>0</span> </div> </div></div>");


            if (i > semestre) {
                $(".semester_container").eq(i).hide();
            }
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
            }

            if (jsonData.fag[i].helaar == true) {
                $(".fag_btn").eq(i).addClass("helaar");
            }


        }

        $(".semester_container").eq(0).removeClass("col-lg-3 col-md-4 col-sm-4 col-xs-6").addClass("col-lg-6 col-md-8 col-sm-8 col-xs-12");

        $(".su_timer").eq(0).hide();
        $(".semester_container").eq(0).hide();
    }


    /*==================================
    =            Droppable afdeling            =
    ==================================*/



    $(".semester_content, .dragzone").droppable({

        accept: ".fag_btn",
        tolerance: "touch",
        drop: function(e, ui) {


            if ($(this).hasClass("semester_content")) {


                var this_id = ui.draggable.attr('class').split(" ")[0];

                var id_length = $("." + this_id).length;


                /*----------  Hvis SU er for højt i kasserne  ----------*/

                var this_sutimer = parseInt($(this).find(".su_display").html());

                if (this_sutimer > 35 && $(this).index(".semester_content") != 0) {
                    microhint($(this), "Du har allerede " + this_sutimer + " SU timer i dette semester. Placer faget i et andet semester.");

                    ui.draggable.animate({
                        left: 0,
                        top: 0
                    }, 200, function() {
                        ui.draggable.draggable({
                            revert: "invalid",
                            start: function() {
                                $(".microhint").remove();
                            },
                            stack: "span"
                        });
                    });

                    sortDivs();

                } else {
                    ui.draggable.addClass("dropped")
                    $(this).append(ui.draggable);
                    $(this).find(".draggable").css({

                        top: 0,
                        left: 0,
                        margin: "4px",
                    });

                    if (id_length < 2) {

                        if (ui.draggable.hasClass("helaar")) {

                            console.log("FG BTN: " + ui.draggable.index(".fag_btn"));

                            microhint(ui.draggable, ui.draggable.html() + " kan tages både halv og helårligt. Træk det samme fag til et andet semester for at tage det over et helt år.")
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

                    } else if (id_length > 1) {

                        ui.draggable.addClass("helaarmode");

                    }

                    if (ui.draggable.hasClass("flexible")) {
                        if (kreative_fag < 2) {
                            microhint(ui.draggable, "Du har placeret et kreativt fag. Du skal have et kreativt fag som obligatorisk. Derudover skal du vælge 3-5 valgfag.")
                        }
                    }

                }



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




            //console.log("id_length: " + id_length);





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



            console.log("hej");



            if (ui.draggable.attr("id") == "fag_9") {
                var drop_title = $(this).find(".semester_title").html();
                if (drop_title[0] == "E") {
                    ui.draggable.appendTo(".dragzone");
                    ui.draggable.insertBefore("#fag_10");
                    microhint($("#fag_9"), "Du kan kun skrive SSO i et forårssemester")

                }
            }

            udregn_timer();
            set_height_containers();

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


    clicked_feedback($(".feedback_container"));



});



/*=====  End of Droppable   ======*/



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

    var saveData = [
        [udvidet_fagpakke, semestre, autoudfyldt, merit]
    ];

    /* ER der placeret flere af samme fag?? */

    $("#semester_app").find(".fag_btn").each(function(index) {

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





        $(".su_display").eq(index).html(su_timer.toString().replace(".", ","));
        if (su_timer >= 22.9 && su_timer <= 30.1) {
            $(".su_display").eq(index).addClass("su-success");
            $(".su_display").eq(index).removeClass("su-danger");
        } else {
            $(".su_display").eq(index).removeClass("su-success");
            $(".su_display").eq(index).addClass("su-danger");
        }

        totalTimer += udd_timer;

        $(".feedback").html("Uddannelsestimer: " + totalTimer); // + "/" + min_timer);


        console.log("Num OBL: " + $(".semester_content > .obligatorisk").length + "dup: " + duplicate_fag_Array.length);
        //$(".su_timer").eq(index).html("ost");
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



}

function animate_glyph(object) {
    object.fadeOut(0).fadeIn(200);
}

function set_height_containers() {

    //$(".semester_content").css("min-height", "300px")



    var maks_height = 0;
    var height = 0;
    $(".semester_content").css("min-height", "70px");
    console.log("SET HEIGHT CALLED: maks_height: " + maks_height);

    $(".semester_content").each(function(index) {



        height = $(this).css("height");
        //console.log("this_height: " + index + ": " + height);

        height = parseInt(height);

        if (height > maks_height) {
            maks_height = height;
            console.log("Setting height: " + maks_height);
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
            microhint($(".knap_container"), "Du kan maksimalt arbejde med 18 semestre");
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



        UserMsgBox_xclick("body", "Vil du fylde semestrene ud automatisk?<br/><button class='btn_accept_udfyld btn-sm btn btn-success'>Ja - med grundpakken</button><button class='btn_accept_udfyld_udvidet btn-sm btn btn-success'>Ja - med den udvidede fagpakke</button><p>Klik på krydset for at gå tilbage</p>");

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




        /*object.html("Automatisk udfyldning <span class='glyphicon glyphicon-barcode'></span>");
            autoudfyldt = false;

         
            $(".clone").remove();*/


        udregn_timer();

    }
    if (indeks == 5) {
        UserMsgBox_xclick("body", "Er du sikker på, at du vil fjerne alle fag fra alle semestre?<br/><button class='btn_accept_udfyld btn-sm btn btn-success'>Ja</button><button class='btn_reject_udfyld btn-sm btn btn-danger'>Nej</button>");

        $(".btn_accept_udfyld").click(function() {
            $(".fag_btn").appendTo(".dragzone"); //each(function(index) {
            //console.log(index);
            //$(this).eq(index).prependTo(".dragzone");

            //$(".dropped").eq(index).fadeOut(0);

            //$(".dropped").eq(index).fadeIn(200 + Math.random() * 600);




            //});
            $(".MsgBox_bgr").remove();
            $(".clone").remove();
            sortDivs();
            udregn_timer();
            set_height_containers();

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
    console.log(typeof(SU_timer_Int) + ": " + SU_timer_Int);
    SU_timer_Int = parseFloat(SU_timer_Int);
    console.log(typeof(SU_timer_Int) + ": " + SU_timer_Int);
    console.log("SU_timer:  " + SU_timer + ", Int: " + SU_timer_Int);
    //var SU_timer = parseFloat(object.text().replace(/([^0-9\\.,])/g, ""));


    //alert (typeof(SU_timer) + ": " + SU_timer);
    if (SU_timer_Int < 23) {

        microhint(object, SU_timer + " SU-timer er ikke nok til at du kan få SU i " + $(".semester_title").eq(parentID).html() + ". <br/>Du skal have minimum 23 SU-timer om ugen for at være berettiget til SU. <br/>(Du kan nøjes med 17 timer, hvis du har et hjemmeboende barn under syv år.");
    } else if (SU_timer_Int > 30) {
        microhint(object, "Du har ret til SU i " + $(".semester_title").eq(parentID).html() + ", men " + SU_timer + " SU-timer er for mange timer i forhold til hvad vi anbefaler om ugen. Prøv at flytte et fag til et andet semester.");
    } else {
        microhint(object, SU_timer + " SU-timer gør, at du er berettiget til SU i " + $(".semester_title").eq(parentID).html() + " og er et fornuftigt antal timer på en uge.");
    }
}

function clicked_btn_exp(object) {
    var indeks = object.index(".btn_exp");
    console.log("HTML: " + indeks);

    if (indeks == 0) {
        microhint(object, "Du skal have alle disse fag. <br/>Du skal også skrive en Større skriftlig opgave (SSO) og et Eksamensprojekt (EP)<br/>Det er også obligatorisk at have ét kreativt valgfag (musik, mediefag, dramatik, dans eller billedkunst). <br/>");
    } else if (indeks == 1) {
        microhint(object, "Du skal have 3-5 valgfag, enten: <br/><br/><ul class='inline_ul'><li>1 fag på 0-B niveau og 2 fag på C-B niveau</li><li>2 fag på 0-B niveau og 1 fag på 0-C niveau</li><li>1 fag på 0-B niveau, 1 fag på C-B niveau og 2 fag på 0-C niveau</li><li>3 fag på C-B niveau og 1 fag på 0-C niveau</li><li>4 fag på C-B niveau</li><li>2 fag på C-B niveau og 3 fag på 0-C niveau</li></ul><br/>Se to eksempler på en uddannelsesplan ved at trykke på knappen: <br/><button class='btn btn-sm btn-info btn-var'>Vis et forslag<span class='custom_glyphs glyphicon glyphicon-barcode'></span></button>");
    } else if (indeks == 2) {
        microhint(object, "Du skal have to fag på B-A niveau ELLER et B-A niveau og et valgfag der løfter fra C til B-niveau. <br/>Husk at fagene skal være relevante for den uddannelse du drømmer om.");
    }

}

function clicked_feedback(object) {

    var HTML = "";

    HTML += " <ul class='inline_ul'><li> En fuld HF består af 1705  uddannelsestimer</li><li>En udvidet HF består af 1905 timer og giver adgang til universitetet.</li><li> Du skal som minimum have 23 SU-timer i hvert semester, for at modtage SU-støtte. (17 timer, hvis du har et hjemmeboende barn under syv år.) <br/>Vi anbefaler ikke, at du har mere end 30 SU-timer pr. semester. </li><li> Du skal have en bestemt fordeling af fag. Læs mere ved at trykke på:</li> </ul><button class='btn btn-sm btn-primary btn_exp'>Obligatoriske fag </button>    <button class='btn btn-sm btn-success btn_exp'>Valgfag </button>";

    microhint(object, HTML)

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
    var HTML = "Her er min uddanelsesplan, som jeg håber kan danne baggrund for en samtale om min uddannelse%0D%0A%0D%0A";
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
        semestre = 6;
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
        if (index > semestre ||  index == 0) {
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

    //alert("SORT DIVS CALLED")

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

        var indeks = $(this).attr("id");
        indeks = parseInt(indeks.substring(4, indeks.length));
        var su_string = jsonData.fag[indeks].su_timer.toString();

        su_string = su_string.replace(".", ",");
        if (jsonData.fag[indeks].forklaring) {
            microhint($(this), "<b>" + jsonData.fag[indeks].text + "</b> (" + jsonData.fag[indeks].fagtype + ")<br/><em>" + jsonData.fag[indeks].forklaring + "</em><br/>Uddannelsestimer: " + jsonData.fag[indeks].udd_timer + "<br/>SU-timer: " + su_string);
        } else {
            microhint($(this), "<b>" + jsonData.fag[indeks].text + "</b> (" + jsonData.fag[indeks].fagtype + ")<br/>Uddannelsestimer: " + jsonData.fag[indeks].udd_timer + "<br/>SU-timer: " + su_string);
        }
    });

}


/*=====  End of Sorter divs efter ID  ======*/


function loadData() {

    //var jsonData = {"A": {"A1": 1, "A2": 2, "A3": 3}, "B": {"B1": 1, "B2": 2, "B3": 3}}; 


    window.osc = Object.create(objectStorageClass);

    //osc.save('timeData', jsonData);
    //osc.init('studentSession_Time');
    //osc.exist('timeData');

    // osc.startAutoSave('test1', [1,2,3], 500);
    // osc.setAutoSaveMaxCount('test1', 5);

    // osc.startAutoSave('test2', [4,5,6], 1000);
    // osc.setAutoSaveMaxCount('test2', 10);

    // osc.startAutoSave('test3', [7,8,9], 1500);
    // osc.setAutoSaveMaxCount('test3', 15);

    var TjsonData = osc.load('timeData');
    console.log('returnLastStudentSession - TjsonData: ' + JSON.stringify(TjsonData));

    if (TjsonData) {



        console.log(TjsonData[0]);
        semestre = TjsonData[0][1];
        udvidet_fagpakke = TjsonData[0][0];
        autoudfyldt = false; //TjsonData[0][2];
        merit = TjsonData[0][3];


        $(".semester_container").each(function(index) {
            if (index > semestre) {
                $(this).hide();
            } else if (index < semestre) {
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

        if (autoudfyldt == true) {
            $(".btn-var").eq(4).html("Fjern alle fag <span class='custom_glyphs glyphicon glyphicon-remove'></span>");
        }



        for (var i = 1; i < semestre + 2; i++) {
            console.log("i:" + (i - 1));
            for (var o = 0; o < TjsonData[i].length; o++) {

                var fag = $("#" + TjsonData[i][o]);
                $(".semester_content").eq(i - 1).append(fag);

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
}

function help() {

    //if (!$(".obl_fag_ok_glyph").hasClass("complete_ok_glyph")) {
    //  alert("Du har ikke styr på de obligatoriske fag");
    //}

    if (!$(".obl_fag_ok_glyph").hasClass("complete_ok_glyph")) {

        $(".dragzone").find(".obligatorisk").each(function() {

            if (!$(this).hasClass("clone")) {
                var indeks = $(this).index(".obligatorisk");

                microhint($(".obligatorisk").eq(indeks), "Du mangler at placere obligatoriske fag, bl.a " + $(".obligatorisk").eq(indeks).html());
                return false;
            }


        });


    } else if (!$(".opgave_ok_glyph").hasClass("complete_ok_glyph")) {
        $(".dragzone").find(".opgave").each(function() {
            var indeks = $(this).index(".opgave");

            microhint($(".opgave").eq(indeks), "Du mangler at placere " + $(".opgave").eq(indeks).html());
            return false;

        });
    } else if (!$(".krea_fag_ok_glyph").hasClass("complete_ok_glyph")) {
        var rand_indeks = Math.floor(Math.random() * $(".flexible").length);


        microhint($(".flexible").eq(rand_indeks), "Du mangler at placere et kreativt 0-C fag som f.eks " + $(".flexible").eq(rand_indeks).html()); // + $(".flexible").eq(indeks).html());



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



        microhint($(".glyphicon-question-sign"), HTML);

    } else if (!$(".udvidet_fag_ok_glyph").hasClass("complete_ok_glyph") && udvidet_fagpakke == true) {
        var rand_indeks = Math.floor(Math.random() * $(".udvidet").length);


        microhint($(".udvidet").eq(rand_indeks), "Du mangler at placere et udvidet fagpakkefag"); // som f.eks " + $(".flexible").eq(rand_indeks).html()); // + $(".flexible").eq(indeks).html());



    } else if (!$(".timer_ok_glyph").hasClass("complete_ok_glyph")) {
        if (totalTimer > max_timer) {
            microhint($(".btn-var").eq(6), "Du har for mange timer, skift f.eks. et valgfag ud med et der har færre timer eller skift et B-A fag ud med et C-B fag."); // som f.eks " + $(".flexible").eq(rand_indeks).html()); // + $(".flexible").eq(indeks).html());
        } else {
            if ($("#fag_58").hasClass("dropped")) {
                microhint($(".btn-var").eq(6), "Du har valgt ikke timer nok til en fuld HF. <br/>Bemærk at Historie B-A tæller 75 timer mindre end de andre B-A fag.<br/> <br/> Vælg et andet B-A fag eller tilføj endnu et fag"); // som f.eks " + $(".flexible").eq(rand_indeks).html()); // + $(".flexible").eq(indeks).html());     
            } else {
                microhint($(".btn-var").eq(6), "Du har ikke timer nok til en fuld HF. <br/> Tilføj et fag mere."); // som f.eks " + $(".flexible").eq(rand_indeks).html()); // + $(".flexible").eq(indeks).html());
            }
        }
    } else {

        microhint($(".glyphicon-question-sign"), "Du har sammensat en fuld HF <br/> Hent din uddannelsesplan, send en mail til vejledningen eller tag et screenshot af siden.");
    }


}
