var g_modulo="Facturación Clientes - Lecturas y Consumos";
var g_titulo="Ingreso Requerimientos Refacturados.";
var parameters={};
var my_url="correc_prome_dudo.asp";
var $grid, $grid_secun, $grid_tar_izq, grid_tar_der;
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
    $("#tx_refe").prop("disabled", true);
    $("#co_obs").prop("disabled", true);

    $("#cb_motiv").prop("disabled",true);
    $("#comuna").hide();
    $("#new_file").hide();
    $("#panel_tarifas").hide();
    $("#grid_secundaria").hide();
    $("#boton_secun").hide();
    $("#dv_descrip").hide();

    fn_tip_ajust();
    fn_origen();
    
    $("button").on("click", function(){return false;});

    $("#co_agregar").html("<span class='glyphicon glyphicon-save'></span> Agregar Fila");
    $("#co_calculo").html("<span class='glyphicon glyphicon-off'></span> Calculo Automatico");

    document.title = g_titulo ;
    document.body.scroll = "yes";

    $("#div_header").load("syn_globales/header.htm", function() {
        $("#div_mod0").html(g_modulo);
        $("#div_tit0").html(g_titulo);  
    });

    //Footer
    $("#div_footer").load("syn_globales/footer.htm");   
        
    $("#tx_cliente").focus();
   
    jQuery('#tx_cliente').keypress(function(tecla) {
        if(tecla.charCode < 48 || tecla.charCode > 57) return false;
    });

    jQuery('#tx_tot_aju').keypress(function(tecla) {
        if(tecla.charCode < 48 || tecla.charCode > 57) return false;
    });    
    
    fn_setea_grid_principal();
    fn_setea_grid_secundaria();
    fn_setea_grid_tarifa();

    //AL PRESIONAR LA TECLA ENTER RETORNE LA INFORMACION
    $("#tx_cliente").keypress(function(e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if(code==13){
            if ($("#tx_cliente").val() ==""){
                fn_mensaje_boostrap("DIGITE EL NÚMERO DE SUMINISTRO", g_titulo, $("#tx_cliente"));
                return;
            }
            fn_leer();  
        }
    });     
 
    $("#co_leer").on("click", function () {
        //Validación de informacion
        if ($.trim($("#co_leer").text()) == "Leer") {
            if ($("#tx_cliente").val() ==""){
                fn_mensaje_boostrap("DIGITE EL NÚMERO DE SUMINISTRO", g_titulo, $("#tx_cliente"));
                return;
            }
            fn_leer();      
        }else{

            if ($("#tx_refe").val()==""){
                fn_mensaje_boostrap("DEBE DIGITAR LA REFERENCIA", g_titulo, $("#tx_refe"));
                return;
            }else{
                fn_Muestra_ingre(); 
                //fn_limpiar();    
                return;         
            }           
        }
    });

    $("#co_aceptar").on("click", function () {
        //////////////////////////////////////////////////////////////////////////////////////////
        //===========================OJO SE DEBE QUITAR ESTE COMENTARIO=========================//
        //=============================SE HIZO PARA HACER LAS PRUEBAS===========================//
        //////////////////////////////////////////////////////////////////////////////////////////
    
        if ($.trim($("#co_aceptar").text()) == "Aceptar") {

            if ($("#cb_tip_ajust").val() ==""){
                fn_mensaje_boostrap("SELECCIONE TIPO DE AJUSTE", g_titulo, $("#cb_tip_ajust"));
                return;
                }else{
                     if ($("#cb_motiv").val()==""){
                fn_mensaje_boostrap("SELECCIONE MOTIVO", g_titulo, $("#cb_motiv"));
               
                 return;
            }
             if ($("#cb_origen").val()==""){
                fn_mensaje_boostrap("SELECCIONE ORIGEN", g_titulo, $("#cb_origen"));
                return;    
            }
                }
        }      
    
        var vOrigen = $("#cb_origen").val();
        
        $("#tx_comuna").val("PEDREGAL(PMA)");
        $("#tx_clave").val("01");
        $("#tx_ajuste").val("002");
        $("#tx_origen").val(vOrigen);

        fn_ventana_final();
    });

    $("#co_cancelar").on("click",function(){

        if ($.trim($("#co_cancelar").text())=="Cancelar"){
            $("#co_leer").html("<span class='glyphicon glyphicon-search'></span> Leer");
            $("#co_cancelar").html("<span class='glyphicon glyphicon-off'></span> Cerrar"); 
    
            fn_limpiar();    
            return;
        }else{

            window.close();
        }
    });     
    
    $("#co_anular").on("click",function(e){
        fn_anular();
    });

    $("#co_close").on("click", function (e) {
        $('#div_ing_bts').modal('hide');
    });     


    $("#co_cance_modal").on("click", function (e) {
        $('#div_filtro_bts').modal('hide');
    });     

    $("#cb_tip_ajust").on("change", function(evt){
        if($(this).val() =="")
            //$("#cb_ruta").prop("disabled",true);
            limpia_ajus(); //se limpian los combos inferiores
        else
            $("#cb_motiv").prop("disabled",false);
            fn_motiv();
            $("#cb_motiv").focus();
    });


    $("#co_modificar").on("click", function (e) {
        
        if($("#tx_tot_aju").val() != $("#vr_new_ajus").val()){
            $('#div_filtro_bts').modal('hide');    
            $grid_tar_der.pqGrid( "refreshView" );
        }else{
            fn_mensaje_boostrap("DEBE DIGITAR UN VALOR DIFERENTE", g_titulo, $("#tx_tot_aju"));
            $("#tx_tot_aju").focus();
            return;            
        }        
    }); 

    $grid_secun.pqGrid({
    rowDblClick: function( event, ui ) {
        if (ui.rowData) 
            {
                var dataCell = ui.rowData;
                $grid_tar_izq.pqGrid( "refreshView" );
            }
        }
    });     


    $("#co_agregar").on("click", function (e) {

        $("#co_modificar").html("<span class='glyphicon glyphicon-plus'></span> Agregar");
        
        fn_Muestra_modal();       

        $("#dv_desc").show();
        $("#dv_descrip").hide();       
        $("#tx_tot_aju").val("");   
       fn_descr_cargo();
    });     


    $grid_tar_izq.pqGrid({
    rowDblClick: function( event, ui ) {
        if (ui.rowData) 
            {
                $("#co_modificar").html("<span class='glyphicon glyphicon-edit'></span> Ajustar");
                fn_Muestra_modal();

                $("#dv_desc").hide();
                $("#dv_descrip").show();

                $("#tx_descripcion").prop("disabled",true);

                var dataCell = ui.rowData;
                $("#tx_descripcion").val(dataCell.C1);
                $("#vr_new_ajus").val(dataCell.C3);
                $("#tx_tot_aju").val(dataCell.C3);                                                
            }
        }
    });     
});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*  
function fn_setea_grid_principal()
{ 
    var data = [
        { C1:'69792375', C2: "14/03/2078", C3:'FA', C4:'16.2', C5:'No Refacturado', C6:'No', C7:'No', C8:'03-2018'},
        { C1:'69334507', C2: "14/02/2018", C3:'FA', C4:'15.2', C5:'No Refacturado', C6:'No', C7:'No', C8:'02-2018'},
        { C1:'68848888', C2: "15/01/2018", C3:'FA', C4:'7.36', C5:'No Refacturado', C6:'No', C7:'No', C8:'01-2018'},
        { C1:'68929696', C2: "14/12/2017", C3:'FA', C4:'7.36', C5:'No Refacturado', C6:'No', C7:'No', C8:'12-2018'}
    
    ];
    var obj = {
            width: '100%',
            height: 250,
            showTop: true,
            showBottom:false,
            showHeader: true,
            roundCorners: true,
            rowBorders: true,
            columnBorders: true,
            editable:true,
            selectionModel: { type: 'cell' },
            numberCell: { show: false },
            title: "Titulo",
            pageModel: {type:"local"},
            scrollModel:{theme:true},
        
        };
        obj.colModel = [
            
            { dataIndx: "", width: "10%", align: "center", resizable: false,
                type: "checkbox", cls: "ui-state-default", sortable: false, editor: false, editable: true,
                dataType: "bool",
                cb: {
                    all: false,
                    header: true,
                    select: true,
                    all: true
                }
            },
            { title: "Documento",  resizable: false, width: 100, dataType: "number", dataIndx: "C1",halign:"center", align:"right"},
            { title: "Fecha", width: 100, dataType: "string", dataIndx: "C2",halign:"center", align:"center" },
            //{ title: "valor_chk", width: 80, dataType: "string", dataIndx: "C10",halign:"center", align:"center", hidden:true },
            { title: "Tipo", width: 90, dataType: "number", dataIndx: "C3",halign:"center", align:"right" },
            { title: "Valor", width: 90, dataType: "number", dataIndx: "C4",halign:"center", align:"right" },
            { title: "Refacturado",width: 140, dataType: "number", dataIndx: "C5",halign:"center", align:"right"},
            { title: "Campo 1",width: 90, dataType: "number", dataIndx: "C6",halign:"center", align:"right"},
            { title: "Campo 2",width: 90, dataType: "number", dataIndx: "C7",halign:"center", align:"right"},
            { title: "Periodo",width: 90, dataType: "number", dataIndx: "C8",halign:"center", align:"right"}
];      
        obj.dataModel = { data: data };

        
        $grid = $("#div_grid_dos").pqGrid(obj);
        $grid.pqGrid( "refreshDataAndView" );

}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*  
function fn_setea_grid_secundaria()
{ 
    var data = [
        {C1:'69792375', C2: "FA", C3:'03-2018', C4:'16.2', C5:'ES. PMÁ - COLON ALCANTARILLADO', C6:'No', C7:'No', C8:'03-2018'},
        {C1:'12873128', C2: "FA", C3:'04-2018', C4:'10.2', C5:'ES. PMÁ - COLON ALCANTARILLADO', C6:'No', C7:'No', C8:'04-2018'}     
    ];
    var obj = {
            width: '75%',
            height: 150,
            showTop: true,
            showBottom:false,
            showHeader: true,
            roundCorners: true,
            rowBorders: true,
            columnBorders: true,
            collapsible: { on : false,toggle:false },
            editable:false,
            selectionModel: { type: "row", mode:"single"},
            showTitle:false,
            numberCell: { show: false },
            pageModel: {type:"local"},
            scrollModel:{autoFit:true, theme:true},
        
    };
    obj.colModel = [
        
        { title: "Documento",  resizable: false, width: 100, dataType: "number", dataIndx: "C1",halign:"center", align:"right"},
        { title: "Tipo", width: 80, dataType: "number", dataIndx: "C2",halign:"center", align:"center" },
        { title: "Fecha", width: 100, dataType: "string", dataIndx: "C3",halign:"center", align:"center" },
        { title: "Valor", width: 80, dataType: "number", dataIndx: "C4",halign:"center", align:"center" },
        { title: "Tarifa", width: 403, dataType: "string", dataIndx: "C5",halign:"center", align:"left" },
        { title: "Ajustado", width: 90, dataType: "string", dataIndx: "C6",halign:"center", align:"center" }
    ];

    obj.dataModel = { data: data };

    $grid_secun = $("#div_grid_secun").pqGrid(obj);
    $grid_secun.pqGrid( "refreshDataAndView" );
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*  
function fn_setea_grid_tarifa()
{       
    var data = [
        {C1:'CONSUMO DE AGUA', C2: "0.00", C3:"12.08"},
        {C1:'DESCUENTO DE JUBILADO', C2: "0.00", C3:"-3.02"},        
        {C1:'TASA DE ASEO - DIMAUD', C2: "0.00", C3:"6.00"},
        {C1:'ALCANTARILLADO', C2: "0.00", C3:"6.07"}     
    ];
    var obj_tar_izq = {
        width:"100%",
        minWidth:40,
        height:250,
        rowBorders:true,
        //fillHandle: "",
        editable:false,
        selectionModel: { type: "row", mode:"single"},        
        numberCell: { show: false },
        collapsible: { on : false,toggle:false },
        stripeRows : true,
        pasteModel: { on: false },
        title: "CARGOS ORIGINALES",
        showBottom: false,
        showTop: true,
        swipeModel: { on: false },
        
        colModel: [         
            { title: "Descripción",  resizable: false, width: "52%", dataType: "number", dataIndx: "C1",halign:"center", align:"left"},
            { title: "Pendiente", width: "24%", dataType: "number", dataIndx: "C2",halign:"center", align:"center" },
            { title: "Facturado", width: "24%", dataType: "string", dataIndx: "C3",halign:"center", align:"center" }
        ],  
        selectionModel: { type: "row" }  
    };  

    obj_tar_izq.dataModel = { data: data };

    $grid_tar_izq = $("#grid_tar_izq").pqGrid(obj_tar_izq);
    //$grid_tar_izq.pqGrid( "option", "dataModel.data", [] );
    //$grid_tar_izq.pqGrid( "refreshDataAndView" );

    var data = [
        {C1:'CONSUMO DE AGUA', C2: "12", C3:"12.08", C4:"1234"}
    ];
    var obj_tar_der = {
        width:"100%",
        minWidth:40,
        height:250,
        rowBorders:true,
        fillHandle: "",
        editable:false,
        del: true,
        selectionModel: { type: "row", mode:"single"},        
        numberCell: { show: false },
        collapsible: { on : false,toggle:false },
        stripeRows : true,
        pasteModel: { on: false },
        title: "CARGOS NUEVOS",
        showBottom: false,
        showTop: true,
        swipeModel: { on: false },
        toolbar:
       {
           cls: "pq-toolbar-export",
           items:
           [
               { type: "button", label: " Agregar Fila"        ,  attr:"id=co_agregar", cls:"btn"},
               { type: "button", label: " Calculo Automatico"  ,  attr:"id=co_calculo", cls:"btn"},
           ]
       },
        
        colModel: [         
            { title: "Descripción",  resizable: false, width: "45%", dataType: "number", dataIndx: "C1",halign:"center", align:"left"},
            { title: "Valor", width: "15%", dataType: "number", dataIndx: "C2",halign:"center", align:"center" },
            { title: "Vr. Ajuste", width: "17%", dataType: "string", dataIndx: "C3",halign:"center", align:"center" },
            { title: "Documento", width: "22%", dataType: "string", dataIndx: "C3",halign:"center", align:"center" },
            { title: "Eliminar",width: "20%", dataType: "string", align: "center", editable: false,  sortable: false,
            render: function (ui) {
                return "<button class='btn btn-default btn-sm'><span class='glyphicon glyphicon-trash'></span> </button>";
            }
            }
        ],      
        selectionModel: { type: "row" }
    };  
    
    obj_tar_der.dataModel = { data: data };

    $grid_tar_der = $("#grid_tar_der").pqGrid(obj_tar_der);
    //$grid_tar_der = $("#grid_tar_der").pqGrid(obj_tar_der);
    //$grid_tar_der.pqGrid( "option", "dataModel.data", [] ); 
}
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*  
function fn_Muestra_modal()
{

    $("#div_filtro_bts").modal({backdrop: "static",keyboard:false});
    $("#div_filtro_bts").on("shown.bs.modal", function () {
        //$("#div_filtro_bts div.modal-footer button").focus();
        //Aplicar trabajo cuando esta visible el objeto 
    });

}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*  

function fn_leer(){
    var f = new Date();
    var fec = (f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear());
    $("#tx_cliente").prop("disabled", true);
    $("#tx_orden").val("1395209");
    $("#tx_fecha").val(fec);
    $("#tx_nombre").val("PH BBVA");
    $("#tx_dir").val("PANAMA CENTRO");
    $("#tx_est_client").val("ACTIVO");
    $('#tx_est_conex').val("CON SUMINISTRO");
    $("#tx_reg").val("8000");
    $("#tx_ruta").val("8000-01-140-0010");
    $("#tx_tarif").val("1");
    $("#tx_actividad").val("BANCOS PRIVADOS");
    $("#tx_unid").val("1");            
    $("#tx_x_leg").val("0"); 

    $("#co_leer").html("<span class='glyphicon glyphicon-share-alt'></span> Enviar");
    $("#co_cancelar").html("<span class='glyphicon glyphicon-log-out'></span> Cancelar");   

    $("#tx_refe").prop("disabled", false);
    $("#co_obs").prop("disabled", false);
    $("#tx_refe").focus();   
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*  
function fn_limpiar(){

    $("#tx_nombre").val("");
    $("#tx_orden").val("");
    $("#tx_fecha").val(""); 
    $("#tx_dir").val("");
    $("#tx_est_client").val("");
    $('#tx_est_conex').val("");
    $("#tx_reg").val("");
    $("#tx_ruta").val("");
    $("#tx_tarif").val("");
    $("#tx_actividad").val("");
    $("#tx_refe").val("");
    $("#co_obs").val("");
    $("#tx_comuna").val("");
    $("#tx_clave").val("");
    $("#tx_ajuste").val("");
    $("#tx_origen").val("");    

    $("#tx_cliente").val("");
    $("#tx_cliente").prop("disabled", false);   
    $("#tx_cliente").focus();
    $("#cb_tip_ajust").val("");
    $("#cb_motiv").val("");
    $("#cb_origen").val("");

    $("#tx_refe").prop("disabled", true);
    $("#co_obs").prop("disabled", true);
}

//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
function fn_Muestra_ingre() {
    $("#div_ing_bts").modal({ backdrop: "static", keyboard: false });
    $("#div_ing_bts").on("shown.bs.modal", function () {
    //$("#div_ing_bts div.modal-footer button").focus();
        $grid.pqGrid( "refreshDataAndView" );
    });
}

//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
function fn_ventana_final(){
    $('#div_ing_bts').modal('hide');
    $("#co_leer").hide();
    $("#co_cancelar").hide();
    $("#direccion").hide();
    $("#comuna").show();
    $("#fila3").hide();
    $("#fila4").hide();
    $("#fila5").hide();
    $("#fila6").hide();
    $("#fila7").hide();
    $("#new_file").show();
    
    $("#panel_tarifas").show();
    $("#grid_secundaria").show();
    $("#boton_secun").show();
    
    $("#co_aprobar").prop("disabled", true);

    $grid_secun.pqGrid( "refreshView" );
    
}
//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
/////////////////////////////////FUNCIONES MODAL///////////////////////////////////////////
function fn_tip_ajust() {


    $("#cb_tip_ajust").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}

//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
function fn_motiv() {
    
    $("#cb_motiv").html("<option value='' selected></option><option value='1'>10</option> <option value='2' >20</option> <option value='3'>30</option>");
}

//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
function fn_origen() {

    $("#cb_origen").html("<option value='' selected></option><option value='005'>005</option> <option value='010' >010</option> <option value='015'>015</option>");
}

//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
function fn_anular(){
    $("#cb_tip_ajust").val("");
    $("#cb_motiv").val("");
    $("#cb_origen").val("");        
    $("#cb_motiv").prop("disabled",true);
    $("#cb_tip_ajust").focus();
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*  
function limpia_ajus()
{   
    $("#cb_motiv").val("");
    $("#cb_motiv").prop("disabled",true);
}

/////////////////////////////////FUNCIONES MODAL///////////////////////////////////////////
function fn_descr_cargo() 
{
    $("#cb_decrip").html("<option value='' selected></option><option value='1'>MATERIALES AGUA</option> <option value='2' >MANO DE OBRA</option> <option value='3'>DESCUENTO DE EMPLEADO</option> <option value='4'>ALCANTARILLADO</option> <option value='5'>COSTO MEDIDOR</option> <option value='6'>CONVENIO DE PAGO - SEMA</option> <option value='7'>ALCANTARILLADO - VALORIZACIÓN</option>");
}