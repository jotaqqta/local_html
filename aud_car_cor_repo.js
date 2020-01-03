var g_modulo = "Corte y Reposición";
var g_tit = "Relación Motivo Cliente - Motivo Empresa - Tipo de Atención";
var $grid_principal;
var sql_grid_prim = "";
var parameters = {};

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
    jQuery('#tx_cod').keypress(function (tecla){
        if (tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
    jQuery('#tx_cons').keypress(function (tecla){
        if (tecla.charCode < 48 || tecla.charCode > 57) return false;
    });

    //COMBOS

    fn_regional();
    fn_evento();
    fn_tiene_med();
    fn_diametro();
    fn_cargo();

    // INICIA CON EL CURSOR EN EL CAMPO FECHA
    $("._input_selector").inputmask("dd/mm/yyyy");
    $("#tx_ciclo").inputmask({mask:"99", rightAlign: false, placeholder: ""});

    // PARA ELIMINAR EL SUBMIT
    $("button").on("click", function () { return false; });
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

    //DEFINE LA GRILLA PRINCIPAL
    fn_setea_grid_principal();

    //DIBUJA LOS ICONOS DE LOS BOTONES

    $("#co_filtro").html("<span class='glyphicon glyphicon-search'></span> Filtro");
    $("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");
    $("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
//BOTONES-EVENTOS

    $("#co_filtro").on("click", fn_filtro);

    $("#co_generar").on("click", function() {

        if ($.trim($("#co_generar").text()) == "Consultar") {

            if ($("#tx_fec_desde").val() != "") {
                if (fn_validar_fecha($("#tx_fec_desde").val()) == false) {
                    fn_mensaje('#mensaje_filtro', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR VALIDAR EL FORMATO DE LA FECHA!!! RECUERDE QUE ES DD/MM/YYYY</strong></div>', 3000);
                    $("#tx_fec_desde").focus();
                    return;
                }
            }

            if ($("#tx_fec_hasta").val() != "") {
                if (fn_validar_fecha($("#tx_fec_hasta").val()) == false) {
                    fn_mensaje('#mensaje_filtro', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR VALIDAR EL FORMATO DE LA FECHA!!! RECUERDE QUE ES DD/MM/YYYY</strong></div>', 3000);
                    $("#tx_fec_desde").focus();
                    return;
                }
            }

            if ($("#tx_fec_desde").val() != "" && $("#tx_fec_hasta").val() != "") {

                if (fn_fecha($("#tx_fec_desde").val(), $("#tx_fec_hasta").val()) == false) {
                    fn_mensaje('#mensaje_filtro', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR VALIDAR EL RANGO DE TIEMPO INGRESADO!!!</strong></div>', 3000);
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

    $("#co_limpiar").on("click", function () {
        if ($.trim($("#co_limpiar").text()) == "Limpiar") {
            fn_limpiar();
            return;
        }
        else
            window.close();
    });

    $("#co_cancel").on("click", function (){
        $('#div_filtro_bts').modal('hide');
    });

    $("#co_cerrar").on("click", function (){ window.close(); });

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
//EXCEL
    $("#co_excel").on("click", function (e) {

        e.preventDefault();
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
        }
    });

});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
function fn_setea_grid_principal() {

    var data =  [
        { C1: 'PANAMÁ METRO', C2: 'CORT', C3: 'N', C4: '1 "', C5: '0009', C6: 'AGUA REINST. SERVICIO - INTERIOR', C7: '0', C8: 'Insertado', C9: '03/07/2012', C10: 'SYNERGIA4J' },
        { C1: 'PANAMÁ METRO', C2: 'CORT', C3: 'N', C4: '1 1/2 "', C5: '0009', C6: 'AGUA REINST. SERVICIO - INTERIOR', C7: '0', C8: 'Eliminado', C9: '03/07/2012', C10: 'SYNERGIA4J' },
        { C1: 'BOCAS DEL TORO', C2: 'CORT', C3: 'S', C4: '8 "', C5: '0108', C6: 'CORTE SERVICIO AGUA POTABLE', C7: '269.16', C8: 'Modificado', C9: '005/09/2014', C10: 'RCARVAJAL' },
        { C1: 'COCLÉ', C2: 'CORT', C3: 'S', C4: '8 "', C5: '0108', C6: 'CORTE SERVICIO AGUA POTABLE', C7: '269.16', C8: 'Modificado', C9: '005/09/2014', C10: 'RCARVAJAL' },
        { C1: 'COLÓN', C2: 'CORT', C3: 'S', C4: '8 "', C5: '0108', C6: 'CORTE SERVICIO AGUA POTABLE', C7: '269.16', C8: 'Modificado', C9: '005/09/2014', C10: 'RCARVAJAL' },
        { C1: 'CHIRIQUÍ', C2: 'CORT', C3: 'S', C4: '8 "', C5: '0108', C6: 'CORTE SERVICIO AGUA POTABLE', C7: '269.16', C8: 'Modificado', C9: '005/09/2014', C10: 'RCARVAJAL' },
        { C1: 'PANAMA ESTE Y DARIEN', C2: 'CORT', C3: 'S', C4: '8 "', C5: '0108', C6: 'CORTE SERVICIO AGUA POTABLE', C7: '269.16', C8: 'Modificado', C9: '005/09/2014', C10: 'RCARVAJAL' },
        { C1: 'HERRERA', C2: 'CORT', C3: 'S', C4: '8 "', C5: '0108', C6: 'CORTE SERVICIO AGUA POTABLE', C7: '269.16', C8: 'Modificado', C9: '005/09/2014', C10: 'RCARVAJAL' },
        { C1: 'LOS SANTOS', C2: 'CORT', C3: 'S', C4: '8 "', C5: '0108', C6: 'CORTE SERVICIO AGUA POTABLE', C7: '269.16', C8: 'Modificado', C9: '005/09/2014', C10: 'RCARVAJAL' },
        { C1: 'PANAMÁ METRO', C2: 'CORT', C3: 'S', C4: '8 "', C5: '0108', C6: 'CORTE SERVICIO AGUA POTABLE', C7: '269.16', C8: 'Modificado', C9: '005/09/2014', C10: 'RCARVAJAL' },
        { C1: 'ARRAIJÁN', C2: 'CORT', C3: 'S', C4: '8 "', C5: '0108', C6: 'CORTE SERVICIO AGUA POTABLE', C7: '269.16', C8: 'Modificado', C9: '005/09/2014', C10: 'RCARVAJAL' },
        { C1: 'PANAMÁ OESTE', C2: 'CORT', C3: 'S', C4: '8 "', C5: '0108', C6: 'CORTE SERVICIO AGUA POTABLE', C7: '269.16', C8: 'Modificado', C9: '005/09/2014', C10: 'RCARVAJAL' },
        { C1: 'VERAGUAS', C2: 'CORT', C3: 'S', C4: '8 "', C5: '0108', C6: 'CORTE SERVICIO AGUA POTABLE', C7: '269.16', C8: 'Modificado', C9: '005/09/2014', C10: 'RCARVAJAL' },
        { C1: 'BOCAS DEL TORO', C2: 'REPO', C3: 'N', C4: '8 "', C5: '0008', C6: 'REINST. SERVICIO AGUA POTABLE', C7: '269.16', C8: 'Modificado', C9: '005/09/2014', C10: 'RCARVAJAL' },
        { C1: 'COCLÉ', C2: 'REPO', C3: 'N', C4: '8 "', C5: '0008', C6: 'REINST. SERVICIO AGUA POTABLE', C7: '269.16', C8: 'Modificado', C9: '005/09/2014', C10: 'RCARVAJAL' },
        { C1: 'COLÓN', C2: 'REPO', C3: 'N', C4: '8 "', C5: '0008', C6: 'REINST. SERVICIO AGUA POTABLE', C7: '269.16', C8: 'Modificado', C9: '005/09/2014', C10: 'RCARVAJAL' },
        { C1: 'CHIRIQUÍ', C2: 'REPO', C3: 'N', C4: '8 "', C5: '0008', C6: 'REINST. SERVICIO AGUA POTABLE', C7: '269.16', C8: 'Modificado', C9: '005/09/2014', C10: 'RCARVAJAL' },
        { C1: 'PANAMÁ ESTE Y DARIE', C2: 'REPO', C3: 'N', C4: '8 "', C5: '0008', C6: 'REINST. SERVICIO AGUA POTABLE', C7: '269.16', C8: 'Modificado', C9: '005/09/2014', C10: 'RCARVAJAL' },
        { C1: 'HERRERA', C2: 'REPO', C3: 'N', C4: '8 "', C5: '0008', C6: 'REINST. SERVICIO AGUA POTABLE', C7: '269.16', C8: 'Modificado', C9: '005/09/2014', C10: 'RCARVAJAL' },
    ];

    var obj = {
        height: "100%",
        showTop: true,
        showBottom:true,
        showTitle : false,
        title: "",
        roundCorners: true,
        rowBorders: true,
        columnBorders: true,
        collapsible:true,
        editable:false,
        selectionModel: { type: 'row',mode:'single'},
        numberCell: { show: true },
        pageModel: { rPP: 100, type: "local", rPPOptions: [100, 200, 500]},
        scrollModel:{theme:true},
        toolbar: {
            cls: "pq-toolbar-export",
            items:[
                { type: "button", label: "Filtro",    attr: "id=co_filtro",  cls: "btn btn-primary btn-sm" },
                { type: "button", label: "Excel", attr:"id=co_excel", cls:"btn btn-primary btn-sm"},
                { type: "button", label: "Cerrar",   attr: "id=co_cerrar", cls: "btn btn-secondary btn-sm"},
            ]
        },
    };

    obj.colModel = [
        { title: "Regional", width: 190, dataType: "strig", dataIndx: "C1", halign: "center", align: "left", },
        { title: "Evento", width: 70, dataType: "string", dataIndx: "C2", halign: "center", align: "center" },
        { title: "Medidor", width: 60, dataType: "string", dataIndx: "C3", halign: "center", align: "center" },
        { title: "Diametro", width: 80, dataType: "string", dataIndx: "C4", halign: "center", align: "center" },
        { title: "Cod. Cargo", width: 80, dataType: "string", dataIndx: "C5", halign: "center", align: "center" },
        { title: "Descripción Cargo", width: 258, dataType: "string", dataIndx: "C6", halign: "center", align: "left" },
        { title: "Valor", width: 85, dataType: "string", dataIndx: "C7", halign: "center", align: "center" },
        { title: "Tipo Evento", width: 90, dataType: "string", dataIndx: "C8", halign: "center", align: "center" },
        { title: "Fecha Evento", width: 95, dataType: "string", dataIndx: "C9", halign: "center", align: "center" },
        { title: "Rol Evento", width: 100, dataType: "string", dataIndx: "C10", halign: "center", align: "left" },
    ];
    obj.dataModel = { data: data };

    $grid_principal = $("#div_grid_principal").pqGrid(obj);

}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~

function fn_filtro(){

    $("#div_filtro_bts").modal({backdrop: "static",keyboard:false});
    $("#div_filtro_bts").on("shown.bs.modal", function () {
        $("#div_filtro_bts div.modal-footer button").focus();


    });
}

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

function fn_fecha(valor, valor2) {

    var fecha = valor.split("/");
    fecha.reverse();
    Date.parse(fecha);

    var fecha2 = valor2.split("/");
    fecha2.reverse();
    Date.parse(fecha2);

    if (fecha <= fecha2) {
        return true;
    } else {
        return false;
    }


}

/////////////////////////////////FUNCIONES COMBOS///////////////////////////////////////////
function fn_regional(){

    $("#cb_regional").html("<option value='' selected></option><option value='1'>PANAMÁ  METRO</option> <option value='2' >BOCAS DEL TORO</option>  <option value='3' >COCLÉ</option>  <option value='4' >COLÓN</option>  <option value='5' >CHIRIQUÍ</option>  <option value='6' >PANAMÁ ESTE Y DARIEN</option>  <option value='7'>HERRERA</option>  <option value='8'>LOS SANTOS</option> <option value='9'>ARRAIJÁN</option>  <option value='10'>PANAMA OESTE</option>  <option value='11'>VERAGUAS</option>");
}
function fn_evento(){

    $("#cb_evento").html("<option value='' selected></option><option value='1'>CORT</option> <option value='2' >REPO</option>  <option value='3' >OPCION 03</option>");
}

function fn_tiene_med(){

    $("#cb_tiene_med").html("<option value='' selected></option><option value='1'>S</option> <option value='2' >N</option>  <option value='3' >OPCION 03</option>");
}

function fn_diametro(){

    $("#cb_diametro").html("<option value='' selected></option><option value='1'>1 \"</option> <option value='2' >1 1/2 \"</option>  <option value='3' >8 \"</option>");
}

function fn_cargo(){

    $("#cb_cargo").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option>  <option value='3' >OPCION 03</option>");
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~

function fn_carga_grilla() {

    var total_register;

    $grid_principal.pqGrid( "option", "dataModel", dataModel );
    $grid_principal.pqGrid( "refreshDataAndView" );
    $grid_principal.pqGrid( "option", "title", "Total Registros: " + total_register);

}

// Limpiar Filtro

function fn_limpiar(){

    $("#tx_fec_desde").val("");
    $("#tx_fec_hasta").val("");
    $("#tx_rol_fil").val("");
    $("#cb_regional").val("");
    $("#cb_evento").val("");
    $("#cb_tiene_med").val("");
    $("#cb_diametro").val("");
    $("#cb_cargo").val("");
}

function fn_mensaje(id,mensaje,segundos)
{
    $(id).show();
    $(id).html(mensaje);
    setTimeout(function(){$(id).html("");$(id).hide(); }, segundos);
}

