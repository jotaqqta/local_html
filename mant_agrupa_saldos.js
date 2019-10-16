var g_modulo = "Mantenedor de Agrupaciones de Saldo";
var g_tit = "Mantenedor de Agrupaciones de Saldo";
var $grid_principal;
var $grid_2;
var sql_grid_prim = "";
var sql_grid_2 = "";
var sql_grid_3 = "";
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
    jQuery('#tx_cargo').keypress(function (tecla) {
        if (tecla.charCode < 48 || tecla.charCode > 57) return false;
    });

    jQuery('#tx_amort').keypress(function (tecla) {
        if (tecla.charCode < 48 || tecla.charCode > 57) return false;
    });

    jQuery('#tx_niv_imp').keypress(function (tecla) {
        if (tecla.charCode < 48 || tecla.charCode > 57) return false;
    });

    jQuery('#tx_niv_pre').keypress(function (tecla) {
        if (tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
    jQuery('#tx_ord_i').keypress(function (tecla) {
        if (tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
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

    $("._input_selector").inputmask("dd/mm/yyyy");

    //DEFINE LA GRILLA PRINCIPAL
    fn_setea_grid_principal();    
    //FUNCIONES  DE LOS COMBOS
    fn_tip_agru();
    fn_nom_agru();
    fn_cod_acc();
    fn_amor();
    fn_limpiar();
    //DIBUJA LOS ICONOS DE LOS BOTONES     
    $("#co_nuevo").html("<span class='glyphicon glyphicon-plus'></span> Nuevo");
    $("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");
    $("#co_ant").html("<span class='glyphicon glyphicon-arrow-left'></span> Anterior");
    $("#co_sig").html("<span class='glyphicon glyphicon-arrow-right'></span> Siguiente");
    $("#co_selec").html("<span class='glyphicon glyphicon-plus'></span> Seleccionar");
    $("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");
    $("#co_volver_fil").html("<span class='glyphicon glyphicon-remove'></span> Cancelar");
    //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
    //BOTONES-EVENTOS
				
    $("#co_limpiar").on("click", function () {
		fn_limpiar();
		return;
    });
	
    $("#co_cancelar").on("click", function (e) {
        $('#div_filtro_bts').modal('hide');
    });

    //BOTONES ELIMINAR DE LAS GRILLAS
    $("#co_eliminar").on("click", function (e) {

        $("#dlg_confirmamod").modal({ backdrop: "static", keyboard: false });
        $("#dlg_confirmamod").on("shown.bs.modal", function () {
            $("#co_confirmamod_no").focus();
        });

    });

    $("#co_nuevo").on("click", function (e) {
        fn_limpiar();
		fn_nuevo();
    });
	
    $("#co_volver_fil").on("click", function (e) {
        $("#div_prin").slideDown();
        $("#div_filtros").slideUp();
        $(window).scrollTop(0);
    });
	
    $("#co_close-m").on("click", function (e) {
        $('#div_modal').modal('hide');

    });

    //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
    $("._input_selector").inputmask("dd/mm/yyyy");

    //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
    //BOTONES
    $("#co_aceptar").on("click", function () {
        //Validación de informacion      
		if ($("#cb_tip_agru").val() == "") {
			fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR TIPO AGRUPACION!!!</strong></div>',3000);
			$("#cb_tip_agru").focus();
			return;
		}
		 if ($("#cb_nom_agru").val() == "") {
			fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR NOMBRE AGRUPACION!!!</strong></div>',3000);
			$("#cb_nom_agru").focus();
			return;

		 }
		 if ($("#cb_cod_acc").val() == "") {
			fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR CÓDIGO ACCIÓN!!!</strong></div>',3000);
			$("#cb_cod_acc").focus();
			return;
		 }
		 if ($("#cb_amor").val() == "") {
			fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR AMORTIZADO!!!</strong></div>',3000);
			$("#cb_amor").focus();
			return;                				
		 }
		fn_mensaje_boostrap("Se genero", g_tit, $("#co_guardar"));
		fn_carga_grilla();
		$("#div_prin").slideDown();
		$("#div_filtros").slideUp();
		$(window).scrollTop(0);

    });

    $("#div_modal").draggable({
        handle: ".modal-header"
    });

	//Evento doble click grilla principal
    $grid_principal.pqGrid({
        rowDblClick: function fn_sss(event, ui) {
            if (ui.rowData) {
                var dataCell = ui.rowData;
                $("#div_prin").slideUp();
                $("#div_filtros").slideDown();
                $(window).scrollTop(0);
                $grid_2.pqGrid("refreshView");           
            }
            fn_carga_grilla();
        }
    });
	
	//Evento doble click grilla secundaria
	$grid_2.pqGrid({
        rowDblClick: function fn_sss(event, ui) {
            if (ui.rowData) {
                var dataCell = ui.rowData;
                $("#cb_tip_agru").val(dataCell.C2);
                $("#cb_nom_agru").val(dataCell.C4);
                $("#cb_cod_acc").val(dataCell.C5);
                $("#cb_amor").val(dataCell.C6);
				fn_nuevo();
            }
        }
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
                { type: "button", label: "Excel", attr: "id=co_excel", cls: "btn btn-primary" },
                { type: "button", label: "Cerrar", attr: "id=co_cerrar", cls: "btn btn-secondary btn-sm" }
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
        { title: "Codigo", width: 100, dataType: "string", dataIndx: "C1", halign: "center", align: "center" },
        { title: "Descripcion Cargo", width: 350, dataType: "string", dataIndx: "C2", halign: "center", align: "left" },
              
    ];

    $grid_principal = $("#div_grid_principal").pqGrid(obj);
    $grid_principal.pqGrid("refreshDataAndView");

    //***********************************************************************************************
    data = [
        { C1: 'TOTAL FLEXIBLE', C2: '1', C3: 'SALDO', C4: '1', C5:'S', C6:'N' },
        { C1: 'TOTAL FLEXIBLE', C2: '1', C3:'SALDO', C4:'1', C5:'S', C6:'N' },
        { C1: 'TOTAL FLEXIBLE', C2: '1', C3:'SALDO', C4:'1', C5:'S', C6:'N' },        
    ]
    var obj2 = {
        height: 500,
        showTop: true,
        showHeader: true,
        roundCorners: true,
        rowBorders: true,
        fillHandle: "",
        columnBorders: true,
        editable: false,
        selectionModel: { type: "row", mode: "single" },
        showTitle: true,
        collapsible: false,
        numberCell: { show: false },
        title: "Detalle",
        pageModel: { rPP: 200, type: "local", rPPOptions: [100, 200, 500] },
        scrollModel: { theme: true },
        toolbar: {

            cls: "pq-toolbar-export",
            items: [
                { type: "button", label: "Nuevo", attr: "id=co_nuevo", cls: "btn btn-primary" },
                { type: "button", label: "Excel", attr: "id=co_excel", cls: "btn btn-primary btn-sm" },
                { type: "button", label: "cancelar", attr: "id=co_volver_fil", cls: "btn btn-default btn-sm" },
            ]
        }

    };

    obj2.colModel = [
        { title: "Tipo Agrupación", width: 100, dataType: "string", dataIndx: "C1", halign: "center", align: "center" },
        { title: "codigo_tipo_agrup", width: 100, dataType: "string", dataIndx: "C2", halign: "center", align: "center", hidden: true },
        { title: "Nombre Agrupación", width: 300, dataType: "string", dataIndx: "C3", halign: "center", align: "left" },
		{ title: "codigo nombre Agrupación", width: 300, dataType: "string", dataIndx: "C4", halign: "center", align: "left", hidden: true },
        { title: "Cod. Acción", width: 300, dataType: "string", dataIndx: "C5", halign: "center", align: "left" },
        { title: "Amortizado", width: 300, dataType: "string", dataIndx: "C6", halign: "center", align: "left" },
        {
            title: "Eliminar", width: 80, dataType: "string", align: "center", editable: false, minWidth: 100, sortable: false,
            render: function (ui) {

                return "<button name='co_elim' id='co_elim' class='btn btn-primary btn-sm'>Eliminar</button>";
            }
        }
    ];

    obj2.dataModel = { data: data };

    $grid_2 = $("#div_grid_sec").pqGrid(obj2);
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
            "empresa": $("#tx_empresa").val(),
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
//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
function fn_sistema() {

    $("#cb_sistema").html("<option value='' selected></option><option value='1'>Sistema 01</option> <option value='2' >Sistema 02</option> <option value='3'>Sistema 03</option>");
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~	
//FUNCIONES COMBOS

function fn_tip_agru() {
    $("#cb_tip_agru").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
		
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~	
function fn_nom_agru() {
    $("#cb_nom_agru").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
		
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
function fn_cod_acc() {
    $("#cb_tip_acc").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
		
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
function fn_amor() {
    $("#cb_amor").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
function fn_mensaje(id,mensaje,segundos)
{
	$(id).show();
	$(id).html(mensaje);
	setTimeout(function(){$(id).html("");$(id).hide(); }, segundos);
}
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
function fn_limpiar(){
    $("#cb_tip_agru").val("");
    $("#cb_nom_agru").val("");
    $("#cb_cod_acc").val("");
    $("#cb_amor").val("");
}
    
