$(document).ready(function(){	
	//$("#div_msg_bts").load("/raiz/syn_globales/bootstrap_msn.htm");  //is deprecated
	$.get("bootstrap_msn.htm", function(htmlexterno){
		$("#div_msg_bts").html(htmlexterno);
	});
	
});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function HablaServidor(servidor,parametros,tipofile,CallBack)
{
    var respuestaJSON="";

    $.ajax({
        url: servidor,
        data: parametros,
        async: false,
        dataType: tipofile,
        type: "POST",  
        cache: false,
        contentType:"application/x-www-form-urlencoded; charset:ISO-8859-1",
        error: function(jqErr, err_stat, err_str) // ERROR EN EL ASP
        {
			//setTimeout(function(){ fn_mensaje_boostrap(jqErr.responseText, g_tit, $("") ) }, 0);
			fn_mensaje_boostrap(jqErr.responseText, g_tit, "");
        },
		success: function(DevuelveDatos)
        {
            respuestaJSON=DevuelveDatos;
            return CallBack(respuestaJSON);
        }
    });
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
//Si se llama desde el Ready, agregar SetTimeOut 
//Ver ejemplo conve_ingreso.js
//Ejemplo: setTimeout(function(){ fn_leer_cliente() }, 0);
function fn_mensaje_boostrap(p_mensaje, p_titulo, $p_objeto)
{
	
	
	setTimeout(function(){ 
		$("#div_msg_bts").modal({backdrop: "static",keyboard:false}); 
	}, 0);
	
	$("#div_msg_bts").on("shown.bs.modal", function () {
		$(".modal-footer button").focus();
		//Aplicar trabajo cuando esta visible el objeto	
	});
	
	$("#div_msg_bts").on("show.bs.modal", function () {
		$(this).find(".modal-title").html(p_titulo);
		$(this).find(".form-control-label").html(p_mensaje);
	});
	
	$("#div_msg_bts").on("hidden.bs.modal", function () {
		//Aplicar trabajo cuando esta invisible el objeto	
		if($.trim($p_objeto)!="") $p_objeto.focus();
	});
}
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	


//funcion experimental, usela bajo su propio riesgo
function fn_formato_num (amount, decimals){
   
    separador= ",", // separador para los miles
    sepDecimal= '.', // separador para los decimales

    amount += ''; // por si pasan un numero en vez de un string
    amount = parseFloat(amount.replace(/[^0-9\.]/g, '')); // elimino cualquier cosa que no sea numero o punto

    decimals = decimals || 0; // por si la variable no fue fue pasada

    // si no es un numero o es igual a cero retorno el mismo cero
    if (isNaN(amount) || amount === 0) 
        return parseFloat(0).toFixed(decimals);

    // si es mayor o menor que cero retorno el valor formateado como numero
    amount = '' + amount.toFixed(decimals);

    var amount_parts = amount.split('.'),
        regexp = /(\d+)(\d{3})/;

    while (regexp.test(amount_parts[0]))
        amount_parts[0] = amount_parts[0].replace(regexp, '$1' + ',' + '$2');

    return amount_parts.join('.');
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_get_param(variable){
	
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i=0;i<vars.length;i++) {
		   var pair = vars[i].split("=");
		   if(pair[0] == variable){return pair[1];}
	}
	return(false);	
	
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_valida_vacio($objeto){
    var sw = 0;
    if( $objeto.val() == "" || $objeto.val() == null){
        sw++;
        $objeto.parents(".form-group").addClass("has-error");
    }else{
        $objeto.parents(".form-group").removeClass("has-error");
    }
    return sw;
}


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_rellenar_input(objeto, longitud){
   var l= objeto.val().length;
   var txt;
 
   //alert(l);
   txt = ("000000000" + $(objeto).inputmask("unmaskedvalue")).slice(-1*longitud);
    $(objeto).val(txt);   
}
