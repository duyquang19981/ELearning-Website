
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
    const _id = td[0].innerHTML;
    const TenTheLoai = td[1].innerHTML;
    const edit_input_id = $('#edit_input_id');
    const edit_input_ten = $('#edit_input_ten');
    edit_input_id[0].value = _id;
    edit_input_ten[0].value = TenTheLoai;
    console.log('edit_input_id :>> ', edit_input_id[0]);
    console.log('edit_input_ten :>> ', edit_input_ten[0]);
  });
  
  $(".deleteButton").click(function(){
    //kiem tra o client, va server, sua o client submit nhung khong thao tac
    console.log('delete');
    const td = $(this).closest('tr').find('td');
    const _id = td[0].innerHTML;
    const SoKhoaHoc = +td[2].innerHTML;
    const delete_input_id = $('#delete_input_id');
    delete_input_id[0].value = _id;
    const noti = $('.noti');
    if(SoKhoaHoc>0){
      noti[0].innerHTML = `There are some available courses. Category can't be deleted!`;
      $('#deleteButton').attr('disabled', 'disabled');
      $('.text-warning').css('display','none');
    }
    else{
      noti[0].innerHTML = `Are you sure you want to delete these Records?`;
      $('.text-warning').css('display','none');
    }
  });

  // fill parent id for add new
  $('.addNewSubCate').click(function(){
    const parent_id = $(this).closest('div').find('.parent_id');
    console.log('parent_id tm :>> ', parent_id[0].innerHTML);
    $('#parent_id_submit')[0].value = parent_id[0].innerHTML;
  });

  $(".editButton2").click(function(){
    console.log('edit2');
    const td = $(this).closest('tr').find('td');
    const _id = td[1].innerHTML;
    const TenTheLoai = td[2].innerHTML;
    const edit_input_id2 = $('#edit_input_id2');
    const edit_input_ten2 = $('#edit_input_ten2');
    edit_input_id2[0].value = _id;
    edit_input_ten2[0].value = TenTheLoai;
  });

  $(".deleteButton2").click(function(){
    //kiem tra o client, va server, sua o client submit nhung khong thao tac
    console.log('delete2');
    const td = $(this).closest('tr').find('td');
    const parent_id = td[0].innerHTML;
    const _id = td[1].innerHTML;
    const SoKhoaHoc = +td[3].innerHTML;
    console.log('parent_id :>> ', parent_id);
    const delete_input_parent_id2 = $('#delete_input_parent_id2');
    delete_input_parent_id2[0].value = parent_id;
    const delete_input_id = $('#delete_input_id2');
    delete_input_id[0].value = _id;
    const noti = $('.noti');
    if(SoKhoaHoc>0){
      noti[0].innerHTML = `There are some available courses. Category can't be deleted!`;
      $('#deleteButton2').attr('disabled', 'disabled');
      $('.text-warning').css('display','none');
    }
    else{
      noti[0].innerHTML = `Are you sure you want to delete these Records?`;
      $('.text-warning').css('display','none');
    }
  });
});



