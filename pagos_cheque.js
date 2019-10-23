var g_modulo = "Pagos con Cheque";
var g_tit = "Pagos con Cheque";
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

    // INICIA CON EL CURSOR EN EL CAMPO FECHA

    //DEFINE LA GRILLA PRINCIPAL
    fn_setea_grid_principal();    
    //FUNCIONES  DE LOS COMBO
    fn_limpiar();
    //DIBUJA LOS ICONOS DE LOS BOTONES     
    $("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");
    $("#co_filtro").html("<span class='glyphicon glyphicon-search'></span> Filtro");
    $("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");
    //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
    //BOTONES-EVENTOS
    
    $("#co_filtro").on("click", fn_nuevo);
				
    $("#co_limpiar").on("click", function () {
		fn_limpiar();
		return;
    });
	
    $("#co_cancelar").on("click", function (e) {
        $('#div_filtro_bts').modal('hide');
    });
	

    //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
    //BOTONES
    $("#co_aceptar").on("click", function () {
        //Validación de informacion      
		if ($("#cb_tip_agru").val() == "") {
			fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR TIPO AGRUPACION!!!</strong></div>',3000);
			$("#cb_tip_agru").focus();
			return;
		}
		fn_mensaje_boostrap("Se genero", g_tit, $(""));
		fn_carga_grilla();
		$(window).scrollTop(0);

    });

    //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
    //EXCEL    
    $("#co_excel").on("click", function (e) {

        fn_filtro();
        e.preventDefault();
        var col_model = $("#div_grid_principal").pqGrid("option", "colModel");
        var cabecera = "";
        for (i = 0; i < col_model.length; i++) {
            if (col_model[i].hidden != true) cabecera += "<th>" + col_model[i].title + "</th>";
        }
        $("#excel_cabecera").val(cabecera);
        var element = $grid_principal.pqGrid("option", "dataModel.data");
        if (element)
            a = element.length;
        else
            a = 0;
        if (a > 0) {
            $("#tituloexcel").val(g_tit);
            $("#sql").val(sql_grid_prim);
            $("#frm_Exel").submit();
            return;
        }
    });

});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~	
function fn_setea_grid_principal() {

    var obj = {
        height: "100%",
        showTop: true,
        showBottom: true,
        showHeader: true,
        roundCorners: true,
        rowBorders: true,
        columnBorders: true,
        editable: false,
        editor: { type: "textbox", select: true, style: "outline:none;" },
        selectionModel: { type: 'cell' },
        numberCell: { show: true },
        title: "Administrador de cargos",
        pageModel: { type: "local" },
        scrollModel: { theme: true },
        toolbar:
        {
            cls: "pq-toolbar-export",
            items: [
				{ type: "button", label: "Filtro", attr: "id=co_filtro", cls: "btn btn-primary btn-sm" },
                { type: "button", label: "Excel", attr: "id=co_excel", cls: "btn btn-primary" },
                { type: "button", label: "Filtro", attr: "id=co_cerrar", cls: "btn btn-secondary btn-sm" }
            ]
        },
        editModel: {
            clicksToEdit: 1,
            keyUpDown: true,
            pressToEdit: true,
            cellBorderWidth: 0
        },
        dataModel: {
            data: [                
                { C1: '0002', C2: 'CONSUMO DE AGUA NO FACTURADO', C3: 'UNIDAD', C4: 'GEP-003-TX', C5: '10000', C6: 11042019, C7: 12042019, C8: '122-222-22', C9: '1', C10: '2', C10: '3' },
                { C1: '0003', C2: 'SUBSIDIADO POR CASO SOCIAL', C3: 'UNIDAD', C4: 'GEP-003-TX', C5: '10000', C6: 11042019, C7: 12042019, C8: '122-222-22', C9: '1', C10: '2', C10: '3' },
                { C1: '0004', C2: 'SUBSIDIO POR CASO SOCIAL', C3: 'UNIDAD', C4: 'GEP-003-TX', C5: '10000', C6: 11042019, C7: 12042019, C8: '122-222-22', C9: '1', C10: '2', C10: '3' },
                { C1: '0005', C2: 'MATERIALES AGUA', C3: 'UNIDAD', C4: 'GEP-003-TX', C5: '10000', C6: 11042019, C7: 12042019, C8: '122-222-22', C9: '1', C10: '2', C10: '3' },
                { C1: '0006', C2: 'MANO DE OBRA - AGUA ', C3: 'UNIDAD', C4: 'GEP-003-TX', C5: '10000', C6: 11042019, C7: 12042019, C8: '122-222-22', C9: '1', C10: '2', C10: '3' },
                { C1: '0007', C2: 'CONSUMO DE AGUA HISTORICO', C3: 'UNIDAD', C4: 'GEP-003-TX', C5: '10000', C6: 11042019, C7: 12042019, C8: '122-222-22', C9: '1', C10: '2', C10: '3' },
                { C1: '0008', C2: 'DERECHO DE CONEXION - AGUA', C3: 'UNIDAD', C4: 'GEP-003-TX', C5: '10000', C6: 11042019, C7: 12042019, C8: '122-222-22', C9: '1', C10: '2', C10: '3' },
                { C1: '0009', C2: 'REINST. SERVICIO AGUA POTABLE', C3: 'UNIDAD', C4: 'GEP-003-TX', C5: '10000', C6: 11042019, C7: 12042019, C8: '122-222-22', C9: '1', C10: '2', C10: '3' },
                { C1: '00010', C2: 'DESCUENTO DE EMPLEADO', C3: 'UNIDAD', C4: 'GEP-003-TX', C5: '10000', C6: 11042019, C7: 12042019, C8: '122-222-22', C9: '1', C10: '2', C10: '3' },
                { C1: '00011', C2: 'DESCUENTO DE JUBILADO', C3: 'UNIDAD', C4: 'GEP-003-TX', C5: '10000', C6: 11042019, C7: 12042019, C8: '122-222-22', C9: '1', C10: '2', C10: '3' }

            ]
        }
    };

    obj.colModel = [
        { title: "Num. Cheque", width: 100, dataType: "string", dataIndx: "C1", halign: "center", align: "center" },
        { title: "Num Suministro", width: 350, dataType: "string", dataIndx: "C2", halign: "center", align: "left" },
        { title: "Monto", width: 350, dataType: "string", dataIndx: "C2", halign: "center", align: "left" },
        { title: "Num Depósito", width: 350, dataType: "string", dataIndx: "C2", halign: "center", align: "left" },
        { title: "Codigo Caja", width: 350, dataType: "string", dataIndx: "C2", halign: "center", align: "left" },
        { title: "Sesión", width: 350, dataType: "string", dataIndx: "C2", halign: "center", align: "left" },
        { title: "Lote", width: 350, dataType: "string", dataIndx: "C2", halign: "center", align: "left" },
        { title: "Banco", width: 350, dataType: "string", dataIndx: "C2", halign: "center", align: "left" },
        { title: "Fecha Pago", width: 350, dataType: "string", dataIndx: "C2", halign: "center", align: "left" },
              
    ];

    $grid_principal = $("#div_grid_principal").pqGrid(obj);
    //$grid_principal.pqGrid("refreshDataAndView");

}
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
function fn_limpiar() {

    $("#cb_agrup").val("0");
    $("#cb_tip_acc").val("0");
    $("#cb_agrup").focus();
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
function fn_filtro() {
    parameters =
	{
		"func": "fn_grid_principal",
		"empresa": $("#tx_num_cheque").val(),
	};
}
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
function fn_nuevo() {

    $("#div_filtro_bts").modal({ backdrop: "static", keyboard: false });
    $("#div_filtro_bts").on("shown.bs.modal", function () {
        $("#div_filtro_bts div.modal-footer button").focus();

    });
}
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~	
function fn_carga_grilla() {


}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
function fn_mensaje(id,mensaje,segundos)
{
	$(id).show();
	$(id).html(mensaje);
	setTimeout(function(){$(id).html("");$(id).hide(); }, segundos);
}

    
