var g_modulo = "Corte y Reposición";
var g_tit = "Informes de Corte y Reposición";
var $grid_principal;
var sql_grid_prim = "";
var my_url = "act_tipo_doc";
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
    jQuery('#tx_cod').keypress(function (tecla) {
        if (tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
    jQuery('#tx_cons').keypress(function (tecla) {
        if (tecla.charCode < 48 || tecla.charCode > 57) return false;
    });

    //COMBOS

    fn_sec_inicial();
    fn_sec_fin();
    fn_cen_opera();
    fn_localidad();
    fn_contratista();

    // INICIA CON EL CURSOR EN EL CAMPO FECHA
    $("._input_selector").inputmask("dd/mm/yyyy");

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

    // Oculta Filtros

    fn_oculta_filtros();

    $("#space").hide();
    $("#space2").hide();

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
//BOTONES-EVENTOS

    $("#co_generar").on("click", function() {

        if ($.trim($("#co_generar").text()) === "Generar") {

            if (!$('input[type=radio][name=opt_filtro]').is(':checked')) {
                fn_mensaje('#mensaje_filtro', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR SELECCIONAR UN FILTRO!!!</strong></div>', 3000);
                return;
            }

            if ($("#tx_fec_desde").val() === "") {
                fn_mensaje('#mensaje_filtro', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR INGRESAR UNA FECHA!!!</strong></div>', 3000);
                $("#tx_fec_desde").focus();
                return;
            }

            if ($("#tx_fec_hasta").val() === "") {
                fn_mensaje('#mensaje_filtro', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR INGRESAR UNA FECHA!!!</strong></div>', 3000);
                $("#tx_fec_hasta").focus();
                return;
            }

            if ($("#tx_fec_desde").val() !== "") {
                if (fn_validar_fecha($("#tx_fec_desde").val()) === false) {
                    fn_mensaje('#mensaje_filtro', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR VALIDAR EL FORMATO DE LA FECHA!!! RECUERDE QUE ES DD/MM/YYYY</strong></div>', 3000);
                    $("#tx_fec_desde").focus();
                    return;
                }
            }

            if ($("#tx_fec_hasta").val() !== "") {
                if (fn_validar_fecha($("#tx_fec_hasta").val()) === false) {
                    fn_mensaje('#mensaje_filtro', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR VALIDAR EL FORMATO DE LA FECHA!!! RECUERDE QUE ES DD/MM/YYYY</strong></div>', 3000);
                    $("#tx_fec_hasta").focus();
                    return;
                }
            }

            if ($("#tx_fec_desde").val() !== "" && $("#tx_fec_hasta").val() !== "") {

                if (fn_fecha($("#tx_fec_desde").val(), $("#tx_fec_hasta").val()) === false) {
                    fn_mensaje('#mensaje_filtro', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR VALIDAR EL RANGO DE TIEMPO INGRESADO!!!</strong></div>', 3000);
                    $("#tx_fec_desde").focus();
                    return;
                }
            }


            fn_mensaje_boostrap("Se genero", g_tit, $("#co_generar"));
            $("#div_prin").slideDown();
            $("#div_filtro_bts").slideUp();
            $('#div_filtro_bts').modal('hide');
            $(window).scrollTop(0);

        }
    });


    $('input[type=radio][name=opt_filtro]').change(function() {

        fn_oculta_filtros();

        if (this.value === 'opt_1') {
            $("#filtro-1").show();
            $("#filtro-5").show();
        } else if (this.value === 'opt_16') {
            $("#filtro-1").show();
        } else if (this.value === 'opt_17') {
            $("#filtro-3").show();
        } else if (this.value === 'opt_20') {
            $("#filtro-4").show();
            $("#filtro-5").show();
        } else if (this.value === 'opt_15') {
            $("#filtro-2").show();
            $("#filtro-5").show();
        } else if (this.value === 'opt_21') {
            $("#filtro-5").show();
        }

        $("#filtro-basico").show();
        $("#space").show();
    });

    $("#co_cerrar").on("click", function (){ window.close(); });

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
//EXCEL
    $("#co_excel").on("click", function (e) {

        /*e.preventDefault();
        var col_model=$( "#div_grid_principal" ).pqGrid( "option", "colModel" );
        var cabecera = "";
        for (i = 0; i < col_model.length; i++){
            if(col_model[i].hidden != true) cabecera += "<th>"+col_model[i].title+ "</th>";
        }
        $("#excel_cabecera").val(cabecera);
        var element =$grid_principal.pqGrid("option","dataModel.data");
        if (element)
            a= element.length;
        else
            a = 0;
        if(a > 0){
            $("#tituloexcel").val(g_tit);
            $("#sql").val(sql_grid_prim);
            $("#frm_Exel").submit();
            return;
        }*/
    });

});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~

/////////////////////////////////FUNCIONES COMBOS///////////////////////////////////////////

// <-- Filtro Basico / Por defecto -->

function fn_sec_inicial(){

    $("#cb_sec_ini").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option>  <option value='3'>OPCION 03</option>");
}

function fn_cen_opera(){

    $("#cb_cen_opera").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option>  <option value='3'>OPCION 03</option>");
}

function fn_sec_fin(){

    $("#cb_sec_fin").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option>  <option value='3'>OPCION 03</option>");
}

function fn_localidad(){

    $("#cb_localidad").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option>  <option value='3'>OPCION 03</option>");
}

// <-- Filtro-01 -->

function fn_contratista(){

    $("#cb_contratista").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option>  <option value='3'>OPCION 03</option>");
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~

function fn_validar_fecha(value){
    var real, info;
    if (/^(0?[1-9]|[12][0-9]|3[01])[\/](0?[1-9]|1[012])[\/]\d{4}$/.test(value)) {
        info = value.split(/\//);
        var fecha = new Date(info[2], info[1]-1, info[0]);
        if ( Object.prototype.toString.call(fecha) === '[object Date]' ){
            real = fecha.toISOString().substr(0,10).split('-');
            return info[0] === real[2] && info[1] === real[1] && info[2] === real[0];

        } else {
            return false;
        }
    }
    else {
        return false;
    }
}

function fn_fecha(valor, valor2) {

    var fecha = valor.split("/");
    fecha.reverse();
    Date.parse(fecha);

    var fecha2 = valor2.split("/");
    fecha2.reverse();
    Date.parse(fecha2);

    return fecha <= fecha2;


}

function fn_oculta_filtros() {

    if ($("#filtro-basico").is(":visible")) {
        $("#filtro-basico").hide();
    }

    if ($("#filtro-1").is(":visible")) {
        $("#filtro-1").hide();
    }

    if ($("#filtro-2").is(":visible")) {
        $("#filtro-2").hide();
    }

    if ($("#filtro-3").is(":visible")) {
        $("#filtro-3").hide();
    }

    if ($("#filtro-4").is(":visible")) {
        $("#filtro-4").hide();
    }

    if ($("#filtro-5").is(":visible")) {
        $("#filtro-5").hide();
    }

    $("#space").hide();

}

function fn_mensaje(id,mensaje,segundos) {

    if (!$('input[type=radio][name=opt_filtro]').is(':checked')) {
        $('#space2').css("height","20px");
    } else {
        $('#space2').css("height","15px");
    }

    $(id).show();
    $("#space2").show();
    $(id).html(mensaje);
    setTimeout(function(){$(id).html("");$(id).hide(); }, segundos);
    setTimeout(function(){$(id).html("");$("#space2").hide(); }, segundos);
}

