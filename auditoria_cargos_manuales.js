var g_tit = "";
var my_url = "nnnn.asp";
var my_url1 = "cargos.txt";
var my_url2 = "evento.txt";
var my_url3 = "roles.json";
var pq_col_rol = [];
var Filtros = [];

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function HablaServidor(servidor,parametros,vGrid,tipofile,CallBack)
{
    var respuestaJSON="";

    $.ajax({
        url: servidor,
        data: parametros,
        async: false,
        dataType: tipofile,
        type: "GET", //cambiar a POST
        cache: false,
        contentType:"application/x-www-form-urlencoded; charset:ISO-8859-1",
        error: function(jqErr, err_stat, err_str) // ERROR EN EL ASP
        {
            $("#lb_mensaje").html(jqErr.responseText);
			if(vGrid){
				$(".pq-loading").hide();
			}
            $( "#dialog-message" ).dialog({title: g_tit,modal: true,height:300,width:500,
                buttons: {
                    Cerrar: function() {
                    $( this ).dialog( "close" );
                    }
                }
            });

        },
		beforeSend: function() {
			if(vGrid){
				$("#label").html("Recuperando Datos...");
				$("#"+vGrid+" .pq-loading").show();
			}			
		},
        success: function(DevuelveDatos)
        {
            respuestaJSON=DevuelveDatos;
            $(".pq-loading").hide();
            return CallBack(respuestaJSON);
        }
    });
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_get_par(variable){
	
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i=0;i<vars.length;i++) {
		   var pair = vars[i].split("=");
		   if(pair[0] == variable){return pair[1];}
	}
	return(false);	
	
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
function fn_tx_Numeros(e) 
{        
	if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) 
		   return false;
}


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_Muestra_Filtro()
{
	$( "#div_filtro" ).dialog( "open" );
    $( "#tx_FechaInicio" ).datepicker( "hide" );
    $( "#btn_cancel" ).focus();
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_Setea_Grilla(){
	
var obj = 
	{       
	width:'100%',     
	height: '100%',
	showTop: true,
	showBottom: true,
	showHeader: true,
	roundCorners: false,
	rowBorders: true,
	columnBorders: true,
	editable: false,	
	selectionModel: { type: 'row',mode:'single'},
	numberCell: { show: true },
	stripeRows: true,
	pageModel: { rPP: 500, type: "remote", rPPOptions:[200,300,500]},
	title: g_tit,
	hwrap:false,
	wrap:false,
		toolbar: {
            cls: 'pq-toolbar-export',
            items: [			
				{ type: 'button', label: 'Filtro', icon: 'ui-icon-search', attr:'id=co_filtro' },
				{ type: 'button', label: 'Excel', icon: 'ui-icon-disk', attr:'id=co_excel'},
				{ type: 'button', label: 'Cancelar', icon: 'ui-icon-close', attr:'id=co_cancelar' },
				{ type: 'button', label: 'Cerrar', icon: 'ui-icon-power', attr:'title=Cerrar&nbsp;Ventana', attr:'id=co_cerrar' }
            ]
        }
	};

	obj.colModel = [
        { title: "NIC", dataType: "string", width: 100, dataIndx: 'c1', align: "left"},
        { title: "Ruta Comercial", dataType: "string", width: 200, dataIndx: 'c2', align: "center"},
        { title: "Nombre", dataType: "string", width: 300, dataIndx: 'c3', align: "left"},
        { title: "Fecha", dataType: "string", width: 140, dataIndx: 'c4', align: "center"},
        { title: "Rol", dataType: "string", width: 200, dataIndx: 'c5', align: "left"},
        { title: "Tipo Evento", dataType: "string", width: 150, dataIndx: 'c6', align: "left"},
        { title: "Cargo", dataType: "string", width: 300, dataIndx: 'c7', align: "left"},
        { title: "Valor Cuota", dataType: "string", width: 140, dataIndx: 'c8', align: "right"},
        { title: "N° Cuotas", dataType: "string", width: 140, dataIndx: 'c9', align: "left"},
        { title: "Observación", dataType: "string", width: 300, dataIndx: 'c10', align: "left"}
    ];
		
    $grid = $("#grid_principal").pqGrid(obj);
    $grid.pqGrid( "option", "dataModel.data", [] );
    $grid.pqGrid( "refreshDataAndView" );
	
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
 function fn_mensaje(p_mensaje, p_titulo, $p_objeto)
{
    
    $("#lb_mensaje").html(p_mensaje);
        
    $( "#dialog-message" ).dialog({
        title:p_titulo,
        modal: true,
        buttons: {
            Ok: function() {
            $( this ).dialog( "close" );
            $p_objeto.focus();
            }
        }
    });
}

 //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_setear()
{
	var v_motivo = "";
	
	parameters = 
	{
		'func':$("#bandera").val(),
		'fechainicio':$("#tx_FechaInicio").val(),
		'fechafin':$("#tx_FechaFin").val(),
		'cliente':$("#tx_cliente").val(),			
		'cargo':$("#cb_cargo").val(),
		'evento':$("#cb_evento").val(),
		'rol':$("#tx_Rol").val()
	};
	
	Filtros = [];
	
	if ($("#tx_cliente").val()!='') Filtros.push('N° Cliente = '+$("#tx_cliente").val());
	if ($("#tx_FechaInicio").val()!='') Filtros.push('Fecha Desde = '+$("#tx_FechaInicio").val());
	if ($("#tx_FechaFin").val()!='') Filtros.push('Fecha Hasta = '+$("#tx_FechaFin").val());
	if ($("#tx_Rol").val()!='') Filtros.push('Rol = '+$("#tx_Rol").val());	
	if ($("#cb_cargo").val()!=''){Filtros.push('Cargo = '+$("#cb_cargo :selected").text());}
	if ($("#cb_evento").val()!=''){Filtros.push('Evento = '+$("#cb_evento :selected").text());}
	
	$("#filtro").val(Filtros);

}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	

function fn_Setea_Filtro(){

	$("#div_filtro").dialog({
			title:g_tit,
			autoOpen:false,
			modal: true,
			resizable: false,
			height: 300,
			width: 500,
            buttons: [{
				id:"btn_limpiar",
				text: "Limpiar",				
				click: function() {
						$("#tx_FechaInicio").val("");
						$("#tx_FechaFin").val("");
						$("#tx_cliente").val("");
						$("#tx_Rol").val("");
						$("#cb_cargo").val("");
						$("#cb_evento").val("");
						
						Filtros = [];
				}
			},
			{
				id:"btn_ok",
				text: "Aceptar",
				click: function() {
					if (fn_valida()){
                        $(this).dialog("close");
                        fn_carga_grilla();
					}
				}
			},
			{
				id:"btn_cancel",
				text: "Cancelar",
				click: function() {
					$("#co_excel").attr("disabled", true);
					$("#co_cancelar").attr("disabled", true);
					$( this ).dialog( "close" );
				}
			}]
			
	});
	

}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_valida()	
{	

	var flag_error = true;
	var sinFecha = false;
	
	if($.trim($("#tx_cliente").val())!='') sinFecha = true;

	if(!sinFecha)
	{
		if (($("#tx_FechaInicio").val() == "") || ($("#tx_FechaFin").val() == ""))
		{
			fn_mensaje("DEBE INDICAR UN RANGO DE FECHA PARA REALIZAR LA BUSQUEDA !", g_tit, $(""));
			return false;
		}
		
		/*var param1= 
		{
			"func":"RangoFechas",
			"desde":$("#tx_FechaInicio").val(),
			"hasta":$("#tx_FechaFin").val()
		};
		
		var flag_rango = true;
		HablaServidor(my_url, param1, "text", function(text) 
        {
            flag_error = false;
            if(text=="1")
                flag_rango = false;

        });
		
		if(flag_error)
			return false;

		if(!flag_rango)
		{
			fn_mensaje("EL RANGO DE FECHAS NO PUEDE SER MAYOR A 3 MESES !", g_tit, $("#"));
			return false;
		}*/
	}
	
	return true;
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_carga_grilla()
{
	var totalregister=0;

	$("#bandera").val("TotalRegistro");
	fn_setear();
	var dataModel = {};
	
	$.ajax({
		data:  parameters,
		url:   my_url,
		type:  'post',
		async: true,
		dataType: 'text',
		cache: false,
		contentType:"application/x-www-form-urlencoded; charset:ISO-8859-1",
		beforeSend: function() {
			$("#label").html("Calculando Total de Registros...");
			$(".pq-loading").show();
		},
		error: function(jqErr, err_stat, err_str) // ERROR EN EL ASP
		{
			$("#lb_mensaje").html(jqErr.responseText);
            $(".pq-loading").hide();
			$( "#dialog-message" ).dialog({title: g_tit,modal: true,height:300,width:500,
				buttons: {
					Cerrar: function() {
					$( this ).dialog( "close" );
					}
				}
			});
		},
		success:function(text)
		{
			totalregister=eval(text);
			
			if (totalregister == 0)
			{
				$(".pq-loading").hide();
				fn_mensaje("LA CONSULTA NO DEVOLVIÓ REGISTROS",g_tit,$(""));
				return false
			}	
			
			$("#total_RecordsInicial").val('0');
			$("#bandera").val("grilla");
			fn_setear();
			
			dataModel = 
			{
				location: "remote",
				sorting: "local",
				dataType: "json",
				method: "POST",
				curPage: 1,      
				sortDir: ["up", "down"], 
				url:my_url+"?totalrecord="+totalregister+"&"+$.param(parameters),
				getData: function (dataJSON)
				{
					totalreg = $.trim(dataJSON.totalRecords);
					var data = dataJSON.data;
					var sql_excel= JSON.stringify(dataJSON.sql);
					$("#sql").val(eval(sql_excel));	
					return { curPage: dataJSON.curPage, totalRecords: dataJSON.totalRecords, data: dataJSON.data};
				},				
				error: function(jqErr, err_stat, err_str) // ERROR EN EL ASP
				{
					$("#lb_mensaje").html(jqErr.responseText);
					$( "#dialog-message" ).dialog({title: g_tit,modal: true,height:250,width:400,
						buttons: {
							Ok: function() {
							$( this ).dialog( "close" );
							}
						}
					});	
				}					
			}

			$grid.pqGrid( "option", "dataModel", dataModel);
			$grid.pqGrid( "refreshDataAndView" );
			
			if(totalregister>=1)
			{
				$("#co_excel").attr("disabled", false);
				$("#co_cancelar").attr("disabled", false);
				$("#co_filtro").attr("disabled", true);
				$("#total_RecordsInicial").val("1");
			}
		},
		complete: function()
		{
			
		}   
	});

	return true;
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_Cerrar()
{
	window.close();
}
	
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_Cancelar()
{
	
	$("#co_excel").attr("disabled", true);
	$("#co_cancelar").attr("disabled", true);
	$("#co_filtro").attr("disabled", false);
	$grid.pqGrid( "option", "dataModel.data", [] );
	$grid.pqGrid( "refreshView" );
}


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_Carga_Cargos()
{
	
	var param= 
    {
        "func":"cargos",
        "Empresa":$("#tx_empresa").val()
    };
	
	HablaServidor(my_url1, param, false, "text", function(text) 
    {
        $("#cb_cargo").html(text);
    });
	
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_Carga_Eventos()
{
	
	var param= 
    {
        "func":"eventos",
        "Empresa":$("#tx_empresa").val()
    };

	HablaServidor(my_url2, param, false, "text", function(text) 
    {
        $("#cb_evento").html(text);
    });
	
}


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
 $(document).ready(function() {

	//Parámetros
	g_tit = "Facturación - Auditoría de Cargos Manuales";
	document.title = g_tit;
	$("#tituloexcel").val(g_tit);
	$("#tx_empresa").val(fn_get_par("Empresa"));
	$("#tx_rol_syn").val(fn_get_par("Rol"));
	$("#tx_rol_fun").val(fn_get_par("RolFun"));
	$("#tx_ip").val(fn_get_par("Ip"));	
	
    $( "#co_rol" ).button({
        icons: {primary: "ui-icon-search"},
        text:false
    });
    
    
    pq_col_rol = [
	   { title: "Rol", dataType: "string", width: 100, dataIndx: 'C1', align: "left",filter: { type: 'textbox', condition: 'contain', listeners: ['keyup']}},
       { title: "Nombre", dataType: "string", width: 280, dataIndx: 'C2', align: "left",filter: { type: 'textbox', condition: 'contain', listeners: ['keyup']}}
    ];
    
    $("#dialog-rol").dialog({
        autoOpen:false,
        modal: true,
        resizable: true,
        height: 260,
        width: 450
    });
     
    $listado_roles = $("#grid_roles").pqGrid({ width: 430, height: 200,
		colModel: pq_col_rol, 
		rowBorders:true,
		editable:false,
		showTop:false,
		title:"Permisos",
		selectionModel: { type: 'row', mode: 'single' },
		filterModel: { on: true, mode: "OR", header: true },
		pageModel: { rPP: 5000, type: "local", rPPOptions: [100, 200, 300, 400, 500]},
		sortIndx: 2, 
		sortDir: "down"
	});
			
	$listado_roles.pqGrid({
		rowDblClick: function( event, ui ) {
			if (ui.rowData) 
				{
					var dataCell = ui.rowData;
					$("#tx_Rol").val(dataCell.C1);
					$( "#dialog-rol" ).dialog( "close" );
				}
			}
	});
	//PARA RELLENAR LA GRID DE ROLES A SELECCIONAR
	var parameters = {'Empresa':$("#tx_empresa").val(),'griddata':'grid_Roles'};
	cadenajson="";
	HablaServidor(my_url3,parameters, "grid_roles", 'json', function(json) {		
        //cadenajson = JSON.stringify(json.data);
        cadenajson = JSON.stringify(json);
	});
	
	$("#tx_json_rol").val(cadenajson);
	$listado_roles.pqGrid( "option", "dataModel.data", eval($("#tx_json_rol").val()));    
	$listado_roles.pqGrid( "option", "dataModel.sortDir", "up" ); 
	$listado_roles.pqGrid( "option", "pageModel.type", "");
	$listado_roles.pqGrid( "option", "dataModel.sortIndx", "C2" );

	$listado_roles.pqGrid( "refreshDataAndView" );
    
    $("#co_rol").on("click",function() {
		$("div#dialog-rol input").attr("disabled", false);
		$("div#dialog-rol button").attr("disabled", false);
		$("#dialog-rol").dialog("open");

		$("div#dialog-rol input").val("");
        $listado_roles.pqGrid( "refreshDataAndView" );

		//$("#grid_roles").pqGrid( "filter", { oper:'replace', data: [] } );
		
	});
    
     
     
	fn_Setea_Grilla();
	fn_Setea_Filtro();
	fn_Carga_Cargos();
    fn_Carga_Eventos();
	
	$("#co_filtro").on("click", fn_Muestra_Filtro);
	$("#co_cerrar").on("click", fn_Cerrar);	
	$("#co_cancelar").on("click", fn_Cancelar);
	$("#co_excel").attr("disabled", true);
	$("#co_cancelar").attr("disabled", true);
	$("#tx_cliente").on("keypress", fn_tx_Numeros);
	
	$("#tx_FechaInicio").on("change", function (e) {
		//$("#tx_FechaFin").focus();	
    });
	
	$("#tx_FechaFin").on("change", function (e) {
		//$("#tx_cliente").focus();	
    });
	
	$( "#tx_FechaInicio" ).datepicker({
          changeMonth: true,
          changeYear: true,
          yearRange: "2000:2020",
		  dateFormat:"dd/mm/yy"
        });
	
	$( "#tx_FechaFin" ).datepicker({
          changeMonth: true,
          changeYear: true,
          yearRange: "2000:2020",
		  dateFormat:"dd/mm/yy"
        });
		
	$("#tx_Rol").keyup(function() {
		$(this).val($(this).val().toUpperCase());
	});
		
    $("#co_excel").on('click', function (e) {
        if($("#total_RecordsInicial").val()!='0'){
			$("#frm_Exel").submit();
			return;
		}
		e.preventDefault();		
    });
		
    $("#Co_cerrar").click(function (evt,ui) {
		window.close();
    });
	
    $("#Co_leer").click(function (evt,ui) {
		
		if ($("#tx_cliente").val()=='' )	
		{
			if ($("#tx_FechaInicio").val()=='' && $("#tx_FechaFin").val()=='') 
			{
				fn_mensaje('Debe digitar las fechas!',g_tit,$(""));
				return false;
			}
		}
	});
     
    
	
	 
    $.ui.dialog.prototype._focusTabbable = $.noop; //evita que la fecha despliegue el datepicker cuando carga
	
	
 });