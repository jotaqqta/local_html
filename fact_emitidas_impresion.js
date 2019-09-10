var g_modulo = "Facturación de Clientes";
var g_tit = "Facturas Emitidas Para Impresión";
var $grid_principal;
var $grid_2;
var $grid_ruta;
var parameters = {};
var Filtros = [];
var sql_grid_prim = "";
var sql_grid_dos = "";
var sql_grid_3 = "";
var periodo_fil;
var regional_fil;
var ciclo_fil;
var ruta_fil;
var my_url = "con_lec_reg_cic.asp";

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
    
	$("#div_header").load("syn_globales/header.htm", function() {
		$("#div_mod0").html(g_modulo);
		$("#div_tit0").html(g_tit);	
	});
	
	$("#excel_archivo").val("Clientes_Medidos_Ciclo_Ruta.xls");
	
	$("#form_info").hide();
    //DEFINE LA GRILLA PRINCIPAL
    fn_setea_grid_principal();
    $("._input_selector").inputmask("dd/mm/yyyy");

    $("#co_filtro").html("<span class='glyphicon glyphicon-search'></span> Filtro");
    $("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");
    $("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");

    //EVENTO BOTONES    
    $("#co_cerrar").on("click", function (e) {
        window.close(); 
    });    

	$("#co_close").on("click", function (e) {
        $('#div_filtro_bts').modal('hide'); 		
    });	

	fn_regional();
	
	$("#co_filtro").on("click", function (e) {
		$("#cb_ciclo").prop("disabled",true);
		$("#cb_ruta").prop("disabled",true);
		fn_Muestra_modal();
    });

	$("#cb_regional").on("change", function(evt)
	{
		if($(this).val() =="")
			//$("#cb_ruta").prop("disabled",true);
			limpia_regional(); //se limpian los combos inferiores
		else
			$("#cb_ciclo").prop("disabled",false);
			$("#cb_ruta").prop("disabled",true);
			fn_ciclo();
			fn_ruta();	
			$("#cb_ciclo").focus();
	});

	$("#cb_ciclo").on("change", function(evt)
	{
		if($(this).val() =="")
			limpia_ciclo(); //se limpian los combos inferiores
		else
			$("#cb_ruta").prop("disabled",false);
			fn_ruta();	
			$("#cb_ruta").focus();	
	});
	
	$("#co_leer").on("click", function (e) {
    	if( $("#fec_proc").val() == ""){
    		fn_mensaje_boostrap("DEBE INGRESAR LA FECHA DE PROCESO", g_tit, $("#fec_proc"));
    		return;
    	}

		if (fn_validar_fecha($("#fec_proc").val()) == false){
			fn_mensaje_boostrap("INFORMACIÓN INCORRECTA EN EL CAMPO FECHA DE PROCESO. EL FORMATO ES DD/MM/YYYY", g_tit, $("#fec_proc") );
			return false;
		}

    });     

	$("#co_limpiar").on("click", function (e) {
    	fn_limpia_modal();
    });     

	/*
    //EVENTO DBL_CLICK DE LA GRILLA
    $grid_principal.pqGrid({
		rowDblClick: function( event, ui ) {
			if (ui.rowData) 
				{
					
					var dataCell = ui.rowData;
					var var_domin = dataCell.C6;
					var var_sabad = dataCell.C7;

					//CARGA DATOS EN EL MODAL
					$("#cb_regional").val(dataCell.C1);
					$("#cb_ciclo").val(dataCell.C2);
					$("#cb_ruta").val(dataCell.C3);
					$("#tx_dias_corte").val(dataCell.C4);   					
				}
			}
	});
	*/

	$("#div_filtro_bts").draggable({
        handle: ".modal-header"
    });
	    
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
			$("#sql").val(sql_grid_prim);	
			$("#frm_Exel").submit();
			return;
		}	
    });	
});
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_setea_grid_principal()
{     
	var data =  [
		  { C1: '8000', C2: '07', C3: '005', C4: '270'},
		 { C1: '8000', C2: '07', C3: '010', C4: '131'},
		 { C1: '8000', C2: '07', C3: '015', C4: '478'},
		 { C1: '8000', C2: '07', C3: '025', C4: '705'},
		 ]
    var obj = {  
	        height: "100%",
            showTop: true,
			showBottom:true,
            showTitle : false,
			title: "Mantención de Tipos de Vencimientos",
            roundCorners: true,
            rowBorders: true,
            columnBorders: true,
            collapsible:true,
			editable:false,
            selectionModel: { type: 'row',mode:'single'},
            numberCell: { show: true },
			pageModel: { rPP: 200, type: "local", rPPOptions: [100, 200, 500]},
        	scrollModel:{theme:true},
			toolbar:
           {
               cls: "pq-toolbar-export",
               items:
               [
                   { type: "button", label: " Filtro"        ,  attr:"id=co_filtro"       , cls:"btn btn-primary"},
                   { type: "button", label: " Excel"        ,  attr:"id=co_excel"       , cls:"btn btn-primary"},
                   { type: "button", label: " Cerrar"       ,  attr:"id=co_cerrar"      , cls:"btn btn-primary"},
               ]
           }
        };
		
		obj.colModel = [		
            { title: "Regional"  , width: 150, dataType: "string", dataIndx: "C1" , halign:"center",align:"center"},
            { title: "Ciclo", width: 150, dataType: "string", dataIndx: "C2" , halign:"center", align:"center"},
			{ title: "Ruta", width: 150, dataType: "string",   dataIndx: "C3" , halign:"center", align:"center"},
            { title: "Cantidad Facturas", width: 150, dataType: "string", dataIndx: "C4" , halign:"center", align:"center"}
        ];
	obj.dataModel = { data: data };	
	
    $grid_principal = $("#div_grid_principal").pqGrid(obj);
}
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_Muestra_modal()
{

    $("#div_filtro_bts").modal({backdrop: "static",keyboard:false});
	$("#div_filtro_bts").on("shown.bs.modal", function () {
	$("#fec_proc").focus();	
	//$("#div_filtro_bts div.modal-footer button").focus();
	//Aplicar trabajo cuando esta visible el objeto	

	});

}
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_carga_grid_principal()
{
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
	$grid_principal.pqGrid( "option", "title", "Total Registros: "+total_register);
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_regional()
{
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

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_ciclo()
{
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

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_ruta()
{
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

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_limpia_modal()
{
	$("#fec_proc").val("");
	$("#cb_regional").val("");
	$("#cb_ciclo").val("");
	$("#cb_ruta").val("");
	$("#cb_ciclo").prop("disabled",true);
	$("#cb_ruta").prop("disabled",true);
	$("#fec_proc").focus();	
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function limpia_regional()
{	
	$("#cb_ciclo").val("");
	$("#cb_ruta").val("");	
	$("#cb_ciclo").prop("disabled",true);
	$("#cb_ruta").prop("disabled",true);
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function limpia_ciclo()
{
	$("#cb_ciclo").val("");
	$("#cb_ruta").val("");	
	$("#cb_ciclo").prop("disabled",false);
	$("#cb_ruta").prop("disabled",true);
}
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
		}else{
		return false;
		}
	}
	else {
	return false;
	}
}