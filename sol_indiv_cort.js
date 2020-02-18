var g_modulo = "Corte y Reposición";
var g_tit = "Solicitud Individual de Corte";
var $grid_principal;
var sql_grid_prim = "";
var my_url = "sel_masiv_client_afect_cort";
var parameters = {};
var rowIndxG;

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
    $(".number").inputmask("integer");

    // Raiz
    $("#div_header").load("syn_globales/header.htm", function () {
        $("#div_mod0").html(g_modulo);
        $("#div_tit0").html(g_tit);
    });

    // COMBOS

    fn_ins_cort();
    fn_motivo();

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

            if ($("#cb_inst_cort").val() === "") {
                fn_mensaje_boostrap("FAVOR SELECCIONAR UNA INSTANCIA DE CORTE", g_tit, $("#cb_inst_cort"));
                return;
            }

            if ($("#tx_fech_soli_real").val() === "") {
                fn_mensaje_boostrap("FAVOR INDIQUE UNA FECHA DE SOLICITUD REAL", g_tit, $("#tx_fech_soli_real"));
                return;
            }

            if ($("#tx_fech_soli_real_h").val() === "") {
                fn_mensaje_boostrap("FAVOR INDIQUE UNA HORA", g_tit, $("#tx_fech_soli_real_h"));
                return;
            }

            if ($("#tx_fech_soli_real_m").val() === "") {
                fn_mensaje_boostrap("FAVOR INDIQUE MINUTOS", g_tit, $("#tx_fech_soli_real_m"));
                return;
            }

            if ($("#cb_motivo").val() === "") {
                fn_mensaje_boostrap("FAVOR SELECCIONAR UN MOTIVO", g_tit, $("#cb_motivo"));
                return;
            }

            if ($("#tx_fech_notif").val() === "") {
                fn_mensaje_boostrap("FAVOR INDIQUE UNA FECHA DE NOTIFICACIÓN", g_tit, $("#tx_fech_notif"));
                return;
            }

            if ($("#tx_fech_notif_h").val() === "") {
                fn_mensaje_boostrap("FAVOR INDIQUE UNA HORA", g_tit, $("#tx_fech_notif_h"));
                return;
            }

            if ($("#tx_fech_notif_m").val() === "") {
                fn_mensaje_boostrap("FAVOR INDIQUE MINUTOS", g_tit, $("#tx_fech_notif_m"));
                return;
            }

            if ($("#tx_observacion").val() === "") {
                fn_mensaje_boostrap("FAVOR INDIQUE UNA OBSERVACIÓN", g_tit, $("#tx_observacion"));
                return;
            }
        }

        fn_mensaje_boostrap("Boton funcionando", g_tit, $("#co_ingresar"));

    });

    $("#co_cancel").on("click", function (){
        $('#div_new_bts').modal('hide');
    });

    $("#co_medidores").on("click", function () {

        $("#div_medidores_bts").modal({backdrop: "static",keyboard:false});
        $("#div_medidores_bts").on("shown.bs.modal", function () {
            $("#div_medidores_bts div.modal-footer button").focus();
        });
    });

    $("#tx_fech_soli_real_h").blur(function () {
        if ($("#tx_fech_soli_real_h").val() >= 24) {
            $("#tx_fech_soli_real_h").val("24");
        }

        if ($("#tx_fech_soli_real_h").val() < 0) {
            $("#tx_fech_soli_real_h").val("0");
        }
    });

    $("#tx_fech_notif_h").blur(function () {
        if ($("#tx_fech_notif_h").val() >= 24) {
            $("#tx_fech_notif_h").val("24");
        }

        if ($("#tx_fech_notif_h").val() < 0) {
            $("#tx_fech_notif_h").val("0");
        }
    });

    $("#tx_fech_soli_real_m").blur(function () {
        if ($("#tx_fech_soli_real_m").val() >= 60) {
            $("#tx_fech_soli_real_m").val("59");
        }

        if ($("#tx_fech_soli_real_m").val() < 0) {
            $("#tx_fech_soli_real_m").val("0");
        }
    });

    $("#tx_fech_notif_m").blur(function () {
        if ($("#tx_fech_notif_m").val() >= 60) {
            $("#tx_fech_notif_m").val("59");
        }

        if ($("#tx_fech_notif_m").val() < 0) {
            $("#tx_fech_notif_m").val("0");
        }
    });

    $("#co_cerrar_med").on("click", function () {

        $('#div_medidores_bts').modal('hide');
    });


    $("#co_deuda").on("click", function () {

        fn_mensaje_boostrap("Evento funcionando", g_tit, $("#co_deuda"));
    });

    $("#co_cancelar").on("click", function () {

        fn_limpiar();
        fn_deshabilitar();

        $("#tx_num_sumi").prop("disabled", false);
        $("#co_leer").prop("disabled", false);
        $("#co_cancelar").hide();
        $("#co_cerrar").show();
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

function fn_ins_cort(){

    $("#cb_inst_cort").html("<option value='' selected></option><option value='1'>OPCIÓN 01</option> <option value='2' >OPCIÓN 02</option>  <option value='3' >OPCIÓN 03</option>");
}

function fn_motivo(){

    $("#cb_motivo").html("<option value='' selected></option><option value='1'>OPCIÓN 01</option> <option value='2' >OPCIÓN 02</option>  <option value='3' >OPCIÓN 03</option>");
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                                  <-- Functions -->

function fn_limpiar() {

        $("#tx_nombre").val("");
        $("#tx_direcc_sumi").val("");
        $("#tx_cent_opera").val("");
        $("#tx_ruta").val("");
        $("#tx_tipo_sumin").val("");
        $("#tx_categoria").val("");
        $("#tx_servicio").val("");
        $("#tx_estado").val("");

}

function fn_leer() {

    if ($.trim($("#co_leer").text()) === "Leer") {

        if ($("#tx_num_sumi").val() === "") {
            fn_mensaje_boostrap("POR FAVOR INDIQUE UN NUMERO DE SUMINISTRO", g_tit, $("#tx_num_sumi"));
            return;
        }

        if ($("#tx_num_sumi").val().includes("-")) {
            fn_mensaje_boostrap("POR FAVOR VERIFIQUE EL NUMERO INGRESADO", g_tit, $("#tx_num_sumi"));
            return;
        }
    }

    fn_mensaje_boostrap("Se genero", g_tit, $("#co_leer"));
    $("#tx_num_sumi").prop("disabled", true);
    $("#co_leer").prop("disabled", true);
    $("#co_ingresar").prop("disabled", false);
    $("#co_medidores").prop("disabled", false);
    $("#co_deuda").prop("disabled", false);
    $("#co_excel").prop("disabled", false);
    $("#co_nuevo").prop("disabled", false);

    $('input[type=radio][name=opt_val_ord]').attr('disabled', false);
    $("#cb_inst_cort").prop("disabled", false);
    $("#cb_motivo").prop("disabled", false);
    $("#tx_fech_soli_real").prop("disabled", false);
    $("#tx_fech_soli_real_h").prop("disabled", false);
    $("#tx_fech_soli_real_m").prop("disabled", false);
    $("#tx_fech_notif").prop("disabled", false);
    $("#tx_fech_notif_h").prop("disabled", false);
    $("#tx_fech_notif_m").prop("disabled", false);
    $("#tx_observacion").prop("disabled", false);

    $("#co_cancelar").show();
    $("#co_cerrar").hide();
}

function fn_deshabilitar() {

    $("#co_medidores").prop("disabled", true);
    $("#co_deuda").prop("disabled", true);
    $("#co_excel").prop("disabled", true);
    $("#co_nuevo").prop("disabled", true);
    $("#co_ingresar").prop("disabled", true);

    $('input[type=radio][name=opt_val_ord]').attr('disabled', true);
    $("#cb_inst_cort").prop("disabled", true);
    $("#cb_motivo").prop("disabled", true);
    $("#tx_fech_soli_real").prop("disabled", true);
    $("#tx_fech_soli_real_h").prop("disabled", true);
    $("#tx_fech_soli_real_m").prop("disabled", true);
    $("#tx_fech_notif").prop("disabled", true);
    $("#tx_fech_notif_h").prop("disabled", true);
    $("#tx_fech_notif_m").prop("disabled", true);
    $("#tx_observacion").prop("disabled", true);


}

function fn_mensaje(id, mensaje, segundos) {

        $(id).show();
        $(id).html(mensaje);
        setTimeout(function () {$(id).html("");$(id).hide() }, segundos);
}


