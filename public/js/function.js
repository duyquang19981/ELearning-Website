function  validateRegister(){
  const username = $('#username')[0].value;
  var xhttp = new XMLHttpRequest();
  
  xhttp.open('GET','/admin/manage-table/GiangVien/checkUsernameExist?username=' + username);
  // xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send();
  let check;
  xhttp.onreadystatechange = function(){
      if(this.readyState == 4 && this.status == 200){
          //alert(this.responseText);
          var resText = this.responseText;
          const isExist = JSON.parse(resText).isExist;
          const noti = $('.username-noti');
          if(isExist){
              noti.css('visibility','visible');
          }
          else
          {
              noti.css('visibility','hidden');
              document.forms['regisForm'].submit();
          }
      }
  }
}