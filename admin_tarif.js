var g_modulo = "Administración Central - Configuración Base del Sistema";
var g_tit = "Consulta de cargos";
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
    fn_inp_uni_hab();
    fn_inp_jub();
    fn_inp_subs();
    fn_inp_prom();
    fn_inp_comp();
	//DIBUJA LOS ICONOS DE LOS BOTONES     
	$("#co_leer").html("<span class='glyphicon glyphicon-search'></span> Leer");
    $("#co_nuevo").html("<span class='glyphicon '></span> Nuevo");
	$("#co_ant").html("<span class='glyphicon glyphicon-arrow-left'></span> Anterior");
    $("#co_sig").html("<span class='glyphicon glyphicon-arrow-right'></span> Siguiente");
	$("#co_selec").html("<span class='glyphicon glyphicon-plus'></span> Seleccionar");
    $("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
//BOTONES-EVENTOS
    
    $("#co_leer").on("click", fn_Muestra_Filtro);
    
    $("#co_cerrar_t").on("click", function (e) {
        window.close(); 
    });
    $("#co_aceptar").on("click", function(){
		//Validación de informacion
     if ($.trim($("#co_aceptar").text())=="Aceptar"){
		if( $("#inp_agrup").val() == ""){
			fn_mensaje_boostrap("SELECCIONE AGRUPACIÓN", g_titulo, $("#inp_agrup"));
			return;
		}
		else{
           if( $("#inp_tip_acc").val() == ""){
			fn_mensaje_boostrap("SELECCIONE TIPO DE ACCIÓN", g_titulo, $("#inp_tip_acc"));
			return;
		  }
        }
         alert("Aceptado.");
     }
	});
    $("#co_limpiar").on("click",function(){
		if ($.trim($("#co_limpiar").text())=="Limpiar"){
			fn_limpiar();
			return;
		}
		else
			window.close();
	});
	$("#co_cancelar").on("click", function (e) {
        $('#div_filtro_bts').modal('hide');	
    });
	
	$("#co_cancelar").on("click", function (e) {
       window.close();
    });
 
//BOTONES ELIMINAR DE LAS GRILLAS
    $("#co_eliminar").on("click", function(e){
		 
        $("#dlg_confirmamod").modal({backdrop: "static",keyboard:false});					
		$("#dlg_confirmamod").on("shown.bs.modal", function () {
			$("#co_confirmamod_no").focus();
				});
    	
	});
 
    $("#co_nuevo").on("click", function(e){
 		fn_nuevo();            
    }); 
    
    $("#co_eliminar2").on("click", function(e){
		 
        $("#dlg_confirmamod2").modal({backdrop: "static",keyboard:false});					
		$("#dlg_confirmamod2").on("shown.bs.modal", function () {
			$("#co_confirmamod2_no").focus();
				});
    });
    
    $("#co_volver_fil").on("click", function (e) {
        
            $("#div_prin").slideDown();
            $("#div_filtros").slideUp();
            $(window).scrollTop(0);
        
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
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
    
$("#co_volver2").on("click", function (e){
		$("#div_prin").show();
		$("#div_tabla").hide();
        $(window).scrollTop(0);
    });	

	
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
	$("._input_selector").inputmask("dd/mm/yyyy");

	
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
    //BOTONES
    
    //BOTONES-FILTRO
	$("#co_aceptar").on("click", function(){
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
       
	});
    
	$("#co_limpiar").on("click", function(){
		if ($.trim($("#co_limpiar").text()) == "Limpiar") {
		    fn_limpia_modal();
			return;
		}
		else
			window.close();
	});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
     //BOTONES-LECTURA
    $("#co_aceptar_lec").on("click", function(){
			if ($("#cb_lector").val() == ""){
                    fn_mensaje_boostrap("DIGITE LECTOR", g_tit, $("#cb_lector"));
                    return false;
             }	
			 if (fn_validar_fecha($("#fec_lect").val()) == false) {
							fn_mensaje_boostrap("DEBE DILIGENCIAR EL CAMPO FECHA DE PROCESO. EL FORMATO ES DD/MM/YYYY.", g_tit, $("#fec_lect"));
							return false;
			 }	
			 if ( $("#fec_lect").val() != "" ){
					
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
			
					$("#div_prin").hide();
                    $("#div_tabla").show();
    				
					$grid_2.pqGrid("refreshView");
					
				}
			}
	});
	
	//EVENTO DBL_CLICK DE LA GRILLA CICLO - RUTA
    $grid_2.pqGrid({
		rowDblClick: function( event, ui ){
			if (ui.rowData) 
				{
					var dataCell = ui.rowData;

					$("#tx_codigo").val(dataCell.c1);
                    $("#tx_descod").val(dataCell.c2);
                    $("#tx_val1").val(dataCell.c3);
                    $("#tx_val2").val(dataCell.c4);
                    $("#tx_fecing").val(dataCell.c5);
                    $("#tx_fecmod").val(dataCell.c6);
                    $("#div_modal2").modal({ backdrop: "static", keyboard: false });
                    $("#div_modal2").on("shown.bs.modal", function () {
                        $("#div_modal2 div.modal-footer button").focus();

				      });
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
		title: "Administrador de cargos",
		pageModel: { type: "local" },
		scrollModel: { theme: true },
		toolbar:
		{
			cls: "pq-toolbar-export",
			items:[
				{ type: "button", label: "Leer",    attr: "id=co_leer",  cls: "btn btn-primary" }, 
                { type: "button", label: "Seleccionar",    attr: "id=co_selec",  cls: "btn btn-primary btn-sm" },       
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
             { C1: '0001', C2: 'CONSUMO DE AGUA'}, 
             { C1: '0002', C2: 'CONSUMO DE AGUA NO FACTURADO'},
             { C1: '0003', C2: 'SUBSIDIADO POR CASO SOCIAL'}, 
             { C1: '0004', C2: 'SUBSIDIO POR CASO SOCIAL'},	 
            { C1: '0005', C2: 'MATERIALES AGUA'},
            { C1: '0006', C2: 'MANO DE OBRA - AGUA '},
            { C1: '0007', C2: 'CONSUMO DE AGUA HISTORICO'},
            { C1: '0008', C2: 'DERECHO DE CONEXION - AGUA'},
            { C1: '0009', C2: 'REINST. SERVICIO AGUA POTABLE'},
             { C1: '00010', C2: 'DESCUENTO DE EMPLEADO'},
              { C1: '00011', C2: 'DESCUENTO DE JUBILADO'}, 
             { C1: '00012', C2: 'COMPEM DEFICIENCIA SUMINISTRO AGUA'},
             { C1: '00013', C2: 'CONSUMO DE AGUA - DITO RELIQ'}, 
             { C1: '00014', C2: 'CONSUMO DE AGUA - CREDITO RELIQ'},	 
            { C1: '00015', C2: 'DEBITO RELIQ DE SUBSIDIOS'},
            { C1: '00016', C2: 'CREDITO RELIQ. JUBILADO/ EMPELADO'},
            { C1: '00017', C2: 'DEBITO RELIQ. JUBILADO/EMPELADO'},
            { C1: '00018', C2: 'MANEJO DE CHEQUE DEVUELTO'},
            { C1: '00019', C2: 'COSTOS LEGALES'},
             { C1: '00020', C2: 'RECARGO POR PAGO ATRASADO'},
              { C1: '00021', C2: 'ARREGLO DE PAGO - AGUA'}, 
             { C1: '00022', C2: 'RECARGOPAGO ATRASADO - HISTORICO'}
        ] }
	};
	
    obj.colModel = [
		{ title: "Codigo",     width: 100, dataType: "string", dataIndx: "C1", halign: "center", align: "center" },
		{ title: "Descripcion", width: 400, dataType: "string", dataIndx: "C2", halign: "center", align: "center"  },   
	];

	$grid_principal = $("#div_grid_principal").pqGrid(obj);
	$grid_principal.pqGrid("refreshDataAndView");
    
//*************************************************************
    
    //Setea grid2
	data =  [
	    { C1: '0001', C2: 'CONSUMO DE AGUA'}, 
             { C1: '0002', C2: 'CONSUMO DE AGUA NO FACTURADO'},
             { C1: '0003', C2: 'SUBSIDIADO POR CASO SOCIAL'}, 
             { C1: '0004', C2: 'SUBSIDIO POR CASO SOCIAL'},	 
            { C1: '0005', C2: 'MATERIALES AGUA'},
            { C1: '0006', C2: 'MANO DE OBRA - AGUA '},
            { C1: '0007', C2: 'CONSUMO DE AGUA HISTORICO'},
            { C1: '0008', C2: 'DERECHO DE CONEXION - AGUA'},
            { C1: '0009', C2: 'REINST. SERVICIO AGUA POTABLE'},
             { C1: '00010', C2: 'DESCUENTO DE EMPLEADO'},
              { C1: '00011', C2: 'DESCUENTO DE JUBILADO'}, 
             { C1: '00012', C2: 'COMPEM DEFICIENCIA SUMINISTRO AGUA'},
             { C1: '00013', C2: 'CONSUMO DE AGUA - DITO RELIQ'}, 
             { C1: '00014', C2: 'CONSUMO DE AGUA - CREDITO RELIQ'},	 
            { C1: '00015', C2: 'DEBITO RELIQ DE SUBSIDIOS'},
            { C1: '00016', C2: 'CREDITO RELIQ. JUBILADO/ EMPELADO'},
            { C1: '00017', C2: 'DEBITO RELIQ. JUBILADO/EMPELADO'},
            { C1: '00018', C2: 'MANEJO DE CHEQUE DEVUELTO'},
            { C1: '00019', C2: 'COSTOS LEGALES'},
             { C1: '00020', C2: 'RECARGO POR PAGO ATRASADO'},
              { C1: '00021', C2: 'ARREGLO DE PAGO - AGUA'}, 
             { C1: '00022', C2: 'RECARGOPAGO ATRASADO - HISTORICO'}
	 ]
    var obj2 = {
        height: 500,
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
                 toolbar: {
                     
                cls: "pq-toolbar-export",
                items: [
                    { type: "button", label: "Nuevo",attr:"id=co_nuevo", cls:"btn btn-primary"},
				    { type: "button", label: "Excel", attr:"id=co_excel", cls:"btn btn-primary btn-sm"},
			 	    { type: "button", label: "Cerrar", attr:"id=co_cerrar_t", cls:"btn btn-default btn-sm"},
                    ]
            }
      
    };
	
	obj2.colModel = [
        { title: "Agrupación", width: 100, dataType: "string", dataIndx: "C1", halign:"center", align:"center"},
        { title: "Tipo Acción", width: 300, dataType: "string", dataIndx: "C2", halign:"center", align:"left" },
        { title: "Eliminar",width: 80, dataType: "string", align: "center", editable: false, minWidth: 100, sortable: false,
					render: function (ui) {
					
						return "<button name='co_elim' id='co_elim' class='btn btn-primary btn-sm'>Eliminar</button>";
					}
				}
    ];
	
	obj2.dataModel = { data: data };
    $grid_2=$("#div_grid_sec").pqGrid(obj2);
    $grid_2.pqGrid("refreshDataAndView");

}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
function fn_limpiar(){
	
		$("#inp_agrup").val("");
		$("#inp_tip_acc").val("");
		$("#inp_agrup").focus();
}
function fn_filtro()
{
	parameters = 
    {
		"func":"fn_grid_principal",
		"empresa":$("#tx_empresa").val(),
    };
	
}
function fn_nuevo(){
     $("#div_filtro_bts").modal({backdrop: "static",keyboard:false});
	$("#div_filtro_bts").on("shown.bs.modal", function () {
		$("#div_filtro_bts div.modal-footer button").focus();
			
	});
}
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
function fn_modal(num) {
	
    $("#tx_nuevo").val(num);
    
    fn_limpia_modal();
	
	$("#div_modal").modal({ backdrop: "static", keyboard: false });
	$("#div_modal").on("shown.bs.modal", function () {
		$("#div_modal div.modal-footer button").focus();

	});
}
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~	
function fn_limpia_modal() 
{
	$("#cb_sistema").val("");
	$("#tx_nomtabla").val("");
	$("#tx_desc").val("");
	$("#cb_modif").val("");	
}
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
function fn_limpia_modal2() 
{
	$("#tx_val1").val("");
	$("#tx_val1").val("");
	$("#tx_descod").val("");
	$("#tx_codigo").val("");
    $("#tx_fecing").val("");
	$("#tx_fecmod").val("");
}
	
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~	
function fn_carga_grilla() {
	

}

//FUNCIONES MODAL*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~* 
function fn_sistema() {
     
	$("#cb_sistema").html("<option value='' selected></option><option value='1'>Sistema 01</option> <option value='2' >Sistema 02</option> <option value='3'>Sistema 03</option>");
}
function fn_Muestra_Filtro()
{
	$("#div_prin").slideUp();
	$("#div_filtros").slideDown();
	$(window).scrollTop(0);

}
 
/////////////////////////////////FUNCIONES COMBOS///////////////////////////////////////////
function fn_inp_uni_hab(){ 
   $("#inp_uni_hab").html("<option value='' selected></option><option value='1'>SI</option> <option value='2' >NO</option>");
}
function fn_inp_jub() {
  $("#inp_jub").html("<option value='' selected></option><option value='1'>SI</option> <option value='2' >NO</option>");
}
function fn_inp_subs() {
   $("#inp_subs").html("<option value='' selected></option><option value='1'>SI</option> <option value='2' >NO</option>");
}
function fn_inp_prom() {
  $("#inp_prom").html("<option value='' selected></option><option value='1'>SI</option> <option value='2' >NO</option>");
}

function fn_inp_comp() {
  $("#inp_comp").html("<option value='' selected></option><option value='1'>SI</option> <option value='2' >NO</option>");
}
function fn_carga_grilla(){
    
    
}
function fn_gen(){
     alert('Se genero.');
}


