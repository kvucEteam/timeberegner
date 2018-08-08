var min_timer = 1705;
var max_timer = 1755;
var semestre = 4;

var valgfag = 0,
    kreative_fag = 0,
    obligatoriske_fag = 0,
    sso = true,
    ep = false,
    totalTimer = 0,
    autoudfyldt = false;


$(document).ready(function() {


    $('.instr_container').html(instruction_noLines("Vælg fag til hvert semester for at opnå en fuld HF")); // Tilføjet af THAN d. 02/01-2018.

    init();


    console.log(jsonData);
    /*=======================================
    =            Event listening            =
    =======================================*/

    $(".btn-var").click(function() {
        nav_click($(this).html(), $(this));
        //sortDivs();
    })

    $(".fag_btn").click(function() {
        var indeks = $(this).attr("id");
        indeks = parseInt(indeks.substring(4, indeks.length));
        if (jsonData.fag[indeks].forklaring) {
            microhint($(this), "<b>" + jsonData.fag[indeks].text + "</b><br/><em>" + jsonData.fag[indeks].forklaring + "</em><br/>Uddannelsestimer: " + jsonData.fag[indeks].udd_timer + "<br/>SU-timer: " + jsonData.fag[indeks].su_timer);
        } else {
            microhint($(this), "<b>" + jsonData.fag[indeks].text + "</b><br/>Uddannelsestimer: " + jsonData.fag[indeks].udd_timer + "<br/>SU-timer: " + jsonData.fag[indeks].su_timer);
        }
    });

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
        //send_email();
        sortDivs();
    });

    /*=====  End of Event listening  ======*/

    $(".semester_content, .dragzone").droppable({

        accept: ".fag_btn",
        tolerance: "touch",
        drop: function(e, ui) {


            $(this).append(ui.draggable);
            $(this).find(".draggable").css({

                top: 0,
                left: 0,
                margin: "4px",
                //width: $(this).width() + "px"
            });
            if ($(this).hasClass("semester_content")) {
                ui.draggable.addClass("dropped")


            } else {
                ui.draggable.removeClass("dropped");
                var place = ui.draggable.attr("id"); 
                place = place.substring(4, place.length);
                place = Number(place); 
                console.log("type: " + typeof(place));

                var placering = $("#fag_" + (place+1));

               // alert(placering);
                //placering.css("background-color", "red")

                
                ui.draggable.insertBefore(placering);
            }


            udregn_timer();
            set_height_containers();




            var this_id = ui.draggable.attr('class').split(" ")[0];

            var id_length = $("." + this_id).length;

            console.log("id_length: " + id_length);


            if ($(this).hasClass("semester_content") && id_length < 2) {

                if (ui.draggable.hasClass("helaar")) {
            
                var place = ui.draggable.attr("id"); 
                place = place.substring(4, place.length);
                place = Number(place); 
                console.log("type: " + typeof(place));

                var placering = $("#fag_" + (place+1));

               // alert(placering);
                //placering.css("background-color", "red")

                
                
                    console.log("FG BTN: " + ui.draggable.index(".fag_btn"));



                    microhint(ui.draggable, "Du har placeret et fag som kan tages både halv og helårligt. Træk det samme fag op i et andet semester for at tage det over et helt år.")
                        //ui.draggable.append("<div class='helaarlabel'>Helårligt</div>")
                    


                    var klon = ui.draggable.clone().prependTo(".dragzone").addClass("clone"); //insertBefore("#fag_1");//prependTo(".dragzone");
                    klon.fadeOut(0).fadeIn(1000);
                    klon.insertBefore(placering);
                    
                    $(".draggable").draggable({ revert: "invalid" });



                }

            } else if ($(this).hasClass("semester_content") && id_length > 1) {

                ui.draggable.addClass("helaarmode");

            }

            if ($(this).hasClass("semester_content") && ui.draggable.hasClass("flexible")) {
                microhint(ui.draggable, "Du har placeret et kreativt fag. Du skal have et kreativt fag som obligatorisk. Derudover kan du vælge 3-5 valgfag.")
            }
            /*Udregne hvor mange kreative fag der er og fjern obl fra knapper hvis mere end en er placeret */

            var flexible_dropped = 0;


            $(".flexible").each(function(index) {
                if ($(this).hasClass("dropped")) {

                    flexible_dropped++
                }
            });

            if (flexible_dropped > 0) {
                $(".flexible").removeClass("obligatorisk btn-primary")
                $(".flexible").addClass("valgfag btn-success");

            } else {
                $(".flexible").addClass("obligatorisk btn-primary")
                $(".flexible").removeClass("valgfag btn-success");
            }

            var last_letter = ui.draggable.html();
            last_letter = last_letter[last_letter.length - 1]

            /*if (last_letter == "A") {

                microhint(ui.draggable, "Et fag på " + last_letter + " niveau kræver, at du har haft faget på B-niveau.")
            } else if (last_letter == "B") {
                microhint(ui.draggable, "Et fag på " + last_letter + " niveau kræver, at du har haft faget på C-niveau ")
            }*/

            console.log("hej");


            if (ui.draggable.attr("id") == "fag_9") {
                var drop_title = $(this).find(".semester_title").html();
                if (drop_title[0] == "E") {
                    microhint($(this), "Du kan kun skrive SSO i et forårssemester")
                    ui.draggable.appendTo(".dragzone");
                }
            }



        }





    });

    //$(".dragzone").droppable({});

    $(".draggable").draggable({
        revert: "invalid",
        start: function() {
            $(".microhint").remove();
        }
    });


    $(".btn_exp").eq(2).hide();
    $(".udvidet").hide();

    $("#fag_9, #fag_10").css("background-color", "rgb(135, 150, 220");




});


function init() {

    /* lav knapperne */

    for (var i = 0; i < jsonData.knapper.length; i++) {
        $(".knap_container").append("<button class='btn btn-info btn-var'>" + jsonData.knapper[i].tekst + "</button>");
    }

    /* lav containere */

    for (var i = 0; i < jsonData.semesterdimser.length; i++) {
        $("#semester_app").append("<div class ='semester_container col-lg-3 col-md-4 col-sm-6 col-xs-12'><div class='semester_content '><div class='semester_title'>" + jsonData.semesterdimser[i].header + "</div> <div class='su_timer btn btn-xs'> SU timer: 0 </div> </div> </div>")

        if (i < 1) {
            $(".semester_container").eq(i).hide();

        } else if (i > 4) {
            $(".semester_container").eq(i).hide();
        }
    }




    /*lav fag_draggables */

    for (var i = 0; i < jsonData.fag.length; i++) {
        console.log("I: " + i);
        $(".dragzone").append("<span id ='fag_" + i + "' class='fag_" + i + " btn btn-sm draggable fag_btn'>" + jsonData.fag[i].text + "</span"); //(<span class='num'>" + jsonData.fag[i].udd_timer + "/" + jsonData.fag[i].su_timer + "</span>)</span>");
        if (jsonData.fag[i].fagtype == "obligatorisk") {
            $(".fag_btn").eq(i).addClass("obligatorisk btn-primary");
        } else if (jsonData.fag[i].fagtype == "kreativ") {
            $(".fag_btn").eq(i).addClass("obligatorisk btn-primary flexible");
        } else if (jsonData.fag[i].fagtype == "valgfag") {
            $(".fag_btn").eq(i).addClass("valgfag btn-success");
        } else if (jsonData.fag[i].fagtype == "udvidet") {
            $(".fag_btn").eq(i).addClass("udvidet btn-warning");
        }

        if (jsonData.fag[i].helaar == true) {
            //alert("jsonData.fag[i].helaar : " +i +  jsonData.fag[i].helaar);

            $(".fag_btn").eq(i).addClass("helaar");
        }


    }
    //$(".obligatorisk").eq(0).before("Obligatoriske fag<br/>");
    $(".flexible").eq(0).before("<br/>");

    $(".udvidet").eq(0).before("<br/>");

    //Placer SSO i sidste container:

    //$("#fag_43").appendTo($(".semester_content").eq(4)); // SSO autoplacering nu udkommenteret
    udregn_timer();
}




function udregn_timer() {

    var duplicate_fag_Array = [];
    valgfag = 0,
        kreative_fag = 0,
        obligatoriske_fag = 0,
        sso = true,
        ep = false;

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

        var udd_timer = 0;
        var su_timer = 0;


        $(this).find($(".fag_btn")).each(function(index) {


            var indeks = $(this).attr("id");
            indeks = parseInt(indeks.substring(4, indeks.length));

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
            }

            if ($(this).hasClass("valgfag")) {
                valgfag++;
            }

            if ($(this).hasClass("obligatorisk")) {
                obligatoriske_fag++;
            }



        });

        $(".su_timer").eq(index).html("SU-timer: " + su_timer);
        if (su_timer >= 23 && su_timer <= 30) {
            $(".su_timer").eq(index).addClass("btn-success");
            $(".su_timer").eq(index).removeClass("btn-danger");
        } else if (su_timer >= 30.1) {
            $(".su_timer").eq(index).addClass("btn-danger");
            $(".su_timer").eq(index).removeClass("btn-success");
        } else {
            $(".su_timer").eq(index).removeClass("btn-success");
            $(".su_timer").eq(index).removeClass("btn-danger");
        }

        totalTimer += udd_timer;

        $(".feedback").html("Uddannelsestimer: " + totalTimer + "/" + min_timer);



        if (totalTimer >= min_timer && totalTimer <= max_timer) {
            $(".timer_ok_glyph").addClass("complete_ok_glyph");
        } else {
            $(".timer_ok_glyph").removeClass("complete_ok_glyph");
        }

        //console.log(index + ": " + udd_timer);
        //console.log("Flex fag: " + kreative_fag);



        if (kreative_fag > 0) {
            $(".krea_fag_ok_glyph").addClass("complete_ok_glyph");
        } else {
            $(".krea_fag_ok_glyph").removeClass("complete_ok_glyph");
        }

        if (valgfag > 2 && valgfag < 6) {
            $(".valgfag_ok_glyph").addClass("complete_ok_glyph");
        } else {
            $(".valgfag_ok_glyph").removeClass("complete_ok_glyph");
        }

        if (valgfag > 2 && valgfag < 6) {
            $(".valgfag_ok_glyph").addClass("complete_ok_glyph");
        } else {
            $(".valgfag_ok_glyph").removeClass("complete_ok_glyph");
        }

        /* tjek obligatoriske fag */


        if ($(".semester_content > .obligatorisk").length - duplicate_fag_Array.length > 10) {
            $(".obl_fag_ok_glyph").addClass("complete_ok_glyph");
        } else {
            $(".obl_fag_ok_glyph").removeClass("complete_ok_glyph");
        }
        console.log("Num OBL: " + $(".semester_content > .obligatorisk").length + "dup: " + duplicate_fag_Array.length);

    });

    /*Check status for fag */




}

function set_height_containers() {

    //$(".semester_content").css("min-height", "300px")

    var maks_height = 0;
    var height = 0;

    //console.log("maks_height: " + maks_height);

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
    $(".semester_content").css("min-height", 110 + "px");
    $(".semester_content").css("min-height", maks_height + "px");

    //$(".semester_content").each(function(index) {

    //});

}



function nav_click(text, object) {

    var indeks = object.index(".btn-var");

    if (indeks == 3) {

        if ($(".semester_container").eq(0).is(":visible")) {
            console.log("IT IS VISIBLE!");
            $(".semester_container").eq(0).fadeOut();
            object.html("Aktiver meritfag <span class='glyphicon glyphicon-floppy-disk'></span>");
            $(".semester_container").eq(0).find(".fag_btn").appendTo(".dragzone");
        } else {
            $(".semester_container").eq(0).fadeIn();
            object.html("Deaktiver meritfag <span class='glyphicon glyphicon-floppy-disk'></span>");
        }
    }

    if (indeks == 0) {
        if (semestre < 10) {
            semestre++;
            $(".semester_container").eq(semestre).fadeIn();
        } else {
            microhint($(".knap_container"), "Du kan maksimalt arbejde med 10 semestre");
        }
        $(".semester_title").eq(11).html(jsonData.semesterdimser[semestre + 1].header + " (udvidet fagpakke)");
    }
    if (indeks == 1) {
        if (semestre > 1) {
            $(".semester_container").eq(semestre).fadeOut();
            $(".semester_container").eq(semestre).find(".fag_btn").appendTo(".dragzone");

            semestre--;
        } else {
            microhint($(".knap_container"), "Du skal have minimum 1 semester");
        }
        $(".semester_title").eq(11).html(jsonData.semesterdimser[semestre + 1].header + " (udvidet fagpakke)");
    }

    if (indeks == 2) {

        if ($(".semester_container").eq(11).is(":visible")) {
            console.log("IT IS VISIBLE!");
            $(".semester_container").eq(11).fadeOut();
            object.html("Aktiver udvidet fagpakke <span class='glyphicons glyphicons-education'></span>");
            $(".btn_exp").eq(2).fadeOut();
            $(".udvidet").fadeOut();
            $(".semester_container").eq(11).find(".fag_btn").appendTo(".dragzone");
            min_timer = 1705;
            max_timer = 1755;

        } else {

            $(".semester_container").eq(11).fadeIn();
            $(".semester_title").eq(11).html(jsonData.semesterdimser[semestre + 1].header + " (udvidet fagpakke)");
            object.html("Deaktiver udvidet fagpakke <span class='glyphicons glyphicons-education'></span>");
            $(".btn_exp").eq(2).fadeIn();
            $(".udvidet").fadeIn();
            min_timer = 1905;
            max_timer = 1955;
        }



    }
    if (indeks == 4) {
        object.html("Fjern alle fag <span class='glyphicon glyphicon-remove'></span>");
        if (autoudfyldt == false) {
            autoudfyldt = true
            autoudfyld();
        } else if (autoudfyldt == true) {
            object.html("Automatisk udfyldning <span class='glyphicon glyphicon-barcode'></span>");
            autoudfyldt = false;

            $(".fag_btn").prependTo(".dragzone");
            $(".clone").remove();
        }



    }
    udregn_timer();

}

function clicked_SU(object) {

    var parentID = object.parent().index(".semester_content");
    //var SU_timer = object.text();

    console.log("SU_timer:  " + SU_timer);
    var SU_timer = parseFloat(object.text().replace(/([^0-9\\.])/g, ""));

    if (SU_timer < 23) {

        microhint(object, SU_timer + " SU-timer er ikke nok til at opnå SU. DU skal have minimum 23 SU-timer om ugen");
    } else if (SU_timer > 30) {
        microhint(object, SU_timer + " SU-timer er for mange til hvad vi anbefaler om ugen. Prøv at flytte et fag til et andet semester.");
    } else {
        microhint(object, SU_timer + " SU-timer er et passende antal timer på en uge.");
    }
}

function clicked_btn_exp(object) {
    var indeks = object.index(".btn_exp");

    console.log("HTML: " + indeks);

    if (indeks == 0) {
        microhint(object, "Du skal have alle de obligatoriske fag for at opnå en fuld HF. Derudover skal du skrive en Større skriftlig opgave (SSO) og et Eksamensprojekt (EP)");
    } else if (indeks == 1) {
        microhint(object, "Du skal have 3-5 valgfag for at opnå en fuld HF. Derudover skal du skrive en Større skriftlig opgave (SSO) og et Eksamensprojekt (EP)");
    } else if (indeks == 2) {
        microhint(object, "Den udvidede fagpakke giver adgang til lange videregående uddannelser. Du skal vælge et valgfag der løfter fra C til B-niveau og et fag du løfter fra B til A-niveau. Fagene skal være relevante for den uddannelse du drømmer om.");
    }

}

function clicked_feedback(object) {

    var HTML = "";

    HTML += "Du skal have " + min_timer + " uddannelses-timer for at have en fuld hf. Fag du tidligere har gennemført kan placereres i meritfag. <br/>Du skal desuden placere alle de obligatoriske fag, 1 kreativt fag og 3-5 valgfag.";

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

            HTML += $(".su_timer").eq(index).html() + "%0D%0A%0D%0A";
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

function autoudfyld() {
    $(".fag_btn").appendTo(".dragzone");
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

    //$(".semester_content").eq(2).append($(".fag_btn").eq(3));
}

/*=====  End of Autoudfyld  ======*/


/*============================================
=            Sorter divs efter ID            =
============================================*/
function sortDivs() {

    console.log("sortDivs called");
    $(".dragzone .fag_btn").sort(function(a, b) {
        return parseInt(a.id) > parseInt(b.id);
    }).each(function() {
        var elem = $(this);
        elem.remove();
        $(elem).appendTo(".dragzone");
    })
}


/*=====  End of Sorter divs efter ID  ======*/
