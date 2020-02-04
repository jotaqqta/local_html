var g_modulo = "Corte y Reposición";
var g_tit = "Mantención de Parámetros Por Centro Operativo";

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
    fn_evento();
    fn_inst_corte();
    fn_tipo_agrup();

    // Footer  // Raiz
    $("#div_footer").load("syn_globales/footer.htm");
    $("#excel_archivo").val("tablas_generales.xls");
    $("#tx_empresa").val("1");
    $("#tx_rol").val("SYNERGIA");
    $("#tx_ip").val("127.0.0.1");

    // OTHERS

    fn_hide_deactivate();

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                              <-- Buttons - Listeners -->

    $("#co_leer").on("click", function () {

        if ($.trim($("#co_leer").text()) === "Leer") {

            if ($("#cb_cent_opera").val() === "") {
                fn_mensaje('#mensaje_error', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR SELECCIONAR UN CENTRO OPERATIVO!!! </strong></div>', 3000);
                $("#cb_cent_opera").focus();
                return;
            }

            if ($("#cb_evento").val() === "") {
                fn_mensaje('#mensaje_error', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR SELECCIONAR UN EVENTO!!! </strong></div>', 3000);
                $("#cb_evento").focus();
                return;
            }

            if ($("#cb_inst_corte").val() === "") {
                fn_mensaje('#mensaje_error', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR SELECCIONAR UNA INSTANCIA DE CORTE!!! </strong></div>', 3000);
                $("#cb_inst_corte").focus();
                return;
            }

            fn_enable();
            fn_validar_datos();
            fn_mensaje_boostrap("Se genero", g_tit, $("#co_guardar"));

        }

    });

    $("#co_ingresar").on("click", function () {

        if ($.trim($("#co_ingresar").text()) === "Modificar") {

            if ($("#tx_deuda_entre").val() === "") {
                fn_mensaje('#mensaje_error', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR INGRESAR UN VALOR DE ANTIGÜEDAD!!! </strong></div>', 3000);
                $("#tx_deuda_entre").focus();
                return;
            }

            if ($("#tx_deuda_entre2").val() === "") {
                fn_mensaje('#mensaje_error', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR INGRESAR UN VALOR DE ANTIGÜEDAD!!! </strong></div>', 3000);
                $("#tx_deuda_entre2").focus();
                return;
            }

            if ($("#tx_deuda").val() === "") {
                fn_mensaje('#mensaje_error', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR INGRESAR UN VALOR DE DEUDA!!! </strong></div>', 3000);
                $("#tx_deuda").focus();
                return;
            }

            if ($("#tx_antig_deuda_conv").val() === "") {
                fn_mensaje('#mensaje_error', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR INDICAR UNA ANTIGUËDAD DE LA DEUDA!!! </strong></div>', 3000);
                $("#tx_antig_deuda_conv").focus();
                return;
            }

            if ($("#tx_deuda_conv").val() === "") {
                fn_mensaje('#mensaje_error', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR INGRESAR UN VALOR DE CONVENIO!!! </strong></div>', 3000);
                $("#tx_deuda_conv").focus();
                return;
            }

            if ($("#tx_cant_cuot_fact").val() === "") {
                fn_mensaje('#mensaje_error', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR INDICAR LA CANTIDAD DE CUOTAS FACTURADAS!!! </strong></div>', 3000);
                $("#tx_cant_cuot_fact").focus();
                return;
            }

            if ($("#cb_tipo_agrup").val() === "") {
                fn_mensaje('#mensaje_error', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR SELECCIONAR UN TIPO DE AGRUPACIÓN!!! </strong></div>', 3000);
                $("#cb_tipo_agrup").focus();
                return;
            }

            // DO SOMETHING

            fn_mensaje_boostrap("Se modifico", g_tit, $("#co_guardar"));

        }

        if ($.trim($("#co_ingresar").text()) === "Ingresar") {

            // DO SOMETHING


            fn_mensaje_boostrap("Se ingresaron los datos", g_tit, $("#co_guardar"));

        }

    });

    $("select[id=cb_cent_opera]").change(function(){

        if ($('select[id=cb_cent_opera]').val() === "") {
            $("#cb_evento").prop("disabled", true);
            $("#cb_evento").val("");
            $("#cb_inst_corte").prop("disabled", true);
            $("#cb_inst_corte").val("");
        } else {
            $("#cb_evento").prop("disabled", false);
        }

    });

    $("select[id=cb_evento]").change(function(){

        if ($('select[id=cb_cent_opera]').val() === "" || $('select[id=cb_evento]').val() === "") {
            $("#cb_inst_corte").prop("disabled", true);
            $("#cb_inst_corte").val("");
        } else {
            $("#cb_inst_corte").prop("disabled", false);
        }

    });

    $("#co_confirm_yes").on("click", function () {

        // DO SOMETHING

        $("#dlg_confirm").slideUp();
        $('#dlg_confirm').modal('hide');
    });

    $("#co_confirm_no").on("click", function () {

        $("#dlg_confirm").slideUp();
        $('#dlg_confirm').modal('hide');
    });

    $("#co_eliminar").on("click", function () {

        fn_borrar();
    });

    $("#co_cancelar").on("click", function () {

        fn_limpiar();
    });

    $("#co_cerrar").on("click", function (){ window.close(); });

});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                                  <-- Combos -->

function fn_cent_opera(){

    $("#cb_cent_opera").html("<option value='' selected></option><option value='1'>OPCIÓN 01</option> <option value='2' >OPCIÓN 02</option>  <option value='3' >OPCIÓN 03</option>");
}

function fn_evento(){

    $("#cb_evento").html("<option value='' selected></option><option value='1'>OPCIÓN 01</option> <option value='2' >OPCIÓN 02</option>  <option value='3' >OPCIÓN 03</option>");
}

function fn_inst_corte(){

    $("#cb_inst_corte").html("<option value='' selected></option><option value='1'>OPCIÓN 01</option> <option value='2' >OPCIÓN 02</option>  <option value='3' >OPCIÓN 03</option>");
}

function fn_tipo_agrup(){

    $("#cb_tipo_agrup").html("<option value='' selected></option><option value='1'>OPCIÓN 01</option> <option value='2' >OPCIÓN 02</option>  <option value='3' >OPCIÓN 03</option>");
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                                  <-- Functions -->

function fn_validar_datos() {

    // SI NO EXISTEN DATOS HABILITAR PARA INGRESAR

    var algo;

    algo = Math.round(Math.random());

    if (algo === 1) {
        $("#co_ingresar").html("<span class='glyphicon glyphicon-floppy-disk'></span> Ingresar");
    } else {
        $("#co_ingresar").html("<span class='glyphicon glyphicon-floppy-disk'></span> Modificar");
    }
}

function fn_hide_deactivate() {

    $("#cb_evento").prop( "disabled", true);
    $("#cb_inst_corte").prop( "disabled", true);

    $("#tx_deuda").prop( "disabled", true);
    $("#tx_deuda_entre").prop( "disabled", true);
    $("#tx_deuda_entre2").prop( "disabled", true);
    $("#tx_antig_deuda_conv").prop( "disabled", true);
    $("#tx_cant_cuot_fact").prop( "disabled", true);
    $("#tx_deuda_conv").prop( "disabled", true);
    $("#cb_tipo_agrup").prop( "disabled", true);

    $("#co_ingresar").prop( "disabled", true);
    $("#co_eliminar").prop( "disabled", true);
    $("#mensaje_space").hide();
    $("#co_cancelar").hide();
}

function fn_enable() {

    $("#cb_cent_opera").prop( "disabled", true);
    $("#cb_evento").prop( "disabled", true);
    $("#cb_inst_corte").prop( "disabled", true);

    $("#tx_deuda").prop( "disabled", false);
    $("#tx_deuda_entre").prop( "disabled", false);
    $("#tx_deuda_entre2").prop( "disabled", false);
    $("#tx_antig_deuda_conv").prop( "disabled", false);
    $("#tx_cant_cuot_fact").prop( "disabled", false);
    $("#tx_deuda_conv").prop( "disabled", false);
    $("#cb_tipo_agrup").prop( "disabled", false);

    $("#co_leer").prop( "disabled", true);
    $("#co_ingresar").prop( "disabled", false);
    $("#co_eliminar").prop( "disabled", false);
    $("#co_cancelar").show();
    $("#co_cerrar").hide();
}

function fn_limpiar() {

    $("#tx_deuda").val("");
    $("#tx_deuda_entre").val("");
    $("#tx_deuda_entre2").val("");
    $("#tx_antig_deuda_conv").val("");
    $("#tx_cant_cuot_fact").val("");
    $("#tx_deuda_conv").val("");
    $("#cb_tipo_agrup").val("");

    $("#cb_cent_opera").prop( "disabled", false);
    $("#cb_evento").prop( "disabled", false);
    $("#cb_inst_corte").prop( "disabled", false);

    $("#tx_deuda").prop( "disabled", true);
    $("#tx_deuda_entre").prop( "disabled", true);
    $("#tx_deuda_entre2").prop( "disabled", true);
    $("#tx_antig_deuda_conv").prop( "disabled", true);
    $("#tx_cant_cuot_fact").prop( "disabled", true);
    $("#tx_deuda_conv").prop( "disabled", true);
    $("#cb_tipo_agrup").prop( "disabled", true);

    $("#co_leer").prop( "disabled", false);
    $("#co_ingresar").prop( "disabled", true);
    $("#co_eliminar").prop( "disabled", true);
    $("#co_cancelar").hide();
    $("#co_cerrar").show();

}

function fn_borrar() {

    $("#confirm_msg").html("¿Estas seguro de que quieres eliminar este registro?");

    $("#dlg_confirm").modal({backdrop: "static",keyboard:false});
    $("#dlg_confirm").on("shown.bs.modal", function () {
        $("#dlg_confirm div.modal-footer button").focus();
    });
}

function fn_mensaje(id,mensaje,segundos) {

    $(id).show();
    $("#mensaje_space").show();
    $(id).html(mensaje);
    setTimeout(function(){$(id).html("");$(id).hide(); }, segundos);
    setTimeout(function(){$("#mensaje_space").hide(); }, segundos);
}


