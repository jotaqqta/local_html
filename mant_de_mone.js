var g_modulo = "Administrador Central";
var g_tit = "Mantenedor de Monedas";

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

	jQuery('#tx_cod_mone').keypress(function (tecla){
        if (tecla.charCode < 48 || tecla.charCode > 57) return false;
    });

    jQuery('#tx_cod_moned').keypress(function (tecla){
        if (tecla.charCode < 48 || tecla.charCode > 57) return false;
    });

    jQuery('#tx_decim_cal').keypress(function (tecla){
        if (tecla.charCode < 48 || tecla.charCode > 57) return false;
    });

    jQuery('#tx_deci_desp').keypress(function (tecla){
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
	

	//DIBUJA LOS ICONOS DE LOS BOTONES     
	$("#co_nuevo").html("<span class='glyphicon glyphicon-plus'></span> Nuevo");
    $("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");
	$("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");     
	$("#co_volver").html("<span class='glyphicon glyphicon-chevron-left'></span> Volver");
	
		//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
    //FUNCIONES DE CAMPOS
    fn_empresa();
    fn_estado();
    fn_esta();

   
 
		//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
    //BOTONES-EVENTOS
	
    $("#co_nuevo").on("click", fn_new);   
	    
    
    $("#co_volver").on("click", function (e) {
        window.close();
    }); 
 	
 	/////////////////////////////////BOTON GENERAR/////////////////////////////////
    $("#co_aceptar").on("click", function() {
        if ($.trim($("#co_aceptar").text()) === "Generar") {
            if (fn_val_general())
                return;       
            $('#div_atrib_bts').modal('hide');
			fn_mensaje_boostrap("Se generó", g_tit, $(""));
            $(window).scrollTop(0);
        }

	/////////////////////////////////BOTON MODIFICAR/////////////////////////////////
        else{ 
            if (fn_val_general())
                return;                             
            $('#div_atrib_bts').modal('hide');
            fn_mensaje_boostrap("Se modificó", g_tit, $(""));
            $(window).scrollTop(0);
             
        }
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
					
                  	$("#modal_select_title").html("Editar");
                  	$("#co_aceptar").html("<span class='glyphicon glyphicon-pencil'></span> Modificar");
                  	$("#tx_cod_moned").val(dataCell.C1);
                  	$("#tx_desc").val(dataCell.C2);
                  	$("#cb_esta").val(dataCell.C3);
                    $("#tx_simbo").val(dataCell.C4);
                    $("#tx_decim_cal").val(dataCell.C5);
                    $("#tx_deci_desp").val(dataCell.C6);
                    $("#tx_fech_ingreso").val(dataCell.C7);
                    $("#tx_fech_modif").val(dataCell.C8);
                    $("#tx_rol_modif").val(dataCell.C9);
                    $("#tx_cod_moned").prop( "disabled", true);
                    

                    $("#div_atrib_bts").modal({backdrop: "static",keyboard:false});
					$("#div_atrib_bts").on("shown.bs.modal", function () {
					$("#div_atrib_bts div.modal-footer button").focus();

				});				
			}
		}

	});

});

		
           
		//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~///////////////GRILLAS///////////////~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
    	// GRID PRINCIPAL
		function fn_setea_grid_principal() {
	
	var obj = {
		height: "300",
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
                //{ type: "button", label: "Cerrar",   attr: "id=co_cerrar", cls: "btn btn-secondary btn-sm" }               
				]
		},
        editModel: {
            clicksToEdit: 1,
            keyUpDown: true,
            pressToEdit: true,
            cellBorderWidth: 0
        },
		dataModel:{ data: [
             { C1: '1', C2: 'BALBOA', C3: 'A', C4: 'B', C5: '2', C6: '2', C7: '20/04/2020', C8: '20/04/2020', C9: 'TEST' },
             { C1: '2', C2: 'DOLAR', C3: 'A', C4: 'US$', C5: '2', C6: '2', C7: '20/04/2020', C8: '20/04/2020', C9: 'RLU' },
                        
        ] }
	};
	
    obj.colModel = [
    	{ title: "Cod. Moneda", width: 100, dataType: "string", dataIndx: "C1", halign: "center",  align:"center"},
		{ title: "Descripci&oacute;n", width: 100, dataType: "string", dataIndx: "C2", halign: "center",  align:"center" },
		{ title: "Estado", width: 100, dataType: "string", dataIndx: "C3", halign: "center", align: "center" },
		{ title: "Símbolo", width: 100, dataType: "string", dataIndx: "C4", halign: "center", align: "center" },
		{ title: "Dec. Calculo", width: 100, dataType: "number", dataIndx: "C5", halign: "center", align: "center" },
		{ title: "Dec. Despliegue", width: 100, dataType: "number", dataIndx: "C6", halign: "center", align: "center" },
		{ title: "Fecha Ingreso", width: 100, dataType: "number", dataIndx: "C7", halign: "center", align: "center" },
		{ title: "Fecha Modificación", width: 100, dataType: "number", dataIndx: "C8", halign: "center", align: "center" },
		{ title: "Rol Modificador", width: 100, dataType: "number", dataIndx: "C9", halign: "center", align: "center" },
 
	];

	$grid_principal = $("#div_grid_principal").pqGrid(obj);
	$grid_principal.pqGrid("refreshDataAndView");
   
		}

		//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
		function fn_new() {

		
		$("#modal_select_title").html("Nuevo");
		$("#co_aceptar").html("<span class='glyphicon glyphicon-floppy-disk'></span> Generar");
		$("#tx_cod_moned").prop( "disabled", true);

		fn_limpiar();

		$("#div_atrib_bts").modal({backdrop: "static",keyboard:false});
	    $("#div_atrib_bts").on("shown.bs.modal", function () {
	    $("#div_atrib_bts div.modal-footer button").focus();
	    	 
	 
	    });

	}
		//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

		function fn_limpiar(){
	$("#tx_cod_moned").val("");
	$("#tx_desc").val("");
	$("#cb_esta").val("");
	$("#tx_simbo").val("");
    $("#tx_decim_cal").val("");
    $("#tx_deci_desp").val("");
    $("#tx_deci_desp").val("");
    $("#tx_fech_ingreso").val("");
    $("#tx_fech_modif").val("");
    $("#tx_rol_modif").val("");       
   
	}

////////////////////FUNCION GENERAL MENSAJES//////////////////////////////////////////////
        function fn_val_general(){

    if ($("#tx_cod_moned").val() === "") {
		fn_mensaje('#msj_modal_atrib','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR CÓDIGO MONEDA!!!</strong></div>',3000);
		$("#tx_cod_moned").focus();
		return true;
	}

	if ($("#tx_desc").val() === "") {
		fn_mensaje('#msj_modal_atrib','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR DESCRIPCIÓN!!!</strong></div>',3000);
		$("#tx_desc").focus();
		return true;
	}

	if ($("#cb_esta").val() === "") {
		fn_mensaje('#msj_modal_atrib', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR ESTADO!!!</strong></div>', 3000);
		$("#cb_esta").focus();
		return true;
	}

	if ($("#tx_simbo").val() === "") {
		fn_mensaje('#msj_modal_atrib','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR SÍMBOLO!!!</strong></div>',3000);
		$("#tx_simbo").focus();
		return true;
	}

	if ($("#tx_decim_cal").val() === "") {
		fn_mensaje('#msj_modal_atrib','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR DECIMALES CALCULO!!!</strong></div>',3000);
		$("#tx_decim_cal").focus();
		return true;
	}

	if ($("#tx_deci_desp").val() === "") {
		fn_mensaje('#msj_modal_atrib', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR DECIMALES DESPLIEGUE!!!</strong></div>', 3000);
		$("#tx_deci_desp").focus();
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
function fn_empresa() {
	$("#cb_empresa").html("<option value='' selected></option><option value='1'>IDAAN</option> <option value='2' >ACUAVALLE</option>");
}

function fn_estado() {
	$("#cb_estado").html("<option value='' selected></option><option value='1'>ACTIVADO</option> <option value='2' >INACTIVO</option>");
}

function fn_esta() {
	$("#cb_esta").html("<option value='' selected></option><option value='1'>ACTIVADO</option> <option value='2' >INACTIVO</option>");
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	

function fn_mensaje(id,mensaje,segundos) {

    $(id).show();
    $(id).html(mensaje);
    setTimeout(function(){$(id).html("");$(id).hide(); }, segundos);
}
