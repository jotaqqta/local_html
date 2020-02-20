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

	//Footer
	$("#div_footer").load("syn_globales/footer.htm");
    //Se cargan las variables que vienen esde el server
    //$("#tx_empresa").val(SYNSegCodEmpresa); //
    //$("#tx_rol").val(SYNSegRol);
    //$("#tx_ip").val(SYNSegIP);
    //$("#tx_rolfun").val(SYNSegRolFuncion);
    
	$("#tx_num_med").focus();
	
    $("#co_leer").html("<span class='glyphicon glyphicon-search'></span> Leer"); 
    $("#co_cancel").html("<span class='glyphicon glyphicon-remove'></span> Cerrar");
    
    //DEFINE LA GRILLA PRINCIPAL
	fn_setea_grid_principal();

	
	/*
    fn_marca();
    fn_almacen_destino();
	fn_clave_reacondicionamiento();
	fn_propiedad_medidor();
    fn_estado();
	fn_accion();
	fn_condicion();
	*/


	$("._input_selector").inputmask("dd/mm/yyyy");
	$('input[name="optradio"]').prop('disabled', false);

	//Evento de cambio en combo
	$("#cb_marca").on("change", function(evt){
		if($(this).val() == ""){
			$("#cb_marca").val("");
         	$("#cb_modelo").val("");
		}
		else{
			fn_modelo();
			$("#cb_modelo").focus();	
		}
	});

	jQuery('#tx_num_sum').keypress(function (tecla) {
		if (tecla.charCode < 48 || tecla.charCode > 57) return false;
	});
	jQuery('#tx_num_fab').keypress(function (tecla) {
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
               fn_limpiar_fil();
               fn_limpiar();
               //limpia la grilla
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
				fn_mensaje_boostrap("DIGITE NUMERO DE SUMINISTRO", g_titulo, $("#tx_num_sum"));
				return;
			}			
			if($("#tx_num_med").val()==""){
				fn_mensaje_boostrap("DEBE SELECCIONAR NUMERO DE MEDIDOR", g_titulo, $("#tx_num_med"));
				return;
			}
			fn_leer();
			}

		});
 
    /////////////////////////////////////////////////////////////

	
	$("#co_seleccionar").on("click", function(e){
		    
            $("#dlg_medidor").modal("hide");

            $("#co_leer").html("<span class='glyphicon glyphicon-pencil'</span> Modificar"); 
            //bloqueo de campos para que no se modifiquen
            $("#cb_marca").prop("disabled", true);
            $("#cb_modelo").prop("disabled", true);
            $("#tx_num_med").prop("disabled", true);

            $("#cb_condicion").prop("disabled", true);
            $("#tx_anio_fab").prop("disabled", true);
            $("#tx_fec_cre").prop("disabled", true);
            
            $("#chk_prot").prop("disabled", false);
            $("#cb_alm_dest").prop("disabled", false);
            $("#cb_accion").prop("disabled", false);
            $("#cb_estado").prop("disabled", false);
            $("#tx_anio_reac").prop("disabled", false);
            $("#cb_clav_reac").prop("disabled", false);
            $("#cb_pro_med").prop("disabled", false);

		    //////////////////////////////////div_medidor///////
		    var arr2   = new Array($("#tx_empresa").val(), $("#cb_marca").val(), $("#cb_modelo").val(), $("#tx_num_med").val(), $("#num_unico").val()); // generamos un array
		    var datos2 = JSON.stringify(arr2); // lo pasamos a formato json
			
			parameters = 
			    {
			        "md"     :"raiz/operacion/ope_medidores/med_mantencion", 
			        "fl"     :"ing_medidor",
			        "fn"     :"fn_existe",
			        "datos"  :datos2
			    };
			    
			    HablaServidor(my_url,parameters,'text', function(text){
			        
			        if (text != "") {
			           dato_ori = text.split("|");

			           //alert("estado:" + dato_ori[4] );
			           //$("#co_leer").html("<span class='glyphicon glyphicon-pen'></span> Modificar");
		               g_existe = 1;

			           //alert(g_existe + dato_ori[9] + dato_ori[13]);

			           $('#num_unico').val(dato_ori[1]);

			           $("#cb_condicion").val(dato_ori[14]);
                       $("#tx_anio_fab").val(dato_ori[11]);
			           $("#tx_fec_cre").val(dato_ori[20]);

 			           if ( dato_ori[10] == "S")
                          $("#chk_prot").prop("checked",true);
                       else
                       	  $("#chk_prot").prop("checked",false);

                       	alert(dato_ori[10]);

			           $("#cb_alm_dest").val(dato_ori[9]);
		               $("#cb_accion").val(dato_ori[13]);
			           $("#cb_estado").val(dato_ori[4]); 

			           if ((dato_ori[4] == "O") || (dato_ori[4] == "I") || (dato_ori[4] == "V") || (dato_ori[4] == "B") || (dato_ori[4] == "C") ){
                          $("#cb_alm_dest").prop("disabled",true);
                          $("#cb_accion").prop("disabled",true);
                          $("#cb_estado").prop("disabled",true);
                          if (dato_ori[4] == "O") {
                             $("#tx_anio_reac").prop("disabled",true);
		                     $("#cb_clav_reac").prop("disabled",true);
		                     $("#cb_pro_med").prop("disabled",true);
                             $("#chk_prot").prop("disabled",true);		                 	
                          }
			           } 
			           $("#tx_anio_reac").val(dato_ori[18]);
		               $("#cb_clav_reac").val(dato_ori[19]);
		               $("#cb_pro_med").val(dato_ori[8]);
		            }
		            else
		            	 alert('ojo no existe');
			        
			    }); 
                fn_cargar_lectura($("#tx_empresa").val(),$("#cb_marca").val(),$("#cb_modelo").val());
                fn_carga_grilla($("#tx_empresa").val(),$("#cb_marca").val(),$("#cb_modelo").val());
	});
    
    $("#co_volver").on("click", function (e){
		$grid_med.pqGrid( 'option', 'dataModel.data', [] );
        $grid_med.pqGrid( 'refreshView' );
		//limpia la grilla del medidor
		$("#dlg_medidor").modal("hide");
		//fn_limpiar_fil();
		fn_limpiar();
		$("#tx_num_med").focus();

    });
	////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////
	$("#co_limpiar").on("click", function () {
		fn_limpiar_fil();
		fn_limpiar();
		
	});

});
////
function fn_validar_datos(){
            if($("#tx_num_fab").val()==""){
				fn_mensaje_boostrap("DIGITE NUMERO DE FABRICA", g_titulo, $("#tx_num_fab"));
				return;
			}

		    if($("#tx_num_med").val()==""){
				fn_mensaje_boostrap("DIGITE NUMERO DE MEDIDOR", g_titulo, $("#tx_num_med"));
				return;
			}
			if($("#cb_marca").val()==""){
				fn_mensaje_boostrap("DEBE SELECCIONAR UNA MARCA PARA EL MEDIDOR ", g_titulo, $("#cb_marca"));
				return;
			}
			if($("#cb_modelo").val()==""){
				fn_mensaje_boostrap("DEBE SELECCIONAR UN MODELO PARA EL MEDIDOR", g_titulo, $("#cb_modelo"));
                return;
			}
			if($("#cb_alm_dest").val()==""){
				fn_mensaje_boostrap("DEBE SELECCIONAR EL ALMACEN DESTINO", g_titulo, $("#cb_alm_dest"));
                return;
			}
			if($("#cb_accion").val()==""){
				fn_mensaje_boostrap("DEBE SELECCIONAR LA ACCION REALIZADA SOBRE EL MEDIDOR", g_titulo, $("#cb_accion"));
                return;
			}
			if($("#cb_estado").val()==""){
				fn_mensaje_boostrap("DEBE SELECCIONAR EL ESTADO DEL  MEDIDOR", g_titulo, $("#cb_estado"));
                return;
			}
			if($("#cb_condicion").val()==""){
				fn_mensaje_boostrap("DEBE SELECCIONAR UNA CONDICION DEL MEDIDOR", g_titulo, $("#cb_condicion"));
                return;
			}
			if($("#tx_anio_fab").val()==""){
				fn_mensaje_boostrap("DEBE DILIGENCIAR EL A&Ntilde;O DE FABRICACION DEL MEDIDOR", g_titulo, $("#tx_anio_fab"));
                return;
			}
			if($("#cb_clav_reac").val()==""){
				fn_mensaje_boostrap("DEBE DILIGENCIAR LA CLAVE DE REACONDICIONAMIENTO.", g_titulo, $("#cb_clav_reac"));
                return;
			}
			if($("#cb_pro_med").val()==""){
				fn_mensaje_boostrap("DEBE DILIGENCIAR LA PROPIEDAD DEL MEDIDOR.", g_titulo, $("#cb_pro_med"));
                return;
			}
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

/////////////////////////////////FUNCIONES COMBOS///////////////////////////////////////////
//function fn_diametro() {

 	//$("#cb_mar_inp").html("<option value='0' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
//}
///////////////////////////////////////////////////////////////
function fn_marca(){
   $("#cb_marca").html("");
   $("#cb_modelo").html("");
    parameters = {
        "md"      : "raiz/operacion/ope_medidores/med_mantencion", 
        "fl"      : "ing_medidor",
        "fn"      : "fn_marca",
        "empresa" : $("#tx_empresa").val()
    };

    HablaServidor(my_url,parameters,'text', function(text) 
    {
        if(text != "")
            $("#cb_marca").html(text);
    });
}
///////////////////////////////////////////////////////////////
function fn_modelo() {
	$("#cb_modelo").html("");
	parameters = {
    "md"      : "raiz/operacion/ope_medidores/med_mantencion", 
    "fl"      : "ing_medidor",
    "fn"      : "fn_modelo",
    "empresa" : $("#tx_empresa").val(),
    "p_marca" : $("#cb_marca").val()
		
    };
    HablaServidor(my_url,parameters,'text', function(text) 
    {
        if(text != "")
            $("#cb_modelo").html(text);
    });
	//$("#cb_modelo").html("<option value='0' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
///////////////////////////////////////////////////////////////
function fn_almacen_destino() {
	$("#cb_alm_dest").html("");
	parameters = {
    "md"      : "raiz/operacion/ope_medidores/med_mantencion", 
    "fl"      : "ing_medidor",
    "fn"      : "fn_almacen",
    "empresa" : $("#tx_empresa").val()	
    };
    HablaServidor(my_url,parameters,'text', function(text) 
    {
        if(text != "")
            $("#cb_alm_dest").html(text);
    });
	//$("#cb_alm_dest").html("<option value='0' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
//////////////////////////////////////////
function fn_clave_reacondicionamiento() {
	$("#cb_clav_reac").html("");
	parameters = {
    "md"      : "raiz/operacion/ope_medidores/med_mantencion", 
    "fl"      : "ing_medidor",
    "fn"      : "fn_clavereac",
    "empresa" : $("#tx_empresa").val()	
    };
    HablaServidor(my_url,parameters,'text', function(text) 
    {
        if(text != "")
            $("#cb_clav_reac").html(text);
    });
	

	//$("#cb_clav_reac").html("<option value='0' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
////////////////////////////////////////////////
function fn_propiedad_medidor() {
	$("#cb_pro_med").html("");
	parameters = {
    "md"      : "raiz/operacion/ope_medidores/med_mantencion", 
    "fl"      : "ing_medidor",
    "fn"      : "fn_propietario",
    "empresa" : $("#tx_empresa").val()	
    };
    HablaServidor(my_url,parameters,'text', function(text) 
    {
        if(text != "")
            $("#cb_pro_med").html(text);
    });
	//$("#cb_pro_med").html("<option value='0' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
/////////////////////////////////////////////////////////////////
function fn_condicion() {
	$("#cb_condicion").html("");
	parameters = {
    "md"      : "raiz/operacion/ope_medidores/med_mantencion", 
    "fl"      : "ing_medidor",
    "fn"      : "fn_condicion",
    "empresa" : $("#tx_empresa").val()	
    };
    HablaServidor(my_url,parameters,'text', function(text) 
    {
        if(text != "")
            $("#cb_condicion").html(text);
    });
	//$("#cb_cb_cond_med").html("<option value='0' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
/////////////////////////////////////////////////////////////////

//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*//FUNCIONES MODAL -  combos


/////////////////////////////////////////////////////////////////
function fn_estado() {
	$("#cb_estado").html("");
	parameters = {
    "md"      : "raiz/operacion/ope_medidores/med_mantencion", 
    "fl"      : "ing_medidor",
    "fn"      : "fn_estado",
    "empresa" : $("#tx_empresa").val()	
    };
    HablaServidor(my_url,parameters,'text', function(text) 
    {
        if(text != "")
            $("#cb_estado").html(text);
    });

	//$("#cb_est").html("<option value='0' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
/////////////////////////////////////////////////////////////////////
function fn_accion() {  
	$("#cb_accion").html("");
	parameters = {
    "md"      : "raiz/operacion/ope_medidores/med_mantencion", 
    "fl"      : "ing_medidor",
    "fn"      : "fn_accion",
    "empresa" : $("#tx_empresa").val()	
    };
    HablaServidor(my_url,parameters,'text', function(text) 
    {
        if(text != "")
            $("#cb_accion").html(text);
    });

	//$("#cb_accion").html("<option value='0' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
////////////////////////////////////////////////////////


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_carga_grilla(empresa, marca, modelo){
    var arr = new Array(empresa, marca, modelo); // generamos un array
    var datos = JSON.stringify(arr); // lo pasamos a formato json
   
	var total_register;
	parameters = 
    {
		"md":"raiz/operacion/ope_medidores/med_mantencion",
		"fl":"ing_medidor",
		"fn":"fn_grilla",
		"datos"  :datos
    };
    var dataModel = 
    {
        location: "remote",
        sorting : "local",
        dataType: "json",
        method  : "POST",
        sortDir : ["up", "down"],
		async   : false,
        url     : my_url+"?"+jQuery.param( parameters ),
        getData: function (dataJSON) 
        {
			total_register = $.trim(dataJSON.totalRecords);
			var data = dataJSON.data;
			sql_grid_prim = dataJSON.sql;
			
			if(total_register>=1)
			{
				//$("#co_excel").attr("disabled", false);
			}
            return { data: dataJSON.data};
        },
        error: function(jqErr, err_stat, err_str) // ERROR EN EL ASP
        {
			fn_mensaje_boostrap(jqErr.responseText, g_titulo, $("") );
        }
    }
	$grid.pqGrid( "option", "dataModel", dataModel );				
    $grid.pqGrid( "refreshDataAndView" );
}

//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

function fn_leer(){

        $("#tx_num_sum").val("11");   
        $("#tx_num_med").val("71113754");
        $("#tx_nom").val("ROBERTO ROENA");
        $("#tx_ruta_lec").val("1");
        $("#tx_dir").val("CALLE 1");
        $("#tx_local").val("1");
        $("#tx_tip_cli").val("1");
        $("#tx_cat").val("RESIDENCIAL");
        $("#tx_subg_zona").val("1");
        
      
}

/////////////////////////////////////////////////////////
function fn_limpiar_fil() {
     $("#cb_marca").val("");
	 $("#cb_modelo").val("");
	 $("#tx_num_med").val("");
	 $("#tx_num_fab").val("");
	 
	 $("#cb_marca").prop("disabled",false); 
	 $("#cb_modelo").prop("disabled",false);
	 $("#tx_num_med").prop("disabled",false);
}
/////////////////////////////////////////////////////////
function fn_limpiar(){
	$('#cb_alm_dest').val("");
	$('#cb_alm_dest').prop("disabled",true);
	
	$('#cb_accion').val("");
	$('#cb_accion').prop("disabled",true);
	$('#cb_estado').val("");
	$('#cb_estado').prop("disabled",true);
	$('#cb_condicion').val("");
	$('#cb_condicion').prop("disabled",true);
	$('#tx_diam').val("");
	$('#tx_diam').prop("disabled",true);
	$('#tx_tec').val("");
	$('#tx_tec').prop("disabled",true);
	$('#tx_cls_metro').val("");
	$('#tx_cls_metro').prop("disabled",true);
	$('#tx_anio_fab').val("");
	$('#tx_anio_fab').prop("disabled",true);
	
	$('#tx_anio_vida').val("");
	$('#tx_anio_vida').prop("disabled",true);
	$('#tx_anio_almacen').val("");
	$('#tx_anio_almacen').prop("disabled",true);
	$('#tx_error_exac').val("");
	$('#tx_error_exac').prop("disabled",true);
	$('#tx_max_cons').val("");
	$('#tx_max_cons').prop("disabled",true);

	$('#chk_prot').prop("checked",false);
	//$('#chk_prot').prop("disabled",true);
	$('#chk_patron').prop("checked",false);
	$('#chk_patron').prop("disabled",true);
	$('#chk_reac').prop("checked",false);
	$('#chk_reac').prop("disabled",true);
	$('#chk_reset').prop("checked",false);
	$('#chk_reset').prop("disabled",true);
	
	$('#tx_fec_cre').val("");
	$('#tx_fec_cre').prop("disabled",true);
	$('#tx_anio_reac').val("");
	$('#tx_anio_reac').prop("disabled",true);
	$('#cb_clav_reac').val("");
	$('#cb_clav_reac').prop("disabled",true);
	$('#cb_pro_med').val("");
	$('#cb_pro_med').prop("disabled",true);
	
    $grid.pqGrid( 'option', 'dataModel.data', [] );
    $grid.pqGrid( 'refreshView' );  //limpia la grilla principal
}

//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*





