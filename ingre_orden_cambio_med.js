var g_modulo = "Medidores y Equipos";
var g_titulo = "Ingreso de Orden de Cambio de Medidor";
var parameters = {};
var my_url = "/index.php";
var $grid;
var $grid_med;
var sql_grid_prim;
var sql_grid_medid;

var g_existe;
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
$(document).keydown(function (e) {

	if (e.keyCode === 8) {
		var element = e.target.nodeName.toLowerCase();
		if ((element != 'input' && element != 'textarea') || $(e.target).attr("readonly")) {
			return false;
		}
	}
});

$(document).ready(function () {
	$("button").on("click", function () { return false; });

	document.title = g_titulo;
	document.body.scroll = "yes";

	$("#div_header").load("syn_globales/header.htm", function () {
		$("#div_mod0").html(g_modulo);
		$("#div_tit0").html(g_titulo);
	});

	   //FUNCIONES COMBOS
    fn_motivo();
    fn_ejecuta();

	//Footer
	$("#div_footer").load("syn_globales/footer.htm");

    
	$("#tx_num_sum").focus();
	
    $("#co_leer").html("<span class='glyphicon glyphicon-search'></span> Leer"); 
    $("#co_cancel").html("<span class='glyphicon glyphicon-remove'></span> Cerrar");
    
    //DEFINE LA GRILLA PRINCIPAL
	fn_setea_grid_principal();



	$("._input_selector").inputmask("dd/mm/yyyy");
	$('input[name="optradio"]').prop('disabled', false);



	jQuery('#tx_num_sum').keypress(function (tecla) {
		if (tecla.charCode < 48 || tecla.charCode > 57) return false;
	});
	jQuery('#tx_num_med').keypress(function (tecla) {
		if (tecla.charCode < 48 || tecla.charCode > 57) return false;
	});

	//BOTONES-EVENTOS
	$("#co_cancel").on("click", function (e) {
	   
	   if ($.trim($("#co_cancel").text()) == "Cerrar") {	
           window.close();
	   }
	   else{
	   	   if ($.trim($("#co_cancel").text()) == "Cancelar") {	
               $("#tx_num_med").focus();               
               fn_limpiar();               
               $grid.pqGrid( 'option', 'dataModel.data', [] );
               $grid.pqGrid( 'refreshView' );  

               $("#co_leer").html("<span class='glyphicon glyphicon-search'></span> Leer"); 
               $("#co_cancel").html("<span class='glyphicon glyphicon-remove'></span> Cerrar");
	       }
	   }
	});
    //VALIDACION DE INFORMACION
    $("#co_leer").on("click", function () {
        
      if ($.trim($("#co_leer").text()) == "Leer") {		    
		    if($("#tx_num_sum").val()==""){
				fn_mensaje_boostrap("DIGITE NUMERO DE SUMINISTRO Y/O NUMERO DE MEDIDOR", g_titulo, $("#tx_num_sum"));
				return;
			}			

			$("#tx_num_sum").prop( "disabled", true);
			$("#tx_num_med").prop( "disabled", true);
			fn_leer();
		}

	});
 
    /////////////////////////////////////////////////////////////

    $("#co_crear").on("click", function () {

        //if ($.trim($("#co_crear").text()) === "Generar") {

            if ($("#cb_mot").val() === "") {
                fn_mensaje_boostrap("FAVOR SELECCIONE MOTIVO DE REPOSICI&Oacute;N", g_titulo, $("#cb_mot"));
                return;
            }           

            

            if ($("#cb_ejec").val() === "") {
                fn_mensaje_boostrap("FAVOR SELECCIONE QUI&Eacute;N EJECUTA", g_titulo, $("#cb_ejec"));
                return;
            }

            $('#div_edit_bts').modal('show');        
          
      
    });
    /////////////////BOTON ACEPTAR MODAL//////////////////////////
    $("#co_aceptar").on( "click", function () {

           	if(document.getElementById('tx_obser').value.length < 15) {
              	fn_mensaje('#mensaje_obser', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR DIGITAR AL MENOS 15 CARACTERES</strong></div>', 3000);
              	$("#tx_obser").focus();
               	return;
            }
            $("#div_edit_bts").modal("hide"); 
			fn_mensaje_boostrap("Se ingres&oacute;", g_titulo, $(""));
    });

	////////////BOTON CANCELAR MODAL///////////////////////////
    $("#co_cancelar_obs").on( "click", function () {

    		$("#div_edit_bts").modal("hide");

    });

    /////////////////////////////////////////////////////////////
	

	$("#co_limpiar").on("click", function () {
		//fn_limpiar_fil();
		fn_limpiar();
		
	});

});
////

//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
function fn_motivo() {
	$("#cb_mot").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
		
function fn_ejecuta() {
	$("#cb_ejec").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}

//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
function fn_setea_grid_principal() {

	var data =  [
        { C1: 'SE', C2: 'D01', C3: '71113754', C4: '5/8"'},
                   
    ];

	var obj = {
		height: "240",
		showTop: true,
		showBottom: true,
		showHeader: true,
		roundCorners: true,
		rowBorders: true,
		columnBorders: true,
		editable: true,
		editor: { type: "textbox", select: true, style: "outline:none;" },
		selectionModel: { type: 'row',mode:'single' },
		numberCell: { show: true },
		title: "Medidores",
		pageModel: { type: "local", },
		scrollModel: { theme: true },
		toolbar:{
			cls: "pq-toolbar-export",
			items: [
			//	{ type: "button", label: "Excel", attr: "id=co_excel", cls: "btn btn-primary btn-sm" },
			]
		},
	};


	obj.colModel = [
		{ dataIndx: "checkBox", maxWidth: 30, minWidth: 30, align: "center", resizable: false, title: "", dataType: 'bool', editable: true,
            type: 'checkBoxSelection', cls: 'ui-state-default', sortable: false, editor: true,
            cb: {
                all: true,
                header: true,
            }
        },
		{ title: "Marca"           , width: 270,  dataType: "number", dataIndx: "C1", halign: "center", align: "center" },
		{ title: "Modelo"		   , width: 270, dataType: "string", dataIndx: "C2", halign: "center", align: "center" },
		{ title: "Numero"          , width: 270, dataType: "string", dataIndx: "C3", halign: "center", align: "center" },
		{ title: "Diametro"        , width: 270, dataType: "string", dataIndx: "C4", halign: "center", align: "center" },
	
	];
	obj.dataModel = { data: data };

	$grid = $("#div_grid_principal").pqGrid(obj);
	//$grid.pqGrid("refreshDataAndView");

}
///////////////////////////////////////////



//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

function fn_leer(){

        $("#tx_num_sum").val("11");   
        $("#tx_num_med").val("71113754");
        $("#tx_nom").val("ROBERTO ROENA");
        $("#tx_ruta_lec").val("1");
        $("#tx_dir").val("CALLE 1");
        $("#tx_local").val("1");
        $("#tx_tip_cli").val("1");
        $("#tx_cat").val("1");
        $("#tx_subg_zona").val("1");
        
      
}

/////////////////////////////////////////////////////////
function fn_limpiar(){
	 $("#tx_num_sum").val("");   
        $("#tx_num_med").val("");
        $("#tx_nom").val("");
        $("#tx_ruta_lec").val("");
        $("#tx_dir").val("");
        $("#tx_local").val("");
        $("#tx_tip_cli").val("");
        $("#tx_cat").val("");
        $("#tx_subg_zona").val("");
        $("#cb_mot").val("");
        $("#cb_ejec").val("");
		$("#optradio").prop("checked", false);
	
    $grid.pqGrid( 'option', 'dataModel.data', [] );
    $grid.pqGrid( 'refreshView' );  //limpia la grilla principal
}

//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

function fn_mensaje(id,mensaje,segundos)
{
   $(id).show();
   $(id).html(mensaje);
   setTimeout(function(){$(id).html("");$(id).hide(); }, segundos);
}




