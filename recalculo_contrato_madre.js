	var titulo = "Recálculo de Contratos Madres";
	var servidor = "amodfac_0017ajson.asp";
	var DatoOriginal = [];
	var d_tarifa;
	var d_documento;
	var d_vencimiento;
	var d_est_inmueble;
	var url = "amodfac_0017cAjax.asp";
	var respF;
	var $mydialog;
	var sexo ="";
	var fecha_actual = new Date();
	//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	$(document).keydown(function(e) {
	
		if (e.keyCode === 8) {
			var element = e.target.nodeName.toLowerCase();
			if ((element != 'input' && element != 'textarea') || $(e.target).attr("readonly")) {
				return false;
			}
		}
	});
	
	//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	$(document).ready(function() 
	{
				
		$(document).prop('title', titulo);
		$(".tit1").html(titulo);
		document.body.scroll = "yes";
    	$("#div_header").load("syn_globales/header.htm", function() {
			$("#div_mod0").html("Módulo de Facturación");
			$("#div_tit0").html(titulo);	
		});
	
		$("#div_footer").load("/syn_globales/footer.htm");
	
		$("#tx_cliente").on("keypress", fn_solonumeros);
		$("#tx_uni_h").on("keypress", fn_solonumeros);
		$("#tx_empleado").on("keypress", fn_solonumeros);
		$("#co_leer").html("<span class='glyphicon glyphicon-search'></span> Leer");
		$("#co_cancelar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");
		
		$("#co_leer").on("click", function(e)
		{			
		
			if ($.trim($("#co_leer").text()) == "Leer")
			{
				//DatoOriginal = [];
				if(document.getElementById("tx_cliente").value != "")
					fn_cliente();			
				else
					fn_mensaje_boostrap("DEBE DIGITAR UN NÚMERO DE SUMINISTRO!", titulo, $("#tx_cliente"));				
			}
			else
				fn_modificar();
				
		});
	//	$("#co_modif").on("click", fn_modificar);
		
		$("#co_cancelar").click(function(){
		
			if ($.trim($("#co_cancelar").text())=="Cerrar")
			{
				window.close();
			}
			else
			{
				Limpia_Campos();
				$("#co_cancelar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");
				$("#co_leer").html("<span class='glyphicon glyphicon-search'></span> Leer");
				$("#tx_cliente").val("");
				$("#tx_cliente").focus();
			}
		});
		/*
		$("#tx_empresa").val(SYNSegCodEmpresa);
		$("#tx_rol").val(SYNSegRol);
		$("#tx_rolfun").val(SYNSegRolFuncion);
		$("#tx_ip").val(SYNSegIP);
		*/
		$("#tx_cliente").bind("keydown",function(e){
			if(e.keyCode == 13){
				tab = true;
				fn_cliente();
				return false;
			}
		 });
		
		$("#ch_empleado").on("click",function(e){
		 $(this).val("N");
			if($(this).is(':checked'))
			{
				$(this).val("S");
				$("#tx_empleado").attr("disabled", false);
				$("#tx_empleado").focus();
			}
			else
			{
				$("#tx_empleado").val("");
				$("#tx_empleado").attr("disabled", true);
			}
		});
		
		// $("#ch_interes").on("click",function(e){
			 // $(this).val("N");
				// if($(this).is(':checked'))
				// {
					// $(this).val("S")
				// }
		// });
			 
		$("#ch_recargo").on("click",function(e){
			 $(this).val("N");
				if($(this).is(':checked'))
				{
					$(this).val("S")
				}
		});
		
		$("#ch_jubilado").on("click",function(e){
			 $(this).val("N");
				if($(this).is(':checked'))
				{
					if(!EsJubiladoEsDiscapacitado("ch_beneficio"))
						$(this).val("S");
					else
						$(this).prop("checked", false);
				}
		});
		$("#ch_beneficio").on("change", validaCheck);
		$("#ch_beneficio").on("click",function(e){
			 $(this).val("N");
				if($(this).is(':checked'))
				{
					if(!EsJubiladoEsDiscapacitado("ch_jubilado"))
					{
						$("#tx_fech_ini").focus();
						$(this).val("S");
					}
					else
						$(this).prop("checked", false);
				}
		});
			
		//$("#co_cancelar" ).text("Cerrar");		
		$("#tx_nombre").attr("disabled", true);
		$("#tx_direccion").attr("disabled", true);
		$("#tx_estado").attr("disabled", true);
		$("#tx_conex").attr("disabled", true);
		$("#tx_ruta").attr("disabled", true);
		$("#tx_sucursal").attr("disabled", true);
		$("#tx_tarifa").attr("disabled", true);
		$("#tx_act").attr("disabled", true);
		$("#tx_regional").attr("disabled", true);
		
		Limpia_Campos();
		
		$("#co_confirma_si").on("click", fn_carga_datos);		
					
		$("#co_confirma_no").on("click", function (e){
			$("#dlg_confirma").modal("hide");
			$("#tx_cliente").val("");
			$("#tx_cliente").focus();
		});
		
		$("#co_confirma_si2").on("click", fn_Modif2);
				
					
		$("#co_confirma_no2").on("click", function (e){
			$("#dlg_confirma2").modal("hide");
		});
		
		$("#co_confirma_si3").on("click", fn_Modif5);
				
					
		$("#co_confirma_no3").on("click", function (e){
			$("#dlg_confirma3").modal("hide");
		});
	});
	
	//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	function Limpia_Campos()
	{
		$("#frm_div_dat_ubicacion1 input").val("");
		$("#frm_div_dat_ubicacion1 textarea").val("");
		$(".frm_div_dat_facturacion input").val("");
		$(".frm_div_dat_facturacion input").attr("disabled", true);
		$(".frm_div_dat_facturacion select").attr("disabled", true);
		$(".frm_div_dat_facturacion textarea").attr("disabled", true);
		$("#ch_recargo").val('N');
		$("#ch_jubilado").val('N');
		$("#ch_empleado").val('N');
		$("#ch_beneficio").val('N');
		$("#ch_recargo").prop('checked', false);
		$("#ch_jubilado").prop('checked', false);
		$("#ch_empleado").prop('checked', false);
		$("#ch_beneficio").prop('checked', false);
		$(".frm_div_dat_facturacion select").val("");
		$("#DatosFijos textarea").val("");
		$(".frm_div_dat_facturacion textarea").val("");
		$("#co_leer").button("option", "disabled", false);
		$("#tx_cliente").val("");
		$("#tx_cliente").attr("disabled", false);
		$("#tx_dat1").val('');
		$("#tx_dat2").val('');
		$("#tx_dat3").val('');
		$("#tx_dat4").val('');
		$("#tx_dat5").val('');
		$("#tx_dat6").val(''),
		$("#tx_dat7").val(''),
		$("#tx_dat8").val(''),
		$("#tx_dat9").val(''),
		$("#tx_dat10").val(''),	
		$("#tx_dat11").val(''),
		$("#tx_dat12").val(''),
		$("#tx_dat13").val(''),
		$("#tx_nacimiento").attr("disabled", false);
		$("#tx_nacimiento").prop("readonly", true);
		$("#tx_cliente").focus();
	}
	
	//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
	function validarFecha(value){
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
			} else {
				return false;
			}
		}
		else {
			return false;
		}
		
	}
	
	//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
	function validaFecIni(){
		var real, info;
		info = $("#tx_fech_ini").val().split(/\//);
		var fecha = new Date(info[2], info[1]-1, info[0]);
		fecha.setHours(0,0,0,0);
		fecha_actual.setHours(0,0,0,0);
		if (fecha > fecha_actual) {
			return false;
		}
		return true;		
	}
	
	//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
	function validaFecFin(){
		var info1, info2;
		info1 = $("#tx_fech_ini").val().split(/\//);
		info2 = $("#tx_fech_fin").val().split(/\//);
		var fecha1 = new Date(info1[2], info1[1]-1, info1[0]);
		var fecha2 = new Date(info2[2], info2[1]-1, info2[0]);
		fecha1.setHours(0,0,0,0);
		fecha2.setHours(0,0,0,0);
		if (fecha1 > fecha2) {
			return false;
		}
		return true;		
	}
	
	//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
	function alfanumerico(obj){
		var tecla = obj.which;

		if(65<=tecla && tecla<=90 || 97<=tecla && tecla<=122 || 32<=tecla && tecla<=57 || tecla == 209 || tecla == 241  || tecla == 180){
		}
		else
		{
			return false;
		}
	}

	 //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
	function fn_solonumeros() 
	{
		if ((event.keyCode < 48) || (event.keyCode > 57)) 
		 event.returnValue = false;
	}
	
	 //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
	function fn_cliente()
	{				

		DatoOriginal = [];
		if(document.getElementById('tx_cliente').value != "")
		{
		
					var parameters = {
					'func':'fuValidaEsEnFacturacion',
					'valor1':document.getElementById("tx_cliente").value,
					'Empresa':document.getElementById("tx_empresa").value
					};
				
				
					HablaServidor(url, parameters, 'text', function(myRtn) 
					{
						if ($.trim(myRtn) == "S")
						{
							$("#dlg_confirma").modal({backdrop: "static",keyboard:false});					
							$("#dlg_confirma").on("shown.bs.modal", function () {
									$("#co_confirma_no").focus();
							});
						}
						else
							fn_carga_datos();
					});				
		}
		else
			fn_mensaje_boostrap("DEBE DIGITAR UN NÚMERO DE SUMINISTRO!", titulo, $("#tx_cliente"));
	}

	//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
	function fn_carga_datos()
	{
		var parametros = {
						"func":"grilla",
						"empresa":$("#tx_empresa").val(),
						"cliente":document.getElementById('tx_cliente').value
						};
		
		HablaServidor(servidor,parametros,'text', function(text) 
		{
			DatoOriginal = text.split("|");
			$(".frm_div_dat_facturacion input").attr("disabled", false);
			$(".frm_div_dat_facturacion select").attr("disabled", false);
			$("#tx_nacimiento").attr("disabled", false);
			$("#tx_nacimiento").prop("readonly", true);
			$(".frm_div_dat_facturacion textarea").attr("disabled", false);
			$("#tx_nombre").val(DatoOriginal[0]);
			$("#tx_direccion").val(DatoOriginal[1]);
			
			$("#tx_estado").val(DatoOriginal[4]);
			$("#tx_conex").val(DatoOriginal[19]);
			
			$("#tx_tarifa").val(DatoOriginal[15]);
			$("#tx_act").val(DatoOriginal[21]);
			$("#tx_regional").val(DatoOriginal[13]);
			$("#tx_ruta").val(DatoOriginal[12]);
			
			//alert(DatoOriginal[39]);
			
			$("#cb_tarifa").val(DatoOriginal[39]);
			$("#cb_tarifa_ori").val(DatoOriginal[39]);
			d_tarifa=$("#cb_tarifa option:selected").html();
			
			$("#txt_unidad_ori").val(DatoOriginal[43]);
			$("#tx_uni_h").val(DatoOriginal[43]);
			
			$("#ch_recargo").val('N');
			$("#ch_cargo_ori").val('N');
			if(DatoOriginal[41]=='S') 
			{
				$("#ch_recargo").prop('checked', true);
				$("#ch_recargo").val('S');
				$("#ch_cargo_ori").val('S');
			}
			
			$("#ch_jubilado").val('N');
			$("#ch_jubidado_ori").val('N');
			//alert(DatoOriginal[40]);
			if(DatoOriginal[40]=='S') 
			{
				$("#ch_jubilado").prop('checked', true);
				$("#ch_jubilado").val('S');
				$("#ch_jubidado_ori").val('S');
			}
			
			$("#ch_empleado").val('N');
			$("#ch_empleado_ori").val('N');
			if(DatoOriginal[45]=='S') 
			{
				$("#ch_empleado").prop('checked', true);
				$("#ch_empleado").val('S');
				$("#ch_empleado_ori").val('S');
			}
			
			$("#ch_beneficio").val('N');
			$("#ch_beneficio_ori").val('N');
			if(DatoOriginal[49]=='S') 
			{
				$("#ch_beneficio").prop('checked', true);
				$("#ch_beneficio").val('S');
				$("#ch_beneficio_ori").val('S');
			}
			validaCheck();
			
			// $("#ch_interes").val('N');
			// $("#ch_interes_ori").val('N');
			// if(DatoOriginal[42]=='S') 
			// {
				// $("#ch_interes").prop('checked', true);
				// $("#ch_interes").val('S');
				// $("#ch_interes_ori").val('S');
			// }

			$("#tx_tipoidentidad").val(DatoOriginal[9]);
			$("#tx_pnroidentidad").val(DatoOriginal[10]);
				
			$("#cb_documento").val(DatoOriginal[37]);
			$("#cb_tipodocumento_ori").val(DatoOriginal[37]);
			d_documento=$("#cb_documento option:selected").html();
			
			$("#cb_vencimiento").val(DatoOriginal[44]);
			$("#cb_tipvto_ori").val(DatoOriginal[44]);
			d_vencimiento=$("#cb_vencimiento option:selected").html();
			sexo = DatoOriginal[48];
			$("#tx_empleado").val(DatoOriginal[46]);
			$("#tx_nacimiento").val(DatoOriginal[47]);
			$("#txt_nacimiento_ori").val(DatoOriginal[47]);
			 
			$("#fec_inicio_ori").val(DatoOriginal[50]);					
			$("#fec_fin_ori").val(DatoOriginal[51]);

			$( "#tx_fech_ini" ).val($( "#fec_inicio_ori" ).val());
			$( "#tx_fech_fin" ).val($( "#fec_fin_ori" ).val());
			$( "#tx_fec_nacimiento" ).val($( "#fec_naci" ).val());
			
			//var lockDate = new Date($('#tx_fech_ini').datepicker('getDate'));
			//$('input#tx_fech_fin').datepicker('option', 'minDate', lockDate);
		
			$("#tx_cliente").attr("disabled", true);
			$("#co_leer").html("<span class='glyphicon glyphicon-edit'></span> Modificar");
			$("#co_cancelar").html("<span class='glyphicon glyphicon-remove'></span> Cancelar");
			//$("#co_modif").button("option", "disabled", false);
			//$("#co_leer").button("option", "disabled", true);
			//$("#co_cancelar").text("Cancelar");
		});
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

		$("#cb_tarifa").html("");
		
		var param= 
			{
				"func":"Tarifa",
				"empresa":$("#tx_empresa").val()
			};
		
		HablaServidor(servidor, param, "text", function(text) 
			{
				$("#cb_tarifa").html(text);
			});
	}

	//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	function fn_documento()
	{

		$("#cb_documento").html("");
		
		var param= 
			{
				"func":"TipDocumento",
				"empresa":$("#tx_empresa").val()
			};
		
		HablaServidor(servidor, param, "text", function(text) 
			{
				$("#cb_documento").html(text);
				
			});
	}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	function fn_vencimiento()
	{
		
		$("#cb_vencimiento").html("");
		
		var param= 
			{
				"func":"TipVencimiento",
				"empresa":$("#tx_empresa").val()
			};
		
		HablaServidor(servidor, param, "text", function(text) 
			{
				$("#cb_vencimiento").html(text);			
			});
	}
	
	//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	function fn_predio()
	{
		
		$("#cb_predio").html("");
		
		var param= 
			{
				"func":"Predio",
				"empresa":$("#tx_empresa").val()
			};
		
		HablaServidor(servidor, param, "text", function(text) 
			{
				$("#cb_predio").html(text);
			});
	}

	//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	function fn_modificar()
	{
	
	
	try
	{


		if(!fn_validar()) return;
				
		var cant_c = parseInt($("#tx_observacion").val().length);
		if (cant_c>250) {
			fn_mensaje_boostrap("SOLO SE PERMITE UN MÁXIMO DE 250 CARACTERES EN LA OBSERVACIÓN!", titulo, $(""));
			   $("#tx_observacion").focus();
			   $("#tx_observacion").setCursorToTextEnd();
			return false;
		}
			
		if ($("#ch_beneficio").is(':checked')) {
			
			if ($.trim($("#tx_fech_ini").val()) == "" ) {//if1
				fn_mensaje_boostrap("INGRESE LA FECHA DE INICIO PARA DECUENTO DE DISCAPACIDAD!", titulo, $("#tx_fech_ini"));
				return false;
			}//fin-if1
			
			if ($.trim($("#tx_fech_fin").val()) == "") {//if1
				fn_mensaje_boostrap("INGRESE LA FECHA DE FIN PARA DESCUENTO DE DISCAPACIDAD!", titulo, $("#tx_fech_fin"));
				return false;
			}//fin-if1
			
			if (validarFecha($("#tx_fech_ini").val()) == false){
				fn_mensaje_boostrap("INFORMACIÓN INCORRECTA EN EL CAMPO FECHA DE INICIO PARA DESCUENTO DE INCAPACIDAD. EL FORMATO ES DD/MM/YYYY", titulo, $("#tx_fech_ini") );
				return false;
			}
			
			if (validarFecha($("#tx_fech_fin").val()) == false){
				fn_mensaje_boostrap("INFORMACIÓN INCORRECTA EN EL CAMPO FECHA DE FIN PARA DESCUENTO DE INCAPACIDAD. EL FORMATO ES DD/MM/YYYY", titulo, $("#tx_fech_fin") );
				return false;
			}
			
			if( validaFecIni() == false){
				fn_mensaje_boostrap("LA FECHA DE INICIO PARA DESCUENTO DE INCAPACIDAD, NO PUEDE SER SUPERIOR A LA FECHA ACTUAL.", titulo, $("#tx_fech_ini") );
				return false;
			}
			
			if( validaFecFin() == false){
				fn_mensaje_boostrap("LA FECHA DE FIN PARA DESCUENTO DE INCAPACIDAD, NO PUEDE SER INFERIOR A LA FECHA DE INICIO.", titulo, $("#tx_fech_fin") );
				return false;
			}
			
			
			
			// VALIDA LA TRIFA SI APLICA PARA DISCAPACIDAD
			
			var parameters = {
				'func': 'ValidaTarifaJub',
				'valor1': $("#cb_tarifa").val(),
				'Empresa': $("#tx_empresa").val()
			};
			
			HablaServidor(url, parameters, 'text', function(myRtn) 
			{
				result = myRtn.split("|");
			});
			
			if (($.trim(result[0]) != "S")) {
				fn_mensaje_boostrap("PARA ESTA TARIFA NO APLICA EL BENEFICIO DE EQUIPARACIÓN ECONÓMICA POR DISCAPACIDAD!", titulo, $(""));
				return false;
			}
			
			// VALIDA SI EL SUMINISTRO ES MATRIZ REMARCADOR
			parameters = {
				'func': 'validaRemarcador',
				'Cod_Empresa': $("#tx_empresa").val(),
				'Nro_Suministro': $("#tx_cliente").val()
			};
			
			HablaServidor(url, parameters, 'text', function(myRtn) 
			{
				result = myRtn.split("|");
			});
			
			if (($.trim(result[0]) != "0")) {
				fn_mensaje_boostrap("CLIENTE ES CONTRATO MADRE, NO SE PUEDE ASIGNAR EQUIPARACIÓN ECONÓMICA POR DISCAPACIDAD!", titulo, $(""));
				return false;
			}
			
			if ($("#tx_uni_h").val() * 1 > 1) {
				fn_mensaje_boostrap("CLIENTE TIENE MAS DE 1 UNIDAD HABITACIONAL, NO SE PUEDE ASIGNAR EQUIPARACIÓN ECONÓMICA POR DISCAPACIDAD!", titulo, $(""));
				return false;
			}
			
		}
				
			
		if (!fuValidaNulos())
		return;
				
				
			if ($.trim($("#cb_tarifa").val()) != DatoOriginal[39]) 
			{
				//ans = true;
				
				var parameters = {
					'func': 'fuValidaColectivo',
					'valor1': $("#tx_cliente").val(),
					'Empresa': $("#tx_empresa").val()
				};
				
				HablaServidor(url, parameters, 'text', function(myRtn)
				{
					var result = myRtn.split("|");
						result = parseInt(result[0]);
					if (result > 0) 
					{						
						
						$("#dlg_confirma2").modal({backdrop: "static",keyboard:false});					
							$("#dlg_confirma2").on("shown.bs.modal", function () {
									$("#co_confirma_no2").focus();
						});								
					}
					else
					{
						fn_Modif2();
					}
				});
			}
			else {
				fn_Modif2();
			}
	}
	catch(err) 
	{
		alert(err.message);
	}	
	}

	//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*    
	function fn_validar()
	{		 
		var datant;
		var datact;
		var flag;
		datant = "";
		datact = "";
		flag = 0;
		
		datant = datant + DatoOriginal[39]+"-"+d_tarifa + ":";
		datact = datact + $("#cb_tarifa").val()+"-"+$("#cb_tarifa option:selected").html()+":";
		if($("#cb_tarifa").val() != DatoOriginal[39])
		{
			document.getElementById('tx_dat1').value = "1";
			flag = flag + 1;		
		}
		
		datant = datant + DatoOriginal[43] + ":";
		datact = datact + $("#tx_uni_h").val() + ":";
		if($("#tx_uni_h").val() != DatoOriginal[43])
		{
			document.getElementById('tx_dat2').value = "1";
			flag = flag + 1;
		}
		
		// datant = datant + DatoOriginal[42] + ":";
		// datact = datact + $("#ch_interes").val() + ":";
		// if($("#ch_interes").val() != DatoOriginal[42])
		// {
			// document.getElementById('tx_dat3').value = "1";
			// flag = flag + 1;
		// }
		
		datant = datant + DatoOriginal[41] + ":";
		datact = datact + $("#ch_recargo").val() + ":";
		if($.trim($("#ch_recargo").val()) != $.trim(DatoOriginal[41]))
		{
			document.getElementById('tx_dat4').value = "1";
			flag = flag + 1;
		}

		datant = datant + DatoOriginal[40] + ":";
		datact = datact + $("#ch_jubilado").val() + ":";
		if($.trim($("#ch_jubilado").val()) != $.trim(DatoOriginal[40]))
		{
			document.getElementById('tx_dat5').value = "1";
			flag = flag + 1;
		}
		
		datant = datant + DatoOriginal[45] + ":";
		datact = datact + $("#ch_empleado").val() + ":";
		if($.trim($("#ch_empleado").val()) != $.trim(DatoOriginal[45]))
		{
			document.getElementById('tx_dat6').value = "1";
			flag = flag + 1;
		}
		
		if($.trim($("#tx_nacimiento").val()) != $.trim(DatoOriginal[47]))
		{
			datant = datant + DatoOriginal[47] + ":";
			datact = datact + $("#tx_nacimiento").val() + ":";
			document.getElementById('tx_dat7').value = "1";
			flag = flag + 1;
		}
		
		datant = datant + DatoOriginal[46] + ":";
		datact = datact + $("#tx_empleado").val() + ":";
		if($.trim($("#tx_empleado").val()) != $.trim(DatoOriginal[46]))
		{
			document.getElementById('tx_dat8').value = "1";
			flag = flag + 1;
		}
		
		datant = datant + DatoOriginal[56]+"-"+d_documento+":";
		datact = datact + $("#cb_documento").val()+"-"+$("#cb_documento option:selected").html()+":";
		if($.trim($("#cb_documento").val()) != $.trim(DatoOriginal[37]))
		{
			document.getElementById('tx_dat9').value = "1";
			flag = flag + 1;
		}
		
		datant = datant + DatoOriginal[56]+"-"+d_vencimiento+ ":";
		datact = datact + $("#cb_vencimiento").val()+"-"+$("#cb_vencimiento option:selected").html()+":";
		if($.trim($("#cb_vencimiento").val()) != $.trim(DatoOriginal[44]))
		{
			document.getElementById('tx_dat10').value = "1";
			flag = flag + 1;
		}
		
		datant = datant + DatoOriginal[56] + ":";
		datact = datact + $("#ch_beneficio").val() + ":";
		if($.trim($("#ch_beneficio").val()) != $.trim(DatoOriginal[49]))
		{
			document.getElementById('tx_dat11').value = "1";
			flag = flag + 1;
		}
		
		datant = datant + DatoOriginal[50] + ":";
		datact = datact + $("#tx_fech_ini").val() + ":";
		if($.trim($("#tx_fech_ini").val()) != $.trim(DatoOriginal[50]))
		{
			document.getElementById('tx_dat12').value = "1";
			flag = flag + 1;
		}
		
		datant = datant + DatoOriginal[51] + ":";
		datact = datact + $("#tx_fech_fin").val() + ":";
		if($.trim($("#tx_fech_fin").val()) != $.trim(DatoOriginal[51]))
		{
			document.getElementById('tx_dat13').value = "1";
			flag = flag + 1;
		}
		
		if (flag == 0)
		{
			fn_mensaje_boostrap("NO SE REALIZARON MODIFICACIONES!", titulo, $("#co_cancelar"));
			return false;
		}
		
		document.getElementById('cadenaant').value = datant;
		document.getElementById('cadenaact').value = datact;
		return true;
	}

	//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	function EsJubiladoEsDiscapacitado(ObjControl)
	{
		if($("#"+ObjControl).is(':checked'))
		{
			fn_mensaje_boostrap("NO ES POSIBLE TENER AMBOS BENEFICIOS AL MISMO TIEMPO. [DESCUENTO DE JUBILADO Y LA EQUIPARACIÓN ECONÓMICA POR DISCAPACIDAD].", titulo, $(""));

			return true;
		}
		return false;
	}
	
	//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
	function fuValidaNulos()
	{
		if ($("#cb_TipoDocumento").val() == '')
		{
				fn_mensaje_boostrap("DEBE SELECCIONAR TIPO DE DOCUMENTO.", titulo, $(""));
				//mensaje("DEBE SELECCIONAR TIPO DE DOCUMENTO.",48,"Mensaje!");
				//$("#infomsg").html("DEBE SELECCIONAR TIPO DE DOCUMENTO.");
				//$( "#dialog" ).dialog("open");	
			if (!document.getElementById('cb_TipoDocumento').disabled)
				document.getElementById('cb_TipoDocumento').focus();
			return false;
		}
		return true;
	}
	
	//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	function fuValidaTipVen()
	{
		if ($('#cb_vencimiento').val() == '')
		{
			fn_mensaje_boostrap("DEBE SELECCIONAR TIPO DE VENCIMIENTO !", titulo, $(""));

			if (!document.getElementById('cb_vencimiento').disabled)
				document.getElementById('cb_vencimiento').focus();
			return false;
		}
		return true;
	}
	
	//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	function Valida_DtoEmpleado()
	{

		var parameters = {
		'func':'TarifaResidencia',
		'valor1':$("#cb_tarifa").val(),
		'Empresa':$("#tx_empresa").val()
		};
		
		Detener = false;
		HablaServidor(url, parameters, 'text', function(myRtn) 
		{
			if ($.trim(myRtn) == "0")
			{
				
				fn_mensaje_boostrap("PARA PODER ASIGNAR A LA CUENTA EL DESCUENTO DE EMPLEADO, EL CLIENTE DEBE TENER UNA TARIFA RESIDENCIAL.", titulo, $(""));
				Detener = true;
			}
		});
		
		var parameters = {
		'func':'ValidaEmpleado',
		'valor1':$("#tx_cliente").val(),
		'Empleado':$("#tx_empresa").val()
		};
		
		HablaServidor(url, parameters, 'text', function(myRtn) 
		{
			if ($.trim(myRtn) != "")
			{
				fn_mensaje_boostrap("EL N° DE EMPLEADO INDICADO YA TIENE ASOCIADA OTRA CUENTA: " + myRtn, titulo, $(""));
				Detener = true;
			}
		});
			
		var parameters = {
		'func':'ValidaIdentificacion',
		'valor1':$("#tx_cliente").val(),
		'Empresa':$("#tx_empresa").val()
		};
		
		HablaServidor(url, parameters, 'text', function(myRtn) 
			{
				if ($.trim(myRtn) != "")
				{
					var result = myRtn.split("|");
					identificacion = result[0];
					cliente = result[1];
					tipo_id = result[2];
					fn_mensaje_boostrap("EL NÚMERO DE IDENTIDAD DEL PROPIETARIO YA TIENE OTRA CUENTA CON EL DESCUENTO DE EMPLEADO (IDENTIDAD:"+identificacion+" /TIPO"+tipo_id+" / CLIENTE"+cliente+")", titulo, $(""));
					Detener = true;
				}
			});
			
		if(Detener)
			return Detener;	
	}

	//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	function fn_Modif2()
	{
		var faro=true;
		/*if (!Valida_Unidad())	return;*/
		var parameters = {
			'func':'fuCuentaUnidades',
			'valor1':$("#tx_cliente").val(),
			'Empresa':$("#tx_empresa").val()
		};
			
		HablaServidor(url, parameters, 'text', function(myRtn) 
		{
			var result = myRtn.split("|");
			UnidadLegalizadas = result[0];
			
			if ($("#tx_uni_h").val()*1 < UnidadLegalizadas*1)
			{
				fn_mensaje_boostrap("EL NÚMERO DE UNIDADES HABITACIONALES NO <BR>PUEDEN SER MENOR A LA CANTIDAD QUE ESTÁN YA LEGALIZADAS!", titulo, $(""));
			}
			else
			{
				fn_Modif3();
			}
		});
	}
	
	//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	function fn_Modif3()
	{
		var parameters = {
			'func':'ValidaTarifaJub',
			'valor1':$("#cb_tarifa").val(),
			'Empresa':$("#tx_empresa").val()
		};
		
		HablaServidor(url, parameters, 'text', function(myRtn) 
		{
			var result = myRtn.split("|");
			
			if (($.trim(result[0])!="S") && (document.getElementById('ch_jubilado').checked))
			{
				fn_mensaje_boostrap("PARA ESTA TARIFA NO ES POSIBLE ASIGNAR DESCUENTO DE JUBILADO -1", titulo, $(""));
			}
			else
			{
				fn_Modif4();
			}
		});
	}
	
	//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	function fn_Modif4()
	{
		if (!fuValidaTipVen()) {
			return;
		}

		if (document.getElementById('ch_jubilado').checked)
			JubiladoNuevo = "S";
		else
			JubiladoNuevo = "N";
			
		if (JubiladoNuevo == "S")
		{

			if ($('#tx_nacimiento').val() == "" || sexo == "" || sexo == "X")
			{
				fn_mensaje_boostrap("PARA APLICAR DESCUENTO DE JUBILADO SE DEBE TENER ACTUALIZADA LA FECHA DE NACIMIENTO Y EL GÉNERO DEL PROPIETARIO", titulo, $(""));
				faro=false;
				return;
			}
			else
			{
				var parameters = {
					'func':'ValidaSysdate'
				};
							
					HablaServidor(url, parameters, 'text', function(myRtn) 
					{
						var result = myRtn.split("|");										
						var fecnac = $('#tx_nacimiento').val();
						var dia= result[0];
						
						var aFecha1 = fecnac.split('/'); 
						var aFecha2 = dia.split('/'); 
						
						CalculateDateDiff(new Date(aFecha1[2],aFecha1[1],aFecha1[0]), new Date(aFecha2[2],aFecha2[1],aFecha2[0]));
												
						var parameters = {
							'func':'ValidaEdadJu',
							'valor1':sexo,
							'Empresa':$("#tx_empresa").val()
						};
						
						HablaServidor(url, parameters, 'text', function(myRtn) 
						{
							var result = myRtn.split("|");
							var edadju= result[0];

							edadju=parseInt(edadju);
							if (years <  edadju)
							{
								$("#dlg_confirma3").modal({backdrop: "static",keyboard:false});					
								$("#dlg_confirma3").on("shown.bs.modal", function () {
										$("#co_confirma_no3").focus();
								});
							}
							else
							{
								fn_Modif5();
							}
							
						});						
				});							
			}
		}
		else
			fn_Modif5();
	}
	
	//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	function fn_Modif5()
	{
		$("#dlg_confirma3").modal("hide");
		
		if (document.getElementById('ch_recargo').checked)
			RecargoNuevo = "S";
		else
			RecargoNuevo = "N";

/*		if (document.getElementById('ch_interes').checked)
			InteresNuevo = "S";
		else
			InteresNuevo = "N";
		*/

		//lpgz 19 enero 2010 Req. No. 17777
		if (document.getElementById('ch_empleado').checked)
		{
			if (document.getElementById('tx_empleado').value =="")
			{
				fn_mensaje_boostrap("DEBE INDICAR EL N° DE EMPLEADO", titulo, $(""));
				faro=false;
				return;
				
			}
			
			Detener = false;
			if (Valida_DtoEmpleado()){
				faro=false;
				return faro;
			}
		}
		Detener = false;
		//------ hasta aqu�-------
		var xLegalizar = (($("#tx_uni_h").val()*1)-(UnidadLegalizadas*1))
		$("#txt_xlegalizar").val(xLegalizar);
		if (document.getElementById('ch_jubilado').checked==true)
		{
			
			var parameters = {
			'func':'saca_identidad',
			'valor1':$("#tx_cliente").val(),
			'Empresa':$("#tx_empresa").val()
			};
							
			HablaServidor(url, parameters, 'text', function(myRtn) 
			{
				var result = myRtn.split("|");
								
						var tip_doc1 = result[0];
						var nro_docto1 = result[1];
						var tip_doc2 = result[2];
						var nro_docto2 = result[3];

					var parameters = {
						'func':'valida_otros_suministro',
						'valor1':$("#tx_cliente").val(),
						'Empresa':$("#tx_empresa").val(),
						'tip_doc1':tip_doc1,
						'nro_docto1':nro_docto1,
						'tip_doc2':tip_doc2,
						'nro_docto2':nro_docto2
					};	
				
					HablaServidor(url, parameters, 'text', function(myRtn) 
					{
						if ($.trim(myRtn) != "")
						{
							var result = myRtn.split("|");
							var cliente_jubilado= result[0];

							fn_mensaje_boostrap("EL PROPIETARIO YA TIENE DESCUENTO DE JUBILADO CON EL CLIENTE N°. " + cliente_jubilado + ".<BR>NO SE PERMITE APLICAR ESTE BENEFICIO A OTRA CUENTA.", titulo, $(""));
							Detener = true;
						}
						
					});
			});
		}
		
		if(Detener)
			return false;	
		
		var parameters = {
			'func':'ValidaClienteCasoSocial',
			'valor1':$("#tx_cliente").val(),
			'Empresa':$("#tx_empresa").val()
		};

		Detener = false;
		HablaServidor(url, parameters, 'text', function(myRtn) 
		{
			//var result = myRtn.split("|");
			
			if ($.trim(myRtn) != "")
			{
				var parameters = {
					'func':'ValidaTarifaCasoSocial',
					'valor1':$("#cb_tarifa").val(),
					'Empresa':$("#tx_empresa").val()
				};
					
				HablaServidor(url, parameters, 'text', function(myRtn) 
				{
					var result = myRtn.split("|");

					if ($.trim(result[0])=="N")
					{
						fn_mensaje_boostrap("LA TARIFA "+$("#cb_tarifa :selected").text()+ " NO PERMITE SUBSIDIO POR CASO SOCIAL.", titulo, $(""));
						Detener = true;
					}
					
				});		
			}
			else
			{
				Detener = false;
			}

		});
		
		if(Detener)
			return false;
		
		if (document.getElementById('tx_observacion').value == "")	{
			fn_mensaje_boostrap("DEBE DIGITAR UNA OBSERVACIÓN.", titulo, $(""));
			document.getElementById('tx_observacion').focus();
			faro=false;
			return false;
		}

		if (document.getElementById('tx_observacion').value.length < 15)	{
			fn_mensaje_boostrap("DEBE DIGITAR DIGITAR UNA OBSERVACIÓN CON MAS DE 15 CARACTERES.", titulo, $(""));
			document.getElementById('tx_observacion').focus();
			faro=false;
			return false;
		}
		//+"|"+$("#ch_interes").val()
		$("#tmpvalor").val($("#ch_recargo").val()+"|"+$("#ch_beneficio").val()+"|"+$("#ch_jubilado").val()+"|"+$("#ch_empleado").val());
		
			var parameters = {
				'func':'Guardar',
				'cliente': document.getElementById('tx_cliente').value,
				'tarifa':$("#cb_tarifa").val(),
				'cb_tarifa_ori':$("#cb_tarifa_ori").val(),
				'unidad':$("#tx_uni_h").val(),
				'txt_unidad_ori':$("#txt_unidad_ori").val(),
				'xLegalizar':$("#txt_xlegalizar").val(),				
				//'ch_interes_ori':$("#ch_interes_ori").val(),
				'ch_cargo_ori':$("#ch_cargo_ori").val(),
				'ch_jubidado_ori':$("#ch_jubidado_ori").val(),						
				'nacimiento':$("#tx_nacimiento").val(),
				'txt_nacimiento_ori':$("#txt_nacimiento_ori").val(),
				'ch_empleado_ori':$("#ch_empleado_ori").val(),
				'numempleado':$("#tx_empleado").val(),
				'txt_empleado_ori':$("#txt_empleado_ori").val(),
				'documento':$("#cb_documento").val(),
				'cb_tipodocumento_ori':$("#cb_tipodocumento_ori").val(),
				'vencimiento':$("#cb_vencimiento").val(),
				'cb_tipvto_ori':$("#cb_tipvto_ori").val(),
				'ch_beneficio_ori':$("#ch_beneficio_ori").val(),
				'fecha_inicio':$("#tx_fech_ini").val(),
				'fec_inicio_ori':$("#fec_inicio_ori").val(),
				'fecha_fin':$("#tx_fech_fin").val(),
				'fec_fin_ori':$("#fec_fin_ori").val(),
				'observacion':$("#tx_observacion").val(),
				'rol':$("#tx_rol").val(),
				'ip':$("#tx_ip").val(),
				'cadenaant':$("#cadenaant").val(),
				'cadenaact':$("#cadenaact").val(),
				'pTipoIdentidad':$("#tx_tipoidentidad").val(),
				'pNroIdentidad':$("#tx_pnroidentidad").val(),
				'dat1':$("#tx_dat1").val(),
				'dat2':$("#tx_dat2").val(),
				'dat3':$("#tx_dat3").val(),
				'dat4':$("#tx_dat4").val(),
				'dat5':$("#tx_dat5").val(),
				'dat6':$("#tx_dat6").val(),
				'dat7':$("#tx_dat7").val(),
				'dat8':$("#tx_dat8").val(),
				'dat9':$("#tx_dat9").val(),
				'dat10':$("#tx_dat10").val(),	
				'dat11':$("#tx_dat11").val(),
				'dat12':$("#tx_dat12").val(),
				'dat13':$("#tx_dat13").val(),
				'tmpvalor':$("#tmpvalor").val(),											
				'empresa':$("#tx_empresa").val()
			};

			HablaServidor(servidor,parameters,'text', function(text) 
			{
				$("#co_cancelar").text("Cancelar")
				$("#co_cancelar" ).trigger( "click" );
				Limpia_Campos();
				fn_mensaje_boostrap(text, titulo, $("#tx_cliente"));			
			});
	
	
	}
	//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	function CalculateDateDiff(dateFrom, dateTo) 
	{
		var difference = (dateTo - dateFrom);

		years = Math.floor(difference / (1000 * 60 * 60 * 24 * 365));
	}
	//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	function validaCheck()
	{
		if($("#ch_beneficio").is(":checked"))
			{
				$("#tx_fech_ini").removeAttr("disabled");
				$("#tx_fech_fin").removeAttr("disabled");
			}
		else
			{
				$("#tx_fech_ini").attr("disabled",true);
				$("#tx_fech_ini").prop("value","");
				$("#tx_fech_fin").attr("disabled",true);
				$("#tx_fech_fin").prop("value","");
			}
	}