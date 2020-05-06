var g_modulo = "Administrador Central";
var g_tit = "Mantención de Buzones";

var $grid_principal;
var $grid_secundaria;
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
	fn_setea_grid_secundaria();
	

	//DIBUJA LOS ICONOS DE LOS BOTONES     
	$("#co_nuevo").html("<span class='glyphicon glyphicon-plus'></span> Nuevo");
    $("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");
	$("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");     
	$("#co_volver").html("<span class='glyphicon glyphicon-chevron-left'></span> Volver");
	$("#co_filtro").html("<span class='glyphicon glyphicon-search'></span> Filtro");
	
		//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
    //FUNCIONES DE CAMPOS
    fn_buzon();
    fn_area();
    

   
 
		//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
    //BOTONES-EVENTOS
	
    $("#co_nuevo").on("click", fn_new);   
	    
    
    $("#co_volver").on("click", function (e) {
        window.close();
    });

    $("#co_filtro").on("click", fn_filtro);
 	
 	/////////////////////////////////BOTON GENERAR/////////////////////////////////
    $("#co_aceptar").on("click", function() {
        if ($.trim($("#co_aceptar").text()) === "Aceptar") {
            if (fn_val_general())
                return;       
            $('#div_mant_bts').modal('hide');
			fn_mensaje_boostrap("Se generó", g_tit, $(""));
            $(window).scrollTop(0);
        }

	/////////////////////////////////BOTON MODIFICAR/////////////////////////////////
        else{ 
            if (fn_val_general())
                return;                             
            $('#div_mant_bts').modal('hide');
            fn_mensaje_boostrap("Se generó", g_tit, $(""));
            $(window).scrollTop(0);
             
        }
    });

    $("#co_confirm_yes").on( "click", function () {
        $grid_principal.pqGrid("deleteRow", { rowIndx: rowIndxG });
        $('#dlg_confirm').modal('hide');
    });

	
    $("#co_confirm_no").on( "click", function () {
        $('#dlg_confirm').modal('hide');
    });
    
	$("#co_aceptar").on("click", function () {

		if (grid_aux_secundaria.Checkbox('checkBox').getCheckedNodes().length < 1) {
			fn_mensaje('#msj_modal_atrib','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>ERROR, FAVOR SELECCIONAR UN CLIENTE</strong></div>',3000);
			return;
		}

		$("#id_cen_ope_cli").val(grid_aux_secundaria.Checkbox('checkBox').getCheckedNodes().map(function (ui) { return ui.C1; }));
		$("#tx_cen_op_1").val(grid_aux_secundaria.Checkbox('checkBox').getCheckedNodes().map(function (ui) { return ui.C2; }));

		$('#div_atrib_bts').modal('hide');
		
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
		$('#div_atrib_bts').modal('hide');		
	});

    
    $("#co_cancel2").on("click", function (e) {
		$('#div_usuario_bts').modal('hide');
	});
    

  
		//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
	//BOTONES 

    $("#co_volver").on("click", function (e) {
		$("#div_prin").show();
		$("#div_tabla").hide();
		fn_limpiar();	
		$(window).scrollTop(0);
    });
	
	    
	$("#co_leer").on("click", function () {
					
		if ($("#cb_empresa").val() ==""){
			fn_mensaje_boostrap("FAVOR SELECCIONAR EMPRESA", g_tit, $("#cb_empresa"));
						
	        return false;
	        
		};
		
	    if ($("#cb_estado").val()==""){
			fn_mensaje_boostrap("FAVOR DIGITAR MONEDA", g_tit, $("#cb_estado"));
	         
	         return false;
		};
	    
		if ($("#tx_cen_op_1").val()==""){
			fn_mensaje_boostrap("FAVOR DIGITAR DESCRIPCIÓN", g_tit, $("#tx_cen_op_1"));
			return false;
		}
		
		if ($("#tx_cen_op_usu_1").val()==""){
			fn_mensaje_boostrap("FAVOR DIGITAR FECHA INGRESO", g_tit, $("#tx_cen_op_usu_1"));
			return false;
		}

		if ($("#tx_fecha_crea").val()==""){
			fn_mensaje_boostrap("FAVOR SELECCIONAR ESTADO", g_tit, $("#tx_fecha_crea"));
			return false;
		}		

			fn_mensaje_boostrap("Se creó", g_tit, $(""));
            $(window).scrollTop(0);
	});

	$("#co_cliente").on("click", function () {
        $("#div_atrib_bts").modal({backdrop: "static",keyboard:false});
        $("#div_atrib_bts").on("shown.bs.modal", function () {
			$grid_secundaria.pqGrid("refreshDataAndView");
        	$("#div_atrib_bts div.modal-footer button").focus();
        });        
	});

	 $("#co_usuario").on("click", function () {
        $("#div_usuario_bts").modal({backdrop: "static",keyboard:false});
        $("#div_usuario_bts").on("shown.bs.modal", function () {
			$grid_terciaria.pqGrid("refreshDataAndView");
        	$("#div_usuario_bts div.modal-footer button").focus();
        });        
	});


	$("#tx_decim_cal").blur(function () {
        if ($("#tx_decim_cal").val() >= 10) {
            $("#tx_decim_cal").val("09");
        }
    });

    $("#tx_deci_desp").blur(function () {
        if ($("#tx_deci_desp").val() >= 10) {
            $("#tx_deci_desp").val("09");
        }
    });
   
    $("#co_cancel").on("click", function (){
        $('#div_mant_bts').modal('hide');
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
    $grid_secundaria.pqGrid({
		rowDblClick: function( event, ui ) {
			if (ui.rowData) {
				var dataCell = ui.rowData;
				$('#div_atrib_bts').modal('hide');
				$("#cb_buzon").val(dataCell.C1);
				$("#tx_nombre").val(dataCell.C2);
				$("#cb_area").val(dataCell.C3);	                 
				fn_mensaje_boostrap("Se selecciono la fila: " + dataCell.C1, g_tit, $());
			}
		}

	});

});

		
           
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~///////////////GRILLAS///////////////~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
// GRID PRINCIPAL
function fn_setea_grid_principal() {

    var data =  [
        { C1: 'OMEDING 0003', C2: 'ACTUALIZACION ESTADO DE MEDIDOR'},
        { C1: 'ACT EST MEDIDOR', C2: 'ACTUALIZACION ESTADO DE MEDIDOR- (NUEVO)'},  
    ];

    var obj = {
        height: "100%",
        showTop: true,
        showBottom:true,
        showHeader: true,
		roundCorners: true,
		rowBorders: true,
		columnBorders: true,
		postRenderInterval: -1,
		editable: false,
        editor: { type: "textbox", select: true, style: "outline:none;" },
		selectionModel: { type: 'cell' },
		numberCell: { show: true},
		title: "Recursos asociados al Buzón",
		pageModel: { type: "local" },
		scrollModel: { theme: true },
		toolbar:
		{
            cls: "pq-toolbar-export",
            items:[
                { type: "button", label: "Nuevo",  attr: "id=co_nuevo",  cls: "btn btn-primary btn-sm" },                
                { type: "button", label: "Filtro",   attr:"id=co_filtro",    cls:"btn btn-primary btn-sm"},
                { type: "button", label: "Excel",   attr:"id=co_excel",    cls:"btn btn-primary btn-sm"},
                { type: "button", label: "Cerrar",  attr: "id=co_cerrar",  cls: "btn btn-secondary btn-sm"},
                
            ]
         },
	};

	obj.colModel = [
		{ title: "Recurso", width: 200, dataType: "string", dataIndx: "C1", halign: "center", align: "center" },
		{ title: "Nombre de Recurso", width: 500, dataType: "string", dataIndx: "C2", halign: "center", align: "left" },
		{ title: "Eliminar", width: 110, dataType: "string", halign: "center", align: "center", editable: false, sortable: false,
			render: function () {
				return "<button class='btn btn-sm btn-primary' id='co_cerrar_prin' type='button'><span class='glyphicon glyphicon-trash'></span></button>";
			},
			postRender: function (ui) {
				var rowIndx = ui.rowIndx;
				var $grid = this;
				$grid = $grid.getCell(ui);
				$grid.find("button").on("click", function () {
					
					fn_borrar(rowIndx);
				});
			}
		}
	];
    obj.dataModel = { data: data };

    $grid_principal = $("#div_grid_principal").pqGrid(obj);

}

	// GRID SECUNDARIA
		function fn_setea_grid_secundaria() {
	
	var obj = {
		height: "300",
		showTop: true,
		showBottom: true,
		showHeader: true,
		roundCorners: true,
		rowBorders: true,
		columnBorders: true,
		editable: false,
		filterModel: {
            on: true,
            mode: "AND",
            header: true,
        },
		editor: { type: "textbox", select: true, style: "outline:none;" },
		selectionModel: { type: 'cell' },
		numberCell: { show: true},
		title: "",
		pageModel: { type: "local" },
		scrollModel: { theme: true },		
        editModel: {
            clicksToEdit: 1,
            keyUpDown: true,
            pressToEdit: true,
            cellBorderWidth: 0
        },
		dataModel:{ data: [
             { C1: '1', C2: 'ROL FUNCION CAME INGRESA', C3: '1' },
             { C1: '2', C2: 'ROL FUNCION CAME RECEPCIONA', C3: '2' },
                        
        ] }
	};
	
    obj.colModel = [
    	{ title: "Buzón", width: 300, dataType: "string", dataIndx: "C1", halign: "center",  align:"center", filter: { crules: [{ condition: 'contain' }] } },
		{ title: "Nombre", width: 300, dataType: "string", dataIndx: "C2", halign: "center",  align:"center", filter: { crules: [{ condition: 'contain' }] } },
		{ title: "Área", width: 150, dataType: "string", dataIndx: "C3", halign: "center", align: "center", filter: { crules: [{ condition: 'contain' }] } },			
	];

	$grid_secundaria = $("#div_grid_secundaria").pqGrid(obj);
	$grid_secundaria.pqGrid("refreshDataAndView");
   
		}

		/////////////////////////////////FUNCIONES///////////////////////////////////////////

		function fn_filtro(){

	    $("#title_mod").html("Filtrar");
	    $("#tx_nombre").prop( "disabled", true);
	    $("#cb_area").prop( "disabled", true);
		
		fn_limpiar();	    

	    $("#div_mant_bts").modal({backdrop: "static",keyboard:false});
	    $("#div_mant_bts").on("shown.bs.modal", function () {
	    $("#div_mant_bts div.modal-footer button").focus();
	    });
	}

		function fn_borrar(rowIndx) {

	    $("#confirm_msg").html("¿Estas seguro de que quieres eliminar la fila " + (rowIndx + 1) + "?");

	    rowIndxG = rowIndx;

	    $("#dlg_confirm").modal({backdrop: "static",keyboard:false});
	    $("#dlg_confirm").on("shown.bs.modal", function () {
	        $("#dlg_confirm div.modal-footer button").focus();
	    });

	}

		//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
		function fn_new() {
		
		
		//$("#co_aceptar").html("<span class='glyphicon glyphicon-floppy-disk'></span> Generar");
		$("#tx_cod_moned").prop( "disabled", true);

		fn_limpiar();

		$("#div_atrib_bts").modal({backdrop: "static",keyboard:false});
	    $("#div_atrib_bts").on("shown.bs.modal", function () {
	    	$grid_secundaria.pqGrid("refreshDataAndView");
	    	 
	 
	    });

	}
		//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

		function fn_limpiar(){
	$("#cb_buzon").val("");
	$("#tx_nombre").val("");
	$("#cb_area").val("");
	
   
	}

////////////////////FUNCION GENERAL MENSAJES//////////////////////////////////////////////
        function fn_val_general(){

    if ($("#cb_buzon").val() === "") {
		fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR BUZÓN!!!</strong></div>',3000);
		$("#cb_buzon").focus();
		return true;
	}
		
	return false;
    }


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
function fn_buzon() {
	$("#cb_buzon").html("<option value='' selected></option><option value='1'>CAME INGRESA</option> <option value='2' >CAME RECEPCIONA</option>");
}

function fn_area() {
	$("#cb_area").html("<option value='' selected></option><option value='1'>0000</option> <option value='2' >1000</option>");
}


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	

function fn_mensaje(id,mensaje,segundos) {

    $(id).show();
    $(id).html(mensaje);
    setTimeout(function(){$(id).html("");$(id).hide(); }, segundos);
}
