var g_modulo="";
var g_titulo="Anomalias de lectura encontradas en terreno";

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

    //validacion de las fechas
    $(".form_datetime").datetimepicker({
		viewMode: "years",
		format: "mm/yyyy",
		startDate: "01/2014",
		useCurrent: false,
		defaultDate:"",
		todayBtn: false,
		minView: 3,  //solo permite seleccionar hasta meses, no días
		startView: 4,  //iniciar en años
		endDate: "+0d",  //No habilitar fechas futuras
		autoclose: true,
		language: "es"	
    });    

    fn_regional();
    

	$("#co_generar").on("click", function(){
		//Validación de informacion
		if($("#fec_periodo").val() == "" || $("#cb_regional").val() == ""){
			fn_mensaje_boostrap("Hay campos vacios", g_titulo);
			return;	
           // if($("#cb_regional").val() == ""){
			//fn_mensaje_boostrap("Selecione una region", g_titulo);
			//return;	
            //if($("#fec_periodo").val() == ""){
			//fn_mensaje_boostrap("Seleccione la fecha", g_titulo);
			//return;	
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
	
	$("#cb_regional").html("<option value='' selected></option><option value='1'>Opcio 1</option> <option value='2' >Opcion 2</option><option value='3' >Opcion 3</option>");
}
