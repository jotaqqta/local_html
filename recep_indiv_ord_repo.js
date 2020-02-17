var g_modulo = "Corte y Reposición";
var g_tit = "Recepción individual de ordenes de reposición";
var $grid_principal;
var sql_grid_prim = "";
var my_url = "sel_masiv_client_afect_cort";
var parameters = {};

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

$(document).keydown(function (e) {

    if (e.keyCode === 8) {
        var element = e.target.nodeName.toLowerCase();
        if ((element !== 'input' && element !== 'textarea') || $(e.target).attr("readonly")) {
            return false;
        }
    }

    if (e.keyCode === 13 && $("#tx_num_sumi").val() !== "" && $("#tx_num_sumi").is(":enabled")) {
        fn_leer();
    }
});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

$(document).ready(function () {

    // PARA ELIMINAR EL SUBMIT
    $("button").on("click", function () {
        return false;
    });

    //INGRESA LOS TITULOS
    document.title = g_tit;
    document.body.scroll = "yes";

    $("._input_selector").inputmask("dd/mm/yyyy");

    // Raiz
    $("#div_header").load("syn_globales/header.htm", function () {
        $("#div_mod0").html(g_modulo);
        $("#div_tit0").html(g_tit);
    });

    // COMBOS

    fn_diametro_conex();
    fn_situa_econ();
    fn_acc_realizada();
    fn_ejecutor();

    fn_deshabilitar();

    // Footer  // Raiz
    $("#div_footer").load("syn_globales/footer.htm");
    $("#excel_archivo").val("tablas_generales.xls");
    $("#tx_empresa").val("1");
    $("#tx_rol").val("SYNERGIA");
    $("#tx_ip").val("127.0.0.1");

    $('input[type=radio][name=opt_val_ord]').filter('[value="opt_2"]').attr('checked', true);

    $("#co_cancelar").hide();

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                              <-- Buttons - Listeners -->

    $("#co_leer").on("click", function () {

        fn_leer();

    });

    $("#co_ingresar").on("click", function () {

        if ($.trim($("#co_ingresar").text()) === "Ingresar") {

            if ($("#tx_lectura").val() === "") {
                fn_mensaje_boostrap("FAVOR INDIQUE UNA LECTURA", g_tit, $("#tx_lectura"));
                return;
            }

            if (!$.isNumeric($("#tx_lectura").val())) {
                fn_mensaje_boostrap("POR FAVOR VERIFIQUE EL NUMERO DE LECTURA INGRESADO", g_tit, $("#tx_lectura"));
                return;
            }

            if ($("#tx_lectura").val().includes("e") || $("#tx_lectura").val().includes("E") || $("#tx_lectura").val().includes(".") || $("#tx_lectura").val().includes(",") || $("#tx_lectura").val().includes("-") || $("#tx_lectura").val().includes("+")) {
                fn_mensaje_boostrap("POR FAVOR VERIFIQUE EL NUMERO DE LECTURA INGRESADO", g_tit, $("#tx_lectura"));
                return;
            }

            if ($("#cb_diametro_conex").val() === "") {
                fn_mensaje_boostrap("FAVOR SELECCIONAR UN DIAMETRO DE CONEXIÓN", g_tit, $("#cb_diametro_conex"));
                return;
            }

            if ($("#cb_situacion_encont").val() === "") {
                fn_mensaje_boostrap("FAVOR SELECCIONE UNA SITUACIÓN ENCONTRADA", g_tit, $("#cb_situacion_encont"));
                return;
            }

            if ($("#cb_acc_realizada").val() === "") {
                fn_mensaje_boostrap("FAVOR SELECCIONE UNA ACCIÓN REALIZADA", g_tit, $("#cb_acc_realizada"));
                return;
            }

            if ($("#tx_fech_eje_real").val() === "") {
                fn_mensaje_boostrap("FAVOR INDIQUE UNA FECHA DE EJECUCIÓN REAL", g_tit, $("#tx_fech_eje_real"));
                return;
            }

            if ($("#tx_fech_eje_real_h").val() === "") {
                fn_mensaje_boostrap("FAVOR INDIQUE LAS HORAS", g_tit, $("#tx_fech_eje_real_h"));
                return;
            }

            if ($("#tx_fech_eje_real_m").val() === "") {
                fn_mensaje_boostrap("FAVOR INDIQUE LOS MINUTOS", g_tit, $("#tx_fech_eje_real_m"));
                return;
            }

            if ($("#cb_ejecutor").val() === "") {
                fn_mensaje_boostrap("FAVOR SELECCIONE UN EJECUTOR", g_tit, $("#cb_ejecutor"));
                return;
            }

            if ($("#tx_observacion_terreno").val() === "") {
                fn_mensaje_boostrap("FAVOR INDIQUE UNA OBSERVACIÓN", g_tit, $("#tx_observacion_terreno"));
                return;
            }
        }

        fn_mensaje_boostrap("Boton funcionando", g_tit, $("#co_ingresar"));

    });

    $("#co_cancel").on("click", function (){
        $('#div_new_bts').modal('hide');
    });

    $("#tx_fech_eje_real_h").blur(function () {
        if ($("#tx_fech_eje_real_h").val() >= 24) {
            $("#tx_fech_eje_real_h").val("24");
        }
    });

    $("#tx_fech_eje_real_m").blur(function () {
        if ($("#tx_fech_eje_real_m").val() >= 60) {
            $("#tx_fech_eje_real_m").val("59");
        }
    });

    $("#co_cancelar").on("click", function () {

        fn_limpiar();
        fn_deshabilitar();

        $("#tx_num_ord").prop("disabled", false);
        $("#tx_num_sumi").prop("disabled", false);
        $("#co_leer").prop("disabled", false);
        $("#co_cancelar").hide();
        $("#co_cerrar").show();

        $("#tx_num_ord").focus();

    });

    $("#co_cerrar").on("click", function () {
        window.close();
    });

});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                                  <-- Grids -->

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                                  <-- Modales -->


//                                  <-- Combos -->

function fn_diametro_conex(){

    $("#cb_diametro_conex").html("<option value='' selected></option><option value='1'>OPCIÓN 01</option> <option value='2' >OPCIÓN 02</option>  <option value='3' >OPCIÓN 03</option>");
}

function fn_situa_econ(){

    $("#cb_situacion_encont").html("<option value='' selected></option><option value='1'>OPCIÓN 01</option> <option value='2' >OPCIÓN 02</option>  <option value='3' >OPCIÓN 03</option>");
}

function fn_acc_realizada(){

    $("#cb_acc_realizada").html("<option value='' selected></option><option value='1'>OPCIÓN 01</option> <option value='2' >OPCIÓN 02</option>  <option value='3' >OPCIÓN 03</option>");
}

function fn_ejecutor(){

    $("#cb_ejecutor").html("<option value='' selected></option><option value='1'>OPCIÓN 01</option> <option value='2' >OPCIÓN 02</option>  <option value='3' >OPCIÓN 03</option>");
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                                  <-- Functions -->

function fn_limpiar() {

    $("#tx_num_ord").val("");
    $("#tx_num_sumi").val("");

    $("#tx_oficina").val("");
    $("#tx_fech_soli").val("");
    $("#tx_nombre").val("");
    $("#tx_direcc_sumi").val("");
    $("#tx_distrito").val("");
    $("#tx_corregimiento").val("");
    $("#tx_ruta").val("");
    $("#tx_tarifa").val("");
    $("#tx_motivo").val("");
    $("#tx_formulario").val("");
    $("#tx_observacion").val("");

    $("#tx_numero_med").val("");
    $("#tx_marca").val("");
    $("#tx_modelo").val("");
    $("#tx_lectura").val("");
    $("#cb_diametro_conex").val("");
    $("#cb_situacion_encont").val("");
    $("#cb_acc_realizada").val("");
    $("#tx_fech_eje_real").val("");
    $("#tx_fech_eje_real_h").val("");
    $("#tx_fech_eje_real_m").val("");
    $("#cb_ejecutor").val("");
    $("#tx_observacion_terreno").val("");

}

function fn_leer() {

    if ($.trim($("#co_leer").text()) === "Leer") {

        if ($("#tx_num_ord").val() === "" && $("#tx_num_sumi").val() === "") {
            fn_mensaje_boostrap("POR FAVOR INDIQUE UN NUMERO DE ORDEN / SUMINISTRO", g_tit, $("#tx_num_ord"));
            return;
        }

        if ($("#tx_num_ord").val() !== "" && !$.isNumeric($("#tx_num_ord").val())) {
            fn_mensaje_boostrap("POR FAVOR VERIFIQUE EL NUMERO DE ORDEN INGRESADO", g_tit, $("#tx_num_ord"));
            return;
        }

        if ($("#tx_num_ord").val() !== "" && $("#tx_num_ord").val().includes("e") || $("#tx_num_ord").val().includes("E") || $("#tx_num_ord").val().includes(".") || $("#tx_num_ord").val().includes(",") || $("#tx_num_ord").val().includes("-") || $("#tx_num_ord").val().includes("+")) {
            fn_mensaje_boostrap("POR FAVOR VERIFIQUE EL NUMERO DE ORDEN INGRESADO", g_tit, $("#tx_num_ord"));
            return;
        }

        if ($("#tx_num_sumi").val() !== "" && !$.isNumeric($("#tx_num_sumi").val())) {
            fn_mensaje_boostrap("POR FAVOR VERIFIQUE EL NUMERO DE SUMINISTRO INGRESADO", g_tit, $("#tx_num_sumi"));
            return;
        }

        if ($("#tx_num_sumi").val() !== "" && $("#tx_num_sumi").val().includes("e") || $("#tx_num_sumi").val().includes("E") || $("#tx_num_sumi").val().includes(".") || $("#tx_num_sumi").val().includes(",") || $("#tx_num_sumi").val().includes("-") || $("#tx_num_sumi").val().includes("+")) {
            fn_mensaje_boostrap("POR FAVOR VERIFIQUE EL NUMERO DE SUMINISTRO INGRESADO", g_tit, $("#tx_num_sumi"));
            return;
        }
    }

    fn_mensaje_boostrap("Se genero", g_tit, $("#co_leer"));
    $("#tx_num_ord").prop("disabled", true);
    $("#tx_num_sumi").prop("disabled", true);
    $("#co_leer").prop("disabled", true);
    $("#co_ingresar").prop("disabled", false);

    $("#tx_numero_med").prop("disabled", false);
    $("#tx_marca").prop("disabled", false);
    $("#tx_modelo").prop("disabled", false);
    $("#tx_lectura").prop("disabled", false);
    $("#cb_diametro_conex").prop("disabled", false);
    $("#cb_situacion_encont").prop("disabled", false);
    $("#cb_acc_realizada").prop("disabled", false);
    $("#tx_fech_eje_real").prop("disabled", false);
    $("#tx_fech_eje_real_h").prop("disabled", false);
    $("#tx_fech_eje_real_m").prop("disabled", false);
    $("#cb_ejecutor").prop("disabled", false);
    $("#tx_observacion_terreno").prop("disabled", false);

    $("#co_cancelar").show();
    $("#co_cerrar").hide();
}

function fn_deshabilitar() {

    $("#co_ingresar").prop("disabled", true);

    $("#tx_numero_med").prop("disabled", true);
    $("#tx_marca").prop("disabled", true);
    $("#tx_modelo").prop("disabled", true);
    $("#tx_lectura").prop("disabled", true);
    $("#cb_diametro_conex").prop("disabled", true);
    $("#cb_situacion_encont").prop("disabled", true);
    $("#cb_acc_realizada").prop("disabled", true);
    $("#tx_fech_eje_real").prop("disabled", true);
    $("#tx_fech_eje_real_h").prop("disabled", true);
    $("#tx_fech_eje_real_m").prop("disabled", true);
    $("#cb_ejecutor").prop("disabled", true);
    $("#tx_observacion_terreno").prop("disabled", true);


}

function fn_mensaje(id, mensaje, segundos) {

    $(id).show();
    $(id).html(mensaje);
    setTimeout(function () {$(id).html("");$(id).hide() }, segundos);
}


