
$(document).ready(function(){

	// Activate tooltip
	$('[data-toggle="tooltip"]').tooltip();
	
	// Select/Deselect checkboxes
	var checkbox = $('table tbody input[type="checkbox"]');
	$("#selectAll").click(function(){
		if(this.checked){
			checkbox.each(function(){
				this.checked = true;                        
			});
		} else{
			checkbox.each(function(){
				this.checked = false;                        
			});
		} 
	});
	checkbox.click(function(){
		if(!this.checked){
			$("#selectAll").prop("checked", false);
		}
  });

  $(".editButton").click(function(){
    console.log('edit');
    const td = $(this).closest('tr').find('td');
    console.log('td[0] :>> ', td[0]);
    const _id = td[0].innerHTML;
    const TenTheLoai = td[1].innerHTML;
    const edit_input_id = $('#edit_input_id');
    const edit_input_ten = $('#edit_input_ten');
    edit_input_id[0].value = _id;
    edit_input_ten[0].value = TenTheLoai;
    console.log('edit_input_id :>> ', edit_input_id[0]);
    console.log('edit_input_ten :>> ', edit_input_ten[0]);
    console.log('_id :>> ', _id);
  });
  
  $(".deleteButton").click(function(){
    //kiem tra o client, va server, sua o client submit nhung khong thao tac
    console.log('delete');
    const td = $(this).closest('tr').find('td');
    const _id = td[0].innerHTML;
    const delete_input_id = $('#delete_input_id');
    delete_input_id[0].value = _id;
  });

});



