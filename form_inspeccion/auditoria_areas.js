var g_tit = "";
var my_url = "oadmcen_0012b_json.asp";
var parameters = {};
var areaa = "";
var distri = "";
var pq_col_rol = [];
var Filtros = [];


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
	//wrap:false,
		toolbar: {
            cls: 'pq-toolbar-export',
            items: [	
                { type: 'button', label: 'Leer', icon: 'ui-icon-search', attr:'id=co_leer'},
				{ type: 'button', label: 'Excel', icon: 'ui-icon-disk', attr:'id=co_excel'},
                { type: 'button', label: 'Cerrar', icon: 'ui-icon-power', attr:'title=Cerrar&nbsp;Ventana', attr:'id=co_cerrar' }
            ]
        }
	};

	obj.colModel = [
        { title: "Fecha", dataType: "string", width: 80, dataIndx: 'C1', align: "center", halign: "center"},
        { title: "Evento", dataType: "string", width: 220, dataIndx: 'C2', align: "left", halign: "center",},
        { title: "Rol Modifica", dataType: "string", width: 60, dataIndx: 'C3', align: "center", halign: "center"},
        { title: "Ip Modifica", dataType: "string", width: 220, dataIndx: 'C4', align: "left", halign: "center",},
        { title: "Area", dataType: "string", width: 190, dataIndx: 'C5', align: "center", halign: "center"},
        { title: "Descripción", dataType: "string", width: 190, dataIndx: 'C6', align: "center", halign: "center"},
        { title: "Tipo", dataType: "string", width: 220, dataIndx: 'C7', align: "left", halign: "center"},
        { title: "Área Padre", dataType: "string", width: 120, dataIndx: 'C8', align: "center", halign: "center"},
		{ title: "Regional Atención", dataType: "string", width: 120, dataIndx: 'C9', align: "center", halign: "center"},
		{ title: "Encargado", dataType: "string", width: 160, dataIndx: 'C10', align: "center", halign: "center"},
        { title: "Dirección", dataType: "string", width: 220, dataIndx: 'C11', align: "left", halign: "center"},
		{ title: "Teléfono1", dataType: "string", width: 120, dataIndx: 'C12', align: "center", halign: "center"},
		{ title: "Teléfono2", dataType: "string", width: 120, dataIndx: 'C14', align: "center", halign: "center",},
		{ title: "Email", dataType: "string", width: 120, dataIndx: 'C15', align: "center", halign: "center",},
		{ title: "Observación", dataType: "string", width: 120, dataIndx: 'C16', align: "center", halign: "center",},
        { title: "Estado", dataType: "string", width: 120, dataIndx: 'C17', align: "center", halign: "center",},
		{ title: "NN", dataType: "string", width: 120, dataIndx: 'C18', align: "center", halign: "center",},
    ];
    
    var data = [
                   
                    ];
		
    $grid = $("#grid_principal").pqGrid(obj);
    $grid.pqGrid( "option", "dataModel.data", data);
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
		'func':'grid_area_comercial',
		'empresa':$("#tx_empresa").val(),
		'rolFil':$("#tx_Rol").val(),
		'p_rol':$("#Rol").val(),
	};    

}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_setea_filtro(){

	$("#div_modificar").dialog({
        title:g_tit,
        autoOpen:false,
        modal: true,
        resizable: false,
        width: 370,
		height: 290,
        buttons: [{
            id:"co_ok",
            width:80,
            text: "Leer",
            click: function() {
                if (fn_valida()){
					parameters = 
					{
						'func':"fn_insert",
						'Empresa':$("#tx_empresa").val(),
						'p_rol':$("#Rol").val(),
						'p_ip':$("#tx_ip").val(),
						'p_desc_area':$("#tx_desc_area").val(),
						'p_regional':$("#cb_regional").val(),
						'p_Area_padre':$("#tx_cod_area").val(),
						//'p_nivel':$("#cb_distrito").val(),
						'p_jerarquia':v_tipo[0],
						'p_email':$("#tx_mail").val(),
						'p_estado':$("#cb_estado").val(),
						'p_encargado':$("#tx_encargado").val(),
						'p_tel1':$("#tx_telefono1").val(),
						'p_tel2':$("#tx_telefono2").val(),
						'p_direccion':$("#tx_direccion").val(),
						'p_obs':$("#tx_obs").val(),
						'p_area':areaa
					};
					var flag_error = false;
					HablaServidor(my_url, parameters, "text", function(text) 
					{
						
						if(text=="ok")
						{
							flag_error = false;	
							$("#div_modificar").dialog("close");
							fn_mensaje("ACCIÓN REALIZADA", g_tit,$(""));
							$grid.pqGrid( "refreshDataAndView" );
						}
						else
						{
						   flag_error = true;	
						   $("#div_modificar").dialog("close");
						   fn_mensaje("ERROR", g_tit,$(""));
						}						
					});					
                    
                }
				else
				{
					fn_mensaje("FAVOR DIGITAR TODOS LOS CAMPOS", g_tit,$(""));
				}	
            }
        },
        {   
            id:"co_cancel",
			width:80,
            text: "  Cerrar  ",
            click: function() {
            //$("#co_excel").attr("disabled", true);
            $("#co_cancelar").attr("disabled", true);
            $( this ).dialog( "close" );
            }
        }
        ]		
	});
	
	$("#div_modificar").dialog("widget").find(".ui-dialog-buttonpane")
                  .css({"padding":".2em .4em .0em 1em","margin":"0 0 0 0","width":"350px"} );
	$('.ui-dialog-buttonset').css('float','none');
	$('.ui-dialog-buttonset>button:last-child').prev("button").prev("button").css('float','right');
    $('.ui-dialog-buttonset>button:last-child').prev("button").css('float','right');
	//$('.ui-dialog-buttonset>button:last-child').css('float','right');

}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_valida()	
{	

	if($.trim($("#tx_cod_area").val())!="" && $.trim($("#tx_desc_area").val())!="" && $("#cb_tipo").val()!="" && $("#cb_area_padre").val()!="" 
			&& $("#cb_estado").val()!="" && $("#cb_regional").val()!="" && $("#tx_encargado").val()!="" && $("#tx_mail").val()!=""
			&& $("#tx_telefono1").val()!="" && $("#tx_telefono2").val()!="" && $("#tx_direccion").val()!="" && $("#tx_obs").val()!="")
		return true;
	else
	{
		fn_mensaje("DEBE DIGITAR TODOS LOS CAMPOS", g_tit,$(""));
		return false;
	}
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
		async: false,
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
			}
			return {data: dataJSON.data};
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
function fn_cerrar()
{
	window.close();
}
	
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_cancelar()
{
	
	$("#co_cancelar").attr("disabled", true);
	$("#co_filtro").attr("disabled", false);
	$grid.pqGrid( "option", "dataModel.data", [] );
	$grid.pqGrid( "refreshView" );
}


//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
$(document).keydown(function(e) {
        if (e.keyCode === 8 ) {
            var element = e.target.nodeName.toLowerCase();
            if ((element != 'input' && element != 'textarea') || $(e.target).attr("readonly")) {
                return false;
            }
        }
    });

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
 $(document).ready(function() {

	//ParÃ¡metros
	g_tit = "Administrador de las Áreas Comerciales";
	document.title = g_tit;
	$("#tituloexcel").val(g_tit);
	$("#excel_archivo").val("areas_comerciales.xls");
	
	$("#tx_empresa").val(fn_get_par("Empresa"));
	$("#Rol").val(fn_get_par("Rol"));
	$("#tx_rol_fun").val(fn_get_par("RolFun"));
	$("#tx_ip").val(fn_get_par("ip"));
	
	fn_setea_grilla();
	fn_setea_filtro();
	$("#co_excel").attr("disabled", true);
	
	$("#co_cerrar").on("click", fn_cerrar);	
	
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
     
    $("#tx_fec_ini").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: "2015:2035",
        dateFormat:"dd/mm/yy"
    });
     $("#tx_fec_final").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: "2015:2035",
        dateFormat:"dd/mm/yy"
    });
    $("#co_nuevo").on("click", fn_abrir_nuevo);
    $("#co_leer").on("click", fn_carga_dialogo);
	
	var col_model=$( "#grid_principal" ).pqGrid( "option", "colModel" );
	var cabecera = "";
	for (i=0; i< col_model.length; i++){
		if(col_model[i].hidden != true) cabecera += "<th>"+col_model[i].title+ "</th>";
	}
	$("#excel_cabecera").val(cabecera);
    $.ui.dialog.prototype._focusTabbable = $.noop; //evita que la fecha despliegue el datepicker cuando carga
	
	$.datepicker.setDefaults($.datepicker.regional['es']);
	
 });

 //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_carga_dialogo()
{
        $("#tx_rol").val("");
		$("#tx_area").val("");
		$("#cb_tipo").val("");
        $("#tx_fec_ini").val("");
		$("#tx_fec_final").val("");
 
    $("#div_modificar" ).dialog("open");
    //$("#tx_nombre").focus();
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_abrir_nuevo()
{
	$("#tx_nuevo").val("1");
	$("#tx_cod_area").attr("readonly", false);
    $("#tx_cod_area").val("");
    $("#tx_desc_area").val("");
    $("#cb_tipo").val("");
	$("#cb_area_padre").val("");
    $("#cb_estado").val("A");
	fn_carga_area_padre();
	$("#cb_regional").val("");
    $("#tx_encargado").val("");
    $("#tx_mail").val("");
	$("#tx_telefono1").val("");                 
    $("#tx_telefono2").val("");
	$("#tx_direccion").val("");                 
    $("#tx_obs").val("");
    $("#co_ok").html("Adicionar");
	$("#co_ok").show();
	$("#co_limpiar").show();
    $( "#div_modificar" ).dialog("open");
	$("#tx_cod_area").focus();
    
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_guardar()
{
	var flag_error = false;
	HablaServidor(my_url, parameters, "text", function(text) 
    {
		
		if(text=="ok")
		{
			flag_error = false;	
		}
		else
		{
		alert(text);
		   flag_error = true;	
		}
		
    });
	
	if (flag_error)
		return false;
	else
		return true;
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_upd_estado()
{
	var flag_error = false;
	HablaServidor(my_url, parameters, "text", function(text) 
    {
		
		if(text=="ok"){
			flag_error = false;
		}
		else{
		   flag_error = true;
		}
		
    });
	if (flag_error)
		return false;
	else
		return true;
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_carga_tipo()
	{
		
		$("#cb_tipo").html("");
		var param= 
			{
				"func":"fn_tipo",
				"empresa":$("#tx_empresa").val()
			};

		HablaServidor(my_url, param, "text", function(text) 
			{

				$("#cb_tipo").html(text);
			});
	}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*		
function fn_carga_area_padre(tipo)
	{
		
		$("#cb_area_padre").html("");
		var param = 
			{
				"func":"fn_area_padre",
				"empresa":$("#tx_empresa").val(),
				"p_tipo": tipo
			};

		HablaServidor(my_url, param, "text", function(text) 
			{
				$("#cb_area_padre").html(text);
			});
	}	
	
	
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
function fn_carga_estado()
{
	$("#cb_estado").html("");
	var param= 
		{
			"func":"fn_estado",
			"empresa":$("#tx_empresa").val()
		};
	HablaServidor(my_url, param, "text", function(text) 
		{
			$("#cb_estado").html(text);
			
		});
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
function fn_carga_regional()
{
	$("#cb_regional").html("");
	var param= 
		{
			"func":"fn_regional",
			"empresa":$("#tx_empresa").val()
		};
	HablaServidor(my_url, param, "text", function(text) 
		{
			$("#cb_regional").html(text);
			
		});
}
	
	
 //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function ValidaSoloNumeros(e) 
{

	if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) 
		   return false;
}

