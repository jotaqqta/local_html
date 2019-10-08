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
		


	jQuery('#tx_id').keypress(function(tecla) {
        if(tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
    jQuery('#tx_val').keypress(function(tecla) {
        if(tecla.charCode < 48 || tecla.charCode > 57) return false;
    });

	//Footer
	$("#div_footer").load("/syn_globales/footer.htm");
  //DEFINE LA GRILLA PRINCIPAL
    fn_setea_grid_principal();
    //DIBUJA LOS ICONOS DE LOS BOTONES     
    fn_est();
  //DIBUJA LOS ICONOS DE LOS BOTONES     
    $("#co_filtro").html("<span class='glyphicon glyphicon-search'></span> Filtros");
    $("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");
 
    $("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");  
    $("#co_nuevo").html("<span class='glyphicon glyphicon-plus'></span> Nuevo"); 
    
   

    $("#co_mod").on("click", function(){
		//Validación de informacion
     if ($.trim($("#co_mod").text())=="Modificar"){
			if( $("#tx_id").val() == ""){
				fn_mensaje_boostrap("DIGITE IDENTEFICADOR DE RELACIÓN", g_titulo, $("#tx_id"));
				return;
                
            }
            if( $("#tx_nem").val() == ""){
				fn_mensaje_boostrap("DIGITE NEMOTECNICO", g_titulo, $("#tx_nem"));
				return;
                
            }
            if( $("#tx_val").val() == ""){
				fn_mensaje_boostrap("DIGITE VALOR", g_titulo, $("#tx_val"));
				return;
                
            }
            if( $("#cb_est").val() == ""){
				fn_mensaje_boostrap("SELECCIONE ESTADO", g_titulo, $("#cb_est"));
				return;
                
            }
            fn_modificar();
            fn_limpiar();
            $('#div_filtro_bts').modal('hide'); 
           }
    });
    $("#co_nuevo").on("click", function(){
		//Validación de informacion
     if ($.trim($("#co_nuevo").text())=="Nuevo"){
       
        fn_carga_nuevo();    
        if( $("#tx_id").val() == ""){
				fn_mensaje_boostrap("DIGITE IDENTEFICADOR DE RELACIÓN", g_titulo, $("#tx_id"));
				return;
                
            }
            if( $("#tx_nem").val() == ""){
				fn_mensaje_boostrap("DIGITE NEMOTECNICO", g_titulo, $("#tx_nem"));
				return;
                
            }
            if( $("#tx_val").val() == ""){
				fn_mensaje_boostrap("DIGITE VALOR", g_titulo, $("#tx_val"));
				return;
                
            }
            if( $("#cb_est").val() == ""){
				fn_mensaje_boostrap("SELECCIONE ESTADO", g_titulo, $("#cb_est"));
				return;
                
            }
            fn_modificar();
            fn_limpiar();
            $('#div_filtro_bts').modal('hide'); 
           }
    });
 
 

	$("#co_cancelar").on("click",function(){
		if ($.trim($("#co_cancelar").text())=="Cancelar"){
            $('#div_filtro_bts').modal('hide'); 
		
			fn_limpiar();  

			return;
		}
	
		
	});
	
	

	$grid.pqGrid({
		rowDblClick: function (event, ui) {
			if (ui.rowData) {
                var dataCell = ui.rowData;

                $("#tx_id").val(dataCell.C1);
                $("#tx_nem").val(dataCell.C2);
                $("#tx_val").val(dataCell.C3);
                $('#cb_est').val("1");
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

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_setea_grid_principal()
{ 

	data= [
        { C1: 20052, C2: 'ACOPLADO DE BRONCE', C3: 100, C4: 'A', C5:'FINALIZADA'},
        { C1: 20052, C2: 'ACOPLADO DE BRONCE', C3: 100, C4: 'A', C5:'FINALIZADA'},
        { C1: 20053, C2: 'ACOPLADOR DE BRONCE', C3: 0, C4: 'D', C5:'FINALIZADA'},
        { C1: 20053, C2: 'ACOPLADOR DE BRONCE', C3: 0, C4: 'D', C5:'FINALIZADA'},
        { C1: 20052, C2: 'ACOPLADO DE BRONCE', C3: 100, C4: 'A', C5:'FINALIZADA'},
        { C1: 20052, C2: 'ACOPLADO DE BRONCE', C3: 100, C4: 'A', C5:'FINALIZADA'},
        { C1: 20052, C2: 'ACOPLADO DE BRONCE', C3: 100, C4: 'A', C5:'FINALIZADA'},
        { C1: 20053, C2: 'ACOPLADOR DE BRONCE', C3: 0, C4: 'D', C5:'FINALIZADA'},
        { C1: 20038, C2: 'ADAPTER MACHO DE SOLDAR', C3: 48.15, C4: 'A', C5:'FINALIZADA'},
        { C1: 20052, C2: 'ACOPLADO DE BRONCE', C3: 100, C4: 'A', C5:'FINALIZADA'},
        { C1: 20052, C2: 'ACOPLADO DE BRONCE', C3: 100, C4: 'A', C5:'FINALIZADA'},
        { C1: 20053, C2: 'ACOPLADOR DE BRONCE', C3: 0, C4: 'D', C5:'FINALIZADA'},
        { C1: 20053, C2: 'ACOPLADOR DE BRONCE', C3: 0, C4: 'D', C5:'FINALIZADA'},
        { C1: 20052, C2: 'ACOPLADO DE BRONCE', C3: 100, C4: 'A', C5:'FINALIZADA'},
        { C1: 20052, C2: 'ACOPLADO DE BRONCE', C3: 100, C4: 'A', C5:'FINALIZADA'},
        { C1: 20052, C2: 'ACOPLADO DE BRONCE', C3: 100, C4: 'A', C5:'FINALIZADA'},
        { C1: 20053, C2: 'ACOPLADOR DE BRONCE', C3: 0, C4: 'D', C5:'FINALIZADA'},
        { C1: 20038, C2: 'ADAPTER MACHO DE SOLDAR', C3: 48.15, C4: 'A', C5:'FINALIZADA'},
        { C1: 20052, C2: 'ACOPLADO DE BRONCE', C3: 100, C4: 'A', C5:'FINALIZADA'},
        { C1: 20052, C2: 'ACOPLADO DE BRONCE', C3: 100, C4: 'A', C5:'FINALIZADA'},
        { C1: 20053, C2: 'ACOPLADOR DE BRONCE', C3: 0, C4: 'D', C5:'FINALIZADA'},
        { C1: 20053, C2: 'ACOPLADOR DE BRONCE', C3: 0, C4: 'D', C5:'FINALIZADA'},
        { C1: 20052, C2: 'ACOPLADO DE BRONCE', C3: 100, C4: 'A', C5:'FINALIZADA'},
        { C1: 20052, C2: 'ACOPLADO DE BRONCE', C3: 100, C4: 'A', C5:'FINALIZADA'},
        { C1: 20052, C2: 'ACOPLADO DE BRONCE', C3: 100, C4: 'A', C5:'FINALIZADA'},
        { C1: 20053, C2: 'ACOPLADOR DE BRONCE', C3: 0, C4: 'D', C5:'FINALIZADA'},
        { C1: 20038, C2: 'ADAPTER MACHO DE SOLDAR', C3: 48.15, C4: 'A', C5:'FINALIZADA'}

	];
    var obj = {
		title: "Materiales",
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
		height: 450,
		width: "100%",
		toolbar: {
			items: [
          
            {type: "button", label: "Nuevo", attr:"id=co_nuevo", cls:"btn btn-primary btn-sm"},
            {type: "button", label: "Excel", attr:"id=co_excel2", cls:"btn btn-primary btn-sm"}
            
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

			{ title: "Id relación",  resizable: false, width: 78, dataType: "number", dataIndx: "C1",halign:"center", align:"center" },
			{ title: "Nemotecnico", width: 300, dataType: "string", dataIndx: "C2", halign:"center",align:"lefth" },
			{ title: "Valor", width: 78, dataType: "number", dataIndx: "C3",halign:"center", align:"right" },
			{ title: "Estado", width: 78, dataType: "string", dataIndx: "C4",halign:"center", align:"center"}
	
		]
	};
	
	obj.dataModel = { data: data };	
	$grid = $("#div_grid_pri").pqGrid(obj);
	$grid.pqGrid("refreshView");


}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	

function fn_est() {
    $("#cb_est").html("<option value='0' selected></option><option value='1'>A</option> <option value='2' >D</option>");
}
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_carga_grilla(){

	
}
function fn_modificar(){

fn_mensaje_boostrap("SE MODIFICO", g_titulo, $("#co_mod"));
return;


}
function fn_carga_nuevo(){
    $("#tx_id").val("");
    $("#tx_nem").val("");
    $("#tx_val").val("");
    $('#cb_est').val("0");          
    
    $("#div_filtro_bts").modal({backdrop: "static",keyboard:false});
	$("#div_filtro_bts").on("shown.bs.modal", function () {
				});
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_limpiar(){
 
    $("#tx_id").val("");
    $("#tx_nem").val("");
    $("#tx_val").val("");
    $('#cb_est').val("0");

}
	