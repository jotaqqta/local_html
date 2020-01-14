var g_modulo = "Cobranza Interna";
var g_tit = "Informe de Campaña";
var $grid_principal;
var sql_grid_prim = "";
var my_url = "inf_camp_cobr_int";
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

    $("._input_selector").inputmask("dd/mm/yyyy");

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

    $("#co_filtro").on("click", fn_filtro)

    $("#co_generar").on("click", function() {

        if ($.trim($("#co_generar").text()) == "Consultar") {

            if ($("#tx_desde").val() !== "") {
                if (fn_validar_fecha($("#tx_desde").val()) === false) {
                    fn_mensaje('#mensaje_filtro', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR VALIDAR EL FORMATO DE LA FECHA!!! RECUERDE QUE ES DD/MM/YYYY</strong></div>', 3000);
                    $("#tx_desde").focus();
                    return;
                }
            }

            if ($("#tx_hasta").val() !== "") {
                if (fn_validar_fecha($("#tx_hasta").val()) === false) {
                    fn_mensaje('#mensaje_filtro', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR VALIDAR EL FORMATO DE LA FECHA!!! RECUERDE QUE ES DD/MM/YYYY</strong></div>', 3000);
                    $("#tx_hasta").focus();
                    return;
                }
            }

            if ($("#tx_desde_2").val() !== "") {
                if (fn_validar_fecha($("#tx_desde_2").val()) === false) {
                    fn_mensaje('#mensaje_filtro', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR VALIDAR EL FORMATO DE LA FECHA!!! RECUERDE QUE ES DD/MM/YYYY</strong></div>', 3000);
                    $("#tx_fetx_desde_2c_desde").focus();
                    return;
                }
            }

            if ($("#tx_hasta_2").val() !== "") {
                if (fn_validar_fecha($("#tx_hasta_2").val()) === false) {
                    fn_mensaje('#mensaje_filtro', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR VALIDAR EL FORMATO DE LA FECHA!!! RECUERDE QUE ES DD/MM/YYYY</strong></div>', 3000);
                    $("#tx_hasta_2").focus();
                    return;
                }
            }

            if ($("#tx_desde").val() !== "" && $("#tx_hasta").val() !== "") {

                if (fn_fecha($("#tx_desde").val(), $("#tx_hasta").val()) === false) {
                    fn_mensaje('#mensaje_filtro', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR VALIDAR EL RANGO DE TIEMPO INGRESADO!!!</strong></div>', 3000);
                    $("#tx_desde").focus();
                    return;
                }
            }

            if ($("#tx_desde_2").val() != "" && $("#tx_hasta_2").val() != "") {

                if (fn_fecha($("#tx_desde_2").val(), $("#tx_hasta_2").val()) == false) {
                    fn_mensaje('#mensaje_filtro', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR VALIDAR EL RANGO DE TIEMPO INGRESADO!!!</strong></div>', 3000);
                    $("#tx_desde_2").focus();
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

        fn_filtro();
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
        { C1: '01', C2: 'TEXTO DE EJEMPLO', C3: '02/01/2020', C4: '05/12/2021', C5: '250', C6: '1.000.000', C7: '50', C8: '525.000'},
        { C1: '02', C2: 'TEXTO DE EJEMPLO', C3: '02/01/2020', C4: '05/12/2021', C5: '250', C6: '1.000.000', C7: '50', C8: '525.000' },
        { C1: '03', C2: 'TEXTO DE EJEMPLO', C3: '02/01/2020', C4: '05/12/2022', C5: '250', C6: '1.000.000', C7: '50', C8: '525.000' },
        { C1: '1245', C2: 'TEXTO DE EJEMPLO', C3: '02/01/2020', C4: '05/12/2021', C5: '250', C6: '1.000.000', C7: '50', C8: '525.000' },
        { C1: '1057', C2: 'TEXTO DE EJEMPLO', C3: '02/01/2020', C4: '05/05/2021', C5: '250', C6: '1.000.000', C7: '50', C8: '525.000' },
        { C1: '789687', C2: 'TEXTO DE EJEMPLO', C3: '02/01/2020', C4: '25/09/2021', C5: '250', C6: '1.000.000', C7: '50', C8: '525.000' },
        { C1: '45278', C2: 'TEXTO DE EJEMPLO', C3: '02/01/2020', C4: '05/05/2021', C5: '250', C6: '1.000.000', C7: '50', C8: '525.000' },
        { C1: '425278', C2: 'TEXTO DE EJEMPLO', C3: '02/01/2020', C4: '05/05/2021', C5: '250', C6: '1.000.000', C7: '50', C8: '525.000' },
        { C1: '7899', C2: 'TEXTO DE EJEMPLO', C3: '02/01/2020', C4: '05/05/2024', C5: '250', C6: '1.000.000', C7: '50', C8: '525.000' },
        { C1: '4237', C2: 'TEXTO DE EJEMPLO', C3: '02/01/2020', C4: '05/05/2021', C5: '250', C6: '1.000.000', C7: '50', C8: '525.000' },
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
        { title: "Campaña", width: 100, dataType: "integer", dataIndx: "C1", halign: "center", align: "center" },
        { title: "Descripción", width: 300, dataType: "strig", dataIndx: "C2", halign: "center", align: "left", },
        { title: "Fecha Creacion", width: 108, dataType: "string", dataIndx: "C3", halign: "center", align: "center" },
        { title: "Fecha Termino", width: 100, dataType: "string", dataIndx: "C4", halign: "center", align: "center" },
        { title: "Cantidad Cliente Inicio", width: 125, dataType: "string", dataIndx: "C5", halign: "center", align: "center" },
        { title: "Deuda Inicial", width: 125, dataType: "string", dataIndx: "C6", halign: "center", align: "center" },
        { title: "Cliente Regularizado", width: 125, dataType: "string", dataIndx: "C7", halign: "center", align: "center" },
        { title: "Deuda Regularizada", width: 125, dataType: "string", dataIndx: "C8", halign: "center", align: "center" },
    ];
    obj.dataModel = { data: data };

    $grid_principal = $("#div_grid_principal").pqGrid(obj);

}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~

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

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~

function fn_filtro(){

    $("#div_filtro_bts").modal({backdrop: "static",keyboard:false});
    $("#div_filtro_bts").on("shown.bs.modal", function () {
        $("#div_filtro_bts div.modal-footer button").focus();

    });
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

    $("#tx_desde").val("");
    $("#tx_desde_2").val("");
    $("#tx_hasta").val("");
    $("#tx_hasta_2").val("");
}

function fn_mensaje(id,mensaje,segundos)
{
    $(id).show();
    $(id).html(mensaje);
    setTimeout(function(){$(id).html("");$(id).hide(); }, segundos);
}

