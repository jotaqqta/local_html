
var g_modulo = "Configuración Base del Sistema";
var g_titulo = "Relación Regional - Ciclo - Ruta";

$(document).ready(function() {

// PARA ELIMINAR EL SUBMIT
$("button").on("click", function(){return false;});

// SE COLOCAN LOS TITULOS
$("#div_mod1").html(g_modulo);
$("#div_tit1").html(g_titulo);


fn_setea_grid_prin();	
fn_carga_regional();	

$("#co_leer").prop("disabled", true);
$("#co_ruta").prop("disabled", true);
$("#co_ruta").html("<span class='glyphicon glyphicon-plus'></span> Agregar Ruta");	

	
//Eventos combo
$("#cb_regional").on("change", function(evt) 
{
	if($(this).val() =="")
		fn_limpiar();
	else{
		fn_carga_ciclo();
		$("#cb_ciclo").val("");	
		$("#cb_ciclo").prop("disabled", false);
	}
});	
	
$("#cb_ciclo").on("change", function(evt) 
{
	if($(this).val() ==""){
		$("#co_leer").prop("disabled", true);
		$("#co_ruta").prop("disabled", true);
	}
	else{
		$("#co_leer").prop("disabled", false);
		//$("#co_ruta").prop("disabled", false);
	}
});		
	

$("#co_ruta").on("click", function (e) {
	fn_carga_ruta();
	fn_abre_modal(); 
});
 
	
$("#co_close").on("click", function (e){
	$("#dlg_ruta").modal('hide');
	});	

	
$("#co_leer").on("click", function (e){
	fn_carga_grilla();
	$("#co_cerrar").html("<span class='glyphicon glyphicon-remove'></span> Cancelar");
});	
	
$("#co_cerrar").on("click", function (e){
	if($("#co_cerrar").text() == " Cancelar"){
		fn_limpiar();
		$("#cb_regional").val("");
		$grid.pqGrid( "option", "dataModel.data", []);
		$grid.pqGrid( "refreshDataAndView" );
		$("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");
	}
	
	
});		

$("#cb_regional").val("");	
	
	
});// fin ready





//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_limpiar(){
	$("#cb_ciclo").html("");
	$("#cb_ciclo").prop("disabled", true);
	$("#co_ruta").prop("disabled", true);
	$("#co_leer").prop("disabled", true);
}


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_setea_grid_prin(){
	
	var obj = {
			width: '100%',
            height: 360,
            showTop: true,
			showBottom:true,
            showHeader: true,
			showTitle:false,
        	collapsible:false,
            roundCorners: true,
            rowBorders: true,
            columnBorders: true,
			editable:false,
            selectionModel: { type: "row", mode:"single"},
            numberCell: { show: false },
	       	scrollModel:{autoFit:true, theme:true},
			pageModel: { rPP: 20, type: "local", rPPOptions: [20, 50, 100]},
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
            { title: "Regional",  resizable: false, width: '60', dataType: "string", dataIndx: "c1", align: "center", halign: "center" },
            { title: "Ciclo", width: '60', dataType: "string", dataIndx: "c2", align: "center", halign: "center" },
            { title: "Ruta", width: '60', dataType: "string", dataIndx: "c3", align: "center", halign: "center" },
            { title: "Descripción", width: '600', dataType: "string", dataIndx: "c4", align: "left", halign: "center" },
            { title: "Eliminar",width: '60', dataType: "string", align: "center", editable: false,  sortable: false,
				render: function (ui) {
					return "<button class='btn btn-primary btn-sm'>Eliminar</button>";
				}
			}
        ];
		
		obj.dataModel = { data: data };

	var data = [];
	
	$grid = $("#div_grid").pqGrid(obj);
    //$grid.pqGrid( "option", "dataModel.data", data);
    $grid.pqGrid( "refreshDataAndView" );
	//var grid = pq.grid("#div_grid", obj);
	
	$grid.pqGrid({
        rowDblClick: function( event, ui ) {
            if (ui.rowData) {
                var dataCell = ui.rowData;
                fn_abre_modal_mod(dataCell.c1, dataCell.c2, dataCell.c3, dataCell.c4);
            }
            //$("#tx_desc").focus();
        }
    });
	
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_carga_regional(){
	$("#cb_regional").html("<option value =''></option><option value='8100' selected>ARRAIJÁN</option><option value='1000'  >BOCAS DEL TORO</option><option value='4000'>CHIRIQUÍ</option><option value='2000'>COCLÉ</option><option value='3000'  >COLÓN</option><option value='6000'>HERRERA</option><option value='7000'>LOS SANTOS</option><option value='5000'  >PANAMÁ ESTE Y DARIEN</option><option value='8000'>PANAMÁ METRO</option><option value='8200'>PANAMÁ OESTE</option><option value='9000'>VERAGUAS</option>");
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_carga_ciclo(){
	$("#cb_ciclo").html("<option value =''></option><option value='10' selected>10</option><option value='11'>11</option><option value='12'>12</option><option value='13'>13</option><option value='14'>14</option><option value='15'>15</option><option value='16'>16</option><option value='17'>17</option><option value='18'>18</option><option value='19'>19</option><option value='20'>20</option>");
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_carga_ruta(){
	$("#cb_ruta").html("<option value =''></option><option value='100' selected>100</option><option value='150'  >150</option><option value='200'>200</option><option value='300'>300</option><option value='350'>350</option><option value='400'>400</option><option value='450'>450</option><option value='500' >500</option><option value='550'>550</option><option value='600'>600</option><option value='650'>650</option>");
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_abre_modal(){
    $("#dlg_ruta").modal({backdrop: "static",keyboard:false});
    $("#tx_tit_guardar").text("Datos de la ruta");
	$("#gr_ruta_cb").show();
    $("#gr_ruta_tx").hide();
	$("#tx_regional").val($("#cb_regional").val());
	$("#tx_ciclo").val($("#cb_ciclo").val());
	$("#tx_desc").val("");
	$("#cb_ruta").val("");
	$("#co_confirmar").html("<span class='glyphicon glyphicon-floppy-disk'></span>Guardar");
    $("#dlg_ruta").on("shown.bs.modal", function () {  	
		$("#cb_ruta").focus();
    });
} 

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_abre_modal_mod(p_regional, p_ciclo, p_ruta, p_desc){
    $("#dlg_ruta").modal({backdrop: "static",keyboard:false});
    $("#tx_tit_guardar").text("Datos de la ruta");
	$("#tx_regional").val(p_regional);
	$("#tx_ciclo").val(p_ciclo);
	$("#tx_ruta").val(p_ruta);
	$("#tx_desc").val(p_desc);
	$("#gr_ruta_tx").show();
    $("#gr_ruta_cb").hide();
	$("#co_confirmar").html("<span class='glyphicon glyphicon-floppy-disk'></span>Modificar");
    $("#dlg_ruta").on("shown.bs.modal", function () {
        $("#tx_desc").focus();
    });
} 

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
function fn_carga_grilla(){
	
	parameters = 
    {
        "func":"fn_hist_conve",
        "p_cliente":$("#tx_cliente").val(),
        "empresa" : $("#tx_empresa").val()
    };
	 
	cadenajson="";
    HablaServidor("datos_ruta.json",parameters,'text', function(text) 
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
	
	$("#co_ruta").prop("disabled", false);
	
}

