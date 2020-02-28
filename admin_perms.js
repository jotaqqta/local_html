var g_modulo = "Tratamiento de Ordenes Masivas";
var g_tit = "Administrador de permisos";
var $grid_principal;
var $grid_secundaria;
var rowData = {};
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
    fn_setea_grid_secundaria();

    $("#co_actualizar").prop("disabled", true);


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
//BOTONES-EVENTOS

    $("#co_filtro").on("click", function () {

        $("#div_filtro_bts").modal({backdrop: "static",keyboard:false});
        $("#div_filtro_bts").on("shown.bs.modal", function () {
            $("#div_filtro_bts div.modal-footer button").focus();

        });

        setTimeout(function() {

            $grid_secundaria.pqGrid("refreshView");

        }, 400);
    });

    $("#co_actualizar").on("click", function () {

        fn_mensaje_boostrap("Evento Boton. Has seleccionado la fila: " + (rowData.id + 1) + " con la data: C1: " + rowData.dataC1 + ", C2: " + rowData.dataC2, g_tit, $("#co"));

    });

    $("#co_cancel").on("click", function (){
        $('#div_filtro_bts').modal('hide');
    });

    $("#co_cerrar").on("click", function (){ window.close(); });

    //EVENTO DBL_CLICK DE LA GRILLA
    $grid_secundaria.pqGrid({
        rowDblClick: function( event, ui ) {
            if (ui.rowData) {
                var dataCell = ui.rowData;

                fn_mensaje_boostrap("Se genero", g_tit, $("#co"));

                $("#div_rol").html(dataCell.C1);

                $('#div_filtro_bts').modal('hide');

            }
        }
    });

    $grid_principal.pqGrid({
        check: function ( event, ui ) {
            if (ui.check) {

                var dataCell = ui.rowData;

                rowData = { id: ui.rowIndx, dataC1: dataCell.C1, dataC2: dataCell.C2 };

                $("#co_actualizar").prop("disabled", false);

            } else {
                $("#co_actualizar").prop("disabled", true);
            }
        }
    });


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
        { C1: 'ARUT', C2: 'ASIGNACIÓN RUTA' },
        { C1: 'ATAR', C2: 'ASIGNACIÓN TARIFARIA' },
        { C1: 'CAME', C2: 'CAMBIOS DE MEDIDOR' },
        { C1: 'CANV', C2: 'CONVENIOS' },
        { C1: 'CORT', C2: 'ORDEN DE CORTE' },
        { C1: 'INSP', C2: 'INSPECCIONES' },
        { C1: 'MOME', C2: 'MOVIMIENTO MEDIDORES' },
        { C1: 'ORDG', C2: 'ORDEN GENERICA' },
        { C1: 'REFA', C2: 'AJUSTES' },
        { C1: 'REIN', C2: 'REINCDENCIA PROD' },
        { C1: 'REPO', C2: 'ORDEN DE REPOSICIÓN' },
        { C1: 'RET', C2: 'RETIRO PRODUCTO' },
        { C1: 'VTA1', C2: 'VENTAS' },
    ];

    var obj = {
        height: "100%",
        showTop: true,
        showBottom:true,
        showTitle : false,
        roundCorners: true,
        rowBorders: true,
        columnBorders: true,
        collapsible:true,
        selectionModel: { type: 'row',mode:'single'},
        numberCell: { show: true },
        pageModel: { rPP: 100, type: "local", rPPOptions: [100, 200, 500]},
        scrollModel:{theme:true},
        toolbar: false,
    };

    obj.colModel = [
        { dataIndx: "checkBox", maxWidth: 30, minWidth: 30, align: "center", resizable: false, title: "", dataType: 'bool', editable: true,
            type: 'checkBoxSelection', cls: 'ui-state-default', sortable: false, editor: true,
            cb: {
                all: false,
                header: false,
                maxCheck: 1,

            }
        },
        { title: "Tipo Orden", width: 531, dataType: "string", dataIndx: "C1", halign: "center", align: "left", editable: false },
        { title: "Descripción", width: 530, dataType: "string", dataIndx: "C2", halign: "center", align: "left", editable: false },
    ];
    obj.dataModel = { data: data };

    $grid_principal = $("#div_grid_principal").pqGrid(obj);

}

function fn_setea_grid_secundaria() {

    var data =  [
        { C1: 'ADMASEO', C2: 'ADMASEO' },
        { C1: 'CAPLEC 9000', C2: 'CAPLEC 9000' },
        { C1: 'PAGO NOUB', C2: 'PAGO NOUB' },
        { C1: 'SEGRE FINCA MADRE', C2: 'SEGRE FINCA MADRE' },
        { C1: 'CORTE', C2: 'CORTE' },
        { C1: 'REPO FACT MENSUAL', C2: 'REPO FACT MENSUAL' },
        { C1: 'SYNER GRUP I', C2: 'SYNER GRUP I' },
        { C1: 'SYNVIEW IDDAN', C2: 'SYNVIEW IDDAN' },
        { C1: 'CONSULTA CLIENTES', C2: 'CONSULTA CLIENTES' },
        { C1: 'GEN COMPROBANTES', C2: 'GEN COMPROBANTES' },
        { C1: 'GEN RECIBOS', C2: 'GEN RECIBOS' },
        { C1: 'F VTA1 2 E', C2: 'F VTA1 2 E' },
        { C1: 'F VTA1 3 E', C2: 'F VTA1 3 E' },
        { C1: 'F VTA1 4 E', C2: 'F VTA1 4 E' },
        { C1: 'F VTA1 5 E', C2: 'F VTA1 5 E' },
        { C1: 'F VTA1 5 E', C2: 'F VTA1 5 E' },
        { C1: 'F VTA1 7 E', C2: 'F VTA1 7 E' },
        { C1: 'F VTA1 8 E', C2: 'F VTA1 8 E' },
        { C1: 'F VTA1 9 E', C2: 'F VTA1 9 E' },
        { C1: 'F VTA1 9 ERUT', C2: 'F VTA1 9 ERUT' },
        { C1: 'F VTA1 9 ETAR', C2: 'F VTA1 9 ETAR' },
    ];

    var obj = {
        height: 175,
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
        toolbar: false,
    };

    obj.colModel = [
        { title: "Rol", width: 410, dataType: "string", dataIndx: "C1", halign: "center", align: "left" },
        { title: "Nombre", width: 409, dataType: "string", dataIndx: "C2", halign: "center", align: "left" },
    ];
    obj.dataModel = { data: data };

    $grid_secundaria = $("#div_grid_second").pqGrid(obj);

}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~

function fn_filtro(){

    $("#div_filtro_bts").modal({backdrop: "static",keyboard:false});
    $("#div_filtro_bts").on("shown.bs.modal", function () {
        $("#div_filtro_bts div.modal-footer button").focus();

    });
}


/////////////////////////////////FUNCIONES COMBOS///////////////////////////////////////////


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~

function fn_carga_grilla() {

    var total_register;

    $grid_principal.pqGrid( "option", "dataModel", dataModel );
    $grid_principal.pqGrid( "refreshDataAndView" );
    $grid_principal.pqGrid( "option", "title", "Total Registros: " + total_register);

}

// Limpiar Filtro
function fn_limpiar(){

    $("#cb_mot_client").val("");
    $("#cb_mot_emp").val("");
}

function fn_mensaje(id,mensaje,segundos)
{
    $(id).show();
    $(id).html(mensaje);
    setTimeout(function(){$(id).html("");$(id).hide(); }, segundos);
}

