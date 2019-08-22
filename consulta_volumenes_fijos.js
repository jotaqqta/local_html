var g_tit = "";
var my_url = "nnnn.asp";
var my_url1 = "estado_vol.txt";
var my_url2 = "evento.txt";
var my_url3 = "roles.json";
var pq_col_rol = [];
var Filtros = [];

//var g_tit = "";
//var my_url = "ffacval_0052a_json.asp";
//var Filtros = [];

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function HablaServidor(servidor,parametros,vGrid,tipofile,CallBack)
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
        { title: "NIC", dataType: "string", width: 80, dataIndx: 'c1', align: "left", halign: "center"},
        { title: "Nombre", dataType: "string", width: 230, dataIndx: 'c2', align: "left", halign: "center"},
        { title: "Ingreso", dataType: "string", width: 100, dataIndx: 'c3', align: "center", halign: "center"},
        { title: "Consumo", dataType: "string", width: 100, dataIndx: 'c4', align: "right", halign: "center"},
        { title: "Estado", dataType: "string", width: 150, dataIndx: 'c5', align: "left", halign: "center"},
        { title: "Faturación", dataType: "string", width: 100, dataIndx: 'c6', align: "center", halign: "center"},        
		{ title: "Observación", dataType: "string", width: 300, dataIndx: 'c7', align: "left", halign: "center"},
		{ title: "Rol", dataType: "string", width: 200, dataIndx: 'c8', align: "left", halign: "center"},
		{ title: "Ruta Comercial", dataType: "string", width: 160, dataIndx: 'c9', align: "center", halign: "center"}
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
		'func':'fn_grilla',
		'empresa':$("#tx_empresa").val(),
		'fechainicio':$("#tx_fecha_inicio").val(),
		'fechafin':$("#tx_fecha_fin").val(),
		'cliente':$("#tx_cliente").val(),
        'estado':$("#cb_estado").val(),
		'rolFil':$("#tx_Rol").val(),
		'rol':$("#Rol").val(),
	};
	
	Filtros = [];
	
	if ($("#tx_cliente").val()!='') Filtros.push('N° Cliente = '+$("#tx_cliente").val());
	if ($("#tx_fecha_inicio").val()!='') Filtros.push('Fecha Desde = '+$("#tx_fecha_inicio").val());
	if ($("#tx_fecha_fin").val()!='') Filtros.push('Fecha Hasta = '+$("#tx_fecha_fin").val());
    if ($("#cb_estado").val()!=''){Filtros.push('Estado = '+$("#cb_estado :selected").text());}
	if ($("#tx_Rol").val()!='') Filtros.push('Rol = '+$("#tx_Rol").val());	
	
	$("#filtro").val(Filtros);

}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	

function fn_setea_filtro(){

	$("#div_filtro").dialog({
        title:g_tit,
        autoOpen:false,
        modal: true,
        resizable: false,
        height: 270,
        width: 490,
        buttons: [{
            id:"co_limpiar",
            text: "Limpiar",				
            click: function() {
                $("#tx_fecha_inicio").val("");
                $("#tx_fecha_fin").val("");
                $("#tx_cliente").val("");
                $("#cb_estado").val("");
                $("#tx_Rol").val("");
                Filtros = [];
            }
        },
        {
            id:"co_cancel",
            text: "Cancelar",
            click: function() {
                $("#co_excel").attr("disabled", true);
                $("#co_cancelar").attr("disabled", true);
                $( this ).dialog( "close" );
            }
        },
        {
            id:"co_ok",
            text: "Aceptar",
            click: function() {
                if (fn_valida()){
                    $(this).dialog("close");
                    fn_carga_grilla();
                }
            }
        }
        ]	
	});
	
	$("#div_filtro").dialog("widget").find(".ui-dialog-buttonpane")
                  .css({"padding":".4em 2em .3em 1em","margin":"0 0 0 0","width":"455px"} );
	$('.ui-dialog-buttonset').css('float','none');
	$('.ui-dialog-buttonset>button:last-child').prev("button").css('float','right');
	$('.ui-dialog-buttonset>button:last-child').css('float','right');

}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_valida()	
{	

	var flag_error = true;
	var sinFecha = false;
	
	if($.trim($("#tx_cliente").val())!='') sinFecha = true;
	if($.trim($("#tx_Rol").val())!='') sinFecha = true;

	if(!sinFecha)
	{
		if (($("#tx_fecha_inicio").val() == "") || ($("#tx_fecha_fin").val() == ""))
		{
			fn_mensaje("DEBE INDICAR UN RANGO DE FECHA PARA REALIZAR LA BUSQUEDA !", g_tit, $(""));
			return false;
		}
		
	}
	
	if($("#tx_fecha_inicio").val() != ""){
		if (fn_validar_fecha($("#tx_fecha_inicio").val()) == false){
			fn_mensaje("INFORMACIÓN INCORRECTA EN EL CAMPO FECHA DE INICIO. EL FORMATO ES DD/MM/YYYY", g_tit, $("#tx_fecha_inicio") );
			return false;
		}
	}
	
	if($("#tx_fecha_fin").val()!=""){
		if (fn_validar_fecha($("#tx_fecha_fin").val()) == false){
			fn_mensaje("INFORMACIÓN INCORRECTA EN EL CAMPO FECHA FIN. EL FORMATO ES DD/MM/YYYY", g_tit, $("#tx_fecha_fin") );
			return false;
		}
	}
	
	
	return true;
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
				$("#co_filtro").attr("disabled", true);
			}
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
	
	HablaServidor(my_url1, param, false, "text", function(text) 
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
 $(document).ready(function() {

	//Parámetros
	g_tit = "Facturación - Consulta de Volúmenes Fijos";
	document.title = g_tit;
	$("#titulo_excel").val(g_tit);
	$("#excel_archivo").val("consulta_volumenes_fijos.xls");
	
	$("#tx_empresa").val(fn_get_par("Empresa"));
	$("#Rol").val(fn_get_par("Rol"));
	$("#tx_rol_fun").val(fn_get_par("RolFun"));
	$("#tx_ip").val(fn_get_par("Ip"));	
	
	fn_setea_grilla();
	fn_setea_filtro();
    fn_carga_estados();
	
	$("#co_filtro").on("click", fn_muestra_filtro);
	$("#co_cerrar").on("click", fn_cerrar);	
	$("#co_cancelar").on("click", fn_cancelar);
	$("#co_excel").attr("disabled", true);
	$("#co_cancelar").attr("disabled", true);
	$("#tx_cliente").on("keypress", fn_tx_numeros);
	
	$("#tx_fecha_inicio").on("change", function (e) {
		//$("#tx_fecha_fin").focus();	
    });
	
	$("#tx_fecha_fin").on("change", function (e) {
		//$("#tx_cliente").focus();	
    });
	
	$( "#tx_fecha_inicio" ).datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: "2000:2020",
        dateFormat:"dd/mm/yy"
    });
	
	$( "#tx_fecha_fin" ).datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: "2000:2020",
        dateFormat:"dd/mm/yy"
    });
		
	$("#tx_Rol").keyup(function() {
		$(this).val($(this).val().toUpperCase());
	});
		
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
	
	var col_model=$( "#grid_principal" ).pqGrid( "option", "colModel" );
	var cabecera = "";
	for (i=0; i< col_model.length; i++){
		if(col_model[i].hidden != true) cabecera += "<th>"+col_model[i].title+ "</th>";
	}
	$("#excel_cabecera").val(cabecera);
    $.ui.dialog.prototype._focusTabbable = $.noop; //evita que la fecha despliegue el datepicker cuando carga
	
	$.datepicker.setDefaults($.datepicker.regional['es']);
	
 });