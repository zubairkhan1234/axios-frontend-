


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
        alert(response.data.message)
        windowlocation.href = "index.html"
    }, (error) => {
        console.log(error);
        alert(error)
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
        },credential: inclued
    })
        .then(function (response) {
            console.log(response)
            alert(response.data.message)
            window.location.href="home.html"
        }), (error) => {
            console.log(error)
        }
    


    return false;
   

}

function userData(){

    axios({
        method: 'get',
        url: 'http://localhost:5000/profile',
        
        
    }).then((response) => {
        console.log(response);
        document.getElementById('userName').innerHTML = response.data.name
        document.getElementById('userEmail').innerHTML = response.data.email
        document.getElementById('userPhone').innerHTML = response.data.phone
        

    }, (error) => {
        console.log(error);
        alert(error)
    });
    
}