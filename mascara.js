//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
 $(document).ready(function() {

    $("#test1").inputmask({mask:"99999999[-99]", "placeholder": "00000000", greedy:false});  
    $("#test2").text("asb@gmail.com");
    $("#test2").inputmask({mask:"*{1,20}[.*{1,20}][.*{1,20}][.*{1,20}]@*{1,20}.*{2,6}[.*{1,2}]",greedy:false});
    $("#tx_label").inputmask("00-00-0000");
	$("#test4").inputmask({
		mask: "*{1,20}[.*{1,20}][.*{1,20}][.*{1,20}]@*{1,20}[.*{2,6}][.*{1,2}]",
		greedy: false,
		onBeforePaste: function (pastedValue, opts) {
		  pastedValue = pastedValue.toLowerCase();
		  return pastedValue.replace("mailto:", "");
		},
		definitions: {
		  '*': {
			validator: "[0-9A-Za-z!#$%&'*+/=?^_`{|}~\-]",
			casing: "lower"
		  }
		}
	});
     
    //$("#tx_porcentaje").inputmask({mask:"9{1,3}%"});
     
    //$("#tx_porcentaje").inputmask("Regex", { regex: "^[1-9][0-9]?$|^100$"});
      //$("#tx_porcentaje").inputmask('Regex', { regex: "^[1-9][0-9]?$|^100$", greedy:true});
     
    //$("#tx_porcentaje").inputmask('integer',{min:0, max:100}); 
    
   
    $("#tx_porcentaje").inputmask({mask:"9[*{1,2}][.*{1,2}]%",greedy:false});
    //$("#tx_porcentaje").inputmask({mask:"(100?|9[*{1}][.*{1,2}])", greedy:false}); 
    //$("#tx_porcentaje").inputmask("remove");
     
    $("#tx_porcentaje").blur(function(){
        if(parseFloat($("#tx_porcentaje").val()) > 100)
        {
            alert("Porcentaje no puede ser mayor a 100%");
            $("#tx_porcentaje").val("100");
            $("#tx_porcentaje").focus();
        }
    }); 
     
     $("#co_radio").click(function (evt,ui) {
		var check_value = $('.rd_entrega:checked').val();
         alert($('.rd_entrega:checked').val()); 
    });	
    
     
     /*$("tx_porcentaje").inputmask ( "iiii", { 
        definiciones: { 
        'i': { 
        validador: "[0-255]", 
        cardinalidad: 3, 
        prevalidator: [ 
        {validador: "[0-2]", cardinalidad: 1}, 
        {validator: "[0-25]", cardinalidad: 2}, 
        ] 
        } 
        }});*/
     
    $("#co_leer").click(function (evt,ui) {
		alert("Valor sin mascara: "+$("#test1").inputmask("unmaskedvalue") + " - Valor con mascara: "+$("#test1").val());
         if ($("#test2").inputmask("isComplete"))
            alert("mascara correo completa");
         else 
             alert("mascara correo incompleta");
    });	
    $("#co_leer2").click(function (evt,ui) {
		$("#test2").val("abc@gmail.com");
    });	
	
	
 });