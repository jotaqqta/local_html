var datalimpio = [];
var datalimpio2 = [];
var datalimpio3 = [];
var $grid, $grid2, $grid3, $grid4;
var cadenajson;
var g_tit = "Documento de Ajuste";
var my_url = "";
var my_url1 = "forma_ajuste_datos.txt";  //cambiar el hablaservidor a POST lo coloque en GET para pruebas.
var my_url2 = "forma_ajuste_datos2.txt";

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
$(document).ready(function () {
	$(document).prop("title", "Documento de Ajuste");
    $("#Empresa").val(fn_get_par("Empresa"));	
	$("#CodEmpresa").val(fn_get_par("Empresa"));
	$("#Cliente").val(fn_get_par("Suministro"));
	$("#Rol").val(fn_get_par("Rol"));
	$("#lbl_orden").html(fn_get_par("Documento"));	
	
    $(".tit1").html("Documento de Ajuste - N° Cuenta: "+fn_get_par("Suministro")); 
    $("#btn_pdf" ).button({
		icons: {
			primary: "ui-icon-document"
		},
		label:"Pdf"
	});
	$("#btn_excel" ).button({
		icons: {
			primary: "ui-icon-disk"
		},
		label:"Excel"
	});
	$("#btn_cerrar" ).button({
		icons: {
			primary: "ui-icon-power"
		},
		label:"Cerrar"
	});
    
    $("#tabs").tabs({
		load: function( event, ui ) {},
		activate: function(event,ui) {
			var ix=ui.newTab.index();
			switch (ix) { 
			case 0:
				$("#grid1").pqGrid("refresh");
				break
			case 1:
				$("#grid2").pqGrid("refresh");
				break
			case 2:
				$("#grid3").pqGrid("refresh");
				break
			default:
				console.log(ix);
			}
		}
	});
    
    $( "#tabs" ).tabs();
    $( "#tabs" ).show();
    
    SetGridConfig();
	$( "#dialog-originales" ).dialog({
        autoOpen:false,
        modal: true,
        resizable: true,
        height: 280,
        title:"Cargos Originales",
        width: 660
	});	
        
    CargaDatos();
    
    $( "#btn_pdf" ).on("click",function() {
		var contenido = "<div style='text-align:center;'><br>Seleccione el tipo de impresión:<br><br>";
		tip_imp = "";
		contenido += "<form><div style='text-align:left;margin-left:40px'>";
		contenido += "<label><input type='checkbox' id='tip_imp_D' name='tip_imp_D' value='D' checked>Documentos</label><br><br>";
		contenido += "<label><input type='checkbox' id='tip_imp_C' name='tip_imp_C' value='C' checked>Cargos</label>";
		contenido += "</div></form>";
		contenido += "<br>&nbsp;<br></div>";
		$("#dialog-pdf").html(contenido);
		$("#dialog-pdf" ).dialog({
			modal: true,
			resizable: true,
			//height: 150,
			title:"Exportar a PDF",
			//width: 400,
			buttons: {
				Aceptar: function() {					
					if($('#tip_imp_D').is(":checked") && $('#tip_imp_C').is(":checked") ){
						tip_imp = "T";
					}
					else if($('#tip_imp_D').is(":checked")){
						tip_imp = "D";
					}
					else if($('#tip_imp_C').is(":checked")){
						tip_imp = "C";
					}
					
					if(tip_imp != ""){
						parameters = {
							"Empresa":$("#CodEmpresa").val(),
							"Suministro":$("#Cliente").val(),
							"nrodoc":$("#lbl_orden").html(),
							"cor_doc":$("#CorDocumento").val(),
							"tip_imp":tip_imp,
							"Rol":$("#Rol").val()
						};
						$( this ).dialog( "close" );
						vAncho = screen.availWidth;
						vAlto = screen.availHeight;
						var param = jQuery.param( parameters );
						var miVentana =  window.open("Documento.asp?"+param,"_blank","menubar=no,toolbar=no,resizable=yes,width=800,height=600,left=0,top=0,scrollbars=yes");
						miVentana.moveTo(0,0);
						miVentana.resizeTo(vAncho,vAlto);
					}
					else{
						fn_mensaje("<br>Debe seleccionar un tipo de impresión.", g_tit, $(""));
					}
				},
                Cancelar: function() {	
                    $( this ).dialog( "close" );
                }
			}
		});
		
	});
    
    $( "#btn_excel" ).on("click",function() {
        var fila;
        var vDatos = "";
		var data = $grid2.pqGrid( "option" , "dataModel.data");
		$grid2.pqGrid( "exportData", { format: 'json' } );
        //exportToExcel();
		//$("#grid1").pqGrid("exportExcel", { url: "aconsum_0004b_xls.asp", sheetName: "pqGrid sheet" });
		/*for (var i in data){
            fila = data[i];
			vDatos += fila["c1"] + "|" + fila['c2']+ "|" + fila['c3'] + "#"
		}
		$("#tx_datos_gri").val(vDatos);
		$("#frm_excel").submit();*/
	});
    
    $( "#btn_cerrar" ).on("click",function() {
		window.close();
	});
    
	$( "#tabs" ).tabs();
});

function exportToExcel(){
    var htmls = "";
    var index = $('#tabs a[href="#tabs-2"]').parent().index();
    $( "#tabs" ).tabs("option", "active", index);
    var uri = 'data:application/vnd.ms-excel;base64,';
    var template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'; 
    var base64 = function(s) {
        return window.btoa(unescape(encodeURIComponent(s)))
    };

    var format = function(s, c) {
        return s.replace(/{(\w+)}/g, function(m, p) {
            return c[p];
        })
    };
    
    //var x = $("#grid2");
    htmls = "<tr>"+$("#grid2 .pq-grid-title-row").html()+"</tr>";
    htmls += $("#grid2 .pq-grid-row").prop("outerHTML");

    var ctx = {
        worksheet : 'Worksheet',
        table : htmls
    }


    var link = document.createElement("a");
    link.download = "export.xls";
    link.href =  + base64(format(template, ctx));
    link.click();
}


function descargarExcel(){
    //Creamos un Elemento Temporal en forma de enlace
    var tmpElemento = document.createElement('a');
    // obtenemos la información desde el div que lo contiene en el html
    // Obtenemos la información de la tabla
    var data_type = 'data:application/vnd.ms-excel';
    var tabla_div = document.getElementById('tblReporte');
    var tabla_html = tabla_div.outerHTML.replace(/ /g, '%20');
    tmpElemento.href = data_type + ', ' + tabla_html;
    //Asignamos el nombre a nuestro EXCEL
    tmpElemento.download = 'Nombre_De_Mi_Excel.xls';
    // Simulamos el click al elemento creado para descargarlo
    tmpElemento.click();
}

function CargaDatos()
{
	var datos = [];
    var estado_ajuste = "";
	var parameters = {
		"func":"DatosAjuste",
		"Empresa":$("#CodEmpresa").val(),
		"Suministro":$("#Tx_Cliente").val(),
		"Orden":$("#nroOrden").val(),
        "rol":$("#Rol").val()
	};
    
    HablaServidor(my_url1,parameters,'text', function(text) 
	{
		datos = $.trim(text);
		datos = datos.split("|");
		
		$("#lbl_fecha").html(datos[0]);
        $("#lbl_ingresado").html(datos[1]);
        $("#lbl_aprobado").html(datos[2]);
        $("#lbl_motivo").html(datos[3]);
		$("#CorDocumento").val(datos[4]);
		estado_ajuste = datos[5];
	});
	
    if(estado_ajuste != "A"){
		fn_mensajeFinal("<br>El documento no se encuentra aprobado.",g_tit);
	}
    
    else{
        parameters = {
			"func":"DatosPersonal",
			"Empresa":$("#CodEmpresa").val(),
			"Suministro":$("#Cliente").val(),
			"CorDocumento":$("#CorDocumento").val(),
			"rol":$("#Rol").val()
		};

        HablaServidor(my_url2,parameters,'text', function(text) 
		{
            datos = $.trim(text);
            datos = datos.split("|");
            $("#lbl_nombre").html(datos[0]);
            $("#lbl_direccion").html(datos[1]);
            $("#lbl_estado").html(datos[2]);
            $("#lbl_conexion").html(datos[3]);
            $("#lbl_regional").html(datos[4]);
            $("#lbl_ruta").html(datos[5]);
            $("#lbl_tarifa").html(datos[6]);
            $("#lbl_actividad").html(datos[7]);
        });
        
        parameters = {
			"datagrid":1,
			"Empresa":$("#CodEmpresa").val(),
			"Suministro":$("#Cliente").val(),
			"Orden":$("#lbl_orden").html(),
			"CorDocumento":$("#CorDocumento").val(),
			"rol":$("#Rol").val()
		};
		
		cadenajson="";
		HablaServidor("forma_ajuste_datos_doc.json",parameters,'text', function(text) 
		{
			$(".pq-loading").hide();
			try{
				$grid.pqGrid( "option", "dataModel.data", eval(text));
				$grid.pqGrid( "refreshDataAndView" );
			}
			catch(err) {
				console.log("Error en el formato de la cadena de respuesta grid 1");
				$grid.pqGrid( "option", "dataModel.data", [] );
				$grid.pqGrid( "refreshDataAndView" );
			}		
		});

        cadenajson="";
		parameters = {
			"datagrid":2,
			"Empresa":$("#CodEmpresa").val(),
			"Suministro":$("#Cliente").val(),
			"Orden":$("#lbl_orden").html(),
			"CorDocumento":$("#CorDocumento").val(),
			"rol":$("#Rol").val()
		};
		HablaServidor("forma_ajuste_datos_car.json",parameters,'text', function(text) 
		{
			$(".pq-loading").hide();
			try{
				$grid2.pqGrid( "option", "dataModel.data", eval(text));
				$grid2.pqGrid( "refreshDataAndView" );
			}
			catch(err) {
				console.log("Error en el formato de la cadena de respuesta grid 2");
				$grid2.pqGrid( "option", "dataModel.data", [] );
				$grid2.pqGrid( "refreshDataAndView" );
			}
		});
        
        cadenajson="";
		parameters = {
			"datagrid":3,
			"Empresa":$("#CodEmpresa").val(),
			"Suministro":$("#Cliente").val(),
			"Orden":$("#lbl_orden").html(),
			"CorDocumento":$("#CorDocumento").val(),
			"rol":$("#Rol").val()
		};
		HablaServidor("forma_ajuste_datos_obs.json",parameters,'text', function(text) 
		{
			$(".pq-loading").hide();
			try{
				$grid3.pqGrid( "option", "dataModel.data", eval(text));
				$grid3.pqGrid( "refreshDataAndView" );
			}
			catch(err) {
				console.log("Error en el formato de la cadena de respuesta grid 3");
				$grid3.pqGrid( "option", "dataModel.data", [] );
				$grid3.pqGrid( "refreshDataAndView" );
			}
		});
        
    }//fin else
    
}//fin ready

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function CargosOriginales(CorDocu,Empresa,Cliente)
{
    $( "#dialog-originales" ).dialog("open");
    cadenajson="";	
	$grid4.pqGrid( "refreshDataAndView" );
	cadenajson="";
	parameters = {
		"datagrid":4,
		"Empresa":$("#CodEmpresa").val(),
		"Suministro":$("#Cliente").val(),
		"CorDocumento":CorDocu,
		"rol":$("#Rol").val()
	};
	HablaServidor("forma_ajuste_datos_ori.json",parameters,'text', function(text) 
	{
		$(".pq-loading").hide();
		try{
			$grid4.pqGrid( "option", "dataModel.data", eval(text));
			$grid4.pqGrid( "refreshDataAndView" );
		}
		catch(err) {
			console.log("Error en el formato de la cadena de respuesta grid 4");
			$grid4.pqGrid( "option", "dataModel.data", [] );
			$grid4.pqGrid( "refreshDataAndView" );
		}
	});
    
}

function SetGridConfig()
{
	//GRID #1/////////////////////////////////////////////////
    var obj = {
        width:850,
		height:260,
		title:"Documentos Afectados",
		rowBorders:true,
        editable: false,
		hwrap:false,
		wrap:false,
		collapsible: { on : false,toggle:false },
		stripeRows : false,
        colModel:
        [
            { title: "Tipo", width: 100, dataIndx:"c1" },
            { title: "N° Documento", width: 120, align: "left", dataIndx:"c2" },
			{ title: "Periodo", width: 126, align: "left", dataIndx:"c3" },
            { title: "Emisión", width: 90, dataIndx:"c4" },
            { title: "Importe", width: 100, align: "right", dataIndx:"c5" },
			{ title: "Tarifa", width: 280, align: "left", dataIndx:"c6" },
			{ title: "CorDoc", width: 0, align: "left", dataIndx:"c7", hidden:true }			
        ],
        dataModel: {
			data: [],
			paging: "local",
            location: "local",
            sorting: "local",
            sortDir: "up"
        },
        selectionModel: { type: 'row',mode:'single'}		
    };
	$grid = $("#grid1").pqGrid(obj);
	$grid.pqGrid( "option", "showBottom", false );
	
	$grid.pqGrid({
        rowDblClick: function( event, ui ) {
            if (ui.rowData) {
                var dataCell = ui.rowData;
                CargosOriginales(dataCell.c7,$("#CodEmpresa").val(),$("#Cliente").val())
            }
            //$("#Tx_oculto").focus();
        }
    });
	
	//GRID #2/////////////////////////////////////////////////
    var obj2 = {
        width:850,
		height:260,
		title:"Cargos Ajustados",
		rowBorders:true,
        editable: false,
		hwrap:false,
		wrap:false,
		collapsible: { on : false,toggle:false },
		stripeRows : false,
        colModel:
        [
            { title: "Periodo", width: '30%', dataIndx:"c1" },
            { title: "Descripción", width: '50%', dataIndx:"c2" },
			{ title: "Valor Ajuste", width: '20%', align: "right", dataIndx:"c3" },
			{ title: "Correlativo", width: '0%', align: "right", dataIndx:"c4", hidden:true },
			{ title: "Orden Impresión", width: '0%', align: "right", dataIndx:"c5", hidden:true }
        ],		
        dataModel: {
            data: [],
			paging: "local",
            location: "local",
            sorting: "local",
            sortDir: "up"
        },
        selectionModel: { type: 'row',mode:'single'}		
    };	
	
	$grid2 = $("#grid2").pqGrid(obj2);
	$grid2.pqGrid( "option", "showBottom", false );
	
	//GRID #3/////////////////////////////////////////////////
    var obj3 = {
        width:850,
		height:260,
		title:"Observaciones",
		rowBorders:true,
        editable: false,
		collapsible: { on : false,toggle:false },
		stripeRows : false,
        colModel:
        [
            { title: "Fecha Ingreso", width: '20%', dataIndx:"c1" },
	        { title: "Nombre", width: '30%', dataIndx:"c2" },
			{ title: "Observación", width: '50%', align: "left", dataIndx:"c3" }
        ],		
        dataModel: {
            data: [],
			paging: "local",
            location: "local",
            sorting: "local",
            sortDir: "up"
        },
        selectionModel: { type: 'row',mode:'single'}		
    };
	
	$grid3 = $("#grid3").pqGrid(obj3);
	$grid3.pqGrid( "option", "showBottom", false );
	$( "#grid3" ).pqGrid( "option", "scrollModel", {horizontal: true } );
    
    var obj4 = {
		rowBorders:true,
        editable: false,
        height: '100%',
        showTop:false,
        showBottom:false,
		pageModel: {type:"local", rPP: 500, rPPOptions: [100, 200, 500]},
		collapsible: { on : false,toggle:false },
		stripeRows : false,
        colModel:
        [
            { title: "Periodo", width: '20%', dataIndx:"c1" },
			{ title: "Cargo", width: '10%', dataIndx:"c2" },
			{ title: "Descripción", width: '50%', dataIndx:"c3" },
            { title: "Valor", width: '20%', align: "right", dataIndx:"c4" }
        ],		
        dataModel: {
			data: [],
			paging: "local",
            location: "local",
            sorting: "local",
            sortDir: "up"
        },
        selectionModel: { type: 'row',mode:'single'}		
    };
	
	$grid4 = $("#grid_originales").pqGrid(obj4);
    
}//fin setea grilla

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
 function fn_mensajeFinal(p_mensaje, p_titulo)
{
    
    $("#lb_mensaje").html(p_mensaje);
        
    $( "#dialog-message" ).dialog({
        title:p_titulo,
        modal: true,
        buttons: {
            Ok: function() {
				$( this ).dialog( "close" );
				window.close();
            }
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
function HablaServidor(servidor,parametros,tipofile,CallBack)
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