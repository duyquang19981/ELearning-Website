
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
    console.log('edit giang vien');
    const td = $(this).closest('tr').find('td');
    console.log('td[0] :>> ', td[0]);
    const _id = td[0].innerHTML;
    const Ten = td[1].innerHTML;
    const Mail = td[2].innerHTML;
    const edit_input_id = $('#edit_input_id');
    const edit_input_ten = $('#edit_input_ten');
    const edit_input_mail = $('#edit_input_mail');
    edit_input_id[0].value = _id;
    edit_input_ten[0].value = Ten;
    edit_input_mail[0].value = Mail;
    console.log('edit_input_id :>> ', edit_input_id[0]);
    console.log('edit_input_ten :>> ', edit_input_ten[0]);
    console.log('edit_input_mail :>> ', edit_input_mail[0]);
    
    console.log('_id :>> ', _id);
  });
  
  $(".deleteButton").click(function(){
    //kiem tra o client, va server, sua o client submit nhung khong thao tac
    console.log('delete giang vien');
    
    const td = $(this).closest('tr').find('td');
    const _id = td[0].innerHTML;
    const delete_input_id = $('#delete_input_id');
    delete_input_id[0].value = _id;
    let SoKhoaHoc = -1;
    var xhttp = new XMLHttpRequest();
    xhttp.open('GET','GiangVien/getnumberofcourse?_id=' + _id);
  // xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send();
    xhttp.onreadystatechange = async function(){
        if(this.readyState == 4 && this.status == 200){
            //alert(this.responseText);
            var resText = this.responseText;
            SoKhoaHoc =  JSON.parse(resText).numberofcourse;
            console.log('SoKhoaHoc :>> ', SoKhoaHoc);
            const noti = $('.noti');
            if(SoKhoaHoc>0){
              noti[0].innerHTML = `This GiangVien has some available courses. GiangVien can't be deleted!`;
              $('#deleteButton').attr('disabled', 'disabled');
              $('.text-warning').css('display','none');
            }
            else if(SoKhoaHoc==-1){
              noti[0].innerHTML = `Can't get data from server. Try again!`;
              $('#deleteButton').attr('disabled', 'disabled');
              $('.text-warning').css('display','none');
            }
            else{
              noti[0].innerHTML = `Are you sure you want to delete these Records?`;
              
            }
        }
    }
    
  });

  // xem danh sach khoa hoc
  $('.detail').click(function(){
    console.log('xem chi tiet khoa hoc');
    const td = $(this).closest('tr').find('td');
    const _id = td[1].innerHTML;
    var xhttp = new XMLHttpRequest();
      xhttp.open('GET','TheLoai/getcoursesincate?_id=' + _id);
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



