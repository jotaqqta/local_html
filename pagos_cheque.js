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

      //DEFINE LA GRILLA PRINCIPAL
    fn_setea_grid_principal();    
    //FUNCIONES
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
		if ($("#tx_num_cheque").val() == "") {
			fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR NÚMERO DE CHEQUE!!!</strong></div>',3000);
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
                { C1: '4444', C2: '0000665948', C3: '22.07', C4: '261', C5: '016', C6: '222', C7: '1076', C8: '015', C9: '17/05/2010'},
                { C1: '4444', C2: '0000665948', C3: '22.07', C4: '261', C5: '016', C6: '222', C7: '1076', C8: '015', C9: '17/05/2010'},
                { C1: '4444', C2: '0000665948', C3: '22.07', C4: '261', C5: '016', C6: '222', C7: '1076', C8: '015', C9: '17/05/2010'},
                { C1: '4444', C2: '0000665948', C3: '22.07', C4: '261', C5: '016', C6: '222', C7: '1076', C8: '015', C9: '17/05/2010'},
                { C1: '4444', C2: '0000665948', C3: '22.07', C4: '261', C5: '016', C6: '222', C7: '1076', C8: '015', C9: '17/05/2010'},
                
            ]
        }
    };

    obj.colModel = [
        { title: "Num. Cheque", width: 120, dataType: "string", dataIndx: "C1", halign: "center", align: "center" },
        { title: "Num. Suministro", width: 120, dataType: "string", dataIndx: "C2", halign: "center", align: "left" },
        { title: "Monto", width: 120, dataType: "string", dataIndx: "C3", halign: "center", align: "left" },
        { title: "Num Depósito", width: 120, dataType: "string", dataIndx: "C4", halign: "center", align: "left" },
        { title: "Codigo Caja", width: 120, dataType: "string", dataIndx: "C5", halign: "center", align: "left" },
        { title: "Sesión", width: 120, dataType: "string", dataIndx: "C6", halign: "center", align: "left" },
        { title: "Lote", width: 120, dataType: "string", dataIndx: "C7", halign: "center", align: "left" },
        { title: "Banco", width: 120, dataType: "string", dataIndx: "C8", halign: "center", align: "left" },
        { title: "Fecha Pago", width: 120, dataType: "string", dataIndx: "C9", halign: "center", align: "left" },
              
    ];

    $grid_principal = $("#div_grid_principal").pqGrid(obj);
    //$grid_principal.pqGrid("refreshDataAndView");

}
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
function fn_limpiar() {

    $("#tx_num_cheque").val("");
    $("#tx_num_cheque").focus();
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
function fn_mensaje(id,mensaje,segundos)
{
	$(id).show();
	$(id).html(mensaje);
	setTimeout(function(){$(id).html("");$(id).hide(); }, segundos);
}

    
