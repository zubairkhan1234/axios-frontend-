


const url = 'http://localhost:5000';




function signup() {
    var userName = document.getElementById('name').value
    var userEmail = document.getElementById('email').value.toLowerCase()
    var userPhone = document.getElementById('phone').value
    var userPassword = document.getElementById('password').value

    // console.log(userEmail)

    axios({
        method: 'post',
        url: 'http://localhost:5000/signup',
        data: {
            userName: userName,
            userEmail: userEmail,
            userPhone: userPhone,
            userPassword: userPassword
        }

    }).then((response) => {
        console.log(response);
        if(response.data.statu === 200){

            alert(response.data.message)
        }else{
            alert(response.data.message)

        }
        window.location.href="login.html"
    }, (err) => {
        console.log(err);
        alert(err)
    });



    // console.log(userData)


    document.getElementById("name").value = ""
    document.getElementById("email").value = ""
    document.getElementById("phone").value = ""
    document.getElementById("password").value = ""

    return false;
}


function login() {
    var loginEmail = document.getElementById('loginEmail').value
    var loginPassword = document.getElementById('loginPassword').value

    // console.log(loginEmail, loginPassword)
    axios({
        method: 'post',
        url: 'http://localhost:5000/login',
        data: {
            email: loginEmail,
            password: loginPassword
        },
        withCredentials: true
    })
        .then(function (response) {
            console.log(response)
            alert(response.data.message)
            window.location.href="home.html"
        }), (err) => {
            console.log(err)
        }
    


    return false;
   

}

function userData(){

    axios({
        method: 'get',
        url: 'http://localhost:5000/profile',
        credentials: 'include'
        
    }).then((response) => {

        document.getElementById('userName').innerText = response.data.profile.name
        document.getElementById('userEmail').innerText = response.data.profile.email
        document.getElementById('userPhone').innerText = response.data.profile.phone
    }, (err) => {
        console.log(err);
        alert(err)
    });
    
}