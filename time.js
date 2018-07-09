var min_timer = 1705;
var max_timer = 1755;

var semestre = 4;


$(document).ready(function() {


    $('.instr_container').html(instruction_noLines("Vælg fag til hvert semester for at opnå en fuld HF")); // Tilføjet af THAN d. 02/01-2018.

    init();


    console.log(jsonData);

    $(".btn-var").click(function() {
        nav_click($(this).html());
    })

    $(".fag_btn").click(function() {
        var indeks = $(this).attr("id");
        indeks = parseInt(indeks.substring(4, indeks.length));
        microhint($(this), jsonData.fag[indeks].text + ":<br/>Uddannelsestimer: " + jsonData.fag[indeks].udd_timer + "<br/>SU-timer: " + jsonData.fag[indeks].su_timer);
    })

    $(".semester_content, .dragzone").droppable({

        accept: ".fag_btn",
        tolerance: "touch",
        drop: function(e, ui) {

            if ($(this).hasClass("semester_content")) {
                ui.draggable.addClass("dropped")
            } else { ui.draggable.removeClass("dropped") }
            $(this).append(ui.draggable);
            $(this).find(".draggable").css({

                top: 0,
                left: 0,
                margin: "4px",
                //width: $(this).width() + "px"
            });

            udregn_timer();
            set_height_containers();




            var this_id = ui.draggable.attr('class').split(" ")[0];

            var id_length = $("." + this_id).length;

            console.log("id_length: " + id_length);


            if ($(this).hasClass("semester_content") && id_length < 2) {

                if (ui.draggable.hasClass("helaar")) {

                    console.log("FG BTN: " + ui.draggable.index(".fag_btn"));



                    microhint(ui.draggable, "Du har placeret et fag som kan tages både halv og helårligt. Træk det samme fag op i et andet semester for at tage det over et helt år.")
                    var klon = ui.draggable.clone().appendTo(".dragzone"); //insertBefore("#fag_1");//prependTo(".dragzone");
                    klon.fadeOut(0).fadeIn(1000);
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


            $(".flexible").each(function(index){
                if ($(this).hasClass("dropped")){

                    flexible_dropped ++
                }
            });

            if (flexible_dropped > 0){
                $(".flexible").removeClass("obligatorisk btn-primary")
                $(".flexible").addClass("valgfag btn-success");
            }else{
                $(".flexible").addClass("obligatorisk btn-primary")
                $(".flexible").removeClass("valgfag btn-success");
            }

console.log("hej");


        }





    });

    //$(".dragzone").droppable({});

    $(".draggable").draggable({
        revert: "invalid",
        start: function() {
            $(".microhint").remove();
        }
    });






});


function init() {

    /* lav knapperne */

    for (var i = 0; i < jsonData.knapper.length; i++) {
        $(".knap_container").append("<button class='btn btn-info btn-var'>" + jsonData.knapper[i].tekst + "</button>");
    }

    /* lav containere */

    for (var i = 0; i < jsonData.semesterdimser.length; i++) {
        $("#semester_app").append("<div class ='semester_container col-lg-3 col-md-4 col-sm-6 col-xs-12'><div class='semester_content '><div class='semester_title'>" + jsonData.semesterdimser[i].header + "</div> <div class='time_count btn btn-xs'> SU timer: 0 </div> </div> </div>")

        if (i < 1) {
            $(".semester_container").eq(i).hide();

        } else if (i > 4) {
            $(".semester_container").eq(i).hide();
        }
    }




    /*lav fag_draggables */

    for (var i = 0; i < jsonData.fag.length; i++) {
        console.log("I: " + i);
        $(".dragzone").append("<span id ='fag_" + i + "' class='fag_" + i + " btn btn-xs draggable fag_btn'>" + jsonData.fag[i].text + "</span"); //(<span class='num'>" + jsonData.fag[i].udd_timer + "/" + jsonData.fag[i].su_timer + "</span>)</span>");
        if (jsonData.fag[i].obligatorisk == true) {
            $(".fag_btn").eq(i).addClass("obligatorisk btn-primary");
        } else if (jsonData.fag[i].obligatorisk == "flexible") {
            $(".fag_btn").eq(i).addClass("obligatorisk btn-primary flexible");
        } else {
            $(".fag_btn").eq(i).addClass("valgfag btn-success");
        }

        if (jsonData.fag[i].helaar == true) {
            $(".fag_btn").addClass("helaar");
        }


    }
}




function udregn_timer() {

    var duplicate_fag_Array = [];

    /* ER der placeret flere af samme fag?? */

    $("#semester_app").find(".fag_btn").each(function(index) {

        var num_class = $(this).attr("class").split(" ")[0];

        var fagbtns_placeret = $("#semester_app").find("." + num_class).length;

        if (fagbtns_placeret > 1 && duplicate_fag_Array.indexOf(num_class) < 0) {
            duplicate_fag_Array.push(num_class);
        }

    })

    console.log("duplicate_fag_Array: " + duplicate_fag_Array)



    var totalTimer = 0;



    $(".semester_content").each(function(index) {
        if (semestre >= index) {
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
                console.log("timer: " + timer + ", SU-timer: " + su_timer);

                udd_timer += timer;

            });

            $(".time_count").eq(index).html("SU-timer:" + su_timer);
            if (su_timer >= 23 && su_timer <= 26) {
                $(".time_count").eq(index).addClass("btn-success");
                $(".time_count").eq(index).removeClass("btn-danger");
            } else if (su_timer >= 26) {
                $(".time_count").eq(index).addClass("btn-danger");
                $(".time_count").eq(index).removeClass("btn-success");
            } else {
                $(".time_count").eq(index).removeClass("btn-success");
                $(".time_count").eq(index).removeClass("btn-danger");
            }

            totalTimer += udd_timer;

            $(".feedback").html("Uddannelsestimer:" + totalTimer);

            if (totalTimer >= min_timer && totalTimer <= max_timer) {
                $(".feedback").addClass("btn btn-success");
            } else {
                $(".feedback").removeClass("btn btn-success");
            }

            console.log(index + ": " + udd_timer);
        }
    });


}

function set_height_containers() {

    var maks_height = 0;

    //console.log("maks_height: " + maks_height);

    $(".semester_content").each(function(index) {

        var height = $(this).css("height");
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


    $(".semester_content").each(function(index) {
        //$(".semester_content").eq(4).css("height", maks_height + "px");
    });

}


function nav_click(text) {


    if (text == "Merit") {
        $(".semester_container").eq(0).fadeToggle();
    }

    if (text == "Tilføj semester") {
        if (semestre < 10) {
            semestre++;
            $(".semester_container").eq(semestre).fadeIn();
        } else {
            microhint($(".knap_container"), "Du kan maksimalt arbejde med 10 semestre");
        }
    }
    if (text == "Fjern semester") {
        if (semestre > 1) {
            $(".semester_container").eq(semestre).fadeOut();
            semestre--;
        } else {
            microhint($(".knap_container"), "Du skal have minimum 1 semester");
        }
    }

    if (text == "Udvidet fagpakke") {
        $(".semester_container").eq(7).fadeToggle();

    }
    udregn_timer();

}
