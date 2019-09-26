var g_modulo = "Facturación Clientes - Lecturas y Consumos";
var g_titulo = "Ingreso Requerimientos Refacturados.";
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
    $("#co_leer").on("click", function(){
        if ($.trim($("#co_leer").text()) == "Leer") {
            if ($("#num_sum").val() == ""){
                fn_mensaje_boostrap("DIGITE EL NÚMERO DE SUMINISTRO", g_titulo, $("#num_sum"));
                $("#cb_est").prop("disabled", true);
                
                return;
            }else{
                    fn_leer();
             }
        }
    });



    $("#co_cerrar").on("click", function(){
        if ($.trim($("#co_cerrar").text())=="Cerrar") {
            

            fn_limpiar();
            return;
        } else {
             window.close();
        }
    });


  
});
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*  

function fn_leer() {
    $("#num_sum").focus();
    $("#tx_nombre").val("PH BBVA");
    $("#cb_est").prop("disabled", false);
    $("#tx_dir").val("PANAMA CENTRO");
    $("#tx_ruta").val("8000-01-140-0010");
    $("#cb_est").prop("disabled",false);
    $("#co_leer").html("<span class='glyphicon glyphicon-ok'></span> Activar");
    $("#co_close").html("<span class='glyphicon glyphicon-remove'></span> Cancelar");
    
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*  
function fn_limpiar() {
    $("#num_sum").val("");
    $("#tx_nombre").val("");
    $("#cb_est").val("");
    $("#tx_dir").val("");
    $("#tx_ruta").val("");
    $("#cb_est").prop("disabled", true);
}

//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
function fn_inactivar() {
    alert("Se inactivo usuario.");
}

//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~

function fn_estado() {
   $("#cb_est").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}


