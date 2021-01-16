// function login_func() {
//     var top_bar_login = document.querySelectorAll('.top_bar_login .sign');
//     top_bar_login.forEach(t => t.style.display = "none")
//     document.querySelector('.top_bar_login .sign-out').style.display = "block";
// }
// function logOut() {
//     var top_bar_login = document.querySelectorAll('.top_bar_login .sign');
//     top_bar_login.forEach(t => t.style.display = "block")
//     document.querySelector('.top_bar_login .sign-out').style.display = "none";
//     document.querySelector('button.close').click();
// }

// async function submitComment(){
//     let PhanHoi = document.querySelector('.comment_input.comment_textarea').value;
//     let User_id = document.querySelector('#Review-User').value;
//     let KhoaHoc = document.querySelector('#Review-KhoaHoc').value;
//     let DiemDanhGia = $("#rateYo").rating();
//     console.log(DiemDanhGia);
//     const NgayPost = new Date();
//     const response = await fetch('/createComment', {
//         method: 'POST',
//         mode: 'cors',
//         headers: {
//             'Content-Type': 'application/json'
//             // 'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         body: JSON.stringify({PhanHoi, NgayPost,User_id, KhoaHoc,DiemDanhGia})
//     })
//     const data = await response.json();
//     alert(data.msg);
//     location.reload();
// }

// async function addToCart(id){
//     const response = await fetch('/addtocart', {
//         method: 'POST',
//         mode: 'cors',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({id})
//     })
//     const data = await response.json();
//     const {status} = response;
    
//     if(status == 401){
//         alert(data.msg);
//         window.location.href = "/login";
//         return;
//     }
//     alert(data.msg);
// }


