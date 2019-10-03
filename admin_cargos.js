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
    jQuery('#inp_cargo').keypress(function(tecla) {
        if(tecla.charCode < 48 || tecla.charCode > 57) return false;
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
    fn_uni_med();
    fn_car_aut();
    fn_inp_group();
    fn_inp_tip_acc();
	//DIBUJA LOS ICONOS DE LOS BOTONES     
	$("#co_leer").html("<span class='glyphicon glyphicon-search'></span> Nuevo");
    $("#co_nuevo").html("<span class='glyphicon '></span> Nuevo");
	$("#co_ant").html("<span class='glyphicon glyphicon-arrow-left'></span> Anterior");
    $("#co_sig").html("<span class='glyphicon glyphicon-arrow-right'></span> Siguiente");
	$("#co_selec").html("<span class='glyphicon glyphicon-plus'></span> Seleccionar");
    $("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
//BOTONES-EVENTOS
    
    $("#co_leer").on("click", fn_Muestra_Filtro);
    
    $("#co_cerrar_t").on("click", function (e){
        window.close(); 
    });
    $("#co_aceptar").on("click", function(){
		//Validación de informacion
     if ($.trim($("#co_aceptar").text())=="Aceptar"){
		if($("#inp_agrup").val() == "0"){
			fn_mensaje_boostrap("SELECCIONE AGRUPACIÓN", g_tit, $("#inp_agrup"));
			return;
		}
	    if($("#inp_tip_acc").val() == "0"){
			fn_mensaje_boostrap("SELECCIONE TIPO DE ACCIÓN", g_tit, $("#inp_tip_acc"));
			return;
          }else{
           fn_mensaje_boostrap("Se genero", g_tit, $("#co_aceptar"));
           fn_carga_grilla(); 
        }
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
	$("#co_cancelar").on("click", function(e){
        $('#div_filtro_bts').modal('hide');	
    });
	
	$("#co_cancelar").on("click", function(e){
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
    
    $("#co_volver_fil").on("click", function(e){
        
            $("#div_prin").slideDown();
            $("#div_filtros").slideUp();
            $(window).scrollTop(0);
        
    });
    
//BOTONES CERRAR DE LOS MODALES
    $("#co_close").on("click", function (e) {
		$('#div_modal').modal('hide');
		fn_limpia_modal();
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
    $("#co_guardar").on("click", function(){
		//Validación de informacion
		if ($.trim($("#co_guardar").text()) == "Guardar"){
            if ($("#inp_cargo").val() == ""){
					fn_mensaje_boostrap("DIGITE CODIGO.", g_tit, $("#inp_cargo"));
				
				return;
					}
               if ($("#inp_nom").val() == ""){
					fn_mensaje_boostrap("DIGITE NOMBRE.", g_tit, $("#inp_nom"));
				
				return;
				    }
             if ($("#inp_uni_med").val() == ""){
					fn_mensaje_boostrap("SELECCIONE UNIDAD DE MEDIDA.", g_tit, $("#inp_uni_med"));
				
				return;
				    }
             if ($("#inp_glosa").val() == ""){
					fn_mensaje_boostrap("DIGITE GLOSA DE DOCUMENTO", g_tit, $("#inp_glosa"));
				
				return;
				    }
            if ($("#inp_car_aut").val() == ""){
					fn_mensaje_boostrap("SELECCIONE CARGO DE DOCUMENTO", g_tit, $("#inp_car_aut"));
				
				return;
				    }
            if ($("#inp_fec_ant").val() == ""){
					fn_mensaje_boostrap("DIGITE LA FECHA DE ACTIVACIÓN.", g_tit, $("#inp_fec_ant"));
				
				return;
					return;}
					else{
						if(fn_validar_fecha($("#inp_fec_ant").val()) == false){
							fn_mensaje_boostrap("INFORMACIÓN INCORRECTA EN EL CAMPO FECHA DE ACTIVACIÓN. EL FORMATO ES DD/MM/YYYY.", g_tit, $("#inp_fec_ant"));
							//fn_mensaje_bootstrap_fecv();
							return false;
					}
                }
               if ($("#inp_fec_des").val() == ""){
					fn_mensaje_boostrap("DIGITE LA FECHA DESACTIVACIÓN.", g_tit, $("#inp_fec_des"));
				
				return;
					return;}
					else{
						if(fn_validar_fecha($("#inp_fec_des").val()) == false){
							fn_mensaje_boostrap("INFORMACIÓN INCORRECTA EN EL CAMPO FECHA FINAL. EL FORMATO ES DD/MM/YYYY.", g_tit, $("#inp_fec_des"));
							//fn_mensaje_bootstrap_fecv();
							return false;
					}
                }
            if ($("#inp_ord_imp").val() == ""){
					fn_mensaje_boostrap("DIGITE ORDEN DE IMPRESIÓN", g_tit, $("#inp_ord_imp"));
				
				return;
				    }
            if ($("#inp_amort").val() == ""){
					fn_mensaje_boostrap("DIGITE NIVEL DE AMORTIZACIÓN", g_tit, $("#inp_amort"));
				
				return;
				    }
            if ($("#inp_niv_imp").val() == ""){
					fn_mensaje_boostrap("DIGITE NIVEL DE IMPRESIÓN", g_tit, $("#inp_niv_imp"));
				
				return;
				    }
            if ($("#inp_niv_pre").val() == ""){
					fn_mensaje_boostrap("DIGITE NIVEL DE PRESENTACIÓN", g_tit, $("#inp_niv_pre"));
				
				return;
				    }
           fn_mensaje_boostrap("Se genero", g_tit, $("#co_gen"));
           fn_carga_grilla(); 
            
        }
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
				{ type: "button", label: "Nuevo",    attr: "id=co_leer",  cls: "btn btn-primary" }, 
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
    $grid_2.pqGrid("refreshView");

}


/////////////////////////////////FUNCIONES COMBOS///////////////////////////////////////////
function fn_uni_med(){ 
   $("#inp_uni_med").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
function fn_car_aut() {
  $("#inp_car_aut").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
function fn_inp_group() {
   $("#inp_agrup").html("<option value='0' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
function fn_inp_tip_acc() {
  $("#inp_tip_acc").html("<option value='0' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}

function fn_carga_grilla(){
    
    
}
function fn_gen(){
     alert('Se genero.');
}
//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
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

