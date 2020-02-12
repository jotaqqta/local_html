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
});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

$(document).ready(function () {

    // PARA ELIMINAR EL SUBMIT
    $("button").on("click", function () {
        return false;
    });

    $("._input_selector").inputmask("dd/mm/yyyy");

    //INGRESA LOS TITULOS
    document.title = g_tit;
    document.body.scroll = "yes";

    // Raiz
    $("#div_header").load("syn_globales/header.htm", function () {
        $("#div_mod0").html(g_modulo);
        $("#div_tit0").html(g_tit);
    });

    // COMBOS


    // Footer  // Raiz
    $("#div_footer").load("syn_globales/footer.htm");
    $("#excel_archivo").val("tablas_generales.xls");
    $("#tx_empresa").val("1");
    $("#tx_rol").val("SYNERGIA");
    $("#tx_ip").val("127.0.0.1");

    // BUTTONS ICONS

    $("#co_nuevo").html("<span class='glyphicon glyphicon-plus'></span> Nuevo");
    $("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");

    $("#co_cancelar").hide();
    $("#space-msg").hide();

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                              <-- Buttons - Listeners -->

    $("#co_leer").on("click", function () {
        if ($.trim($("#co_leer").text()) === "Leer") {

            if ($("#tx_num_sumi").val() === "") {
                fn_mensaje('#mensaje_prin', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR INGRESAR UN NUMERO DE SUMINISTRO!!! </strong></div>', 3000);
                $("#tx_num_sumi").focus();
                return;
            }

            if (!$.isNumeric($("#tx_num_sumi").val())) {
                fn_mensaje('#mensaje_prin', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR COMPROBAR EL VALOR INGRESADO!!! </strong></div>', 3000);
                $("#tx_num_sumi").focus();
                return;
            }

            if ($("#tx_num_sumi").val().includes("e") || $("#tx_num_sumi").val().includes(".") || $("#tx_num_sumi").val().includes(",") || $("#tx_num_sumi").val().includes("-") || $("#tx_num_sumi").val().includes("+")) {
                fn_mensaje('#mensaje_prin', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR COMPROBAR EL VALOR INGRESADO!!! </strong></div>', 3000);
                $("#tx_num_sumi").focus();
                return;
            }
        }

        fn_mensaje_boostrap("Se genero", g_tit, $("#co_leer"));
        $("#tx_num_sumi").prop("disabled", true);
        $("#co_leer").prop("disabled", true);
        $("#co_medidores").prop("disabled", false);
        $("#co_deuda").prop("disabled", false);
        $("#co_excel").prop("disabled", false);
        $("#co_nuevo").prop("disabled", false);
        $("#co_cancelar").show();
        $("#co_cerrar").hide();

    });

    $("#co_guardar").on( "click", function () {

        if ($.trim($("#co_guardar").text()) === "Guardar") {

            if ($("#cb_tipo_susp").val() === "") {
                fn_mensaje('#mensaje_new', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR SELECCIONE UN TIPO DE SUSPENCIÓN!!! </strong></div>', 3000);
                $("#cb_tipo_susp").focus();
                return;
            }

            if ($("#cb_motiv_susp").val() === "") {
                fn_mensaje('#mensaje_new', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR SELECCIONE UN MOTIVO DE SUSPENCIÓN!!! </strong></div>', 3000);
                $("#cb_motiv_susp").focus();
                return;
            }

            if ($("#cb_tipo_plazo").val() === "") {
                fn_mensaje('#mensaje_new', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR SELECCIONE UN TIPO DE PLAZO!!! </strong></div>', 3000);
                $("#cb_tipo_plazo").focus();
                return;
            }

            if ($("#tx_cant_dias").val() === "") {
                fn_mensaje('#mensaje_new', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR INDIQUE LA CANTIDAD DE DÍAS!!! </strong></div>', 3000);
                $("#tx_cant_dias").focus();
                return;
            }

            if (!$.isNumeric($("#tx_cant_dias").val())) {
                fn_mensaje('#mensaje_new', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR COMPROBAR EL VALOR INGRESADO!!! </strong></div>', 3000);
                $("#tx_num_sumi").focus();
                return;
            }

            if ($("#tx_cant_dias").val().includes("e") || $("#tx_cant_dias").val().includes(".") || $("#tx_cant_dias").val().includes(",") || $("#tx_cant_dias").val().includes("-") || $("#tx_cant_dias").val().includes("+")) {
                fn_mensaje('#mensaje_new', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR COMPROBAR EL VALOR INGRESADO!!! </strong></div>', 3000);
                $("#tx_cant_dias").focus();
                return;
            }

            fn_mensaje_boostrap("Se genero", g_tit, $("#co_consultar"));
            $("#div_prin").slideDown();
            $("#div_new_bts").slideUp();
            $('#div_new_bts').modal('hide');
            $(window).scrollTop(0);
        }
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

    $("#co_deuda").on("click", function () {

        fn_mensaje_boostrap("Evento funcionando", g_tit, $("#co_consultar"));
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

    $("#co_volver").on( "click", function () {
        $("#div_second").hide();
        $("#div_prin").show();
    });



//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

    $("#co_excel").on("click", function (e) {

        e.preventDefault();
        var col_model = $("#div_grid_principal").pqGrid("option", "colModel");
        var cabecera = "";
        for (i = 0; i < col_model.length; i++) {
            if (col_model[i].hidden !== true) cabecera += "<th>" + col_model[i].title + "</th>";
        }
        $("#excel_cabecera").val(cabecera);
        var element = $grid_principal.pqGrid("option", "dataModel.data");
        if (element)
            a = element.length;
        else
            a = 0;
        if (a > 0) {
            $("#tituloexcel").val(g_tit);
            $("#sql").val(sql_grid_prim);
            $("#frm_Exel").submit();
            return;
        }
    });

});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                                  <-- Modales -->


//                                  <-- Combos -->

function fn_tipo_susp(){

    $("#cb_tipo_susp").html("<option value='' selected></option><option value='1'>CORTE</option> <option value='2' >OPCIÓN 02</option>  <option value='3' >OPCIÓN 03</option>");
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

function fn_deshabilitar() {

    $("#co_medidores").prop("disabled", true);
    $("#co_deuda").prop("disabled", true);
    $("#co_excel").prop("disabled", true);
    $("#co_nuevo").prop("disabled", true);
}

function fn_mensaje(id, mensaje, segundos) {

    if (id === "#mensaje_prin") {
        $(id).show();
        $(id).html(mensaje);
        setTimeout(function () { $(id).html(""); $(id).hide() }, segundos);

        $("#space-msg").show();
        setTimeout(function () { $("#space-msg").hide() }, segundos);
    } else if (id === "#mensaje_new") {
        $(id).show();
        $(id).html(mensaje);
        setTimeout(function () {$(id).html("");$(id).hide() }, segundos);
    }

}


