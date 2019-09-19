var g_modulo="Facturación Clientes - Lecturas y Consumos";
var g_titulo="Consulta de medidores";
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
    $("#tx_refe").prop("disabled", true);
    $("#co_obs").prop("disabled", true);

	$("#cb_motiv").prop("disabled",true);
	$("#cb_origen").prop("disabled",true);    
    
  
	
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
   
    fn_marca();
	
    fn_setea_grid_principal();

    //AL PRESIONAR LA TECLA ENTER RETORNE LA INFORMACION
    $("#tx_cliente").keypress(function(e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if(code==13){
			if ($("#tx_cliente").val() ==""){
				fn_mensaje_boostrap("DIGITE EL NÚMERO DE SUMINISTRO", g_titulo, $("#tx_cliente"));
                return;
            }
			fn_leer();  
        }
    });	    
 
  	$("#co_leer").on("click", function () {
		//Validación de informacion
		if ($.trim($("#co_leer").text()) == "Leer") {
			if ($("#tx_cliente").val() ==""){
				fn_mensaje_boostrap("DIGITE EL NÚMERO DE SUMINISTRO", g_titulo, $("#tx_cliente"));
                return;
            }
			fn_leer();      
        }else{

            if ($("#tx_refe").val()==""){
				fn_mensaje_boostrap("DEBE DIGITAR LA REFERENCIA", g_titulo, $("#tx_refe"));
                return;
			}else{
			   	fn_Muestra_ingre();	
				//fn_limpiar();    
				return;			
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

    $("#co_cancelar").on("click",function(){

		if ($.trim($("#co_cancelar").text())=="Cancelar"){
			$("#co_leer").html("<span class='glyphicon glyphicon-search'></span> Leer");
			$("#co_cancelar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");	
    
			fn_limpiar();    
			return;
		}else{

			window.close();
		}
	});  	
    
    $("#co_anular").on("click",function(e){
    	fn_anular();
	});

    $("#co_close").on("click", function (e) {
    	$('#div_ing_bts').modal('hide');
    }); 	



	$("#cb_tip_ajust").on("change", function(evt)
	{
		if($(this).val() =="")
			//$("#cb_ruta").prop("disabled",true);
			limpia_ajus(); //se limpian los combos inferiores
		else
			$("#cb_motiv").prop("disabled",false);
			$("#cb_origen").prop("disabled",true);
			fn_motiv();
			fn_origen();	
			$("#cb_motiv").focus();
	});

	$("#cb_motiv").on("change", function(evt)
	{
		if($(this).val() =="")
			limpia_motiv(); //se limpian los combos inferiores
		else
			$("#cb_origen").prop("disabled",false);
			fn_origen();	
			$("#cb_origen").focus();	
	});	        
});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_leer(){
	var f = new Date();
	var fec = (f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear());
	$("#tx_cliente").prop("disabled", true);
	$("#tx_orden").val("1395209");
	$("#tx_fecha").val(fec);
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

	$("#co_leer").html("<span class='glyphicon glyphicon-share-alt'></span> Enviar");
	$("#co_cancelar").html("<span class='glyphicon glyphicon-log-out'></span> Cancelar");	

	$("#tx_refe").prop("disabled", false);
	$("#co_obs").prop("disabled", false);
	$("#tx_refe").focus();	 
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_limpiar(){

	
}

//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
function fn_Muestra_ingre() {
	$("#div_ing_bts").modal({ backdrop: "static", keyboard: false });
	$("#div_ing_bts").on("shown.bs.modal", function () {
    //$("#div_ing_bts div.modal-footer button").focus();
		$grid.pqGrid( "refreshDataAndView" );
	});
}

//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
/////////////////////////////////FUNCIONES MODAL///////////////////////////////////////////
function fn_marca() {


	$("#mar_inp").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}

//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
function fn_motiv() {
    
	$("#cb_motiv").html("<option value='' selected></option><option value='1'>10</option> <option value='2' >20</option> <option value='3'>30</option>");
}

//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
function fn_origen() {

	$("#cb_origen").html("<option value='' selected></option><option value='1'>005</option> <option value='2' >010</option> <option value='3'>015</option>");
}

//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
function fn_anular(){
	$("#cb_tip_ajust").val("");
	$("#cb_motiv").val("");
	$("#cb_origen").val("");    	
	$("#cb_motiv").prop("disabled",true);
	$("#cb_origen").prop("disabled",true);	
	$("#cb_tip_ajust").focus();
}


