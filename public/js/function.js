function  validateRegister(){
    console.log('clikcl ick');
    const username = $('#username')[0].value;
    console.log('username :>> ', username);
    var xhttp = new XMLHttpRequest();
    xhttp.open('GET','/admin/manage-table/GiangVien/checkUsernameExist?username=' + username);
    // xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send();
    let check;
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            //alert(this.responseText);
            var resText = this.responseText;
            console.log('resText :>> ', resText);
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


//home page/ add to cart wl

$(document).ready(function(){
    $('.add-cart').on('click', function(){
        console.log('add cart');
        //alert('click add cart')
        const khoahoc_id = $(this).parent('div').find('.id_khoahoc')[0].innerHTML;
        console.log('khoahoc_id :>> ', khoahoc_id);
        console.log('sai roi');
        if(+khoahoc_id==-1){
            console.log('-1');
            //alert('Bạn phải đăng nhập thể thực hiện chức năng này!')
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Bạn cần đăng nhập để thực hiện chức năng này!',
            })
        }
        else{
            console.log('duoc submit');
						
            var xhttp = new XMLHttpRequest();
            xhttp.open('GET','/user/profile/addtocart?khoahoc_id=' + khoahoc_id);
            // xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send();
            xhttp.onreadystatechange = function(){
    
                if(this.readyState == 4 && this.status == 200){
                   //alert(this.responseText);
                    var resText = this.responseText;
                    if(resText =='successed'){
                
                        Swal.fire(
                            'Successfully!',
                            'Thêm vào giỏ hàng thành công!',
                            'success'
                        )
                    }
                    else if(resText =='failed') {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Thao tác thất bại, thử lại sau!',
                        
                        })
                    }
                    else if(resText =='existed') {
                        
                        Swal.fire('Khóa học đã có trong giỏ hàng.')
                    }
                
                    
                }
    
            }
        }


    });

    $('.add-wl').on('click', function(){
        console.log('add wl');
        //alert('click add cart')
        const khoahoc_id = $(this).parent('div').find('.id_khoahoc')[0].innerHTML;
        console.log('khoahoc_id :>> ', khoahoc_id);
        console.log('sai roi');
        if(+khoahoc_id==-1){
            console.log('-1');
            //alert('Bạn phải đăng nhập thể thực hiện chức năng này!')
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Bạn cần đăng nhập để thực hiện chức năng này!',
            })
        }
        else{
            console.log('duoc submit');
						
            var xhttp = new XMLHttpRequest();
            xhttp.open('GET','/user/profile/addtowl?khoahoc_id=' + khoahoc_id);
            // xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send();
            xhttp.onreadystatechange = function(){
    
                if(this.readyState == 4 && this.status == 200){
                   //alert(this.responseText);
                    var resText = this.responseText;
                    if(resText =='successed'){
                
                        Swal.fire(
                            'Successfully!',
                            'Thêm vào  Watchlist thành công!',
                            'success'
                        )
                    }
                    else if(resText =='failed') {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Thao tác thất bại, thử lại sau!',
                        
                        })
                    }
                    else if(resText =='existed') {
                        
                        Swal.fire('Khóa học đã có trong Watchlist.')
                    }
                
                    
                }
    
            }
        }


    });
})
