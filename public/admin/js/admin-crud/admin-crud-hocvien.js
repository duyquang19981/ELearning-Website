
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
    const Ten = td[1].innerHTML;
    const Mail = td[2].innerHTML;
    const edit_input_id = $('#edit_input_id');
    const edit_input_ten = $('#edit_input_ten');
    const edit_input_mail = $('#edit_input_mail');
    edit_input_id[0].value = _id;
    edit_input_ten[0].value = Ten;
    edit_input_mail[0].value = Mail;
  });
  
  $(".deleteButton").click(function(){
    //kiem tra o client, va server, sua o client submit nhung khong thao tac
    const td = $(this).closest('tr').find('td');
    const _id = td[0].innerHTML;
    const delete_input_id = $('#delete_input_id');
    delete_input_id[0].value = _id;
  });

  // xem danh sach khoa hoc
  $('.detail').click(function(){
    const td = $(this).closest('tr').find('td');
    const _id = td[0].innerHTML;
    var xhttp = new XMLHttpRequest();
      xhttp.open('GET','HocVien/getcoursesofstudent?_id=' + _id);
    // xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhttp.send();
      xhttp.onreadystatechange = function(){
          if(this.readyState == 4 && this.status == 200){
              //alert(this.responseText);
              var resText = this.responseText;
              console.log('resText :>> ', resText);
          }
      }
  });

});

