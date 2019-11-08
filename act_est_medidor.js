var g_modulo = "Medidores - Administraci&oacute;n de Medidores";
var g_titulo = "Actualización Estado de Medidor";
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
    

	fn_setea_grid_principal();
	fn_setea_grid_medidor();
	
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

	jQuery('#tx_num_med').keypress(function (tecla) {
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
    //**************************************   MODIFICACION
    $("#co_leer").on("click", function () {
        
      if ($.trim($("#co_leer").text()) == "Leer") {
		    
		    $("#tx_num_fab").val($("#tx_num_med").val());

		    if($("#tx_num_med").val()==""){
				fn_mensaje_boostrap("DIGITE NUMERO DE MEDIDOR", g_titulo, $("#tx_num_med"));
				return;
			}

			if($("#cb_marca").val()==""){
				fn_mensaje_boostrap("DEBE SELECCIONAR UNA MARCA", g_titulo, $("#cb_marca"));
				return;
			}
			if($("#cb_modelo").val()==""){
				fn_mensaje_boostrap("DEBE SELECCIONAR UN MODELO", g_titulo, $("#cb_modelo"));
                return;
			}
 
            $("#co_cancel").html("<span class='glyphicon glyphicon-log-out'></span> Cancelar"); 
            
            //carga de datos - caractersiticas del medidor
            g_existe =0;
            fn_existencia($("#tx_empresa").val(),$("#cb_marca").val(),$("#cb_modelo").val(),$("#tx_num_med").val());
            $grid_med.pqGrid("refreshDataAndView");
            
	  }    
      else{ 
        if ($.trim($("#co_leer").text()) == "Modificar") {
            var vprototipo;
            fn_validar_datos(); 
            if ($("#chk_prot").prop("checked")) {
                  vprototipo = 'S';
            }
            else  vprototipo = 'N';   


            var arr = new Array($("#tx_empresa").val(), $("#cb_marca").val(), $("#cb_modelo").val(), $("#tx_num_med").val(), 
                                $("#cb_estado").val(),$("#cb_pro_med").val(),$("#cb_alm_dest").val(),$("#tx_num_fab").val(),
                                vprototipo,$("#tx_anio_fab").val(),$("#cb_accion").val(),$("#cb_condicion").val(),
                                $("#tx_anio_reac").val(),$("#num_unico").val(),$("#cb_clav_reac").val()); // generamos un array
            var datos = JSON.stringify(arr); // lo pasamos a formato json
	        
            var parameters = {
			"md"       : "raiz/operacion/ope_medidores/med_mantencion",
			"fl"       : "ing_medidor",
			"fn"       : "fn_modifmedidor",
			"datos"    : datos
			};        		
			HablaServidor(my_url, parameters, 'text', function(text) {		
                if(text == ""){
				   fn_mensaje_boostrap("ACCI&Oacute;N REALIZADA", g_titulo, $(""));
				   //$("#tx_num_med").focus();
	           
				}
				else
					fn_mensaje_boostrap(text, g_titulo, $(""));  
			});

			$("#tx_num_med").focus();
	       fn_limpiar_fil();
           fn_limpiar();
           //limpia la grilla
           $grid.pqGrid( 'option', 'dataModel.data', [] );
           $grid.pqGrid( 'refreshView' );  

           $("#co_leer").html("<span class='glyphicon glyphicon-search'></span> Leer"); 
           $("#co_cancel").html("<span class='glyphicon glyphicon-remove'></span> Cerrar");
		}
		else
		{
			if ($.trim($("#co_leer").text()) == "Ingresar") {
            var vprototipo;
            fn_validar_datos(); 
            
            if (parseint($("#tx_num_med").val(""),10) == 0 ) {
                  fn_mensaje_boostrap("NO PUEDE INGRESAR UN MEDIDOR CERO", g_titulo, $(""));
                  return false;
            }  


            if ($("#chk_prot").prop("checked")) {
                  vprototipo = 'S';
            }
            else  vprototipo = 'N';   

            var arr = new Array($("#tx_empresa").val(), $("#cb_marca").val(), $("#cb_modelo").val(), $("#tx_num_med").val(), 
                                $("#cb_estado").val(),$("#cb_pro_med").val(),$("#cb_alm_dest").val(),$("#tx_num_fab").val(),
                                vprototipo,$("#tx_anio_fab").val(),$("#cb_accion").val(),$("#cb_condicion").val(),
                                $("#tx_anio_reac").val(),$("#tx_fec_cre").val(),$("#cb_clav_reac").val()); // generamos un array
            var datos = JSON.stringify(arr); // lo pasamos a formato json
	        // num_id_unico,control_interno,nro_concentrador,CR_TIPO
            var parameters = {
			"md"       : "raiz/operacion/ope_medidores/med_mantencion",
			"fl"       : "ing_medidor",
			"fn"       : "fn_ingmedidor",
			"datos"    : datos
			
			};        		
			HablaServidor(my_url, parameters, 'text', function(text) {
                if(text == ""){
				   fn_mensaje_boostrap("ACCI&Oacute;N REALIZADA", g_titulo, $(""));  
				  
				}
				else
					fn_mensaje_boostrap(text, g_titulo, $(""));
		    });

		    $("#tx_num_med").focus();
           fn_limpiar_fil();
           fn_limpiar();
           //limpia la grilla
           $grid.pqGrid( 'option', 'dataModel.data', [] );
           $grid.pqGrid( 'refreshView' );  

           $("#co_leer").html("<span class='glyphicon glyphicon-search'></span> Leer"); 
           $("#co_cancel").html("<span class='glyphicon glyphicon-remove'></span> Cerrar");
		}
		
       } //else
     } //else 
	});
    
	///////////////////////////////////////////////////////////////////////////
	//BOTONES DE ACEPTAR SI ACEPTA LA CONFIRMACION DEl ingreso del nuevo medidor
	$("#co_confirmaing_si").on("click", function(e){
		$("#dlg_confirmaing").modal("hide");
        //debe dejar seguir   el boton leer = text.ingresar inserta los datos
        $("#cb_alm_dest").val("1");
        $("#cb_alm_dest").focus();

        $("#cb_estado").val("D");
        $("#cb_estado").prop("disabled",true);
        
        $("#cb_accion").val("C");
        $("#cb_condicion").val("N");
        $("#cb_condicion").prop('disabled', false);
        $("#tx_anio_fab").prop('disabled', false);

        fn_carga_fechas(); //carga fecha actual del sistema
        
        $("#co_leer").html("<span class='glyphicon glyphicon-plus'></span> Ingresar");
        
        fn_cargar_lectura($("#tx_empresa").val(),$("#cb_marca").val(),$("#cb_modelo").val());
        fn_carga_grilla($("#tx_empresa").val(),$("#cb_marca").val(),$("#cb_modelo").val());
	});						

	$("#co_confirmaing_no").on("click", function (e){
			$("#dlg_confirmaing").modal("hide");
			fn_limpiar_fil();
			fn_limpiar();
			$("#cb_marca").focus();
	});
    /////////////////////////////////////////////////////////////
    //  modal de buscar medidor
    /////////////////////////////////////////////////////////////
	 //EVENTO CLICK DE LA GRILLA
    $grid_med.pqGrid({
		rowClick: function( event, ui ) {
			if (ui.rowData) { 
				var dataCell = ui.rowData;
				$("#num_unico").val(dataCell.D6);
				$("#div_medidor").hide();  //div princ. de la primera grilla
                    //$("#div_tabla").show(); //div princ. de la segunda grilla
    				//fn_setea_grid_detalle();
				//$grid_detalle.pqGrid("refreshView");
				//	fn_carga_grilla2();
					
				}
		}
	});

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

	var obj = {
		height: "50%",
		showTop: true,
		showBottom: true,
		showHeader: true,
		roundCorners: true,
		rowBorders: true,
		columnBorders: true,
		editable: false,
		editor: { type: "textbox", select: true, style: "outline:none;" },
		selectionModel: { type: 'cell' },
		numberCell: { show: true },
		title: "Tipo de Medici&oacute;n",
		pageModel: { type: "local" },
		scrollModel: { theme: true },
		toolbar:
		{
			cls: "pq-toolbar-export",
			items: [
			//	{ type: "button", label: "Excel", attr: "id=co_excel", cls: "btn btn-primary btn-sm" },
			]
		},
		editModel: {
			clicksToEdit: 1,
			keyUpDown: true,
			pressToEdit: true,
			cellBorderWidth: 0
		},
		dataModel: {
			data: []
		}
	};

	obj.colModel = [
		{ title: "Codigo"           , width: 80,  dataType: "number", dataIndx: "C1", halign: "center", align: "center" },
		{ title: "Descripci&oacuten", width: 300, dataType: "string", dataIndx: "C2", halign: "center", align: "center" },
		{ title: "Constante"        , width: 200, dataType: "string", dataIndx: "C3", halign: "center", align: "center" },
		{ title: "Decimal"          , width: 100, dataType: "string", dataIndx: "C4", halign: "center", align: "center" },
		{ title: "Entero"           , width: 100, dataType: "string", dataIndx: "C4", halign: "center", align: "center" },

	];

	$grid = $("#div_grid_principal").pqGrid(obj);
	$grid.pqGrid("refreshDataAndView");

}
///////////////////////////////////////////
function fn_setea_grid_medidor() {

	var obj = {
		height: "300",
		width: "550",
		showTop: true,
		showBottom: true,
		showHeader: true,
		roundCorners: true,
		rowBorders: true,
		columnBorders: true,
		editable: false,
		editor: { type: "textbox", select: true, style: "outline:none;" },
		selectionModel: {type: 'row', mode: 'single'},
		numberCell: { show: true },
		title: "Medidores",
		pageModel: { type: "local" },
		scrollModel: { theme: true },
		toolbar:
		{
			cls: "pq-toolbar-export",
			items: [
				//{ type: "button", label: "Excel", attr: "id=co_excel", cls: "btn btn-primary btn-sm" },
			]
		},
		editModel: {
			clicksToEdit: 1,
			keyUpDown: true,
			pressToEdit: true,
			cellBorderWidth: 0
		},
		dataModel: {
			data: []
		}
	};

	obj.colModel = [
		{ title: "Marca"       , width: 80, dataType: "string", dataIndx: "D1", halign: "center", align: "center" },
		{ title: "Modelo"      , width: 80, dataType: "string", dataIndx: "D2", halign: "center", align: "center" },
		{ title: "Num. Medidor", width: 80, dataType: "number", dataIndx: "D3", halign: "center", align: "center" },
		
		{ title: "Fecha Crea." , width: 80, dataType: "string", dataIndx: "D4", halign: "center", align: "center" },
		{ title: "Estado"      , width: 80, dataType: "string", dataIndx: "D5", halign: "center", align: "center" }, //, hidden:true
		{ title: "Num. Unico"  , width: 90, dataType: "string", dataIndx: "D6", halign: "center", align: "center" }, //, hidden:true 

	];

	$grid_med = $("#div_grid_medidor").pqGrid(obj);
	
	$grid_med.pqGrid("refreshDataAndView");
}

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
function fn_carga_fechas(){
	var dato_ori = []; 
    var param2 =  {
		"md" :"raiz/operacion/ope_medidores/med_mantencion",
		"fl" :"ing_medidor",
		"fn" :"fn_fechasys"
    };
    
    HablaServidor(my_url,param2,'text', function(text){
        if(text != ""){
			dato_ori = text.split("|");
			$("#tx_fec_cre").val(dato_ori[0]);
					
		}
		else{
			fn_mensaje_boostrap("ERROR NO SE PUDO LEER FECHA", g_titulo, $(""));
			return;
		}       
    });
}
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
function fn_existencia(empresa, marca, modelo, medidor) {
	var arr = new Array(empresa, marca, modelo, medidor); // generamos un array
    var datos = JSON.stringify(arr); // lo pasamos a formato json
	
    g_existe = 0;
	//////////////////////////////////////////
    fn_buscamed(empresa, marca, modelo, medidor);
 
    if (g_existe == 1){ 
		$("#dlg_medidor").modal({backdrop: "static",keyboard:false});					
				$("#dlg_medidor").on("shown.bs.modal", function () {
					$grid_med.pqGrid( "refreshDataAndView" );
					$("#co_seleccionar").focus();  

	    });
	}
	else 
	{
	    $("#dlg_confirmaing").modal({backdrop: "static",keyboard:false});					
			$("#dlg_confirmaing").on("shown.bs.modal", function () {
			$("#co_confirmaing_no").focus();
		    $("#cb_estado").prop("disabled", false);  
		});
			            //
			            //return false;
	}
}
////////////////////////////////////////////////////////
function fn_buscamed(empresa, marca, modelo, medidor) {
	var arr = new Array(empresa, marca, modelo, medidor); // generamos un array
    var datos = JSON.stringify(arr); // lo pasamos a formato json
	var total_register;
	parameters = 
    {
	        "md"     :"raiz/operacion/ope_medidores/med_mantencion", 
	        "fl"     :"ing_medidor",
	        "fn"     :"fn_buscamed",
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
			sql_grid_medid = dataJSON.sql;
			
			if(total_register=0)
			   g_existe = 0;
			else
			   g_existe = 1;	 

            return { data: dataJSON.data};
        },
        error: function(jqErr, err_stat, err_str) // ERROR EN EL ASP
        {
			fn_mensaje_boostrap(jqErr.responseText, g_titulo, $("") );
        }
    }
	$grid_med.pqGrid( "option", "dataModel", dataModel );	
    $grid_med.pqGrid( "refreshDataAndView" );

}
////////////////////////////////////////////////////////
function fn_cargar_lectura(empresa, marca, modelo) {
	var arr = new Array(empresa, marca, modelo); // generamos un array
    var datos = JSON.stringify(arr); // lo pasamos a formato json
   
	parameters = 
	    {
	        "md"     :"raiz/operacion/ope_medidores/med_mantencion", 
	        "fl"     :"ing_medidor",
	        "fn"     :"fn_principal",
	        "datos"  :datos
	    };
	    
	    HablaServidor(my_url,parameters,'text', function(text){
	        
	        if (text != "") {
	           dato_ori = text.split("|");
	           
				
				$("#tx_anio_vida").val("");
	            $("#tx_anio_almacen").val("");
	            $("#tx_max_cons").val("");
	           
                $('#tx_error_exac').val("");
				$('#tx_diam').val("");
				$('#tx_tec').val("");
				$('#tx_cls_metro').val("");
                
                $("#chk_reac").prop("checked",false);
                $("#chk_reset").prop("checked",false);
                $("#chk_patron").prop("checked",false);

               //asignacion
	           if (dato_ori[0]== "S") {
	               $("#chk_reac").prop("checked",true);
	           }
	           if (dato_ori[1]== "S") {
	               $("#chk_reset").prop("checked",true);
	           }
	           if (dato_ori[6]== "S") {
	               $("#chk_patron").prop("checked",true);
	           }   

	           $("#tx_anio_vida").val(dato_ori[2]);
	           $("#tx_anio_almacen").val(dato_ori[3]);
	           $("#tx_max_cons").val(dato_ori[4]);
	           
               $('#tx_error_exac').val(dato_ori[10]);
      			
      		   $("#tx_diam").val(dato_ori[11]);
               $("#tx_tec").val(dato_ori[12]);
               $("#tx_cls_metro").val(dato_ori[13]);
	    		//$("#tx_fec_cre").val(dato_ori[13]);
	           //alert(dato_ori[6] + '-' + dato_ori[7]);
	           $("#tx_nitcc").val(dato_ori[6]); //datos ocultos solo para auditoria
	           $("#tx_tipoide").val(dato_ori[7]); //datos ocultos solo para auditoria
	           
	           $("#co_close").html("<span class='glyphicon glyphicon-remove'></span> Cancelar");

	           $("#co_leer").focus(); 
	          
	        }
	        else{
	            fn_mensaje_boostrap("NO EXISTEN CARACTERISTICAS DEL MODELO DEL MEDIDOR", g_titulo, $(""));
	            //$("#cb_est").prop("disabled", false);
	            return;
	        }
	    }); 
	    
}

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

function fn_validar_fecha(value) {
	var real, info;

	if (/^(0?[1-9]|[12][0-9]|3[01])[\/](0?[1-9]|1[012])[\/]\d{4}$/.test(value)) {
		info = value.split(/\//);
		var fecha = new Date(info[2], info[1] - 1, info[0]);
		if (Object.prototype.toString.call(fecha) === '[object Date]') {
			real = fecha.toISOString().substr(0, 10).split('-');
			if (info[0] === real[2] && info[1] === real[1] && info[2] === real[0]) {
				return true;
			}
			return false;
		} else {
			return false;
		}
	}
	else {
		return false;
	}
}



