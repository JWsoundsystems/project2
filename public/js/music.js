$(document).ready(function () {
    var database = firebase.database();

    // BUTTONS FOR entry-page.html
    $("#button-to-login-page").on("click", function (event) {
        event.preventDefault();
        window.location = 'login-page.html';
    })

    $("#button-to-registration-page").on("click", function (event) {
        event.preventDefault();
        window.location = 'registration.html';
    })
    // END BUTTONS FOR entry-page.html


    // BUTTONS FOR registration.html
    $("#registration-submit").on("click", function (event) {
        event.preventDefault();

        //parses user input from registration page...
        const name = $("#user-name").val().trim();
        const email = $("#user-email").val().trim();
        const password = $("#user-password").val().trim();
        

        // Checks to see if any fields are left empty
        if (name === "" || email === "" || password === "") {
            Swal.fire("We're sorry!", "It looks like some fields have been left empty.  Please enter all fields and try again.", "error");
            return
        }

        // Checks to see if password contains both at least 1 letter and 1 number
        if (/\d/.test(password) === false || /[a-z]/i.test(password) === false) {
            Swal.fire("We're sorry!", "Your password must contain both a letter (a-z) and a number (0-9).  Please try a stronger password.", "warning");
            return
        }

        
        

        
        

        // ...pushes it into firebase.
        database.ref('/users').push({
            name,
            email,
            password,
            
        })

        // Puts logal storage, so can return to page and remain logged in
        localStorage.setItem("name", name);
        localStorage.setItem("email", email);

        console.log("submit local name", localStorage.getItem("name"))
        console.log("submit local email", localStorage.getItem("email"))


        //Shows a success message for 3 seconds, then takes user to main content page
        setTimeout(function() {window.location = 'index'; }, 2000);
        Swal.fire("Good Job!", "Thank you for registering.  One moment while we prepare your homepage...", "success");

    })
    // END BUTTONS FOR registration.html


    //BUTTONS FOR login-page.html
    $("#login-submit").on("click", function (event) {
        event.preventDefault();

        //hides incorrect login warning
        // $("#incorrect-login").css("display", "none");

        //parses the input
        const email = $("#email").val().trim();
        const password = $("#password").val().trim();
console.log(email, password)
        //combs firebase for corresponding email...
        database.ref('/users').orderByChild('email').equalTo(email).on("value", snapshot => {
            snapshot.forEach(function (data) {
                console.log(data)
                // ...if email and password match in firebase...
                if (snapshot.val()[data.key].email === email && snapshot.val()[data.key].password === password) {
                    // ... takes user to their main-content page
                    localStorage.setItem("name", snapshot.val()[data.key].name);
                    localStorage.setItem("email", snapshot.val()[data.key].email);
                    window.location = 'index';
                    return
                }
            });
            // ...if incorrect login, then displays message telling user the input was incorrect
            // $("#incorrect-login").css("display", "block");
            $("#incorrect-login").show(400);
        })
        // Puts corresponding name and email into local storage, so user doesn't have to log in next time
        //TODO: rework this to get from firebase
        

        console.log("submit local name", localStorage.getItem("name"))
        console.log("submit local email", localStorage.getItem("email"))
    })
    //END BUTTONS FOR login-page.html

})