var g_tit = "";
var my_url = "";
var parameters = {};
/*
var my_url1 = "estado_vol.txt";
var my_url2 = "evento.txt";
var my_url3 = "roles.json";*/
var pq_col_rol = [];
var Filtros = [];

//var g_tit = "";
//var my_url = "ffacval_0052a_json.asp";
//var Filtros = [];

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function HablaServidor(servidor,parametros,tipofile,CallBack)
{
    var respuestaJSON="";

    $.ajax({
        url: servidor,
        data: parametros,
        async: false,
        dataType: tipofile,
        type: "GET",   //dejar en POST
        cache: false,
        contentType:"application/x-www-form-urlencoded; charset:ISO-8859-1",
        error: function(jqErr, err_stat, err_str) // ERROR EN EL ASP
        {
            $("#lb_mensaje").html(jqErr.responseText);
			$( "#dialog-message" ).dialog({title: g_tit,modal: true,height:300,width:500,
                buttons: {
                    Cerrar: function() {
                    $( this ).dialog( "close" );
                    }
                }
            });

        },
		success: function(DevuelveDatos)
        {
            respuestaJSON=DevuelveDatos;
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
function fn_tx_numeros(e) 
{        
	if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) 
		   return false;
}


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_muestra_filtro()
{
	$( "#div_filtro" ).dialog( "open" );
    $( "#tx_fecha_inicio" ).datepicker( "hide" );
    $( "#co_cancel" ).focus();
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_setea_grilla(){
	
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
    filterModel: { on: true, mode: "AND", header: true },
	selectionModel: { type: 'row',mode:'single'},
	numberCell: { show: true },
	stripeRows: true,
	pageModel: { type: ""},
	title: g_tit,
	hwrap:false,
	wrap:false,
		toolbar: {
            cls: 'pq-toolbar-export',
            items: [			
				{ type: 'button', label: 'Nuevo', icon: 'ui-icon-plus   ', attr:'title=Crear&nbsp;Ventana', attr:'id=co_nuevo' },
				{ type: 'button', label: 'Excel', icon: 'ui-icon-disk', attr:'id=co_excel'},
                { type: 'button', label: 'Cerrar', icon: 'ui-icon-power', attr:'title=Cerrar&nbsp;Ventana', attr:'id=co_cerrar' }
            ]
        }
	};

	obj.colModel = [
        { title: "Código", dataType: "string", width: 80, dataIndx: 'C1', align: "left", halign: "center"},
        { title: "Nombre", dataType: "string", width: 200, dataIndx: 'C2', align: "left", halign: "center",
            filter: { type: "textbox", condition: 'contain', listeners: ['keyup']}},
        { title: "Provincia", dataType: "string", width: 200, dataIndx: 'C3', align: "center", halign: "center",
            filter: { type: "textbox", condition: 'contain', listeners: ['keyup']}},
        { title: "Distrito", dataType: "string", width: 200, dataIndx: 'C4', align: "center", halign: "center",
            filter: { type: "textbox", condition: 'contain', listeners: ['keyup']}},
        { title: "Código Contraloría", dataType: "string", width: 100, dataIndx: 'C5', align: "center", halign: "center"},
        { title: "Regional Cliente", dataType: "string", width: 100, dataIndx: 'C6', align: "center", halign: "center"},
        { title: "Regional AIC", dataType: "string", width: 100, dataIndx: 'C7', align: "center", halign: "center"},
        { title: "Estado", dataType: "string", width: 100, dataIndx: 'C8', align: "center", halign: "center"},
    ];
    
    var data = [
                   { "c1": "13486", "c2": "Abogado", "c3": "Activo" },
                    { "c1": "13487", "c2": "Asistente I", "c3": "Activo" },
                    { "c1": "13488", "c2": "Educador", "c3": "Activo" },
                    { "c1": "13489", "c2": "Arquitecto", "c3": "Activo" },
                    { "c1": "13467", "c2": "Soldador", "c3": "Activo" },
                    { "c1": "13457", "c2": "Conductor", "c3": "Activo" }
                    ];
		
    $grid = $("#grid_principal").pqGrid(obj);
    $grid.pqGrid( "option", "dataModel.data", data);
    $grid.pqGrid( "refreshDataAndView" );

    $grid.pqGrid({
        rowDblClick: function( event, ui ) {
            if (ui.rowData) {
                var dataCell = ui.rowData;
                fn_carga_dialogo(dataCell.C1, dataCell.C2, dataCell.C3, dataCell.C4, dataCell.C5, dataCell.C6, dataCell.C7, dataCell.C8);
            }
            //$("#Tx_oculto").focus();
        }
    });
	
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	

 function fn_mensaje(p_mensaje, p_titulo, $p_objeto)
 {

    $("#lb_mensaje").html(p_mensaje);

    $( "#dialog-message" ).dialog({
        title:p_titulo,
        modal: true,
        buttons: {
            "Ok": function() {
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
		'func':'grid_cat_corregimiento',
		'empresa':$("#tx_empresa").val(),
		'rolFil':$("#tx_Rol").val(),
		'p_rol':$("#Rol").val(),
	};
    
    HablaServidor(my_url, parameters, "text", function(text) 
    {
        if(text != "")
        {
            $grid.pqGrid( "option", "dataModel", text);
	        $grid.pqGrid( "refreshDataAndView" );
        }
            
    });
    

}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	

function fn_setea_filtro(){

	$("#div_modificar").dialog({
        title:g_tit,
        autoOpen:false,
        modal: true,
        resizable: false,
        width: 490,
        buttons: [{
            id:"co_limpiar",
            text: "Limpiar",				
            click: function() {
                $("#tx_descripcion").val("");
                if($("#tx_nuevo").val() == "1"){
                     $("#tx_codigo").val("");
                     $("#tx_estado").val("");
                }
                Filtros = [];
            }
        },
        {   
            id:"co_cancel",
            text: "Cerrar",
            click: function() {
            $("#co_excel").attr("disabled", true);
            $("#co_cancelar").attr("disabled", true);
            $( this ).dialog( "close" );
            }
        },
        {
            id:"co_ok",
            text: "Modificar",
            click: function() {
                if (fn_valida()){
                    $(this).dialog("close");
                    //fn_carga_grilla();
                    $grid.pqGrid( "refreshDataAndView" );
                }
            }
        },
        {
            id:"co_estado",
            text: "Inactivar",
            click: function() {
                if (fn_valida()){
                    $(this).dialog("close");
                    //fn_carga_grilla();
                }
            } 
        }
        ]		
	});
	
	$("#div_modificar").dialog("widget").find(".ui-dialog-buttonpane")
                  .css({"padding":".4em 2em .3em 1em","margin":"0 0 0 0","width":"455px"} );
	$('.ui-dialog-buttonset').css('float','none');
	$('.ui-dialog-buttonset>button:last-child').prev("button").prev("button").css('float','right');
    $('.ui-dialog-buttonset>button:last-child').prev("button").css('float','right');
	$('.ui-dialog-buttonset>button:last-child').css('float','right');

}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_valida()	
{	

	if($.trim($("#tx_nombre").val())!="")
		return true;
	else
		return false;
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_carga_grilla()
{
	var total_register=0;

	var dataModel = {};
	fn_setear();
	
	dataModel = 
	{
		location: "remote",
		sorting: "local",
		dataType: "json",
		method: "POST",
		curPage: 1,      
		sortDir: ["up", "down"], 
		url:my_url+"?"+$.param(parameters),
		getData: function (dataJSON)
		{
			total_register = $.trim(dataJSON.totalRecords);
			var data = dataJSON.data;
			var sql_excel= JSON.stringify(dataJSON.sql);
			$("#sql").val(eval(sql_excel));	
			if(total_register>=1)
			{
				$("#co_excel").attr("disabled", false);
                $("#co_cancelar").attr("disabled", false);
                //$("#co_filtro").attr("disabled", false);
			}
            return { curPage: dataJSON.curPage, totalRecords: dataJSON.totalRecords, data: dataJSON.data};
			//return {data: dataJSON.data};
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
	
	
	
	return true;
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_carga_estados()
{
	
	var param= 
    {
        "func":"fn_estados",
        "Empresa":$("#tx_empresa").val(),
        "Rol":$("#Rol").val()
    };
	
	HablaServidor(my_url1, param, "text", function(text) 
    {
        $("#cb_estado").html(text);
    });
	
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_cerrar()
{
	window.close();
}
	
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_cancelar()
{
	
	$("#co_excel").attr("disabled", true);
	$("#co_cancelar").attr("disabled", true);
	$("#co_filtro").attr("disabled", false);
	$grid.pqGrid( "option", "dataModel.data", [] );
	$grid.pqGrid( "refreshView" );
}



//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
 $(document).ready(function() {

	//ParÃ¡metros
	g_tit = "Catálogo de Corregimientos";
	document.title = g_tit;
	$("#tituloexcel").val(g_tit);
	$("#excel_archivo").val("catalogo_corregimientos.xls");
	
	$("#tx_empresa").val(fn_get_par("Empresa"));
	$("#Rol").val(fn_get_par("Rol"));
	$("#tx_rol_fun").val(fn_get_par("RolFun"));
	$("#tx_ip").val(fn_get_par("Ip"));	
	
	fn_setea_grilla();
	fn_setea_filtro();
    //fn_carga_estados();
	
	$("#co_cerrar").on("click", fn_cerrar);	
	$("#co_excel").attr("disabled", true);
		
    $("#co_excel").on('click', function (e) {
        var element =$grid.pqGrid("option","dataModel.data");
		if (element)
			a= element.length;
		else 
			a= 0;
		if(a>0){
			$("#frm_Exel").submit();
			return;
		}
		e.preventDefault();		
    });
		
    $("#co_cerrar").click(function (evt,ui) {
		window.close();
    });
     
    $("#co_nuevo").on("click", fn_mensaje("ACCIÓN REALIZADA", g_tit,$("")));
	
	var col_model=$( "#grid_principal" ).pqGrid( "option", "colModel" );
	var cabecera = "";
	for (i=0; i< col_model.length; i++){
		if(col_model[i].hidden != true) cabecera += "<th>"+col_model[i].title+ "</th>";
	}
	$("#excel_cabecera").val(cabecera);
    $.ui.dialog.prototype._focusTabbable = $.noop; //evita que la fecha despliegue el datepicker cuando carga
	
	$.datepicker.setDefaults($.datepicker.regional['es']);
	
	//fn_carga_grilla();
	
 });

 //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_carga_dialogo(codigo, nombre, provincia, distrito, codigo_con, regional_cli, regional_aic, estado)
{
    

        $("#tx_codigo").val($.trim(codigo));
        //$("#tx_codigo").attr("disabled", true);
        $("#tx_nombre").val($.trim(nombre));
        $("#tx_provincia").val($.trim(provincia));
        $("#tx_distrito").val($.trim(distrito));
        $("#tx_cod_contra").val($.trim(codigo_con));
        $("#tx_regional_cli").val($.trim(regional_cli));
        $("#tx_regional_aic").val($.trim(regional_aic));
        $("#tx_estado").val($.trim(estado));
        //$("#tx_estado").attr("disabled", true);
        
        $("#tx_nuevo").val("0");
        $("#co_estado").show();
        $("#co_ok").html("Modificar");

		
        if($("#tx_estado").val() == "INACTIVO"){
            $("#co_estado").text("Activar");
        }
		else
			$("#co_estado").text("Inactivar");
 
    
    
    $( "#div_modificar" ).dialog("open");
    //$("#tx_codigo").focus();
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_abrir_nuevo()
{
	$("#tx_codigo").val("");
    $("#tx_codigo").attr("disabled", true);
    $("#tx_nombre").val("");
    $("#tx_provincia").val("");
    $("#tx_distrito").val("");
    $("#tx_cod_contra").val("");
    $("#tx_regional_cli").val("");
    $("#tx_regional_aic").val("");
    $("#tx_estado").val("ACTIVO");
    $("#tx_estado").attr("disabled", true);                    
    
    $("#tx_nuevo").val("1");
    $("#co_ok").html("Adicionar");
    $("#co_estado").hide();
    $( "#div_modificar" ).dialog("open");
	$("#tx_nombre").focus();
    
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_guardar()
{
	HablaServidor(my_url, parameters, "text", function(text) 
    {
		
		if(text=="ok")
		{
		   fn_mensaje("ACCIÓN REALIZADA", g_tit,$(""));
			
		}
		else
		{
		   fn_mensaje("ERROR", g_tit,$(""));
		}
		
    });
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_upd_estado()
{
	HablaServidor(my_url, parameters, "text", function(text) 
    {
		
		if(text=="ok")
		   fn_mensaje("ACCIÓN REALIZADA", g_tit,$(""));
		else
		   fn_mensaje("ERROR", g_tit,$(""));
		
    });
}
