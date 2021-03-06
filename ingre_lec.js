var g_modulo = "Facturación Clientes - Lecturas y Consumos";
var g_titulo = "Ingreso de lecturas tomadas en terreno.";
var parameters = {};
var url = "reasigna_ajuste.asp";
var $grid;
var fila_g; 
var flag = 0;
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
$(document).keydown(function (e) {

	if (e.keyCode === 8) {
		var element = e.target.nodeName.toLowerCase();
		if ((element != 'input' && element != 'textarea') || $(e.target).attr("readonly")) {
			return false;
		}
	}
});

$(document).ready(function () {

	// PARA ELIMINAR EL SUBMIT
	$("button").on("click", function () { return false; });
	//INGRESA LOS TITULOS
	document.title = g_titulo;
	document.body.scroll = "yes";
	$("#div_header").load("syn_globales/header.htm", function () {
		$("#div_mod0").html(g_modulo);
		$("#div_tit0").html(g_titulo);
	});

	//Footer
	//DEFINE LA GRILLA PRINCIPAL
	fn_setea_grid_principal();
	//DIBUJA LOS ICONOS DE LOS BOTONES     
	$("#co_filtro").html("<span class='glyphicon glyphicon-search'></span> Filtros");
	$("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");
	$("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");
    $("#co_cerrar_t").html("<span class='glyphicon glyphicon-off'></span> Cerrar");
	$("#co_leer").html("<span class='glyphicon glyphicon-book'></span> Lectura");
	$("#co_act").html("<span class='glyphicon glyphicon-check'></span> Actualizar");
    $("#co_rut_no_lei").html("<span class='glyphicon glyphicon glyphicon-remove'></span> Marcar ruta como no leida");

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
    //FUNCIONES DE CAMPOS
    fn_regional();
    fn_ciclo();
    fn_ruta();
    fn_lect();
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
    //BOTONES-EVENTOS
	$("#co_filtro").on("click", function (e) {
		fn_Muestra_Filtro();
        fn_lim_filtro();
	});
	
    $("#co_cerrar_t").on("click", function (e) {
        window.close(); 
    }); 
 
	$("#co_leer").on("click", function (e) {
		fn_Muestra_Lectura();
        fn_lim_lec();
	});
	$("#co_act").on("click", function (e) {
		fn_actualizar();
	});
    $("#co_rut_no_lei").on("click", function (e) {
		fn_marcar();
	});
    $("#co_close").on("click", function (e) {
		$('#div_filtro_bts').modal('hide');
	});
         
     $("#co_close_lec").on("click", function (e) {
		$('#div_lec_bts').modal('hide');
	});
     $("#co_close_act").on("click", function (e) {
		$('#div_act_bts').modal('hide');
	});
         
    $("#co_excel").on("click", function (e) {
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
	
	
	/*$grid.pqGrid({
		editorEnd: function( event, ui ){
			if(ui.dataIndx == "C9"){
				//alert(ui.dataIndx);
				//Debe validar la clave
				//si clave es valida hace flag = 1; sino flag = 0
				flag = 1;
				
			}
			else{
				//Valida que lectura sea un numero valido
				//metodo que actualiza la lectura
				//Una vez actualiza flag = 0;
				//var C9 = ui.dataIndx;
				var $select_col = $(".select-column");
				var fila_grid =  parseInt(ui.rowIndx)+1;
				//$select_col.append("<option>" + ui.dataIndx + "</option>");
				$select_col.append("<option value'C9'>C9</option>");
				$("#div_grid_dos").pqGrid("setSelection", null);
                $("#div_grid_dos").pqGrid("setSelection", { rowIndx: fila_grid, dataIndx: ui.dataIndx });
                //$("#div_grid_dos").pqGrid("setSelection", { rowIndx: 2, dataIndx: C9});
				
				$grid.pqGrid("setSelection", null);
                //$grid.pqGrid("setSelection", { rowIndx: 1, dataIndx: ui.dataIndx });
                $grid.pqGrid("setSelection", { rowIndx: fila_grid, dataIndx: $select_col });
				flag = 0;
			}
			
		}
		
    });*/
	

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
	$("._input_selector").inputmask("dd/mm/yyyy");

	jQuery('#tx_lec_ant').keypress(function (tecla) {
		if (tecla.charCode < 48 || tecla.charCode > 57) return false;
	});
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
	//Evento de cambio en combo
	$("#cb_regional").on("change", function(evt){
		if($(this).val() == ""){
			fn_vaciar_fil(); 
		}
		else{
			fn_ciclo();
			$("#cb_ciclo").focus();	
		}
	});
	
	//Evento de cambio en combo
	$("#cb_ciclo").on("change", function(evt){
		if($(this).val() ==""){
			fn_lim_ciclo();
		}
		else{
			fn_ruta();
			$("#cb_ruta").focus();
		}
	});
    
    //BOTONES-FILTRO
	$("#co_aceptar").on("click", function () {
		//Validación de informacion
		if ($.trim($("#co_aceptar").text()) == "Aceptar") {
			if ($("#cb_regional").val() ==""){
				fn_mensaje_boostrap("FAVOR SELECCIONE UNA REGIONAL", g_titulo, $("#cb_regional"));
				fn_lim_fil_fil();
                return;
                
			}else{
				if ($("#cb_ciclo").val()==""){
					fn_mensaje_boostrap("FAVOR SELECCIONE UN CICLO", g_titulo, $("#cb_ciclo"));
					 fn_lim_fil_ci();
					 return;
				}else{
					if ($("#cb_ruta").val()==""){
						fn_mensaje_boostrap("FAVOR SELECCIONE UNA RUTA", g_titulo, $("#cb_ruta"));
						return;
					}
				}
			}
		}
             	
		fn_carga_grilla();
		$('#div_filtro_bts').modal('hide');
		fn_lim_filtro();
            
	});
    	

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
    
     //BOTONES-LECTURA
    	$("#co_aceptar_lec").on("click", function (){
		//Validación de informacion
		if ($.trim($("#co_aceptar_lec").text()) == "Aceptar"){
			if ($("#cb_lector").val() == ""){
               fn_mensaje_boostrap("FAVOR SELECCIONE UN LECTOR", g_titulo, $("#cb_lector"));
				return; 
			}else{
				
				if ($("#fec_lect").val() == ""){
					fn_mensaje_boostrap("DIGITE LA FECHA", g_titulo, $("#fec_lect"));
					return;
				}

			}
			if(fn_validar_fecha($("#fec_lect").val()) == false){
				fn_mensaje_boostrap("INFORMACIÓN INCORRECTA EN EL CAMPO FECHA DE PROCESO. EL FORMATO ES DD/MM/YYYY.", g_titulo, $("#fec_lect"));
				return false;
			}
			$('#div_lec_bts').modal('hide');
			fn_lim_lec();
			fn_carga_grilla();
                    
		}
	});
 
   
});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_setea_grid_principal() {
	var data = [
		{ C1: "1", C2: "295264", C3: "141139947", C4: "5", C5: "SERVE E INV DIAMOND SA", C6: "UMB MARCASA CALLE VIA JO", C7: "16-050-0160", C8: "MCUB", C9: "030", C10: "0", C11: "0" },
		{ C1: "1", C2: "295264", C3: "141139947", C4: "5", C5: "KEYTLING GISELLE TREJOS VAR", C6: "RES-COL-LOS.ALAMOS.APTO", C7: "16-050-0160", C8: "MCUB", C9: "030", C10: "0", C11: "0" },
		{ C1: "1", C2: "295264", C3: "141139947", C4: "5", C5: "REYNA P Y OTROS R", C6: "LA FLORIDA 00026", C7: "16-050-0160", C8: "MCUB", C9: "030", C10: "0", C11: "0" }
	];
	var obj = {
		height: 540,
		showTop: true,
		showBottom: true,
		showHeader: true,
		roundCorners: true,
		rowBorders: true,
		columnBorders: true,
		autoRow: false,
		trackModel: { on: true },
		editor: { type: "textbox", select: true, style: "outline:none;" },
		numberCell: { show: true},
		title: "Ingreso de lecturas tomadas en terreno",
		scrollModel: { theme: true },
		toolbar:
		{
			cls: "pq-toolbar-export",
			items:
				[{ type: "button", label: " Filtros", attr: "id=co_filtro", cls: "btn btn-primary" },
				{ type: "button", label: "Lectura", attr: "id=co_leer", cls: "btn btn-primary" },
                { type: "button", label: "Marcar ruta como no leida", attr: "id=co_rut_no_lei", cls: "btn btn-primary btn-sm" },
				{ type: "button", label: "Excel", attr: "id=co_excel", cls: "btn btn-primary btn-sm" },                 
                { type: "button", label: "Cerrar", attr: "id=co_cerrar_t", cls: "btn btn-secondary btn-sm" }
               
				]
		},
        editModel: {
            clicksToEdit: 1,
            keyUpDown: true,
            pressToEdit: true,
            cellBorderWidth: 0
        },
	 editorKeyDown: function( event, ui ) {
		var x = event.which || event.keyCode;
		var grid = this;
		if(x==13)
		{
			if(ui.dataIndx=="C10" || flag == 0)
			{
				setTimeout(function(){
						$("#div_grid_dos").pqGrid( "setSelection", {rowIndx: (ui.rowIndx+1),colIndx: 7, focus:true} );

				}, 100);		   
			}
		}
	},
	dataModel:{ data: data }
	};
	
	obj.colModel = [
		{ title: "NIC", width: 20, dataType: "number", dataIndx: "C2", halign: "center", align: "center", editable:false },
		{ title: "Medidor", width: 90, dataType: "number", dataIndx: "C3", halign: "center", align: "center", editable:false  },
		{ title: "N.D", width: 5, dataType: "number", dataIndx: "C4", halign: "center", align: "center", editable:false  },
		{ title: "Nombre Cliente", width: 200, dataType: "string", dataIndx: "C5", halign: "center", align: "center", editable:false  },
		{ title: "Dirección", width: 300, dataType: "string", dataIndx: "C6", halign: "center", align: "center", editable:false  },
		{ title: "Sec. Ruta", width: 120, dataType: "string", dataIndx: "C7", halign: "center", align: "center", editable:false  },
		{ title: "T. Med", width: 20, dataType: "string", dataIndx: "C8", halign: "center", align: "center", editable:false },
		{ title: "Clave", width: 10, dataType: "string", dataIndx: "C9", halign: "center", align: "center", editor: {type: "textbox" } },
		{ title: "Lectura tomada", width:110, dataType: "string", dataIndx: "C10", halign: "center", align: "center", editor: {type: "textbox" }}
	];

	$grid = $("#div_grid_dos").pqGrid(obj);	
	
	$grid.pqGrid("refreshDataAndView");
	
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_Muestra_Filtro() {
	$("#div_filtro_bts").modal({ backdrop: "static", keyboard: false });
	$("#div_filtro_bts").on("shown.bs.modal", function () {
		$("#div_filtro_bts div.modal-footer button").focus();

	});


}
function fn_Muestra_Lectura() {
	$("#div_lec_bts").modal({ backdrop: "static", keyboard: false });
	$("#div_lec_bts").on("shown.bs.modal", function () {
		$("#div_lec_bts div.modal-footer button").focus();

	});


}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
function fn_carga_grilla() {

}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
function fn_mensaje_bootstrap_lec(){
    $("#div_msg_bts_lec").modal({ backdrop: "static", keyboard: false });
	$("#div_msg_bts_lec").on("shown.bs.modal", function () {
		$("#div_msg_bts_lec div.modal-footer button").focus();

	});
    
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
function fn_mensaje_bootstrap_fec(){
    $("#div_msg_bts_fec").modal({ backdrop: "static", keyboard: false });
	$("#div_msg_bts_fec").on("shown.bs.modal", function () {
		$("#div_msg_bts_fec div.modal-footer button").focus();
	});
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
function fn_mensaje_bootstrap_fecv(){
    $("#div_msg_bts_fecv").modal({ backdrop: "static", keyboard: false });
	$("#div_msg_bts_fecv").on("shown.bs.modal", function () {
		$("#div_msg_bts_fec div.modal-footer button").focus();

	});   
}

//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
function fn_regional() {
	/*
	$("#cb_regional").html("");
	$("#cb_ciclo").html("");
	$("#cb_ruta").html("");

	parameters = 
	{
		"func":"fn_regional",
		"empresa":$("#tx_empresa").val()
	};

	HablaServidor(url,parameters,'text', function(text) 
	{
		if(text != "")
			$("#cb_regional").html(text);
	});
	*/
	$("#cb_regional").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
function fn_ciclo() {
	/*
	$("#cb_ciclo").html("");
	$("#cb_ruta").html("");
	
	parameters = 
    {
		"func":"fn_ciclo",
		"empresa":$("#tx_empresa").val(),
		"p_regional":$("#cb_regional").val()
		
    };
    HablaServidor(url,parameters,'text', function(text) 
    {
        if(text != "")
            $("#cb_ciclo").html(text);
    });
	*/
	
	$("#cb_ciclo").html("<option value='' selected></option><option value='1'>10</option> <option value='2' >20</option> <option value='3'>30</option>");
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
function fn_ruta() {
	/*
	
	$("#cb_ruta").html("");

    parameters = 
    {
		"func":"fn_ruta",
		"empresa":$("#tx_empresa").val(),
		"p_regional":$("#cb_regional").val(),
		"p_ciclo":$("#cb_ciclo").val()
    };
	
    HablaServidor(url,parameters,'text', function(text) 
    {
        if(text != "")
            $("#cb_ruta").html(text);
    });
	*/
 
	$("#cb_ruta").html("<option value='' selected></option><option value='1'>005</option> <option value='2' >010</option> <option value='3'>015</option>");
    }

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
function fn_actualizar(){
	alert('Se actualizo.');
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
function fn_marcar(){
 	alert('Se marco como no leida.');
}

//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
//FUNCIONES LIMPIAR-MODAL
function fn_lim_filtro() {
	$("#cb_regional").val("");
	$("#cb_ciclo").val("");
	$("#cb_ruta").val("");
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
function fn_vaciar_fil() {	
	$("#cb_ciclo").val("");
	$("#cb_ruta").val(""); 
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
function fn_lim_ciclo() {
	$("#cb_ruta").val("");

}
function fn_lim_lec() {
	$("#cb_lector").val("");
    $("#fec_lect").val("");
	
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
function fn_lim_fil_fil() {
	$("#cb_ciclo").val("");
    $("#cb_ruta").val("");
	
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
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

