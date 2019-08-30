var g_modulo="Facturación Clientes";
var g_titulo="Consulta de Totales Facturados Por Ciclos y Ruta vs Periodos";

$(document).ready(function() {

	// PARA ELIMINAR EL SUBMIT
	$("button").on("click", function(){return false;});

	//Invocar la cabecera de la pagina
	$("#div_header").load("header.htm", function() {
		$("#div_mod0").html(g_modulo);
		$("#div_tit0").html(g_titulo);	
	});
		
	// SE COLOCAN LOS TITULOS
	$("#div_mod1").html(g_modulo);
	$("#div_tit1").html(g_titulo);
	$("#div_mod2").html(g_modulo);
	$("#div_tit2").html(g_titulo);

	fn_regional();
    fn_sector();

    $("._input_selector").inputmask("dd/mm/yyyy");

    // EL CAMPO RUTA lo limito a 8 digitos y solo numeros
	jQuery('#tx_ruta').keypress(function(tecla) {
        if(tecla.charCode < 48 || tecla.charCode > 57) return false;
    });

	$("#co_leer").on("click", function(){
		//Validación de informacion
		if($("#fec_proc").val() == "" || $("#cb_regional").val() == ""){
			fn_mensaje_boostrap("La Fecha Proceso y Regional son obligatorios", g_titulo);
			return;			
		};

		alert("Se leyeron los datos.");
	});    
});

function fn_regional()
{
    /*parameters = 
    {
		"func":"fn_regional",
		"empresa":$("#tx_empresa").val(),
		"rol":$("#tx_rol").val()
    };
    HablaServidor(my_url,parameters,'text', function(text) 
    {
        if(text != "")
            $("#cb_regional").html(text);
    });*/
	
	$("#cb_regional").html("<option value='' selected></option><option value='8000'>(8000) PANAMÁ METRO</option> <option value='9000' >(9000) PANAMÁ 02</option>");
}

function fn_sector()
{
    /*parameters = 
    {
		"func":"fn_regional",
		"empresa":$("#tx_empresa").val(),
		"rol":$("#tx_rol").val()
    };
    HablaServidor(my_url,parameters,'text', function(text) 
    {
        if(text != "")
            $("#cb_regional").html(text);
    });*/
	
	$("#cb_sector").html("<option value='' selected></option><option value='1'>01</option> <option value='2' >02</option> <option value='3'>03</option>");
}