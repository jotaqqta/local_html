var dato_original = [];
var g_tit = "";
var $grid;
var parameters = {};
var item_sel = "";
var my_url = "volumenes_fijos_json.asp";

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
String.prototype.replaceAll = function(target, replacement) {
  return this.split(target).join(replacement);
};

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
$(document).keydown(function(e) {

	if (e.keyCode === 8) {
		var element = e.target.nodeName.toLowerCase();
		if ((element != 'input' && element != 'textarea') || $(e.target).attr("readonly")) {
			return false;
		}
	}
});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
$( document ).ready(function() {
    g_tit = "Facturación - Ingreso de Volúmenes Fijos";

    document.title = g_tit;
    $(".tit1").html(g_tit);
    $("#titulo").val(g_tit);
	$("#tituloexcel").val(g_tit);
	$("#excel_archivo").val("volumenes_fijos.xls");

    $("#Empresa").val(fn_get_par("Empresa"));
    $("#RolFun").val(fn_get_par("RolFun"));
    $("#Rol").val(fn_get_par("Rol"));
    $("#Ip").val(fn_get_par("Ip"));

    fn_setea_grilla();
	
	fn_setea_edit();
	
	fn_setea_modal();
	
	
    $("#co_nuevo").on("click", fn_muestra_edit);

    $("#co_eliminar_f").on("click", function(event)
    {

        if(item_sel!="") {
            $("#tx_obs2").val("");
            $("#dialog-modal").dialog( "open" );
        }
        else
        {
            fn_mensaje("DEBE SELECCIONAR UN REGISTRO DE LA GRILLA", g_tit, $(""));
            return false;
        }

    });
    

    $('#tx_cliente').on('keydown', function(event) {
        var tecla =  event.which || event.keyCode;
        if(tecla==13)
        {		
            $('#co_leer').trigger( "click" );
            return false;
        }
    });
		
    $("#co_excel").on("click", fn_excel);

    if(fn_get_par("suministro"))
    {
        document.getElementById('tx_cliente').value=fn_get_par("suministro");
        $('#co_leer').trigger( "click" );
    }

    $("#co_leer").on("click", fn_leer_cliente);

    $( "#co_leer" ).button({
        label:"Leer"
    });

    $( "#co_cerrar" ).button({
        label:"Cerrar"
    });

	var col_model=$( "#grid_variable" ).pqGrid( "option", "colModel" );
	var cabecera = "";
	for (i=0; i< col_model.length; i++){
		if(col_model[i].hidden != true) cabecera += "<th>"+col_model[i].title+ "</th>";
	}
	$("#excel_cabecera").val(cabecera);
		
    $("#co_cerrar").on("click", fn_accion);
    fn_habilita_control_grilla(true);
    $("#tx_cliente").on("keypress", fn_texto_numerico);
    $("#tx_consumo").on("keypress", fn_texto_decimal);
    $("#co_leer").attr("disabled", false);
    $("#tx_cliente").focus();
});


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_setea_grilla()
{
	var colM = 
    [        
        { title: "Id", width: 100, align: "left", dataIndx:"c1",editable: false,minWidth:10, halign: "center"},           
        { title: "Fec. Ingreso", width: 110, align: "center", dataIndx:"c2",editable: false,minWidth:10, halign: "center"},
        { title: "Consumo", width: 110, align: "right", dataIndx:"c3",editable: false,minWidth:10, halign: "center"},
        { title: "Estado", width: 150, align: "left", dataIndx:"c4",editable: false,minWidth:10, halign: "center"},
        { title: "Fec. Fact", width: 110, align: "center", dataIndx:"c5",editable: false,minWidth:10, halign: "center"},
        { title: "Observación", width: 350, align: "left", dataIndx:"c6",editable: false,minWidth:10, halign: "center"},
        { title: "Rol", width: 250, align: "left", dataIndx:"c7",editable: false,minWidth:10, halign: "center"}
    ];

    var data = 
        [];

    var obj = {
        minWidth:10,
        width:962,
        height: 270,
        colModel: colM,
        showTitle: false,
        stripeRows: false,
        collapsible: { on : false,toggle:false },
        numberCell: { show: true },
        pageModel: { rPP: 500, type: "local", rPPOptions:[300,500,1000]},
        selectionModel: { type: "row" },
        hwrap:false,
        wrap:false,
        toolbar: 
        {
            cls: "pq-toolbar-export",
            items: 
            [
                { type: "button", label: "Nuevo", icon: "ui-icon-plus", attr:"id=co_nuevo"},
                { type: "button", label: "Eliminar Fila", icon: "ui-icon-close",attr:"id=co_eliminar_f" },
                { type: "button", label: "Excel", icon: "ui-icon-disk", attr:"id=co_excel"}
            ]
        },
        dataModel: { data: [] }
    };

    $grid = $("#grid_variable").pqGrid(obj);

    $grid.pqGrid({
        rowClick: function( event, ui ) {
            if (ui.rowData)
            {
                var dataCell = ui.rowData;
                item_sel = dataCell.c1
            }

        }		
    });
}


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_setea_modal()
{
	$( "#dialog-modal" ).dialog({
		resizable: false,
		autoOpen: false,
		height: 215,
		modal: true,
		width: 600,
		buttons: {
			Aceptar: function() {							
				
				if($.trim($("#tx_obs2").val())!="")
				{
				var longitud = $("#tx_obs2").val();
					if (longitud.length< 10)    {
						fn_mensaje("DEBE ESCRIBIR UNA OBSERVACIÓN CON MAS DE 10 CARACTERES!", g_tit, $(""));
						$("#tx_obs2").focus();
						return false;
					}	
					
					var cant_c = parseInt($("#tx_obs2").val().length);
					if (cant_c>499) {
						fn_mensaje("SOLO SE PERMITE UN MÁXIMO DE 500 CARACTERES EN LA OBSERVACIÓN!", g_tit, $("#tx_obs2"));		
						$("#tx_obs2").focus();
						return false;
					}
					
					$("#tx_observatexto").val($("#tx_obs2").val());
									

					if(fn_elimina_fila())
					{
						item_sel="E";
						$( "#dialog-modal" ).dialog("close" );						
					}			
				}
				else
				{
					fn_mensaje("DEBE ESCRIBIR UNA OBSERVACIÓN CON MAS DE 10 CARACTERES!", g_tit, $(""));
					return false;
				}
				//$( this ).dialog( "close" );
			},
			Cancelar: function() {
				$( this ).dialog( "close" );
			}
		},
		close: function(event, ui)
		{
			if(item_sel=="E")
			{
				item_sel="";
				vResp = "EL REGISTRO FUE ELIMINADO!";
				fn_mensaje(vResp, g_tit, $(""));
				$grid.pqGrid( "refreshDataAndView" );
			}
		}
	});

}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_setea_edit()
{
	$("#div_edit").dialog({
        title:g_tit,
        autoOpen:false,
        modal: true,
        resizable: false,
        height: 280,
        width: 610,
        buttons: [
        {
            id:"co_limpiar",
            text: "Limpiar",
            width: 75,
            click: function() {
                    fn_limpiar();
            }
        },
        {
            id:"co_cancel",
            text: "Cancelar",
            width: 75,
            click: function() {
                    $( this ).dialog( "close" );						
            }
        },
        {
            id:"co_ok",
            text: "Aceptar",
            width: 75,
            click: function() {

                if ($.trim($("#tx_consumo").val()) == "" || $.trim($("#tx_consumo").val()) == "0") 
                {
                    fn_mensaje("DEBE INDICAR EL CONSUMO", g_tit, $("#tx_consumo"));
                    return false;
                }

                if ($.trim($("#tx_obs").val()).length < 10) 
                {
                    fn_mensaje("DEBE ESCRIBIR UNA OBSERVACIÓN CON MAS DE 10 CARACTERES.!", g_tit, $("#tx_obs"));
                    return false;
                }

                if(fn_guardar())
                {	
                    fn_limpiar();
                    return true;
                }	

            } // FIN EVENTO CLICK
        }]				
    });
    
	//$("#div_edit").dialog("widget").find(".ui-dialog-buttonpane")
    //              .css({"padding":".4em 2em .3em 1em","margin":"0 0 0 0","width":"574px"} );
	$('.ui-dialog-buttonset').css('float','none');
	$('.ui-dialog-buttonset>button:last-child').prev("button").css('float','right');
	$('.ui-dialog-buttonset>button:last-child').css('float','right');

}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_muestra_edit()
{
    $("#div_edit" ).dialog( "open" );
	fn_limpiar();
    //$("#tx_con").focus();
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_confirmar(title, message, CallBack) 
{
	var def = $.Deferred();
	$("#lb_mensaje_div").html(message);

	$mydialog = $("#dialog-confirm").dialog({
	modal: true,
	title: title,
	autoOpen: false,
	buttons: {
		"Si": function() {
			$(this).dialog("close");
			return CallBack(true);
			},
		"No": function() {
			$(this).dialog("close");
			return CallBack(false);
			}
		}
	});
	$mydialog.dialog( "open" );
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
function HablaServidor(servidor,parametros,p_grid,tipofile,CallBack)
{
    var respuestaJSON="";

    $.ajax({
        url: servidor,
        data: parametros,
        async: false,
        dataType: tipofile,
        type: "GET",  //cambiar a POST 
        cache: false,
        contentType:"application/x-www-form-urlencoded; charset:ISO-8859-1",
        error: function(jqErr, err_stat, err_str) // ERROR EN EL ASP
        {
            $("#lb_mensaje").html(jqErr.responseText);
			if(p_grid){
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
			if(p_grid){
				$("#label").html("Recuperando Datos...");
				$("#"+p_grid+" .pq-loading").show();
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
	function fn_leer_cliente()
	{
		if ($(this).text() == "Leer")
		{
			if($.trim(document.getElementById('tx_cliente').value) != "")
				fn_carga_datos();
			else
				fn_mensaje("DEBE DIGITAR UN NÚMERO DE CLIENTE", g_tit, $("#tx_cliente"));
		}		

	}
	
	//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
	function fn_carga_datos()
	{
		dato_original = [];

		parameters = {
						"func":"fn_generales",
						"empresa":$("#Empresa").val(),
						"RolFun":$("#RolFun").val(),
						"rol":$("#Rol").val(),
						"ip":$("#Ip").val(),
						"cliente":document.getElementById('tx_cliente').value
						};
		
		//HablaServidor(my_url,parameters,false,'text', function(text) 
        HablaServidor("datos_generales.txt",parameters,false,'text', function(text) 
        {
			
			if($.trim(text)=="") {
				fn_mensaje("NÚMERO DE CLIENTE NO EXISTE", g_tit, $("#tx_cliente"));
				return 0;
			}
			
			dato_original = text.split("|");
			fn_habilita_control_grilla(false);
			$("#tx_nombre").val(dato_original[0]);
			$("#tx_direccion").val(dato_original[1]);
			
			$("#tx_estado").val(dato_original[2]);
			$("#tx_conex").val(dato_original[3]);
	
			$("#tx_regional").val(dato_original[4]);
			$("#tx_ruta").val(dato_original[5]);
			
			$("#tx_tarifa").val(dato_original[6]);
			$("#tx_act").val(dato_original[7]);
						
			$("#co_leer").attr("disabled", true);			
			
			fn_grilla($("#tx_cliente").val());
			
			var descrip = $.trim(dato_original[8]);
			descrip = descrip.split("*");

			//VALIDACIÓN DEL PROCESO DE FACTURACIÓN
			if(descrip[0]=="1")
			{
				fn_mensaje(descrip[1].toUpperCase(), g_tit, $(""));
				fn_solo_lectura();
				$("#co_excel").attr("disabled", false);	
			}
			else
			{
				$("#co_nuevo").attr("disabled", false);
				$("#co_eliminar_f").attr("disabled", false);
				
				$("#co_excel").attr("disabled", false);								
				
			}
				
			$("#tx_cliente").attr("disabled", true);			
			$("#co_cerrar").text("Cancelar");						
			
		});
		
	}
	
 //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
	function fn_accion()
	{

	if ($(this).text() == "Cancelar")
		{
			$("#DatosFijos div.fila1 > input").val("");
			$("#DatosFijos div.fila1 > textarea").val("");
			$grid.pqGrid( "sort", { sorter: []});
			$grid.pqGrid( "setSelection", {rowIndx:0} );
			$grid.pqGrid( "option", "dataModel.data", [] );
			$grid.pqGrid( "refreshView" );
			fn_habilita_control_grilla(true);
			fn_habilita_edicion();
			item_sel  = "";
		}
		else
			window.close();
	}
	
	
	//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	function fn_habilita_edicion()
	{
		$("#tx_cliente").attr("disabled", false);
		$("#co_leer").attr("disabled", false);
		$("#co_cerrar").attr("disabled", false);				
		$("#co_leer").text("Leer");
		$("#co_cerrar").text("Cerrar");		
		$("#tx_cliente").val('');
		$("#tx_cliente").prop("readonly", false);
		$("#tx_cliente").focus();
	}
	
	//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	function fn_habilita_control_grilla(sino)
	{
		$("#co_nuevo").attr("disabled", sino);
		$("#co_eliminar_f").attr("disabled", sino);
		$("#co_excel").attr("disabled", sino);
	}
	
	//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	function fn_solo_lectura()
	{
		$("#tx_cliente").attr("disabled", true);
		$("#co_leer").attr("disabled", true);
		$("#co_cerrar").attr("disabled", false);
		$("#co_cerrar").text("Cancelar");				
		$("#tx_cliente").prop("readonly", true);		
		
		$("#co_nuevo").attr("disabled", true);
		$("#co_eliminar_f").attr("disabled", true);
	}
	
	//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
	function fn_grilla(valor)
	{
		parameters = {
			"func":"fn_grilla",
			"empresa":$("#Empresa").val(),
			"RolFun":$("#RolFun").val(),
			"rol":$("#Rol").val(),
			"ip":$("#Ip").val(),
			"cliente":valor
		};
		
		cadena_json="";
		HablaServidor(my_url,parameters, "grid_variable", 'json', function(json) {		
			cadena_json = JSON.stringify(json.data);
			var sql_excel= JSON.stringify(json.sql);
			$("#sql").val(eval(sql_excel));	
		});
		
		$grid.pqGrid( "option", "dataModel.data", eval(cadena_json));
		$grid.pqGrid( "refreshDataAndView" );
		
	}
	
	//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
	function fn_limpiar()
	{
		$("#div_edit input").val("");
		$("#div_edit select").val("");
		$("#div_edit textarea").val("");
		$("#co_cancel span").text("Cerrar");		
	}
	
	//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
	function fn_guardar()
	{
	
		var flag_error = true;
		var valorSel2 = 0;
		var montof = 0;
		var vtotal = 0;
		
		parameters = {
						"func":"fn_ingresa",
						"empresa":$("#Empresa").val(),
						"RolFun":$("#RolFun").val(),
						"rol":$("#Rol").val(),
						"ip":$("#Ip").val(),
						"cliente":$("#tx_cliente").val(),
						"consumo":$("#tx_consumo").val(),
						"obs":$("#tx_obs").val()
					};									
				
		HablaServidor(my_url,parameters,false,'text', function(text) 
		{
			if($.trim(text)=="OK")
			{
				fn_mensaje("EL CONSUMO FUE AGREGADO!", g_tit, $("#tx_consumo"));
				
				$("#co_leer").attr("disabled", false);
				$grid.pqGrid( "refreshDataAndView" );
				flag_error = false;				
			}
			else
			{
				fn_mensaje("ERROR AL INGRESAR CARGO!", g_tit, $(""));
				flag_error = true;
			}
				
		});

		if (flag_error)
			return false;
		else
			return true;
	}
	
	
	//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	function fn_elimina_fila()
	{
		var flag_error = true;
		
		parameters = {
					"func":"fn_borrar",
					"empresa":$("#Empresa").val(),
					"RolFun":$("#RolFun").val(),
					"rol":$("#Rol").val(),
					"ip":$("#Ip").val(),
					"Auto":item_sel,
					"cliente":document.getElementById("tx_cliente").value,
					"obs":$("#tx_observatexto").val()
				};

	
        HablaServidor(my_url,parameters,false,"text", function(text) 
        {
            flag_error = false;
        });

        if (flag_error)
        return false;
        else
        return true;

	}
		
	//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
	function fn_excel()
	{
		var element =$grid.pqGrid("option","dataModel.data");
		if (element)
			a= element.length;
		else 
			a= 0;
		if(a>0){
			$("#filtro").val("Nic: "+document.getElementById('tx_cliente').value+" - "+$("#tx_nombre").val());

			$("#archfrExcel").submit();
		}
		else
        {
            fn_mensaje("NO HAY DATOS PARA EXPORTAR !", g_tit, $(""));
            return false;
        }
	}
	
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	//FILTRA CARACTERES SOLO SE ACEPTAN N?EROS
	function fn_texto_numerico(e)
	{	
		if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57))
			   return false;	
	}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
    //limita texto para que solo permita numeros y 2 decimales
    function fn_texto_decimal(e){
        if ((e.which < 48 || e.which > 57) && (e.which != 46) && (e.which != 8)) {
            return false;
        }else {
            var len   = this.value.length;
            var index = this.value.indexOf('.');

            if (index > 0 && e.which == 46) {
                return false;
            }

            if (index > 0) {
                var CharAfterdot = (len + 1) - index;
                if (CharAfterdot > 3) {
                return false;
                }
            }
        }

        return true;
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

