var g_modulo="Facturación de Clientes - Lecturas y Consumos";
var g_tit = "Ingreso de Agenda de Facturación";
var $grid_principal;
var $grid_2;
var $grid_ruta;
var parameters = {};
var Filtros = [];
var sql_grid_prim = "";
var sql_grid_dos = "";
var sql_grid_3 = "";
//var my_url = "con_age_fac.asp";

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
$(document).keydown(function(e) {

	if (e.keyCode === 8 ) {
		var element = e.target.nodeName.toLowerCase();
		if ((element != 'input' && element != 'textarea') || $(e.target).attr("readonly")) {
			return false;
		}
	}
});

$(document).ready(function() {
    
    // PARA ELIMINAR EL SUBMIT
	$("button").on("click", function(){return false;});

    //INGRESA LOS TITULOS
    document.title = g_tit ;
	document.body.scroll = "yes";
    
	$("#div_header").load("syn_globales/header.htm", function() {  ///raiz/syn_globales/
		$("#div_mod0").html(g_modulo);
		$("#div_tit0").html(g_tit);	
	}); 
	
    $("#excel_archivo").val("Agenda_facturacion.xls");
	
	//Se cargan las variables que vienen desde el server
	/*
	$("#tx_empresa").val(SYNSegCodEmpresa);
	$("#tx_rol").val(SYNSegRol);
	$("#tx_ip").val(SYNSegIP);
	$("#tx_rolfun").val(SYNSegRolFuncion);
	*/
	//ojo colocar cuando se active el asp --- NO quitar */
    
    
    // INICIA CON EL CURSOR EN EL CAMPO FECHA
	$("._input_selector").inputmask("dd/mm/yyyy");
	$("#tx_ciclo").inputmask({mask:"99", rightAlign: false, placeholder: ""});
   
	
    //DEFINE LA GRILLA PRINCIPAL
    fn_setea_grid_principal();
    //DIBUJA LOS ICONOS DE LOS BOTONES     
    
    $("#co_filtro").html("<span class='glyphicon glyphicon-search'></span> Filtros");
    $("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");
    $("#co_nuevo").html("<span class='glyphicon glyphicon-plus'></span> Nuevo");
    $("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");    
	
    //EVENTO BOTONES
	
    $("#co_filtro").on("click", fn_Muestra_Filtro);
    $("#co_nuevo").on("click", fn_crea_agenda);
    
     $("#co_cerrar").on("click", function (e) {
        window.close(); 
    });    
    
	$("#co_close").on("click", function (e) {
        $('#div_filtro_bts').modal('hide'); 
		
    });
	
	$("#co_det_cerrar").on("click", function (e) {
        $('#div_det_age').modal('hide'); 
		fn_limpia_filtro();
    });
	
	$("#co_aceptar").on("click", function (e) {
        if(valida_datos()){
			if($.trim($("#co_aceptar").text()) == "Modificar")
				$('#div_det_age').modal('hide'); 
			else
				fn_limpia_filtro();
			//fn_carga_grid_principal();
		}
    });
	
	$("#co_fil_aceptar").on("click", function (e) {
        
        if($("#tx_fec_proceso").val() != ""){
			if (fn_validar_fecha($("#tx_fec_proceso").val()) == false){
				fn_mensaje_boostrap("VERIFICAR LA FECHA DE PROCESO. EL FORMATO ES DD/MM/YYYY", g_tit, $("#tx_fec_proceso") );
				return;
		   }
	    }
		else{
			fn_mensaje_boostrap("FAVOR INGRESAR UNA FECHA DE PROCESO!!!", g_tit, $("#tx_fec_proceso") );
			return;
		}
		$('#div_filtro_bts').modal('hide'); 
        //fn_carga_grid_principal();
    });
	
	$("#co_fil_limpiar").on("click", function (e) {
        fn_limpia_filtro(); 
    });
    
    //EVENTO DBL_CLICK DE LA GRILLA
    $grid_principal.pqGrid({
		rowDblClick: function( event, ui ) {
			if (ui.rowData) 
				{
					var dataCell = ui.rowData;
					fn_Muestra_detalle(dataCell.C2, dataCell.C4, dataCell.C5, dataCell.C6, dataCell.C7, dataCell.C8, dataCell.C9, dataCell.C10, dataCell.C11, dataCell.C12);
				}
			}
	});
	
	
	$("#div_filtro_bts").draggable({
        handle: ".modal-header"
    });
	    
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
		} else {
			return false;
		}
	}
	else {
		return false;
	}
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_setea_grid_principal()
{     
	var data =  [
		  { C1: '01/08/2019', C2: '04', C3: 'U', C4: 'Lun 04/08/2019', C5:'Mar 05/08/2019', C6:'Mar 15/08/2019',
		   C7:'Vie 25/08/2019', C8:'Mie 25/08/2019', C9:'Jue 30/08/2019', C10:'Mie 25/08/2019', C11:'Jue 30/10/2019', C12:'Jue 30/10/2019', C13:'31'},
		 { C1: '01/08/2019', C2: '05', C3: 'U', C4: 'Lun 04/08/2019', C5:'Mar 05/08/2019', C6:'Mar 15/08/2019',
		   C7:'Vie 25/08/2019', C8:'Mie 25/08/2019', C9:'Jue 30/08/2019', C10:'Mie 25/08/2019', C11:'Jue 30/10/2019', C12:'Jue 30/10/2019', C13:'31'},
		   { C1: '01/08/2019', C2: '21', C3: 'U', C4: 'Lun 04/08/2019', C5:'Mar 05/08/2019', C6:'Mar 15/08/2019',
		   C7:'Vie 25/08/2019', C8:'Mie 25/08/2019', C9:'Jue 30/08/2019', C10:'Mie 25/08/2019', C11:'Jue 30/10/2019', C12:'Jue 30/10/2019', C13:'31'}
		 ]
    var obj = {  
	        height: "100%",
            showTop: true,
			showBottom:true,
            showTitle : false,
			title: "Ingresp de Agenda de Facturación",
            roundCorners: true,
            rowBorders: true,
            columnBorders: true,
            collapsible:true,
			editable:false,
            selectionModel: { type: 'row',mode:'single'},
            numberCell: { show: false },
			pageModel: { rPP: 200, type: "local", rPPOptions: [100, 200, 500]},
        	scrollModel:{theme:true},
			toolbar:
           {
               cls: "pq-toolbar-export",
               items:
               [
                   { type: "button", label: " Filtros"      ,  attr:"id=co_filtro", cls:"btn btn-primary"},
                   { type: "button", label: " Nuevo"      ,  attr:"id=co_nuevo", cls:"btn btn-primary"},
                   { type: "button", label: " Excel"        ,  attr:"id=co_excel"       , cls:"btn btn-primary"},
                   { type: "button", label: " Cerrar"       ,  attr:"id=co_cerrar"      , cls:"btn btn-default"},
               ]
           }
        };
		
		obj.colModel = [		
          { title: "Periodo", width: 80, dataType: "string", dataIndx: "C1", halign:"center", align:"center"},
        { title: "Ciclo", width: 50, dataType: "string", dataIndx: "C2", halign:"center", align:"center" },
        //{ title: "Ruta", width: 100, dataType: "string", dataIndx: "C4", halign:"center", align:"center" },
        { title: "Tipo Lectura", width: 80, dataType: "string", dataIndx: "C3", halign:"center", align:"center", hidden:true },
        { title: "Fecha Libro", width: 115, dataType: "string", dataIndx: "C4", halign:"center", align:"center"},
        { title: "Fecha Lectura", width: 115, dataType: "string", dataIndx: "C5", halign:"center", align:"center" },
        { title: "Fecha Facturación", width: 130, dataType: "string", dataIndx: "C6", halign:"center", align:"center" },
        { title: "Fecha Reparto", width: 115, dataType: "string", dataIndx: "C7", halign:"center", align:"center" },
        { title: "Fecha Lec. Anterior", width: 130, dataType: "string", dataIndx: "C8", halign:"center", align:"center" },
        { title: "Vcto. Normal ", width: 115, dataType: "string", dataIndx: "C9", halign:"center", align:"center" },
        { title: "Corte Normal", width: 115, dataType: "string", dataIndx: "C10", halign:"center", align:"center" },
        { title: "Vcto. Gobierno ", width: 115, dataType: "string", dataIndx: "C11", halign:"center", align:"center" },
        { title: "Corte Gobierno", width: 115, dataType: "string", dataIndx: "C12", halign:"center", align:"center" },
        { title: "Dif Recor", width: 70, dataType: "string", dataIndx: "C13", halign:"center", align:"center" },
        { title: "Estado", width: 50, dataType: "string", dataIndx: "C14", halign:"center", align:"center" }
        ];
	obj.dataModel = { data: data };	
	
    $grid_principal = $("#div_grid_principal").pqGrid(obj);
	

	
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_Muestra_Filtro()
{

    $("#div_filtro_bts").modal({backdrop: "static",keyboard:false});
	$("#div_filtro_bts").on("shown.bs.modal", function () {
		$("#div_filtro_bts div.modal-footer button").focus();
	});

}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_Muestra_detalle(ciclo, libro, lectura, fact, reparto, v_normal, c_normal, v_gob, c_gob)
{
	$("#tx_ciclo").val(ciclo);
    $("#tx_ciclo").prop("disabled", true);
	$("#tx_fec_libro").val(libro);
	$("#tx_fec_lectura").val(lectura);
	$("#tx_fec_fact").val(fact);
	$("#tx_fec_reparto").val(reparto);
	$("#tx_fec_vto_nor").val(v_normal);
	$("#tx_fec_corte_nor").val(c_normal);
	$("#tx_fec_vto_gob").val(v_gob);
    $("#tx_fec_corte_gob").val(c_gob);
	$("#co_aceptar").html("<span class='glyphicon glyphicon-floppy-disk'></span> Modificar");
	$("#titulo_det_age").text("Modificación de agenda de Facturación");
	
    $("#div_det_age").modal({backdrop: "static",keyboard:false});
	$("#div_det_age").on("shown.bs.modal", function () {
		$("#div_det_age div.modal-footer button").focus();
		//Aplicar trabajo cuando esta visible el objeto	
	});
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_crea_agenda()
{
	fn_limpia_filtro();
	$("#co_aceptar").html("<span class='glyphicon glyphicon-floppy-disk'></span> Agregar");
	$("#titulo_det_age").text("Creación de agenda de Facturación");
	
    $("#div_det_age").modal({backdrop: "static",keyboard:false});
	$("#div_det_age").on("shown.bs.modal", function () {
		$("#tx_ciclo").focus();
		//Aplicar trabajo cuando esta visible el objeto	
	});
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_carga_grid_principal()
{
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
        url: my_url+"?"+jQuery.param( parameters ),
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
	
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_filtro()
{
	parameters = 
    {
		"func":"fn_grid_principal",
		"empresa":$("#tx_empresa").val(),
		"p_periodo":$("#tx_fil_periodo").val(),
        "p_cod_regional":$("#cb_fil_regional").val(),
        "p_ciclo":$("#cb_fil_ciclo").val()
		
    };
	
	Filtros = [];
	
	if ($("#fec_proc_ini").val()!='') Filtros.push('Fecha Proceso = '+$("#fec_proc_ini").val() + ' hasta ' +$("#fec_proc_fin").val());
	if ($("#fec_libro_ini").val()!='') Filtros.push('Fecha Libro = '+$("#fec_libro_ini").val() + ' hasta ' +$("#fec_libro_fin").val());
	if ($("#fec_lec_ini").val()!='') Filtros.push('Fecha Lectura = '+$("#fec_lec_ini").val() + ' hasta ' +$("#fec_lec_fin").val());
	if ($("#fec_fac_ini").val()!='') Filtros.push('Fecha Facturación = '+$("#fec_fac_ini").val() + ' hasta ' +$("#fec_fac_fin").val());
	
	$("#filtro").val(Filtros);
}

function fn_valida_datos(){
	if($("#tx_ciclo").val() == ""){
		fn_mensaje_boostrap("DEBE DIGITAR UN CILO!!!", g_tit, $("#tx_ciclo") );
		return false;
	}
	
	if($("#tx_fec_libro").val() != ""){
		if (fn_validar_fecha($("#tx_fec_libro").val()) == false){
			fn_mensaje_boostrap("VERIFICAR LA FECHA DE LIBRO. EL FORMATO ES DD/MM/YYYY", g_tit, $("#tx_fec_libro") );
			return false;
	   }
	}
	else{
		fn_mensaje_boostrap("FAVOR INGRESAR UNA FECHA DE LIBRO!!!", g_tit, $("#tx_fec_libro") );
		return false;
	}
	if($("#tx_fec_lectura").val() != ""){
		if (fn_validar_fecha($("#tx_fec_lectura").val()) == false){
			fn_mensaje_boostrap("VERIFICAR LA FECHA DE LECTURA. EL FORMATO ES DD/MM/YYYY", g_tit, $("#tx_fec_lectura") );
			return false;
	   }
	}
	else{
		fn_mensaje_boostrap("FAVOR INGRESAR UNA FECHA DE LECTURA!!!", g_tit, $("#tx_fec_lectura") );
		return false;
	}
	if($("#tx_fec_fact").val() != ""){
		if (fn_validar_fecha($("#tx_fec_fact").val()) == false){
			fn_mensaje_boostrap("VERIFICAR LA FECHA DE FACTURACIÓN. EL FORMATO ES DD/MM/YYYY", g_tit, $("#tx_fec_fact") );
			return false;
	   }
	}
	else{
		fn_mensaje_boostrap("FAVOR INGRESAR UNA FECHA DE FACTURACIÓN!!!", g_tit, $("#tx_fec_fact") );
		return false;
	}
	if($("#tx_fec_reparto").val() != ""){
		if (fn_validar_fecha($("#tx_fec_reparto").val()) == false){
			fn_mensaje_boostrap("VERIFICAR LA FECHA DE REPARTO. EL FORMATO ES DD/MM/YYYY", g_tit, $("#tx_fec_reparto") );
			return false;
	   }
	}
	else{
		fn_mensaje_boostrap("FAVOR INGRESAR UNA FECHA DE REPARTO!!!", g_tit, $("#tx_fec_reparto") );
		return false;
	}
	
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_limpia_filtro() 
{
	$("#tx_ciclo").val("");
    $("#tx_ciclo").prop("disabled", false);
	$("#tx_fec_libro").val("");
	$("#tx_fec_lectura").val("");
	$("#tx_fec_fact").val("");
	$("#tx_fec_reparto").val("");
	$("#tx_fec_vto_nor").val("");
	$("#tx_fec_corte_nor").val("");
	$("#tx_fec_vto_gob").val("");
    $("#tx_fec_corte_gob").val("");
	
}


