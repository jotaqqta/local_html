var g_modulo = "Facturación de Clientes";
var g_tit = "Mantención de Tipos de Vencimientos";
var $grid_principal;
var $grid_2;
var $grid_ruta;
var parameters = {};
var Filtros = [];
var sql_grid_prim = "";
var sql_grid_dos = "";
var sql_grid_3 = "";
var periodo_fil;
var regional_fil;
var ciclo_fil;
var ruta_fil;
var my_url = "con_lec_reg_cic.asp";

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
    
	$("#div_header").load("syn_globales/header.htm", function() {
		$("#div_mod0").html(g_modulo);
		$("#div_tit0").html(g_tit);	
	});
	
	$("#excel_archivo").val("Clientes_Medidos_Ciclo_Ruta.xls");
	
	$("#form_info").hide();
    //DEFINE LA GRILLA PRINCIPAL
    fn_setea_grid_principal();

    $("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");
    $("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");

    //EVENTO BOTONES    
    $("#co_cerrar").on("click", function (e) {
        window.close(); 
    });    

	$("#co_close").on("click", function (e) {
        $('#div_filtro_bts').modal('hide'); 		
    });
	
	//MODIFICA REGISTRO
	$("#co_modificar").on("click", function (e) {
		if($("#tx_descripcion").val() == ""){
			alert("Debe digitar la descripcion");
			$("#tx_descripcion").focus();
			return;
		}

		if($("#tx_dias_plazo").val() == ""){
			alert("Debe digitar los dias de plazo");
			$("#tx_dias_plazo").focus();
			return;
		}

		if($("#tx_dias_corte").val() == ""){
			alert("Debe digitar los dias para corte");
			$("#tx_dias_corte").focus();
			return;
		}

		if($("#tx_dias_notifi").val() == ""){
			alert("Debe digitar los dias para notificacion");
			$("#tx_dias_notifi").focus();
			return;
		}
		alert("Se modifico el registro correctamente.");
		$('#div_filtro_bts').modal('hide');
    });

	//ACTIVA O DESACTIVA REGISTRO
	$("#co_activar").on("click", function (e) {

		if($("#tx_descripcion").val() == ""){
			alert("Debe digitar la descripcion");
			$("#tx_descripcion").focus();
			return;
		}

		if($("#tx_dias_plazo").val() == ""){
			alert("Debe digitar los dias de plazo");
			$("#tx_dias_plazo").focus();
			return;
		}

		if($("#tx_dias_corte").val() == ""){
			alert("Debe digitar los dias para corte");
			$("#tx_dias_corte").focus();
			return;
		}

		if($("#tx_dias_notifi").val() == ""){
			alert("Debe digitar los dias para notificacion");
			$("#tx_dias_notifi").focus();
			return;
		}

		if($("#tx_cod_estado").val() == "A"){
			alert("Se desactivo el registro.");
		}else{
			alert("Se activo el registro.");
		}  		
		
		$('#div_filtro_bts').modal('hide');
    });      

    //EVENTO DBL_CLICK DE LA GRILLA
    $grid_principal.pqGrid({
		rowDblClick: function( event, ui ) {
			if (ui.rowData) 
				{
					fn_Muestra_modal();
					var dataCell = ui.rowData;
					var var_domin = dataCell.C6;
					var var_sabad = dataCell.C7;

					jQuery('#tx_dias_plazo').keypress(function(tecla) {
						if(tecla.charCode < 48 || tecla.charCode > 57) return false;
					});

					jQuery('#tx_dias_corte').keypress(function(tecla) {
				        if(tecla.charCode < 48 || tecla.charCode > 57) return false;
				    });

					jQuery('#tx_dias_notifi').keypress(function(tecla) {
					if(tecla.charCode < 48 || tecla.charCode > 57) return false;
					});

					//CARGA DATOS EN EL MODAL
					$("#tx_vencimiento").val(dataCell.C1);
					$("#tx_descripcion").val(dataCell.C2);
					$("#tx_dias_plazo").val(dataCell.C3);
					$("#tx_dias_corte").val(dataCell.C4);
					$("#tx_dias_notifi").val(dataCell.C5);
					$("#tx_estado").val(dataCell.C8);
					$("#tx_cod_estado").val(dataCell.C9);

					if(var_domin == "SI"){
						$("#ch_domingos").prop("checked", true);	
					}else{						
						$("#ch_domingos").prop("checked", false);	
					}

					if(var_sabad == "SI"){
						$("#ch_sabados").prop("checked", true);
					}else{
						$("#ch_sabados").prop("checked", false);
					}

					if(dataCell.C9 == "A"){
						$("#co_activar").html("<span class='glyphicon glyphicon-remove'></span> Desactivar");  
					}else{
						$("#co_activar").html("<span class='glyphicon glyphicon-ok'></span> Activar");  
					}    					
				}
			}
	});

	$("#div_filtro_bts").draggable({
        handle: ".modal-header"
    });
	    
	$("#co_excel").on("click", function (e) {
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
});
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_setea_grid_principal()
{     
	var data =  [
		  { C1: '1', C2: 'NORMAL', C3: '1', C4: '5', C5:'3', C6:'SI', C7:'NO', C8:'ACTIVO', C9:'A'},
		 { C1: '2', C2: 'GUBERNAMENTAL', C3: '4', C4: '2', C5:'0', C6:'NO', C7:'SI', C8:'INACTIVO', C9:'I'},
		 ]
    var obj = {  
	        height: "100%",
            showTop: true,
			showBottom:true,
            showTitle : false,
			title: "Mantención de Tipos de Vencimientos",
            roundCorners: true,
            rowBorders: true,
            columnBorders: true,
            collapsible:true,
			editable:false,
            selectionModel: { type: 'row',mode:'single'},
            numberCell: { show: true },
			pageModel: { rPP: 200, type: "local", rPPOptions: [100, 200, 500]},
        	scrollModel:{theme:true},
			toolbar:
           {
               cls: "pq-toolbar-export",
               items:
               [
                   { type: "button", label: " Excel"        ,  attr:"id=co_excel"       , cls:"btn btn-primary"},
                   { type: "button", label: " Cerrar"       ,  attr:"id=co_cerrar"      , cls:"btn btn-primary"},
               ]
           }
        };
		
		obj.colModel = [		
            { title: "Tipo Vencimiento"  , width: 140, dataType: "string", dataIndx: "C1" , halign:"center",align:"center"},
            { title: "Descripción", width: 280, dataType: "string", dataIndx: "C2" , halign:"center", align:"left"},
			{ title: "Días Plazo", width: 120, dataType: "string",   dataIndx: "C3" , halign:"center", align:"center"},
            { title: "Días Para Corte", width: 140, dataType: "string", dataIndx: "C4" , halign:"center", align:"center"},
            { title: "Días Para Notificación", width: 190, dataType: "string", dataIndx: "C5" , halign:"center", align:"center"},
            { title: "Domingos y Festivos", width: 150, dataType: "string", dataIndx: "C6" , halign:"center", align:"center"},
            { title: "Sabados y Festivos", width: 150, dataType: "string",  dataIndx: "C7" , halign:"center", align:"center"},
            { title: "Estado", width: 110, dataType: "string",  dataIndx: "C8" , halign:"center", align:"center"},
            { title: "COD_ESTADO", width: 110, dataType: "string",  dataIndx: "C9" , halign:"center", align:"center", hidden:true}
        ];
	obj.dataModel = { data: data };	
	
    $grid_principal = $("#div_grid_principal").pqGrid(obj);
}
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_Muestra_modal()
{

    $("#div_filtro_bts").modal({backdrop: "static",keyboard:false});
	$("#div_filtro_bts").on("shown.bs.modal", function () {
		$("#div_filtro_bts div.modal-footer button").focus();
		//Aplicar trabajo cuando esta visible el objeto	

	});

}
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_carga_grid_principal()
{
	var total_register;
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
			fn_mensaje_boostrap(jqErr.responseText, g_tit, $("") );
        }
    }
	
	$grid_principal.pqGrid( "option", "dataModel", dataModel );				
    $grid_principal.pqGrid( "refreshDataAndView" );
	$grid_principal.pqGrid( "option", "title", "Total Registros: "+total_register);
}