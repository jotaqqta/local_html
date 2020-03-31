var g_modulo = "Órdenes Genéricas";
var g_tit = "Emisión de Órdenes Genéricas";
var $grid_principal;
var grid_principal;
var load = false;

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
$(document).keydown(function (e) {

    if (e.keyCode === 8) {
        var element = e.target.nodeName.toLowerCase();
        if ((element != 'input' && element != 'textarea') || $(e.target).attr("readonly")) {
            return false;
        }
    }
});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

$(document).ready(function () {
    jQuery('#tx_cod').keypress(function (tecla) {
        if (tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
    jQuery('#tx_cons').keypress(function (tecla) {
        if (tecla.charCode < 48 || tecla.charCode > 57) return false;
    });

    $(".number").inputmask({
        alias: "integer",
        placeholder: '',
        allowPlus: false,
        allowMinus: false
    });

    //COMBOS
    fn_tam_max_diam_fact();

    // PARA ELIMINAR EL SUBMIT
    $("button").on("click", function () {
        return false;
    });
    //INGRESA LOS TITULOS
    document.title = g_tit;
    document.body.scroll = "yes";
    ///raiz/
    $("#div_header").load("syn_globales/header.htm", function () {
        $("#div_mod0").html(g_modulo);
        $("#div_tit0").html(g_tit);
    });

    //Footer  ///raiz/
    $("#div_footer").load("syn_globales/footer.htm");
    $("#excel_archivo").val("tablas_generales.xls");
    $("#tx_empresa").val("1");
    $("#tx_rol").val("SYNERGIA");
    $("#tx_ip").val("127.0.0.1");

    $("#co_cancelar").hide();
    fn_disable_enable(true);

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                              <-- Buttons - Listeners -->

    $(window).resize(function () {
        if (parseInt($( window ).width()) < 931) {
            $("#button_space").hide();
        } else {
            $("#button_space").show();
        }
    });

    $("#co_leer").on("click", function () {

        if ($.trim($("#co_leer").text() === "Leer")) {

            if ($("#tx_nro_cliente").val() === "") {
                fn_mensaje_boostrap("Error, por favor indica un Numero de Cliente.", g_tit, $("#tx_nro_cliente"));
                return;
            }

            fn_load_data();
            fn_disable_enable(false);
            fn_mensaje_boostrap("Se genero.", g_tit, $(""));
        }
    });

    $("#tx_nro_cliente").keypress( function (e) {
        if (e.which === 13) {
            fn_load_data();
            fn_disable_enable(false);
            fn_mensaje_boostrap("Se genero.", g_tit, $(""));
        }
    });

    $("#co_ing_modf").on("click", function () {

        if ($("#tx_cant_subs").val() === "") {
            fn_mensaje_boostrap("Error, por favor indique la Cantidad de Subsidios.", g_tit, $("#tx_cant_subs"));
            return;
        }

        if ($("#tx_limite_subs").val() === "") {
            fn_mensaje_boostrap("Error, por favor indique el Limite de Subsidios.", g_tit, $("#tx_limite_subs"));
            return;
        }

        if ($("#tx_durac_max_subs_periodo").val() === "") {
            fn_mensaje_boostrap("Error, por favor indique la Duración Máxima Subsidio Periodo.", g_tit, $("#tx_durac_max_subs_periodo"));
            return;
        }

        if ($("#tx_ingreso").val() === "") {
            fn_mensaje_boostrap("Error, por favor indique la Cantidad Saldos de Ingresos.", g_tit, $("#tx_ingreso"));
            return;
        }

        if ($("#tx_notificacion").val() === "") {
            fn_mensaje_boostrap("Error, por favor indique la Cantidad Saldos de Notificación.", g_tit, $("#tx_notificacion"));
            return;
        }

        if ($("#tx_anular").val() === "") {
            fn_mensaje_boostrap("Error, por favor indique la Cantidad Saldos de Anulación.", g_tit, $("#tx_anular"));
            return;
        }

        if ($("#tx_monto_inf").val() === "") {
            fn_mensaje_boostrap("Error, por favor indique el Rango Inferior de Tolerancia de Deuda.", g_tit, $("#tx_monto_inf"));
            return;
        }

        if ($("#tx_monto_super").val() === "") {
            fn_mensaje_boostrap("Error, por favor indique el Rango Superior de Tolerancia de Deuda.", g_tit, $("#tx_monto_super"));
            return;
        }

        if ($("#cb_tam_max_diam_fact").val() === "") {
            fn_mensaje_boostrap("Error, por favor seleccione el Tamaño Máximo de Diametro de Facturación.", g_tit, $("#cb_tam_max_diam_fact"));
            return;
        }

        if ($("#tx_carg_fijo_inf").val() === "") {
            fn_mensaje_boostrap("Error, por favor indique el Porcentaje de Cargo Fijo Inferior.", g_tit, $("#tx_carg_fijo_inf"));
            return;
        } else {
            if (parseInt($("#tx_carg_fijo_inf").val()) < 0 || parseInt($("#tx_carg_fijo_inf").val()) > 100) {
                fn_mensaje_boostrap("Error, el Porcentaje de Cargo Fijo Inferior debe ser mayor que 0 y menor que 100.", g_tit, $("#tx_carg_fijo_inf"));
                return;
            }
        }

        if ($("#tx_carg_fijo_super").val() === "") {
            fn_mensaje_boostrap("Error, por favor indique el Porcentaje de Cargo Fijo Superior.", g_tit, $("#tx_carg_fijo_super"));
            return;
        } else {
            if (parseInt($("#tx_carg_fijo_super").val()) < 0 || parseInt($("#tx_carg_fijo_super").val()) > 100) {
                fn_mensaje_boostrap("Error, el Porcentaje de Cargo Fijo Superior debe ser mayor que 0 y menor que 100.", g_tit, $("#tx_carg_fijo_super"));
                return;
            }
        }

        if ($("#tx_carg_var_inf").val() === "") {
            fn_mensaje_boostrap("Error, por favor indique el Porcentaje de Cargo Variable Inferior.", g_tit, $("#tx_carg_var_inf"));
            return;
        } else {
            if (parseInt($("#tx_carg_var_inf").val()) < 0 || parseInt($("#tx_carg_var_inf").val()) > 100) {
                fn_mensaje_boostrap("Error, el Porcentaje de Cargo Variable Inferior debe ser mayor que 0 y menor que 100.", g_tit, $("#tx_carg_var_inf"));
                return;
            }
        }

        if ($("#tx_carg_var_super").val() === "") {
            fn_mensaje_boostrap("Error, por favor indique el Porcentaje de Cargo Variable Superior.", g_tit, $("#tx_carg_var_super"));
            return;
        } else {
            if (parseInt($("#tx_carg_var_super").val()) < 0 || parseInt($("#tx_carg_var_super").val()) > 100) {
                fn_mensaje_boostrap("Error, el Porcentaje de Cargo Variable Superior debe ser mayor que 0 y menor que 100.", g_tit, $("#tx_carg_var_super"));
                return;
            }
        }

        if (parseInt($("#tx_notificacion").val()) > parseInt($("#tx_anular").val())) {
            fn_mensaje_boostrap("Error, la Cantidad de Saldos de Notificiación no debe ser mayor a la cantidad de Saldos de Anulación.", g_tit, $("#tx_notificacion"));
            return;
        }

        if (parseInt($("#tx_monto_inf").val()) > parseInt($("#tx_monto_super").val())) {
            fn_mensaje_boostrap("Error, el Rango Inferior de Tolerancia de Deuda no debe ser mayor a el Rango Superior de Tolerancia de Deuda.", g_tit, $("#tx_monto_inf"));
            return;
        }

        if (parseInt($("#tx_carg_fijo_inf").val()) > parseInt($("#tx_carg_fijo_super").val())) {
            fn_mensaje_boostrap("Error, el Porcentaje de Cargo Fijo Inferior no debe ser mayor al Porcentaje de Cargo Fijo Superior.", g_tit, $("#tx_carg_fijo_inf"));
            return;
        }

        if (parseInt($("#tx_carg_var_inf").val()) > parseInt($("#tx_carg_var_super").val())) {
            fn_mensaje_boostrap("Error, el Porcentaje de Cargo Variable Inferior no debe ser mayor al Porcentaje de Cargo Variable Superior.", g_tit, $("#tx_carg_var_inf"));
            return;
        }

        if ($.trim($("#co_ing_modf").text() === "Ingresar")) {
            fn_mensaje_boostrap("Se ingreso.", g_tit, $(""));
        }

        if ($.trim($("#co_ing_modf").text() === "Modificar")) {
            fn_mensaje_boostrap("Se modifico.", g_tit, $(""));
        }

        fn_limpiar();
        fn_disable_enable(true);
    });

    $("#tx_carg_fijo_inf").blur( function () {
        if ($("#tx_carg_fijo_inf").val() >= 100) {
            $("#tx_carg_fijo_inf").val("100")
        }
    });

    $("#tx_carg_fijo_super").blur( function () {
        if ($("#tx_carg_fijo_super").val() >= 100) {
            $("#tx_carg_fijo_super").val("100")
        }
    });

    $("#tx_carg_var_inf").blur( function () {
        if ($("#tx_carg_var_inf").val() >= 100) {
            $("#tx_carg_var_inf").val("100")
        }
    });

    $("#tx_carg_var_super").blur( function () {
        if ($("#tx_carg_var_super").val() >= 100) {
            $("#tx_carg_var_super").val("100")
        }
    });

    $("#co_cancelar").on("click", function () {

        fn_limpiar();
        fn_disable_enable(true);
    });

    $("#co_cerrar").on("click", function (){ window.close(); });

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                                  <-- Grids -->

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~

//                                  <-- Combos -->

function fn_tam_max_diam_fact() {

    $("#cb_tam_max_diam_fact").html("<option value='' selected></option>  <option value='1'>10 \"</option> <option value='2'>OPCIÓN 02</option>  <option value='3'>OPCION 03</option>")
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                                  <-- Functions -->

function fn_load_data() {

    var num = Math.round(Math.random());

    if (num === 0) {

        $("#co_ing_modf").html("<span class='glyphicon glyphicon-floppy-disk'></span> Modificar");

        $("#tx_nombre_cliente").val("Maria Eugenia Florez Díaz");
        $("#tx_comuna").val("Bella Vista");
        $("#tx_cod_municipal").val("457");

        $("#tx_cant_subs").val("12");
        $("#tx_limite_subs").val("25");
        $("#tx_durac_max_subs_periodo").val("2");
        $("#tx_ingreso").val("5");
        $("#tx_notificacion").val("3");
        $("#tx_anular").val("4");
        $("#tx_monto_inf").val("125");
        $("#tx_monto_super").val("78542");
        $("#tx_carg_fijo_inf").val("45215");
        $("#tx_carg_fijo_super").val("123545");
        $("#tx_carg_var_inf").val("123274");
        $("#tx_carg_var_super").val("4567");
        $("#cb_tam_max_diam_fact").val("2");
    }

    if (num === 1) {
        $("#co_ing_modf").html("<span class='glyphicon glyphicon-ok'></span> Ingresar");
    }


}

function fn_disable_enable(action) {

    $("#tx_cant_subs").prop("disabled", action);
    $("#tx_limite_subs").prop("disabled", action);
    $("#tx_durac_max_subs_periodo").prop("disabled", action);
    $("#tx_ingreso").prop("disabled", action);
    $("#tx_notificacion").prop("disabled", action);
    $("#tx_anular").prop("disabled", action);
    $("#tx_monto_inf").prop("disabled", action);
    $("#tx_monto_super").prop("disabled", action);
    $("#tx_carg_fijo_inf").prop("disabled", action);
    $("#tx_carg_fijo_super").prop("disabled", action);
    $("#tx_carg_var_inf").prop("disabled", action);
    $("#tx_carg_var_super").prop("disabled", action);
    $("#cb_tam_max_diam_fact").prop("disabled", action);

    if (action) {
        $("#co_cerrar").show();
        $("#co_cancelar").hide();
        $("#co_leer").prop("disabled", false);
        $("#co_ing_modf").prop("disabled", true);
        $("#tx_nro_cliente").prop("disabled", false);
        $("#co_ing_modf").html("<span class='glyphicon glyphicon-ok'></span> Ingresar");
    } else {
        $("#co_cerrar").hide();
        $("#co_cancelar").show();
        $("#co_leer").prop("disabled", true);
        $("#co_ing_modf").prop("disabled", false);
        $("#tx_nro_cliente").prop("disabled", true);
    }
}

function fn_limpiar() {

    $("#tx_nro_cliente").val("");
    $("#tx_nombre_cliente").val("");
    $("#tx_comuna").val("");
    $("#tx_cod_municipal").val("");

    $("#tx_cant_subs").val("");
    $("#tx_limite_subs").val("");
    $("#tx_durac_max_subs_periodo").val("");
    $("#tx_ingreso").val("");
    $("#tx_notificacion").val("");
    $("#tx_anular").val("");
    $("#tx_monto_inf").val("");
    $("#tx_monto_super").val("");
    $("#tx_carg_fijo_inf").val("");
    $("#tx_carg_fijo_super").val("");
    $("#tx_carg_var_inf").val("");
    $("#tx_carg_var_super").val("");
    $("#cb_tam_max_diam_fact").val("");

}

function fn_mensaje(id,mensaje,segundos) {

    $(id).show();
    $(id).html(mensaje);
    setTimeout(function(){$(id).html("");$(id).hide(); }, segundos);
}

