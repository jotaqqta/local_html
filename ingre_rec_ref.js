var g_modulo="Facturación Clientes - Lecturas y Consumos";
var g_titulo="Ingreso Requerimientos Refacturados.";
var parameters={};
var my_url="correc_prome_dudo.asp";
var $grid;
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
    
	$("button").on("click", function(){return false;});

    document.title = g_titulo ;
	document.body.scroll = "yes";

    $("#div_header").load("syn_globales/header.htm", function() {
		$("#div_mod0").html(g_modulo);
		$("#div_tit0").html(g_titulo);	
	});

	//Footer
	$("#div_footer").load("syn_globales/footer.htm");	
		
	//Se cargan las variables que vienen desde el server
	/*
	$("#tx_empresa").val(SYNSegCodEmpresa);
	$("#tx_rol").val(SYNSegRol);
	$("#tx_ip").val(SYNSegIP);
	$("#tx_rolfun").val(SYNSegRolFuncion);
	*/
	
	$("#tx_cliente").focus();
	$('input[name="optradio"]').prop('disabled', true);
   
	jQuery('#tx_cliente').keypress(function(tecla) {
        if(tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
	

    fn_setea_grid_principal();
 
	$("#co_enviar").on("click", function(){
		
		if ($.trim($("#co_enviar").text())=="Enviar"){
			if( $("#tx_cliente").val() == ""){
				fn_mensaje_boostrap("DIGITE EL NÚMERO DE SUMINISTRO", g_titulo, $("#tx_cliente"));
				return;
			}

			$("#co_enviar").html("<span class='glyphicon glyphicon-floppy-disk'></span> Actualizar");
			$("#co_cancelar").html("<span class='glyphicon glyphicon-log-out'></span> Cancelar");

			fn_leer();
		}else{
			//////////////////////////////////////////////////////////////////////////////
			///////////////// ACA VA LA FUNCION DE ACTUALIZAR EL REGISTRO ////////////////
			//////////////////////////////////////////////////////////////////////////////
		   fn_Muestra_ingre();	
			fn_limpiar();    
			return;			
		}
	});
    

	$("#co_cancelar").on("click",function(){

		if ($.trim($("#co_cancelar").text())=="Cancelar"){
			$("#co_leer").html("<span class='glyphicon glyphicon-search'></span> Leer");
			$("#co_cancelar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");	
    
			fn_limpiar();    
			return;
		}
		else
			window.close();
	});  

    $("input[name=optradio]").click(function () {   
 		
 		var valor_new = fn_valor_grilla();
		
		$grid.pqGrid( {editable:true} );
		$grid.pqGrid("updateRow", { 'rowIndx': 0 , row: { 'C11': valor_new } });
		$grid.pqGrid( {editable:false} );
		//$grid.pqGrid( "refreshView" );        
    });	
	

	
});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_setea_grid_principal()
{ 
    var data = [
		{ C1:'14762494', C2: 'M', C3:'58000 ', C4:'2000 ', C5:'41000', C6:'356000 ', C7:'198000 ', C8:'718000 ', C9:'66700 ', C10:'20000', C11:'718000 ', C12:'718000 ', C13:'P', C14:'N', C15:'0', C16:'718000 '},
		//{ C1:'14762494', C2: 'M', C3:'718000 ', C4:'718000 ', C5:'718000', C6:'718000 ', C7:'718000 ', C8:'718000 ', C9:'718000 ', C10:'20000', C11:'718000 ', C12:'718000 ', C13:'P', C14:'N', C15:'0', C16:'718000 '},
    ];
    var obj = {
            width: '100%',
            height: 200,
            showTop: true,
			showBottom:false,
            showHeader: true,
            roundCorners: true,
            rowBorders: true,
            columnBorders: true,
			editable:false,
            selectionModel: { type: 'cell' },
            numberCell: { show: false },
            title: "Promedio en GLS",
			pageModel: {type:"local"},
        	scrollModel:{theme:true},
        };
		obj.colModel = [
            { title: "Numero Medidor",  resizable: false, width: 90, dataType: "number", dataIndx: "C1",halign:"center", align:"right" },
            { title: "Tipo Medida", width: 80, dataType: "string", dataIndx: "C2",halign:"center", align:"center" },
            { title: "Consumo Base 6", width: 90, dataType: "number", dataIndx: "C3",halign:"center", align:"right" },
            { title: "Consumo Base 5", width: 90, dataType: "number", dataIndx: "C4",halign:"center", align:"right" },
            { title: "Consumo Base 4",width: 90, dataType: "number", dataIndx: "C5",halign:"center", align:"right"},
            { title: "Consumo Base 3",width: 90, dataType: "number", dataIndx: "C6",halign:"center", align:"right"},
            { title: "Consumo Base 2",width: 90, dataType: "number", dataIndx: "C7",halign:"center", align:"right"},
            { title: "Consumo Base 1",width: 90, dataType: "number", dataIndx: "C8",halign:"center", align:"right"},
            { title: "Consumo Promedio",width: 90, dataType: "number", dataIndx: "C9",halign:"center", align:"right"},
            { title: "Consumo Prom/Area",width: 90, dataType: "number", dataIndx: "C10",halign:"center", align:"right"},
            { title: "Consumo Facturar",width: 90, dataType: "number", dataIndx: "C11",halign:"center", align:"right"},
            { title: "Consumo Promedio en G",width: 110, dataType: "number", dataIndx: "C12",halign:"center", align:"right"},
            { title: "Tipo Lectura",width: 80, dataType: "number", dataIndx: "C13",halign:"center", align:"center"},
            { title: "Cliente Dudoso",width: 90, dataType: "number", dataIndx: "C14",halign:"center", align:"center"}, 
            { title: "Est. Sumin.",width: 80, dataType: "number", dataIndx: "C15",halign:"center", align:"center"}, 
            { title: "Ult. Fact.",width: 80, dataType: "number", dataIndx: "C16",halign:"center", align:"right"}, 
        ];
		
		obj.dataModel = { data: data };

		
		$grid = $("#div_grid_dos").pqGrid(obj);
		$grid.pqGrid( "refreshDataAndView" );

}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
/*
function fn_carga_orden()
{
	dato_ori = [];
    parameters = 
    {
		"func":"fn_lee_orden",
		"empresa":$("#tx_empresa").val(),
		"p_orden":$("#tx_orden").val()
    };
    
    HablaServidor(my_url,parameters,'text', function(text){
        if(text != ""){
			$("#co_leer").html("<span class='glyphicon glyphicon-user'></span> Reasignar");
			dato_ori = text.split("|");
			//$("#co_leer").prop("disabled",true);
			$("#tx_orden").prop("disabled",true);
			$("#tx_cod_cliente").val(dato_ori[1]);
			$("#tx_rol_actual").val(dato_ori[3]);
			$("#tx_nombre").val(dato_ori[4]);
			$("#tx_estado").val(dato_ori[5]);
			$("#tx_ruta").val(dato_ori[6]);
			$("#tx_tarifa").val(dato_ori[7]);
			$("#tx_actividad").val(dato_ori[8]);
		}
		else{
			fn_mensaje_boostrap("No se encontro la orden indicada!!!", g_titulo, $(""));
			return;
		}
		if(dato_ori[0] == "F"){
			$("#co_leer").prop("disabled",true);
			fn_mensaje_boostrap("ESTA ORDEN YA FUE FINALIZADA, NO PUEDE SER REASIGNADA !", g_titulo,$(""));
			return;
		}
		
		$("#cb_reasigna_nuevo").prop("disabled",false);
	         
    });
	
}
*/
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_leer(){
	$("#tx_cliente").prop("disabled", true);
	$('input[name="optradio"]').prop('disabled', false);

	$("#tx_nombre").val("PH BBVA");
	$("#tx_dir").val("PANAMA CENTRO");
	$("#tx_est_client").val("ACTIVO");
	$('#tx_est_conex').val("CON SUMINISTRO");
	$("#tx_reg").val("8000");
	$("#tx_ruta").val("8000-01-140-0010");
	$("#tx_tarif").val("1");
	$("#tx_actividad").val("BANCOS PRIVADOS");
	$("#tx_unid").val("1");            
	$("#tx_x_leg").val("0"); 
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_limpiar(){

	$("#tx_nombre").val("");
	$("#tx_dir").val("");
	$("#tx_est_client").val("");
	$('#tx_est_conex').val("");
	$("#tx_reg").val("");
	$("#tx_ruta").val("");
	$("#tx_tarif").val("");
	$("#tx_actividad").val("");
	$("#tx_unid").val("");
	$("#tx_x_leg").val("");

	$('input[name="optradio"]').prop('checked', false);
	$('input[name="optradio"]').prop('disabled', true);

	$("#tx_cliente").val("");
	$("#tx_cliente").prop("disabled", false);	
	$("#tx_cliente").focus();	 
}
function fn_Muestra_ingre() {
	$("#div_ing_bts").modal({ backdrop: "static", keyboard: false });
	$("#div_ing_bts").on("shown.bs.modal", function () {
		$("#div_ing_bts div.modal-footer button").focus();

	});


}
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	

function fn_valor_grilla(){
	var value_check =  $('input:radio[name=optradio]:checked').val();

	if(value_check == '1'){
		var valor = "100";  //Valor que deseamos colocar en la grilla	
	}
	if(value_check == '2'){
		var valor = "200";  //Valor que deseamos colocar en la grilla	
	}
	if(value_check == '3'){
		var valor = "300";  //Valor que deseamos colocar en la grilla	
	}
	if(value_check == '4'){
		var valor = "400";  //Valor que deseamos colocar en la grilla	
	}
	if(value_check == '5'){
		var valor = "500";  //Valor que deseamos colocar en la grilla	
	}
	if(value_check == '6'){
		var valor = "600";  //Valor que deseamos colocar en la grilla	
	}		

	if(value_check == '7'){
		var valor = "700";  //Valor que deseamos colocar en la grilla	
	}
	if(value_check == '8'){
		var valor = "800";  //Valor que deseamos colocar en la grilla	
	}
	if(value_check == '9'){
		var valor = "900";  //Valor que deseamos colocar en la grilla	
	}	

	return valor;
}