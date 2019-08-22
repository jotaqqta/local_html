$( document ).ready(function() {
	
	
	$("#tx_tel_con_ref").inputmask({"mask": "(999) 999[9]-9999", greedy:false}); //specifying options
	
	// SE OCULTAN LOS DIV CON LOS FORMULARIOS PARA LA CAPTURA DE LAS INSPECCIONES
	$("#div_clie").slideUp();
	$("#div_predio").slideUp();
	
	// PARA ELIMINAR EL SUBMIT
	$("button").on("click", function(){return false;});
	
	
	// INSPECCIÓN CLIENTE EXISTENTE
	$("#co_cliente").on("click", function(){	   
		
		$("#div_tit").slideUp();
		$("#div_clie").slideDown();
		$("#tx_cliente").focus();
		
	});

	// INSPECCIÓN EN PREDIO
	$("#co_predio").on("click", function(){		
		
		$("#div_tit").slideUp();
		$("#div_predio").slideDown();
		$("#tx_nom_ref").focus();
			
	});	

	$("#co_volver1").on("click", function(){	   
		
		$("#div_clie").slideUp();
		$("#div_predio").slideUp();
		$("#div_tit").slideDown();
		
		
	});

	$("#co_volver2").on("click", function(){		
		
		$("#frm_nom_ref").removeClass("has-error");
		$("#div_clie").slideUp();
		$("#div_predio").slideUp();
		$("#div_tit").slideDown();
	

	});	
	
	
	$("#co_guardar2").on("click", function(){		
		
	 
	 $("#frm_nom_ref").addClass("has-error");
	
	

	});	
	
	
});
	