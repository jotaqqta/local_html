
var g_modulo="Facturaci�n Clientes - Consulta";
var g_titulo="Consulta de Reactivaciones por Consumo Detectado";
//var url = "reactivaciones_con_a_json.asp";
var agregar = 0; //0 no ha leido -- 1 se ha leido.
var rol_leido = false;  //variable que controla si se ha leido el rol correctamente antes de insertarlo.
var $grid;
//Funcion que evita que el navegador se regresa al presionar la tecla BackSpace.
//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
$(document).keydown(function(e) {
       if (e.keyCode === 8 ) {
           var element = e.target.nodeName.toLowerCase();
           if ((element != 'input' && element != 'textarea') || $(e.target).attr("readonly")) {
               return false;
           }
       }
   });

$(document).ready(function() {

	document.body.scroll = "yes";
	$("#tx_empresa").val(fn_get_par("Empresa"));
	$("#tx_rol").val(fn_get_par("Rol"));
	$("#tx_ip").val(fn_get_par("ip"));
	$("#tx_rolfun").val(fn_get_par("RolFun"));	
	$("#tx_cen_rolfun").val(fn_get_par("SYNSegCodCentroOperFun"));	
	$("#tx_desc").attr("readonly", true);

	// PARA ELIMINAR EL SUBMIT
	$("button").on("click", function(){	return false;});

	$("#div_msg_bts").load("bootstrap_msn.htm", function() {  ///raiz/syn_globales/
			$("#div_msg_bts div.modal-header").addClass("rojo_mensaje");
		});

    //INVOCANDO LA CABECERA
    $("#div_header").load("header.htm", function() {  ///raiz/syn_globales/
		$("#div_mod0").html(g_modulo);
		$("#div_tit0").html(g_titulo);	
	});
    //INVOCANDO EL FOOTER
    $("#div_footer").load("footer.htm");  ///raiz/syn_globales/
	
	// INICIA CON EL CURSOR EN EL CAMPO FECHA
	$("#fec_proc").focus();
    //CAMPOS DE FECHA

	/*$(".form_datetime").datetimepicker({
        
       //fn_mensaje_bootstrap("Debe digitar el periodo", g_titulo, $("#fec_proc"));
       
	});*/
    
    //validacion de las fechas
    $(".form_datetime").datetimepicker({
        
        			viewMode: "years",
					format: "mm/yyyy",
					startDate: "01/2014",
					useCurrent: false,
					defaultDate:"",
					todayBtn: false,
					minView: 3,  //solo permite seleccionar hasta meses, no d�as
					startView: 4,  //iniciar en a�os
					endDate: "+0d",  //No habilitar fechas futuras
					autoclose: true,
					language: "es"
		
         }); 
    //validaicon de la fecha de cambio de estado
    
     $(".form_datetime2").datetimepicker({
        
        format: "dd/mm/yyyy",
		autoclose: true,
		todayBtn: false,
		startDate: "01/01/2017",
		minView : 2,
		language: 'es'
    	
         });
    

    //validacion del boton leer
    $("#co_leer").on("click", function(){
	       //Validaci�n de informacion
            if( $("#fec_proc").val() == ""){
                fn_mensaje_boostrap("Faltan Datos", g_titulo, $("#fec_proc"));
                return;
            }
        
        alert($("#fec_proc").val());

	//HAcer la funcionalidad adicional
	/*$("#tx_cod_cliente").val("123456");
	$("#tx_nombre").val("Pepito Perez");
	$("#tx_rol_actual").val("Maria");
	$("#co_reasignar").prop("disabled",false);*/
    });
    
    
    $("#co_cerrar").on("click", function () {
        window.close(); 
    });    
    
    //Evento leer
    /*$("#co_leer").on("click", function (e) {
	  if (fn_valida_datos())
 	   {
		fn_leer_equipo();
		$("#co_cerrar").html("<span class='glyphicon glyphicon-remove'></span> Cancelar");
		$("#co_leer_nic").html("<span class='glyphicon glyphicon-search'></span> Leer");
		$("#co_leer").attr("disabled", true);
	   }
    });*/

    
 
    //fn_carga_regional();
    fn_regional();
    fn_tarifa();


// AL SELECCIONAR la regional se carga el sector
	$("#cb_regional").on("change", function(evt) 
	{
		fn_ciclo($(this).val());
	});
	


//EVENTO CLICK PARA AGREGAR ROL AL EQUIPO
/*$("#co_rol").on("click", function (e) {
	 if(agregar == 1)
	 {
		 $("#div_prim").slideUp();
		 $("#div_rol").slideDown();
		 $("#div_tipo").text($("#cb_tipo_equipo option:selected").html().toUpperCase());
		 $("#div_eq").text("EQUIPO "+$("#cb_equipo option:selected").html().toUpperCase());
		 $("#tx_rol_nuevo").focus();
	 }
});*/

//evento leer nic de usuario
/*$("#co_leer_nic").on("click", function (e) {											
	var $co_ref = $(this);
	
	if($.trim($(this).text())=="Leer")
	{		
	 fn_leer_rol($co_ref);
	}
	else{
		$("#co_leer_nic").html("<span class='glyphicon glyphicon-search'></span> Leer");
		fn_cancelar2();
		$("#tx_rol_nuevo").focus();	
	}
	return false;

});

//evento guardar
$("#co_guardar").on("click", function (e) {
	 fn_guardar();
});*/

   $("#co_volver").on("click", function(){	   	
	 $("#div_prim").slideDown();
	 $("#div_rol").slideUp();
	 $("#co_leer_nic").html("<span class='glyphicon glyphicon-search'></span> Leer");
	 fn_cancelar2();
	});
	
});


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
/*function fn_valida_datos()	
{	

	if($.trim($("#cb_tipo_equipo").val())=="")
	{
		fn_mensaje("DEBE SELECCIONAR EL TIPO DE EQUIPO", g_titulo,$("#cb_tipo_equipo"));
		return false;
	}
	if($.trim($("#cb_regional").val())=="")
	{
		fn_mensaje("DEBE SELECCIONAR LA REGIONAL", g_titulo,$("#cb_regional"));
		return false;
	}
	if($.trim($("#cb_equipo").val())=="")
	{
		fn_mensaje("DEBE SELECCIONAR EL EQUIPO", g_titulo,$("#cb_equipo"));
		return false;
	}
	return true;
}*/

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_leer_equipo()
{
	var total_register=0;
	var dataModel = {};
	parameters = 
	{
		"func":"grid_equipo_rol",
		"empresa":$("#tx_empresa").val(),
		"p_equipo":$("#cb_equipo").val()
	};
	agregar = 1;
	dataModel = 
	{
		location: "remote",
		sorting: "local",
		dataType: "json",
		method: "POST",
		curPage: 1,
		async: false,
		sortDir: ["up", "down"], 
		url:url+"?"+$.param(parameters),
		getData: function (dataJSON)
		{
			total_register = $.trim(dataJSON.totalRecords);
			var data = dataJSON.data;
			var sql_excel= JSON.stringify(dataJSON.sql);
			$("#sql").val(eval(sql_excel));	
			
			return {data: dataJSON.data};
		},				
		error: function(jqErr, err_stat, err_str) // ERROR EN EL ASP
		{
			$("#lb_mensaje").html(jqErr.responseText);
			$( "#dialog-message" ).dialog({title: g_titulo,modal: true,height:250,width:400,
				buttons: [{
					text:"Ok",
					click: function() {
					$( this ).dialog( "close" );
					}
				}]
			});	
		}					
	}
	$grid.pqGrid( "option", "dataModel", dataModel);	
	$grid.pqGrid( "option", "pageModel.type", "local");
	$grid.pqGrid( "option", "pageModel.rPP", "500");	
	$grid.pqGrid( "refreshDataAndView" );
	$grid.pqGrid( "option", "showBottom", false);
	$("#cb_tipo_equipo").attr("disabled", true);
	$("#cb_regional").attr("disabled", true);
	$("#cb_equipo").attr("disabled", true);
	$("#tx_rol").focus();
	
	return true;
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_get_par(variable){
	
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i=0;i<vars.length;i++) {
		   var pair = vars[i].split("=");
		   if(pair[0] == variable){return pair[1];}
	}
	return(false);	
	
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_tarifa()
	{
		/*$("#cb_tipo_equipo").html("");
		var param= 
			{
				"func":"fn_tipo_equipo",
				"empresa":$("#tx_empresa").val()
			};

		HablaServidor(url, param, "text", function(text) 
			{

				$("#cb_tipo_equipo").html(text);
				
			});*/
        $("#cb_tarifa").html("<option value =''>  </option><option value='8100' selected>TARIFA 1</option><option value='1000'  >BOCAS DEL TORO</option><option value='4000'>CHIRIQU�</option><option value='2000'>COCL�</option><option value='3000'  >COL�N</option><option value='6000'>HERRERA</option><option value='7000'>LOS SANTOS</option><option value='5000'  >PANAM� ESTE Y DARIEN</option><option value='8000'>PANAM� METRO</option><option value='8200'>PANAM� OESTE</option><option value='9000'>VERAGUAS</option>");
	}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	

function fn_regional()
	{
		/*$("#cb_regional").html("");
		$("#cb_seccion").html("");
		//$("#tx_desc").val("");
		if($.trim($("#cb_tarifa").val())=="")
			return false;
		
		var param= 
			{
				"func":"fn_regional",
				"empresa":$("#tx_empresa").val(),
				"p_tipo":$("#cb_tipo_equipo").val()
			};
		HablaServidor(url, param, "text", function(text) 
			{
              if(text != "")
				 $("#cb_regional").html(text);
				
			});*/
        
        $("#cb_regional").html("<option value =''>  </option><option value='8100' selected>ARRAIJ�N</option><option value='1000'  >BOCAS DEL TORO</option><option value='4000'>CHIRIQU�</option><option value='2000'>COCL�</option><option value='3000'  >COL�N</option><option value='6000'>HERRERA</option><option value='7000'>LOS SANTOS</option><option value='5000'  >PANAM� ESTE Y DARIEN</option><option value='8000'>PANAM� METRO</option><option value='8200'>PANAM� OESTE</option><option value='9000'>VERAGUAS</option>");
	}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_ciclo()
	{
		/*$("#cb_equipo").html("");
		$("#tx_desc").val("");
		if($.trim($("#cb_regional").val())=="")
			return false;
		var param= 
			{
				"func":"fn_equipo",
				"empresa":$("#tx_empresa").val(),
				"p_tipo":$("#cb_tipo_equipo").val(),
				"p_regional":$("#cb_regional").val()
			};

		HablaServidor(url, param, "text", function(text) 
			{

				$("#cb_equipo").html(text);
				
			});*/
         $("#cb_ciclo").html("<option value =''>  </option><option value='8100' selected>ARRAIJ�N</option><option value='1000'  >BOCAS DEL TORO</option><option value='4000'>CHIRIQU�</option><option value='2000'>COCL�</option><option value='3000'  >COL�N</option><option value='6000'>HERRERA</option><option value='7000'>LOS SANTOS</option><option value='5000'  >PANAM� ESTE Y DARIEN</option><option value='8000'>PANAM� METRO</option><option value='8200'>PANAM� OESTE</option><option value='9000'>VERAGUAS</option>");
	}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_leer_rol($el)
	{
		var flag = false;
		if($("#tx_rol_nuevo").val() != "")
		{
			var param= 
			{
				"func":"fn_existe_rol",
				"empresa":$("#tx_empresa").val(),
				"p_rol_equipo":$("#tx_rol_nuevo").val(),
				"p_equipo":$("#cb_equipo").val()
				
			};

			HablaServidor(url, param, "text", function(text) 
			{				
				if($.trim(text)!="") 
				{	
					flag = true;
					fn_mensaje("EL ROL YA TIENE ESTE EQUIPO ASIGNADO", g_titulo, $("#tx_rol_nuevo"));
					fn_cancelar2();
					return false;
				}			
			});
			
			if(!flag)
			{
				var param= 
				{
					"func":"fn_busca_rol",
					"empresa":$("#tx_empresa").val(),
					"p_rol_equipo":$("#tx_rol_nuevo").val()
				};	
				HablaServidor(url, param, "text", function(text) 
				{
					if($.trim(text)=="") 
					{	
						fn_mensaje("ROl NO EXISTE!", g_titulo, $("#tx_rol_nuevo"));
						$("#tx_rol_nuevo").val("");
						return false;
					}			
					DatoOriginal = text.split("|");
					$("#tx_nom").val(DatoOriginal[0]);
					$("#tx_id").val(DatoOriginal[1]);
					$("#tx_cargo").val(DatoOriginal[2]);
					$("#tx_area").val(DatoOriginal[3]);
					$("#tx_regional_rol").val(DatoOriginal[4]);
					$("#co_leer_nic").html("<span class='glyphicon glyphicon-remove'></span> Cancelar");
					$("#tx_obs").focus();
					$("#tx_rol_nuevo").attr("readonly", true);
					rol_leido = true;
				});
				
				if($.trim($("#cb_regional").val()) != $.trim($("#tx_regional_rol").val()))
				{
					fn_mensaje("ROL NO PERTENECE A LA REGIONAL " + $("#cb_regional option:selected").text(), "Mensaje",$("#tx_rol_nuevo"));
					$("#co_guardar").prop("disabled", true);
				}
				else
					$("#co_guardar").prop("disabled", false);
				
			}
		}
		else
			fn_mensaje("DEBE DIGITAR UN ROL", g_titulo,$("#tx_rol_nuevo"));
	
	}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_guardar()
	{
		if(rol_leido)
		{
			if($("#tx_obs").val().length <16)
			{
				fn_mensaje("LA DESCRIPCI�N DEBE TENER AL MENOS 15 CARACTERES", g_titulo, $("#tx_obs"));
				return false;
			}	

			var param= 
			{
				"func":"fn_insert",
				"empresa":$("#tx_empresa").val(),
				"p_rol_equipo":$("#tx_rol_nuevo").val(),
				"p_equipo":$("#cb_equipo").val(),
				"p_obs":$("#tx_obs").val(),
				"p_ip":$("#tx_ip").val(),
				"p_rol":$("#tx_rol").val(),
			};
			HablaServidor(url, param, "text", function(text) 
			{
				fn_mensaje("ACCI�N REALIZADA!!!", g_titulo, $("#tx_rol_nuevo"));
				rol_leido = false;
				$( "#co_volver" ).trigger( "click" );						
				$grid.pqGrid( "refreshDataAndView" );
			});
		}
		else
			fn_mensaje("DEBE LEER UN ROL.", g_titulo, $("#tx_rol_nuevo"));
			
	}
	
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_desc_equipo()
	{
		$("#tx_desc").val("");
		if($.trim($("#cb_equipo").val())=="")
			return false;
		$("#tx_desc").val("");
		$("#tx_desc").val($("#cb_equipo").find("option:selected").attr("descrip"));
	}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_cancelar()
{
	$("#cb_tipo_equipo").val("");
	$("#cb_regional").val("");
	$("#cb_equipo").val("");
	$("#tx_desc").val("");
	$("#cb_tipo_equipo").attr("disabled", false);
	$("#cb_regional").attr("disabled", false);
	$("#cb_equipo").attr("disabled", false);
	$("#co_leer").attr("disabled", false);
	$("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");
	$grid.pqGrid( "option", "dataModel.data", []);
	$grid.pqGrid( "refreshView" );
	$("#cb_tipo_equipo").focus();
	agregar = 0;
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_cancelar2()
{
	$("div#div_rol input").val("");
	$("div#div_rol textarea").val("");
	$("#tx_rol_nuevo").attr("readonly", false);
	rol_leido = false;
}