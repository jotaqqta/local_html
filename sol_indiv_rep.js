var g_modulo="Solicitud de Corte y Reposici&oacute;n";
var g_tit="Solicitud Individual de Reposici&oacute;n";
var parameters={};
var my_url="corte_y_reposc.asp";
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
    $("button").on("click", function(){return false;});

    document.title = g_tit;
	document.body.scroll = "yes";


    $("#div_header").load("syn_globales/header.htm", function() {
		$("#div_mod0").html(g_modulo);
		$("#div_tit0").html(g_tit);	
	});


    $("#co_medid").prop( "disabled", true);
    $("#co_deuda").prop( "disabled", true);

    //FUNCIONES COMBOS
    fn_corte();
    fn_reposicion();


	//Footer
	$("#div_footer").load("syn_globales/footer.htm");		     
    $("._input_selector").inputmask("dd/mm/yyyy");
    $("#tx_hora").inputmask({mask:"99", rightAlign: true, placeholder: ""});
    $("#tx_min").inputmask({mask:"99", rightAlign: true, placeholder: ""});


    ///Validación Solo números pestaña "Mantenedor Empresa"/// 
	jQuery('#tx_num_sum').keypress(function(tecla) {
        if(tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
    
     //BOTONES-EVENTOS
     //BOTON CANCELAR VENTANA
	 $("#co_cancelar").on("click", function (e) {
            fn_cancelar();

    });
    //BOTON CERRAR MODAL
    $("#co_cancel").on("click", function (e) {
    $("#div_edit_bts").modal("hide"); 
    });
    

    
    $("#co_leer").on("click", function () {
		//Validación de informacion
		if ($.trim($("#co_leer").text()) == "Leer"){
			if ($("#tx_num_sum").val() == ""){
				fn_mensaje_boostrap("DIGITE EL N&Uacute;MERO DE SUMINISTRO.", g_tit, $("#tx_num_sum"));
				return;
			}
            $("#co_medid").prop( "disabled", false);
            $("#co_deuda").prop( "disabled", false);
            $("#co_leer").prop( "disabled", true);
            $("#tx_num_sum").prop( "disabled", true);
            fn_leer();

		}

    }); 

    $("#co_crear").on("click", function () {

        //if ($.trim($("#co_crear").text()) === "Generar") {

            if ($("#cb_mot_repo").val() === "") {
                fn_mensaje_boostrap("FAVOR SELECCIONE MOTIVO DE REPOSICI&Oacute;N", g_tit, $("#cb_mot_repo"));
                return;
            }

            if ($("#tx_fec_sol_real").val() === "") {
                fn_mensaje_boostrap("FAVOR SELECCIONE FECHA SOLICITUD REAL", g_tit, $("#tx_fec_sol_real"));
                return;
            }

            if ($("#tx_hora").val() === "") {
                fn_mensaje_boostrap("FAVOR SELECCIONE HORA", g_tit, $("#tx_hora"));
                return;
            }

            if ($("#tx_min").val() === "") {
                fn_mensaje_boostrap("FAVOR SELECCIONE MINUTOS", g_tit, $("#tx_min"));
                return;
            }

            if ($("#cb_inst_re").val() == "") {
                fn_mensaje_boostrap("FAVOR SELECCIONAR INSTACIA DE CORTE", g_tit, $("#cb_inst_re"));
                return;
                }
            

            if ($("#tx_obser").val() == "") {
                fn_mensaje_boostrap("FAVOR DIGITAR OBSERVACIÓN", g_tit, $("#tx_obser"));
                return;
                }
         // }
            
            if(document.getElementById('tx_obser').value.length < 15) {
                fn_mensaje_boostrap("FAVOR DIGITAR AL MENOS 15 CARACTERES", g_tit, $("#tx_obser"));
                return;
            }


            if ($("#tx_hora").val() > 23) {
                fn_mensaje_boostrap("HORA NO PERMITIDA, FAVOR DIGITAR ENTRE 00 Y 23 HORAS", g_tit, $("#tx_hora"));
                return;
                }


            if ($("#tx_min").val() > 59) {
                fn_mensaje_boostrap("MINUTOS NO PERMITIDOS, FAVOR DIGITAR ENTRE 00 Y 59 MINUTOS", g_tit, $("#tx_min"));
                return;
                }
                      
          fn_mensaje_boostrap("Se ingres&oacute;", g_tit, $(""));
           

    });

    $("#co_medid").on("click", function (){
        $('#div_edit_bts').modal('show');
    });



    $("#tx_hora").blur(function () {
        if ($("#tx_hora").val() >= 24) {
            $("#tx_hora").val("23");
        }
    });

    $("#tx_min").blur(function () {
        if ($("#tx_min").val() >= 60) {
            $("#tx_min").val("59");
        }
    });
   
});


//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
/////////////////////////////////FUNCIONES COMBOS///////////////////////////////////////////
function fn_corte() {
	$("#cb_mot_repo").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
		
function fn_reposicion() {
	$("#cb_inst_re").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
		

function fn_leer(){

        $("#tx_nom").val("Roberto Roena");   
        $("#tx_dir").val("Calle 1");
        $("#tx_ope").val("1");
        $("#tx_ruta").val("1");
        $("#tx_sum").val("1");
        $("#tx_cat").val("1");
        $("#tx_serv").val("1");
        $("#tx_estado").val("Activo");
        $("#tx_locali").val("Cali");
        $("#tx_tarif").val("1");
        $("#tx_ult_eve").val("1");
        $("#tx_fe_eve").val("17/02/2020");
      
}

function fn_cancelar(){
        $("#tx_num_sum").val("");
        $("#tx_nom").val("");   
        $("#tx_dir").val("");
        $("#tx_ope").val("");
        $("#tx_ruta").val("");
        $("#tx_sum").val("");
        $("#tx_cat").val("");
        $("#tx_serv").val("");
        $("#tx_estado").val("");
        $("#tx_locali").val("");
        $("#tx_tarif").val("");
        $("#tx_ult_eve").val("");
        $("#tx_fe_eve").val("");
        $("#co_medid").prop( "disabled", true);
        $("#co_deuda").prop( "disabled", true);
        $("#co_leer").prop( "disabled", false);
        $("#tx_num_sum").prop( "disabled", false);
        $("#cb_mot_repo").val("");
        $("#tx_fec_sol_real").val("");
        $("#tx_hora").val("");
        $("#tx_min").val("");
        $("#cb_inst_re").val("");
        $("#tx_obser").val("");
        $("#tx_num_sum").focus();
    }


//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
function fn_validar_fecha(value){
	var real, info;

	if (/^(0?[1-9]|[12][0-9]|3[01])[\/](0?[1-9]|1[012])[\/]\d{4}$/.test(value)) {
		info = value.split(/\//);
		var fecha = new Date(info[2], info[1]-1, info[0]);
		if ( Object.prototype.toString.call(fecha) === '[object Date]' ){
			real = fecha.toISOString().substr(0,10).split('-');
			if (info[0] === real[2] && info[1] === real[1] && info[2] === real[0]) {
				return true;
			}
			return false;
		}else{
			return false;
		}
	}
	else {
		return false;
	}
}