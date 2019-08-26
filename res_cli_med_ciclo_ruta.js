var g_modulo="Facturación de Clientes";
var g_tit = "Resumen Historico de Clientes Medidos por Ciclo y Ruta";
var $grid_principal;
var $grid_conve;
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
	/*
	$("#Rol").val(fn_get_param("Rol"));
	$("#tx_empresa").val(fn_get_param("Empresa"));
	$("#tx_rol").val(fn_get_param("Rol"));
	$("#tx_rolfun").val(fn_get_param("RolFun"));
	$("#tx_ip").val(fn_get_param("ip"));
	*/
    //DEFINE LA GRILLA PRINCIPAL
    fn_setea_grid_principal();
	//fn_carga_opcion_conv();
	//fn_carga_perfil();
	//fn_grilla_principal();
    
    //DIBUJA LOS ICONOS DE LOS BOTONES     
    
    $("#co_filtro").html("<span class='glyphicon glyphicon-search'></span> Filtros");
    $("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");
    $("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");    
    $("#co_excel2").html("<span class='glyphicon glyphicon-save'></span> Excel");

    //EVENTO BOTONES
    $("#co_filtro").on("click", fn_Muestra_Filtro);
    
	$("#co_aprobar").click(function(){
        if($.trim($("#co_aprobar").text()) == "Aprobar"){
			$("#tx_obs_apr").val("");
			$("#dlg_obs").modal({backdrop: "static",keyboard:false});
			$("#dlg_obs").on("shown.bs.modal", function () {
				$("#tx_obs_apr").focus();
			});	
		}
		else{
			window.open("contratoconv2.asp?par=0&emp="+$("#tx_empresa").val()+"&suministro="+$("#tx_cliente").val(),"_blank","toolbar=no,resizable=yes,menubar=no");
		}		
    });
	
	$("#co_anular").click(function(){
		$("#tx_obs_anu").val("");
		$("#dlg_obs_anu").modal({backdrop: "static",keyboard:false});
		$("#dlg_obs_anu").on("shown.bs.modal", function () {
			$("#tx_obs_anu").focus();
		});	
    });
	
	$("#co_confirmar_anu").click(function(){
		fn_anular();
	});
	
	$("#co_confirmar").click(function(){
		fn_aprobar();
	});
	
	$("#co_can_con").click(function(){
		$("#dlg_obs").modal("hide");
	});
	
	$("#co_can_anu").click(function(){
		$("#dlg_obs_anu").modal("hide");
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
        var col_model=$( "#div_grid_conve" ).pqGrid( "option", "colModel" );
		var cabecera = "";
		for (i=0; i< col_model.length; i++){
			if(col_model[i].hidden != true) cabecera += "<th>"+col_model[i].title+ "</th>";
		}
		$("#excel_cabecera").val(cabecera);
		var element =$grid_conve.pqGrid("option","dataModel.data");
		if (element)
			a= element.length;
		else 
			a= 0;
		if(a>0){
			$("#filtro").val("");
			$("#tituloexcel").val(g_tit2+" - Cliente N°: "+$("#tx_cliente").val());
			$("#sql").val(sql_grid_conv);	
			$("#frm_Exel").submit();
			return;
		}	
    });
    
     $("#co_cerrar").on("click", function (e) {
        window.close(); 
    });    
    
    $("#co_volver1").on("click", function (e) {
        if($.trim($("#co_volver1").text()) == "Volver")
        {
            $("#div_prim0").slideDown();
            $("#div_conve").slideUp();
            $grid_principal.pqGrid( "refreshDataAndView" );
            $(window).scrollTop(0);
        }
    });
	
	$("#co_volver2").on("click", function (e) {
        if($.trim($("#co_volver2").text()) == "Volver")
        {
            $("#div_prim0").slideDown();
            $("#div_conve").slideUp();
            $grid_principal.pqGrid( "refreshDataAndView" );
            $(window).scrollTop(0);
        }
    });

	$("#co_close").on("click", function (e) {
        $('#div_filtro_bts').modal('hide'); 
    });
	
	$("#co_fil_aceptar").on("click", function (e) {
        $('#div_filtro_bts').modal('hide'); 
        fn_grilla_principal(); 
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
					g_cliente_selec = dataCell.c2;
					fn_limpiar();
                    fn_carga_aprobacion();
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
            { title: "Periodo"  , width: 100, dataType: "string", dataIndx: "c1" , halign:"center",align:"center"},
            { title: "Regional", width: 100, dataType: "string", dataIndx: "c2" , halign:"center", align:"left"},
			{ title: "Ciclo", width: 100, dataType: "string",   dataIndx: "c3" , halign:"center", align:"left"},
            { title: "Contratista", width: 140, dataType: "string", dataIndx: "c4" , halign:"center", align:"left"},
            { title: "Secuencia", width: 140, dataType: "string", dataIndx: "c5" , halign:"center", align:"left"},
            { title: "Fecha Ingreso", width: 140, dataType: "string", dataIndx: "c6" , halign:"center", align:"right"},
            { title: "Fecha Aprueba", width: 140, dataType: "string",  dataIndx: "c7" , halign:"center", align:"center"},
            { title: "Rol Aprueba", width: 140, dataType: "string", dataIndx: "c8" , halign:"center", align:"right"},
            { title: "Fecha Proceso de Carga", width: 140, dataType: "string", dataIndx: "c9" , halign:"center", align:"right"},
            { title: "Total Clientes por Leer", width: 160, dataType: "string", dataIndx: "c10" , halign:"center", align:"right"},
            { title: "Total Clientes Leidos", width: 160, dataType: "string",  dataIndx: "c11", halign:"center", align:"right"},
            { title: "Total Clientes Correctos", width: 160, dataType: "string", dataIndx: "c12", halign:"center", align:"left"},
            { title: "Total Clientes con Anomalias", width: 160, dataType: "string", dataIndx: "c13", halign:"center", align:"left"},
            { title: "Total Clientes sin Leer", width: 160, dataType: "string", dataIndx: "c14", halign:"center", align:"left"}    
        ];
		

    $grid_principal = $("#div_grid_principal").pqGrid(obj);

	
    var obj2 = {
        height: 300,
        showTop: true,
        showHeader: true,
        roundCorners: true,
        rowBorders: true,
		fillHandle: "",
        columnBorders: true,
        editable:false,
        selectionModel: { type: "row", mode:"single"},
        showTitle:false,
        collapsible:false,
        numberCell: { show: false },
        title: g_tit,
		pageModel: { rPP: 20, type: "local", rPPOptions: [20, 50, 100]},
        scrollModel:{theme:true},
        toolbar:
        {
            cls: "pq-toolbar-export",
            items:
            [
				{ type: "button", label: "Excel", attr:"id=co_excel2", cls:"btn btn-default btn-sm"}
            ]
        }
    };
	
	obj2.colModel = [
        { title: "Opcion", width: 200, dataType: "string", dataIndx: "C1", halign:"center", align:"left" },
        { title: "Estado", width: 140, dataType: "string", dataIndx: "C2", halign:"center", align:"left"},
        { title: "Creación", width: 120, dataType: "string", dataIndx: "C3", halign:"center", align:"center" },
        { title: "Fecha Fin", width: 120, dataType: "string", dataIndx: "C4", halign:"center", align:"center" },
        { title: "Deuda Inicial", width: 120, dataType: "string", dataIndx: "C5", halign:"center", align:"right" },
        { title: "Antig. Deuda", width: 80, dataType: "string", dataIndx: "C6", halign:"center", align:"center" },
        { title: "Abono Inicial", width: 120, dataType: "string", dataIndx: "C7", halign:"center", align:"right"},
        { title: "Valor Cuota", width: 120, dataType: "string", dataIndx: "C8", halign:"center", align:"right" },
        { title: "Nro. de Cuotas", width: 100, dataType: "string", dataIndx: "C9", halign:"center", align:"center" },
        { title: "Cuotas Fact.", width: 100, dataType: "string", dataIndx: "C10", halign:"center", align:"center" },
        { title: "Deuda Cierre", width: 120, dataType: "string", dataIndx: "C11", halign:"center", align:"right" },
        { title: "Nro. Atención", width: 120, dataType: "string", dataIndx: "C12", halign:"center", align:"center"},
        { title: "Creado Por", width: 150, dataType: "string", dataIndx: "C13", halign:"center", align:"center" },
        { title: "Finalizado Por", width: 150, dataType: "string", dataIndx: "C14", halign:"center", align:"center" }
    ];
	
    $grid_conve = $("#div_grid_conve").pqGrid(obj2);
	$grid_conve.pqGrid( "option", "dataModel.data", [] );
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
function fn_grilla_principal()
{
	
	fn_filtro();
	
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
			//fn_mensaje_boostrap(jqErr.responseText, g_tit, $("") );
			setTimeout(function(){ fn_mensaje_boostrap(jqErr.responseText, g_tit, $("") ) }, 0);
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
	$("#tx_fil_periodo").val("");
	$("#cb_fil_regional").val("");
	$("#cb_fil_ciclo").val("");
}



