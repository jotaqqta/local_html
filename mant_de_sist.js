var g_modulo = "Tratamiento de Ordenes Masivas";
var g_tit = "Mantenci&oacute;n de sistemas";

var $grid_principal;
var $grid_secundaria;
var $grid_terciaria;
var $grid_aux_terciaria;
var grid_aux_secundaria;
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
	
	//Footer  ///raiz/
	$("#div_footer").load("syn_globales/footer.htm");
	
	$("#excel_archivo").val("tablas_generales.xls");
	
    $("#tx_empresa").val("1");
	$("#tx_rol").val("SYNERGIA");
	$("#tx_ip").val("127.0.0.1");
	
    // INICIA CON EL CURSOR EN EL CAMPO FECHA
		$("._input_selector").inputmask("dd/mm/yyyy");
    
	//DEFINE LA GRILLA PRINCIPAL
	fn_setea_grid_principal();
	//DEFINE LA GRILLA SECUNDARIA
	fn_set_grid_secundaria();
	//DEFINE LA GRILLA TERCERA
	fn_set_grid_terciaria();

	//DIBUJA LOS ICONOS DE LOS BOTONES     
	$("#co_nuevo").html("<span class='glyphicon glyphicon-plus'></span> Nuevo");
    $("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");
	$("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");     
	$("#co_volver").html("<span class='glyphicon glyphicon-chevron-left'></span> Volver");
	
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
    //FUNCIONES DE CAMPOS
    fn_estado();
   
 
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
    //BOTONES-EVENTOS
	
    $("#co_nuevo").on("click", fn_new);   
	    
    
    $("#co_volver").on("click", function (e) {
        window.close();
    }); 
 	

    
	$("#co_seleccionar").on("click", function () {

		if (grid_aux_secundaria.Checkbox('checkBox').getCheckedNodes().length < 1) {
			fn_mensaje('#msj_modal_cli','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>ERROR, FAVOR SELECCIONAR UN CLIENTE</strong></div>',3000);
			return;
		}

		$("#id_cen_ope_cli").val(grid_aux_secundaria.Checkbox('checkBox').getCheckedNodes().map(function (ui) { return ui.C1; }));
		$("#tx_cen_op_1").val(grid_aux_secundaria.Checkbox('checkBox').getCheckedNodes().map(function (ui) { return ui.C2; }));

		$('#div_cliente_bts').modal('hide');
		
    });

    $("#co_seleccionar2").on("click", function () {

		if (grid_aux_terciaria.Checkbox('checkBox').getCheckedNodes().length < 1) {
			fn_mensaje('#msj_modal_usu','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>ERROR, FAVOR SELECCIONAR UN USUARIO</strong></div>',3000);
			return;
		}

		$("#id_cen_op_usu_1").val(grid_aux_terciaria.Checkbox('checkBox').getCheckedNodes().map(function (ui) { return ui.C1; }));
		$("#tx_cen_op_usu_1").val(grid_aux_terciaria.Checkbox('checkBox').getCheckedNodes().map(function (ui) { return ui.C5; }));

		$('#div_usuario_bts').modal('hide');
		
    });


	//BOTONES CERRAR DE LOS MODALES
    $("#co_cancel").on("click", function (e) {
		$('#div_cliente_bts').modal('hide');		
	});

	$grid_terciaria.pqGrid({
        refresh: function ( event, ui ) {            
                grid_aux_terciaria = this;            
        }
    });
    
    $("#co_cancel2").on("click", function (e) {
		$('#div_usuario_bts').modal('hide');
	});
    
	$grid_secundaria.pqGrid({
        refresh: function ( event, ui ) {            
                grid_aux_secundaria = this;            
        }
    });
  
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
	//BOTONES 

    $("#co_volver").on("click", function (e) {
		$("#div_prin").show();
		$("#div_tabla").hide();
		fn_limpiar();	
		$(window).scrollTop(0);
    });
	
	    
	$("#co_modif").on("click", function () {
					
		if ($("#tx_cod_sist_2").val() ==""){
			fn_mensaje_boostrap("FAVOR DIGITAR CODIGO SISTEMA", g_tit, $("#tx_cod_sist_2"));
						
	        return false;
	        
		};
		
	    if ($("#cb_estado").val()==""){
			fn_mensaje_boostrap("FAVOR SELECCIONAR ESTADO", g_tit, $("#cb_estado"));
	         
	         return false;
		};
	    
		if ($("#tx_cen_op_1").val()==""){
			fn_mensaje_boostrap("FAVOR DIGITAR CENTRO OPERATIVO CLIENTE", g_tit, $("#tx_cen_op_1"));
			return false;
		}
		
		if ($("#tx_cen_op_usu_1").val()==""){
			fn_mensaje_boostrap("FAVOR DIGITAR CENTRO OPERATIVO USUARIO", g_tit, $("#tx_cen_op_usu_1"));
			return false;
		}

		if ($("#tx_fecha_crea").val()==""){
			fn_mensaje_boostrap("FAVOR DIGITAR FECHA CREACIÓN", g_tit, $("#tx_fecha_crea"));
			return false;
		}

		if ($("#tx_fecha_modif").val()==""){
			fn_mensaje_boostrap("FAVOR DIGITAR FECHA MODIFICACIÓN", g_tit, $("#tx_fecha_modif"));
			return false;
		}

			fn_mensaje_boostrap("Se modificó", g_tit, $(""));
            $(window).scrollTop(0);
	});

	$("#co_cliente").on("click", function () {
        $("#div_cliente_bts").modal({backdrop: "static",keyboard:false});
        $("#div_cliente_bts").on("shown.bs.modal", function () {
			$grid_secundaria.pqGrid("refreshDataAndView");
        	$("#div_cliente_bts div.modal-footer button").focus();
        });        
	});

	 $("#co_usuario").on("click", function () {
        $("#div_usuario_bts").modal({backdrop: "static",keyboard:false});
        $("#div_usuario_bts").on("shown.bs.modal", function () {
			$grid_terciaria.pqGrid("refreshDataAndView");
        	$("#div_usuario_bts div.modal-footer button").focus();
        });        
	});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
//EXCEL    
	$("#co_excel").on("click", function (e) {
		
		e.preventDefault();
        var col_model=$( "#div_grid_principal" ).pqGrid( "option", "colModel" );
		var cabecera = "";
		for (i=0; i< col_model.length; i++){
			if(col_model[i].hidden != true) cabecera += "<th>"+col_model[i].title+ "</th>";
		}
		$("#excel_cabecera").val(cabecera);
		var element =$grid_principal.pqGrid("option","dataModel.data");
		if (element)
			a= element.length;
		else 
			a= 0;
		if(a>0){
			$("#tituloexcel").val(g_tit);
			$("#frm_Exel").submit();
			return;
		}	
    });			
    
    //EVENTO DBL_CLICK DE LA GRILLA
    $grid_principal.pqGrid({
		rowDblClick: function( event, ui ) {
			if (ui.rowData) {
					var dataCell = ui.rowData;
					//g_cliente_selec = dataCell.c2;
					$("#div_prin").hide();
                    $("#div_tabla").show();

                    $("#tx_cod_sist").val(dataCell.C1);
                    $("#tx_cod_sist_2").val(dataCell.C2);
                    $("#cb_estado").val(dataCell.C3);
                    $("#tx_cen_op_1").val(dataCell.C4);
                    $("#tx_cen_op_usu_1").val(dataCell.C5);
                    $("#tx_fecha_crea").val(dataCell.C6);
                    $("#tx_fecha_modif").val(dataCell.C7);

                    $("#co_modif").html("<span class='glyphicon glyphicon-pencil'></span> Modificar");				
				}				
			}

	});


});
           
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~///////////////GRILLAS///////////////~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
    // GRID PRINCIPAL
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
		numberCell: { show: true},
		title: "",
		pageModel: { type: "local" },
		scrollModel: { theme: true },
		toolbar:
		{
			cls: "pq-toolbar-export",
			items:[
				{ type: "button", label: "Nuevo",    attr: "id=co_nuevo",  cls: "btn btn-primary" },				
                { type: "button", label: "Excel",    attr: "id=co_excel",  cls: "btn btn-primary btn-sm" },       
                { type: "button", label: "Cerrar",   attr: "id=co_cerrar", cls: "btn btn-secondary btn-sm" }               
				]
		},
        editModel: {
            clicksToEdit: 1,
            keyUpDown: true,
            pressToEdit: true,
            cellBorderWidth: 0
        },
		dataModel:{ data: [
             { C1: 'AIC', C2: 'ATENCIÓN INTEGRAL DE CLIENTE', C3: '1', C4: 'AGRUPACIÓN1', C5: 'AGRUPACION TOTAL EMPRESA', C6: '01/04/2020', C7: '01/04/2020' }, 
                        
        ] }
	};
	
    obj.colModel = [
    	{ title: "Sistema", width: 350, dataType: "string", dataIndx: "C1", halign: "center",  align:"center", hidden: "true" },
		{ title: "Descripci&oacute;n", width: 350, dataType: "string", dataIndx: "C2", halign: "center",  align:"center" },
		{ title: "Estado", width: 100, dataType: "string", dataIndx: "C3", halign: "center", align: "center", hidden: "true" },
		{ title: "Centro Operativo Cliente", width: 100, dataType: "string", dataIndx: "C4", halign: "center", align: "center", hidden: "true" },
		{ title: "Centro Operativo Usuario", width: 80, dataType: "number", dataIndx: "C5", halign: "center", align: "right", hidden: "true" },
		{ title: "Fecha Creación", width: 80, dataType: "number", dataIndx: "C6", halign: "center", align: "right", hidden: "true" },
		{ title: "Fecha Modificación", width: 80, dataType: "number", dataIndx: "C7", halign: "center", align: "right", hidden: "true" },
 
	];

	$grid_principal = $("#div_grid_principal").pqGrid(obj);
	$grid_principal.pqGrid("refreshDataAndView");
   
}
    // GRID CENTRO OPERATIVO CLIENTE
function fn_set_grid_secundaria() {



    var data =  [
        { C1: 'AGR', C2: 'AGRUPACIÓN1' },
    ];

    var obj = {
        height: 225,
        showtop: true,
        filterModel: {
            on: true,
            mode: "AND",
            header: true,
        },
        rowBorders: true,
        showTitle: false,
        showBottom: false,
        collapsible: true,
        roundCorners: true,
        columnBorders: true,
        numberCell: { show: false },
        scrollModel: { theme: true },
        selectionModel: {type: 'row', mode: 'block'},
        pageModel: {rPP: 500, type: "local", rPPOptions: [500, 1000, 2000]},
        toolbar: false,
    };

    obj.colModel = [
        { dataIndx: "checkBox", maxWidth: 30, minWidth: 30, align: "center", resizable: false, title: "", dataType: 'bool', editable: true,
            type: 'checkBoxSelection', cls: 'ui-state-default', sortable: false, editor: true,
            cb: {
                maxCheck: 1,
                select: true
            }
        },
        { title: "Centro", width: 265, dataType: "string", dataIndx: "C1", halign: "center", align: "center", editable: false },
        { title: "Descripción", width: 553, dataType: "strig", dataIndx: "C2", halign: "center", align: "left", editable: false, filter: { crules: [{ condition: 'contain' }] } },
    ];

    obj.dataModel = { data: data };

    $grid_secundaria = $("#div_grid_cliente").pqGrid(obj);
    
}

    // GRID CENTRO OPERATIVO USUARIO
function fn_set_grid_terciaria() {



    var data =  [
        { C1: 'AGR', C5: 'AGRUPACIÓN TOTAL EMPRESA' },
    ];

    var obj = {
        height: 225,
        showtop: true,
        filterModel: {
            on: true,
            mode: "AND",
            header: true,
        },
        rowBorders: true,
        showTitle: false,
        showBottom: false,
        collapsible: true,
        roundCorners: true,
        columnBorders: true,
        numberCell: { show: false },
        scrollModel: { theme: true },
        selectionModel: {type: 'row', mode: 'block'},
        pageModel: {rPP: 500, type: "local", rPPOptions: [500, 1000, 2000]},
        toolbar: false,
    };

    obj.colModel = [
        { dataIndx: "checkBox", maxWidth: 30, minWidth: 30, align: "center", resizable: false, title: "", dataType: 'bool', editable: true,
            type: 'checkBoxSelection', cls: 'ui-state-default', sortable: false, editor: true,
            cb: {
                maxCheck: 1,
                select: true
            }
        },
        { title: "Centro", width: 265, dataType: "string", dataIndx: "C1", halign: "center", align: "center", editable: false },
        { title: "Descripción", width: 553, dataType: "strig", dataIndx: "C5", halign: "center", align: "left", editable: false, filter: { crules: [{ condition: 'contain' }] } },
    ];

    obj.dataModel = { data: data };

    $grid_terciaria = $("#div_grid_usuario").pqGrid(obj);
	

}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_new() {
	

	$("#div_prin").hide();
    $("#div_tabla").show();
    $("#co_modif").html("<span class='glyphicon glyphicon-floppy-disk'></span> Nuevo");
}
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

function fn_limpiar(){
	
	$("#tx_cod_sist").val("");
    $("#tx_cod_sist_2").val("");
    $("#cb_estado").val("");
    $("#tx_cen_op_1").val("");
    $("#tx_cen_op_usu_1").val("");
    $("#tx_fecha_crea").val("");
    $("#tx_fecha_modif").val("");
    
   
}
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

function fn_carga_grilla() {
	
	var total_register;
   
    var dataModel = 
    {
        location: "remote",
        sorting: "local",
        dataType: "json",
        method: "POST",
        sortDir: ["up", "down"],
		async:false,
        url: url+"?"+jQuery.param( parameters ),
        getData: function (dataJSON) 
        {
			total_register = $.trim(dataJSON.totalRecords);
			var data = dataJSON.data;
			
			if(total_register>=1)
			{
				$("#co_excel").attr("disabled", false);
			}
            return { data: dataJSON.data};
        },
        error: function(jqErr, err_stat, err_str) // ERROR EN EL ASP
        {
			fn_mensaje_boostrap(jqErr.responseText, g_tit, $("") );
        }
    }
	
	$grid_principal.pqGrid( "option", "dataModel", dataModel );				
    $grid_principal.pqGrid( "refreshDataAndView" );
	$grid_principal.pqGrid( "option", "title", "Total Registros: "+total_register);
}

//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*//FUNCIONES MODAL -  combos
function fn_estado() {
	$("#cb_estado").html("<option value='' selected></option><option value='1'>ACTIVADO</option> <option value='2' >INACTIVO</option>");
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	

function fn_mensaje(id,mensaje,segundos) {

    $(id).show();
    $(id).html(mensaje);
    setTimeout(function(){$(id).html("");$(id).hide(); }, segundos);
}

