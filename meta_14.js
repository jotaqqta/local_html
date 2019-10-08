var g_modulo="Módulo de Gestión - Metas de Calidad de la ASEP";
var g_tit = "Meta 14 - Reclamaciones en la Facturación";
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
	
	//Se cargan las variables que vienen desde el server
	/*
	$("#tx_empresa").val(SYNSegCodEmpresa);
	$("#tx_rol").val(SYNSegRol);
	$("#tx_ip").val(SYNSegIP);
	$("#tx_rolfun").val(SYNSegRolFuncion);
	*/
	
	$("#div_prin").show();
    //DEFINE LA GRILLA PRINCIPAL
    fn_setea_grid_principal();
	//fn_carga_periodo();
    //DIBUJA LOS ICONOS DE LOS BOTONES     
   
    $("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");
    $("#co_volver").html("<span class='glyphicon glyphicon-off'></span> Volver");    

    //EVENTO BOTONES
    
     $("#co_cerrar").on("click", function (e) {
        window.close(); 
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
function fn_setea_grid_principal()
{     
	var data =  [
		  { C13:'PANAMA METRO', C14: '1', C1: '10', C2: '10', C3:'2', C21:'5',
		   C22:'20', C23:'20', C31:'50%',C32:'70%', C33:'90%'},
		 { C13: 'TASA DE ASEO', C14: '2', C1: '10', C2: '10', C3:'2', C21:'5',
		   C22:'20', C23:'20', C31:'50%',C32:'70%', C33:'90%'},
		 { C13: 'VALORIZACIÓN', C14: '2', C1: '10', C2: '10', C3:'2', C21:'5',
		   C22:'20', C23:'20', C31:'50%',C32:'70%', C33:'90%'}
		 ]
    var obj = {  
	        height: "100%",
            showTop: true,
			showBottom:true,
            showTitle : false,
			title: "Resumen Historico de Clientes Medidos por Ciclo y Ruta",
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
                   { type: "button", label: " Excel"        ,  attr:"id=co_excel"       , cls:"btn btn-primary"},
                   { type: "button", label: " Volver"       ,  attr:"id=co_volver"      , cls:"btn btn-primary"}
               ]
           }
        };
		
		obj.colModel = [
			
            { title: "Sistema"  , width: 140, dataType: "string", dataIndx: "C13" , halign:"center",align:"left"},
            { title: "Tipo", width: 60, dataType: "string", dataIndx: "C14" , halign:"center", align:"center"},
			{ title: "Cantidad Total de Reclamaciones", width: 350, align: "center", colModel: [
				{ title: "Enero", width: 60, dataType: "string",   dataIndx: "C1" , halign:"center", align:"right"},
				{ title: "Febrero", width: 60, dataType: "string", dataIndx: "C2" , halign:"center", align:"right"},
				{ title: "Marzo", width: 60, dataType: "string", dataIndx: "C3" , halign:"center", align:"right"}
			]},
			{ title: "Cantidad de Reclamaciones con respuesta escrita en el plazo", width: 350, align: "center", colModel: [
				{ title: "Enero", width: 60, dataType: "string",  dataIndx: "C21" , halign:"center", align:"right"},
				{ title: "Febrero", width: 60, dataType: "string", dataIndx: "C22" , halign:"center", align:"right"},
				 { title: "Marzo", width: 60, dataType: "string", dataIndx: "C23" , halign:"center", align:"right"}
			]},
           	{ title: "Porcentaje de Reclamaciones con respuesta escrita", width: 350, align: "center", colModel: [
				{ title: "Enero", width: 60, dataType: "string", dataIndx: "C31" , halign:"center", align:"right"},
				{ title: "Febrero", width: 60, dataType: "string",  dataIndx: "C32", halign:"center", align:"right"},
				{ title: "Marzo", width: 60, dataType: "string", dataIndx: "C33", halign:"center", align:"right"}
			]}   
        ];
	obj.dataModel = { data: data };	
	
    $grid_principal = $("#div_grid_principal").pqGrid(obj);
	
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
	$grid_principal.pqGrid( "option", "title", "Total Registros: "+total_register);
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_filtro()
{
	$("#filtro").val("");
	parameters = 
    {
		"func":"fn_grid_principal",
		"empresa":$("#tx_empresa").val(),
		"p_periodo":$("#tx_fil_periodo").val(),
        "p_cod_regional":$("#cb_fil_regional").val(),
        "p_ciclo":$("#cb_fil_ciclo").val()
		
    };
	
	Filtros = [];
	
	if ($("#tx_fil_periodo").val()!='') Filtros.push('Periodo = '+$("#tx_fil_periodo").val());
	if ($("#cb_fil_regional").val()!='') Filtros.push('Regional = '+$("#cb_fil_regional").val());
	if ($("#cb_fil_ciclo").val()!='') Filtros.push('Ciclo = '+$("#cb_fil_ciclo").val());
	
	$("#filtro").val(Filtros);
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_carga_regional()
{
	
	var param= 
    {
        "func":"fn_regional",
        "empresa":$("#tx_empresa").val(),
		"p_periodo": $("#tx_fil_periodo").val()
    };
	
	HablaServidor(my_url, param, "text", function(text) 
    {
        $("#cb_fil_regional").html(text);
    });
	
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_limpia_filtro()
{
	$("#tx_fil_periodo").val("");
	$("#cb_fil_regional").val("");
	$("#cb_fil_ciclo").val("");
}


