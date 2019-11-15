var g_modulo="Medidores - Consulta Módulo de Medidores";
var g_titulo="Extractor de Medidores";
var parameters={};
var sql_grid_prim = "";
//var my_url="correc_prome_dudo.asp";//http://192.168.1.39/RAIZ/FACTURACION/FAC_REFACTURACION/REF_INGRESO/ING_AJUSTE.HTM?Sesion=2414374130&SYNParametro=
var my_url = "../../../../index.php?md=raiz/facturacion/fac_refacturacion/ref_ingreso&fl=ing_ajuste";
var $grid, $grid_secun, $grid_tar_izq, $grid_tar_der;
var $checked;
var $row = 0;//CONTROLA EL INDEX DE LA GRILLA DERECHA
var $tot_ajus = 0; //CONTROLA EL NETO TOTAL A AJUSTAR
var $bNcAdm = false;
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*


$(document).ready(function() {

    document.title = g_titulo ;
    document.body.scroll = "yes";

    //Se cargan las variables que vienen desde el server
	/*
    $("#tx_empresa").val(SYNSegCodEmpresa);
    $("#tx_rol").val(SYNSegRol);
    $("#tx_ip").val(SYNSegIP);
    $("#tx_rolfun").val(SYNSegRolFuncion);    
    $("#tx_cen_ope").val(SYNSegCodCentroOperFun);
	*/

    $("#div_header").load("/syn_globales/header.htm", function() {
        $("#div_mod0").html(g_modulo);
        $("#div_tit0").html(g_titulo);  
    });

    //Footer
    $("#div_footer").load("/syn_globales/footer.htm");           
    $("#tx_cliente").focus();
   
    jQuery('#tx_cliente').keypress(function(tecla) {
        if(tecla.charCode < 48 || tecla.charCode > 57) return false;
    });

    jQuery('#tx_tot_aju').keypress(function(tecla) {
        if( (tecla.charCode < 44 || tecla.charCode > 57) || tecla.charCode == 47) return false;
    });    
    
    fn_setea_grid_tarifa();
    
    
    $("#co_no_ajus").on("click", function (e){
        $("#dlg_confir_ajus").modal("hide");        
    }); 
});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*  
function fn_setea_grid_tarifa()
{       
    //////////////////////////////////INICIO GRILLA IZQUIERDA 01//////////////////////////////////
    var data = [
        {C1:'CONSUMO DE AGUA', C2: "0.00", C3:"12.08"},
        {C1:'DESCUENTO DE JUBILADO', C2: "0.00", C3:"-3.02"},               
    ];
    var obj_tar_izq = {
        width:"100%",
        minWidth:40,
        height:250,
        rowBorders:true,
        //fillHandle: "",
        editable:true,
        selectionModel: { type: "row", mode:"single"},        
        numberCell: { show: false },
        collapsible: { on : false,toggle:false },
        stripeRows : true,
        pasteModel: { on: false },
        title: "Regional",
        showBottom: false,
        showTop: true,
        swipeModel: { on: false },
       
        colModel: [  
        { title: "", width: 50, type: 'checkBoxSelection',dataType: "bool",dataIndx: "C3",align:"center", editor: false, cb: {select: true} },       
        { title: "Regional",  resizable: false, width: 240, dataType: "string", dataIndx: "C1",halign:"center", align:"left"},
        { title: "Descripción",width: 240, dataType: "number", dataIndx: "C2",halign:"center", align:"right"},            
        ],  
        selectionModel: { type: "row" }  
    };  

    obj_tar_izq.dataModel = { data: data };

    $grid_tar_izq = $("#grid_tar_izq").pqGrid(obj_tar_izq);
    ////////////////////////////////// FIN GRILLA IZQUIERDA 01 //////////////////////////////////
    

    ////////////////////////////////// INICIO GRILLA IZQUIERDA 02 //////////////////////////////////
    var data = [
        {C1:'CONSUMO DE AGUA', C2: "0.00"},
        {C1:'DESCUENTO DE JUBILADO', C2: "0.00"},               
    ];
    var obj_tar_izq2 = {
        width:"100%",
        minWidth:40,
        height:250,
        rowBorders:true,
        //fillHandle: "",
        editable:true,
        selectionModel: { type: "row", mode:"single"},        
        numberCell: { show: false },
        collapsible: { on : false,toggle:false },
        stripeRows : true,
        pasteModel: { on: false },
        title: "Marca",
        showBottom: false,
        showTop: true,
        swipeModel: { on: false },
        
        colModel: [
        { title: "", width: 50, type: 'checkBoxSelection',dataType: "bool",dataIndx: "C3",align:"center", editor: false, cb: {select: true} },         
        { title: "Código",  resizable: false, width: 240, dataType: "string", dataIndx: "C1",halign:"center", align:"left"},
        { title: "Nombre",width: 240, dataType: "number", dataIndx: "C2",halign:"center", align:"right"},            
        ],  
        selectionModel: { type: "row" }  
    };  

    obj_tar_izq2.dataModel = { data: data };

    $grid_tar_izq2 = $("#grid_tar_izq2").pqGrid(obj_tar_izq2);
    ////////////////////////////////// FIN GRILLA IZQUIERDA 02 //////////////////////////////////
    

    //********************************* INICIO GRILLA DERECHA 01 *********************************//
    var data = [
        {C1:'CONSUMO DE AGUA', C2: "12"}
    ];
    var obj_tar_der = {
        width:"100%",
        minWidth:40,
        height:250,
        rowBorders:true,
        fillHandle: "",
        editable:true,
        selectionModel: { type: "row", mode:"single"},        
        numberCell: { show: false },
        collapsible: { on : false,toggle:false },
        stripeRows : true,
        pasteModel: { on: false },
        pageModel: { rPP: 100, type: "local", rPPOptions:[100,300,500] },
        postRenderInterval: -1,        
        title: "Modelo de Medidores",
        showBottom: false,
        showTop: true,
        swipeModel: { on: false },
        
        colModel: [
        { title: "", width: 50, type: 'checkBoxSelection',dataType: "bool",dataIndx: "C3",align:"center", editor: false, cb: {select: true} },         
        { title: "Código",  resizable: false, width: 240, dataType: "number", dataIndx: "C1",halign:"center", align:"left"},
        { title: "Marca", width: 240, dataType: "double", dataIndx: "C2",halign:"center", align:"center"},           
        ],      
        selectionModel: { type: "row" }
    };  
    
    obj_tar_der.dataModel = { data: data };

    $grid_tar_der = $("#grid_tar_der").pqGrid(obj_tar_der);
    //********************************* FIN GRILLA DERECHA 01 *********************************//
    

    //********************************* INICIO GRILLA DERECHA 02 *********************************//
    var data = [
        {C1:'CONSUMO DE AGUA', C2: "12"}
    ];
    var obj_tar_der2 = {
        width:"100%",
        minWidth:40,
        height:250,
        rowBorders:true,
        fillHandle: "",
        editable:true,
        selectionModel: { type: "row", mode:"single"},        
        numberCell: { show: false },
        collapsible: { on : false,toggle:false },
        stripeRows : true,
        pasteModel: { on: false },
        pageModel: { rPP: 100, type: "local", rPPOptions:[100,300,500] },
        postRenderInterval: -1,        
        title: "Diámetro",
        showBottom: false,
        showTop: true,
        swipeModel: { on: false },
        
        colModel: [
        { title: "", width: 50, type: 'checkBoxSelection',dataType: "bool",dataIndx: "C3",align:"center", editor: false, cb: {select: true} },         
        { title: "Código",  resizable: false, width: 240, dataType: "number", dataIndx: "C1",halign:"center", align:"left"},
        { title: "Nombre", width: 240, dataType: "double", dataIndx: "C2",halign:"center", align:"center"},           
        ],      
        selectionModel: { type: "row" }
    };  
    
    obj_tar_der2.dataModel = { data: data };

    $grid_tar_der2 = $("#grid_tar_der2").pqGrid(obj_tar_der2);
    //********************************* FIN GRILLA DERECHA 02 *********************************//    
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*  
function fn_carga_gri_iz(empresa, suministro, correlativo){
    var arr = new Array(empresa, suministro, correlativo); // generamos un array
    var datos = JSON.stringify(arr); // lo pasamos a formato json    

    param2 = 
    {
        "func":"fn_carga_gri_iz",
        "datos" : datos
    };    

    var total_register;
    var dataModel = {
        location: "remote",
        sorting: "local",
        dataType: "json",
        method: "POST",
        sortDir: ["up", "down"],
        async:false,
        url: my_url+"&"+jQuery.param( param2 ),
        getData: function (dataJSON) {
            total_register = $.trim(dataJSON.totalRecords);
            var data = dataJSON.data;
            sql_grid_prim = dataJSON.sql;
            //if(total_register>=1){
            //    $("#co_excel").attr("disabled", false);
            //}
            return { data: dataJSON.data};
        },
        error: function(jqErr, err_stat, err_str) // ERROR EN EL ASP
        {
            fn_mensaje_boostrap(jqErr.responseText, g_titulo, $("") );
        }
    }    
    $grid_tar_izq.pqGrid( "option", "dataModel", dataModel );             
    $grid_tar_izq.pqGrid( "refreshDataAndView" );
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*  
function fn_mensaje(id,mensaje,segundos)
{
    $(id).show();
    $(id).html(mensaje);
    setTimeout(function(){$(id).html("");$(id).hide(); }, segundos);
}