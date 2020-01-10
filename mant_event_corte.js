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

    $("#cb_tip_pla").prop( "disabled", true );
    $("#cb_mot_susp_type").prop( "disabled", true );
    $("#cb_mot_susp").prop( "disabled", true );

    fn_ocultar();
    fn_deshabilitar();
    $("#div_event_corte").show();
    $("#co_inactivar").hide();

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
//BOTONES-EVENTOS

    $("#co_leer").on( "click", function () {

        if ($.trim($("#co_modificar").text()) === "Leer") {

            // TAB 1
            if ($("#div_event_corte").is(":visible")) {



            }

            // TAB 2
            if ($("#div_situa_encon").is(":visible")) {

                if ($("#cb_centro_oper").val() === "") {

                    fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UN CENTRO OPERATIVO!!!</strong></div>',3000);
                    $("#cb_centro_oper").focus();
                    return;
                }

                if ($("#cb_codigo_sit").val() === "") {

                    fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UN CODIGO!!!</strong></div>',3000);
                    $("#cb_codigo_sit").focus();
                    return;
                }

            }

            // TAB 3
            if ($("#div_acc_real").is(":visible")) {

                if ($("#cb_centro_oper_acc").val() === "") {

                    fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UN CENTRO OPERATIVO!!!</strong></div>',3000);
                    $("#cb_centro_oper_acc").focus();
                    return;
                }

                if ($("#cb_event").val() === "") {

                    fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UN EVENTO!!!</strong></div>',3000);
                    $("#cb_event").focus();
                    return;
                }

                if ($("#cb_inst_cort").val() === "") {

                    fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UNA INSTANCIA DE CORTE!!!</strong></div>',3000);
                    $("#cb_inst_cort").focus();
                    return;
                }

                if ($("#cb_codigo_acc").val() === "") {

                    fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UN CODIGO!!!</strong></div>',3000);
                    $("#cb_codigo_acc").focus();
                    return;
                }

            }

            // TAB 4
            if ($("#div_event_situa_acc").is(":visible")) {



            }

            fn_mensaje_boostrap("Se modifico", g_tit, $("#co_generar"));
            $(window).scrollTop(0);

        }
    });

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

function fn_rol_funcion() {

    $("#cb_rol_func").html("<option value='' selected></option>  <option value='1'>CORTE</option>  <option value='2'>OPCION 02</option>  <option value='3'>OPCION 03</option>")
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~

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

function fn_mensaje(id,mensaje,segundos)
{
    $(id).show();
    $(id).html(mensaje);
    setTimeout(function(){$(id).html("");$(id).hide(); }, segundos);
}

