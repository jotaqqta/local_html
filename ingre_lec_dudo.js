var g_modulo = "Facturacin Clientes - Lecturas y Consumos";
var g_tit = "Ingreso de Lecturas Dudosas tomadas en terreno.";
var $grid_principal;

var parameters = {};
var Filtros = [];
var sql_grid_prim = "";
//var g_act = "0";

var glector = "";
var gfechat = "";
			
var url = "ingre_lec_dudo.asp";

var dataReg = [];
var flag = 0;

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
$(document).keydown(function (e) {

	if (e.keyCode === 8) {
		var element = e.target.nodeName.toLowerCase();
		if ((element != 'input' && element != 'textarea') || $(e.target).attr("readonly")) {
			return false;
		}
	}
});


//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
$(document).ready(function () {

	// PARA ELIMINAR EL SUBMIT
	$("button").on("click", function () { return false; });
	//INGRESA LOS TITULOS
	document.title = g_tit;
	document.body.scroll = "yes";
	
	$("#div_header").load("/raiz/syn_globales/header.htm", function () {
		$("#div_mod0").html(g_modulo);
		$("#div_tit0").html(g_tit);
	});
	
	//Footer
	$("#div_footer").load("/raiz/syn_globales/footer.htm");
	
	
	$("#excel_archivo").val("lectura_dudosa.xls");
	
	// INICIA CON EL CURSOR EN EL CAMPO No. ORDEN
	$("#tx_orden").focus();
	// EL CAMPO No. Orden lo limito a 8 digitos y solo numeros
	jQuery('#tx_orden').keypress(function (tecla) {
		if (tecla.charCode < 48 || tecla.charCode > 57) return false;
	});
	
	//Se cargan las variables que vienen desde el server
	$("#tx_empresa").val(SYNSegCodEmpresa);
	$("#tx_rol").val(SYNSegRol);
	$("#tx_ip").val(SYNSegIP);
	$("#tx_rolfun").val(SYNSegRolFuncion);
	  
    // INICIA CON EL CURSOR EN EL CAMPO FECHA
	
	$("._input_selector").inputmask("dd/mm/yyyy");
    
	//DEFINE LA GRILLA PRINCIPAL
	fn_setea_grid_principal();
	//DIBUJA LOS ICONOS DE LOS BOTONES     
	$("#co_filtro").html("<span class='glyphicon glyphicon-search'></span> Filtros");
	$("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");
	$("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");
    
	$("#co_cerrar_t").html("<span class='glyphicon glyphicon-off'></span> Cerrar");
	$("#co_leer").html("<span class='glyphicon glyphicon-book'></span> Lectura");
	//$("#co_act").html("<span class='glyphicon glyphicon-check'></span> Actualizar");
    
	$("#co_rut_no_lei").html("<span class='glyphicon glyphicon glyphicon-remove'></span> Marcar ruta como no leida");

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
    //FUNCIONES DE CAMPOS
    fn_regional();
    fn_lect();
 
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
    //BOTONES-EVENTOS
	
    $("#co_filtro").on("click", fn_Muestra_Filtro);

	
    $("#co_cerrar_t").on("click", function (e) {
        window.close(); 
    }); 
 
	$("#co_leer").on("click", function (e) {
		fn_Muestra_Lectura();
	});
	
	/*$("#co_act").on("click", function (e) {
		fn_actualizar();
	});*/
	
    $("#co_rut_no_lei").on("click", function (e) {
		 
		//alert(dataReg.C1 +  "-" +  dataReg.C2);
		
		$("#dlg_confirmamod").modal({backdrop: "static",keyboard:false});					
		$("#dlg_confirmamod").on("shown.bs.modal", function () {
			$("#co_confirmamod_no").focus();
				});
    	
	});
    
	$("#co_close").on("click", function (e) {
		$('#div_filtro_bts').modal('hide');
		 
		fn_limpia_filtro();
	});
         
     $("#co_close_lec").on("click", function (e) {
		$('#div_lec_bts').modal('hide');
	});
     $("#co_close_act").on("click", function (e) {
		$('#div_act_bts').modal('hide');
	});
         
    
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	

	// COMBO REGIONAL - AL SELECCIONAR la regional se carga el sector
	$("#cb_regional").on("change", function(evt) 
	{
		fn_ciclo($(this).val());
	});
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	

	// COMBO CICLO - AL SELECCIONAR la regional se carga el sector
	$("#cb_ciclo").on("change", function(evt) 
	{
		fn_ruta($(this).val());
	});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
	$("._input_selector").inputmask("dd/mm/yyyy");

	/*jQuery('#tx_lec_ant').keypress(function (tecla) {
		if (tecla.charCode < 48 || tecla.charCode > 57) return false;
	});*/
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
    //BOTONES
    
    //BOTONES-FILTRO
	$("#co_aceptar").on("click", function () {
		//Validacin de informacion
		//if ($.trim($("#co_aceptar").text()) == "Aceptar") {
			
			if ($("#cb_regional").val() ==""){
				fn_mensaje_boostrap("CAMPO REGIONAL OBLIGATORIOS", g_tit, $("#cb_regional"));
				fn_lim_fil_reg();
				
                return false;
                
			};
			
            if ($("#cb_ciclo").val()==""){
				fn_mensaje_boostrap("CAMPO CICLO OBLIGATORIO", g_tit, $("#cb_ciclo"));
                 fn_lim_fil_ci();
                 return false;
			};
            
			if ($("#cb_ruta").val()==""){
				fn_mensaje_boostrap("CAMPO RUTA OBLIGATORIO", g_tit, $("#cb_ruta"));
				return false;
			}
			
            fn_carga_grilla();
            $('#div_filtro_bts').modal('hide');
            //fn_lim_filtro(); 
                
            
        //}
	});
    
	$("#co_limpiar").on("click", function () {
		
		if ($.trim($("#co_limpiar").text()) == "Limpiar") {
		    fn_lim_filtro();
			return;
		}
		else
			window.close();
	});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
     //BOTONES-LECTURA
    $("#co_aceptar_lec").on("click", function (){
			if ($("#cb_lector").val() == ""){
                    fn_mensaje_boostrap("DIGITE LECTOR", g_tit, $("#cb_lector"));
				
				    return false;
             
			}	
			
		    if (fn_validar_fecha($("#fec_lect").val()) == false) {
							fn_mensaje_boostrap("DEBE DILIGENCIAR EL CAMPO FECHA DE PROCESO. EL FORMATO ES DD/MM/YYYY.", g_tit, $("#fec_lect"));
							return false;
			}	
			
			//Validar la fecha cuando se ingrese unicamente
			if ( $("#fec_lect").val() != "" ) {
					
						var parameters = {
							"func"       : "fn_validafecha",
							"empresa"    : $("#tx_empresa").val(),
							"RolFun"     : $("#tx_rolfun").val(),
							"rol"        : $("#tx_rol").val(),
							"ip"         : $("#tx_ip").val(),	
							"p_fecha"    : $("#fec_lect").val(),
							"p_ciclo"    : $("#cb_ciclo").val(),	
						};

						HablaServidor(url,parameters,"text", function(text) 
						{
						 
						   if(text == ""){
							  fn_mensaje_boostrap("NO EXISTEN DATOS DE LECTURA PARA EL CICLO: " + $("#cb_ciclo").val(), g_tit, $(""));
							  $grid_principal.pqGrid( "refreshDataAndView" );
							  g_act = "1";
							  return false;	
						   }
						   else
						   {
								var param    = text.split("|");
								var fechalec = param[0];
								var fechafac = param[1];
								var verifica = param[2];
								
								if (verifica == "N"){
									fn_mensaje_boostrap("VERIFIQUE LA FECHA DE TERRENO. RANGO SUGERIDO ENTRE:" + fechalec + " Y " + fechafac, g_tit, $(""));
									$grid_principal.pqGrid( "refreshDataAndView" );
									g_act = "1";
									return false;
								}
							}
						});	
			}

			
			$('#div_lec_bts').modal('hide');
			    
	});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
	
	$("#div_filtro_bts").draggable({
        handle: ".modal-header"
    });
	
    Filtros = [];

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
			
    //////////////////////////////////////////////////////////////////////
 	//BOTONES DE ACEPTAR SI ACEPTA LA CONFIRMACION DE MODIFICACION
	/*
	$("#co_confirmamod_si").on("click", function(e){
		$("#dlg_confirmamod").modal("hide");
	

	    fn_actualiza_datos('030','0',dataReg.C1,dataReg.C2,dataReg.C7,dataReg.C13,dataReg.C14,dataReg.C10,dataReg.C11);
				
	    $grid_principal.pqGrid( "refreshDataAndView" );
		//fn_carga_grilla();
	});
	*/
				
					
	$("#co_confirmamod_no").on("click", function (e){
			$("#dlg_confirmamod").modal("hide");
			
	});
			
	//////////////////////////////////////////////////////////////////////
	$grid_principal.pqGrid({
    cellClick: function( event, ui ) { 
        
		dataReg = ui.rowData;
		//		alert(ui.dataIndx);
			
	}
	
	});		
			
	//evento cuando se  editar la grilla
	$grid_principal.pqGrid({
    	editorEnd: function( event, ui ) {
			//alert(ui.dataIndx);
			
			var glector = $("#cb_lector").val();
			var gfechat = $("#fec_lect").val();
			var rowIndx =  ui.rowIndx  
			var dataCell = ui.rowData;
			
			
			if($.trim(dataCell.C9) == ""){
			   $grid_principal.pqGrid("updateRow", { 'rowIndx': ui.rowIndx  , row: { 'C9': dataCell.C11 } });
			   fn_mensaje_boostrap("VALOR NO VALIDO", g_tit, $(""))    
		       return false;
			
			}
			
			
			
			if (ui.dataIndx == "C8")  {
				if (fn_valida_clave(dataCell.C8,dataCell.C10, ui.rowIndx )){
					//$grid_principal.pqGrid("updateRow", { 'rowIndx': ui.rowIndx  , row: { 'C8': dataCell.C10 } });
				}
				else{
					$grid_principal.pqGrid("updateRow", { 'rowIndx': ui.rowIndx  , row: { 'C8': dataCell.C10 } });
					setTimeout(function(){
						$("#div_grid_principal").pqGrid( "setSelection", {rowIndx: (ui.rowIndx+1),colIndx: 7, focus:true} );
					}, 100);
				}	
			}
			
			if (ui.dataIndx == "C9")
			{
				//Validar nuevamente la clave
				if(dataCell.C9 != ""){
					if (fn_valida_clave(dataCell.C8,dataCell.C10, ui.rowIndx )){
						fn_actualiza_datos(dataCell.C8,dataCell.C9,dataCell.C1,dataCell.C2,dataCell.C7,dataCell.C13,dataCell.C14,dataCell.C10,dataCell.C11 );
						setTimeout(function(){
							$("#div_grid_principal").pqGrid( "setSelection", {rowIndx: (ui.rowIndx+1),colIndx: 7, focus:true} );
						}, 100);
					}	
				}
         	}
			
       	}	

     });
	    	 
	 
});
           
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_setea_grid_principal() {
	
	var obj = {
		height: 540,
		showTop: true,
		showBottom: true,
		showHeader: true,
		roundCorners: true,
		rowBorders: true,
		columnBorders: true,
		editable: true,
		editor: { type: "textbox", select: true, style: "outline:none;" },
		selectionModel: { type: 'cell' },
		numberCell: { show: true},
		title: "Ingreso de Lecturas Dudosas tomadas en terreno",
		pageModel: { type: "local" },
		scrollModel: { theme: true },
		toolbar:
		{
			cls: "pq-toolbar-export",
			items:[
				{ type: "button", label: "Filtros",    attr: "id=co_filtro", cls: "btn btn-primary" },
				{ type: "button", label: "Lectura",    attr: "id=co_leer",   cls: "btn btn-primary" },
                { type: "button", label: "Marcar ruta como no leda", attr: "id=co_rut_no_lei", cls: "btn btn-primary btn-sm" },
				{ type: "button", label: "Excel",      attr: "id=co_excel",  cls: "btn btn-primary btn-sm" },                 
                { type: "button", label: "Cerrar",     attr: "id=co_cerrar_t", cls: "btn btn-secondary btn-sm" }               
				]
		},
        editModel: {
            clicksToEdit: 1,
            keyUpDown: true,
            pressToEdit: true,
            cellBorderWidth: 0
        },
			/*
		 ,editorKeyDown: function( event, ui ) {
			var x = event.which || event.keyCode;
			var grid = this;
			if(x==13)
			{	
				
				//JJS
				//var rowIndx =  ui.rowIndx  
				var dataCell = ui.rowData;
				if (ui.dataIndx == "C8")  {
					if (fn_valida_clave(dataCell.C8,dataCell.C10, ui.rowIndx )){
						//$grid_principal.pqGrid("updateRow", { 'rowIndx': ui.rowIndx  , row: { 'C8': dataCell.C10 } });
					}
					else{
						$grid_principal.pqGrid("updateRow", { 'rowIndx': ui.rowIndx  , row: { 'C8': dataCell.C10 } });
						setTimeout(function(){
							$("#div_grid_principal").pqGrid( "setSelection", {rowIndx: (ui.rowIndx+1),colIndx: 7, focus:true} );
						}, 100);
					}
				}
				
				//JJS
				alert(dataCell.C9);
				if(ui.dataIndx=="C9") // || flag == 0) //Si la clave fue incorrecta
				{	
					if(dataCell.C9 != ""){
						if (fn_valida_clave(dataCell.C8,dataCell.C10, ui.rowIndx )){
							fn_actualiza_datos(dataCell.C8,dataCell.C9,dataCell.C1,dataCell.C2,dataCell.C7,dataCell.C13,dataCell.C14,dataCell.C10,dataCell.C11 );
							setTimeout(function(){
								$("#div_grid_principal").pqGrid( "setSelection", {rowIndx: (ui.rowIndx+1),colIndx: 7, focus:true} );
							}, 100);
						}	
					}						
				}
				
			}
		},*/
		dataModel:{ data: [] }
	};
	obj.colModel = [
		{ title: "NIC",     width: 20, dataType: "number", dataIndx: "C1", halign: "center", align: "center", editable:false },
		{ title: "Medidor", width: 90, dataType: "number", dataIndx: "C2", halign: "center", align: "center", editable:false  },
		{ title: "N.D",     width: 5, dataType: "number", dataIndx: "C3", halign: "center", align: "center", editable:false  },
		{ title: "Nombre Cliente", width: 200, dataType: "string", dataIndx: "C4", halign: "center", align: "center", editable:false  },
		{ title: "Direccin", width: 300, dataType: "string", dataIndx: "C5", halign: "center", align: "center", editable:false  },
		{ title: "Sec. Ruta", width: 120, dataType: "string", dataIndx: "C6", halign: "center", align: "center", editable:false  },
		{ title: "T. Med",  width: 20, dataType: "string", dataIndx: "C7", halign: "center", align: "center", editable:false },
		{ title: "Clave",   width: 20, dataType: "string", dataIndx: "C8", halign: "center", align: "center", editor: {type: "textbox" } },
		{ title: "Lectura tomada", width:120, dataType: "integer", dataIndx: "C9", halign: "center", align: "right", editor: {type: "textbox" }
			,editable: function(ui){
			var dataCell = ui.rowData;
			var rowIndx = ui.rowIndx;
			return (flag === 1); 
			}
		},

		{ title: "Clave2",  width: 10, dataType: "number", dataIndx: "C10", halign: "center", align: "center", hidden:true  },
		{ title: "Lectura2 ", width:110, dataType: "number", dataIndx: "C11", halign: "center", align: "center" , hidden:true},
		{ title: "Lector ", width:110, dataType: "number", dataIndx: "C12", halign: "center", align: "center" , hidden:true},
		{ title: "Marca ",  width:110, dataType: "number", dataIndx: "C13", halign: "center", align: "center" , hidden:true},
		{ title: "Modelo ", width:110, dataType: "number", dataIndx: "C14", halign: "center", align: "center" , hidden:true}
		    
	];

	$grid_principal = $("#div_grid_principal").pqGrid(obj);
	$grid_principal.pqGrid("refreshDataAndView");
}

//************************************************************

function fn_valida_clave(clave1,  clave2, fila){
	//lectura1, , lectura2
	flag = 0;
	
	if ( $("#cb_lector").val() == "") {
		fn_mensaje_boostrap("DEBE DILIGENCIAR LOS DATOS DEL LECTOR Y LA FECHA DE TERRENO", g_tit, $("#co_leer"));
		//g_act = "1";
		return false;
	}    
	
	parameters = 
	 {
		 "func"       : "fn_valida_clave",
		 "empresa"    : $("#tx_empresa").val(),
		 "p_clavelec" : clave1 ,      
		 //"p_lecterr"  : lectura1,
	 };
   
	 HablaServidor(url,parameters,'text', function(text) 
	 {
		resp = text;
		//$grid_principal.pqGrid("updateRow", { 'rowIndx': fila , row: { 'C15': 1 } });
	 });
	
	 if(resp == 0){
		fn_mensaje_boostrap("CLAVE DE LECTURA NO EXISTE!!!", g_tit, $(""));
		//g_act = "1";  
		return false;
	 }
	 else
		flag = 1;

	return true;
	   
}


//***********************************************************
function fn_actualiza_datos(clave1, lectura1, cliente, medidor, tipomed, marca, modelo, clave2, lectura2){
	
		//alert(clave1+'||'+ lectura1+'||'+ cliente+'||'+ medidor+'||'+ tipomed+'||'+ marca+'||'+ modelo)
	flag = 0;
	parameters = 
    {
		"func"       :"fn_actualiza_datos",
		"empresa"    :$("#tx_empresa").val(),
		"RolFun"     :$("#tx_rolfun").val(),
		"rol"        :$("#tx_rol").val(),
		"ip"         :$("#tx_ip").val(),
				
				
		"p_clavelec" : clave1,
        "p_lecterr"  : lectura1,
		"p_clavelec2" : clave2,
        "p_lecterr2"  : lectura2,
		
		"p_cliente"  : cliente,
        "p_medidor"  : medidor,
        
		"p_tipomed"  : tipomed,
		"p_marca"    : marca,
		"p_modelo"   : modelo,
        
		"p_lector"   : $("#cb_lector").val(),
        "p_fecha"    : $("#fec_lect").val(),
        
    };
	
	
	HablaServidor(url,parameters,"text", function(text) 
	{
		if(text == ""){
			//fn_mensaje_boostrap("ACCIN REALIZADA", g_titulo, $(""));
			//$grid_principal.pqGrid( "refreshDataAndView" );
						
		}
		else
			fn_mensaje_boostrap(text, g_tit, $(""));

	});

    
		  
}


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_filtro()
{
	parameters = 
    {
		"func":"fn_grid_principal",
		"empresa":$("#tx_empresa").val(),
		"p_regional":$("#cb_regional").val(),
        "p_ciclo":$("#cb_ciclo").val(),
        "p_ruta":$("#cb_ruta").val(),
        "p_lector":$("#cb_lector").val(),
        "p_fecha":$("#fec_lect").val(),
        
    };
	
	Filtros = [];
	
	if ($("#cb_regional").val()!='' ) {
		Filtros.push('Regional = '+$("#cb_regional :selected").text());  
		}
	
	
	if ($("#cb_ciclo").val()!='' ) {
		Filtros.push('Ciclo = '+$("#cb_ciclo:selected").text());  
		}
	
	
	if ($("#cb_ruta").val()!='' ) {
		Filtros.push('Ruta = '+$("#cb_ruta:selected").text());  
		}
	
	if ($("#cb_lector").val()!='' ) {
		Filtros.push('Lector = '+$("#cb_lector:selected").text());  
		}
				
	
	if ($("#fec_lect").val()!=''  ) {
	      Filtros.push('Fecha Lectura Terreno = '+$("#fec_lect").val() );
		
	}
	
	//alert('datos ' + $("#cb_regional").val() + ' /' + $("#cb_ciclo").val() + '/ ' + $("#cb_ruta").val());
	
	$("#filtro").val(Filtros);
}



//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_Muestra_Filtro() {
	fn_limpia_filtro();
   
	
	$("#div_filtro_bts").modal({ backdrop: "static", keyboard: false });
	$("#div_filtro_bts").on("shown.bs.modal", function () {
		$("#div_filtro_bts div.modal-footer button").focus();

	});


}
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_limpia_filtro() 
{
	$("#cb_regional").val("");
	$("#cb_ciclo").val("");
	$("#cb_ruta").val("");
	$("#cb_lector").val("");
	$("#fec_lect").val("");
	}
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
	
function fn_Muestra_Lectura() {
	$("#div_lec_bts").modal({ backdrop: "static", keyboard: false });
	$("#div_lec_bts").on("shown.bs.modal", function () {
		$("#div_lec_bts div.modal-footer button").focus();

	});


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

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	


//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
//FUNCIONES MODAL -  combos
function fn_regional() {

    	$("#cb_regional").html("");
		$("#cb_ciclo").html("");
	    $("#cb_ruta").html("");
	
		parameters = 
			{
				"func":"fn_regional",
				"empresa":$("#tx_empresa").val(),
				//"rol":$("#tx_rol").val()
			};
		
		HablaServidor(url,parameters,'text', function(text) 
			{
				if(text != "")
					$("#cb_regional").html(text);
			});

	//$("#cb_regional").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~

function fn_ciclo() {

    $("#cb_ciclo").html("");
	$("#cb_ruta").html("");
	
	
	//alert($("#cb_regional").val()); 
	
	parameters = 
    {
		"func":"fn_ciclo",
		"empresa":$("#tx_empresa").val(),
		"rol":$("#tx_rol").val(),
		"p_regional":$("#cb_regional").val()
		
    };
    HablaServidor(url,parameters,'text', function(text) 
    {
        if(text != "")
            $("#cb_ciclo").html(text);
    });

	//$("#cb_ciclo").html("<option value='' selected></option><option value='1'>10</option> <option value='2' >20</option> <option value='3'>30</option>");
}

//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~

function fn_ruta() {

	$("#cb_ruta").html("");

    parameters = 
    {
		"func":"fn_ruta",
		"empresa":$("#tx_empresa").val(),
		"rol":$("#tx_rol").val(),
		"p_regional":$("#cb_regional").val(),
		"p_ciclo":$("#cb_ciclo").val()
    };
	
    HablaServidor(url,parameters,'text', function(text) 
    {
        if(text != "")
            $("#cb_ruta").html(text);
    });
	
	//$("#cb_ruta").html("<option value='' selected></option><option value='1'>005</option> <option value='2' >010</option> <option value='3'>015</option>");
}
//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~

function fn_lect() {

    $("#cb_lector").html("");

	
	parameters = 
    
	{
		"func":"fn_lector",
		"empresa":$("#tx_empresa").val(),
		"rol":$("#tx_rol").val()
    };
    HablaServidor(url,parameters,'text', function(text) 
    {
        if(text != "")
            $("#cb_lector").html(text);
    });

	//$("#cb_lector").html("<option value='' selected></option><option value='1'>005</option> <option value='2' >010</option> <option value='3'>015</option>");
}
//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~


/*function fn_actualizar(){
    alert('Se actualizo.');
}*/

//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
//FUNCIONES LIMPIAR-MODAL
function fn_lim_filtro() {
	$("#cb_regional").val("");
	$("#cb_ciclo").val("");
	$("#cb_ruta").val("");
}



function fn_lim_fil_reg() {
	$("#cb_ciclo").val("");
    $("#cb_ruta").val("");
	
}
function fn_lim_fil_ci() {
    $("#cb_ruta").val("");
	
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

