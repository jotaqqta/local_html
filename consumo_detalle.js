var g_tit = "";
var my_url = "consumo_detalle.json";
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
        pageModel: { rPP: 500, type: "local", rPPOptions:[200,300,500]},
        title: g_tit,
        hwrap:true,
        wrap:false,
        toolbar: {
            cls: 'pq-toolbar-export',
            items: [			
                { type: 'button', label: 'PDF', icon: 'ui-icon-disk', attr:'id=co_pdf'},
                { type: 'button', label: 'Excel', icon: 'ui-icon-disk', attr:'id=co_excel'},
                { type: 'button', label: 'Cerrar', icon: 'ui-icon-power', attr:'title=Cerrar&nbsp;Ventana', attr:'id=co_cerrar' }
            ]
        }
	};

	obj.colModel = [
        { title: "Evento", dataType: "string", width: 140, dataIndx: 'c1',  align: "left", halign: "center"},
        { title: "Fecha", dataType: "string", width: 120, dataIndx: 'c2', align: "center", halign: "center"},
        { title: "Lector", dataType: "string", width: 200, dataIndx: 'c3', align: "left", halign: "center"},
        { title: "N° Medidor", dataType: "string", width: 100, dataIndx: 'c4', align: "left", halign: "center"},
        { title: "Marca", dataType: "string", width: 60, dataIndx: 'c5', align: "left", halign: "center"},
        { title: "Diámetro", dataType: "string", width: 80, dataIndx: 'c6', align: "left", halign: "center"},
        { title: "Lectura Terreno", dataType: "string", width: 90, dataIndx: 'c7', align: "right", halign: "center"},
        { title: "Lectura Facturación", dataType: "string", width: 90, dataIndx: 'c8', align: "right", halign: "center"},
        { title: "Consumo", dataType: "string", width: 80, dataIndx: 'c9', align: "right", halign: "center"},
		{ title: "Medida", dataType: "string", width: 80, dataIndx: 'c10', align: "left", halign: "center"},
        { title: "Clave Lectura", dataType: "string", width: 180, dataIndx: 'c11', align: "left", halign: "center"},
        { title: "Irregularidad", dataType: "string", width: 120, dataIndx: 'c12', align: "left", halign: "center"},
        { title: "Observación", dataType: "string", width: 300, dataIndx: 'c13', align: "left", halign: "center"}
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
function fn_carga_grilla()
{
    var parameters = 
	{
		'func':'fn_grilla',
		'cliente':$("#tx_cliente").val(),
		'empresa':$("#tx_empresa").val(),
		'rol':$("#Rol").val()
	};
	cadenajson="";
	HablaServidor(my_url,parameters, "grid_roles", 'json', function(json) {		
        cadenajson = JSON.stringify(json.data);
        var sql_excel= JSON.stringify(json.sql);
        $("#sql").val(eval(sql_excel));	
	});
	
	$grid.pqGrid( "option", "dataModel.data", eval(cadenajson));
	$grid.pqGrid( "refreshDataAndView" );
}



//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_Cerrar()
{
	window.close();
}
	

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
 $(document).ready(function() {

	//Parámetros
	g_tit = "Historial de Mediciones";
	document.title = g_tit;
	$("#tituloexcel").val(g_tit);
	$("#excel_archivo").val("detalle_consumo.xls");
	
	$("#tx_empresa").val(fn_get_par("Empresa"));
	$("#tx_cliente").val(fn_get_par("Suministro"));
	$("#Rol").val(fn_get_par("Rol"));
	$("#tx_rol_fun").val(fn_get_par("RolFun"));
	$("#tx_ip").val(fn_get_par("Ip"));
	     
	fn_Setea_Grilla();
	$("#co_cerrar").on("click", fn_Cerrar);	
		
    $("#Co_cerrar").click(function (evt,ui) {
		window.close();
    });
	     
    fn_carga_grilla();
	
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
	
	$("#co_pdf").on('click', function (e) {
		var element =$grid.pqGrid("option","dataModel.data");
		if (element)
			a= element.length;
		else 
			a= 0;
		if(a>0){
			parameters = {
				"Empresa":$("#tx_empresa").val(),
				"Suministro":$("#tx_cliente").val(),
				"Rol":$("#Rol").val()
			};
			vAncho = screen.availWidth;
			vAlto = screen.availHeight;
			var param = jQuery.param( parameters );
			var miVentana =  window.open("hist_mediciones.asp?"+param,"_blank","menubar=no,toolbar=no,resizable=yes,width="+vAncho+",height="+vAlto+",left=0,top=0,scrollbars=yes");
			miVentana.moveTo(0,0);
			miVentana.resizeTo(vAncho,vAlto);
			return;
		}
		e.preventDefault();		
    });
	
	
	
	var colModel=$( "#grid_principal" ).pqGrid( "option", "colModel" );
	var cabecera = "";
	for (i=0; i< colModel.length; i++){
		if(colModel[i].hidden != true) cabecera += "<th>"+colModel[i].title+ "</th>";
	}
	$("#excel_cabecera").val(cabecera);
	
 });