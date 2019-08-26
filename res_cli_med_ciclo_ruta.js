var g_modulo="Cartera Morosa";
var g_tit = "Bandeja de Convenios Pendientes por Aprobar";
var g_tit2 = "Historial de Convenios de Pago";
var $grid_principal;
var $grid_conve;
var g_cliente_selec = "";
var parameters = {};
var Filtros = [];
var sql_grid_prim = "";
var sql_grid_conv = "";
var my_url = "conve_aprueba.asp";
var my_url2 = "conve_ingreso.asp";

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
    
    // PARA ELIMINAR EL SUBMIT
	$("button").on("click", function(){return false;});

    //INGRESA LOS TITULOS
    document.title = g_tit ;
	document.body.scroll = "yes";
    
	$("#div_header").load("header.htm", function() {
		$("#div_mod0").html(g_modulo);
		$("#div_tit0").html(g_tit);	
	});
	
	$("#excel_archivo").val("convenios_pendiente_aprobar.xls");
	/*
	$("#Rol").val(fn_get_param("Rol"));
	$("#tx_empresa").val(fn_get_param("Empresa"));
	$("#tx_rol").val(fn_get_param("Rol"));
	$("#tx_rolfun").val(fn_get_param("RolFun"));
	$("#tx_ip").val(fn_get_param("ip"));
	*/
    //DEFINE LA GRILLA PRINCIPAL
    fn_setea_grid_principal();
	//fn_carga_opcion_conv();
	//fn_carga_perfil();
	//fn_grilla_principal();
    
    //DIBUJA LOS ICONOS DE LOS BOTONES     
    
    $("#co_filtro").html("<span class='glyphicon glyphicon-search'></span> Filtros");
    $("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");
    $("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");    
    $("#co_excel2").html("<span class='glyphicon glyphicon-save'></span> Excel");

    //EVENTO BOTONES
    $("#co_filtro").on("click", fn_Muestra_Filtro);
    
	$("#co_aprobar").click(function(){
        if($.trim($("#co_aprobar").text()) == "Aprobar"){
			$("#tx_obs_apr").val("");
			$("#dlg_obs").modal({backdrop: "static",keyboard:false});
			$("#dlg_obs").on("shown.bs.modal", function () {
				$("#tx_obs_apr").focus();
			});	
		}
		else{
			window.open("contratoconv2.asp?par=0&emp="+$("#tx_empresa").val()+"&suministro="+$("#tx_cliente").val(),"_blank","toolbar=no,resizable=yes,menubar=no");
		}		
    });
	
	$("#co_anular").click(function(){
		$("#tx_obs_anu").val("");
		$("#dlg_obs_anu").modal({backdrop: "static",keyboard:false});
		$("#dlg_obs_anu").on("shown.bs.modal", function () {
			$("#tx_obs_anu").focus();
		});	
    });
	
	$("#co_confirmar_anu").click(function(){
		fn_anular();
	});
	
	$("#co_confirmar").click(function(){
		fn_aprobar();
	});
	
	$("#co_can_con").click(function(){
		$("#dlg_obs").modal("hide");
	});
	
	$("#co_can_anu").click(function(){
		$("#dlg_obs_anu").modal("hide");
	});
    
    $("#co_excel").on("click", function (e) {
		fn_filtro();
		e.preventDefault();
        var col_model=$( "#div_grid_principal" ).pqGrid( "option", "colModel" );
		var cabecera = "";
		for (i=0; i< col_model.length; i++){
			if(col_model[i].hidden != true) cabecera += "<th>"+col_model[i].title+ "</th>";
		}
		$("#excel_cabecera").val(cabecera);
		var element =$grid_principal.pqGrid("option","dataModel.data");
		if (element)
			a= element.length;
		else 
			a= 0;
		if(a>0){
			$("#tituloexcel").val(g_tit);
			$("#sql").val(sql_grid_prim);	
			$("#frm_Exel").submit();
			return;
		}	
    });
	
    $("#co_excel2").on("click", function (e) {
		e.preventDefault();
        var col_model=$( "#div_grid_conve" ).pqGrid( "option", "colModel" );
		var cabecera = "";
		for (i=0; i< col_model.length; i++){
			if(col_model[i].hidden != true) cabecera += "<th>"+col_model[i].title+ "</th>";
		}
		$("#excel_cabecera").val(cabecera);
		var element =$grid_conve.pqGrid("option","dataModel.data");
		if (element)
			a= element.length;
		else 
			a= 0;
		if(a>0){
			$("#filtro").val("");
			$("#tituloexcel").val(g_tit2+" - Cliente N°: "+$("#tx_cliente").val());
			$("#sql").val(sql_grid_conv);	
			$("#frm_Exel").submit();
			return;
		}	
    });
    
     $("#co_cerrar").on("click", function (e) {
        window.close(); 
    });    
    
    $("#co_volver1").on("click", function (e) {
        if($.trim($("#co_volver1").text()) == "Volver")
        {
            $("#div_prim0").slideDown();
            $("#div_conve").slideUp();
            $grid_principal.pqGrid( "refreshDataAndView" );
            $(window).scrollTop(0);
        }
    });
	
	$("#co_volver2").on("click", function (e) {
        if($.trim($("#co_volver2").text()) == "Volver")
        {
            $("#div_prim0").slideDown();
            $("#div_conve").slideUp();
            $grid_principal.pqGrid( "refreshDataAndView" );
            $(window).scrollTop(0);
        }
    });

	$("#co_close").on("click", function (e) {
        $('#div_filtro_bts').modal('hide'); 
    });
	
	$("#co_fil_aceptar").on("click", function (e) {
        $('#div_filtro_bts').modal('hide'); 
        fn_grilla_principal(); 
    });
	
	$("#co_fil_limpiar").on("click", function (e) {
        fn_limpia_filtro(); 
    });
    
    //EVENTO DBL_CLICK DE LA GRILLA
    $grid_principal.pqGrid({
		rowDblClick: function( event, ui ) {
			if (ui.rowData) 
				{
					var dataCell = ui.rowData;
					g_cliente_selec = dataCell.c2;
					fn_limpiar();
                    fn_carga_aprobacion();
				}
			}
	});
    
    // MASCARAS
	//CAMPOS DE FECHA

	$(".form_datetime").datetimepicker({
		format: "dd/mm/yyyy",
		autoclose: true,
		todayBtn: false,
		startDate: "01/01/2017",
		minView : 2,
		language: 'es'
	});

	//SOLO NUMEROS
	$("#tx_cliente").inputmask("integer");
	$("#tx_nro_cuotas").inputmask("integer");
	$("#tx_ant_saldo").inputmask("integer");
	$("#tx_fil_cliente").inputmask("integer");
	
	$("#tx_fil_deu_min").inputmask( "currency",{radixPoint:".", groupSeparator: ",", digits: 2, autoGroup: true, autoUnmask: true, max: parseInt($("#tx_fil_deu_max").val()) });
	$("#tx_fil_deu_max").inputmask( "currency",{radixPoint:".", groupSeparator: ",", digits: 2, autoGroup: true, autoUnmask: true, max: parseInt($("#tx_fil_deu_max").val()) });
	
	$("#tx_fil_cuo_min").inputmask( "decimal",{max: parseInt($("#tx_fil_cuo_max").val()), allowMinus: true });
	$("#tx_fil_cuo_max").inputmask( "decimal",{max: parseInt($("#tx_fil_cuo_max").val()), allowMinus: true });
	
	$("#tx_cuo_inicial").inputmask( "currency",{radixPoint:".", groupSeparator: ",", digits: 2, autoGroup: true, autoUnmask: true });
	$("#tx_deuda_total").inputmask( "currency",{radixPoint:".", groupSeparator: ",", digits: 2, autoGroup: true, autoUnmask: true });
	$("#tx_deu_convenir").inputmask( "currency",{radixPoint:".", groupSeparator: ",", digits: 2, autoGroup: true, autoUnmask: true });
	$("#tx_deu_inicial").inputmask( "currency",{radixPoint:".", groupSeparator: ",", digits: 2, autoGroup: true, });
    $("#tx_vlr_cuota").inputmask( "currency",{radixPoint:".", groupSeparator: ",", digits: 2, autoGroup: true, autoUnmask: true });
	
	$("#div_filtro_bts").draggable({
        handle: ".modal-header"
    });
	
	//fn_grilla_principal();
       
});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_setea_grid_principal()
{     
    var obj = {  
	        height: "100%",
            showTop: true,
			showBottom:true,
            showTitle : false,
            roundCorners: true,
            rowBorders: true,
            columnBorders: true,
            collapsible:false,
			editable:false,
            selectionModel: { type: 'row',mode:'single'},
            numberCell: { show: true },
			pageModel: { rPP: 20, type: "local", rPPOptions: [20, 50, 100]},
        	scrollModel:{theme:true},
			toolbar:
           {
               cls: "pq-toolbar-export",
               items:
               [
                   { type: "button", label: " Filtros"      ,  attr:"id=co_filtro", cls:"btn btn-primary"},
                   { type: "button", label: " Excel"        ,  attr:"id=co_excel"       , cls:"btn btn-primary"},
                   { type: "button", label: " Cerrar"       ,  attr:"id=co_cerrar"      , cls:"btn btn-primary"},
               ]
           }
        };
		
		
		obj.colModel = [		
            { title: "Periodo"  , width: 100, dataType: "string", dataIndx: "c1" , halign:"center",align:"center"},
            { title: "Regional", width: 100, dataType: "string", dataIndx: "c2" , halign:"center", align:"left"},
			{ title: "Ciclo", width: 0, dataType: "string",   dataIndx: "c3" , halign:"center", align:"left", hidden: true},
            { title: "Contratista", width: 250, dataType: "string", dataIndx: "c4" , halign:"center", align:"left"},
            { title: "Secuencia", width: 250, dataType: "string", dataIndx: "c5" , halign:"center", align:"left"},
            { title: "Fecha Ingreso", width: 100, dataType: "string", dataIndx: "c6" , halign:"center", align:"right"},
            { title: "Fecha Aprueba", width: 60, dataType: "string",  dataIndx: "c7" , halign:"center", align:"center"},
            { title: "Rol Aprueba", width: 100, dataType: "string", dataIndx: "c8" , halign:"center", align:"right"},
            { title: "Fecha Proceso de Carga", width: 100, dataType: "string", dataIndx: "c9" , halign:"center", align:"right"},
            { title: "Total Clientes por Leer", width: 100, dataType: "string", dataIndx: "c10" , halign:"center", align:"right"},
            { title: "Total Clientes Leidos", width: 60, dataType: "string",  dataIndx: "c11", halign:"center", align:"right"},
            { title: "Total Clientes Correctos", width: 250, dataType: "string", dataIndx: "c12", halign:"center", align:"left"},
            { title: "Total Clientes con Anomalias", width: 250, dataType: "string", dataIndx: "c13", halign:"center", align:"left"},
            { title: "Total Clientes sin Leer", width: 250, dataType: "string", dataIndx: "c14", halign:"center", align:"left"}    
        ];
		

    $grid_principal = $("#div_grid_principal").pqGrid(obj);

	
    var obj2 = {
        height: 300,
        showTop: true,
        showHeader: true,
        roundCorners: true,
        rowBorders: true,
		fillHandle: "",
        columnBorders: true,
        editable:false,
        selectionModel: { type: "row", mode:"single"},
        showTitle:false,
        collapsible:false,
        numberCell: { show: false },
        title: g_tit,
		pageModel: { rPP: 20, type: "local", rPPOptions: [20, 50, 100]},
        scrollModel:{theme:true},
        toolbar:
        {
            cls: "pq-toolbar-export",
            items:
            [
				{ type: "button", label: "Excel", attr:"id=co_excel2", cls:"btn btn-default btn-sm"}
            ]
        }
    };
	
	obj2.colModel = [
        { title: "Opcion", width: 200, dataType: "string", dataIndx: "C1", halign:"center", align:"left" },
        { title: "Estado", width: 140, dataType: "string", dataIndx: "C2", halign:"center", align:"left"},
        { title: "Creación", width: 120, dataType: "string", dataIndx: "C3", halign:"center", align:"center" },
        { title: "Fecha Fin", width: 120, dataType: "string", dataIndx: "C4", halign:"center", align:"center" },
        { title: "Deuda Inicial", width: 120, dataType: "string", dataIndx: "C5", halign:"center", align:"right" },
        { title: "Antig. Deuda", width: 80, dataType: "string", dataIndx: "C6", halign:"center", align:"center" },
        { title: "Abono Inicial", width: 120, dataType: "string", dataIndx: "C7", halign:"center", align:"right"},
        { title: "Valor Cuota", width: 120, dataType: "string", dataIndx: "C8", halign:"center", align:"right" },
        { title: "Nro. de Cuotas", width: 100, dataType: "string", dataIndx: "C9", halign:"center", align:"center" },
        { title: "Cuotas Fact.", width: 100, dataType: "string", dataIndx: "C10", halign:"center", align:"center" },
        { title: "Deuda Cierre", width: 120, dataType: "string", dataIndx: "C11", halign:"center", align:"right" },
        { title: "Nro. Atención", width: 120, dataType: "string", dataIndx: "C12", halign:"center", align:"center"},
        { title: "Creado Por", width: 150, dataType: "string", dataIndx: "C13", halign:"center", align:"center" },
        { title: "Finalizado Por", width: 150, dataType: "string", dataIndx: "C14", halign:"center", align:"center" }
    ];
	
    $grid_conve = $("#div_grid_conve").pqGrid(obj2);
	$grid_conve.pqGrid( "option", "dataModel.data", [] );
    $grid_conve.pqGrid( "refreshDataAndView" );
	$grid_conve.pqGrid( "scrollRow", { rowIndxPage: 10 } );	
    
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_Muestra_Filtro()
{
    $("#div_filtro_bts").modal({backdrop: "static",keyboard:false});
	$("#div_filtro_bts").on("shown.bs.modal", function () {
		$("#div_filtro_bts div.modal-footer button").focus();
		//Aplicar trabajo cuando esta visible el objeto	
	});

}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_carga_aprobacion()
{
    var v_nro_suministro = g_cliente_selec;
    
    if (v_nro_suministro == "")
    {
        fn_mensaje_boostrap("DEBE SELECCIONAR UN CONVENIO PARA APROBAR...", g_tit , $(""));
        return 0;
    }
        
    $("#div_conve").slideDown();
    $("#div_prim0").slideUp();
	$("#tx_cliente").val(g_cliente_selec);
	$("#co_anular").prop("disabled",true);
	$("#co_aprobar").prop("disabled",true);
	fn_carga_datos();
    $(window).scrollTop(0);
        
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_carga_datos()
{
    dato_original = [];

    parameters = {
                    "func":"fn_generales",
                    "empresa":$("#tx_empresa").val(),
					"rol":$("#tx_rol").val(),
					"ip":$("#tx_ip").val(),
                    "p_cliente":$("#tx_cliente").val()
                };

    HablaServidor(my_url2,parameters,'text', function(text) 
    {

        if($.trim(text)=="") {
            fn_mensaje_boostrap("NÚMERO DE CLIENTE NO EXISTE", g_tit, $("#tx_cliente"));
            return 0;
        }

        dato_original = text.split("|");
        $("#tx_nombre").val(dato_original[0]);
        $("#tx_direccion").val(dato_original[1]);
        $("#tx_estado").val(dato_original[2]);
        $("#tx_estado_con").val(dato_original[3]);
        $("#tx_regional").val(dato_original[4]);
        $("#tx_ruta").val(dato_original[5]);
        $("#tx_tarifa").val(dato_original[6]);
        $("#tx_actividad").val(dato_original[7]);
        $("#tx_ant_saldo").val(dato_original[8]);
        $("#tx_deuda_total").val(dato_original[9]);
        $("#tx_cod_regional").val(dato_original[10]);
		$("#tx_cod_tarifa").val(dato_original[11]);
		$("#tx_tipo_doc1").val(dato_original[12]);	
		$("#tx_nro_doc").val(dato_original[13]);
		$("#tx_nombres_p").val(dato_original[14]);
		$("#tx_ap_paterno").val(dato_original[15]);
		$("#tx_ap_materno").val(dato_original[16]);
		$("#tx_tel_p").val(dato_original[17]);
		$("#tx_mail_p").val(dato_original[18]);
		$("#tx_cod_est_sumi").val(dato_original[19]);
		$("#tx_conve_rest").val(dato_original[20]);
		$("#tx_estado_fact").val(dato_original[21]);
        $("#co_leer").prop("disabled", true);			
        $("#tx_cliente").prop("readonly", true);			
        $("#co_deuda").prop("disabled", false);
		
		
    });
	
	
	fn_grilla_conve();
	
	parameters = {
                    "func":"fn_conve_anyo",
                    "empresa":$("#tx_empresa").val(),
					"rol":$("#tx_rol").val(),
					"ip":$("#tx_ip").val(),
                    "p_cliente":$("#tx_cliente").val()
                };
	
	var conve_anio = 0;
	HablaServidor(my_url,parameters,'text', function(text) 
    {	
		conve_anio = parseInt(text);
	});
	
	if(conve_anio > parseInt( $("#tx_rol_con_anio").val() ) )
	{		
		fn_mensaje_boostrap("<p>EN 1 AÑO SE LE APROBARON  (<B>" + conve_anio + "</B>) DE CONVENIOS, EL ROL ESTA LIMITADO A CLIENTES CON MAXIMO (<B>" + $("#tx_rol_con_anio").val() + "</B>) CONVENIOS APROBADOS POR AÑO</P>", g_tit, $("#tx_cliente"));
		return;
	}
	
	//Validacion Cliente tiene convenio Vigente, aprobado o solicitado.
	parameters = {
                    "func":"fn_conve_existe",
                    "empresa":$("#tx_empresa").val(),
					"rol":$("#tx_rol").val(),
					"ip":$("#tx_ip").val(),
                    "p_cliente":$("#tx_cliente").val()
                };

	dato_original = [];
	flag2 = "";
    var aux_est_conve = "";
	var cor_conve = 0;
	HablaServidor(my_url2,parameters,'text', function(text) 
    {	
		if(text != ""){
			dato_original = text.split("|");
			flag2 = dato_original [0];
			cor_conve = dato_original [1];
			aux_est_conve = dato_original[2];
		}
	});
	
	if(cor_conve == "" )
	{		
		fn_mensaje_boostrap("CLIENTE NO TIENE CONVENIO PENDIENTE DE APROBACIÓN", g_tit, $("#tx_cliente"));
		return;
	}
	
	if(cor_conve != "" && aux_est_conve != "S")
	{		
		fn_mensaje_boostrap("CLIENTE TIENE UN CONVENIO EN ESTADO <B>" + flag2 +"</B>. NO ES POSIBLE REALIZAR APROBACIÓN EN ESTE MOMENTO.", g_tit, $("#tx_cliente"));
		return;
	}
	
	if(aux_est_conve == "A" || aux_est_conve == "V" ){
		$("#co_aprobar").html("<span class='glyphicon glyphicon-print'></span> Imprimir");
		$("#co_aprobar").prop("disabled",false);
		$("#co_anular").prop("disabled",true);
	}
	
	$("#tx_cor_conve").val(cor_conve);
	
	if(cor_conve != "" && aux_est_conve == "S")
	{	
		$("#co_anular").prop("disabled",false);
		fn_carga_conve_antiguo(cor_conve, aux_est_conve);
	}
	
	
	//Validación Cliente Activo
	if($("#tx_estado").val() != "ACTIVO"){
		fn_mensaje_boostrap("CLIENTE NO SE ENCUENTRA <B>ACTIVO</B>, NOTIFIQUE AL ÁREA RESPONSABLE.", g_tit, $("#tx_cliente"));
		return;
	}
	
	parameters = {
                    "func":"fn_deuda_con_act",
                    "empresa":$("#tx_empresa").val(),
					"rol":$("#tx_rol").val(),
					"ip":$("#tx_ip").val(),
                    "p_cliente":$("#tx_cliente").val(),
					"p_max_cor_docto":$("#tx_max_cor_docto").val()
                };
	
	var deuda_ini_act = 0;
	HablaServidor(my_url,parameters,'text', function(text) 
    {	
		deuda_ini_act = parseFloat(text);
	});
	
	$("#tx_deu_inicial_act").val(deuda_ini_act);
	
	
	if( parseFloat($("#tx_deu_inicial_act").val() ) > parseFloat($("#tx_deu_inicial").inputmask('unmaskedvalue'))  ){
		fn_mensaje_boostrap("LA DEUDA CONVENIBLE DEL CLIENTE: $ "+fn_formato_num($("#tx_deu_inicial_act").val(),2)+" SUPERA LA DEUDA CONVENIBLE INICIAL: "+$("#tx_deu_inicial").val()+".<BR> NO PUEDE REALIZAR APROBACIÓN DEL CONVENIO DE PAGO", g_tit, $("#tx_cliente"));
		return;
	}
	
	//Validacion Cliente Corporativo
	parameters = {
                    "func":"fn_valida_corp",
                    "empresa":$("#tx_empresa").val(),
					"rol":$("#tx_rol").val(),
					"ip":$("#tx_ip").val(),
                    "p_cliente":$("#tx_cliente").val()
                };

	var flag = 0;
	var flag2 = 0;
    HablaServidor(my_url2,parameters,'text', function(text) 
    {
		if(text=="S")
			flag = 1;
	});
	if(flag == 1)
	{		
		fn_mensaje_boostrap("NO ES POSIBLE REGISTRAR CONVENIOS SOBRE CLIENTES CORPORATIVOS", g_tit, $("#tx_cliente"));
		return;
	}
	
	//validacion Cliente con restriccion para realizar convenios.
	if($("#tx_conve_rest").val()=="S")
	{
		fn_mensaje_boostrap("CLIENTE TIENE RESTRINGIDA LA OPCIÓN DE SOLICITAR CONVENIOS DE PAGO", g_tit, $("#tx_cliente"));
		return;
	}
	
	//Validacion Cliente en facturación.
	if($("#tx_estado_fact").val()!="0")
	{
		fn_mensaje_boostrap("CLIENTE SE ENCUENTRA EN <B>PROCESO DE FACTURACIÓN</B>, NO SE LE PUEDE APROBAR UN CONVENIO EN ESTE MOMENTO", g_tit, $("#tx_cliente"));
		return;
	}
	
	//si llega hasta aquí y el convenio esta solicitado, se habilita el botón de aprobar
	if(aux_est_conve == "S" ){
		$("#co_aprobar").prop("disabled",false);
	}
	
	
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_carga_conve_antiguo(corr_conve, estado){
	
	var dato_original = [];
	parameters = {
                    "func":"fn_conve_existe_dat",
                    "empresa":$("#tx_empresa").val(),
					"rol":$("#tx_rol").val(),
					"ip":$("#tx_ip").val(),
                    "p_cliente":$("#tx_cliente").val(),
					"p_cor_conve":corr_conve
                };

	dato_original = [];
    HablaServidor(my_url2,parameters,'text', function(text) 
    {
		if(text!=""){
			dato_original = text.split("|");
			$("#tx_tipo_conve").val(dato_original[9]);
			$("#tx_opc_conve").val(dato_original[10]);
			$("#tx_deu_inicial").val(dato_original[2]);
			$("#tx_cuo_inicial").val(dato_original[3]);
			$("#tx_deu_convenir").val(dato_original[4]);
			$("#tx_nro_cuotas").val(dato_original[5]);
			$("#tx_vlr_cuota").val(dato_original[6]);
			$("#tx_motivo").val(dato_original[11]);
			$("#tx_obs").val(dato_original[8]);
			$("#tx_max_cor_docto").val(dato_original[12]);
			$("#co_limpiar").prop("disabled", true);
		}
		
		
	});
}


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_grilla_conve()
{
    parameters = 
    {
        "func":"fn_hist_conve",
        "p_cliente":$("#tx_cliente").val(),
        "empresa":$("#tx_empresa").val(),
		"rol":$("#tx_rol").val(),
		"ip":$("#tx_ip").val()
    };
	 
    var dataModel = 
    {        
        location: "remote",
        sorting: "local",
        dataType: "json",
        method: "POST",
        sortDir: ["up", "down"],
		async:false,
        url: my_url2+"?"+jQuery.param( parameters ),
        getData: function (dataJSON) 
        {
			total_register = $.trim(dataJSON.totalRecords);
			var data = dataJSON.data;
			sql_grid_conv=dataJSON.sql;
			if(total_register>=1)
			{
				$("#co_excel2").attr("disabled", false);
			}
            return { data: dataJSON.data};
        },
        error: function(jqErr, err_stat, err_str) // ERROR EN EL ASP
        {
			fn_mensaje_boostrap(jqErr.responseText, g_tit, $("") );
        }        
    }

    $grid_conve.pqGrid( "option", "dataModel", dataModel );
    $grid_conve.pqGrid( "refreshDataAndView" );
    
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_grilla_principal()
{
	
	fn_filtro();
	
    var dataModel = 
    {
        location: "remote",
        sorting: "local",
        dataType: "json",
        method: "POST",
        sortDir: ["up", "down"],
		async:false,
        url: my_url+"?"+jQuery.param( parameters ),
        getData: function (dataJSON) 
        {
			total_register = $.trim(dataJSON.totalRecords);
			var data = dataJSON.data;
			sql_grid_prim = dataJSON.sql;
			
			if(total_register>=1)
			{
				$("#co_excel").attr("disabled", false);
			}
            return { data: dataJSON.data};
        },
        error: function(jqErr, err_stat, err_str) // ERROR EN EL ASP
        {
			//fn_mensaje_boostrap(jqErr.responseText, g_tit, $("") );
			setTimeout(function(){ fn_mensaje_boostrap(jqErr.responseText, g_tit, $("") ) }, 0);
        }

    }

    $grid_principal.pqGrid( "option", "dataModel", dataModel );				
    $grid_principal.pqGrid( "refreshDataAndView" );
}


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_filtro()
{
	
	
	
	parameters = 
    {
		"func":"fn_grilla_prin",
		"empresa":$("#tx_empresa").val(),
		"rol":$("#tx_rol").val(),
		"ip":$("#tx_ip").val(),
		"p_fec_ini":$("#tx_fil_fec_ini").val(),
		"p_fec_fin":$("#tx_fil_fec_fin").val(),
		//"p_regional":$("#cb_fil_regional").val(),
		"p_opc_conve":$("#cb_fil_opc_conve").val(),
		"p_deu_min":$("#tx_fil_deu_min").val(),
		"p_deu_max":$("#tx_fil_deu_max").val(),
		"p_cuo_min":$("#tx_fil_cuo_min").val(),
		"p_cuo_max":$("#tx_fil_cuo_max").val(),
		"p_cliente":$("#tx_fil_cliente").val(),
		"p_rol_sol":$("#tx_fil_rol_sol").val()
		
    };
	
	Filtros = [];
	
	if ($("#tx_fil_cliente").val()!='') Filtros.push('N° Cliente = '+$("#tx_fil_cliente").val());
	if ($("#tx_fil_fec_ini").val()!='') Filtros.push('Fecha Desde = '+$("#tx_fil_fec_ini").val());
	if ($("#tx_fil_fec_fin").val()!='') Filtros.push('Fecha Hasta = '+$("#tx_fil_fec_fin").val());
	if ($("#cb_fil_opc_conve").val()!='') Filtros.push('Opción Convenio = '+$("#cb_fil_opc_conve").val());
	if ($("#tx_fil_deu_min").val()!='') Filtros.push('Deuda Min = '+$("#tx_fil_deu_min").val());
	if ($("#tx_fil_deu_max").val()!='') Filtros.push('Deuda Max = '+$("#tx_fil_deu_max").val());
	if ($("#tx_fil_cuo_min").val()!='') Filtros.push('Cuotas Min = '+$("#tx_fil_cuo_min").val());
	if ($("#tx_fil_cuo_max").val()!='') Filtros.push('Cuotas Max = '+$("#tx_fil_cuo_max").val());
    if ($("#tx_fil_rol_sol").val()!='') Filtros.push('Rol Solicita = '+$("#tx_fil_rol_sol").val().toUpperCase() );	
	
	$("#filtro").val(Filtros);

}



//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_carga_regional()
{
	
	var param= 
    {
        "func":"fn_regional",
        "Empresa":$("#tx_empresa").val(),
        "Rol":$("#Rol").val(),
		"Ip":$("#tx_ip").val()
    };
	
	HablaServidor(my_url, param, "text", function(text) 
    {
        $("#cb_fil_regional").html(text);
    });
	
}


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_carga_opcion_conv()
{
	
	var param= 
    {
        "func":"fn_opc_con",
        "Empresa":$("#tx_empresa").val(),
        "Rol":$("#Rol").val(),
		"Ip":$("#tx_ip").val()
    };
	
	HablaServidor(my_url, param, "text", function(text) 
    {
        $("#cb_fil_opc_conve").html(text);
    });
	
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_carga_perfil()
{
	
	var param= 
    {
        "func":"fn_perfil",
        "Empresa":$("#tx_empresa").val(),
        "Rol":$("#Rol").val(),
		"Ip":$("#tx_ip").val()
    };
	
	HablaServidor(my_url, param, "text", function(text) 
    {
        if($.trim(text)=="") {
            fn_mensaje_boostrap("NO SE ENCONTRÓ DATOS DE PERFIL PARA SU ROL", g_tit, $(""));
            return 0;
        }

        dato_original = text.split("|");
        $("#tx_fil_deu_min").val(dato_original[0]);		
		$("#tx_rol_deu_min").val(dato_original[0]);
		$("#tx_fil_deu_max").val(dato_original[1]);
		//$("#tx_fil_deu_min").inputmask("currency", { min: dato_original[0], max: dato_original[1] });
		//$("#tx_fil_deu_max").inputmask("currency", { min: dato_original[0], max: dato_original[1] });

		$("#tx_fil_cuo_min").val(dato_original[2]);
		$("#tx_rol_cuo_min").val(dato_original[2]);
		$("#tx_fil_cuo_max").val(dato_original[3]);
		$("#tx_rol_con_anio").val(dato_original[4]);
		

		
		//$("#tx_fil_cuo_max").inputmask( "decimal",{min:$("#tx_fil_cuo_min").val(), max: $("#tx_fil_deu_max").val(), allowMinus: true });
		//aqui el tipo de aprobacion
    });
	
}


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_limpia_filtro()
{
	$("#tx_fil_fec_ini").val("");
	$("#tx_fil_fec_fin").val("");
	$("#cb_fil_opc_conve").val("");
	$("#tx_fil_deu_min").val(0);
	$("#tx_fil_deu_max").val(0);
	$("#tx_fil_cuo_min").val("");
	$("#tx_fil_cuo_max").val("");
	$("#tx_fil_cliente").val("");
	$("#tx_fil_rol_sol").val("");
}


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_limpiar(){
    
    $("#tx_cliente").val("");
    $("#tx_nombre").val("");
    $("#tx_direccion").val("");
    $("#tx_estado").val("");
    $("#tx_estado_con").val("");
    $("#tx_regional").val("");
    $("#tx_ruta").val("");
    $("#tx_tarifa").val("");
    $("#tx_actividad").val("");
    $("#tx_ant_saldo").val("");
    $("#tx_convenida").val("");
    $("#tx_deuda_total").val("");
    $("#tx_deuda_conv").val("");
    $("#tx_deu_convenir").val("");
	
	$("#tx_cod_tarifa").val("");
    $("#tx_cod_regional").val("");
    $("#tx_tipo_doc1").val("");
    $("#tx_nro_doc").val("");
    $("#tx_nombres_p").val("");
    $("#tx_ap_paterno").val("");
    $("#tx_ap_materno").val("");
    $("#tx_tel_p").val("");
    $("#tx_mail_p").val("");
    $("#tx_cod_est_sumi").val("");
    $("#tx_conve_rest").val("");
    $("#tx_estado_fact").val("");
	$("#tx_cor_conve").val("");
	$("#tx_max_cor_docto").val("");
	
	$("#tx_tipo_conve").val("");
    $("#tx_opc_conve").val("");
    $("#tx_cuo_inicial").val("");
    $("#tx_min_cuo_ini").val("");
    $("#tx_max_cuo_ini").val("");  
    $("#tx_nro_cuotas").val("");
    $("#tx_min_nro_cuo").val("");
    $("#tx_max_nro_cuo").val("");   
    $("#tx_vlr_cuota").val("");
    $("#tx_min_valor_cuo").val("");
    $("#tx_max_valor_cuo").val("");
    $("#tx_tie_caduca").val("");
    $("#tx_nro_caducadas").val("");
    $("#tx_cod_cargo").val("");
    $("#tx_tie_cuo_ini").val("");
    $("#tx_opc_valor_cuo").val("");    
    $("#tx_motivo").val("");
    $("#tx_obs").val(""); 
	$("#tx_deu_inicial_act").val("");
	
	$("#co_aprobar").html("<span class='glyphicon glyphicon-check'></span> Aprobar");
	
	$("#co_deuda").prop("disabled", true);
    
}


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
//se aprueba el convenio.
function fn_aprobar()
{
	var dato_id;
	
	if($("#tx_obs_apr").val().length <15)
	{
		fn_mensaje_boostrap("LA OBSERVACIÓN DEBE TENER AL MENOS 15 CARACTERES", g_tit, $("#tx_obs_apr"));
		return false;
	}
	
	var param= 
	{
		"func": "fn_aprueba_conve",
		"empresa":$("#tx_empresa").val(),
		"rol":$("#tx_rol").val(),
		"ip":$("#tx_ip").val(),
		"p_cliente":$("#tx_cliente").val(),
		"p_observacion":$("#tx_obs_apr").val()
	};
	
	$("#dlg_obs").modal("hide");
	
	HablaServidor(my_url, param, "text", function(resp_serv) 
	{
		if($.trim(resp_serv)=="")
			resp_serv = "ACCIÓN REALIZADA!!!";
		
		fn_mensaje_boostrap(resp_serv, g_tit, $(""));		
	});
	
	//Se consulta el estado del convenio ingresado.
	//Si el estado es 'V' ó 'A' se habilita la impresión del Convenio. 
	var param= 
	{
		"func": "fn_valida_conve_estado",
		"empresa" : $("#tx_empresa").val(),
		"p_cliente":$("#tx_cliente").val()
    };
	
	var aux_estado = 0;
	HablaServidor(my_url, param, "text", function(text) 
	{
		if(text == "V" || text == "A"){  //estaba en 1
			$("#co_aprobar").html("<span class='glyphicon glyphicon-print'></span> Imprimir");
			$("#co_anular").prop("disabled",true);
		}
		else
			aux_estado = 1;
		if(text == "E"){
			$("#co_anular").prop("disabled",true);
		}
		
	});
	
	if(aux_estado == 1)
	{
		$("#co_aprobar").prop("disabled", true);	
		$(window).scrollTop(0);
	}
	$grid_conve.pqGrid( "refreshDataAndView" );
	
}


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
//se anula el convenio.
function fn_anular()
{
	var dato_id;
	
	if($("#tx_obs_anu").val().length <15)
	{
		fn_mensaje_boostrap("LA OBSERVACIÓN DEBE TENER AL MENOS 15 CARACTERES", g_tit, $("#tx_obs_anu"));
		return false;
	}
	
	var param= 
	{
		"func": "fn_anula_conve",
		"empresa":$("#tx_empresa").val(),
		"rol":$("#tx_rol").val(),
		"ip":$("#tx_ip").val(),
		"p_cliente":$("#tx_cliente").val(),
		"p_observacion":$("#tx_obs_anu").val()
	};
	
	$("#dlg_obs_anu").modal("hide");
	
	HablaServidor(my_url, param, "text", function(resp_serv) 
	{
		if($.trim(resp_serv)=="") 
		{
			resp_serv = "ACCIÓN REALIZADA!!!";
			$grid_conve.pqGrid( "refreshDataAndView" );
		}
		
		fn_mensaje_boostrap(resp_serv, g_tit, $(""));		
	});
	
	//Se consulta el estado del convenio anulado.
	//Si el estado es 'E' se deshabilita el boton anulacion y aprobacion. 
	var param= 
	{
		"func": "fn_conve_estado",
		"empresa":$("#tx_empresa").val(),
		"rol":$("#tx_rol").val(),
		"ip":$("#tx_ip").val(),
		"p_cliente":$("#tx_cliente").val(),
		"p_cor_convenio":$("#tx_cor_conve").val(),
    };
	
	HablaServidor(my_url, param, "text", function(text) 
	{
		if(text == "E"){
			$("#co_anular").prop("disabled",true);
			$("#co_aprobar").prop("disabled",true);
		}
		
	});
	
	
	
}

