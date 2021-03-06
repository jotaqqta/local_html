var g_modulo="Gestion contratistas de lectura";
var g_tit = "Revision antes de la critica de consumo";
var $grid_principal;
var $grid_conve;
var $grid_ruta;
var tit_grid_2 = "Periodo: 01/01/2017 Centro Operativo: 8000 - Ciclo: 01";
var tit_grid_3 = "Periodo: 01/01/2017 Centro Operativo: 8000 - Ciclo: 01 - Ruta: 080";
var g_cliente_selec = "";
var parameters = {};
var Filtros = [];
var sql_grid_prim = "";
var sql_grid_conv = "";
var my_url = "conve_aprueba.asp";
var my_url2 = "conve_ingreso.asp";

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
    
	$("#div_header").load("header.htm", function() {
		$("#div_mod0").html(g_modulo);
		$("#div_tit0").html(g_tit);	
	});
	
	$("#excel_archivo").val("convenios_pendiente_aprobar.xls");
	
	$("#Rol").val(fn_get_param("Rol"));
	$("#tx_empresa").val(fn_get_param("Empresa"));
	$("#tx_rol").val(fn_get_param("Rol"));
	$("#tx_rolfun").val(fn_get_param("RolFun"));
	$("#tx_ip").val(fn_get_param("ip"));
	
    //DEFINE LA GRILLA PRINCIPAL
    fn_setea_grid_principal();
	//fn_carga_grid_principal();
	//fn_carga_opcion_conv();
	//fn_carga_perfil();
    
    //DIBUJA LOS ICONOS DE LOS BOTONES     
    
    $("#co_filtro").html("<span class='glyphicon glyphicon-search'></span> Filtros");
    $("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");
    $("#co_volver_2").html("<span class='glyphicon glyphicon-chevron-left'></span> Volver");
    $("#co_volver_3").html("<span class='glyphicon glyphicon-chevron-left'></span> Volver");
    $("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");    
    $("#co_excel2").html("<span class='glyphicon glyphicon-save'></span> Excel");
    $("#co_excel3").html("<span class='glyphicon glyphicon-save'></span> Excel");

    //EVENTO BOTONES
    $("#co_filtro").on("click", fn_Muestra_Filtro);
    
     $("#co_cerrar").on("click", function (e) {
        window.close(); 
    });    
    
    $("#co_volver_2").on("click", function (e) {
		$("#div_prim0").show();
		$("#div_ciclo_ruta").hide();
		$grid_principal.pqGrid( "refreshDataAndView" );
		$(window).scrollTop(0);
    });
	
	$("#co_volver_3").on("click", function (e) {
		$("#div_ruta").hide();
		$("#div_ciclo_ruta").show();
		$grid_principal.pqGrid( "refreshDataAndView" );
		$(window).scrollTop(0);
    });

	$("#co_close").on("click", function (e) {
        $('#div_filtro_bts').modal('hide'); 
    });
	
	$("#co_fil_aceptar").on("click", function (e) {
        
        
        
       	if( $("#cb_fil_regional").val() == ""){
			fn_mensaje_boostrap("Debe Seleccionar una Regional", g_tit, $("#cb_fil_regional"));
			return;
		}
		if( $("#cb_fil_ciclo").val() == ""){
			fn_mensaje_boostrap("Debe Seleccionar un Ciclo", g_tit, $("#cb_fil_ciclo"));
			return;
		}
        $('#div_filtro_bts').modal('hide'); 

      		
        //fn_grilla_principal(); 
    });
	
	$("#co_fil_limpiar").on("click", function (e) {
        fn_limpia_filtro(); 
    });
    
    //EVENTO DBL_CLICK DE LA GRILLA
    $grid_principal.pqGrid({
		rowDblClick: function( event, ui ) {
			if (ui.rowData){var dataCell = ui.rowData;
					g_cliente_selec = dataCell.c2;
					$("#div_ciclo_ruta").show();
    				$("#div_prim0").hide();
					$grid_conve.pqGrid("refreshView");
					}}});
	
	//EVENTO DBL_CLICK DE LA GRILLA CICLO - RUTA
    $grid_conve.pqGrid({
		rowDblClick: function( event, ui ) {
			if (ui.rowData) 
				{
					var dataCell = ui.rowData;
					g_cliente_selec = dataCell.c2;
					$("#div_ciclo_ruta").hide();
    				$("#div_ruta").show();
					$grid_ruta.pqGrid("refreshView");
					//fn_grilla_ciclo_ruta();
				}
			}
	});
    
    
    
    
    // MASCARAS
	//CAMPOS DE FECHA

	$(".form_datetime").datetimepicker({
		viewMode: "years",
        format: "mm/yyyy",
		useCurrent: false,
		todayBtn: false,
        minView: 3,  //solo permite seleccionar hasta meses, no días
        startView: 4,  //iniciar en años
		endDate: "+0d",  //No habilitar fechas futuras
        autoclose: true,
        language: "es"
	});

	$("#div_filtro_bts").draggable({
        handle: ".modal-header"
    });
	
	//fn_grilla_principal();
       
});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_setea_grid_principal()
{     
	var data =  [
		  { c1: '8000', c2: '12', c3: 'No leidos masivamente', c4: '99999', c5:'0000', c6:'Cubierto objeto pesado',c7:'9', c8:'RGARCIA', c9:'04/12/2017',c10:'12766', c11:'12766', c12:'12766', c13:'0', c14:'0'},
		 ]
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
            { title: "Centro Operativo", width: 100
             , dataType: "string", dataIndx: "c1" , halign:"center",align:"center"},
            { title: "Ciclo", width: 100, dataType: "string", dataIndx: "c2" , halign:"center", align:"left"},
			{ title: "Ciclo", width: 180, dataType: "string",   dataIndx: "c3" , halign:"center", align:"left"},
            { title: "Contratista", width: 100, dataType: "string", dataIndx: "c4" , halign:"center", align:"left"},
            { title: "Secuencia", width: 140, dataType: "string", dataIndx: "c5" , halign:"center", align:"left"},
            { title: "Clave de lectura", width: 200, dataType: "string", dataIndx: "c6" , halign:"center", align:"right"},
            { title: "Descripcion", width: 140, dataType: "string",  dataIndx: "c7" , halign:"center", align:"center"},
            { title: "Cantidad", width: 100, dataType: "string",  dataIndx: "c7" , halign:"center", align:"center"}
          
        ];
	obj.dataModel = { data: data };	
	
    $grid_principal = $("#div_grid_principal").pqGrid(obj);
	data =  [
	  { C1: '01', C2: '01/12/2017', C3: '8000', C4: '8', C5:'80', C6:'233',
	   C7:'233', C8:'70', C9:'0',C10:'70', C11:'30%'},
	 ]
    var obj2 = {
        height: "520",
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
        title: tit_grid_2,
		pageModel: { rPP: 20, type: "local", rPPOptions: [20, 50, 100]},
        scrollModel:{theme:true},
        toolbar:
        {
            cls: "pq-toolbar-export",
            items:
            [
				{ type: "button", label: "Excel", attr:"id=co_excel2", cls:"btn btn-primary btn-sm"},
				{ type: "button", label: "Volver", attr:"id=co_volver_2", cls:"btn btn-default btn-sm"}
            ]
        }
    };
	
	obj2.colModel = [
        { title: "Ruta", width: 40, dataType: "string", dataIndx: "C1", halign:"center", align:"left" },
        { title: "Nro Suministro", width: 100, dataType: "string", dataIndx: "C2", halign:"center", align:"center"},
        { title: "Unidades Habilitadas", width: 100, dataType: "string", dataIndx: "C3", halign:"center", align:"center" },
        { title: "Nro Medidor", width: 100, dataType: "string", dataIndx: "C4", halign:"center", align:"center" },
        { title: "Marca Medido", width: 100, dataType: "string", dataIndx: "C5", halign:"center", align:"center" },
        { title: "Tipo de Medida", width: 140, dataType: "string", dataIndx: "C6", halign:"center", align:"right" },
        { title: "Lectura 1", width: 140, dataType: "string", dataIndx: "C7", halign:"center", align:"right"},
        { title: "Lectura 2", width: 140, dataType: "string", dataIndx: "C8", halign:"center", align:"right" },
        { title: "Anomalias", width: 140, dataType: "string", dataIndx: "C9", halign:"center", align:"right" },
        { title: "Tarifa", width: 140, dataType: "string", dataIndx: "C10", halign:"center", align:"right" }
  
    ];
	
	obj2.dataModel = { data: data };
    $grid_conve = $("#div_grid_ciclo_ruta").pqGrid(obj2);
	//$grid_conve.pqGrid( "option", "dataModel.data", [] );
    $grid_conve.pqGrid( "refreshDataAndView" );
	$grid_conve.pqGrid( "scrollRow", { rowIndxPage: 10 } );


}
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_Muestra_Filtro()
{
    $("#div_filtro_bts").modal({backdrop: "static",keyboard:false});
	$("#div_filtro_bts").on("shown.bs.modal", function () {
		$("#div_filtro_bts div.modal-footer button").focus();
		//Aplicar trabajo cuando esta visible el objeto	
	});

}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_carga_aprobacion()
{
    var v_nro_suministro = g_cliente_selec;
    
    if (v_nro_suministro == "")
    {
        fn_mensaje_boostrap("DEBE SELECCIONAR UN CONVENIO PARA APROBAR...", g_tit , $(""));
        return 0;
    }
    
    $("#div_conve").slideDown();
    $("#div_prim0").slideUp();
	$("#tx_cliente").val(g_cliente_selec);
	$("#co_anular").prop("disabled",true);
	$("#co_aprobar").prop("disabled",true);
	fn_carga_datos();
    $(window).scrollTop(0);
        
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_grilla_conve()
{
    parameters = 
    {
        "func":"fn_hist_conve",
        "p_cliente":$("#tx_cliente").val(),
        "empresa":$("#tx_empresa").val(),
		"rol":$("#tx_rol").val(),
		"ip":$("#tx_ip").val()
    };
	 
    var dataModel = 
    {        
        location: "remote",
        sorting: "local",
        dataType: "json",
        method: "POST",
        sortDir: ["up", "down"],
		async:false,
        url: my_url2+"?"+jQuery.param( parameters ),
        getData: function (dataJSON) 
        {
			total_register = $.trim(dataJSON.totalRecords);
			var data = dataJSON.data;
			sql_grid_conv=dataJSON.sql;
			if(total_register>=1)
			{
				$("#co_excel2").attr("disabled", false);
			}
            return { data: dataJSON.data};
        },
        error: function(jqErr, err_stat, err_str) // ERROR EN EL ASP
        {
			fn_mensaje_boostrap(jqErr.responseText, g_tit, $("") );
        }        
    }

    $grid_conve.pqGrid( "option", "dataModel", dataModel );
    $grid_conve.pqGrid( "refreshDataAndView" );
    
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_carga_grid_principal()
{
    
    parameters = {
        "func":"fn_dat_grilla_prin",
        "empresa":$("#Empresa").val(),
        "periodo":$("#tx_fil_periodo").val(),
        "cb_regional":$("#cb_fil_regional").val(),
        "cb_ciclo":$("#cb_fil_ciclo").val()
    };

    
    HablaServidor("med_regional_ciclo.json",parameters,"json", function(text) 
    {
        $grid_principal.pqGrid( "option", "dataModel.data", text);
        $grid_principal.pqGrid( "refreshDataAndView" );
    });
    
}

function fn_grilla_ciclo_ruta(){
	
	var dataModel =  [
	  { C1: '01/12/2017', C2: '8000', C3: '1', C4: 'INASSA', C5:'4322', C6:'02/12/2017',
	   C7:'04/12/2017', C8:'RGARCIA', C9:'04/12/2017',C10:'12766', C11:'12766', C12:'12766', C13:'0', C14:'0'},
	 ]
	 
	 $grid_conve.pqGrid( "option", "dataModel", dataModel );
	 $grid_conve.pqGrid( "refreshView" );
}
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_filtro()
{
	parameters = 
    {
		"func":"fn_grilla_prin",
		"empresa":$("#tx_empresa").val(),
		"rol":$("#tx_rol").val(),
		"ip":$("#tx_ip").val(),
		"p_fec_ini":$("#tx_fil_periodo").val(),
		"p_regional":$("#cb_fil_regional").val(),
		"p_ciclo":$("#cb_fil_ciclo").val(),
		
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
        "Empresa":$("#tx_empresa").val(),
        "Rol":$("#Rol").val(),
		"Ip":$("#tx_ip").val()
    };
	
	HablaServidor(my_url, param, "text", function(text) 
    {
        $("#cb_fil_regional").html(text);
    });
	
}


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_carga_opcion_conv()
{
	var param= 
    {
        "func":"fn_opc_con",
        "Empresa":$("#tx_empresa").val(),
        "Rol":$("#Rol").val(),
		"Ip":$("#tx_ip").val()
    };
	
	HablaServidor(my_url, param, "text", function(text) 
    {
        $("#cb_fil_opc_conve").html(text);
    });
}


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_limpia_filtro()
{

	$("#cb_fil_regional").val("");
	$("#cb_fil_ciclo").val("");
}
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_carga_rol()
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
	
	$("#cb_fil_regional").html("<option value='' selected>...</option><option value='02'>Opcion 1</option> <option value='03' >Opcion 2</option> <option value='04'>Opcion 3</option>");
    $("#cb_fil_ciclo").html("<option value='' selected>...</option><option value='02'>Opcion 1</option> <option value='03' >Opcion 2</option> <option value='04'>Opcion 3</option>");
    
     
}