var g_modulo="Restricción al Cambio de Medidor";
var g_titulo="Restricción al Cambio de Medidor";
var parameters={};
var my_url="reasigna_ajuste.asp";
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
    
    // PARA ELIMINAR EL SUBMIT
	$("button").on("click", function(){return false;});
    //INGRESA LOS TITULOS
    document.title = g_titulo ;
	document.body.scroll = "yes";
    $("#div_header").load("/syn_globales/header.htm", function() {
		$("#div_mod0").html(g_modulo);
		$("#div_tit0").html(g_titulo);	
	});
    
    $("._input_selector").inputmask("dd/mm/yyyy");
	//Se cargan las variables que vienen desde el server
	/*
	$("#tx_empresa").val(SYNSegCodEmpresa);
	$("#tx_rol").val(SYNSegRol);
	$("#tx_ip").val(SYNSegIP);
	$("#tx_rolfun").val(SYNSegRolFuncion);
	*/

	$("#tx_cliente").focus();
	
	$("#tx_cliente").on("keydown", function(event) {
        var tecla =  event.which || event.keyCode;
        if(tecla==13)
        {
			$("#co_lec").trigger( "click" );
        }
        
    });
	//Footer
	$("#div_footer").load("/syn_globales/footer.htm");
	
    // SE INHABILITAN LOS IMPUT
    jQuery('#tx_cliente').keypress(function (tecla) {
	if (tecla.charCode < 48 || tecla.charCode > 57) return false;
	});    

  //DIBUJA LOS ICONOS DE LOS BOTONES     
	
	/*
	$("#tx_cliente").bind("keydown",function(e){
		if(e.keyCode == 13)       
			if($("#tx_cliente").val()==""){
				fn_mensaje_boostrap("FAVOR DIGITE NUMERO DE CLIENTE", g_titulo, $("#tx_cliente"));
					return;
			}
			fn_leer();
	 });
	*/
	    	
    ///EVENTO BOTONES///
    $("#co_lec").on("click", function(){
		//Validación de informacion
		if ($.trim($("#co_lec").text()) == "Leer") {
			if($("#tx_cliente").val()==""){
				fn_mensaje_boostrap("FAVOR DIGITE NUMERO DE CLIENTE", g_titulo, $("#tx_cliente"));
					return;
			}
			fn_leer();
        }
		else 
			fn_abre_modal();
	});
	
	$("#co_cancel").on("click", function (e){
		fn_limpiar();	
    });
	
    ///EVENTO BOTONES MODAL///
    $("#co_cancelar").on("click", function (e) {
        $('#div_filtro_bts').modal('hide');
    })
	
    $("#co_aceptar").on("click", function () {
        $('#div_filtro_bts').modal('hide');
		fn_mensaje_boostrap("Se generó", g_titulo, $("#co_aceptar"));
		$(window).scrollTop(0);       

    });
  
});	

//-------------------------------------------------------------------------------------------
function fn_leer(){
	if ($.trim($("#co_lec").text()) == "Leer")
	{
				
		$("#co_lec").html("<span class='glyphicon glyphicon-floppy-disk'></span> Actualizar");
		$("#tx_cliente").prop("readonly", true);
		$("#tx_cliente").val("45223");
		$("#tx_cod_cliente").val("Maria");
		$("#tx_ruta").val("Activo");
		$('#tx_cenoper').val("Si");
		$("#tx_locali").val("Panamá Metro");
		$("#tx_dir").val("8000-01-244");
		$("#chk_grancli").val("Residencial");
		$("#tx_tarifa").val("Residencial");
		$("#cb_motivo").val("23234345");            
		$("#chk_tempo").val("5/1"); 
		$("#chk_indef").val("MCUB");  
		$("#tx_fecha_desde").val("2344");
		$("#tx_fecha_hasta").val("152"); 
	}
}

//-------------------------------------------------------------------------------------------
function fn_abre_modal() {

    $("#div_filtro_bts").modal({ backdrop: "static", keyboard: false });
    $("#div_filtro_bts").on("shown.bs.modal", function () {
        $("#div_filtro_bts div.modal-footer button").focus();

    });
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_limpiar(){
//IDENTIFICACIÓN

	$("#co_lec").html("<span class='glyphicon glyphicon-search'></span> Leer");
	$("#tx_cliente").prop("readonly", false);
	$('#tx_cod_cliente').val("");   
	$('#tx_ruta').val("");
	$('#tx_cenoper').val("");
	$('#tx_locali').val("");
	$('#tx_dir').val("");
	$('#tx_tarifa').val("");
	$('#chk_grancli').prop("checked",false);
	$('#cb_motivo').val("");
	$('#chk_tempo').prop("checked",false);
	$('#chk_indef').prop("checked",false);
	$('#chk_grancli').prop("checked",false);
	$("#tx_cliente").focus();
	$("#tx_cliente").val("");
	$("#tx_fecha_desde").val("");
	$("#tx_fecha_hasta").val("");
}
	