var g_modulo = "Corte y Reposición";
var g_tit = "Extractor de Morosidad";
var $grid_principal;
var sql_grid_prim = "";
var my_url = "anul_carg_cort_repo";
var parameters = {};

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

$(document).keydown(function (e) {

    if (e.keyCode === 8) {
        var element = e.target.nodeName.toLowerCase();
        if ((element !== 'input' && element !== 'textarea') || $(e.target).attr("readonly")) {
            return false;
        }
    }
});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

$(document).ready(function () {

    // PARA ELIMINAR EL SUBMIT
    $("button").on("click", function () { return false; });
    //INGRESA LOS TITULOS
    document.title = g_tit;
    document.body.scroll = "yes";
    // Raiz
    $("#div_header").load("syn_globales/header.htm", function () {
        $("#div_mod0").html(g_modulo);
        $("#div_tit0").html(g_tit);
    });

    // COMBOS

    fn_cent_opera();
    fn_state_opera();

    // Footer  // Raiz
    $("#div_footer").load("syn_globales/footer.htm");
    $("#excel_archivo").val("tablas_generales.xls");
    $("#tx_empresa").val("1");
    $("#tx_rol").val("SYNERGIA");
    $("#tx_ip").val("127.0.0.1");

    fn_tab_event();
    fn_radio_change();
    fn_disable_buttons();

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                              <-- Buttons - Listeners -->

    $("#tab_extrac_gen_batch").on( "click", function () {

        fn_tab_event("#tab_extrac_gen_batch", "#div_gen_batch")
    });

    $("#tab_extrac_env_avi").on( "click", function () {

        fn_tab_event("#tab_extrac_env_avi", "#div_env_avi")
    });

    $("#tab_extrac_gen_onl").on( "click", function () {

        fn_tab_event("#tab_extrac_gen_onl", "#div_gen_onl")
    });

    $('input[type=radio][name=opt_antiguedad]').change(function() {

        fn_radio_change("opt_antiguedad", this.value);
    });

    $('input[type=radio][name=opt_sector]').change(function() {

        fn_radio_change("opt_sector", this.value);
    });

    $("#co_nuevo").on( "click", function () {

        fn_limpiar();

        $("#co_actualizar").prop( "disabled", false);

    });

    $("#co_anterior").on( "click", function () {

        // DO SOMETHING

    });

    $("#co_siguiente").on( "click", function () {

        // DO SOMETHING

    });

    $("#co_actualizar").on( "click", function () {

        // DO SOMETHING

    });

    $("#co_eliminar").on( "click", function () {

        // DO SOMETHING

    });

    $("#co_limpiar").on( "click", function () {
        fn_limpiar("file");
    });

    $("#co_cerrar").on("click", function (){ window.close(); });

});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                                  <-- Combos -->

function fn_cent_opera(){

    $("#cb_cent_opera").html("<option value='' selected></option><option value='1'>OPCIÓN 01</option> <option value='2' >OPCIÓN 02</option>  <option value='3' >OPCIÓN 03</option>");
}

function fn_state_opera(){

    $("#cb_state_opera").html("<option value='' selected></option><option value='1'>TODOS</option> <option value='2' >OPCIÓN 02</option>  <option value='3' >OPCIÓN 03</option>");
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                                  <-- Functions -->

function fn_radio_change(radio, value) {

    if (radio === "opt_antiguedad") {
        if (value === "opt_2") {
            $("#tx_desde").prop( "disabled", false);
            $("#tx_hasta").prop( "disabled", false);
        } else if (value === "opt_1") {
            $("#tx_desde").prop( "disabled", true);
            $("#tx_hasta").prop( "disabled", true);

            $("#tx_desde").val("");
            $("#tx_hasta").val("");
        }
    }

    if (radio === "opt_sector") {
        if (value === "opt_2") {
            $("#tx_desde_sector").prop( "disabled", false);
            $("#tx_hasta_sector").prop( "disabled", false);
        } else if (value === "opt_1") {
            $("#tx_desde_sector").prop( "disabled", true);
            $("#tx_hasta_sector").prop( "disabled", true);

            $("#tx_desde_sector").val("");
            $("#tx_hasta_sector").val("");
        }
    }

    if (radio === undefined) {
        $("input[name=opt_tipo_moro][value='opt_1']").prop('checked', true);
        $("input[name=opt_antiguedad][value='opt_1']").prop('checked', true);
        $("input[name=opt_sector][value='opt_1']").prop('checked', true);

        $("#tx_desde").prop( "disabled", true);
        $("#tx_hasta").prop( "disabled", true);

        $("#tx_desde_sector").prop( "disabled", true);
        $("#tx_hasta_sector").prop( "disabled", true);

        $("#tx_desde").val("");
        $("#tx_hasta").val("");

        $("#tx_desde_sector").val("");
        $("#tx_hasta_sector").val("");
    }

}

function fn_tab_event(tab, div) {

    // Hide and remove Active

    if ($("#tab_extrac_gen_batch").hasClass("active") || $("#div_gen_batch").is(":visible")) {

        $("#tab_extrac_gen_batch").removeClass("active");
        $("#div_gen_batch").hide();
    }

    if ($("#tab_extrac_env_avi").hasClass("active") || $("#div_env_avi").is(":visible")) {

        $("#tab_extrac_env_avi").removeClass("active");
        $("#div_env_avi").hide();
    }

    if ($("#tab_extrac_gen_onl").hasClass("active") || $("#div_gen_onl").is(":visible")) {

        $("#tab_extrac_gen_onl").removeClass("active");
        $("#div_gen_onl").hide();
    }

    // Show and set Active

    if (tab !== undefined && div !== undefined) {
        $(tab).addClass("active");
        $(div).show();
    } else {
        $("#tab_extrac_gen_batch").addClass("active");
        $("#div_gen_batch").show();
    }

}

function fn_disable_buttons() {

    $('#co_anterior').prop( "disabled", true );
    $('#co_siguiente').prop( "disabled", true );
    $('#co_actualizar').prop( "disabled", true );
    $('#co_eliminar').prop( "disabled", true );

}

function fn_limpiar(type) {

    if (type === "file") {
        $("#input_file").val("");
    } else {
        $("#tx_num_secuen").val("");
        $("#cb_cent_opera").val("");
        $("#cb_state_opera").val("");
        $("#tx_deuda_inicial").val("");
        $("#tx_deuda_final").val("");

        fn_radio_change();
    }
}

function fn_mensaje(id,mensaje,segundos) {

    $(id).show();
    $(id).html(mensaje);
    setTimeout(function(){$(id).html("");$(id).hide(); }, segundos);
}


