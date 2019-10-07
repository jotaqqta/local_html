var g_modulo="Facturación Clientes - Lecturas y Consumos";
var g_titulo="Consulta Historica de Eventos de Cambio de Medidor";
var parameters={};
var my_url="reasigna_ajuste.asp";
var $grid;
var $grid_2;

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
$(document).keydown(function(e){

	if (e.keyCode === 8 ) {
		var element = e.target.nodeName.toLowerCase();
		if ((element != 'input' && element != 'textarea') || $(e.target).attr("readonly")) {
			return false;
		}
	}
});

$(document).ready(function(){
    
    // PARA ELIMINAR EL SUBMIT
	$("button").on("click", function(){return false;});
    //INGRESA LOS TITULOS
    document.title = g_titulo ;
	document.body.scroll = "yes";
    $("#div_header").load("/syn_globales/header.htm", function() {
		$("#div_mod0").html(g_modulo);
		$("#div_tit0").html(g_titulo);	
	});
		

	$("#tx_num").focus();
	$("#tx_num").focus();
	jQuery('#tx_num').keypress(function(tecla) {
        if(tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
	
	$("#tx_num").on("keydown", function(event) {
        var tecla =  event.which || event.keyCode;
        if(tecla==13)
        {
			if(!$("#tx_num").prop("readonly"))
			{	
				$("#co_leer").trigger( "click" );
				return false;
			}
        }
    });
	//Footer
	$("#div_footer").load("/syn_globales/footer.htm");
  //DEFINE LA GRILLA PRINCIPAL
    fn_setea_grid_principal();
    //DIBUJA LOS ICONOS DE LOS BOTONES     
    
  //DIBUJA LOS ICONOS DE LOS BOTONES     
    $("#co_filtro").html("<span class='glyphicon glyphicon-search'></span> Filtros");
    $("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");
    $("#co_volver_2").html("<span class='glyphicon glyphicon-chevron-left'></span> Volver");
    $("#co_volver_3").html("<span class='glyphicon glyphicon-chevron-left'></span> Volver");
    $("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");  
    
    


    
    $("#co_leer").on("click", function(){
		//Validación de informacion
     if ($.trim($("#co_leer").text())=="Leer"){
			if( $("#tx_num").val() == ""){
				fn_mensaje_boostrap("DIGITE EL NÚMERO DE SUMINISTRO", g_titulo, $("#tx_num"));
				return;
                
			}else{

            	fn_leer()
            	$("#tx_num").prop("disabled",true);
				$("#tx_num").focus();  
				$("#co_leer").prop("disabled",true);              
            }

			
			$("#co_cancelar").html("<span class='glyphicon glyphicon-log-out'></span> Cancelar");
		
          }
    });
  
    $("#tx_num").bind("keydown",function(e){
		if(e.keyCode == 13){
			tab = true;
			fn_leer();
			return false;
		}
	 });

	$("#co_cancelar").on("click",function(){
		if ($.trim($("#co_cancelar").text())=="Cancelar"){
			$("#co_leer").html("<span class='glyphicon glyphicon-search'></span> Leer");
			$("#co_cancelar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");			     
			$("#co_leer").prop("disabled",false);  
			fn_limpiar();  

			return;
		}
		else
			window.close();
	});
	

    $("#co_cancel_2").on("click", function() {
		$('#div_filtro_bts').modal('hide');
    });

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
$("._input_selector").inputmask("dd/mm/yyyy");


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	


$grid.pqGrid({
	rowDblClick: function fn_sss(event, ui) {
		if (ui.rowData) {
		  
	
         	$("#div_filtro_bts").modal({backdrop: "static",keyboard:false});
			$("#div_filtro_bts").on("shown.bs.modal", function () {
			$("#div_filtro_bts div.modal-footer button").focus();
			});
			
		}
			



	}
});

$("#div_filtro_bts").draggable({
	handle: ".modal-header"
});


});
function fn_setea_grid_principal()
{ 

	data= [
		{ C1: '1', C2: '19778', C3: 'PREVENTIVO', C4: '10-03-2013 07:02:30', C5:'FINALIZADA', C6: "INSTALACIÓN MASIVA", C7: "", C8: 'ORDEN INSTALACIÓN EJECUTATIVA', C9: 'INSTALACIÓN DE MEDIDOR', C10: 'IDAAN 8000', C10: 'ENERCOM', C11:'ZDIAZ',C12:'PM GT INSTALACIÓN Y RETIRO',C13:'SIN ENVIO',C14:'SIN ENVIO',C15:'AUTORIZACIÓN'},
	];
    var obj = {
    title: "Ordenes de cambio",
	showTop: true,
	showBottom:true,
	showTitle : true,
	roundCorners: true,
	rowBorders: true,
	columnBorders: true,
	collapsible:true,
	editable:false,
	numberCell: { show: false },
	pasteModel: { on: false },
	selectionModel: { type: 'row',mode:'single'},
	numberCell: { show: true, align: "center" },
	height: 300,
	width: "100%",
	toolbar: {
		items: [
		{	 type: "button", label: "Excel", attr:"id=co_excel2", cls:"btn btn-primary btn-sm"}
	]
	},
	editModel: {
		clicksToEdit: false,
		keyUpDown: false,
		pressToEdit: false,
		cellBorderWidth: 0
	},
	scrollModel:{theme:true},
	pageModel: { rPP: 200, type: "local", rPPOptions: [100, 200, 500]},
	colModel:
	[
	
		{ title: "Correlativo",  resizable: false, width: 78, dataType: "number", dataIndx: "C1",align:"center" },
		{ title: "Nro Orden", width: 160, dataType: "number", dataIndx: "C2", align:"center" },
		{ title: "Tipo Cambio", width: 240, dataType: "string", dataIndx: "C3",halign:"center", align:"lefth" },
		{ title: "Fecha Creación", width: 120, dataType: "number", dataIndx: "C4",halign:"center", align:"lefth"},
		{ title: "Estado",width: 120, dataType: "string", dataIndx: "C5",halign:"center", align:"center"},
		{ title: "Motivo",width: 200, dataType: "string", dataIndx: "C6",halign:"center", align:"center"}, 
		{ title: "Clave Lectura Cambio",width: 200, dataType: "number", dataIndx: "C7",halign:"center", align:"right"},
		{ title: "Situación Encontrada",width: 200, dataType: "string", dataIndx: "C8",halign:"center", align:"center"},
		{ title: "Acción Realizada",width: 200, dataType: "string", dataIndx: "C9",halign:"center", align:"center"},
		{ title: "Contratista",width: 200, dataType: "string", dataIndx: "C10",halign:"center", align:"center"},
		{ title: "Inspector Ejecutor",width: 200, dataType: "string", dataIndx: "C11",halign:"center", align:"center"},
		{ title: "Usuario Creación Oficina Cambio",width: 300, dataType: "string", dataIndx: "C12",halign:"center", align:"center"},
		{ title: "Oficina Cambio",width: 300, dataType: "string", dataIndx: "C12",halign:"center", align:"center"},
		{ title: "Envio Carta",width: 150, dataType: "string", dataIndx: "C13",halign:"center", align:"center"},  
		{ title: "Autorización Cliente",width: 200, dataType: "string", dataIndx: "C14",halign:"center", align:"center"},   	
		{ title: "Motivo",width: 200, dataType: "string", dataIndx: "C15",halign:"center", align:"center"}  	
	],
	dataModel: {
		data: data
	}
};
$grid = $("#div_grid_pri").pqGrid(obj);



data2= [
	{ C1: '1', C2: '19778', C3: 'PREVENTIVO', C4: '10-03-2013 07:02:30', C5:'FINALIZADA', C6: "INSTALACIÓN MASIVA", C7: "", C8: 'ORDEN INSTALACIÓN EJECUTATIVA', C9: 'INSTALACIÓN DE MEDIDOR', C10: 'IDAAN 8000', C10: 'ENERCOM', C11:'ZDIAZ',C12:'PM GT INSTALACIÓN Y RETIRO',C13:'SIN ENVIO',C14:'SIN ENVIO',C15:'AUTORIZACIÓN'},
	{ C1: '1', C2: '19778', C3: 'PREVENTIVO', C4: '10-03-2013 07:02:30', C5:'FINALIZADA', C6: "INSTALACIÓN MASIVA", C7: "", C8: 'ORDEN INSTALACIÓN EJECUTATIVA', C9: 'INSTALACIÓN DE MEDIDOR', C10: 'IDAAN 8000', C10: 'ENERCOM', C11:'ZDIAZ',C12:'PM GT INSTALACIÓN Y RETIRO',C13:'SIN ENVIO',C14:'SIN ENVIO',C15:'AUTORIZACIÓN'},
	{ C1: '1', C2: '19778', C3: 'PREVENTIVO', C4: '10-03-2013 07:02:30', C5:'FINALIZADA', C6: "INSTALACIÓN MASIVA", C7: "", C8: 'ORDEN INSTALACIÓN EJECUTATIVA', C9: 'INSTALACIÓN DE MEDIDOR', C10: 'IDAAN 8000', C10: 'ENERCOM', C11:'ZDIAZ',C12:'PM GT INSTALACIÓN Y RETIRO',C13:'SIN ENVIO',C14:'SIN ENVIO',C15:'AUTORIZACIÓN'}
	


];

var obj = {
    title: "Historicos de envios",
	showTop: true,
	showBottom:true,
	showTitle : true,
	roundCorners: true,
	rowBorders: true,
	columnBorders: true,
	collapsible:true,
	editable:true,
	numberCell: { show: false },
	pasteModel: { on: false },
	selectionModel: { type: 'row',mode:'single'},
	numberCell: { show: true, align: "center" },
	height: 300,
	width: "100%",
	toolbar: {
		items: [
		{	 type: "button", label: "Excel", attr:"id=co_excel2", cls:"btn btn-primary btn-sm"}
	]
	},
	editModel: {
		clicksToEdit: false,
		keyUpDown: false,
		pressToEdit: false,
		cellBorderWidth: 0
	},
	scrollModel:{theme:true},
	pageModel: { rPP: 200, type: "local", rPPOptions: [100, 200, 500]},
	colModel:
	[
		{ title: "Etapa Origen",  resizable: false, width: 78, dataType: "number", dataIndx: "C1",align:"center" },
		{ title: "Evento", width: 160, dataType: "number", dataIndx: "C2", align:"center" },
		{ title: "Etapa destino", width: 240, dataType: "string", dataIndx: "C3",halign:"center", align:"lefth" },
		{ title: "Emisor", width: 120, dataType: "number", dataIndx: "C4",halign:"center", align:"lefth"},
		{ title: "Receptor",width: 120, dataType: "string", dataIndx: "C5",halign:"center", align:"center"},
		{ title: "Estado",width: 200, dataType: "string", dataIndx: "C6",halign:"center", align:"center"}, 
		{ title: "Fecha inicio",width: 200, dataType: "number", dataIndx: "C7",halign:"center", align:"right"},
		{ title: "Fecha vencimiento etapa",width: 200, dataType: "string", dataIndx: "C8",halign:"center", align:"center"},
		{ title: "Fecha termino",width: 200, dataType: "string", dataIndx: "C9",halign:"center", align:"center"}
  	
	],
	dataModel: {
		data: data2
	}
};
$grid_2 = $("#div_grid_sec").pqGrid(obj);
$grid_2.pqGrid("refreshView");

}

function fn_carga_orden()
{
	
}


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_leer(){
	if ($.trim($("#co_leer").text()) == "Leer")
	{   
	    $("#tx_nom").val("Maria");
	    $("#tx_regi").val("Ciudad de Panamá");
	    $("#tx_dir").val("Cra 12a no 32 a este");
        $('#tx_loc').val("Panamá Metro");
	    $("#tx_est").val("Activo");
	    $("#tx_ruta").val("8000-01-244");
	    $("#tx_tarif").val("Residencial");
	    $("#tx_fec").val(12042019);
		$("#chk_cli_gran").prop("checked", true);
		
	}
}
function fn_carga_grilla(){

	$grid_2.pqGrid("refreshView");
}




function fn_limpiar(){
	$("#tx_num").val("")
	$("#tx_nom").val("");
	$("#tx_regi").val("");
	$("#tx_dir").val("");
	$('#tx_loc').val("");
	$("#tx_est").val("");
	$("#tx_ruta").val("");
	$("#tx_tarif").val("");
	$("#tx_fec").val("");
    $("#tx_num").prop("disabled",false);
	$("#tx_num").focus();
	$("#chk_cli_gran").prop("checked", false);
	$("#chk_cli_norm").prop("checked", false);
	


}
	