var g_modulo = "Corte y Reposición";
var g_tit = "Mantención de Eventos de Corte";
var $grid_principal;
var confirmar;

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

    //COMBOS

    fn_cargar_combos();

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

    $("#space").hide();
    fn_ocultar();
    fn_deshabilitar();
    $("#div_event_corte").show();
    $("#co_inactivar").hide();

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
//BOTONES-EVENTOS

    $("#tab_event_corte").on( "click", function () {

        if ($("#co_inactivar").is(":visible")) {
            $("#co_inactivar").hide();
        }

        if (!$("#co_eliminar").is(":visible")) {
            $("#co_eliminar").show();
        }

        fn_ocultar();
        fn_remove_active();
        fn_set_active("#tab_event_corte", "#div_event_corte")

    });

    $("#tab_situa_encon").on( "click", function () {

        if ($("#co_inactivar").is(":visible")) {
            $("#co_inactivar").hide();
        }

        if (!$("#co_eliminar").is(":visible")) {
            $("#co_eliminar").show();
        }

        fn_ocultar();
        fn_remove_active();
        fn_set_active("#tab_situa_encon", "#div_situa_encon")

    });

    $("#tab_acc_real").on( "click", function () {

        if ($("#co_inactivar").is(":visible")) {
            $("#co_inactivar").hide();
        }

        if (!$("#co_eliminar").is(":visible")) {
            $("#co_eliminar").show();
        }

        fn_ocultar();
        fn_remove_active();
        fn_set_active("#tab_acc_real", "#div_acc_real")

    });

    $("#tab_event_situa_acc").on( "click", function () {

        $("#co_eliminar").hide();
        $("#co_inactivar").show();

        fn_ocultar();
        fn_remove_active();
        fn_set_active("#tab_event_situa_acc", "#div_event_situa_acc")

    });

    $("#co_leer").on( "click", function () {

        if ($.trim($("#co_leer").text()) === "Leer") {

            // TAB 1
            if ($("#div_event_corte").is(":visible")) {

                if ($("#cb_tipo_event").val() === "") {

                    fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR SELECCIONAR UN TIPO DE EVENTO!!!</strong></div>',3000);
                    $("#cb_tipo_event").focus();
                    return;
                }
            }

            // TAB 2
            if ($("#div_situa_encon").is(":visible")) {


                if ($("#cb_centro_oper").val() === "") {

                    fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR SELECCIONAR UN CENTRO OPERATIVO!!!</strong></div>',3000);
                    $("#cb_centro_oper").focus();
                    return;
                }

                if ($("#cb_codigo_sit").val() === "") {

                    fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR SELECCIONAR UN CODIGO!!!</strong></div>',3000);
                    $("#cb_codigo_sit").focus();
                    return;
                }

            }

            // TAB 3
            if ($("#div_acc_real").is(":visible")) {

                if ($("#cb_tipo_event_acc").val() === "") {

                    fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR SELECCIONAR UN TIPO DE EVENTO!!!</strong></div>',3000);
                    $("#cb_tipo_event_acc").focus();
                    return;
                }

                if ($("#cb_centro_oper_acc").val() === "") {

                    fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR SELECCIONAR UN CENTRO OPERATIVO!!!</strong></div>',3000);
                    $("#cb_centro_oper_acc").focus();
                    return;
                }

                if ($("#cb_event").val() === "") {

                    fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR SELECCIONAR UN EVENTO!!!</strong></div>',3000);
                    $("#cb_event").focus();
                    return;
                }

                if ($("#cb_inst_cort").val() === "") {

                    fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR SELECCIONAR UNA INSTANCIA DE CORTE!!!</strong></div>',3000);
                    $("#cb_inst_cort").focus();
                    return;
                }

            }

            // TAB 4
            if ($("#div_event_situa_acc").is(":visible")) {

                if ($("#cb_centro_oper_event").val() === "") {

                    fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR SELECCIONAR UN CENTRO OPERATIVO!!!</strong></div>',3000);
                    $("#cb_centro_oper_event").focus();
                    return;
                }

                if ($("#cb_reg_ing").val() === "") {

                    fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR SELECCIONAR UN REGISTRO INGRESADO!!!</strong></div>',3000);
                    $("#cb_reg_ing").focus();
                    return;
                }

                if ($("#cb_evnt_cort").val() === "") {

                    fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR SELECCIONAR UN EVENTO DE CORTE!!!</strong></div>',3000);
                    $("#cb_evnt_cort").focus();
                    return;
                }

                if ($("#cb_inst_cort_evnt").val() === "") {

                    fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR SELECCIONAR UNA INSTANCIA DE CORTE!!!</strong></div>',3000);
                    $("#cb_inst_cort_evnt").focus();
                    return;
                }

                if ($("#cb_situ_encon").val() === "") {

                    fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR SELECCIONAR UNA SITUACIÓN ENCONTRADA!!!</strong></div>',3000);
                    $("#cb_situ_encon").focus();
                    return;
                }

                if ($("#cb_acc_real").val() === "") {

                    fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR SELECCIONAR UNA ACCIÓN REALIZADA!!!</strong></div>',3000);
                    $("#cb_acc_real").focus();
                    return;
                }

                if ($("#cb_zon_conc").val() === "") {

                    fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR SELECCIONAR UNA ZONA DE CONCESIÓN!!!</strong></div>',3000);
                    $("#cb_zon_conc").focus();
                    return;
                }

            }

            fn_mensaje_boostrap("Generado", g_tit, $("#co_generar"));
            $(window).scrollTop(0);

        }
    });

    $("#co_eliminar").on("click", function () {

        fn_confirmar(1)
    });

    $("#co_inactivar").on("click", function () {

        fn_confirmar(2)
    });

    $("#co_confirm_yes").on( "click", function () {
        $('#dlg_confirm').modal('hide');

        if ($("div_event_situa_acc").is(":visible")) {
            fn_inactivar(true);
        } else {
            fn_eliminar(true);
        }
    });

    $("#co_confirm_no").on( "click", function () {
        $('#dlg_confirm').modal('hide');

        if ($("div_event_situa_acc").is(":visible")) {
            fn_inactivar(false);
        } else {
            fn_eliminar(false);
        }
    });

    $("#co_cerrar").on("click", function (){ window.close(); });

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~

/////////////////////////////////FUNCIONES COMBOS///////////////////////////////////////////

//                             <-- TAB 1 (Eventos de Corte) -->

function fn_tipo_event() {

    $("#cb_tipo_event").html("<option value='' selected></option>  <option value='1'>OPCION 01</option>  <option value='2'>OPCION 02</option>  <option value='3'>OPCION 03</option>")
}

function fn_state_sumi() {

    $("#cb_state_sumi").html("<option value='' selected></option>  <option value='1'>OPCION 01</option>  <option value='2'>OPCION 02</option>  <option value='3'>OPCION 03</option>")
}

function fn_sig_event() {

    $("#cb_sig_event").html("<option value='' selected></option>  <option value='1'>OPCION 01</option>  <option value='2'>OPCION 02</option>  <option value='3'>OPCION 03</option>")
}

//                             <-- TAB 2 (Situación encontrada) -->

function fn_centro_oper() {

    $("#cb_centro_oper").html("<option value='' selected></option>  <option value='1'>OPCION 01</option>  <option value='2'>OPCION 02</option>  <option value='3'>OPCION 03</option>")
}

function fn_codigo_sit() {

    $("#cb_codigo_sit").html("<option value='' selected></option>  <option value='1'>OPCION 01</option>  <option value='2'>OPCION 02</option>  <option value='3'>OPCION 03</option>")
}

//                             <-- TAB 3 (Acciones Realizadas) -->

function fn_centro_oper_acc() {

    $("#cb_centro_oper_acc").html("<option value='' selected></option>  <option value='1'>OPCION 01</option>  <option value='2'>OPCION 02</option>  <option value='3'>OPCION 03</option>")
}

function fn_event() {

    $("#cb_event").html("<option value='' selected></option>  <option value='1'>OPCION 01</option>  <option value='2'>OPCION 02</option>  <option value='3'>OPCION 03</option>")
}

function fn_inst_cort() {

    $("#cb_inst_cort").html("<option value='' selected></option>  <option value='1'>OPCION 01</option>  <option value='2'>OPCION 02</option>  <option value='3'>OPCION 03</option>")
}

function fn_codigo_acc() {

    $("#cb_codigo_acc").html("<option value='' selected></option>  <option value='1'>OPCION 01</option>  <option value='2'>OPCION 02</option>  <option value='3'>OPCION 03</option>")
}

//                             <-- TAB 4 (Evento Situación Acción) -->

function fn_centro_oper_event() {

    $("#cb_centro_oper_event").html("<option value='' selected></option>  <option value='1'>OPCION 01</option>  <option value='2'>OPCION 02</option>  <option value='3'>OPCION 03</option>")
}

function fn_reg_ing() {

    $("#cb_reg_ing").html("<option value='' selected></option>  <option value='1'>OPCION 01</option>  <option value='2'>OPCION 02</option>  <option value='3'>OPCION 03</option>")
}

function fn_evnt_cort() {

    $("#cb_evnt_cort").html("<option value='' selected></option>  <option value='1'>OPCION 01</option>  <option value='2'>OPCION 02</option>  <option value='3'>OPCION 03</option>")
}

function fn_inst_cort_evnt() {

    $("#cb_inst_cort_evnt").html("<option value='' selected></option>  <option value='1'>OPCION 01</option>  <option value='2'>OPCION 02</option>  <option value='3'>OPCION 03</option>")
}

function fn_situ_encon() {

    $("#cb_situ_encon").html("<option value='' selected></option>  <option value='1'>OPCION 01</option>  <option value='2'>OPCION 02</option>  <option value='3'>OPCION 03</option>")
}

function fn_acc_real() {

    $("#cb_acc_real").html("<option value='' selected></option>  <option value='1'>OPCION 01</option>  <option value='2'>OPCION 02</option>  <option value='3'>OPCION 03</option>")
}

function fn_zon_conc() {

    $("#cb_zon_conc").html("<option value='' selected></option>  <option value='1'>OPCION 01</option>  <option value='2'>OPCION 02</option>  <option value='3'>OPCION 03</option>")
}

function fn_gen_cobro() {

    $("#cb_gen_cobro").html("<option value='' selected></option>  <option value='1'>OPCION 01</option>  <option value='2'>OPCION 02</option>  <option value='3'>OPCION 03</option>")
}

function fn_est_conex() {

    $("#cb_est_conex").html("<option value='' selected></option>  <option value='1'>OPCION 01</option>  <option value='2'>OPCION 02</option>  <option value='3'>OPCION 03</option>")
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~

function fn_cargar_combos() {

    fn_tipo_event();
    fn_state_sumi();
    fn_sig_event();
    fn_centro_oper();
    fn_centro_oper_acc();
    fn_event();
    fn_codigo_sit();
    fn_inst_cort();
    fn_codigo_acc();
    fn_centro_oper_event();
    fn_reg_ing();
    fn_evnt_cort();
    fn_inst_cort_evnt();
    fn_situ_encon();
    fn_acc_real();
    fn_zon_conc();
    fn_gen_cobro();
    fn_est_conex();

}

function fn_ocultar() {

    if ($("#div_event_corte").is(":visible")) {
        $("#div_event_corte").hide();
    }

    if ($("#div_situa_encon").is(":visible")) {
        $("#div_situa_encon").hide();
    }

    if ($("#div_acc_real").is(":visible")) {
        $("#div_acc_real").hide();
    }

    if ($("#div_event_situa_acc").is(":visible")) {
        $("#div_event_situa_acc").hide();
    }

}

function fn_deshabilitar() {

    $("#tx_state").prop( "disabled", true);
    $("#tx_fech_crea").prop( "disabled", true);
    $("#tx_rol_crea").prop( "disabled", true);
    $("#tx_fech_modf").prop( "disabled", true);
    $("#tx_rol_modf").prop( "disabled", true);
    $("#tx_fech_elim").prop( "disabled", true);
    $("#tx_rol_elim").prop( "disabled", true);

}


function fn_set_active(tab, div) {
    $(tab).addClass("active");
    $(div).show();

}


function fn_remove_active() {

    if ($("#tab_event_corte").hasClass("active")) {
        $("#tab_event_corte").removeClass("active")
    }

    if ($("#tab_situa_encon").hasClass("active")) {
        $("#tab_situa_encon").removeClass("active")
    }

    if ($("#tab_acc_real").hasClass("active")) {
        $("#tab_acc_real").removeClass("active")
    }

    if ($("#tab_event_situa_acc").hasClass("active")) {
        $("#tab_event_situa_acc").removeClass("active")
    }

}

function fn_confirmar(type) {

    if (type === 1) {
        $("#msg_confirm").html("¿Estas seguro de eliminar este Registro?")
    } else if (type === 2) {
        $("#msg_confirm").html("¿Estas seguro de inactivar este Registro?")
    } else {
        $("#msg_confirm").html("No se encontro el mensaje solicitado.")
    }

    $("#dlg_confirm").modal({backdrop: "static",keyboard:false});
    $("#dlg_confirm").on("shown.bs.modal", function () {
        $("#dlg_confirm div.modal-footer button").focus();
    });
}

function fn_eliminar(confirm) {

    // Acion de borrar
    if (confirm) {

        // TAB 1
        if ($("#div_event_corte").is(":visible")) {

            fn_mensaje_boostrap("Se ha eliminado el registro (TAB 1)", g_tit, $("#co_eliminar"));


        }

        // TAB 2
        if ($("#div_situa_encon").is(":visible")) {

            fn_mensaje_boostrap("Se ha eliminado el registro (TAB 2)", g_tit, $("#co_eliminar"));


        }

        // TAB 3
        if ($("#div_acc_real").is(":visible")) {

            fn_mensaje_boostrap("Se ha eliminado el registro (TAB 3)", g_tit, $("#co_eliminar"));


        }

    }
}

function fn_inactivar(confirm) {

    if (confirm) {

        fn_mensaje_boostrap("Se ha inactivado el registro (TAB 4)", g_tit, $("#co_inactivar"));

    }

}

function fn_mensaje(id,mensaje,segundos) {


    $("#space").show();
    $(id).show();
    $(id).html(mensaje);
    setTimeout(function(){$(id).html("");$(id).hide(); }, segundos);
    setTimeout(function(){$(id).html("");$("#space").hide(); }, segundos);
}

