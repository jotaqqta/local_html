
var g_modulo="Facturación Clientes - Consulta";
var g_titulo="Consulta de Reactivaciones por Consumo Detectado";
var url = "reac_con_detec.asp";
var agregar = 0; //0 no ha leido -- 1 se ha leido.
var rol_leido = false;  //variable que controla si se ha leido el rol correctamente antes de insertarlo.
var $grid;
var sql_excel;
var Filtros = [];
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
	$("#tx_empresa").val(SYNSegCodEmpresa);
	$("#tx_rol").val(SYNSegRol);
	$("#tx_rolfun").val(SYNSegRolFuncion);
	$("#tx_ip").val(SYNSegIP);	
	$("#tx_desc").attr("readonly", true);

	// PARA ELIMINAR EL SUBMIT
	$("button").on("click", function(){	return false;});

	$("#div_msg_bts").load("/raiz/syn_globales/bootstrap_msn.htm", function() {  //
			$("#div_msg_bts div.modal-header").addClass("rojo_mensaje");
		});

    //INVOCANDO LA CABECERA
    $("#div_header").load("/raiz/syn_globales/header.htm", function() {  //
		$("#div_mod0").html(g_modulo);
		$("#div_tit0").html(g_titulo);	
	});
    //INVOCANDO EL FOOTER
    $("#div_footer").load("/raiz/syn_globales/footer.htm");  //
	
	// INICIA CON EL CURSOR EN EL CAMPO FECHA
	//$("#fec_proc").focus();
	$("._input_selector").inputmask("dd/mm/yyyy");
	//$("._input_selector2").inputmask("mm/yyyy");
    
	//CAMPOS DE FECHA - VALIDACIONES Y FORMATO DE LAS FECHAS
    //PERIODO
	/*
    $(".form_datetime").datetimepicker({
        
        			viewMode: "years",
					format: "mm/yyyy",
					startDate: "01/2014",
					useCurrent: false,
					defaultDate:"",
					todayBtn: false,
					minView: 3,  //solo permite seleccionar hasta meses, no días
					startView: 4,  //iniciar en años
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
    	
         });*/
    

    //validacion del boton leer
    $("#co_leer").on("click", function(){
	       //Validación de informacion
            if( $("#fec_proc").val() == ""){
                fn_mensaje_boostrap("Faltan Datos", g_titulo, $("#fec_proc"));
                return;
            }
        
	
	//alert($("#fec_proc").val());}}

	    fn_generaExcel();
		
		
		
	
    });
    
    
    $("#co_cerrar").on("click", function () {
        window.close(); 
    });    
    
    
 
    //CARGA DE COMBOS FIJOS;
    fn_regional();
    fn_tarifa();


    // COMBO REGIONAL - AL SELECCIONAR la regional se carga el sector
	$("#cb_regional").on("change", function(evt) 
	{
		fn_ciclo($(this).val());
	});
	
   $("#co_volver").on("click", function(){	   	
	 $("#div_prim").slideDown();
	 $("#div_rol").slideUp();
	 $("#co_leer_nic").html("<span class='glyphicon glyphicon-search'></span> Leer");
	 fn_cancelar2();
	});
	
	Filtros = [];
});


function fn_generaExcel()
{
	
	var param= 
    {
        "func":"fn_excel",
        "empresa":$("#tx_empresa").val(),
		"p_cod_regional":$("#cb_regional").val(),
		"p_ciclo":$("#cb_ciclo").val(),
		"p_periodo":$("#fec_proc").val(),
		"p_fechaest":$("#fec_est").val(),
		"p_ruta":$("#tx_ruta").val(),
		"p_tarifa":$("#cb_tarifa").val()

    };
	
	HablaServidor(url, param, "text", function(text) 
    {
        sql_excel = text;
    });
	Filtros = [];
	$("#filtro").val("");
    if ($.trim($("#cb_regional").val()) != "") {
        Filtros.push("Regional = " + $("#cb_regional :selected").text());
    	
		if ($("#cb_ciclo").val() != "") {
			Filtros.push("Ciclo = " + $("#cb_ciclo").val());
		}
	}
	
    if ($("#fec_proc").val() != "") {
        Filtros.push("Periodo = " + $("#fec_proc").val());
    }
	
    if ($("#fec_est").val() != "") {
        Filtros.push("Fecha  = " + $("#fec_est").val());
    }
	
    if ($("#tx_ruta").val() != "") {
        Filtros.push("Ruta = " + $("#tx_ruta").val());
    }
	
    if ($("#cb_tarifa").val() != ""){
        Filtros.push("Tarifa = " + $("#cb_tarifa :selected").text());
    }
	
	$("#filtro").val("Filtros: "+Filtros);
     var cabecera = "";
		cabecera +="<th>FECHA PROCESO</th>";
		cabecera +="<th>FEC. CAMBIO EST. CONEXION</th>";
		cabecera +="<th>REGIONAL</th>"; 
		cabecera +="<th>SECTOR</th>";
		cabecera +="<th>RUTA</th>";
		cabecera +="<th>TARIFA</th>";
		cabecera +="<th>ACT. ECONOMICA</th>";
		cabecera +="<th>NRO. SUMINISTRO</th>";
		cabecera +="<th>LECTURA ANT.</th>";
		cabecera +="<th>LECTURA ACT.</th>";
		cabecera +="<th>DIAMETRO ARRANQUE</th>";
		
		cabecera +="<th>VALOR RECONEXION</th>";
		cabecera +="<th>MEDIDOR</th>";
		cabecera +="<th>OBSERVACION</th>";
	
		$("#excel_cabecera").val(cabecera);
		$("#tituloexcel").val(g_titulo);
		$("#sql").val(sql_excel);
		$("#frm_Exel").submit();
	
	
	
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_tarifa()
	{
		$("#cb_tarifa").html("");
		var param= 
			{
				"func":"fn_tarifa",
				"empresa":$("#tx_empresa").val()
			};

		HablaServidor(url, param, "text", function(text) 
			{

				$("#cb_tarifa").html(text);
				
			});
        //$("#cb_tarifa").html("<option value =''>  </option><option value='8100' selected>TARIFA 1</option><option value='1000'  >BOCAS DEL TORO</option><option value='4000'>CHIRIQUÍ</option><option value='2000'>COCLÉ</option><option value='3000'  >COLÓN</option><option value='6000'>HERRERA</option><option value='7000'>LOS SANTOS</option><option value='5000'  >PANAMÁ ESTE Y DARIEN</option><option value='8000'>PANAMÁ METRO</option><option value='8200'>PANAMÁ OESTE</option><option value='9000'>VERAGUAS</option>");
	}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	

function fn_regional()
	{
		$("#cb_regional").html("");
		$("#cb_ciclo").html("");
		$("#tx_desc").val("");
		//if($.trim($("#cb_tarifa").val())=="")
		//	return false;
		
		var param= 
			{
				"func":"fn_regional",
				"empresa":$("#tx_empresa").val()  
			};
		HablaServidor(url, param, "text", function(text) 
			{
              if(text != "")
				 $("#cb_regional").html(text);
				
			});
        
        //$("#cb_regional").html("<option value =''>  </option><option value='8100' selected>ARRAIJÁN</option><option value='1000'  >BOCAS DEL TORO</option><option value='4000'>CHIRIQUÍ</option><option value='2000'>COCLÉ</option><option value='3000'  >COLÓN</option><option value='6000'>HERRERA</option><option value='7000'>LOS SANTOS</option><option value='5000'  >PANAMÁ ESTE Y DARIEN</option><option value='8000'>PANAMÁ METRO</option><option value='8200'>PANAMÁ OESTE</option><option value='9000'>VERAGUAS</option>");
	}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_ciclo()
	{
		$("#cb_ciclo").html("");
	
	var param= 
		{
			"func":"fn_ciclo",
			"empresa":$("#tx_empresa").val(),
			"p_cod_regional":$("#cb_regional").val()
		};
	
	HablaServidor(url, param, "text", function(text) 
		{
			$("#cb_ciclo").html(text);
			
		});
}         //$("#cb_ciclo").html("<option value =''>  </option><option value='8100' selected>ARRAIJÁN</option><option value='1000'  >BOCAS DEL TORO</option><option value='4000'>CHIRIQUÍ</option><option value='2000'>COCLÉ</option><option value='3000'  >COLÓN</option><option value='6000'>HERRERA</option><option value='7000'>LOS SANTOS</option><option value='5000'  >PANAMÁ ESTE Y DARIEN</option><option value='8000'>PANAMÁ METRO</option><option value='8200'>PANAMÁ OESTE</option><option value='9000'>VERAGUAS</option>");
	

