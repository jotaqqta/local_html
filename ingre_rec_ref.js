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
    
    fn_tip_ajust();
    fn_origen();
    fn_motiv();
	
    $("button").on("click", function(){return false;});

    document.title = g_titulo ;
	document.body.scroll = "yes";

    $("#div_header").load("syn_globales/header.htm", function() {
		$("#div_mod0").html(g_modulo);
		$("#div_tit0").html(g_titulo);	
	});

	//Footer
	$("#div_footer").load("syn_globales/footer.htm");	
		
	$("#tx_cliente").focus();
	$('input[name="optradio"]').prop('disabled', true);
   
	jQuery('#tx_cliente').keypress(function(tecla) {
        if(tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
	

    fn_setea_grid_principal();
 
	
  	/*$("#co_leer").on("click", function () {
		//Validación de informacion
		if ($.trim($("#co_leer").text()) == "Leer") {
			if ($("#tx_cliente").val() ==""){
				fn_mensaje_boostrap("DIGITE EL NÚMERO DE SUMINISTRO", g_titulo, $("#tx_cliente"));
                return;
                }else{
            if ($("#tx_obs").val()==""){
				fn_mensaje_boostrap("DIGITE LAS OBSERVACIONES", g_titulo, $("#tx_obs"));
               
                 return;
			}
            
			$("#co_leer").html("<span class='glyphicon glyphicon-floppy-disk'></span> Actualizar");
			$("#co_cancelar").html("<span class='glyphicon glyphicon-log-out'></span> Cancelar");

			fn_leer();
            
        
            }
        }else{
			//////////////////////////////////////////////////////////////////////////////
			///////////////// ACA VA LA FUNCION DE ACTUALIZAR EL REGISTRO ////////////////
			//////////////////////////////////////////////////////////////////////////////
		    fn_Muestra_ingre();	
			fn_limpiar();    
			return;			
		}
	});*/
    $("#co_leer").on("click", function () {
      	if ($.trim($("#co_leer").text()) == "Leer") {
			if ($("#tx_cliente").val() =="" || $("#co_obs").val()=="" ){
				fn_mensaje_boostrap("SELECCIONE TIPO DE AJUSTE", g_titulo, $("#tx_cliente"));
                return;
                }else{
             
            
                }
        }  
        
    });
    $("#co_aceptar").on("click", function () {
		//Validación de informacion
		if ($.trim($("#co_aceptar").text()) == "Aceptar") {
			if ($("#cb_tip_ajust").val() ==""){
				fn_mensaje_boostrap("SELECCIONE TIPO DE AJUSTE", g_titulo, $("#cb_tip_ajust"));
                return;
                }else{
                     if ($("#cb_motiv").val()==""){
				fn_mensaje_boostrap("SELECCIONE MOTIVO", g_titulo, $("#cb_motiv"));
               
                 return;
			}
             if ($("#cb_origen").val()==""){
				fn_mensaje_boostrap("SELECCIONE ORIGEN", g_titulo, $("#cb_origen"));
                return;    
            }
                }
        }
	});
    
    
    
    
    $("#co_aceptar").on("click",function(e){
      
        
        });
    $("#co_anular").on("click",function(e){
        fn_limpiar();
	    });
    $("#co_close").on("click", function (e) {
      $('#div_ing_bts').modal('hide');
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
		      
    });	
	

	
});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_setea_grid_principal()
{ 
    var data = [
		{ C1:'69792375', C2: "14/03/2078", C3:'FA', C4:'16.2', C5:'No refacturado', C6:'No', C7:'No', C8:'03-2018'},
        	{ C1:'69334507', C2: "14/02/2018", C3:'FA', C4:'15.2', C5:'No refacturado', C6:'No', C7:'No', C8:'02-2018'},
        	{ C1:'68848888', C2: "15/01/2018", C3:'FA', C4:'7.36', C5:'No refacturado', C6:'No', C7:'No', C8:'01-2018'},
        	{ C1:'68929696', C2: "14/12/2017", C3:'FA', C4:'7.36', C5:'No refacturado', C6:'No', C7:'No', C8:'12-2018'}
	
    ];
    var obj = {
            width: '100%',
            height: 400,
            showTop: true,
			showBottom:false,
            showHeader: true,
            roundCorners: true,
            rowBorders: true,
            columnBorders: true,
			editable:false,
            selectionModel: { type: 'cell' },
            numberCell: { show: false },
            title: "Titulo",
			pageModel: {type:"local"},
        	scrollModel:{theme:true},
        
        };
		obj.colModel = [
            
            { type: 'checkbox',title: "", width: 5, dataType: "string", dataIndx: "C2",halign:"center", align:"center" },
            { title: "Documento",  resizable: false, width: 90, dataType: "number", dataIndx: "C1",halign:"center",          align:"right"},
            { title: "Fecha", width: 80, dataType: "string", dataIndx: "C2",halign:"center", align:"center" },
            { title: "Tipo", width: 90, dataType: "number", dataIndx: "C3",halign:"center", align:"right" },
            { title: "Valor", width: 90, dataType: "number", dataIndx: "C4",halign:"center", align:"right" },
            { title: "Refacturado",width: 90, dataType: "number", dataIndx: "C5",halign:"center", align:"right"},
            { title: "Campo 1",width: 90, dataType: "number", dataIndx: "C6",halign:"center", align:"right"},
            { title: "Campo 2",width: 90, dataType: "number", dataIndx: "C7",halign:"center", align:"right"},
            { title: "Periodo",width: 90, dataType: "number", dataIndx: "C8",halign:"center", align:"right"}
];		
		obj.dataModel = { data: data };

		
		$grid = $("#div_grid_dos").pqGrid(obj);
		$grid.pqGrid( "refreshDataAndView" );

}

function fn_leer(){
	$("#tx_cliente").prop("disabled", true);
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
    $("#tx_obs").val("");

	$('input[name="optradio"]').prop('checked', false);
	$('input[name="optradio"]').prop('disabled', true);

	$("#tx_cliente").val("");
	$("#tx_cliente").prop("disabled", false);	
	$("#tx_cliente").focus();
    $("#cb_tip_ajust").val("");
    $("#cb_motiv").val("");
    $("#cb_origen").val("");
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

//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
//FUNCIONES MODAL

function fn_tip_ajust() {


	$("#cb_tip_ajust").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
function fn_motiv() {
    
	$("#cb_motiv").html("<option value='' selected></option><option value='1'>10</option> <option value='2' >20</option> <option value='3'>30</option>");
}

function fn_origen() {

	$("#cb_origen").html("<option value='' selected></option><option value='1'>005</option> <option value='2' >010</option> <option value='3'>015</option>");
}

function fn_actualizar(){
    alert('Se actualizo.');
}
function fn_marcar(){
     alert('Se marco como no leida.');
}
function fn_anular(){
    $("#cb_tip_ajust").value("");
     $("#cb_motiv").value("");
     $("#cb_origen").value("");
    
}