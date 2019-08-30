var g_modulo="Facturación de Clientes";
var g_tit = "Resumen Historico de Clientes Medidos por Ciclo y Ruta";
var $grid_principal;
var $grid_2;
var $grid_ruta;
var parameters = {};
var Filtros = [];
var sql_grid_prim = "";
var sql_grid_dos = "";
var sql_grid_3 = "";
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
	$("#form_info").hide();
    //DEFINE LA GRILLA PRINCIPAL
    fn_setea_grid_principal();
	//fn_carga_periodo();
    $("#div_footer").load("/raiz/syn_globales/footer.htm");
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
		//$grid_principal.pqGrid( "refreshDataAndView" );
		$(window).scrollTop(0);
    });
	
	$("#co_volver_3").on("click", function (e) {
		$("#div_ruta").hide();
		$("#div_ciclo_ruta").show();
		//$grid_principal.pqGrid( "refreshDataAndView" );
		$(window).scrollTop(0);
    });

	$("#co_close").on("click", function (e) {
        $('#div_filtro_bts').modal('hide'); 
		fn_limpia_filtro();
    });
	
	$("#co_fil_aceptar").on("click", function (e) {
        if($("#tx_fil_periodo").val() != ""){
			$('#div_filtro_bts').modal('hide');
			//fn_carga_grid_principal();
		}
		else
			fn_mensaje_boostrap("Debe seleccionar un periodo!!!", g_tit, $(""));
		
    });
	
	$("#tx_fil_periodo").on("change", function (e){
		if($("#tx_fil_periodo").val() != ""){
			//fn_carga_regional();
		}
		else{
			$("#cb_fil_regional").html("");
			$("#cb_fil_ciclo").html("");
		}
	});
	
	$("#cb_fil_regional").on("change", function (e){
		if($("#cb_fil_regional").val() != ""){
			//fn_carga_ciclo();
		}
		else
			$("#cb_fil_ciclo").html("");
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
					//g_cliente_selec = dataCell.c2;
					$("#div_ciclo_ruta").show();
    				$("#div_prim0").hide();
					$grid_2.pqGrid("refreshView");
					//fn_grilla_dos(dataCell.C1, dataCell.C2, dataCell.C3, dataCell.C5);
				}
			}
	});
	
	//EVENTO DBL_CLICK DE LA GRILLA CICLO - RUTA
    $grid_2.pqGrid({
		rowDblClick: function( event, ui ) {
			if (ui.rowData) 
				{
					var dataCell = ui.rowData;
					
					$("#div_ciclo_ruta").hide();
    				$("#div_ruta").show();
					//fn_grilla_tres(dataCell.C1, dataCell.C2, dataCell.C3, dataCell.C4);
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
	
    $("#co_excel2").on("click", function (e) {
		e.preventDefault();
        var col_model=$( "#div_grid_ciclo_ruta" ).pqGrid( "option", "colModel" );
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
	
	$("#co_excel3").on("click", function (e) {
		e.preventDefault();
        var col_model=$( "#div_grid_ruta" ).pqGrid( "option", "colModel" );
		var cabecera = "";
		for (i=0; i< col_model.length; i++){
			if(col_model[i].hidden != true) cabecera += "<th>"+col_model[i].title+ "</th>";
		}
		$("#excel_cabecera").val(cabecera);
		var element =$grid_ruta.pqGrid("option","dataModel.data");
		if (element)
			a= element.length;
		else 
			a= 0;
		if(a>0){
			$("#tituloexcel").val(g_tit);
			$("#sql").val(sql_grid_3);	
			$("#frm_Exel").submit();
			return;
		}	
    });
	
});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_setea_grid_principal()
{     
	var data =  [
		  { C1: '01/12/2017', C2: '8000', C3: '1', C4: 'INASSA', C5:'4322', C6:'02/12/2017',
		   C7:'04/12/2017', C8:'RGARCIA', C9:'04/12/2017',C10:'12766', C11:'12766', C12:'12766', C13:'0', C14:'0'},
		 { C1: '01/12/2018', C2: '8000', C3: '1', C4: 'INASSA', C5:'4322', C6:'02/12/2017',
		   C7:'04/12/2017', C8:'RGARCIA', C9:'04/12/2017',C10:'12766', C11:'12766', C12:'12766', C13:'0', C14:'0'},
		 { C1: '01/12/2019', C2: '8000', C3: '1', C4: 'INASSA', C5:'4322', C6:'02/12/2017',
		   C7:'04/12/2017', C8:'RGARCIA', C9:'04/12/2017',C10:'12766', C11:'12766', C12:'12766', C13:'0', C14:'0'},
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
                   { type: "button", label: " Filtros"      ,  attr:"id=co_filtro", cls:"btn btn-primary"},
                   { type: "button", label: " Excel"        ,  attr:"id=co_excel"       , cls:"btn btn-primary"},
                   { type: "button", label: " Cerrar"       ,  attr:"id=co_cerrar"      , cls:"btn btn-primary"},
               ]
           }
        };
		
		obj.colModel = [		
            { title: "Periodo"  , width: 100, dataType: "string", dataIndx: "C1" , halign:"center",align:"center"},
            { title: "Regional", width: 100, dataType: "string", dataIndx: "C2" , halign:"center", align:"center"},
			{ title: "Ciclo", width: 100, dataType: "string",   dataIndx: "C3" , halign:"center", align:"center"},
            { title: "Contratista", width: 140, dataType: "string", dataIndx: "C4" , halign:"center", align:"left"},
            { title: "Secuencia", width: 140, dataType: "string", dataIndx: "C5" , halign:"center", align:"center"},
            { title: "Fecha Ingreso", width: 140, dataType: "string", dataIndx: "C6" , halign:"center", align:"center"},
            { title: "Fecha Aprueba", width: 140, dataType: "string",  dataIndx: "C7" , halign:"center", align:"center"},
            { title: "Rol Aprueba", width: 140, dataType: "string", dataIndx: "C8" , halign:"center", align:"center"},
            { title: "Fecha Proceso de Carga", width: 140, dataType: "string", dataIndx: "C9" , halign:"center", align:"center"},
            { title: "Total Clientes por Leer", width: 160, dataType: "string", dataIndx: "C10" , halign:"center", align:"right"},
            { title: "Total Clientes Leidos", width: 160, dataType: "string",  dataIndx: "C11", halign:"center", align:"right"},
            { title: "Total Clientes Correctos", width: 160, dataType: "string", dataIndx: "C12", halign:"center", align:"right"},
            { title: "Total Clientes con Anomalias", width: 160, dataType: "string", dataIndx: "C13", halign:"center", align:"right"},
            { title: "Total Clientes sin Leer", width: 160, dataType: "string", dataIndx: "C14", halign:"center", align:"right"}    
        ];
	obj.dataModel = { data: data };	
	
    $grid_principal = $("#div_grid_principal").pqGrid(obj);
	$grid_principal.pqGrid( "refreshDataAndView" );
	
	//***************************
	//Setea grid2
	data =  [
	  { C1: '01', C2: '01/12/2017', C3: '8000', C4: '8', C5:'80', C6:'233',
	   C7:'233', C8:'70', C9:'0',C10:'70', C11:'30%'},
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
				{ type: "button", label: "Excel", attr:"id=co_excel2", cls:"btn btn-primary btn-sm"},
				{ type: "button", label: "Volver", attr:"id=co_volver_2", cls:"btn btn-default btn-sm"}
            ]
        }
    };
	
	obj2.colModel = [
        { title: "Periodo", width: 100, dataType: "string", dataIndx: "C1", halign:"center", align:"center"},
        { title: "Regional", width: 100, dataType: "string", dataIndx: "C2", halign:"center", align:"center" },
        { title: "Ciclo", width: 100, dataType: "string", dataIndx: "C3", halign:"center", align:"center" },
        { title: "Ruta", width: 100, dataType: "string", dataIndx: "C4", halign:"center", align:"center" },
        { title: "Clientes por Leer", width: 140, dataType: "string", dataIndx: "C5", halign:"center", align:"right" },
        { title: "Reportados por Contratista", width: 140, dataType: "string", dataIndx: "C6", halign:"center", align:"right"},
        { title: "Medidos Por Carga", width: 140, dataType: "string", dataIndx: "C7", halign:"center", align:"right" },
        { title: "Medidos por Captura", width: 140, dataType: "string", dataIndx: "C8", halign:"center", align:"right" },
        { title: "Facturados con Medición", width: 140, dataType: "string", dataIndx: "C9", halign:"center", align:"right" },
        { title: "Porcentaje Medido", width: 140, dataType: "string", dataIndx: "C10", halign:"center", align:"right" },
    ];
	
	obj2.dataModel = { data: data };
    $grid_2 = $("#div_grid_ciclo_ruta").pqGrid(obj2);
    $grid_2.pqGrid( "refreshDataAndView" );

	//Setea grid3
	data =  [
	  { C1: '8000', C2: '8', C3: '001-INASSA', C4:'4346', C5:'273363',
	   C6:'13482586', C7:'AB', C8:'M3',C9:'P', C10:'016-MEDIDOR CON VIDRIO EMPAÑADO', C11:'111-LECTURA PROMEDIADA', C12:'91698', C13:'0'},
	 ]
    var obj3 = {
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
        title: "Resumen",
		pageModel: { rPP: 200, type: "local", rPPOptions: [100, 200, 500]},
        scrollModel:{theme:true},
        toolbar:
        {
            cls: "pq-toolbar-export",
            items:
            [
				{ type: "button", label: "Excel", attr:"id=co_excel3", cls:"btn btn-primary btn-sm"},
				{ type: "button", label: "Volver", attr:"id=co_volver_3", cls:"btn btn-default btn-sm"}
            ]
        }
    };
	
	obj3.colModel = [
        { title: "Regional", width: 100, dataType: "string", dataIndx: "C1", halign:"center", align:"center"},
        { title: "Ciclo", width: 100, dataType: "string", dataIndx: "C2", halign:"center", align:"center" },
        { title: "Contratista", width: 120, dataType: "string", dataIndx: "C3", halign:"center", align:"center" },
        { title: "Secuencia", width: 100, dataType: "string", dataIndx: "C4", halign:"center", align:"center" },
        { title: "Nro Suministro", width: 120, dataType: "string", dataIndx: "C5", halign:"center", align:"center" },
        { title: "Nro Medidor", width: 120, dataType: "string", dataIndx: "C6", halign:"center", align:"center"},
        { title: "Marca Medidor", width: 120, dataType: "string", dataIndx: "C7", halign:"center", align:"center" },
        { title: "Tipo de Medida", width: 120, dataType: "string", dataIndx: "C8", halign:"center", align:"center" },
        { title: "Tipo de Facturación", width: 140, dataType: "string", dataIndx: "C9", halign:"center", align:"center" },
        { title: "Clave de Terreno", width: 240, dataType: "string", dataIndx: "C10", halign:"center", align:"left" },
        { title: "Clave de Facturación", width: 240, dataType: "string", dataIndx: "C11", halign:"center", align:"left"},
        { title: "Lectura 1", width: 100, dataType: "string", dataIndx: "C12", halign:"center", align:"center" },
        { title: "Lectura 2", width: 100, dataType: "string", dataIndx: "C13", halign:"center", align:"center" }
    ];
	
	obj3.dataModel = { data: data };
    $grid_ruta = $("#div_grid_ruta").pqGrid(obj3);
   // $grid_ruta.pqGrid( "refreshDataAndView" );
	
}
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_Muestra_Filtro()
{
	fn_limpia_filtro();
    $("#div_filtro_bts").modal({backdrop: "static",keyboard:false});
	$("#div_filtro_bts").on("shown.bs.modal", function () {
		$("#div_filtro_bts div.modal-footer button").focus();
		//Aplicar trabajo cuando esta visible el objeto	
	});

}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_grilla_dos(per, reg, ciclo, sec)
{
    fn_filtro_2(per, reg, ciclo, sec);
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
			sql_grid_dos=dataJSON.sql;
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

	$grid_2.pqGrid( "option", "dataModel", dataModel );
    $grid_2.pqGrid( "refreshDataAndView" );
    $grid_2.pqGrid( "option", "title", "Clientes Medidos Agrupados por Ciclo y Ruta - [ Periodo: "+ per +" - Regional: "+ reg +" - Ciclo: "+ ciclo+" )");

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
function fn_grilla_tres(per, reg, ciclo, ruta)
{
    fn_filtro_3(per, reg, ciclo, ruta);
	
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
			sql_grid_3=dataJSON.sql;
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

	$grid_ruta.pqGrid( "option", "dataModel", dataModel );
    $grid_ruta.pqGrid( "refreshDataAndView" );
    $grid_ruta.pqGrid( "option", "title", "Clientes Facturados por Ruta - [ Periodo: "+ per +" - Regional: "+ reg +" - Ciclo: "+ ciclo+" - Ruta: "+ruta+" )");

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
	
	if ($("#tx_fil_periodo").val()!='') Filtros.push('Periodo = '+$("#tx_fil_periodo").val());
	if ($("#cb_fil_regional").val()!='') Filtros.push('Regional = '+$("#cb_fil_regional").val());
	if ($("#cb_fil_ciclo").val()!='') Filtros.push('Ciclo = '+$("#cb_fil_ciclo").val());
	
	$("#filtro").val(Filtros);
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_filtro_2(per, reg, ciclo, sec)
{
	parameters = 
    {
		"func":"fn_grid_dos",
		"empresa":$("#tx_empresa").val(),
		"p_periodo":per,
        "p_cod_regional":reg,
        "p_ciclo":ciclo
		
    };
	
	Filtros = [];
	
	Filtros.push('Periodo = '+per);
	Filtros.push('Regional = '+reg);
	Filtros.push('Ciclo = '+ciclo);
	
	$("#filtro").val(Filtros);
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_filtro_3(per, reg, ciclo, ruta)
{
	parameters = 
    {
		"func":"fn_grid_tres",
		"empresa":$("#tx_empresa").val(),
		"p_periodo":per,
        "p_cod_regional":reg,
        "p_ciclo":ciclo,
		"p_ruta":ruta
		
    };
	
	Filtros = [];
	
	Filtros.push('Periodo = '+per);
	Filtros.push('Regional = '+reg);
	Filtros.push('Ciclo = '+ciclo);
	Filtros.push('Ruta = '+ruta);
	
	$("#filtro").val(Filtros);
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_carga_periodo()
{
	var param= 
    {
        "func":"fn_periodo",
        "empresa":$("#tx_empresa").val(),
    };
	
	HablaServidor(my_url, param, "text", function(text) 
    {
        $("#tx_fil_periodo").html(text);
    });
	
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
function fn_carga_ciclo()
{
	
	var param= 
    {
        "func":"fn_ciclo",
        "empresa":$("#tx_empresa").val(),
		"p_periodo": $("#tx_fil_periodo").val(),
		"p_cod_regional":$("#cb_fil_regional").val()
    };
	
	HablaServidor(my_url, param, "text", function(text) 
    {
        $("#cb_fil_ciclo").html(text);
    });
	
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_limpia_filtro()
{
	$("#tx_fil_periodo").val("");
	$("#cb_fil_regional").val("");
	$("#cb_fil_ciclo").val("");
}


