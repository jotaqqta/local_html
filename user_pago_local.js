var g_modulo = "Módulo de Recaudación";
var g_titulo = "Listado de Usuarios de Pagos Locales";
var my_url = "reg_ciclo_ruta.asp";
var $grid;


$(document).ready(function() {

	// PARA ELIMINAR EL SUBMIT
	$("button").on("click", function(){return false;});

	document.body.scroll = "yes";
	
	// SE COLOCAN LOS TITULOS
	$("#div_mod1").html(g_modulo);
	$("#div_tit1").html(g_titulo);

	$("#tituloexcel").val(g_titulo);
	$("#excel_archivo").val("regional_ciclo_ruta.xls");
	$("#Rol").val(fn_get_param("Rol"));

	$("#tx_empresa").val(fn_get_param("Empresa"));
	
	$("#tx_rol").val(fn_get_param("Rol"));
	$("#tx_rolfun").val(fn_get_param("RolFun"));
	$("#tx_ip").val(fn_get_param("ip"));


	fn_setea_grid_prin();	
	//fn_carga_regional();	

	$("#co_leer").prop("disabled", true);
	//$("#co_excel").prop("disabled", true);
	$("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");	
	$("#co_filtro").html("<span class='glyphicon glyphicon-search'></span> Filtros");	
	
	//Eventos combo
	$("#cb_regional").on("change", function(evt) 
	{
		$grid.pqGrid( "option", "dataModel.data", []);
		$grid.pqGrid( "refreshView" );
		if($(this).val() =="")
			fn_limpiar();
		else{
			$("#co_leer").prop("disabled", true);
			fn_carga_ciclo();
			$("#cb_ciclo").prop("disabled", false);
		}
	});	
		
	$("#cb_ciclo").on("change", function(evt) 
	{
		$grid.pqGrid( "option", "dataModel.data", []);
		$grid.pqGrid( "refreshView" );
		if($(this).val() ==""){
			$("#co_leer").prop("disabled", true);
			$("#co_excel").prop("disabled", true);
		}
		else
			$("#co_leer").prop("disabled", false);
	});		
		
	$("#co_filtro").on("click", function (e) {
		fn_carga_tip_usuario();
		fn_abre_modal(); 
	});
	 
	$("#co_close").on("click", function (e){
		$("#dlg_user").modal("hide");
	});	
		
	$("#co_leer").on("click", function (e){
		fn_habilita_des(true);
		fn_carga_grilla();
		$("#co_leer").prop("disabled", true);
		$("#co_cerrar").html("<span class='glyphicon glyphicon-remove'></span> Cancelar");
	});	
		
	$("#co_cerrar").on("click", function (e){
		if($("#co_cerrar").text() == " Cancelar"){
			fn_limpiar();
			$("#cb_regional").val("");
			$grid.pqGrid( "option", "dataModel.data", []);
			$grid.pqGrid( "refreshView" );
			$("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");
			fn_habilita_des(false);
			$("#cb_regional").focus();
		}
		else
			window.close(); 
	});	

	$("#co_confirmar").on("click", function (e){
		if($("#co_confirmar").text() == "Guardar"){
			fn_guardar();
		}
		else
			fn_modificar();	
	});	
	
	$(window).scrollTop(0);
	
});// fin ready

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_limpiar(){
	$("#cb_ciclo").html("");
	$("#cb_ciclo").prop("disabled", true);
	$("#co_excel").prop("disabled", true);
	$("#co_leer").prop("disabled", true);
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_setea_grid_prin(){
	
	/*var obj = {
            height: 400,
            showTop: true,
			showBottom:true,
            showHeader: true,
			showTitle:false,
        	collapsible:false,
            roundCorners: true,
            rowBorders: true,
            columnBorders: true,
			editable:false,
            selectionModel: { type: "row", mode:"single"},
            numberCell: { show: false },
	       	scrollModel:{autoFit:true, theme:true},
			pageModel: { rPP: 20, type: "local", rPPOptions: [20, 50, 100]},
			toolbar:
           {
               cls: "pq-toolbar-export",
               items:
               [
                   { type: "button", label: " Agregar Ruta",  attr:"id=co_excel", cls:"btn btn-primary btn-sm"},
               ]
           }
        };*/
	
		var obj = {  
	        height: "100%",
            showTop: true,
			showBottom:true,
            showTitle : false,
            roundCorners: true,
            rowBorders: true,
            columnBorders: true,
            collapsible:false,
			editable:false,
            selectionModel: { type: 'row',mode:'single'},
            numberCell: { show: true },
			pageModel: { rPP: 20, type: "local", rPPOptions: [20, 50, 100]},
        	scrollModel:{theme:true},
			toolbar:
           {
               cls: "pq-toolbar-export",
               items:
               [
                   { type: "button", label: " Filtros"      ,  attr:"id=co_filtro", cls:"btn btn-primary"},
                   { type: "button", label: " Excel"        ,  attr:"id=co_excel"       , cls:"btn btn-primary"},
                   { type: "button", label: " Cerrar"       ,  attr:"id=co_cerrar"      , cls:"btn btn-primary"},
               ]
           }
        };
		
		obj.colModel = [
            { title: "Rol", width: '120', dataType: "string", dataIndx: "c1", align: "center", halign: "center" },
            { title: "Nombre", width: '220', dataType: "string", dataIndx: "c2", align: "center", halign: "center" },
            { title: "Tipo Usuario", width: '120', dataType: "string", dataIndx: "c3", align: "center", halign: "center" },
            { title: "Oficina", width: '180', dataType: "string", dataIndx: "c4", align: "left", halign: "center" },
			{ title: "Codigo Cajero", width: '120', dataType: "string", dataIndx: "c5", align: "left", halign: "center"},
            { title: "Estado",width: '120', dataType: "string", dataIndx: "c5", align: "center", halign: "center" }
        ];
		
		obj.dataModel = { data: data };

	var data = [];
	
	$grid = $("#div_grid").pqGrid(obj);
	//$grid.pqGrid( "option", "dataModel.data", [] );
    //$grid.pqGrid( "refreshDataAndView" );
	//$grid.pqGrid( "scrollRow", { rowIndxPage: 10 } );	
	
	$grid.pqGrid({
        rowDblClick: function( event, ui ) {
            if (ui.rowData) {
                var dataCell = ui.rowData;
                fn_abre_modal_mod(dataCell.c1, dataCell.c2, dataCell.c3, dataCell.c4, dataCell.c5);
            }
        }
    });	
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_carga_regional(){
	
	parameters = 
    {
		"func":"fn_regional",
		"empresa":$("#tx_empresa").val()
    };
    HablaServidor(my_url,parameters,'text', function(text) 
    {
        if(text != "")
            $("#cb_regional").html(text);
    });	
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_carga_ciclo(){
	
	parameters = 
	{
		"func":"fn_ciclo",
		"empresa":$("#tx_empresa").val(),
		"p_regional":$("#cb_regional").val()
	};
	HablaServidor(my_url, parameters, 'text', function(text)
	{
		if(text!="")
			$("#cb_ciclo").html(text);
	});
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_carga_tip_usuario(){
	
	parameters = 
	{
		"func":"fn_tipo_usuario",
		"empresa":$("#tx_empresa").val(),
		"p_regional":$("#cb_regional").val(),
		"p_ciclo":$("#cb_ciclo").val()
	};
	
	/*HablaServidor(my_url, parameters, 'text', function(text)
	{
		if(text!="")
			$("#cb_ruta").html(text);
	});*/
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_abre_modal(){
    $("#dlg_user").modal({backdrop: "static",keyboard:false});
    $("#tx_tit_guardar").text("Filtro de Usuarios");
	$("#cb_oficina").val("");
	$("#cb_tip_usuario").val("");
	$("#tx_rol_pl").val("");
    $("#dlg_user").on("shown.bs.modal", function () {  	
		$("#cb_tip_usuario").focus();
    });
} 

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_abre_modal_mod(p_regional, p_ciclo, p_ruta, p_desc, p_cod_reg){
    $("#dlg_user").modal({backdrop: "static",keyboard:false});
    $("#tx_tit_guardar").text("Datos de la ruta");
	$("#tx_regional").val(p_regional);
	$("#tx_ciclo").val(p_ciclo);
	$("#tx_ruta").val(p_ruta);
	$("#tx_desc").val(p_desc);
	$("#gr_ruta_tx").show();
    $("#gr_ruta_cb").hide();
	$("#co_confirmar").html("<span class='glyphicon glyphicon-floppy-disk'></span>Modificar");
    $("#dlg_user").on("shown.bs.modal", function () {
        $("#tx_desc").focus();
    });
} 

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
function fn_carga_grilla(){
	
	parameters = 
    {
        "func":"fn_carga_grid",
        "empresa":$("#tx_empresa").val(),
		"p_regional":$("#cb_regional").val(),
		"p_ciclo":$("#cb_ciclo").val()
    };
	 
	var dataModel = 
    {        
        location: "remote",
        sorting: "local",
        dataType: "json",
        method: "POST",
        sortDir: ["up", "down"], 
        url: my_url+"?"+jQuery.param( parameters ),
        getData: function (dataJSON) 
        {
			total_register = $.trim(dataJSON.totalRecords);
			var data = dataJSON.data;
			var sql_excel= JSON.stringify(dataJSON.sql);
			$("#sql").val(eval(sql_excel));	
			if(total_register>=1)
			{
				$("#co_excel").attr("disabled", false);
			}
            return { data: dataJSON.data};
        },
        error: function(jqErr, err_stat, err_str) // ERROR EN EL ASP
        {
			fn_mensaje_boostrap(jqErr.responseText, g_titulo, "");
        }        
    }

    $grid.pqGrid( "option", "dataModel", dataModel );				
    $grid.pqGrid( "refreshDataAndView" );
	
	$("#co_excel").prop("disabled", false);	
}

function fn_guardar(){
	
	if($("#cb_ruta").val() == ""){
		fn_mensaje_boostrap("Favor seleccionar la ruta", g_titulo, $("#cb_ruta"));
		return;
	}
	
	if($("#tx_desc").val().length < 15){
		fn_mensaje_boostrap("LA OBSERVACIÓN DEBE TENER AL MENOS 15 CARACTERES", g_titulo, $("#tx_desc"));
		return;
	}
	
	var param= 
	{
		"func": "fn_inserta_ruta",
		"empresa" : $("#tx_empresa").val(),
		"p_rol":$("#tx_rol").val(),
		"p_ip":$("#tx_ip").val(),
		"p_regional":$("#cb_regional").val(),
		"p_ciclo":$("#cb_ciclo").val(),
		"p_ruta":$("#cb_ruta").val(),
		"p_obs":$("#tx_desc").val()	  
	};
	
	$("#dlg_user").modal("hide");
	
	HablaServidor(my_url, param, "text", function(resp_serv) 
	{
		if($.trim(resp_serv)=="") resp_serv = "ACCIÓN REALIZADA!!!";
		
		$grid.pqGrid( "refreshDataAndView" );
		fn_mensaje_boostrap(resp_serv, g_titulo, $(""));
	});
}

function fn_modificar(){
	
	if($("#tx_desc").val().length < 15){
		fn_mensaje_boostrap("LA OBSERVACIÓN DEBE TENER AL MENOS 15 CARACTERES", g_titulo, $("#tx_desc"));
		return;
	}
	
	var param= 
	{
		"func": "fn_modif_ruta",
		"empresa" : $("#tx_empresa").val(),
		"p_rol":$("#tx_rol").val(),
		"p_ip":$("#tx_ip").val(),
		"p_regional":$("#cb_regional").val(),
		"p_ciclo":$("#cb_ciclo").val(),
		"p_ruta":$("#tx_ruta").val(),
		"p_obs":$("#tx_desc").val()	  
	};
	
	$("#dlg_user").modal("hide");
	
	HablaServidor(my_url, param, "text", function(resp_serv) 
	{
		if($.trim(resp_serv)=="") resp_serv = "ACCIÓN REALIZADA!!!";
		
		$grid.pqGrid( "refreshDataAndView" );
		fn_mensaje_boostrap(resp_serv, g_titulo, $(""));
	});
}

function fn_habilita_des(estado){
	
	$("#cb_regional").prop("disabled", estado);
	$("#cb_ciclo").prop("disabled", estado);
}

function fn_valida_clientes_ruta(ruta){
	
	var hay_clientes = false;
					
	var parameters = {
		"func":"fn_valida_clientes_ruta",
		"p_ip":$("#tx_ip").val(),
		"p_rol":$("#tx_rol").val(),
		"p_regional":$("#cb_regional").val(),
		"p_ciclo":$("#cb_ciclo").val(),
		"p_ruta":ruta,
		"empresa":$("#tx_empresa").val()
	};
			
	HablaServidor(my_url, parameters, 'text', function(text) 
	{
		if(text != "0")
			hay_clientes = true;
	});
	return hay_clientes;
}

