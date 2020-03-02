var g_modulo = "Corte y Reposición";
var g_tit = "Ingreso de Solicitudes Especiales de Corte";

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

    $("._input_selector").inputmask("dd/mm/yyyy");

    // COMBOS
    fn_inst_cort();
    fn_motivo();

    // Footer  // Raiz
    $("#div_footer").load("syn_globales/footer.htm");
    $("#excel_archivo").val("tablas_generales.xls");
    $("#tx_empresa").val("1");
    $("#tx_rol").val("SYNERGIA");
    $("#tx_ip").val("127.0.0.1");

    $('input[type=radio][name=opt_debe_valid]').filter('[value="opt_2"]').attr('checked', true);

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                              <-- Buttons - Listeners -->

    $("#co_ingresar").on("click", function () {

        if ($.trim($("#co_ingresar").text() === "Ingresar")) {

            /*if ($("#input_file").val() === "") {
                fn_mensaje_boostrap("Error, por favor cargue un archivo.", g_tit, $("#input_file"));
                return;
            }*/

            if ($("#cb_inst_cort").val() === "") {
                fn_mensaje_boostrap("Error, por favor seleccione una Instancia de Corte.", g_tit, $("#cb_inst_cort"));
                return;
            }

            if ($("#cb_motivo").val() === "") {
                fn_mensaje_boostrap("Error, por favor seleccione un Motivo.", g_tit, $("#cb_motivo"));
                return;
            }

            if ($("#tx_fech_prog_cort").val() === "") {
                fn_mensaje_boostrap("Error, por favor inidque una Fecha.", g_tit, $("#tx_fech_prog_cort"));
                return;
            }

            if ($("#tx_fech_prog_cort").val() !== "") {
                if (fn_validar_fecha($("#tx_fech_prog_cort").val()) === false) {
                    fn_mensaje_boostrap("Error, por favor valide el formato de la fecha ingresada.", g_tit, $("#tx_fech_prog_cort"));
                    return;
                }
            }

            if ($("#tx_observ").val() === "") {
                fn_mensaje_boostrap("Error, por favor inidque una Observación.", g_tit, $("#tx_observ"));
                return;
            }

            fn_mensaje_boostrap("Se ingreso.", g_tit, $("#co_ingresar"));
        }

        });

    $("#input_file").change( function () {

        if($.inArray($('#input_file').val().split('.').pop().toLowerCase(), ['txt']) === -1) {
            if ($("#input_file").val() !== "") {
                fn_mensaje_boostrap("Error, solo se permiten archivos con extensión .txt", g_tit, $("#input_file"));
                $("#input_file").val("");
            }
        }
    });

    $("#co_cerrar").on("click", function (){ window.close(); });

});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                                  <-- Combos -->

function fn_inst_cort(){

    $("#cb_inst_cort").html("<option value='' selected></option><option value='1'>OPCIÓN 01</option> <option value='2' >OPCIÓN 02</option>  <option value='3' >OPCIÓN 03</option>");
}

function fn_motivo(){

    $("#cb_motivo").html("<option value='' selected></option><option value='1'>OPCIÓN 01</option> <option value='2' >OPCIÓN 02</option>  <option value='3' >OPCIÓN 03</option>");
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                                  <-- Functions -->

function fn_validar_fecha(value){
    var real, info;
    if (/^(0?[1-9]|[12][0-9]|3[01])[\/](0?[1-9]|1[012])[\/]\d{4}$/.test(value)) {
        info = value.split(/\//);
        var fecha = new Date(info[2], info[1]-1, info[0]);
        if ( Object.prototype.toString.call(fecha) === '[object Date]' ){
            real = fecha.toISOString().substr(0,10).split('-');
            if (info[0] === real[2] && info[1] === real[1] && info[2] === real[0]) {
                return true;
            }
            return false;
        } else {
            return false;
        }
    }
    else {
        return false;
    }
}

function fn_limpiar() {

}

function fn_mensaje(id,mensaje,segundos) {

    $(id).show();
    $(id).html(mensaje);
    setTimeout(function(){$(id).html("");$(id).hide(); }, segundos);
}


