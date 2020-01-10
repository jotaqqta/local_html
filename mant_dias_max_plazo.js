var g_modulo = "Corte y Reposición";
var g_tit = "Mantención de Días Máximo de Plazos";
var $grid_principal;

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

    fn_rol_funcion();
    fn_tip_pla();
    fn_tip_pla_type();
    fn_mot_susp();
    fn_mot_susp_type();

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

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
//BOTONES-EVENTOS

    $("select[id=cb_tip_pla_type]").change(function(){

        if ($('select[id=cb_tip_pla_type]').val() === "0") {
            $("#cb_tip_pla").prop( "disabled", true );
            $("#cb_mot_susp_type").prop( "disabled", true );
        } else {
            $("#cb_mot_susp_type").prop( "disabled", false );
            $("#cb_tip_pla").prop( "disabled", false );
        }

    });

    $("select[id=cb_mot_susp_type]").change(function(){

        if ($('select[id=cb_mot_susp_type]').val() === "0") {
            $("#cb_mot_susp").prop( "disabled", true );
        } else {
            $("#cb_mot_susp").prop( "disabled", false );
        }

    });

    $("#co_ingresar").on("click", function() {

        if ($.trim($("#co_ingresar").text()) == "Ingresar") {

            if ($("#cb_rol_func").val() === "") {

                fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UN ROL!!!</strong></div>',3000);
                $("#cb_rol_func").focus();
                return;
            }

            if ($("#cb_tip_pla_type").val() === "") {

                    fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UN TIPO DE PLAZO!!!</strong></div>',3000);
                $("#cb_tip_pla_type").focus();
                return;
            }

            if ($("#cb_tip_pla").val() === "") {

                fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UN TIPO DE PLAZO!!!</strong></div>',3000);
                $("#cb_tip_pla").focus();
                return;
            }

            if ($("#cb_mot_susp_type").val() === "") {

                fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UN MOTIVO DE SUSPENSIÓN!!!</strong></div>',3000);
                $("#cb_mot_susp_type").focus();
                return;
            }

            if ($("#cb_mot_susp").val() === "") {

                fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UN MOTIVO DE SUSPENSIÓN!!!</strong></div>',3000);
                $("#cb_mot_susp").focus();
                return;
            }

            if ($("#tx_dias_susp_max").val() === "") {

                fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR LOS DIAS DE SUSPENSIÓN MÁXIMOS!!!</strong></div>',3000);
                $("#tx_dias_susp_max").focus();
                return;
            }

            fn_mensaje_boostrap("Se genero", g_tit, $("#co_generar"));
            $(window).scrollTop(0);

        }
    });

    $("#co_modificar").on("click", function() {

        if ($.trim($("#co_modificar").text()) == "Modificar") {

            if ($("#cb_rol_func").val() === "") {

                fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UN ROL!!!</strong></div>',3000);
                $("#cb_rol_func").focus();
                return;
            }

            if ($("#cb_tip_pla_type").val() === "") {

                fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UN TIPO DE PLAZO!!!</strong></div>',3000);
                $("#cb_tip_pla_type").focus();
                return;
            }

            if ($("#cb_tip_pla").val() === "") {

                fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UN TIPO DE PLAZO!!!</strong></div>',3000);
                $("#cb_tip_pla").focus();
                return;
            }

            if ($("#cb_mot_susp_type").val() === "") {

                fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UN MOTIVO DE SUSPENSIÓN!!!</strong></div>',3000);
                $("#cb_mot_susp_type").focus();
                return;
            }

            if ($("#cb_mot_susp").val() === "") {

                fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UN MOTIVO DE SUSPENSIÓN!!!</strong></div>',3000);
                $("#cb_mot_susp").focus();
                return;
            }

            if ($("#tx_dias_susp_max").val() === "") {

                fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR LOS DIAS DE SUSPENSIÓN MÁXIMOS!!!</strong></div>',3000);
                $("#tx_dias_susp_max").focus();
                return;
            }

            fn_modificar();

            fn_mensaje_boostrap("Se modifico", g_tit, $("#co_generar"));
            $(window).scrollTop(0);

        }
    });

    $("#co_eliminar").on("click", function () {

        fn_confirmar()
    });

    $("#co_confirm_yes").on( "click", function () {
        $('#dlg_confirm').modal('hide');
        fn_eliminar(true);
    });

    $("#co_confirm_no").on( "click", function () {
        $('#dlg_confirm').modal('hide');
        fn_eliminar(false);
    });

    $("#co_cerrar").on("click", function (){ window.close(); });

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~

/////////////////////////////////FUNCIONES COMBOS///////////////////////////////////////////

function fn_rol_funcion() {

    $("#cb_rol_func").html("<option value='' selected></option>  <option value='1'>CORTE</option>  <option value='2'>OPCION 02</option>  <option value='3'>OPCION 03</option>")
}

function fn_tip_pla(){

    $("#cb_tip_pla").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option>  <option value='3'>OPCION 03</option>");
}

function fn_tip_pla_type(){

    $("#cb_tip_pla_type").html("<option value='' selected></option><option value='1'>1</option> <option value='2' >2</option>  <option value='3'>3</option>");
}

function fn_mot_susp(){

    $("#cb_mot_susp").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option>  <option value='3'>OPCION 03</option>");
}

function fn_mot_susp_type(){

    $("#cb_mot_susp_type").html("<option value='' selected></option><option value='1'>1</option> <option value='2' >2</option>  <option value='3'>3</option>");
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~

function fn_eliminar(confirm) {

    if (confirm) {
        // Acion de borrar
        fn_mensaje_boostrap("Se ha eliminado el registro", g_tit, $("#co_eliminar"));
    }
}

function fn_modificar() {

}

function fn_confirmar() {

    $("#dlg_confirm").modal({backdrop: "static",keyboard:false});
    $("#dlg_confirm").on("shown.bs.modal", function () {
        $("#dlg_confirm div.modal-footer button").focus();
    });
}

function fn_mensaje(id,mensaje,segundos)
{
    $(id).show();
    $(id).html(mensaje);
    setTimeout(function(){$(id).html("");$(id).hide(); }, segundos);
}

