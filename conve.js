var g_modulo="Cartera Morosa";
var g_tit="Ingreso de Convenios";
var $grid;
var DatoOriginal = [];
var grilla_prin = [];
var my_url = "conve.asp";
var cuo_ini_cal, nro_cuo_cal, vlr_cuo_cal;

$(document).ready(function() {
    
	document.body.scroll = "yes";
    // SE COLOCAN LOS TITULOS
    $("#div_mod0").html(g_modulo);
    $("#div_tit0").html(g_tit);
	document.title = g_tit;
	$("#tituloexcel").val(g_tit);
	$("#excel_archivo").val("historial_convenios.xls");
	$("#Rol").val(fn_get_param("Rol"));

	$("#tx_empresa").val(fn_get_param("emp"));
	$("#tx_rol").val(fn_get_param("rol"));
	$("#tx_rolfun").val(fn_get_param("rolfun"));
	$("#tx_ip").val(fn_get_param("Ip"));
    
    $("#tx_ord_ate").val(fn_get_param("ordg_atencion"));
    
    
	fn_setea_grid_principal();
    fn_carga_tip_conve();
    fn_carga_motivos();
    fn_carga_tip_doc();
    fn_carga_tip_doc2();
    fn_habilita(true);
    fn_habilita_dia(true);
    
	$("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");
	
	//Eventos
    $("#co_leer").on("click", fn_leer_cliente);
    
    $("#tx_cliente").on("keydown", function(event) {
        var tecla =  event.which || event.keyCode;
        if(tecla==13)
        {		
            $("#co_leer").trigger( "click" );
            return false;
        }
    });
        
    $("#cb_tipo_conve").on("change", function(evt) 
	{
        if($(this).val() =="")
            fn_limpiar2(); //se limpian los combos inferiores
		else
			fn_carga_opc_conve(); //Se carga el combo siguiente
	});
    
    $("#cb_opc_conve").on("change", function(evt) 
	{
        fn_carga_opc($(this).val());
	});
    
    $("#ch_propietario").on('click', function (e) {
        if($("#ch_propietario").prop("checked") == true )
            fn_leer_propietario();
        else{
            fn_limpiar_dia_com();
            fn_habilita_dia2(false);
        } 
    });
    
    
    $("#cb_tipo_doc").on("change", function(evt) 
	{
        fn_limpiar_dia();
        if($(this).val()==""){
            fn_habilita_dia(true);
            return;
        }
           
        fn_habilita_dia(false);
        if($(this).val()=="02"){ //cedula
            $("#no_cedula").hide(); 
            $("#cedula").show();
            $("#cedula").val();
        } 
        else{
            $("#no_cedula").show(); 
            $("#cedula").hide();
        }
          
      
	});
    
    $("#tx_cuo_inicial").blur(function(){
        fn_calcular_cuota(1);
    });
    
    $("#tx_nro_cuotas").blur(function(){
        fn_calcular_cuota(2);
    });
    
    $("#tx_vlr_cuota").blur(function(){
        fn_calcular_cuota(3);
    });
         
	$("#co_excel").on("click", function (e) {
        var col_model=$( "#div_grid" ).pqGrid( "option", "colModel" );
		var cabecera = "";
		e.preventDefault();
        for (i=0; i< col_model.length; i++){
			if(col_model[i].hidden != true) cabecera += "<th>"+col_model[i].title+ "</th>";
		}
		$("#excel_cabecera").val(cabecera);
		var element =$grid.pqGrid("option","dataModel.data");
		if (element)
			a= element.length;
		else 
			a= 0;
		if(a>0){
			$("#frm_Exel").submit();
			return;
		}
    });
	 
    $("#co_cancelar").on("click", function (e) {
        if($.trim($("#co_cancelar").text()) == "Cancelar")
            fn_limpiar();
        else
            window.close();
        
    });
    
    $("#co_limpiar").on("click", fn_limpiar2);
    
    $("#co_guardar").click(function(){
        if( ! fn_valida_conve() ) return;
        fn_limpiar_dia_com();
        $("#ch_propietario").prop("checked",false);
        fn_abre_modal();
    });
    
    $("#co_confirmar").click(function(){
        if( fn_valida_guardar() ){
            fn_guardar();    
        }
    });
    
	    	
	//Se definen las mascaras
    $("#tx_cuo_inicial").inputmask("decimal",{
        radixPoint:".", 
        groupSeparator: ",", 
        digits: 2,
        autoUnmask: true,
        autoGroup: true
    });
    
    $("#tx_vlr_cuota").inputmask("decimal",{
        radixPoint:".", 
        groupSeparator: ",", 
        digits: 2,
        autoUnmask: true,
        autoGroup: true
    });
    
    $("#tx_deuda_total").inputmask("decimal",{
        radixPoint:".", 
        groupSeparator: ",", 
        digits: 2,
        autoUnmask: true,
        autoGroup: true
    });
    
    $("#tx_deu_convenir").inputmask("decimal",{
        radixPoint:".", 
        groupSeparator: ",", 
        digits: 2,
        autoUnmask: true,
        autoGroup: true
    });
    
    cuo_ini_cal = nro_cuo_cal = vlr_cuo_cal = 0;
    
    $("#tx_doc1").blur(function(){
        fn_rellenar_input($(this), 2);
    });

    $("#tx_doc2").blur(function(){
        fn_rellenar_input($(this), 5);
    });

    $("#tx_doc3").blur(function(){
        fn_rellenar_input($(this), 6);
    });
	
    $("#tx_cliente").inputmask("integer");
    $("#tx_nro_cuotas").inputmask("integer");
    $("#tx_doc1").inputmask({mask:"99", rightAlign: true, placeholder: ""});
    $("#tx_doc2").inputmask({mask:"99999", rightAlign: true, placeholder: ""});
    $("#tx_doc3").inputmask({mask:"999999", rightAlign: true, placeholder: ""});
    $("#tx_tel").inputmask({"mask": "999[9]-9999", greedy:false});
    $("#tx_mail").inputmask({mask:"*{1,20}[.*{1,20}][.*{1,20}][.*{1,20}]@*{1,20}.*{2,6}[.*{1,2}]",greedy:false}); 
    
	$("#dialog-message_boostrap").load("html_mensaje.htm");
    
    if(fn_get_param("clien_convenio") != 0){
        $("#tx_cliente").val(fn_get_param("clien_convenio"));
        $("#co_leer").trigger( "click" );     
    }
    $(window).scrollTop(0);
});


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
//se guarda o se modifica la opcion de convenio en BD
function fn_guardar()
{
	var dato_id;
    var propietario;
    
    if( $("#cb_tipo_doc").val() == "02") 
        dato_id = $("#tx_doc1").val() + $("#cb_tipo_doc2").val() +  $("#tx_doc2").val() + $("#tx_doc3").val();
    else
        dato_id = $("#tx_doc").val();
    
    if( $("#ch_propietario").prop("checked") == true )
        propietario = "S";
    else
        propietario = "N";
    
	var param= 
	{
		"func": "fn_guardar",
        "rol":$("#tx_rol").val(),
        "ip":$("#tx_ip").val(),
        "empresa" : $("#tx_empresa").val(),
        "p_cliente":$("#tx_cliente").val(),
        "p_ord_ate":$("#tx_ord_ate").val(),
        "p_tip_conve":$("#cb_tipo_conve").val(),
		"p_opc_conve":$("#cb_opc_conve").val(),
		"p_deu_conve":$("#tx_deu_convenir").val(),
        "p_cuo_ini":$("#tx_cuo_inicial").val(),
        "p_nro_cuo":$("#tx_nro_cuotas").val(),
        "p_vlr_cuo":$("#tx_vlr_cuota").val(),
        "p_motivo":$("#cb_motivo").val(),
        "p_obs":$("#tx_obs").val(),
        "p_propietario":propietario,
        "p_tipo_doc":$("#cb_tipo_doc").val(),
        "p_documento":dato_id,
        "p_nombre":$("#tx_nombre_sol").val(),
        "p_ape_pat":$("#tx_ape_pat").val(),
        "p_ape_mat":$("#tx_ape_mat").val(),
        "p_tel":$("#tx_tel").val(),
        "p_mail":$("#tx_mail").val()
        
	};
	
	$("#dlg_solicitante").modal("hide");
	
	HablaServidor(my_url, param, "text", function(text) 
	{
		//$grid.pqGrid( "refreshDataAndView" );
		fn_mensaje_boostrap("ACCIÓN REALIZADA!!!", g_tit, $(""));
		$(window).scrollTop(0);
	});
					
}


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_limpiar(){
    
    $("#co_cancelar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");
    $("#co_leer").prop("disabled", false);
    $("#tx_cliente").prop("readonly", false);
    $("#tx_cliente").focus();
    $("#tx_cliente").val("");
    $("#tx_ord_ate").val("");
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
    $grid.pqGrid( "option", "dataModel.data", [] );
    $grid.pqGrid( "refreshDataAndView" );
    fn_habilita(true);
    fn_limpiar2();   
    
}

function fn_limpiar2()
{
    $("#cb_tipo_conve").val("");
    $("#cb_opc_conve").html("");
    $("#tx_cuo_inicial").val("");
    $("#lb_r_cuo_ini").html("");
    $("#tx_min_cuo_ini").val("");
    $("#tx_max_cuo_ini").val("");
    
    $("#tx_nro_cuotas").val("");
    $("#lb_r_nro_cuo_ini").html("");
    $("#tx_min_nro_cuo").val("");
    $("#tx_max_nro_cuo").val("");
    
    cuo_ini_cal = nro_cuo_cal = vlr_cuo_cal = 0;
    
    $("#tx_vlr_cuota").val("");
    $("#lb_r_vlr_cuo").html("");
    $("#tx_min_valor_cuo").val("");
    $("#tx_max_valor_cuo").val("");
    $("#tx_tie_caduca").val("");
    $("#tx_nro_caducadas").val("");
    $("#tx_cod_cargo").val("");
    $("#tx_tie_cuo_ini").val("");
    $("#tx_opc_valor_cuo").val(""); 
    
    $("#cb_motivo").val("");
    $("#tx_obs").val("");
    
    $("#pn_datos_conve").children(".form-group").removeClass("has-error");
    
}


function fn_limpiar_dia()
{
    $("#tx_doc").val("");
    $("#tx_doc1").val("");
    $("#tx_doc2").val("");
    $("#tx_doc3").val("");
    $("#cb_tipo_doc2").val("");
    
}


function fn_limpiar_dia_com()
{
    fn_limpiar_dia();
    $("#cb_tipo_doc").val("");
    $("#tx_nombre_sol").val("");
    $("#tx_ape_pat").val("");
    $("#tx_ape_mat").val("");
    $("#tx_tel").val("");
    $("#tx_mail").val("");
    
}


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_setea_grid_principal()
{   
	grilla_prin = [
        { title: "Opcion", width: 80, dataType: "string", dataIndx: "C1", halign:"center", align:"center" },
        { title: "Estado", width: 80, dataType: "string", dataIndx: "C2", halign:"center", align:"center"},
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
	
    var obj = {
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
		colModel: grilla_prin,
		pageModel: { rPP: 20, type: "local", rPPOptions: [20, 50, 100]},
        scrollModel:{theme:true},
        toolbar:
        {
            cls: "pq-toolbar-export",
            items:
            [
				{ type: "button", label: "Excel", attr:"id=co_excel", cls:"btn btn-default btn-sm"}
            ]
        }
    };
		
	var data = [ ];
    $grid = $("#div_grid").pqGrid(obj);
	//$grid.pqGrid( "scrollRow", { rowIndxPage: 21 } );	
	
}

//Se llena la grila del historia de convenios
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_grilla_principal()
{
    //pruebas
    parameters = 
    {
        "func":"fn_hist_conve",
        "p_cliente":$("#tx_cliente").val(),
        "empresa" : $("#tx_empresa").val()
    };

    cadenajson="";
    HablaServidor("datos_conve.json",parameters,'text', function(text) 
    {
        $(".pq-loading").hide();
        try{
            $grid.pqGrid( "option", "dataModel.data", eval(text));
            $grid.pqGrid( "refreshDataAndView" );
        }
        catch(err) {
            console.log("Error en el formato de la cadena de respuesta grid 1");
            $grid.pqGrid( "option", "dataModel.data", [] );
            $grid.pqGrid( "refreshDataAndView" );
        }		
    });
    // fin pruebas

    
    /*   habilitar en desarrollo
    var dataModel = 
    {        
        location: "remote",
        sorting: "local",
        dataType: "json",
        method: "POST",
        sortDir: ["up", "down"], 
        url: url+"?"+jQuery.param( parameters ),
        getData: function (dataJSON) 
        {
			total_register = $.trim(dataJSON.totalRecords);
			var data = dataJSON.data;
			var sql_excel= JSON.stringify(dataJSON.sql);
			$("#sql").val(eval(sql_excel));	
			if(total_register>=1)
			{
				$("#co_excel").attr("disabled", false);
			}
            return { data: dataJSON.data};
        },
        error: function(jqErr, err_stat, err_str) // ERROR EN EL ASP
        {
			fn_mensaje_boostrap(jqErr.responseText, g_tit, "");
        }
            
    }

    $grid.pqGrid( "option", "dataModel", dataModel );				
    $grid.pqGrid( "refreshDataAndView" );
    */
    
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_valida_guardar()
{
    if($("#cb_tipo_doc").val()==""){
        fn_mensaje_boostrap("Debe elegir un Tipo de Identidad", g_tit, $("#cb_tipo_doc"));
        return;  
    }
       
    if($("#cb_tipo_doc").val()=="02" && ($("#tx_doc1").val()=="" || $("#tx_doc2").val()=="" || $("#tx_doc3").val()=="" || $("#cb_tipo_doc2").val()=="")){
        fn_mensaje_boostrap("Falta datos de identidad", g_tit, $(""));
        return;  
    }
    else{
        if($("#cb_tipo_doc").val()!="02" && $("#tx_doc").val()==""){
            fn_mensaje_boostrap("Debe digitar el número de identidad", g_tit, $("#tx_doc"));
            return;
        }
    }
    if($("#tx_nombre_sol").val()==""){
        fn_mensaje_boostrap("Debe digitar el nombre del Solicitante", g_tit, $("#tx_nombre_sol"));
        return;  
    }
    if($("#tx_ape_pat").val()==""){
        fn_mensaje_boostrap("Debe digitar el apellido paterno del Solicitante", g_tit, $("#tx_ape_pat"));
        return;  
    }
    if($("#tx_tel").val()==""){
        fn_mensaje_boostrap("Debe digitar el teléfono del Solicitante", g_tit, $("#tx_tel"));
        return;  
    }
    if($("#tx_mail").val()==""){
        fn_mensaje_boostrap("Debe digitar el Mail del Solicitante", g_tit, $("#tx_mail"));
        return;  
    }
    
    if (! $("#tx_tel").inputmask("isComplete")){
        fn_mensaje_boostrap("Debe digitar el teléfono de forma correcta", g_tit, $("#tx_tel"));
        return; 
    }
    
    if (! $("#tx_mail").inputmask("isComplete")){
        fn_mensaje_boostrap("Debe digitar el Mail de forma correcta", g_tit, $("#tx_mail"));
        return; 
    } 
    return true;  
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_leer_cliente()
{
    if ($.trim($(this).text()) == "Leer")
    {
        if($.trim($("#tx_cliente").val()) != "")
        {
            $("#co_cancelar").html("<span class='glyphicon glyphicon-remove'></span> Cancelar");
            fn_carga_datos();
            fn_grilla_principal();
        }
        else
            fn_mensaje_boostrap("DEBE DIGITAR UN NÚMERO DE CLIENTE", g_tit, $("#tx_cliente"));
    }		
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_carga_datos()
{
    dato_original = [];

    parameters = {
                    "func":"fn_generales",
                    "empresa":$("#tx_empresa").val(),
                    "cliente":$("tx_cliente").val()
                };

    HablaServidor("datos_generales.txt",parameters,'text', function(text) 
    {

        if($.trim(text)=="") {
            fn_mensaje("NÚMERO DE CLIENTE NO EXISTE", g_tit, $("#tx_cliente"));
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
        $("#tx_deuda_total").val(dato_original[10]);
        $("#tx_deu_convenir").val(dato_original[10]);

        $("#co_leer").prop("disabled", true);			

        $("#tx_cliente").prop("readonly", true);			
        $("#co_cerrar").text("Cancelar");						
        fn_habilita(false);
    });

}


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_leer_propietario()
{
    var dato_id = "";
    dato_original = [];

    parameters = {
                    "func":"fn_propietario",
                    "empresa":$("#tx_empresa").val(),
                    "cliente":$("tx_cliente").val()
                };

    HablaServidor("datos_propietario.txt",parameters,'text', function(text) 
    {

        if($.trim(text)=="") {
            fn_mensaje("NO EXISTEN DATOS DE IDENTIFICACIÓN DEL PROPIETARIO", g_tit, $(""));
            return 0;
        }

        dato_original = text.split("|");
        $("#cb_tipo_doc").val(dato_original[0]);
        $("#cb_tipo_doc").trigger( "change" );
        
        dato_id = dato_original[1];
        if( $("#cb_tipo_doc").val() == "02" ){
            $("#tx_doc1").val(dato_id.substring(0,2));
            $("#cb_tipo_doc2").val(dato_id.substring(2,4));
            $("#tx_doc2").val(dato_id.substring(4,9));
            $("#tx_doc3").val(dato_id.substring(9,15));    
        }else{
            $("#tx_doc").val(dato_id);
        }
        
        $("#tx_nombre_sol").val(dato_original[2]);
        $("#tx_ape_pat").val(dato_original[3]);
        $("#tx_ape_mat").val(dato_original[4]);
        if(dato_original[5].length==7)
            $("#tx_tel").val(dato_original[5].substring(0,3)+'-'+dato_original[5].substring(3,7));
        else
            $("#tx_tel").val(dato_original[5]);
        $("#tx_mail").val(dato_original[6]);
        fn_habilita_dia2(true);
        fn_habilita_dia(true);

    });
}


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_habilita(estado)
{
    $("#cb_tipo_conve").prop("disabled", estado);
    $("#cb_opc_conve").prop("disabled", estado);
    $("#tx_cuo_inicial").prop("readonly", estado);  
    $("#tx_nro_cuotas").prop("readonly", estado);   
    $("#tx_vlr_cuota").prop("readonly", estado);
    $("#cb_motivo").prop("disabled", estado);
    $("#tx_obs").prop("readonly", estado);
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_habilita_dia(estado)
{
    $("#tx_doc").prop("disabled", estado);
    $("#tx_doc1").prop("disabled", estado);
    $("#tx_doc2").prop("disabled", estado);  
    $("#tx_doc3").prop("disabled", estado);   
    $("#cb_tipo_doc2").prop("disabled", estado);
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_habilita_dia2(estado)
{
    $("#cb_tipo_doc").prop("disabled", estado);
    $("#tx_nombre_sol").prop("disabled", estado);
    $("#tx_ape_pat").prop("disabled", estado);
    $("#tx_ape_mat").prop("disabled", estado);
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_carga_tip_conve()
{
    $("#cb_tipo_conve").html("<option value ='' selected ></option><option value='1' >CONVENIOS POR DEUDA</option>");
    return;  //pruebas quitar
    var param= 
    {
        "func":"fn_tipo_conve",
        "empresa":$("#tx_empresa").val()
    };
    HablaServidor(url, param, "text", function(text) 
    {
        $("#cb_tipo_conve").html(text);
    });
    
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_carga_opc_conve()
{
    $("#cb_opc_conve").html("<option value ='' selected ></option><option value='001' >RESIDENCIAL BASICA</option><option value='002' >RESIDENCIAL MEDIA</option><option value='003' >RESIDENCIAL ALTA</option>");
    return;  //pruebas quitar
    var param= 
    {
        "func":"fn_opc_conve",
        "empresa":$("#tx_empresa").val(),
        "p_tipo_conve":$("#cb_tipo_conve").val(),
        "p_rol":$("#tx_rol").val(),
        "p_cliente":$("#tx_cliente").val()
    };
    HablaServidor(url, param, "text", function(text) 
    {
        $("#cb_opc_conve").html(text);
    });
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_carga_motivos()
{
    $("#cb_motivo").html("<option value ='' selected ></option><option value='001' >VENTA DE PRODUCTOS O SERVICIOS</option><option value='002' >DEUDA POR CONSUMO</option>");
    return;  //pruebas quitar
    var param= 
    {
        "func":"fn_motivo",
        "empresa":$("#tx_empresa").val()
    };
    HablaServidor(url, param, "text", function(text) 
    {
        $("#cb_motivo").html(text);
    });
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_carga_tip_doc()
{
    $("#cb_tipo_doc").html("<option value ='' selected ></option><option value='01' >PASAPORTE</option><option value='02' >CÉDULA</option>");
    return;  //pruebas quitar
    var param= 
    {
        "func":"fn_tipo_doc",
        "empresa":$("#tx_empresa").val()
    };
    HablaServidor(url, param, "text", function(text) 
    {
        $("#cb_tipo_doc").html(text);
    });
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_carga_tip_doc2()
{
    $("#cb_tipo_doc2").html("<option value ='  ' selected >  </option><option value='AV' >AV</option><option value='E ' >E </option>");
    return;  //pruebas quitar
    var param= 
    {
        "func":"fn_tipo_cedula",
        "empresa":$("#tx_empresa").val()
    };
    HablaServidor(url, param, "text", function(text) 
    {
        $("#cb_tipo_doc2").html(text);
    });
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
//Se cargan los datos de la opcion de convenio
function fn_carga_opc(opcion)
{
    cuo_ini_cal = nro_cuo_cal = vlr_cuo_cal = 0;
    $("#tx_cuo_inicial").val("");
    $("#lb_r_cuo_ini").html("");
    $("#tx_min_cuo_ini").val("");
    $("#tx_max_cuo_ini").val("");
    $("#tx_nro_cuotas").val("");
    $("#lb_r_nro_cuo_ini").html("");
    $("#tx_min_nro_cuo").val("");
    $("#tx_max_nro_cuo").val("");
    $("#tx_vlr_cuota").val("");
    $("#lb_r_vlr_cuo").html("");
    $("#tx_min_valor_cuo").val("");
    $("#tx_max_valor_cuo").val("");
    $("#tx_tie_caduca").val("");
    $("#tx_nro_caducadas").val("");
    $("#tx_cod_cargo").val("");
    $("#tx_tie_cuo_ini").val("");
    $("#tx_opc_valor_cuo").val(""); 
    
    if(opcion == "")
    {
        return;
    }
    parameters = {
						"func":"fn_opcion",
						"empresa":$("#tx_empresa").val(),
                        "p_opcion":opcion
				};
		
    HablaServidor("datos_opc_"+opcion+".txt",parameters,'text', function(text) 
    {

        if($.trim(text)=="") {
           fn_mensaje("OPCIÓN NO EXISTE", g_tit, $("#tx_cliente"));
           return 0;
       }
       var aux = 0;
       var aux2 = 0;

       dato_original = text.split("|");
       cuo_ini_cal = nro_cuo_cal = vlr_cuo_cal = 0;

       $("#tx_tie_cuo_ini").val(dato_original[0]);
       $("#tx_min_cuo_ini").val(dato_original[2]);
       $("#tx_max_cuo_ini").val(dato_original[3]);
       $("#tx_opc_valor_cuo").val(dato_original[4]);
       $("#tx_min_valor_cuo").val(dato_original[5]);
       $("#tx_max_valor_cuo").val(dato_original[6]);
       $("#tx_min_nro_cuo").val(dato_original[7]);
       $("#tx_max_nro_cuo").val(dato_original[8]);
       $("#tx_tie_caduca").val(dato_original[9]);

       $("#tx_nro_caducadas").val(dato_original[10]);
       $("#tx_cod_cargo").val(dato_original[11]);

       if($("#tx_tie_cuo_ini").val()=="S")
       {  
           $("#tx_cuo_inicial").prop("readonly", false);
           aux = ( parseFloat($("#tx_min_cuo_ini").val()) * parseFloat($("#tx_deu_convenir").val()) ) / 100;
           aux = Math.round(aux * 100) / 100 ;
           aux2 = ( parseFloat($("#tx_max_cuo_ini").val()) * parseFloat($("#tx_deu_convenir").val()) ) / 100;
           aux2 = Math.round(aux2 * 100) / 100 ;
           $("#tx_min_cuo_ini").val(aux);
           $("#tx_max_cuo_ini").val(aux2);
           $("#lb_r_cuo_ini").html("B/. ( "+ fn_formato_num($("#tx_min_cuo_ini").val(),2) + " - " + fn_formato_num($("#tx_max_cuo_ini").val(),2) + " )");
       }
       else
       {
           $("#lb_r_cuo_ini").html("");
           $("#tx_cuo_inicial").val("0");
           $("#tx_cuo_inicial").prop("readonly", true);
           $("#tx_vlr_cuota").prop("readonly", true);  //no se puede elegir el valor de la cuota.
       }
       if($("#tx_opc_valor_cuo").val()=="2")
       {//porcentaje
           aux = ( parseFloat($("#tx_min_valor_cuo").val()) * parseFloat($("#tx_deu_convenir").val()) ) / 100;
           aux = Math.round(aux * 100) / 100 ;
           aux2 = ( parseFloat($("#tx_max_valor_cuo").val()) * parseFloat($("#tx_deu_convenir").val()) ) / 100;
           aux2 = Math.round(aux2 * 100) / 100 ;
           $("#tx_min_valor_cuo").val(aux);
           $("#tx_max_valor_cuo").val(aux2);
       }
       $("#lb_r_vlr_cuo").html("B/. ( "+ fn_formato_num($("#tx_min_valor_cuo").val(),2) + " - " + fn_formato_num($("#tx_max_valor_cuo").val(),2) + " )");
       
       $("#lb_r_nro_cuo_ini").html("  ( "+ $("#tx_min_nro_cuo").val() + " - " + $("#tx_max_nro_cuo").val() + " )");
       
    });
}


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
//Se calculan los valores del convenio
function fn_calcular_cuota(opcion)
{
    var sw1, sw2, sw3;
    var deuda, cuo_ini, nro_cuo, vlr_cuo;
    sw1 = sw2 = sw3 = 0;
    deuda = cuo_ini = nro_cuo = vlr_cuo = 0;
    if ( cuo_ini_cal == $("#tx_cuo_inicial").val()
        && nro_cuo_cal == $("#tx_nro_cuotas").val()
        && vlr_cuo_cal == $("#tx_vlr_cuota").val() ) return;
    if(opcion==1){
        if( parseFloat($("#tx_cuo_inicial").val()) < parseFloat($("#tx_min_cuo_ini").val()) ) 
            $("#tx_cuo_inicial").val( $("#tx_min_cuo_ini").val() );
        if( parseFloat($("#tx_cuo_inicial").val()) > parseFloat($("#tx_max_cuo_ini").val()) ) 
            $("#tx_cuo_inicial").val( $("#tx_max_cuo_ini").val() );
    }
    if(opcion==2){
        if( parseInt($("#tx_nro_cuotas").val()) < parseInt($("#tx_min_nro_cuo").val()) ) 
            $("#tx_nro_cuotas").val( $("#tx_min_nro_cuo").val() );
        if( parseInt($("#tx_nro_cuotas").val()) > parseInt($("#tx_max_nro_cuo").val()) ) 
            $("#tx_nro_cuotas").val( $("#tx_max_nro_cuo").val() );
    }
    if(opcion==3){
        x= $("#tx_min_valor_cuo");
        if( parseFloat($("#tx_vlr_cuota").val()) < parseFloat($("#tx_min_valor_cuo").val()) ) 
            $("#tx_vlr_cuota").val( $("#tx_min_valor_cuo").val() );
        if( parseFloat($("#tx_nro_cuotas").val()) > parseFloat($("#tx_max_valor_cuo").val()) ) 
            $("#tx_vlr_cuota").val( $("#tx_max_valor_cuo").val() );
    }

    if( $("#tx_cuo_inicial").val() == "" || parseFloat($("#tx_cuo_inicial").val()) <0 ) 
            sw1 = 0; //no hay cuota_inicial
    else sw1 = 1;
    if( $("#tx_nro_cuotas").val() == "" || parseInt($("#tx_nro_cuotas").val()) <=0 ) 
            sw2 = 0; //no hay numero de cuotas
    else sw2 = 1;
    if( $("#tx_vlr_cuota").val() == "" || parseFloat($("#tx_vlr_cuota").val()) <=0 ) 
        sw3 = 0; //no hay valor_cuota
    else sw3 = 1;
    
    //se necesitan al menos 2 datos para calcular
    if( (sw1 + sw2 + sw3) < 2 ){
        cuo_ini_cal = nro_cuo_cal = vlr_cuo_cal = 0;
        return;
    }
    
    deuda = parseFloat( $("#tx_deu_convenir").val() );
    cuo_ini = parseFloat( $("#tx_cuo_inicial").val() );
    nro_cuo = parseInt( $("#tx_nro_cuotas").val() );
    vlr_cuo = parseFloat( $("#tx_vlr_cuota").val() );
    
    //cuota inicial y nro de cuotas
    if( sw1 >0 && sw2 >0 && (opcion == 1 || opcion == 2) ){
        vlr_cuo = (deuda - cuo_ini) / nro_cuo;
        vlr_cuo = Math.round(vlr_cuo * 100) / 100;
        if( vlr_cuo < parseFloat($("#tx_min_valor_cuo").val()) ) {
            fn_mensaje_boostrap("<p class='text-justify'>CON LOS VALORES DE CUOTA INICIAL Y NRO DE CUOTAS INGRESADOS EL VALOR DE LA CUOTA CALCULADO: <b>B/."+vlr_cuo+"</b> ES INFERIOR AL VALOR MÍNIMO DE CUOTA: <b> B/."+$("#tx_min_valor_cuo").val()+"</b><br><br>DISMINUYA LOS VALORES DE CUOTA INICIAL O NRO DE CUOTAS</p>", g_tit, $(""));
            $("#tx_vlr_cuota").val("");
            /*if(opcion == 1) $("#tx_nro_cuotas").focus();
            else $("#tx_cuo_inicial").focus();*/
            cuo_ini_cal = nro_cuo_cal = vlr_cuo_cal = 0;
            return;
        }
        if( vlr_cuo > parseFloat($("#tx_max_valor_cuo").val()) ) {
            fn_mensaje_boostrap("CON LOS VALORES DE CUOTA INICIAL Y NRO DE CUOTAS INGRESADOS EL VALOR DE LA CUOTA CALCULADO: <b>B/."+vlr_cuo+"</b> ES SUPERIOR AL VALOR MÁXIMO DE CUOTA: <b>B/."+$("#tx_max_valor_cuo").val()+"</b><br><br>DISMINUYA LOS VALORES DE CUOTA INICIAL O NRO DE CUOTAS</p>", g_tit, $(""));
            $("#tx_vlr_cuota").val("");
            $("#tx_nro_cuotas").focus();
            /*if(opcion == 1) $("#tx_nro_cuotas").focus();
            else $("#tx_cuo_inicial").focus();*/
            cuo_ini_cal = nro_cuo_cal = vlr_cuo_cal = 0;
            return;
        }
        
        $("#tx_vlr_cuota").val(vlr_cuo);
        cuo_ini_cal = $("#tx_cuo_inicial").val();
        nro_cuo_cal = $("#tx_nro_cuotas").val();
        vlr_cuo_cal = $("#tx_vlr_cuota").val();
        return;
    }
   
    
    //cuota inicial y valor_cuota
    if( sw1 >0 && sw3 > 0){
        nro_cuo = (deuda - cuo_ini)/vlr_cuo;
        nro_cuo = Math.round(nro_cuo);
        cuo_ini = (deuda - (vlr_cuo * nro_cuo));
        cuo_ini = Math.round(cuo_ini * 100) / 100;
        if( cuo_ini < parseFloat($("#tx_min_cuo_ini").val()) ) {
            nro_cuo = nro_cuo -1;
            cuo_ini = (deuda - (vlr_cuo * nro_cuo));
            cuo_ini = Math.round(cuo_ini * 100) / 100;
        }
        if( cuo_ini > parseFloat($("#tx_max_cuo_ini").val()) ) {
            nro_cuo = nro_cuo +1;
            cuo_ini = (deuda - (vlr_cuo * nro_cuo));
            cuo_ini = Math.round(cuo_ini * 100) / 100;
        }
        
        if( nro_cuo < parseFloat($("#tx_min_nro_cuo").val()) ) {
            fn_mensaje_boostrap("CON LOS VALORES DE CUOTA INICIAL Y VALOR DE CUOTA INGRESADOS EL NRO DE CUOTAS CALCULADO: <b>B/."+nro_cuo+"</b> ES INFERIOR AL MÍNIMO DE NRO DE CUOTAS: <b>B/."+$("#tx_min_nro_cuo").val()+"</b><br><br>DISMINUYA LOS VALORES DE CUOTA INICIAL O VALOR DE LA CUOTA</p>", g_tit, $(""));
            $("#tx_nro_cuotas").val("");
            //$("#tx_cuo_inicial").focus();
            cuo_ini_cal = nro_cuo_cal = vlr_cuo_cal = 0;
            return;
        }
        if( nro_cuo > parseFloat($("#tx_max_nro_cuo").val()) ) {
            fn_mensaje_boostrap("CON LOS VALORES DE CUOTA INICIAL Y VALOR DE CUOTA INGRESADOS EL NRO DE CUOTAS CALCULADO: "+nro_cuo+" ES SUPERIOR AL MÁXIMO DE NRO DE CUOTAS: <b>B/."+$("#tx_max_nro_cuo").val()+"</b><br><br>AUMENTE LOS VALORES DE CUOTA INICIAL Y VALOR CUOTA</p>", g_tit, $(""));
            $("#tx_nro_cuotas").val("");
            //$("#tx_cuo_inicial").focus();
            cuo_ini_cal = nro_cuo_cal = vlr_cuo_cal = 0;
            return;
        }
        
        $("#tx_cuo_inicial").val(cuo_ini);
        $("#tx_nro_cuotas").val(nro_cuo);
        cuo_ini_cal = $("#tx_cuo_inicial").val();
        nro_cuo_cal = $("#tx_nro_cuotas").val();
        vlr_cuo_cal = $("#tx_vlr_cuota").val();
        return;
    }
    
    //valor cuota y nro de cuotas
    if( sw2 >0 && sw3 > 0){
        cuo_ini = (deuda - (vlr_cuo * nro_cuo));
        cuo_ini = Math.round(cuo_ini * 100) / 100;
        if( cuo_ini < parseFloat($("#tx_min_cuo_ini").val()) ) {
            fn_mensaje_boostrap("CON LOS VALORES DE NRO DE CUOTAS Y VALOR DE CUOTA INGRESADOS EL VALOR DE LA CUOTA INICIAL CALCULADA: "+cuo_ini+" ES INFERIOR AL VALOR MÍNIMO DE CUOTA INICIAL: <b>B/."+$("#tx_min_cuo_ini").val()+"</b><br><br>DISMINUYA LOS VALORES DE NRO DE CUOTAS O VALOR DE LA CUOTA</p>", g_tit, $(""));
            $("#tx_cuo_inicial").val("");
            $("#tx_cuo_inicial").focus();
            cuo_ini_cal = nro_cuo_cal = vlr_cuo_cal = 0;
            return;
        }
        if( cuo_ini > parseFloat($("#tx_max_cuo_ini").val()) ) {
            fn_mensaje_boostrap("CON LOS VALORES DE NRO DE CUOTAS Y VALOR DE CUOTA INGRESADOS EL VALOR DE LA CUOTA INICIAL CALCULADO: "+cuo_ini+" ES SUPERIOR AL VALOR MÁXIMO DE CUOTA INICIAL: <b>B/."+$("#tx_max_cuo_ini").val()+"</b><br><br>AUMENTE LOS VALORES DE NRO DE CUOTAS Y VALOR CUOTA</p>", g_tit, $(""));
            $("#tx_cuo_inicial").val("");
            $("#tx_cuo_inicial").focus();
            cuo_ini_cal = nro_cuo_cal = vlr_cuo_cal = 0;
            return;
        }
        
        $("#tx_cuo_inicial").val(cuo_ini);
        cuo_ini_cal = $("#tx_cuo_inicial").val();
        nro_cuo_cal = $("#tx_nro_cuotas").val();
        vlr_cuo_cal = $("#tx_vlr_cuota").val();
        return;
    }
    
    
}//fin funcion


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
//Valida los datos del convenio, antes de mostrar el dialogo de solicitante
function fn_valida_conve()
{
    var sw_val = 0;
    if( fn_valida_vacio($("#cb_tipo_conve")) > 0) sw_val++;
    if( fn_valida_vacio($("#cb_opc_conve")) > 0) sw_val++;
    if( fn_valida_vacio($("#tx_deu_convenir")) > 0) sw_val++;
    if( fn_valida_vacio($("#tx_cuo_inicial")) > 0) sw_val++;
    if( fn_valida_vacio($("#tx_nro_cuotas")) > 0) sw_val++;
    if( fn_valida_vacio($("#tx_vlr_cuota")) > 0) sw_val++;
    if( fn_valida_vacio($("#cb_motivo")) > 0) sw_val++;
    if( fn_valida_vacio($("#tx_obs")) > 0) sw_val++;
    
    if(sw_val > 0){
        fn_mensaje_boostrap("DEBE SUMINISTRAR LA INFORMACIÓN DE TODOS LOS CAMPOS DE DATOS DE CONVENIO", g_tit, $("#tx_obs"));
		return false;
    }
    
    //para mayor seguridad, se recalcula aquí la cuota, 
    //en consiciones normales no debería realizar nada esta función
    fn_calcular_cuota(1);
    
	if($("#tx_obs").val().length <15)
	{
		fn_mensaje_boostrap("LA OBSERVACIÓN DEBE TENER AL MENOS 15 CARACTERES", g_tit, $("#tx_obs"));
		return false;
	}
    
    return true;
    
}


function fn_abre_modal(){
    $("#dlg_solicitante").modal({backdrop: "static",keyboard:false});
    $("#tx_tit_guardar").text("Datos del Solicitante");
    fn_habilita_dia(true);
    fn_habilita_dia2(false);
    $("#dlg_solicitante").on("shown.bs.modal", function () {
        $("#cb_tipo_doc").focus();
    });	
}




