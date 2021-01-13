function  validateAddForm(){
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
            console.log('exist');
              noti.css('visibility','visible');
          }
          else
          {
            console.log('not exist');
              noti.css('visibility','hidden');
              document.forms['addForm'].submit();
          }
      }
  }
}

function  validateAddForm2(){
  const username = $('#username2')[0].value;
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
            console.log('exist');
              noti.css('visibility','visible');
          }
          else
          {
            console.log('not exist');
              noti.css('visibility','hidden');
              document.forms['addForm2'].submit();
          }
      }
  }
}

function getParameterByName(name, url = window.location.href) {
name = name.replace(/[\[\]]/g, '\\$&');
var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
  results = regex.exec(url);
if (!results) return null;
if (!results[2]) return '';
return decodeURIComponent(results[2].replace(/\+/g, ' '));
}