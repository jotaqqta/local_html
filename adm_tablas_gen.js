var g_modulo = "Administración Central - Configuración Base del Sistema";
var g_tit = "Administrador de Tablas Generales";

var $grid_principal;
var $grid_2;
var $grid_3;

var sql_grid_prim = "";
var sql_grid_2    = "";
var sql_grid_3    = "";


var parameters = {};
//var Filtros = [];
//var dataReg = [];


//var url = "adm_tablas_gen.asp";


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

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
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
	
	//Se cargan las variables que vienen desde el server
	/*$("#tx_empresa").val(SYNSegCodEmpresa);
	$("#tx_rol").val(SYNSegRol);
	$("#tx_ip").val(SYNSegIP);
	$("#tx_rolfun").val(SYNSegRolFuncion);
	*/
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
	$("#co_eliminar").html("<span class='glyphicon glyphicon glyphicon-minus'></span> Eliminar");

    $("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");
	$("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");
    
	$("#co_nuevo2").html("<span class='glyphicon glyphicon-plus'></span> Nuevo");
	$("#co_editar2").html("<span class='glyphicon glyphicon-pencil'></span> Modificar");
	$("#co_eliminar2").html("<span class='glyphicon glyphicon glyphicon-minus'></span> Eliminar");

    $("#co_excel2").html("<span class='glyphicon glyphicon-save'></span> Excel");
    $("#co_volver2").html("<span class='glyphicon glyphicon-chevron-left'></span> Volver");
    
    
	//$("#co_cerrar_t").html("<span class='glyphicon glyphicon-off'></span> Cerrar");
	
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
    //FUNCIONES DE CAMPOS
    fn_sistema();
    //fn_lect();
 
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
    //BOTONES-EVENTOS
	
    $("#co_nuevo").on("click", fn_modal);

	
    $("#co_cerrar_t").on("click", function (e) {
        window.close(); 
    }); 
 
	$("#co_leer").on("click", function (e) {
		fn_Muestra_Lectura();
	});
	
	/*$("#co_act").on("click", function (e) {
		fn_actualizar();
	});*/
	
    $("#co_eliminar").on("click", function (e) {
		 
		//alert(dataReg.C1 +  "-" +  dataReg.C2);
		
		$("#dlg_confirmamod").modal({backdrop: "static",keyboard:false});					
		$("#dlg_confirmamod").on("shown.bs.modal", function () {
			$("#co_confirmamod_no").focus();
				});
    	
	});
    
	$("#co_close").on("click", function (e) {
		$('#div_modal').modal('hide');
		 
		fn_limpia_modal();
	});
         
     $("#co_close_lec").on("click", function (e) {
		$('#div_lec_bts').modal('hide');
	});
     $("#co_close_act").on("click", function (e) {
		$('#div_act_bts').modal('hide');
	});
         
    
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	

    $("#co_volver2").on("click", function (e) {
		$("#div_prin").show();
		$("#div_tabla").hide();
		//$grid_principal.pqGrid( "refreshDataAndView" );
		$(window).scrollTop(0);
    });//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	

	
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
            $('#div_modal').modal('hide');
            //fn_lim_filtro(); 
                
            
        //}
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
	
	$("#div_modal").draggable({
        handle: ".modal-header"
    });
	
    //Filtros = [];

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
			if (ui.rowData) 
				{
					var dataCell = ui.rowData;
					//g_cliente_selec = dataCell.c2;
					$("#div_prin").hide();
                    $("#div_tabla").show();
    				
					$grid_2.pqGrid("refreshView");
					//periodo_fil = dataCell.C1;
					//regional_fil = dataCell.C2;
					//ciclo_fil = dataCell.C3;
					//fn_grilla_dos();
				}
			}
	});
	
	//EVENTO DBL_CLICK DE LA GRILLA CICLO - RUTA
    $grid_2.pqGrid({
		rowDblClick: function( event, ui ) {
			if (ui.rowData) 
				{
					var dataCell = ui.rowData;
					g_cliente_selec = dataCell.c2;
					//$("#div_tabla").hide();
    				//$("#div_ter").show();
					ruta_fil = dataCell.C4;
					//fn_grilla_tres();
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
		editable: false,
		editor: { type: "textbox", select: true, style: "outline:none;" },
		selectionModel: { type: 'cell' },
		numberCell: { show: true},
		title: "Mantenedor de Tablas Generales",
		pageModel: { type: "local" },
		scrollModel: { theme: true },
		toolbar:
		{
			cls: "pq-toolbar-export",
			items:[
				{ type: "button", label: "Nuevo",    attr: "id=co_nuevo",  cls: "btn btn-primary" },
				{ type: "button", label: "Modificar",attr: "id=co_editar", cls: "btn btn-primary" },
                { type: "button", label: "Imprimir", attr: "id=co_imprimir",cls: "btn btn-primary btn-sm" }, 
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
             { C1: 'ABASTAP', C2: 'PERD',   C3: 'ABASTECIMIENTO (HURTO)', C4: 'A', C5: 'S', C6: '10' }, 
             { C1: 'ABOCOMP', C2: 'AIC',   C3: 'ROL COMPROBANTES ABONO', C4: 'A', C5: 'S', C6: '10' },
             { C1: 'ACCARE', C2: 'MEDI',   C3: 'ACCIONES DE CAMBIO A REALIZAR', C4: 'A', C5: 'S', C6: '10'}, 
             { C1: 'ABASTAP', C2: 'PERD',   C3: 'ABASTECIMIENTO (HURTO)', C4: 'A', C5: 'S', C6: '10' },	 
            { C1: 'ABASTAP', C2: 'PERD',   C3: 'ABASTECIMIENTO (HURTO)', C4: 'A', C5: 'S', C6: '10' },
            { C1: 'ABASTAP', C2: 'PERD',   C3: 'ABASTECIMIENTO (HURTO)', C4: 'A', C5: 'S', C6: '10' },
            { C1: 'ABASTAP', C2: 'PERD',   C3: 'ABASTECIMIENTO (HURTO)', C4: 'A', C5: 'S', C6: '10' },
            { C1: 'ABASTAP', C2: 'PERD',   C3: 'ABASTECIMIENTO (HURTO)', C4: 'A', C5: 'S', C6: '10' },
            { C1: 'ABASTAP', C2: 'PERD',   C3: 'ABASTECIMIENTO (HURTO)', C4: 'A', C5: 'S', C6: '10' },
        ] }
	};
	
    obj.colModel = [
		{ title: "Tabla",     width: 100, dataType: "string", dataIndx: "C1", halign: "center", align: "center" },
		{ title: "Sistema", width: 100, dataType: "string", dataIndx: "C2", halign: "center", align: "center"  },
		{ title: "Descripcion", width: 350, dataType: "string", dataIndx: "C3", halign: "center",  align:"center"},
		{ title: "Estado", width: 100, dataType: "string", dataIndx: "C4", halign: "center", align: "center"  },
		{ title: "Modificable", width: 100, dataType: "string", dataIndx: "C5", halign: "center", align: "center" },
		{ title: "Cantidad", width: 80, dataType: "number", dataIndx: "C6", halign: "center", align: "right"  },
        { title: "Eliminar", width: 80, dataType: "string", align: "center", editable: false, minWidth: 100,       sortable: false,
					render: function (ui) {
						//return "<button class='btn btn-primary glyphicon glyphicon-remove btn_grid'><span class=''></span>Eliminar</button>";
						return "<button name='co_borrar' class='btn btn-primary btn-sm'>Eliminar</button>";
					}
				}  
	];

	$grid_principal = $("#div_grid_principal").pqGrid(obj);
	$grid_principal.pqGrid("refreshDataAndView");
    
    /*GRILLA 2*************************************************************/
    
    //Setea grid2
	data =  [
	  { C1: '01', C2: 'PARAMETRO TABLA 1', C3: 'D', C4: '8', C5:'80'},
      { C1: '02', C2: 'PARAMETRO TABLA 2', C3: 'A', C4: '18', C5:'80'},
      { C1: '03', C2: 'PARAMETRO TABLA 3', C3: 'A', C4: '28', C5:'80'},
      { C1: '04', C2: 'PARAMETRO TABLA 4', C3: 'A', C4: '38', C5:'80'},
      { C1: '05', C2: 'PARAMETRO TABLA 5', C3: 'A', C4: '48', C5:'80'},
	 ]
    var obj2 = {
        height: "100%",
        showTop: true,
        showHeader: true,
        roundCorners: true,
        rowBorders: true,
		fillHandle: "",
        columnBorders: true,
        editable:false,
        selectionModel: { type: "row", mode:"single"},
        showTitle:true,
        collapsible:false,
        numberCell: { show: false },
        title: "Detalle",
		pageModel: { rPP: 200, type: "local", rPPOptions: [100, 200, 500]},
        scrollModel:{theme:true},
        toolbar:
        {
            cls: "pq-toolbar-export",
            items:
            [
				{ type: "button", label: "Nuevo",    attr: "id=co_nuevo2",  cls: "btn btn-primary" },
				{ type: "button", label: "Excel", attr:"id=co_excel2", cls:"btn btn-primary btn-sm"},
				{ type: "button", label: "Volver", attr:"id=co_volver2", cls:"btn btn-default btn-sm"}
            ]
        }
    };
	
	obj2.colModel = [
        { title: "Código", width: 100, dataType: "string", dataIndx: "C1", halign:"center", align:"center"},
        { title: "Descricpión", width: 300, dataType: "string", dataIndx: "C2", halign:"center", align:"left" },
        { title: "Estado", width: 100, dataType: "string", dataIndx: "C3", halign:"center", align:"center" },
        { title: "Valor 1", width: 100, dataType: "string", dataIndx: "C4", halign:"center", align:"left" },
        { title: "Valor 2", width: 140, dataType: "number", dataIndx: "C5", halign:"center", align:"right" },
        { title: "Eliminar",width: 80, dataType: "string", align: "center", editable: false, minWidth: 100, sortable: false,
					render: function (ui) {
						//return "<button class='btn btn-primary glyphicon glyphicon-remove btn_grid'><span class=''></span>Eliminar</button>";
						return "<button name='co_borra2' class='btn btn-primary btn-sm'>Eliminar</button>";
					}
				}
    ];
	
	obj2.dataModel = { data: data };
    $grid_2 = $("#div_grid_sec").pqGrid(obj2);
	//$grid_2.pqGrid( "option", "dataModel.data", [] );
    $grid_2.pqGrid( "refreshDataAndView" );
	//$grid_2.pqGrid( "scrollRow", { rowIndxPage: 10 } );

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
		/*"p_sistema":$("#cb_regional").val(),
        "p_ciclo":$("#cb_ciclo").val(),
        "p_ruta":$("#cb_ruta").val(),
        "p_lector":$("#cb_lector").val(),
        "p_fecha":$("#fec_lect").val(),*/
        
    };
	/*Filtros = [];
	if ($("#cb_regional").val()!='' ) {Filtros.push('Regional = '+$("#cb_regional :selected").text()); }
	if ($("#cb_ciclo").val()!='' ) {Filtros.push('Ciclo = '+$("#cb_ciclo:selected").text());  }
	if ($("#cb_ruta").val()!='' ) {	Filtros.push('Ruta = '+$("#cb_ruta:selected").text());  }
	if ($("#cb_lector").val()!='' ) {Filtros.push('Lector = '+$("#cb_lector:selected").text());}
	if ($("#fec_lect").val()!=''  ) {Filtros.push('Fecha Lectura Terreno = '+$("#fec_lect").val() );}
	$("#filtro").val(Filtros);*/
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_modal() {
	fn_limpia_modal();
	
	$("#div_modal").modal({ backdrop: "static", keyboard: false });
	$("#div_modal").on("shown.bs.modal", function () {
		$("#div_modal div.modal-footer button").focus();

	});
}
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_limpia_modal() 
{
	$("#cb_sistema").val("");
	$("#tx_nomtabla").val("");
	$("#tx_desc").val("");
	$("#cb_modif").val("");	
}
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
	
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
function fn_sistema() {
      /*
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
*/
	$("#cb_sistema").html("<option value='' selected></option><option value='1'>Sistema 01</option> <option value='2' >Sistema 02</option> <option value='3'>Sistema 03</option>");
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

