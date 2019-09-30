var g_modulo = "Facturación Clientes - Lecturas y Consumos";
var g_titulo = "Activación en inactivación de clientes.";
var parameters = {};
var my_url = "correc_prome_dudo.asp";
var $grid, $grid_secun, $grid_tar_izq, $grid_tar_der;
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
$(document).keydown(function (e) {

    if (e.keyCode === 8) {
        var element = e.target.nodeName.toLowerCase();
        if ((element != 'input' && element != 'textarea') || $(e.target).attr("readonly")) {
            return false;
        }
    }
});


$(document).ready(function(){
    $("#tx_nombre").prop("disabled", true);
    $("#tx_ruta").prop("disabled", true);
    $("#tx_dir").prop("disabled", true);
    $("#cb_est").prop("disabled", true);
   
    fn_estado();
    

    $("button").on("click", function () { return false; });

    document.title = g_titulo;
    document.body.scroll = "yes";

    $("#div_header").load("syn_globales/header.htm", function(){
        $("#div_mod0").html(g_modulo);
        $("#div_tit0").html(g_titulo);
    });

    //Footer
    $("#div_footer").load("syn_globales/footer.htm");

    $("#num_sum").focus();
    
    jQuery('#num_sum').keypress(function(tecla){
        if (tecla.charCode < 48 || tecla.charCode > 57) return false;
    });

    //AL PRESIONAR LA TECLA ENTER RETORNE LA INFORMACION
    
    $("#num_sum").keypress(function(e){
        var code = (e.keyCode ? e.keyCode : e.which);
        if (code == 13) {
            if ($("#num_sum").val() == "") {
                fn_mensaje_boostrap("DIGITE EL NÚMERO DE SUMINISTRO", g_titulo, $("#num_sum"));
                return;
            }
            fn_leer();
        }
    });
    /*$("#co_leer").on("click", function(){
        if ($.trim($("#co_leer").text()) == "Leer"){
            if ($("#num_sum").val() == ""){
                fn_mensaje_boostrap("DIGITE EL NÚMERO DE SUMINISTRO", g_titulo, $("#num_sum"));
                $("#cb_est").prop("disabled", true);
                return;
            }else{
             
             fn_leer();  
             
            if ($("#cb_est").val() == "0"){
                fn_mensaje_boostrap("SELECCIONE ESTADO", g_titulo, $("#cb_est"));
                 return;
            }
            if ($("#co_obs").val() == ""){
                fn_mensaje_boostrap("SE DEBE ANOTAR OBSERVACION", g_titulo, $("#co_obs"));
                 return;
            }
        }
        fn_cambio_buttom();
            
        }
        $("#co_leer").on("click", function(){
            if ($.trim($("#co_leer").text()) == "Activar"){
                fn_mensaje_boostrap("SE ACTIVO.", g_titulo, $("#co_leer"));
                fn_carga_limpio();
                return;
                }


             }); 



          });*/
    
    $("#co_leer").on("click", function(){
        if ($.trim($("#co_leer").text()) == "Leer"){
            if ($("#num_sum").val() == ""){
                fn_mensaje_boostrap("DIGITE EL NÚMERO DE SUMINISTRO", g_titulo, $("#num_sum"));
                $("#cb_est").prop("disabled", true);
                return;
            }else{
             
             fn_leer();  
             
            if ($("#cb_est").val() == "0"){
                fn_mensaje_boostrap("SELECCIONE ESTADO", g_titulo, $("#cb_est"));
                 return;
            }
           
        }
    
            
        }
      


          });
    
      $("#co_leer").on("click", function(){
          
            if ($.trim($("#co_leer").text()) == "Activar"){
                 if ($("#co_obs").val() == ""){
                fn_mensaje_boostrap("SE DEBE ANOTAR OBSERVACION", g_titulo, $("#co_obs"));
                 return;}
                else{
                    fn_mensaje_boostrap("SE ACTIVO.", g_titulo, $("#co_leer"));
                    fn_carga_limpio();
                     return;
                 }
            }
            }); 

    
       
    $("#co_close").on("click", function(){
        if ($.trim($("#co_close").text())=="Cancelar") {
            

            fn_limpiar();
            fn_carga_limpio();
            return;
        } else {
             window.close();
        }
    });


  
});
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*  

function fn_leer(){
    $("#num_sum").focus();
    $("#tx_nombre").prop("disabled", true);
    $("#tx_nombre").val("PH BBVA");
    $("#cb_est").prop("disabled", false);
    $("#tx_dir").val("PANAMA CENTRO");
    $("#tx_dir").prop("disabled", true);
    $("#tx_ruta").val("8000-01-140-0010");
    $("#cb_est").prop("disabled",false);
    $("#co_leer").html("<span class='glyphicon glyphicon-ok'></span> Activar");
    $("#co_close").html("<span class='glyphicon glyphicon-remove'></span> Cancelar");
}

function fn_carga_limpio(){
    $("#num_sum").focus();
    $("#num_sum").val("");
    $("#tx_nombre").val("");
    $("#tx_dir").val("");
    $("#tx_ruta").val("");
    $("#cb_est").val("");
    $("#cb_est").prop("disabled",true);
    $("#co_leer").html("<span class='glyphicon glyphicon-ok'></span>Leer");
    $("#co_close").html("<span class='glyphicon glyphicon-remove'></span>Cerrar");
    $("#co_obs").val(""); 
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*  
function fn_limpiar() {
    $("#num_sum").val("");
    $("#tx_nombre").val("");
    $("#tx_dir").val("");
    $("#tx_ruta").val("");
    $("#cb_est").val("");
    $("#cb_est").prop("disabled", true);
    $("#co_obs").val("");    
}
//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
function fn_inactivar() {
    alert("Se inactivo usuario.");
}

//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~

function fn_estado() {
   $("#cb_est").html("<option value='0' selected></option><option value='1'>ACTIVO</option> <option value='2' >INACTIVO</option>");
}


