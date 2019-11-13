var g_modulo="Facturación Clientes - Lecturas y Consumos";
var g_titulo="Ingreso Requerimientos Refacturados.";
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

    //fn_descr_cargo();

    fn_carga_ready();    
    
    fn_tip_ajust();
    fn_origen();

    fn_setea_grid_principal();
    fn_setea_grid_secundaria();
    fn_setea_grid_tarifa();

    $("#co_chk").hide();

    //AL PRESIONAR LA TECLA ENTER RETORNE LA INFORMACION
    $("#tx_cliente").keypress(function(e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if(code==13){
            if ($("#tx_cliente").val() ==""){
                fn_mensaje_boostrap("DIGITE EL NÚMERO DE SUMINISTRO", g_titulo, $("#tx_cliente"));
                return;
            }
            vda_sumi();

            fn_val_area_emi($("#tx_empresa").val(), $("#tx_rol").val());

            if($("#tx_vda_sum").val() != "0"){
                fn_mensaje_boostrap("CLIENTE TIENE ORDEN DE AJUSTE PENDIENTE.", g_titulo, $("#tx_vda_sum"));
                return;    
            }

            if($("#tx_val_emi").val() == "0"){
                fn_mensaje_boostrap("NO TIENE PERMISOS PARA REALIZAR AJUSTES.", g_titulo, $("#tx_vda_sum"));
                return;    
            }
            fn_leer();   
        }
    });     

    // FUNCION PARA VALIDAR QUE SE HAYA SELECCIONADO UN REGISTRO EN LA GRILLA EN EL CHECK BOX
    $("#tx_vda_chk").val("false");
    var vCon = 0;
    
    $grid.pqGrid({
        check: function( event, ui ) {
            if (ui.rowData) {
                
                var dataCell = ui.rowData;
                
                $("#tx_vda_chk").val(dataCell.C9);

                if($("#tx_vda_chk").val() == "true"){
                    vCon = vCon + 1;
                }else{
                    vCon = vCon - 1;
                }                
            }
        }
    });    
    

    $("#co_leer").on("click", function () {
        //Validación de informacion
        if ($.trim($("#co_leer").text()) == "Leer") {
            if ($("#tx_cliente").val() ==""){
                fn_mensaje_boostrap("DIGITE EL NÚMERO DE SUMINISTRO", g_titulo, $("#tx_cliente"));
                return;
            }
            vda_sumi();

            fn_val_area_emi($("#tx_empresa").val(), $("#tx_rol").val());

            if($("#tx_vda_sum").val() != "0"){
                fn_mensaje_boostrap("CLIENTE TIENE ORDEN DE AJUSTE PENDIENTE.", g_titulo, $("#tx_vda_sum"));
                return;    
            }

            if($("#tx_val_emi").val() == "0"){
                fn_mensaje_boostrap("NO TIENE PERMISOS PARA REALIZAR AJUSTES.", g_titulo, $("#tx_vda_sum"));
                return;    
            }
            $grid.pqGrid( "option", "dataModel.data", [] );
            $grid.pqGrid( "refreshView" );
            fn_leer();    
        }else{

            if ($("#tx_refe").val()==""){
                fn_mensaje_boostrap("DEBE DIGITAR LA REFERENCIA", g_titulo, $("#tx_refe"));
                return;
            }else{

                fn_num_orden();

                fn_etapa($("#tx_empresa").val());

                fn_crea_registro(
                    $("#tx_empresa").val(),     // 0
                    $("#tx_orden").val(),       // 1
                    $("#tx_cen_ope").val(),     // 2
                    $("#tx_rol").val(),         // 3
                    $("#tx_etapa_sig").val(),   // 4
                    $("#tx_cod_etapa").val(),   // 5
                    $("#tx_cod_evento").val(),  // 6
                    $("#tx_area_emi").val(),    // 7
                    $("#tx_rol_emi").val(),     // 8
                    $("#tx_cliente").val(),     // 9
                    $("#tx_refe").val(),        // 10
                    $("#tx_fecha").val(),       // 11
                    $("#co_obs").val()          // 12
                );

                fn_Muestra_ingre(); 
                return;         
            }           
        }
    });

    $("#co_aceptar").on("click", function () {
        
        if ($("#cb_tip_ajust").val() ==""){
            fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONE TIPO DE AJUSTE!!!</strong></div>',3000);
            $("#cb_tip_ajust").focus();
            return;
            }else{
                if ($("#cb_motiv").val()==""){
                fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONE MOTIVO!!!</strong></div>',3000);
                $("#cb_motiv").focus();
                return;
            }
            if ($("#cb_origen").val()==""){
                fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONE ORIGEN!!!</strong></div>',3000);
                $("#cb_origen").focus();
                return;    
            }
        }
        
        if(vCon > 0){
            // VENTANA CONFIRMACION (SI O NO) PARA PASAR A LA VENTANA FINAL
            $('#div_ing_bts').modal('hide');
            $("#dlg_confirmamod_final").modal({backdrop: "static",keyboard:false});                   
            $("#dlg_confirmamod_final").on("shown.bs.modal", function () {
                $("#co_fin_no").focus();
            });    
        }else{
            fn_mensaje('#mensaje_filtro2','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONE UN PERIODO!!</strong></div>',3000);
        }    
    });

    // CONFIRMACION (SI) PARA PASAR A LA VENTANA FINAL
    $("#co_fin_si").on("click", function(e){

        $("#co_chk").trigger("click");
        
        var vClave = $("#cb_tip_ajust").val();
        var vAjuste = $("#cb_motiv").val();
        var vOrigen = $("#cb_origen option:selected").text();

        $("#tx_vda_chk").val(checked);
        var canReg = checked.length;
        var vCheck = $("#tx_vda_chk").val();

        //$("#tx_comuna").val();
        $("#tx_clave").val(vClave);
        $("#tx_ajuste").val(vAjuste);
        $("#tx_origen").val(vOrigen);

        fn_vtn_fin(
            $("#cb_motiv").val(), 
            $("#cb_tip_ajust").val(), 
            $("#cb_origen").val(), 
            vCheck, 
            canReg,
            $("#tx_empresa").val(),
            $("#tx_cliente").val(),
            $("#tx_orden").val()
        );

        fn_ventana_final();

        $("#dlg_confirmamod_final").modal("hide");     
        $('#div_ing_bts').modal('hide');     
    });
    

    // CONFIRMACION (NO) PARA REGRESAR AL MODAL
    $("#co_fin_no").on("click", function (e){
        vCon = 0;
        $("#tx_vda_chk").val("false");
        $("#dlg_confirmamod_final").modal("hide");        
        $('#div_ing_bts').modal('show');
    });    

    $("#co_cancelar").on("click",function(){

        if ($.trim($("#co_cancelar").text())=="Cancelar"){
            $("#co_leer").prop("disabled", false);
            $("#co_leer").html("<span class='glyphicon glyphicon-search'></span> Leer");
            $("#co_cancelar").html("<span class='glyphicon glyphicon-off'></span> Cerrar"); 
    
            fn_limpiar();    
            return;
        }else{

            window.close();
        }
    });     

    //ANULAR VENTANA MODAL
    $("#co_anular").on("click",function(e){
        $('#div_ing_bts').modal('hide');
        $("#dlg_confirmamod").modal({backdrop: "static",keyboard:false});                   
        $("#dlg_confirmamod").on("shown.bs.modal", function () {
            $("#co_confirmamod_no").focus();
        });         
    });

    $("#co_confirmamod_si").on("click", function(e){
        fn_anular();          
        fn_anula_regis($("#tx_cliente").val(), $("#tx_orden").val(), $("#tx_empresa").val(), $("#tx_cen_ope").val(), $("#tx_rol").val());
        $("#co_leer").prop("disabled", true);
        $("#dlg_confirmamod").modal("hide");     
        fn_mensaje_boostrap("REGISTRO ANULADO.", g_titulo, "");  
        $('#div_ing_bts').modal('hide');
    });
    
    $("#co_confirmamod_no").on("click", function (e){
        vCon = 0;
        $("#tx_vda_chk").val("false");        
        $("#dlg_confirmamod").modal("hide");        
        $('#div_ing_bts').modal('show');
    });
    //FIN ANULAR VENTANA MODAL

    //CERRAR VENTANA FINAL
    $("#co_cerrar").on("click",function(e){
        vCon = 0;
        $("#tx_vda_chk").val("false");    
        fn_anula_final();
        $("#co_leer").prop("disabled", true);         
    });    

    //ANULAR VENTANA FINAL
    $("#co_anular2").on("click",function(e){
        $("#dlg_confirmamod2").modal({backdrop: "static",keyboard:false});                   
        $("#dlg_confirmamod2").on("shown.bs.modal", function () {
            $("#co_confirmamod_no2").focus();
        });         
    });

    $("#co_confirmamod_si2").on("click", function(e){
        vCon = 0;
        $("#tx_vda_chk").val("false");    
        fn_anula_regis($("#tx_cliente").val(), $("#tx_orden").val(), $("#tx_empresa").val(), $("#tx_cen_ope").val(), $("#tx_rol").val());
        fn_anula_final();
        $("#co_leer").prop("disabled", true);

        fn_mensaje_boostrap("REGISTRO ANULADO.", g_titulo, "");  
        $("#dlg_confirmamod2").modal("hide");     
    });
    
    $("#co_confirmamod_no2").on("click", function (e){
        $("#dlg_confirmamod2").modal("hide");        
    });    
    // FIN ANULAR VENTANA FINAL

    $("#co_close").on("click", function (e) {
        $("#co_leer").prop("disabled", true);
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
            
        if ($.trim($("#co_modificar").text())=="Ajustar"){

            if($("#tx_tot_aju").val() == 0 || $("#tx_tot_aju").val() == ""){
                fn_mensaje_boostrap("DEBE DIGITAR UN VALOR MAYOR O DIFERENTE DE CERO", g_titulo, $("#tx_tot_aju"));
                $("#tx_tot_aju").focus();
                return;   
            }            

            if($row == 0){
                $row = 1;
            }else{
                $row = $row + 1;
            }

            if($tot_ajus == 0){
                $tot_ajus = parseFloat($("#tx_tot_aju").val());
            }else{
                $tot_ajus = $tot_ajus + parseFloat($("#tx_tot_aju").val());
            }
            alert($tot_ajus+" => TOTAL AJUSTADO");            
            //CARGO LA GRILLA DERECHA POR CADA ITEM SELECCIONADO EN LA IZQUIERDA
            $( "#grid_tar_der" ).pqGrid( "addRow",
                { newRow: {
                        ID: $row,
                        C1: $("#tx_descripcion").val(), 
                        C2: $("#tx_tot_aju").val(), 
                        C3: $("#tx_tot_aju").val(), 
                        C4: $("#tx_nro_doc").val(),
                        C5: $("#tx_cod_cargo").val(),
                        C6: $("#tx_id_rela").val(),
                        C7: $("#tx_cant").val(),
                        C8: $("#tx_unidad").val(),
                        C9: $("#tx_cod_doc").val()
                    } 
                }
            );
            alert($row+" Fila AJUSTADA");
            $("#co_aprobar").prop("disabled", true);
            $('#div_filtro_bts').modal('hide');
        }        

        if ($.trim($("#co_modificar").text())=="Agregar"){

            if($("#cb_decrip").val() == ""){
                fn_mensaje_boostrap("DEBE SELECCIONAR UN CARGO.", g_titulo, $("#cb_decrip"));
                $("#tx_tot_aju").focus();
                return;   
            }            

            if($("#tx_tot_aju").val() == 0 || $("#tx_tot_aju").val() == ""){
                fn_mensaje_boostrap("DEBE DIGITAR UN VALOR MAYOR O DIFERENTE DE CERO", g_titulo, $("#tx_tot_aju"));
                $("#tx_tot_aju").focus();
                return;   
            }

            if($row == 0){
                $row = 1;
            }else{
                $row = $row + 1;
            }            

            if($tot_ajus == 0){
                $tot_ajus = parseFloat($("#tx_tot_aju").val());
            }else{
                $tot_ajus = $tot_ajus + parseFloat($("#tx_tot_aju").val());
            }
            alert($tot_ajus+" => TOTAL AGREGADO");
            //CARGO LA GRILLA DERECHA DEL BOTON "AGREGAR FILA"
            $( "#grid_tar_der" ).pqGrid( "addRow",
                { newRow: {
                        ID: $row,
                        C1: $("#cb_decrip option:selected").text(), 
                        C2: $("#tx_tot_aju").val(), 
                        C3: $("#tx_tot_aju").val(), 
                        C4: $("#tx_nro_doc").val(),
                        C5: $("#cb_decrip").val(),
                        C6: $("#tx_id_rela").val(),
                        C7: "",
                        C8: "",
                        C9: $("#tx_cod_doc").val()                        
                    }
                }
            );

            alert($row+"  Fila AGREGADA");
            $("#co_aprobar").prop("disabled", true);
            $('#div_filtro_bts').modal('hide');
        }        
                
    }); 


    $grid_secun.pqGrid({
    rowDblClick: function( event, ui ) {
        if (ui.rowData) 
            {
                var dataCell = ui.rowData;

                $("#tx_nro_doc").val(dataCell.C1);
                $("#tx_cod_doc").val(dataCell.C7)

                fn_carga_gri_iz(
                    $("#tx_empresa").val(),
                    $("#tx_cliente").val(),
                    dataCell.C7                  
                );    
                //$grid_tar_izq.pqGrid( "refreshView" );
            }
        }
    });     


    $("#co_agregar").on("click", function (e) {

        $("#co_modificar").html("<span class='glyphicon glyphicon-plus'></span> Agregar");
        
        fn_Muestra_modal();       

        $("#dv_desc").show();
        $("#dv_descrip").hide();       
        $("#tx_tot_aju").val(0);   

        fn_descr_cargo(
            $("#tx_empresa").val(),
            $("#cb_tip_ajust").val()
        );  
    });     


    $grid_tar_izq.pqGrid({
    rowDblClick: function( event, ui ) {
        if (ui.rowData) 
            {
                var dataCell = ui.rowData;  

                $("#dv_desc").hide();
                $("#dv_descrip").show();

                $("#tx_descripcion").prop("disabled",true);

                $("#tx_descripcion").val(dataCell.C1);
                $("#tx_cant").val(dataCell.C2);
                $("#tx_unidad").val(dataCell.C3);
                $("#tx_pendi").val(dataCell.C4);
                $("#tx_indi").val(dataCell.C5);
                $("#tx_cod_cargo").val(dataCell.C6); 
                $("#tx_id_rela").val(dataCell.C7); 
                //$("#tx_cod_doc").val(dataCell.C8); 
                $("#tx_nn1").val(dataCell.C9); 
                $("#tx_nn2").val(dataCell.C10); 
                $("#vr_new_ajus").val(dataCell.C11);
                $("#tx_tot_aju").val(dataCell.C11); 
                $("#tx_i_c").val(dataCell.C12);
                $("#tx_mto_sin").val(dataCell.C13);
                $("#tx_mto_con").val(dataCell.C14);
                $("#tx_IndAfectaSaldo").val(dataCell.C15);           

                if($("#tx_IndAfectaSaldo").val() != "S"){
                    fn_mensaje_boostrap("EL CARGO SELECCIONADO NO SE PUEDE AJUSTAR PORQUE ES UN CARGO INFORMATIVO. SELECCIONAR OTRO CARGO O AGREGAR EL CARGO CORRESPONDIENTE PARA REALIZAR EL AJUSTE.", g_titulo, "");
                    return;
                }

                $("#co_modificar").html("<span class='glyphicon glyphicon-edit'></span> Ajustar");

                fn_Muestra_modal();                
            }
        }
    });

    $("#co_grabar").on("click", function (e) {

        if($row == 0){
            fn_mensaje_boostrap("EL AJUSTE NO SE PUEDE REALIZAR POR U$0. ", g_titulo, "");
            return;
        }

        fn_est_refacturacion(
            $("#tx_empresa").val(),
            $("#tx_cliente").val(),
            $("#tx_orden").val()
        );
        
        if(($("#tx_est_refac").val() != "I") && ($("#tx_desc_refac").val() != null)){
            fn_mensaje_boostrap("LA ORDEN "+$("#tx_orden").val()+" SE ENCUENTRA EN ESTADO "+$("#tx_desc_refac").val()+" Y NO ES POSIBLE LA ACTUALIZACIÓN", g_titulo, "");
            return;            
        }

        if($("#cb_tip_ajust").val() == "03"){
            fn_signo_monto(
                $("#tx_empresa").val(),
                $("#cb_motiv").val()
            );

            if($("#tx_signo_monto").val() == ""){
                fn_mensaje_boostrap("MOTIVO DE AJUSTE "+$("#tx_desc_monto").val()+" NO ESTÁ CONFIGURADO CORRECTAMENTE, COMUNICARSE CON OPERACIONES ESPECIALES.", g_titulo, "");
                return;                  
            }

            if($("tx_signo_monto").val() == "P" && $tot_ajus < 0){
                fn_mensaje_boostrap("MOTIVO SELECCIONADO SOLO PERMITE AJUSTE DÉBITOS, PERO EL MONTO A AJUSTAR ("+$tot_ajus+") ES UN CRÉDITO, FAVOR VERIFICAR.", g_titulo, "");
                return;                  
            }

            if($("tx_signo_monto").val() == "N" && $tot_ajus > 0){
                fn_mensaje_boostrap("MOTIVO SELECCIONADO SOLO PERMITE AJUSTE CRÉDITO, PERO EL MONTO A AJUSTAR ("+$tot_ajus+") ES UN DÉBITO, FAVOR VERIFICAR.", g_titulo, "");
                return;
            }            

        }

        if($("#cb_tip_ajust").val() == "01" && $tot_ajus < 0){
            fn_mensaje_boostrap("TIPO DE AJUSTE ES DÉBITO, PERO EL MONTO A AJUSTAR ("+$tot_ajus+") ES UN CRÉDITO, FAVOR VERIFICAR.", g_titulo, "");
            return;
        }

        if($("#cb_tip_ajust").val() == "02" && $tot_ajus > 0){
            fn_mensaje_boostrap("TIPO DE AJUSTE ES CRÉDITO, PERO EL MONTO A AJUSTAR ("+$tot_ajus+") ES UN DÉBITO, FAVOR VERIFICAR.", g_titulo, "");
            return;
        }

        if(parseFloat($("#cb_tip_ajust").val()) > 0){

            if(!fn_val_monto(
                $("#tx_empresa").val(),
                $("#tx_cliente").val(),
                $("#tx_orden").val(),
                $("#cb_tip_ajust").val()
            )) return;

            if(!fn_permi_Ajus(
                $("#tx_empresa").val(),
                $("#tx_rol").val(),
                $("#cb_tip_ajust").val(),
                "GRABAR"
            )) return; //VALIDO PERMISOS DE AJUSTES
        }
        
        var data =$grid_tar_der.pqGrid("option","dataModel.data");
        var celda = "";
        var num = 0;
        data.forEach(function(row){
            celda += $.trim($("#tx_cliente").val())+"|";    //01
            celda += $.trim($("#tx_orden").val())+"|";      //02
            celda += $.trim(row["C5"])+"|";                 //03
            celda += $.trim(row["C6"])+"|";                 //04
            celda += $.trim(row["C7"])+"|";                 //05
            celda += $.trim(row["C8"])+"|";                 //06
            celda += $.trim(row["C9"])+"|";                 //07
            celda += "N"+"|";                               //08
            celda += $.trim(row["C3"])+"|";                 //09
            celda += $.trim(row["C3"])+"|";                 //10
            celda += $.trim(row["C3"])+"|";                 //11
            celda += "REFA"+"|";                            //12
            celda += "N"+"|";                               //13
            celda += "~";
        });
    

        fn_grabar(
            $("#tx_cliente").val(),         //'01: NUMERO SUMINISTRO.
            "",                             //'02: TIPO DOCUMENTO AFECTADO.
            "",                             //'03: NUMERO DOCUMENTO AFECTADO.
            $tot_ajus,                      //'04: TOTAL A REFACTURAR.
            $("#tx_rol").val(),             //'05: USUARIO CREADOR.
            $("#tx_orden").val(),           //'06: NUMERO DE ORDEN.
            $("#tx_empresa").val(),         //'07: CODIGO EMPRESA.
            $("#cb_tip_ajust").val(),       //'08: CODIGO TIPO MOVIMIENTO.
            $("#cb_motiv").val(),           //'09: CODIGO CAUSAL.
            $("#txtCodigoEfecto").val(),    //'10: CODIGO EFECTO.
            $("#cb_origen").val(),          //'11: CODIGO ORIGEN.
            $("#tx_tip_doc").val(),         //'12: TIPO DOCUMENTO REFACTURACION
            $("#tx_doc_contr").val(),       //'13: TIPO DOCUMENTO CONTRAPARTIDA REFACTURACION
            "",                             //'14: CORRELATIVO DE DOCUMENTO FACTURA
            "",                             //'15: NUMERO SUMINISTRO CONTRAPARTIDA.
            "",                             //'16: CODIGO OFICINA DE PAGO DE CONTRAPARTIDA.
            "",                             //'17: FECHA DE PAGO DE CONTRAPARTIDA.
            $("#tx_afec_fact").val(),       //'18: TIPO MOVIMIENTO AFECTA FACTURACION.
            $("#tx_ind_saldo").val(),       //'19: TIPO MOVIMIENTO MODIFICA SALDO.
            $row,                           //'20: CANTIDAD DE CARGOS ENVIADOS A GRABAR
            celda                           //'21: GRILLA DERECHA (EN UN ARRAY)
        );  
    });            

    $("#co_aprobar").on("click", function (e) {

        fn_peri_moro($("#tx_empresa").val());

        if($("#tx_periodo_moro").val() == "0"){
            fn_mensaje_boostrap("NO SE HA EJECUTADO LA GESTION DE MOROSIDAD DEL PERIODO ANTERIOR, NO ES POSIBLE APROBAR EL AJUSTE EN ESTOS MOMENTOS!", g_titulo, "");
            return;
        }
        
        fn_val_est_fac($("#tx_empresa").val(), $("#tx_cliente").val());

        if($("#tx_est_fac").val() == "S"){
            fn_mensaje_boostrap("EL CLIENTE SE ENCUENTRA EN PROCESO DE FACTURACIÓN, NO ES POSIBLE APROBAR EL AJUSTE EN ESTOS MOMENTOS.", g_titulo, "");
            return;
        }        

        fn_rol_padre($("#tx_rol").val());

        if($("#tx_rol_padre").val() == ""){
            fn_mensaje_boostrap("EL USUARIO NO TIENE ROL PADRE PARA APROBACIÓN DE AJUSTE.", g_titulo, "");
            return;
        }

        if(parseFloat($("#cb_tip_ajust").val()) > "0"){
            if(!fn_permi_Ajus(
                $("#tx_empresa").val(),
                $("#tx_rol").val(),
                $("#cb_tip_ajust").val(),
                "APROBAR"
            )) return; //VALIDO PERMISOS DE AJUSTES
        }

        fn_est_refacturacion(
            $("#tx_empresa").val(),
            $("#tx_cliente").val(),
            $("#tx_orden").val()
        );
        
        if(($("#tx_est_refac").val() != "I") && ($("#tx_desc_refac").val() != null)){

            if ($("#tx_est_refac").val() == "R"){
                $("#tx_desc_refac").val("ANULADA");                
            }
            fn_mensaje_boostrap("LA ORDEN "+$("#tx_orden").val()+" SE ENCUENTRA EN ESTADO "+$("#tx_desc_refac").val()+" Y NO ES POSIBLE LA ACTUALIZACIÓN", g_titulo, "");
            return;            
        }

        
        $("#dlg_confir_ajus").modal({backdrop: "static",keyboard:false});                   
        $("#dlg_confir_ajus").on("shown.bs.modal", function () {
            $("#co_no_ajus").focus();
        });  
        //fn_mensaje_boostrap("PREGUNTA CONFIRMA LA APROBACION", g_titulo, "");
        //return;            
    });

    $("#co_si_ajus").on("click", function(e){

        fn_insert_aprobar(
            $("#tx_cliente").val(),     //0
            $("#tx_rol").val(),         //1
            $tot_ajus,                  //2
            $("#tx_empresa").val(),     //3
            $("#tx_orden").val(),       //4
            $("#cb_tip_ajust").val(),   //5
            "0000",                     //6
            $("#tx_cen_ope").val()      //7
        );

        vCon = 0;
        $("#tx_vda_chk").val("false");    
        fn_anula_final();
        $("#co_leer").prop("disabled", true);
        
        $("#dlg_confir_ajus").modal("hide");     
    });

    $("#co_no_ajus").on("click", function (e){
        $("#dlg_confir_ajus").modal("hide");        
    }); 
});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*  
function fn_insert_aprobar(vNroSuministro,vRolAprobador,vMontoRefa,vCodEmpresa,vNroOrden,vTipMovimiento,vCargoTipMov,vCenOpeRol) {
    var arr = new Array(vNroSuministro,vRolAprobador,vMontoRefa,vCodEmpresa,vNroOrden,vTipMovimiento,vCargoTipMov,vCenOpeRol); // generamos un array
    var datos = JSON.stringify(arr); // lo pasamos a formato json
    
    dato_ori = [];

    parameters = {
        "func" : "fn_insert_aprobar",
        "datos" : datos
    };

    HablaServidor(my_url, parameters, "text", function(text) {
        dato_ori = text.split("|");
        
        if (dato_ori[0] == "OK"){
            
            fn_ejec_ajus(datos);
            
            fn_mensaje_boostrap("APROBACION REALIZADA... SE AJUSTAN LOS SALDOS", g_titulo, $(""));
        }

        if(dato_ori[0] == "ERR" && dato_ori[1] == "F") {
            fn_mensaje_boostrap("APROBACION REALIZADA ANTERIORMENTE.", g_titulo, $(""));
            return;
        }     
            
        if(dato_ori[0] == "NP" && dato_ori[1] == "F") {
            fn_mensaje_boostrap("MONTO EXCEDE NIVEL DE APROBACION. SE REENVIA A NIVEL SUPERIOR.", g_titulo, $(""));
        }
        
    });
    
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*  
function fn_ejec_ajus(datos) {

    parameters = {
        "func" : "fn_ejec_ajus",
        "datos" : datos
    };
    HablaServidor(my_url, parameters, "text", function(text) {
        if(text == "") {
            //fn_mensaje_boostrap("fn_ejec_ajus OK", g_titulo, $(""));
        }
        else
            fn_mensaje_boostrap(text, g_titulo, $(""));
            return;
    });
    
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*  
function fn_rol_padre(rol){
    var arr = new Array(rol); // generamos un array
    var datos = JSON.stringify(arr); // lo pasamos a formato json    

    dato_ori = [];

    parameters = 
    {
        "func":"fn_rol_padre",
        "datos" : datos
    };
    
    HablaServidor(my_url,parameters,'text', function(text){
        if(text != ""){
            dato_ori = text.split("|");

            $("#tx_rol_padre").val(dato_ori[0]);
        }
        else{
            fn_mensaje_boostrap(text, g_titulo, $(""));
            return;
        }       
    });
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*  
function fn_val_est_fac(empresa, suministro){
    var arr = new Array(empresa, suministro); // generamos un array
    var datos = JSON.stringify(arr); // lo pasamos a formato json    

    dato_ori = [];

    parameters = 
    {
        "func":"fn_val_est_fac",
        "datos" : datos
    };
    
    HablaServidor(my_url,parameters,'text', function(text){
        if(text != ""){
            dato_ori = text.split("|");

            $("#tx_est_fac").val(dato_ori[0]);

        }
        //else{
        //    fn_mensaje_boostrap(text, g_titulo, $(""));
        //    return;
        //}       
    });
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*  
function fn_peri_moro(empresa){
    var arr = new Array(empresa); // generamos un array
    var datos = JSON.stringify(arr); // lo pasamos a formato json    

    dato_ori = [];

    parameters = 
    {
        "func":"fn_peri_moro",
        "datos" : datos
    };
    
    HablaServidor(my_url,parameters,'text', function(text){
        if(text != ""){
            dato_ori = text.split("|");

            $("#tx_periodo_moro").val(dato_ori[0]);

        }
        else{
            fn_mensaje_boostrap(text, g_titulo, $(""));
            return;
        }       
    });
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*  
function fn_grabar(sumi, doc_afec, nro_doc_afec, tot_aju, usua, num_orden, empre, tip_mov, causal, efecto, orig, doc_refac, doc_contra, corr_doc, sum_contra, ofi, fech, mov_afec, ind_sal, cant_carg, gri_der) {
    var arr = new Array(sumi, doc_afec, nro_doc_afec, tot_aju, usua, num_orden, empre, tip_mov, causal, efecto, orig, doc_refac, doc_contra, corr_doc, sum_contra, ofi, fech, mov_afec, ind_sal, cant_carg, gri_der); // generamos un array
    var datos = JSON.stringify(arr); // lo pasamos a formato json
    parameters = {
        "func" : "fn_grabar",
        "datos" : datos
    };
    HablaServidor(my_url, parameters, "text", function(text) {
        if(text == "") {
            fn_mensaje_boostrap("AJUSTE GRABADO.", g_titulo, $(""));
            //$grid.pqGrid( "refreshDataAndView" );            
            $("#co_aprobar").prop("disabled", false); 
        }
        else
            fn_mensaje_boostrap(text, g_titulo, $(""));
    });
    
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*  
function fn_permi_Ajus(empresa, rol, tip_ajuste, descr){
    var arr = new Array(empresa, rol, tip_ajuste, descr); // generamos un array
    var datos = JSON.stringify(arr); // lo pasamos a formato json    
    
    dato_ori = [];    
    dato_ori = datos.split(",");

    fn_tip_ajus(datos);

    if($("#tx_permi_ajus").val() == 0){
            fn_mensaje_boostrap("NO TIENE PERMISOS PARA "+dato_ori[3]+" ESTE TIPO DE AJUSTE.", g_titulo, "");
            return false;         
    }
    else
        return true;
}    

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*  
function fn_tip_ajus(datos){
    //var arr = new Array(datos); // generamos un array
    //var datos = JSON.stringify(arr); // lo pasamos a formato json    

    dato_ori = [];

    parameters = 
    {
        "func":"fn_tip_ajus",
        "datos" : datos
    };
    
    HablaServidor(my_url,parameters,'text', function(text){
        if(text != ""){
            dato_ori = text.split("|");

            $("#tx_permi_ajus").val(dato_ori[0]); 
        }
        else{
            fn_mensaje_boostrap(text, g_titulo, $(""));
            return;
        }       
    });
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*  
function fn_val_monto(empresa, suministro, nro_orden, tip_ajuste){
    var arr = new Array(empresa, suministro, nro_orden, tip_ajuste); // generamos un array
    var datos = JSON.stringify(arr); // lo pasamos a formato json    
    
    dato_ori = [];    
    dato_ori = datos.split(",");

    fn_busca_saldo(datos);

    if((parseFloat($("#tx_busca_saldo").val())) == 1 && ($("#cb_tip_ajust").val() != "")){
        fn_busca_Signo(datos);    

        if($("#tx_busca_monto").val() == "A"){

            if((parseFloat($tot_ajus)) < 0 || ( $bNcAdm && (parseFloat($tot_ajus) == 0))) return true;
            else{
                fn_mensaje_boostrap("TIPO DOCUMENTO NO CORRESPONDE CON SALDO.", g_titulo, "");
                return false; 
            }
        }      

        if($("#tx_busca_monto").val() == "C"){

            if(parseFloat($tot_ajus) > 0) return true;
            else{
                fn_mensaje_boostrap("TIPO DOCUMENTO NO CORRESPONDE CON SALDO.", g_titulo, "");
                return false;                 
            } 
        }

        if($("#tx_busca_monto").val() == "X") return true;
        else
            return false;
    }
    else
    if($("#tx_busca_monto").val() != 1 && $("#cb_tip_ajust").val() == ""){
        if(parseFloat($("#tx_busca_monto").val()) == 0) fn_mensaje_boostrap("EL SALDO NO ES MODIFICABLE.", g_titulo, "");
        if($("#cb_tip_ajust").val() == "") fn_mensaje_boostrap("DEBE SELECCIONAR TIPO MOVIMIENTO", g_titulo, "");
        return false;
    }else{
        return true;
    }
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*  
function fn_busca_Signo(datos){
    //var arr = new Array(datos); // generamos un array
    //var datos = JSON.stringify(arr); // lo pasamos a formato json    

    dato_ori = [];

    parameters = 
    {
        "func":"fn_busca_Signo",
        "datos" : datos
    };
    
    HablaServidor(my_url,parameters,'text', function(text){
        if(text != ""){
            dato_ori = text.split("|");

            $("#tx_busca_monto").val(dato_ori[0]); 
        }
        else{
            fn_mensaje_boostrap(text, g_titulo, $(""));
            return;
        }       
    });
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*  
function fn_busca_saldo(datos){
    //var arr = new Array(datos); // generamos un array
    //var datos = JSON.stringify(arr); // lo pasamos a formato json    

    dato_ori = [];

    parameters = 
    {
        "func":"fn_busca_saldo",
        "datos" : datos
    };
    
    HablaServidor(my_url,parameters,'text', function(text){
        if(text != ""){
            dato_ori = text.split("|");

            $("#tx_busca_saldo").val(dato_ori[0]);
        }
        else{
            fn_mensaje_boostrap(text, g_titulo, $(""));
            return;
        }       
    });
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*  
function fn_signo_monto(empresa, motivo){
    var arr = new Array(empresa, motivo); // generamos un array
    var datos = JSON.stringify(arr); // lo pasamos a formato json    

    dato_ori = [];

    parameters = 
    {
        "func":"fn_signo_monto",
        "datos" : datos
    };
    
    HablaServidor(my_url,parameters,'text', function(text){
        if(text != ""){
            dato_ori = text.split("|");

            $("#tx_signo_monto").val(dato_ori[0]);
            $("#tx_desc_monto").val(dato_ori[1]);     
        }
        else{
            fn_mensaje_boostrap(text, g_titulo, $(""));
            return;
        }       
    });
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*  
function fn_est_refacturacion(empresa, suministro, nro_orden){
    var arr = new Array(empresa, suministro, nro_orden); // generamos un array
    var datos = JSON.stringify(arr); // lo pasamos a formato json    

    dato_ori = [];

    parameters = 
    {
        "func":"fn_est_refacturacion",
        "datos" : datos
    };
    
    HablaServidor(my_url,parameters,'text', function(text){
        if(text != ""){
            dato_ori = text.split("|");

            $("#tx_est_refac").val(dato_ori[0]);
            $("#tx_desc_refac").val(dato_ori[1]);     
        }
        else{
            fn_mensaje_boostrap(text, g_titulo, $(""));
            return;
        }       
    });
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*  
function fn_vtn_fin(motivo, tip_ajus, origen, check, can_check, empresa, suministro, nro_orden) {
    var arr = new Array(motivo, tip_ajus, origen, check, can_check, empresa, suministro, nro_orden); // generamos un array
    var datos = JSON.stringify(arr); // lo pasamos a formato json
    parameters = {
        "func" : "fn_vtn_fin",
        "datos" : datos
    };
    HablaServidor(my_url, parameters, "text", function(text) {
        if(text == "") {
            //fn_mensaje_boostrap("fn_vtn_fin OK", g_titulo, $(""));
            //$grid.pqGrid( "refreshDataAndView" );             
        }
        else
            fn_mensaje_boostrap(text, g_titulo, $(""));
    });
    
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*  
function fn_anula_regis(suministro, nro_orden, cod_empresa, cod_cen_ope, rol) {
    var arr = new Array(suministro, nro_orden, cod_empresa, cod_cen_ope, rol); // generamos un array
    var datos = JSON.stringify(arr); // lo pasamos a formato json
    parameters = {
        "func" : "fn_anula_regis",
        "datos" : datos
    };
    HablaServidor(my_url, parameters, "text", function(text) {
        if(text == "") {
            //fn_mensaje_boostrap("anula fn_anula_regis OK", g_titulo, $(""));
            //$grid.pqGrid( "refreshDataAndView" );             
        }
        else
            fn_mensaje_boostrap(text, g_titulo, $(""));
    });
    
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*  
function fn_num_orden()
{
    dato_ori = [];
    parameters = 
    {
        "func":"fn_orden",
        "empresa":$("#tx_empresa").val()
    };
    
    HablaServidor(my_url,parameters,'text', function(text){
        if(text != ""){
            dato_ori = text.split("|");

            $("#tx_orden").val(dato_ori[0]);
            
        }
        else{
            fn_mensaje_boostrap(text, g_titulo, $(""));
            return;
        }       
    });
    
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*  
function fn_crea_registro(empr, nro_ord, cen_ope, rol, eta_sig, cod_eta, cod_even, area_emi, rol_emi, sumini, refe, fecha, obser) {
    var arr = new Array(empr, nro_ord, cen_ope, rol, eta_sig, cod_eta, cod_even, area_emi, rol_emi, sumini, refe, fecha, obser); // generamos un array
    var datos = JSON.stringify(arr); // lo pasamos a formato json
    parameters = {
        "func" : "fn_crea_registro",
        "datos" : datos
    };
    HablaServidor(my_url, parameters, "text", function(text) {
        if(text == "") {
            //fn_mensaje_boostrap("SP OK", g_titulo, $(""));
            //$grid.pqGrid( "refreshDataAndView" );             
        }
        else
            fn_mensaje_boostrap(text, g_titulo, $(""));
    });
    
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*  
function fn_val_area_emi(empresa, rol){
    var arr = new Array(empresa, rol); // generamos un array
    var datos = JSON.stringify(arr); // lo pasamos a formato json    

    dato_ori = [];

    parameters = 
    {
        "func":"fn_val_area_emi",
        "datos" : datos
    };
    
    HablaServidor(my_url,parameters,'text', function(text){
        if(text != ""){
            dato_ori = text.split("|");

            $("#tx_val_emi").val(dato_ori[0]);
            $("#tx_area_emi").val(dato_ori[1]); //CREAR EN HTML
            $("#tx_rol_emi").val(dato_ori[2]); //CREAR EN HTML            
            
        }
        else{
            fn_mensaje_boostrap(text, g_titulo, $(""));
            return;
        }       
    });
    
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*  
function fn_etapa(empresa){
    var arr = new Array(empresa); // generamos un array
    var datos = JSON.stringify(arr); // lo pasamos a formato json    

    dato_ori = [];

    parameters = 
    {
        "func":"fn_etapa",
        "datos" : datos
    };
    
    HablaServidor(my_url,parameters,'text', function(text){
        if(text != ""){
            dato_ori = text.split("|");

            $("#tx_etapa_sig").val(dato_ori[0]);  //CREAR EN HTML
            $("#tx_cod_etapa").val(dato_ori[1]);  //CREAR EN HTML
            $("#tx_cod_evento").val(dato_ori[2]); //CREAR EN HTML
            
        }
        else{
            fn_mensaje_boostrap(text, g_titulo, $(""));
            return;
        }       
    });
    
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*  
function vda_sumi()
{
    dato_ori = [];
    parameters = 
    {
        "func":"fn_vda_sumi",
        "empresa":$("#tx_empresa").val(),
        "p_cliente":$("#tx_cliente").val()
    };
    
    HablaServidor(my_url,parameters,'text', function(text){
        if(text != ""){
            dato_ori = text.split("|");

            $("#tx_vda_sum").val(dato_ori[0]);        
            
        }
        else{
            fn_mensaje_boostrap(text, g_titulo, $(""));
            return;
        }       
    });
    
}
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*  

function fn_leer(){   

    dato_ori = [];
    parameters = 
    {
        "func":"fn_leer_sumi",
        "empresa":$("#tx_empresa").val(),
        "p_cliente":$("#tx_cliente").val()
    };
    
    HablaServidor(my_url,parameters,'text', function(text){
        if(text != ""){

           var f = new Date();
           var fec = (f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear());
           $("#tx_cliente").prop("disabled", true);
           $("#tx_fecha").val(fec);             
            
            dato_ori = text.split("|");

            $("#tx_nombre").val(dato_ori[0]);
            $("#tx_dir").val(dato_ori[1]);
            $("#tx_est_client").val(dato_ori[2]);
            $('#tx_est_conex').val(dato_ori[3]);
            $("#tx_ruta").val(dato_ori[4]);
            $("#tx_tarif").val(dato_ori[5]);
            $("#tx_reg").val(dato_ori[6]);
            $("#tx_actividad").val(dato_ori[7]);
            $("#tx_comuna").val(dato_ori[8]);

            $("#co_leer").html("<span class='glyphicon glyphicon-share-alt'></span> Enviar");
            $("#co_cancelar").html("<span class='glyphicon glyphicon-log-out'></span> Cancelar");   

            $("#tx_refe").prop("disabled", false);
            $("#co_obs").prop("disabled", false);
            $("#tx_refe").focus();              
        }
        else{
            fn_mensaje_boostrap("SUMINISTRO NO EXISTE.", g_titulo, $(""));
            return;
        }       
    }); 
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*  
function fn_setea_grid_principal()
{ 
    var data = [
        //{ C1:'69792375', C2: "14/03/2078", C3:'FA', C4:'16.2', C5:'No Refacturado', C6:'No', C7:'No', C8:'03-2018'},
        //{ C1:'69334507', C2: "14/02/2018", C3:'FA', C4:'15.2', C5:'No Refacturado', C6:'No', C7:'No', C8:'02-2018'}
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
            toolbar: {
                items: [{
                   type: 'button',
                   label: 'Get ID',
                    attr:"id=co_chk",
                    listener: function () {
                        checked = this.Checkbox('C9').getCheckedNodes(true).map(function(rd){
                            return rd.C10
                        })
                   }                    
               }]
            }        
        };
        obj.colModel = [
            { title: "", width: 50, type: 'checkBoxSelection',dataType: "bool",dataIndx: "C9",align:"center", editor: false, cb: {select: true} },
            { title: "Documento",  resizable: false, width: 100, dataType: "number", dataIndx: "C1",halign:"center", align:"right"},
            { title: "Fecha", width: 100, dataType: "string", dataIndx: "C2",halign:"center", align:"center" },
            { title: "Tipo", width: 90, dataType: "number", dataIndx: "C3",halign:"center", align:"right" },
            { title: "Valor", width: 90, dataType: "number", dataIndx: "C4",halign:"center", align:"right" },
            { title: "Refacturado",width: 140, dataType: "number", dataIndx: "C5",halign:"center", align:"right"},
            { title: "Campo 1",width: 90, dataType: "number", dataIndx: "C6",halign:"center", align:"right"},
            { title: "Campo 2",width: 90, dataType: "number", dataIndx: "C7",halign:"center", align:"right"},
            { title: "Periodo",width: 90, dataType: "number", dataIndx: "C8",halign:"center", align:"right"},
            //{ title: "valor_chk", width: 80, dataType: "string", dataIndx: "C9",halign:"center", align:"center", hidden:true },
            { title: "",width: 10, dataType: "number", dataIndx: "C10",halign:"center", align:"right",  hidden:true},
];      
        obj.dataModel = { data: data };

        
        $grid = $("#div_grid_dos").pqGrid(obj);
        $grid.pqGrid( "refreshDataAndView" );

}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*  
function fn_carga_grid_principal()
{
    //fn_filtro();
    var param2 =  {
        "func":"fn_carga_grilla",
        "empresa":$("#tx_empresa").val(),
        "p_cliente":$("#tx_cliente").val()
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
    $grid.pqGrid( "option", "dataModel", dataModel );             
    $grid.pqGrid( "refreshDataAndView" );
    
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*  
function fn_setea_grid_secundaria()
{ 
    var data = [
        //{C1:'69792375', C2: "FA", C3:'03-2018', C4:'16.2', C5:'ES. PMÁ - COLON ALCANTARILLADO', C6:'No', C7:'No', C8:'03-2018'},
        //{C1:'12873128', C2: "FA", C3:'04-2018', C4:'10.2', C5:'ES. PMÁ - COLON ALCANTARILLADO', C6:'No', C7:'No', C8:'04-2018'}     
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
        { title: "Ajustado", width: 90, dataType: "string", dataIndx: "C6",halign:"center", align:"center" },
        { title: "",width: 10, dataType: "number", dataIndx: "C7",halign:"center", align:"right",  hidden:true},
    ];

    obj.dataModel = { data: data };

    $grid_secun = $("#div_grid_secun").pqGrid(obj);
    $grid_secun.pqGrid( "refreshDataAndView" );
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*  
function fn_carga_grid_secun(empresa, suministro, nro_orden){
    var arr = new Array(empresa, suministro, nro_orden); // generamos un array
    var datos = JSON.stringify(arr); // lo pasamos a formato json    

    param2 = 
    {
        "func":"fn_carga_grid_secun",
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
    $grid_secun.pqGrid( "option", "dataModel", dataModel );             
    $grid_secun.pqGrid( "refreshDataAndView" );
    
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*  
function fn_setea_grid_tarifa()
{       
    var data = [
        //{C1:'CONSUMO DE AGUA', C2: "0.00", C3:"12.08"},
        //{C1:'DESCUENTO DE JUBILADO', C2: "0.00", C3:"-3.02"},        
        //{C1:'TASA DE ASEO - DIMAUD', C2: "0.00", C3:"6.00"},
        //{C1:'ALCANTARILLADO', C2: "0.00", C3:"6.07"}     
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
            { title: "Cantidad",width: 10, dataType: "number", dataIndx: "C2",halign:"center", align:"right",  hidden:true},
            { title: "Unidad",width: 10, dataType: "number", dataIndx: "C3",halign:"center", align:"right",  hidden:true},
            { title: "Pendiente", width: "24%", dataType: "number", dataIndx: "C4",halign:"center", align:"center" },
            { title: "Indicador",width: 10, dataType: "number", dataIndx: "C5",halign:"center", align:"right",  hidden:true},
            { title: "Codigo",width: 10, dataType: "number", dataIndx: "C6",halign:"center", align:"right",  hidden:true},
            { title: "IdRelacion",width: 10, dataType: "number", dataIndx: "C7",halign:"center", align:"right",  hidden:true},
            { title: "CodDocOriginal",width: 10, dataType: "number", dataIndx: "C8",halign:"center", align:"right",  hidden:true},
            { title: "NN1",width: 10, dataType: "number", dataIndx: "C9",halign:"center", align:"right",  hidden:true},
            { title: "NN2",width: 10, dataType: "number", dataIndx: "C10",halign:"center", align:"right",  hidden:true},
            { title: "Facturado", width: "24%", dataType: "double", dataIndx: "C11",halign:"center", align:"center" },
            { title: "I/C",width: 10, dataType: "number", dataIndx: "C12",halign:"center", align:"right",  hidden:true},
            { title: "MTO_SIN",width: 10, dataType: "number", dataIndx: "C13",halign:"center", align:"right",  hidden:true},
            { title: "MTO_CON",width: 10, dataType: "number", dataIndx: "C14",halign:"center", align:"right",  hidden:true},
            { title: "IndAfectaSaldo",width: 10, dataType: "number", dataIndx: "C15",halign:"center", align:"right",  hidden:true},
        ],  
        selectionModel: { type: "row" }  
    };  

    obj_tar_izq.dataModel = { data: data };

    $grid_tar_izq = $("#grid_tar_izq").pqGrid(obj_tar_izq);
    //$grid_tar_izq.pqGrid( "option", "dataModel.data", [] );
    //$grid_tar_izq.pqGrid( "refreshDataAndView" );

    var data = [
        //{C1:'CONSUMO DE AGUA', C2: "12", C3:"12.08", C4:"1234"}
    ];
    var obj_tar_der = {
        width:"100%",
        minWidth:40,
        height:250,
        rowBorders:true,
        fillHandle: "",
        editable:false,
        selectionModel: { type: "row", mode:"single"},        
        numberCell: { show: false },
        collapsible: { on : false,toggle:false },
        stripeRows : true,
        pasteModel: { on: false },
        pageModel: { rPP: 100, type: "local", rPPOptions:[100,300,500] },
        postRenderInterval: -1,        
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
            { title: "Row", width: 100, dataType: "integer", dataIndx: "ID", hidden:true },
            { title: "Descripción",  resizable: false, width: "35%", dataType: "number", dataIndx: "C1",halign:"center", align:"left"},
            { title: "Valor", width: "15%", dataType: "double", dataIndx: "C2",halign:"center", align:"center"},
            { title: "Vr. Ajuste", width: "15%", dataType: "double", dataIndx: "C3",halign:"center", align:"center"},
            { title: "Documento", width: "20%", dataType: "string", dataIndx: "C4",halign:"center", align:"center" },
            { title: "Codigo",width: 10, dataType: "number", dataIndx: "C5",halign:"center", align:"right",  hidden:true},
            { title: "IDRELACION",width: 10, dataType: "number", dataIndx: "C6",halign:"center", align:"right",  hidden:true},
            { title: "CANTIDAD",width: 10, dataType: "number", dataIndx: "C7",halign:"center", align:"right",  hidden:true},
            { title: "UNIDAD",width: 10, dataType: "number", dataIndx: "C8",halign:"center", align:"right",  hidden:true},
            { title: "COD_DOC_ORIG",width: 10, dataType: "number", dataIndx: "C9",halign:"center", align:"right",  hidden:true},
            { title: "Eliminar",width: "15%", dataType: "string", align: "center", editable: false,  sortable: false,
                render: function (ui) {
                    return "<button class='delete_btn btn-default btn-sm'><span class='glyphicon glyphicon-trash'></span> </button>";
                },
                postRender: function (ui) {
                    var grid = this,
                        $cell = grid.getCell(ui);
                    $cell.find(".delete_btn")
                        .button({ icons: { primary: 'ui-icon-scissors'} })
                        .bind("click", function (evt) {
                            
                            var datos = ui.rowData;
                            
                            //fn_tot_ajus(0,datos.C3);
                            
                            alert($tot_ajus+" - "+parseFloat(datos.C3));
                            $tot_ajus = $tot_ajus - parseFloat(datos.C3);
                            alert("Nuevo Total = "+$tot_ajus);

                            fn_resta_row();
                            
                            alert(" Fila Supuestamente que aliminaria: "+ui.rowIndx);
                            
                            $grid_tar_der.pqGrid("deleteRow", { rowIndx: ui.rowIndx });                      
                            //$grid_tar_der.pqGrid("refreshView");
                        });
                }            
            }
        ],      
        selectionModel: { type: "row" }
    };  
    
    obj_tar_der.dataModel = { data: data };

    $grid_tar_der = $("#grid_tar_der").pqGrid(obj_tar_der);
    //$grid_tar_der.pqGrid( "option", "dataModel.data", [] ); 
    //$grid_tar_der.pqGrid( "refreshDataAndView" );
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*  
function fn_tot_ajus(tipo, valor){
    var arr = new Array(tipo, valor); // generamos un array
    var datos = JSON.stringify(arr); // lo pasamos a formato json    
    
    dato_ori = [];    
    dato_ori = datos.split(",");

    alert($tot_ajus+" - "+dato_ori[1])
    $tot_ajus = $tot_ajus - parseFloat(dato_ori[1]);
    alert("Nuevo Total = "+$tot_ajus);
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*  
function fn_resta_row(){
    $row = $row -1; 
    $("#co_aprobar").prop("disabled", true);
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
function fn_Muestra_modal()
{

    $("#div_filtro_bts").modal({backdrop: "static",keyboard:false});
    $("#div_filtro_bts").on("shown.bs.modal", function () {
        //$("#div_filtro_bts div.modal-footer button").focus();
        //Aplicar trabajo cuando esta visible el objeto 
    });

}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*  
function fn_limpiar(){

    //LIMPIO LA GRILLA PRINCIPAL
    $grid.pqGrid( "option", "dataModel.data", [] );
    $grid.pqGrid( "refreshView" );    

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

    vCon = 0;
    $("#tx_vda_chk").val("false");

    $("#tx_refe").prop("disabled", true);
    $("#co_obs").prop("disabled", true);
}

//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
function fn_Muestra_ingre() {
    $("#div_ing_bts").modal({ backdrop: "static", keyboard: false });
    $("#div_ing_bts").on("shown.bs.modal", function () {
    //$("#div_ing_bts div.modal-footer button").focus();
        $grid.pqGrid( "refreshView" );
        fn_carga_grid_principal();
    });
}

//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
function fn_anula_final(){

    //LIMPIO TODAS LAS GRILLAS
    $grid.pqGrid( "option", "dataModel.data", [] );
    $grid.pqGrid( "refreshView" );

    $grid_secun.pqGrid( "option", "dataModel.data", [] );
    $grid_secun.pqGrid( "refreshView" );
    
    $grid_tar_izq.pqGrid( "option", "dataModel.data", [] );
    $grid_tar_izq.pqGrid( "refreshView" );

    $grid_tar_der.pqGrid( "option", "dataModel.data", [] );
    $grid_tar_der.pqGrid( "refreshView" ); 

    $("#co_leer").show();
    $("#co_cancelar").show();
    $("#direccion").show();
    $("#comuna").hide();
    $("#fila3").show();
    $("#fila4").show();
    $("#fila5").show();
    $("#fila6").show();
    $("#fila7").show();
    $("#new_file").hide();
    
    $("#panel_tarifas").hide();
    $("#grid_secundaria").hide();
    $("#boton_secun").hide();

    $("#tx_tot_aju").val(0);
    $("#tx_nro_doc").val("");
    $("#cb_decrip").val("");
    $("#tx_descripcion").val("");
    $("#tx_cod_cargo").val("");   
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

    //FUNCION QUE ENVIA EL CODIGO DE MOTIVO PARA RETORNAR EL CODIGO EFECTO, SI RETORNA CERO SERA VACIO
    fn_bus_efec($("#tx_empresa").val(),$("#cb_motiv").val());

    if($("#txtCantEfec").val() == 0){
        $("#txtCodigoEfecto").val("");
    }     

    fn_carga_grid_secun(            
        $("#tx_empresa").val(),
        $("#tx_cliente").val(),
        $("#tx_orden").val()
    );

    //$grid_secun.pqGrid( "refreshView" );    
}

//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
function fn_carga_ready()
{
    $("#tx_refe").prop("disabled", true);
    $("#co_obs").prop("disabled", true);

    $("#cb_motiv").prop("disabled",true);
    $("#comuna").hide();
    $("#new_file").hide();
    $("#panel_tarifas").hide();
    $("#grid_secundaria").hide();
    $("#boton_secun").hide();
    $("#dv_descrip").hide();    
    $("button").on("click", function(){return false;});

    $("#co_agregar").html("<span class='glyphicon glyphicon-save'></span> Agregar Fila");
    $("#co_calculo").html("<span class='glyphicon glyphicon-off'></span> Calculo Automatico");    
}
//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
/////////////////////////////////FUNCIONES MODAL///////////////////////////////////////////
function fn_tip_ajust() {

    parameters = 
    {
        "func":"fn_ajuste",
        "empresa":$("#tx_empresa").val()
    };

    HablaServidor(my_url,parameters,'text', function(text) 
    {
        if(text != "")
            $("#cb_tip_ajust").html(text);
            fn_dt_ajus();
    });

    //$("#cb_tip_ajust").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*  
function fn_dt_ajus()
{
    dato_ori = [];
    parameters = 
    {
        "func":"fn_datos_ajus",
        "empresa":$("#tx_empresa").val()
    };
    
    HablaServidor(my_url,parameters,'text', function(text){
        if(text != ""){
            dato_ori = text.split("|");

            $("#tx_afec_fact").val(dato_ori[0]);
            $("#tx_tip_doc").val(dato_ori[1]);
            $("#tx_doc_contr").val(dato_ori[2]);
            $("#tx_ind_saldo").val(dato_ori[3]);
        }
        else{
            fn_mensaje_boostrap(text, g_titulo, $(""));
            return;
        }       
    });
    
}
//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
function fn_motiv() {
    parameters = 
    {
        "func":"fn_motivo",
        "empresa":$("#tx_empresa").val(),
        "tip_ajus":$("#cb_tip_ajust").val(),
        "afect_fac":$("#tx_afec_fact").val()
    };

    HablaServidor(my_url,parameters,'text', function(text) 
    {
        if(text != "")
            $("#cb_motiv").html(text);
    });    
    
    //$("#cb_motiv").html("<option value='' selected></option><option value='1'>10</option> <option value='2' >20</option> <option value='3'>30</option>");
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*  
function fn_bus_efec(empresa, motivo){
    var arr = new Array(empresa, motivo); // generamos un array
    var datos = JSON.stringify(arr); // lo pasamos a formato json    

    dato_ori = [];

    parameters = 
    {
        "func":"fn_bus_efec",
        "datos" : datos
    };
    
    HablaServidor(my_url,parameters,'text', function(text){
        if(text != ""){
            dato_ori = text.split("|");

            $("#txtCantEfec").val(dato_ori[0]);   
            $("#txtCodigoEfecto").val(dato_ori[1]);         
        }
        else{
            fn_mensaje_boostrap(text, g_titulo, $(""));
            return;
        }       
    });
    
}

//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
function fn_origen() {

    parameters = 
    {
        "func":"fn_origen",
        "empresa":$("#tx_empresa").val()
    };

    HablaServidor(my_url,parameters,'text', function(text) 
    {
        if(text != "")
            $("#cb_origen").html(text);       
    });

    //$("#cb_origen").html("<option value='' selected></option><option value='005'>005</option> <option value='010' >010</option> <option value='015'>015</option>");
}

//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
function fn_anular(){
    $("#cb_tip_ajust").val("");
    $("#cb_motiv").val("");
    $("#cb_origen").val("");        
    $("#cb_motiv").prop("disabled",true);
    $("#cb_tip_ajust").focus();
    vCon = 0;
    $("#tx_vda_chk").val("false");

}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*  
function limpia_ajus()
{   
    $("#cb_motiv").val("");
    $("#cb_motiv").prop("disabled",true);
}

/////////////////////////////////FUNCIONES MODAL///////////////////////////////////////////
function fn_descr_cargo(empresa, tip_ajus){
    var arr = new Array(empresa, tip_ajus); // generamos un array
    var datos = JSON.stringify(arr); // lo pasamos a formato json    

    param2 = 
    {
        "func":"fn_descr_cargo",
        "datos" : datos
    };    

    HablaServidor(my_url,param2,'text', function(text) 
    {
        if(text != "")
            $("#cb_decrip").html(text);
    });

    //$("#cb_decrip").html("<option value='' selected></option><option value='1'>MATERIALES AGUA</option> <option value='2' >MANO DE OBRA</option> <option value='3'>DESCUENTO DE EMPLEADO</option> <option value='4'>ALCANTARILLADO</option> <option value='5'>COSTO MEDIDOR</option> <option value='6'>CONVENIO DE PAGO - SEMA</option> <option value='7'>ALCANTARILLADO - VALORIZACIÓN</option>");
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*  
function fn_mensaje(id,mensaje,segundos)
{
    $(id).show();
    $(id).html(mensaje);
    setTimeout(function(){$(id).html("");$(id).hide(); }, segundos);
}