var g_modulo = "Tratamiento de Ordenes Masivas";
var g_tit = "Mantenci&oacute;n de sistemas";

var $grid_principal;
var $grid_2;
var $grid_3;
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

	//DIBUJA LOS ICONOS DE LOS BOTONES     
	$("#co_nuevo").html("<span class='glyphicon glyphicon-plus'></span> Nuevo");
	$("#co_editar").html("<span class='glyphicon glyphicon-pencil'></span> Modificar");

    $("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");
	$("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");
    
	$("#co_nuevo2").html("<span class='glyphicon glyphicon-plus'></span> Nuevo");

    $("#co_excel2").html("<span class='glyphicon glyphicon-save'></span> Excel");
    
    
	$("#co_volver").html("<span class='glyphicon glyphicon-chevron-left'></span> Volver");
	
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
    //FUNCIONES DE CAMPOS
    fn_estado();
    //fn_lect();
 
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
    //BOTONES-EVENTOS
	
    $("#co_nuevo").on("click", fn_new);
	
    $("#co_editar").on("click", function (e) {
		fn_modal(2);
	});
	
    $("#co_nuevo2").on("click", function (e) {
		fn_modal2(1);
	});
	
    
    
    $("#co_volver").on("click", function (e) {
        window.close(); 
    }); 
 

    
	//BOTONES CERRAR DE LOS MODALES
    $("#co_close").on("click", function (e) {
		$('#div_modal').modal('hide');
		fn_limpia_modal();
	});
    
    $("#co_close2").on("click", function (e) {
		$('#div_modal2').modal('hide');
		fn_limpia_modal2();
	});
    
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
	/*jQuery('#tx_lec_ant').keypress(function (tecla) {
		if (tecla.charCode < 48 || tecla.charCode > 57) return false;
	});*/
  
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
	//BOTONES 

    $("#co_volver").on("click", function (e) {
		$("#div_prin").show();
		$("#div_tabla").hide();
		fn_limpiar();	
		$(window).scrollTop(0);
    });
	
	    
	$("#co_modif").on("click", function () {
					
		if ($("#tx_cod_sist").val() ==""){
			fn_mensaje_boostrap("FAVOR DIGITAR CODIGO SISTEMA", g_tit, $("#cb_regional"));
			fn_lim_fil_reg();
			
	        return false;
	        
		};
		
	    if ($("#cb_estado").val()==""){
			fn_mensaje_boostrap("FAVOR SELECCIONAR ESTADO", g_tit, $("#cb_ciclo"));
	         fn_lim_fil_ci();
	         return false;
		};
	    
		if ($("#tx_cen_op_1").val()==""){
			fn_mensaje_boostrap("FAVOR DIGITAR CENTRO OPERATIVO CLIENTE", g_tit, $("#cb_ruta"));
			return false;
		}
		
		if ($("#tx_cen_op_usu_1").val()==""){
			fn_mensaje_boostrap("FAVOR DIGITAR CENTRO OPERATIVO USUARIO", g_tit, $("#cb_ruta"));
			return false;
		}

		if ($("#tx_fecha_crea").val()==""){
			fn_mensaje_boostrap("FAVOR DIGITAR FECHA CREACIÓN", g_tit, $("#cb_ruta"));
			return false;
		}

		if ($("#tx_fecha_modif").val()==""){
			fn_mensaje_boostrap("FAVOR DIGITAR FECHA MODIFICACIÓN", g_tit, $("#cb_ruta"));
			return false;
		}

	    fn_carga_grilla();
	    $('#div_modal').modal('hide');
	});
    
	$("#co_limpiar").on("click", function () {
		if ($.trim($("#co_limpiar").text()) == "Limpiar") {
		    fn_limpia_modal();
			return;
		}
		else
			window.close();
	});


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
	
	$("#div_modal").draggable({
        handle: ".modal-header"
    });
	
    $("#div_modal2").draggable({
        handle: ".modal-header"
    });

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
//EXCEL    
	$("#co_excel").on("click", function (e) {
		
		fn_filtro();
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
			$("#sql").val(sql_grid_prim);	
			$("#frm_Exel").submit();
			return;
		}	
    });
			
    
    $("#co_excel2").on("click", function (e) {
		e.preventDefault();
		fn_filtro_2();
        var col_model=$( "#div_grid_sec" ).pqGrid( "option", "colModel" );
		var cabecera = "";
		for (i=0; i< col_model.length; i++){
			if(col_model[i].hidden != true) cabecera += "<th>"+col_model[i].title+ "</th>";
		}
		$("#excel_cabecera").val(cabecera);
		var element =$grid_2.pqGrid("option","dataModel.data");
		if (element)
			a= element.length;
		else 
			a= 0;
		if(a>0){
			$("#tituloexcel").val(g_tit);
			$("#sql").val(sql_grid_dos);	
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
				}
			}
	});	
	
});
           
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
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
             { C1: 'AIC', C2: 'ATENCIÓN INTEGRAL DE CLIENTE', C3: '1', C4: 'AGRUPACIÓN 1', C5: 'AGRUPACION TOTAL EMPRESA', C6: '01/04/2020', C7: '01/04/2020' }, 
                        
        ] }
	};
	
    obj.colModel = [
    	{ title: "Sistema", width: 350, dataType: "string", dataIndx: "C1", halign: "center",  align:"center", hidden: "true" },
		{ title: "Descripción", width: 350, dataType: "string", dataIndx: "C2", halign: "center",  align:"center" },
		{ title: "Estado", width: 100, dataType: "string", dataIndx: "C3", halign: "center", align: "center", hidden: "true" },
		{ title: "Centro Operativo Cliente", width: 100, dataType: "string", dataIndx: "C4", halign: "center", align: "center", hidden: "true" },
		{ title: "Centro Operativo Usuario", width: 80, dataType: "number", dataIndx: "C5", halign: "center", align: "right", hidden: "true" },
		{ title: "Fecha Creación", width: 80, dataType: "number", dataIndx: "C6", halign: "center", align: "right", hidden: "true" },
		{ title: "Fecha Modificación", width: 80, dataType: "number", dataIndx: "C7", halign: "center", align: "right", hidden: "true" },
 
	];

	$grid_principal = $("#div_grid_principal").pqGrid(obj);
	$grid_principal.pqGrid("refreshDataAndView");
   
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_new() {
	

	$("#div_prin").hide();
    $("#div_tabla").show();
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_limpia_modal() 
{
	$("#cb_sistema").val("");
	$("#tx_nomtabla").val("");
	$("#tx_desc").val("");
	$("#cb_modif").val("");	
}

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
	
	fn_filtro();
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
			sql_grid_prim = dataJSON.sql;
			
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

//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

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
		}else{
		return false;
		}
	}
	else {
	return false;
	}
}

