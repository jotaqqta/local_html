var g_modulo="Módulo de Recuadación";
var g_tit ="Recaudación Por Vigencia";
var $grid_principal, $grid2, $grid3;
var g_rol_selec = "";
var g_alto_aux = 0;

$(document).ready(function() {
    
    // PARA ELIMINAR EL SUBMIT
	$("button").on("click", function(){return false;});

    //INGRESA LOS TITULOS
    document.title = g_tit ;
    
    $("#div_mod0").html(g_modulo);
    $("#div_tit0").html(g_tit );
    $("#tituloexcel").val(g_tit );
	$("#excel_archivo").val("recaudo_viegencia.xls");
	$("#Rol").val(fn_get_param("Rol"));

	$("#tx_empresa").val(fn_get_param("Empresa"));
	$("#tx_rol").val(fn_get_param("Rol"));
	$("#tx_rolfun").val(fn_get_param("RolFun"));
	$("#tx_ip").val(fn_get_param("Ip"));
    
    //DIBUJA LOS ICONOS DE LOS BOTONES     
    
    $("#co_nuevo").html("<span class='glyphicon glyphicon-plus'></span> Filtro");
    $("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");
    $("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");    
    $("#co_excel2").html("<span class='glyphicon glyphicon-save'></span> Excel");

    //EVENTO BOTONES    
    $("#co_excel").on("click", function (e) {
        var col_model=$( "#div_grid_principal" ).pqGrid( "option", "colModel" );
		var cabecera = "";
		for (i=0; i< col_model.length; i++){
			if(col_model[i].hidden != true) cabecera += "<th>"+col_model[i].title+ "</th>";
		}
		$("#excel_cabecera").val(cabecera);
		var element =$grid_principal.pqGrid("option","dataModel.data");
		if (element)
			a= element.length;
		else 
			a= 0;
		if(a>0){
			$("#frm_Exel").submit();
			return;
		}
		e.preventDefault();		
    });
    
    $("#co_cerrar").on("click", function (e) {
        if($.trim($("#co_cerrar").text()) == "Cerrar")
            window.close(); 
    });    
      
       
    $("#toolbar_pr").hide();
 
    g_alto_aux =$("#bd_prin").height();
    
    $("#datetimepicker10").datetimepicker({
		viewMode: 'years',
        format: 'mm/yyyy',
        minView: 3,
        startView: 4,
        autoclose: true,
        language: 'es'
	});
    
    $("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");
    
});


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_limpiar()
{
    $("#datetimepicker10").val("");
}

	