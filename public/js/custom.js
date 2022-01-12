const { get } = require("express/lib/response");
const res = require("express/lib/response");

// ===cookie function v
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

// ===cookie function ^

function Add(id) {  //thêm sản phẩm vào giỏ hàng
    var listItemInBadge = getCookie('giohang');
    var count = parseInt(document.getElementById("itemInBadge").innerHTML);
    document.getElementById("itemInBadge").innerHTML = ++count;
    alert("Thêm sản phẩm thành công");
    listItemInBadge == '' ? listItemInBadge += id : listItemInBadge += (',' + id);
    setCookie('giohang', listItemInBadge, 1);

}


// đăng nhập- đăng xuất 

function LoginHandler() {
    
    if (getCookie('user') == '') {
        window.location = '/login';
    } else {
        window.location='/profile';
        // setCookie('token','',1);
        // setCookie('user','',1);
        // let params = {
        //     headers: { "content-type": "application/json; charset=UTF-8" },
        //     body: `{"user":"${user}","token":"${token}"}`,
        //     method: "POST",
        //     mode: "cors"
        // };

        // fetch('logout', params).then(function (response) {
        //     if (response.ok) {
        //         document.refresh;
        //     }
        // });
    }

}

function Login() {
    user = document.getElementById("user").value;
    pwd = document.getElementById("pwd").value;
    console.log(user);
    console.log(pwd);
    if (user == '' || pwd == '') {
        alert('Please enter a username and password');
    } else {
        let params = {
            headers: { "content-type": "application/json; charset=UTF-8" },
            body: `{"user":"${user}","pwd":"${pwd}"}`,
            method: "POST",
            mode: "cors"
        }
        fetch('/login', params).then(function (response) {
            console.log(response.ok);
            return response.json();
        }).then(data => {
            if (data.stt == 1) {
                setCookie('user',user,365);
                setCookie('token', data.token);
                window.location = '/';
            } else {
                alert('Sai tài khoản hoặc mật khẩu');
            }
        });
    }
}

function Logout(){
    setCookie('user','',1);
    setCookie('token','',1);
}