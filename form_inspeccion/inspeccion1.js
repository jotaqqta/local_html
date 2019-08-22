var g_tit = "";

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
$( document ).ready(function() {
    g_tit = "Módulo de Gestión Técnica";
        
    document.title = g_tit;
    $("#tit1").html(g_tit);
    $("#sub-titulo1").html("Creación de Inspección");
    $("#sub-titulo2").html("Captura de Inspección para Cliente Existente");
    $("#sub-titulo3").html("Captura de Inspección en Predio sin Contrato");
    
    
    $( "button" ).button();
    
        $( "#co_cliente" ).button({
		icons: {
			primary: "ui-icon-person"
		},
         label:"CLIENTE EXISTENTE"
        });
    
        $( "#co_no_cliente" ).button({
		icons: {
			primary: "ui-icon-contact"
		},
         label:"PREDIO SIN CONTRATO"
        });	
    
        $( "#co_guardar1" ).button({
		icons: {
			primary: "ui-icon-disk"
		},
         label:"Guardar"
        });	
    
        $( "#co_volver1" ).button({
		icons: {
			primary: "ui-icon-arrowreturnthick-1-w"
		},
         label:"Volver"
        });	
    
        $( "#co_limpiar1" ).button({
		icons: {
			primary: "ui-icon-arrowrefresh-1-n"
		},
         label:"Limpiar",
        });
    
        $( "#co_guardar2" ).button({
		icons: {
			primary: "ui-icon-disk"
		},
         label:"Guardar"
        });	
    
        $( "#co_volver2" ).button({
		icons: {
			primary: "ui-icon-arrowreturnthick-1-w"
		},
         label:"Volver"
        });
    
        $( "#co_limpiar2" ).button({
		icons: {
			primary: "ui-icon-arrowrefresh-1-n"
		},
         label:"Limpiar",
        });
    
        $( "#co_leer" ).button({
          icons: false,
         label:"Leer"
        });	
    
    $("#co_limpiar1").on("click", fn_limpiar1);
    $("#co_limpiar2").on("click", fn_limpiar2);
    
    $("button").on("click", function(){
        var whatForm = $(this).attr("rel");
        $("#buttons").slideUp();
        
        $("#"+whatForm).slideDown();
        if(whatForm=="form1") $("#tx_cliente").focus();
        if(whatForm=="form2") $("#tx_nom_ref").focus();
        $(".panel_opt").slideUp();
    });

    $(".co_button").on("click", function(e){
        e.preventDefault();
        $("#buttons").slideDown();
        $(".form").slideUp();
        $(".panel_opt").slideDown();
    });

});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_limpiar2()
{
        $("#tx_nom_ref").val("");
        $("#tx_dir_ref").val("");
        $("#tx_ref_adc").val("");
        $("#tx_nom_con_ref").val("");
        $("#tx_tel_con_ref").val("");
        $("#tx_observaciones_ref").val("");
        $("#cb_act_com").val("");
        $("#cb_prov_ref").val("");
        $("#cb_dist_ref").val("");
        $("#cb_corr_ref").val("");
        $("#cb_barrio_ref").val("");
        $("#cb_relacion_ref").val("");
        $("#cb_tp_ins_ref").val("");
        $("#cb_mot_ins_ref").val("");
        $("#tx_nom_ref").focus();
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_limpiar1()
{
        $("#tx_cliente").val("");
        $("#tx_nombre").val("");
        $("#tx_doc").val("");
        $("#tx_ruta").val("");
        $("#tx_tarifa").val("");
        $("#tx_actividad").val("");
        $("#tx_estado").val("");
        $("#tx_est_con").val("");
        $("#tx_provincia").val("");
        $("#tx_distrito").val("");
        $("#tx_corre").val("");
        $("#tx_barrio").val("");
        $("#tx_direccion").val("");
        $("#tx_nom_con").val("");
        $("#tx_tel_con").val("");
        $("#cb_relacion").val("");
        $("#cb_tp_ins").val("");
        $("#cb_mot_ins").val("");
        $("#tx_observaciones").val("");
        $("#tx_cliente").focus();
}

