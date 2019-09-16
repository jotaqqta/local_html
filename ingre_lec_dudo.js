var g_modulo = "Facturación Clientes - Lecturas y Consumos";
var g_titulo = "Ingreso de lecturas dudosas tomadas en terreno.";
var parameters = {};
var my_url = "reasigna_ajuste.asp";
var $grid;
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
	// INICIA CON EL CURSOR EN EL CAMPO No. ORDEN
	$("#tx_orden").focus();
	// EL CAMPO No. Orden lo limito a 8 digitos y solo numeros
	jQuery('#tx_orden').keypress(function (tecla) {
		if (tecla.charCode < 48 || tecla.charCode > 57) return false;
	});

	//Footer
	$("#div_footer").load("/syn_globales/footer.htm");
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
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
	$("._input_selector").inputmask("dd/mm/yyyy");

	jQuery('#tx_lec_ant').keypress(function (tecla) {
		if (tecla.charCode < 48 || tecla.charCode > 57) return false;
	});
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
    //BOTONES
       $("#cb_regional").on("change", function(evt){
        if($(this).val() == ""){
				//$("#cb_ruta").prop("disabled",true);
		 fn_vaciar_fil(); 
             $("#cb_ciclo").prop("disabled",true);
              $("#cb_ruta").prop("disabled",true);
        }
			else{
                fn_ciclo();
				$("#cb_ciclo").prop("disabled",false);
				$("#cb_ruta").prop("disabled",true);
				$("#cb_ciclo").focus();	
            }
    });
     $("#cb_ciclo").on("change", function(evt){
		if($(this).val() ==""){
			//$("#cb_ruta").prop("disabled",true);
			fn_lim_ciclo();
			$("#cb_ruta").prop("disabled",true);
		}
		else{
			fn_ruta();
			$("#cb_ruta").prop("disabled",false);
		$("#cb_ruta").focus();
		}
   });
    
    //BOTONES-FILTRO
	$("#co_aceptar").on("click", function () {
		//Validación de informacion
		if ($.trim($("#co_aceptar").text()) == "Aceptar") {
			if ($("#cb_regional").val() ==""){
				fn_mensaje_boostrap("CAMPOS DE REGIONAL SON OBLIGATORIOS", g_titulo, $("#cb_regional"));
				fn_lim_fil_fil();
				
                return;
                
			}else{
            if ($("#cb_ciclo").val()==""){
				fn_mensaje_boostrap("SELECCIONE CICLO", g_titulo, $("#cb_ciclo"));
                 fn_lim_fil_ci();
                 return;
			}
             if ($("#cb_ruta").val()==""){
				fn_mensaje_boostrap("DIGITE RUTA", g_titulo, $("#cb_ruta"));
				return;
			}else{
                fn_carga_grilla();
                $('#div_filtro_bts').modal('hide');
                fn_lim_filtro(); 
                
            }
            
        
            }
        }
	});
    	

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
         $("#cb_lector").on("change", function(evt){
        if($(this).val() == ""){
				//$("#cb_ruta").prop("disabled",true);
		fn_vaciar_lec();
        $("#fec_lect").prop("disabled",true);
        }
			else{
                
				
				$("#fec_lect").prop("disabled",false);
				$("#fec_lect").focus();	
            }
    });
    
    
     //BOTONES-LECTURA
    	$("#co_aceptar_lec").on("click", function (){
		//Validación de informacion
		if ($.trim($("#co_aceptar_lec").text()) == "Aceptar"){
			if ($("#cb_lector").val() == ""){
               fn_mensaje_boostrap("DIGITE LECTOR", g_titulo, $("#cb_lector"));
				
				return;
             
			}else{
				/*if (fn_validar_fecha($("#fec_lect").val()) == false){
				fn_mensaje_boostrap("INFORMACIÓN INCORRECTA EN EL CAMPO FECHA DE PROCESO. EL FORMATO ES DD/MM/YYYY", g_tit, $("#fec_lect") );
				return false;*/
				if ($("#fec_lect").val() == ""){
					fn_mensaje_boostrap("DIGITE LA FECHA", g_titulo, $("#fec_lect"));
				
				return;
					return;}
					else{
						if(fn_validar_fecha($("#fec_lect").val()) == false){
							fn_mensaje_boostrap("INFORMACIÓN INCORRECTA EN EL CAMPO FECHA DE PROCESO. EL FORMATO ES DD/MM/YYYY.", g_titulo, $("#fec_lect"));
							//fn_mensaje_bootstrap_fecv();
							return false;
					}

				}    
					$('#div_lec_bts').modal('hide');
					fn_lim_lec();
					fn_carga_grilla();
                    
			
             }
            
        }
	});
 
   
});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_setea_grid_principal() {
	var data = [
		{ C1: 1, C2: 295264, C3: 141139947, C4: 5, C5: "SERVE E INV DIAMOND SA", C6: "UMB MARCASA CALLE VIA JO", C7: "16-050-0160", C8: "MCUB", C9: 030, C10: 0 },
		{ C1: 1, C2: 295264, C3: 141139947, C4: 5, C5: "KEYTLING GISELLE TREJOS VAR", C6: "RES-COL-LOS.ALAMOS.APTO", C7: "16-050-0160", C8: "MCUB", C9: 030, C10: 0 },
		{ C1: 1, C2: 295264, C3: 141139947, C4: 5, C5: "REYNA P Y OTROS R", C6: "LA FLORIDA 00026", C7: "16-050-0160", C8: "MCUB", C9: 030, C10: 0 },

	];
	var obj = {
		height: 540,
		showTop: true,
		showBottom: true,
		showHeader: true,
		roundCorners: true,
		rowBorders: true,
		columnBorders: true,
		editable: true,
		selectionModel: { type: 'cell' },
		numberCell: { show: true},
		title: "Ingreso de lecturas dudosas tomadas en terreno",
		pageModel: { type: "local" },
		scrollModel: { theme: true },
		toolbar:
		{
			cls: "pq-toolbar-export",
			items:
				[{ type: "button", label: " Filtros", attr: "id=co_filtro", cls: "btn btn-primary" },
				{ type: "button", label: "Lectura", attr: "id=co_leer", cls: "btn btn-primary" },
				{ type: "button", label: "Actualizar", attr: "id=co_act", cls: "btn btn-primary" },
                { type: "button", label: "Marcar ruta como no leida", attr: "id=co_rut_no_lei", cls: "btn btn-primary btn-sm" },
				{ type: "button", label: "Excel", attr: "id=co_excel", cls: "btn btn-primary btn-sm" },
                 
                { type: "button", label: "Cerrar", attr: "id=co_cerrar_t", cls: "btn btn-secondary btn-sm" }
               
				]
		}
	};
	obj.colModel = [
		{ title: "NIC", width: 20, dataType: "number", dataIndx: "C2", halign: "center", align: "center", editable:false },
		{ title: "Medidor", width: 90, dataType: "number", dataIndx: "C3", halign: "center", align: "center", editable:false  },
		{ title: "N.D", width: 5, dataType: "number", dataIndx: "C4", halign: "center", align: "center", editable:false  },
		{ title: "Nombre Cliente", width: 200, dataType: "string", dataIndx: "C5", halign: "center", align: "center", editable:false  },
		{ title: "Dirección", width: 300, dataType: "string", dataIndx: "C6", halign: "center", align: "center", editable:false  },
		{ title: "Sec. Ruta", width: 120, dataType: "string", dataIndx: "C7", halign: "center", align: "center", editable:false  },
		{ title: "T. Med", width: 20, dataType: "string", dataIndx: "C8", halign: "center", align: "center", editable:false },
		{ title: "Clave", width: 10, dataType: "number", dataIndx: "C9", halign: "center", align: "center" },
		{ title: "Lectura tomada", width:110, dataType: "number", dataIndx: "C10", halign: "center", align: "center" }
	];

	obj.dataModel = { data: data };
	$grid = $("#div_grid_dos").pqGrid(obj);
	$grid.pqGrid("refreshDataAndView");
}

function fn_carga_orden() {
	dato_ori = [];
	parameters =
		{
			"func": "fn_lee_orden",
			"empresa": $("#tx_empresa").val(),
			"p_orden": $("#tx_orden").val()
		};
	HablaServidor(my_url, parameters, 'text', function (text) {
		if (text != "") {
			$("#co_leer").html("<span class='glyphicon glyphicon-user'></span> Reasignar");
			dato_ori = text.split("|");
			//$("#co_leer").prop("disabled",true);
			$("#tx_orden").prop("disabled", true);
			$("#tx_cod_cliente").val(dato_ori[1]);
			$("#tx_rol_actual").val(dato_ori[3]);
			$("#tx_nombre").val(dato_ori[4]);
			$("#tx_estado").val(dato_ori[5]);
			$("#tx_ruta").val(dato_ori[6]);
			$("#tx_tarifa").val(dato_ori[7]);
			$("#tx_actividad").val(dato_ori[8]);
		}
		else {
			fn_mensaje_boostrap("No se encontro la orden indicada!!!", g_titulo, $(""));
			return;
		}
		if (dato_ori[0] == "F") {
			$("#co_leer").prop("disabled", true);
			fn_mensaje_boostrap("ESTA ORDEN YA FUE FINALIZADA, NO PUEDE SER REASIGNADA !", g_titulo, $(""));
			return;
		}

		//$("#co_reasignar").prop("disabled",false);
		$("#cb_reasigna_nuevo").prop("disabled", false);

	});

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
function fn_carga_roles() {
	var param =
	{
		"func": "fn_roles_ajuste",
		"empresa": $("#tx_empresa").val()
	};
	HablaServidor(my_url, param, "text", function (text) {
		$("#cb_reasigna_nuevo").html(text);
	});
}

function fn_act_orden() {

	var param =
	{
		"func": "fn_actualiza",
		"empresa": $("#tx_empresa").val(),
		"p_orden": $("#tx_orden").val(),
		"rol": $("#tx_rol").val(),
		"p_rol_nuevo": $("#cb_reasigna_nuevo").val()
	};
	HablaServidor(my_url, param, "text", function (text) {
		if (text == "") {
			$("#cb_reasigna_nuevo").prop("disabled", true);
			$("#cb_reasigna_nuevo").prop("disabled", true);
			fn_mensaje_boostrap("ACCIÓN REALIZADA !", g_titulo, $(""));
			fn_limpiar();
		}
		else
			fn_mensaje_boostrap(text, g_tit, $(""));
	});
}

function fn_carga_opc_conve() {
	var options = '<option value="1"selected="selected">--- CHOOSE CITY --- </option>';
	$("#tx_fil_ciclo").html(options);
}
function fn_carga_grilla() {

}
function fn_mensaje_bootstrap_lec(){
    $("#div_msg_bts_lec").modal({ backdrop: "static", keyboard: false });
	$("#div_msg_bts_lec").on("shown.bs.modal", function () {
		$("#div_msg_bts_lec div.modal-footer button").focus();

	});
    

}
function fn_mensaje_bootstrap_fec(){
    $("#div_msg_bts_fec").modal({ backdrop: "static", keyboard: false });
	$("#div_msg_bts_fec").on("shown.bs.modal", function () {
		$("#div_msg_bts_fec div.modal-footer button").focus();

	});
    
    

}
function fn_mensaje_bootstrap_fecv(){
    $("#div_msg_bts_fecv").modal({ backdrop: "static", keyboard: false });
	$("#div_msg_bts_fecv").on("shown.bs.modal", function () {
		$("#div_msg_bts_fec div.modal-footer button").focus();

	});
    
    

}

//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
//FUNCIONES MODAL

function fn_regional() {

    /*parameters = 
    {
		"func":"fn_regional",
		"empresa":$("#tx_empresa").val(),
		"rol":$("#tx_rol").val()
    };
    HablaServidor(my_url,parameters,'text', function(text) 
    {
        if(text != "")
            $("#cb_regional").html(text);
    });*/

	$("#cb_regional").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
function fn_ciclo() {

    /*parameters = 
    {
		"func":"fn_regional",
		"empresa":$("#tx_empresa").val(),
		"rol":$("#tx_rol").val()
    };
    HablaServidor(my_url,parameters,'text', function(text) 
    {
        if(text != "")
            $("#cb_regional").html(text);
    });*/

	$("#cb_ciclo").html("<option value='' selected></option><option value='1'>10</option> <option value='2' >20</option> <option value='3'>30</option>");
}

function fn_ruta() {

    /*parameters = 
    {
		"func":"fn_regional",
		"empresa":$("#tx_empresa").val(),
		"rol":$("#tx_rol").val()
    };
    HablaServidor(my_url,parameters,'text', function(text) 
    {
        if(text != "")
            $("#cb_regional").html(text);
    });*/

	$("#cb_ruta").html("<option value='' selected></option><option value='1'>005</option> <option value='2' >010</option> <option value='3'>015</option>");
}
function fn_lect() {

    /*parameters = 
    {
		"func":"fn_regional",
		"empresa":$("#tx_empresa").val(),
		"rol":$("#tx_rol").val()
    };
    HablaServidor(my_url,parameters,'text', function(text) 
    {
        if(text != "")
            $("#cb_regional").html(text);
    });*/

	$("#cb_lector").html("<option value='' selected></option><option value='1'>005</option> <option value='2' >010</option> <option value='3'>015</option>");
}
function fn_actualizar(){
    alert('Se actualizo.');
}
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
function fn_vaciar_fil() {
	
	$("#cb_ciclo").val("");
	$("#cb_ruta").val("");
   
}


function fn_lim_ciclo() {
	$("#cb_ruta").val("");

}
function fn_lim_lec() {
	$("#cb_lector").val("");
    $("#fec_lect").val("");
	
}
function fn_vaciar_lec() {

    $("#fec_lect").val("");
	
}
function fn_lim_fil_fil() {
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

