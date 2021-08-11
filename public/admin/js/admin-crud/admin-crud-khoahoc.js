
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
    const td = $(this).closest('tr').find('td');
    const _id = td[0].innerHTML;
    const TenTheLoai = td[1].innerHTML;
    const edit_input_id = $('#edit_input_id');
    const edit_input_ten = $('#edit_input_ten');
    edit_input_id[0].value = _id;
    edit_input_ten[0].value = TenTheLoai;
  });
  
  $(".deleteButton").click(function(){
    //kiem tra o client, va server, sua o client submit nhung khong thao tac
    const td = $(this).closest('tr').find('td');
    const _id = td[0].innerHTML;
    const id_theloai = td[5].innerHTML;
    const delete_input_id = $('#delete_input_id');
    delete_input_id[0].value = _id;
    const delete_input_id_theloai = $('#delete_input_id_theloai');
    delete_input_id_theloai[0].value = id_theloai;
  });

});



