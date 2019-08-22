

//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ 
function fn_muestra_menu(){ // MUESTRA EL MENÚ DE CONSULTAS

// SE POSICIONA EL MENÚ
$("#menu").position({
	my: "left top",
	at: "right bottom",
	of:"#co_cons",
	collision: "flip"
  });

$("#menu").menu().show();


}

//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ 
function fn_oculta_menu(){ // OCULTA EL MENÚ DEL BOTÓN CONSULTAS

$("#menu").menu().hide();

}

//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ 
$(document).ready(function(){
	$("#div-menu").addClass("menu-vis");
	$("#menu" ).menu().hide();
	$("#menu" ).on( "menuselect", function( event, ui ) {alert("hellow");} );
	
	$("#co_cons").button({label:"CONSULTAS"});
	
	
	// MUESTRA EL MENÚ CONSULTAS
	$("#co_cons").on("click", fn_muestra_menu);
	
	
	// OCULTA EL MENÚ AL TOCAR CON EL MOUSE EN CUALQUIER LUGAR QUE NO SEA EL BOTÓN CONSULTAS
	$(document).on('click', function(event) {
		if (!$(event.target).closest('#co_cons').length) {
    		fn_oculta_menu();
  		}
		else
			fn_muestra_menu();
		
	});
	
});