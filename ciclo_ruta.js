var g_modulo="Módulo de Recaudación";
var g_tit ="Recaudación Por Vigencia";
var $grid_principal
//var my_url = "recaudo_vigencia.asp";

$(document).ready(function() {
    
    // PARA ELIMINAR EL SUBMIT
	$("button").on("click", function(){return false;});

    //INGRESA LOS TITULOS
    document.title = g_tit ;
    
    $("#div_mod0").html(g_modulo);
    $("#div_tit0").html(g_tit );
    $("#tituloexcel").val(g_tit );
	$("#excel_archivo").val("recaudo_vigencia.xls");
	$("#Rol").val(fn_get_param("Rol"));

	$("#tx_empresa").val(fn_get_param("Empresa"));
	$("#tx_rol").val(fn_get_param("Rol"));
	$("#tx_rolfun").val(fn_get_param("RolFun"));
	$("#tx_ip").val(fn_get_param("Ip"));
    
    //DIBUJA LOS ICONOS DE LOS BOTONES     
    
    $("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");    
  
    $("#co_cerrar").on("click", function (e) {
        if($.trim($("#co_cerrar").text()) == "Cerrar")
            window.close(); 
    });    
	
	$("#co_ruta").on("click", function (e) {
		//fn_mensaje_boostrap("Debe elegir un Tipo de Identidad", g_tit, $(""));
		
		fn_abre_modal(); 
	});
	
	fn_setea_grid_prin();
	fn_carga_regional();

    $("#co_ruta").html("<span class='glyphicon glyphicon-plus'></span> Agregar Ruta");	
	
	//Eventos combo
	$("#cb_regional").on("change", function(evt) 
	{
		if($(this).val() =="")
			fn_limpiar();
		else{
			fn_carga_ciclo();
			$("#cb_ciclo").prop("disabled", false);
		}
	});	

	$("#cb_ciclo").on("change", function(evt) 
	{
		if($(this).val() =="")
			$("#co_leer").prop("disabled", true);
		else{
			$("#co_leer").prop("disabled", false);
		}
	});	
	
	
	
}); //fin ready


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_carga_regional()
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
	
	$("#cb_regional").html("<option value =''>  </option><option value='8100' selected>ARRAIJÁN</option><option value='1000'  >BOCAS DEL TORO</option><option value='4000'>CHIRIQUÍ</option><option value='2000'>COCLÉ</option><option value='3000'  >COLÓN</option><option value='6000'>HERRERA</option><option value='7000'>LOS SANTOS</option><option value='5000'  >PANAMÁ ESTE Y DARIEN</option><option value='8000'>PANAMÁ METRO</option><option value='8200'>PANAMÁ OESTE</option><option value='9000'>VERAGUAS</option>");
}


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_setea_grid_prin(){
	var data = [
        { c1: '1000', c2: '21', c3: '100', c4: 'DESCRIPCIÓN DE LA RUTA1'},
        { c1: '1000', c2: '21', c3: '150', c4: 'DESCRIPCIÓN DE LA RUTA2'},
        { c1: '1000', c2: '21', c3: '200', c4: 'DESCRIPCIÓN DE LA RUTA3'},
     
    ];
	var obj = {
				width: '100%',
				height: 360,
				showTop: true,
				showHeader: true,
				showTitle:false,
				collapsible:false,
				roundCorners: true,
				rowBorders: true,
				columnBorders: true,
				editable:false,
				selectionModel: { type: "row", mode:"single"},
				numberCell: { show: false },
				pageModel: { rPP: 20, type: "local", rPPOptions: [20, 50, 100]},
				scrollModel:{autoFit:true, theme:true},
				toolbar:
			   {
				   cls: "pq-toolbar-export",
				   items:
				   [
					   { type: "button", label: " Agregar Ruta",  attr:"id=co_ruta", cls:"btn btn-primary btn-sm"},
				   ]
			   }
			};

			obj.colModel = [
				{ title: "Regional",  resizable: false, width: 120, dataType: "string", dataIndx: "c1" },
				{ title: "Ciclo", width: 100, dataType: "string", dataIndx: "c2" },
				{ title: "Ruta", width: 100, dataType: "string", dataIndx: "c3" },
				{ title: "Descripción", width: 400, dataType: "string", dataIndx: "c4" },
				{ title: "Eliminar",width: 90, dataType: "string", align: "center", editable: false, minWidth: 100, sortable: false,
					render: function (ui) {
						return "<button class='btn btn-primary btn-sm'>Eliminar</button>";
					}
				}
			];

			obj.dataModel = { data: data };

	var grid = pq.grid("#div_grid", obj);
	
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_carga_ciclo(){
	$("#cb_ciclo").html("<option value =''></option><option value='100' selected>100</option><option value='150'  >150</option><option value='200'>200</option><option value='300'>300</option><option value='350'>350</option><option value='400'>400</option><option value='450'>450</option><option value='500' >500</option><option value='550'>550</option><option value='600'>600</option><option value='650'>650</option>");
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_limpiar(){
	$("#cb_ciclo").html("");
	$("#cb_ciclo").prop("disabled", true);
	$("#co_leer").prop("disabled", true);
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_abre_modal(){
    $("#dlg_ruta").modal({backdrop: "static",keyboard:false});
    $("#tx_tit_guardar").text("Datos de la ruta");
    $("#gr_ruta_tx").hide();
    $("#dlg_ruta").on("shown.bs.modal", function () {
        $("#cb_ruta").focus();
    });
} 




	