/*******************************************************************************
 * Signin
 * -----------------------------------------------------------------------------
 * makes the fields needed to signin visible
 ******************************************************************************/
function signin() {
	console.log("inside signin");
	document.querySelector('#name').style.visibility = "visible";
	document.querySelector('#pass').style.visibility = "visible";
	document.querySelector('input[name="signin"]').style.visibility = "visible";
}

/*******************************************************************************
 * CreateAccount
 * -----------------------------------------------------------------------------
 * makes the fields needed to create an account visible
 ******************************************************************************/
function createAccount() {
	document.querySelector('#name').style.visibility = "visible";
	document.querySelector('#pass').style.visibility = "visible";
	document.querySelector('#password').style.visibility = "visible";
	document.querySelector('#username').style.visibility = "visible";
	document.querySelector('input[name="create"]').style.visibility = "visible";
}

/*******************************************************************************
 * GETDATE
 * -----------------------------------------------------------------------------
 * get the date from the web and return a fromatted date String
 ******************************************************************************/
function getDate () {
	var d = new Date();
	var formDate = (d.getMonth()+1) + '/' + d.getDate() + '/' + d.getFullYear();
	console.log(formDate);
	return formDate;
}

/*******************************************************************************
 * Login
 * -----------------------------------------------------------------------------
 * Params: name, pass
 * Success: 200 {  true,  id }
 * Failure: 401 {  false }
 ******************************************************************************/
function login() {
    console.log("login");
	var username = $("#name").val();
	var password = $("#pass").val();

	var params = {
		username: username,
		password: password
	};
    console.log(params);
	$.post("/signin", params, function(result) {
		if (result && result.success) {
			console.log("help " + result.name)
			document.querySelector('#greeting').innerText = "Welcome Back " + result.name;
			document.querySelector('#name').style.visibility = "hidden";
	        document.querySelector('#pass').style.visibility = "hidden";
	        document.querySelector('input[name="signin"]').style.visibility = "hidden";
			$("#status").text("Successfully logged in.");
		} else {
			$("#status").text("Error logging in.");
		}
	});
}

/*******************************************************************************
 * GetPulse
 * -----------------------------------------------------------------------------
 * Success: 201 { success: 'pulse data'}
 * Failure: 400 { success: false }
 *          
 ******************************************************************************/

function getPulse() {
	$.get("/getPulse", function(result) {
		if (result && result.success) {
            $("#status").text("Pulse");
            const output = document.querySelector('#title')
            console.log("getpulse funct" + result.pulse)
            pulseList(result.pulse);
            output.innerText = "Pulse Results";
		} else {
			$("#status").text("");
		}
	}).fail(function(result) {
		$("#status").text("Could not get Data. You need to be logged in.");
	});
}

/*******************************************************************************
 * Exercise
 * -----------------------------------------------------------------------------
 * Success: 201 { success: 'exercise data'}
 * Failure: 400 { success: false }
 *          
 ******************************************************************************/
function exercise(e) {
	console.log("getexercise function");
    $.get("/getExercise", function(result) {
		if (result && result.success) {
            $("#status").text("Exercise");
            const output = document.querySelector('#title')
            console.log("getexercise funct" + JSON.stringify(result))
            exerciseList(result.health);
            output.innerText = "Exercise Results";
		} else {
			$("#status").text("");
		}
	}).fail(function(result) {
		$("#status").text("Could not get Data. You need to be logged in.");
	});

}

/*******************************************************************************
 * Weight
 * -----------------------------------------------------------------------------
 * Success: 201 { success: 'weight data'}
 * Failure: 400 { success: false }
 *          
 ******************************************************************************/
function weight(e) {
	
    $.get("/getWeight", function(result) {
		if (result && result.success) {
            $("#status").text("Weight");
            const output = document.querySelector('#title')
            weightList(result.weight);
            output.innerText = "Weight Results";
		} else {
			$("#status").text("");
		}
	}).fail(function(result) {
		$("#status").text("Could not get Data. You need to be logged in.");
	});
}

/*******************************************************************************
 * WeightList
 * -----------------------------------------------------------------------------
 * Params: array
 * Creates an unsorted list of the objects in array       
 ******************************************************************************/
function weightList(data){
    var objs = data.map(item => {
	   var d = new Date(item.day_of_input);
	   var formDate = (d.getMonth()+1) + '/' + d.getDate() + '/' + d.getFullYear();
	
        return item.weight + " --- " +  formDate;
    })
    console.log(objs);
    var div = document.querySelector('#health');
	div.innerHTML = '';
    objs.forEach(obj => {
		var li = document.createElement("li");
		li.appendChild(document.createTextNode(obj));
        div.appendChild(li);
    });

}/*******************************************************************************
 * ExerciseList
 * -----------------------------------------------------------------------------
 * Params: array
 * Creates an unsorted list of the objects in array       
 ******************************************************************************/
function exerciseList(data){
    var objs = data.map(item => {
		var d = new Date(item.day_of_input);
		var formDate = (d.getMonth()+1) + '/' + d.getDate() + '/' + d.getFullYear();
        return item.exercise + " ---  " + item.exercise_time +" --- " + formDate;
    })
    console.log(objs);
    var div = document.querySelector('#health');
	div.innerHTML = '';
    objs.forEach(obj => {
		var li = document.createElement("li");
		li.appendChild(document.createTextNode(obj));
        div.appendChild(li);
    });

}

/*******************************************************************************
 * PulseList
 * -----------------------------------------------------------------------------
 * Params: array
 * Creates an unsorted list of the objects in array       
 ******************************************************************************/
function pulseList(data){
    var objs = data.map(item => {
		var d = new Date(item.day_of_input);
		var formDate = (d.getMonth()+1) + '/' + d.getDate() + '/' + d.getFullYear();
        return item.pulse + " --- " + formDate;
    })
    console.log(objs);
    var div = document.querySelector('#health');
	div.innerHTML = '';
    objs.forEach(obj => {
		var li = document.createElement("li");
		li.appendChild(document.createTextNode(obj));
        div.appendChild(li);
    });

}

/*******************************************************************************
 * Insert
 * -----------------------------------------------------------------------------
 * Params: exercise, time, pulse, weight
 * Success: 201 { success: 'data inserted'}
 * Failure: 400 { success: false }     
 ******************************************************************************/
function insert(e) {
    console.log("insert function");
    var exercise = $("#exercise").val();
	var time = $("#time").val();
    var pulse = $("#pulse").val();
	var weight = $("#weight").val();
	var date = getDate();
	
	var params = {
        exercise: exercise,
        time: time,
        pulse: pulse,
        weight: weight,
        date: date
	};
    $.get("/insert", params, function(result) {
		if (result && result.success) {
            $("#status").text("Data inserted");
            
		} else {
			$("#status").text("");
		}
	}).fail(function(result) {
		$("#status").text("Could not insert Data. Are you logged in?");
	});
}
 
/*******************************************************************************
 * Logout
 * -----------------------------------------------------------------------------
 * Deletes table and session id
 * Success: 201 { success: 'logged out'}
 * Failure: 400 { success: false }     
 ******************************************************************************/
function logout() {
	$.post("/logout", function(result) {
		if (result && result.success) {
			var list = document.querySelector('#health');
			document.querySelector('#title').innerText = "";
			while (list.hasChildNodes()) {
				list.removeChild(list.firstChild);
			}
			document.querySelector('#greeting').innerText = "Good Bye"; 
			$("#status").text("Successfully logged out.");
		} else {
			$("#status").text("Error logging out.");
		}
	});
}

/*******************************************************************************
 * Create
 * -----------------------------------------------------------------------------
 * Params: username, name, pass
 * Success: 201 { success: 'logged in'}
 * Failure: 400 { success: 'Could not create account' }     
 ******************************************************************************/
function create(e) {
    
    var username = $("#username").val();
    var password = $("#pass").val();
    var name =$("#name").val();

	var params = {
		username: username,
        password: password,
        name: name
	};
    //
	$.post("/createUser", params, function(result) {
		if (result && result.success) {
			
			$("#status").text("Successfully logged in.");
			document.querySelector('#greeting').innerText = "Welcome " + name;
			document.querySelector('#name').style.visibility = "hidden";
			document.querySelector('#pass').style.visibility = "hidden";
			document.querySelector('#password').style.visibility = "hidden";
			document.querySelector('#username').style.visibility = "hidden";
			document.querySelector('#messagePass').style.visibility = "hidden";
			document.querySelector('#messagePass1').style.visibility = "hidden";
	        document.querySelector('input[name="create"]').style.visibility = "hidden";
		} else {
			$("#status").text("Problem Creating Account");
		}
	}).fail(function(result) {
		$("#status").text("Could not create account. Username must be unique?");
	});


}

/*******************************************************************************
 * CheckPassword
 * -----------------------------------------------------------------------------
 * Check the pass input to make sure the password has 7 character
 * and at least one number   
 ******************************************************************************/
function checkPassword() {
	var regex = /^(?=\D*\d)\S{7,}$/;
	if (document.querySelector('input[name="create"]').style.visibility === 'visible') {

	   if( regex.test(document.getElementById('pass').value) ) {
			 document.getElementById('passWarning').innerHTML = '';
			 document.querySelector('input[name="create"]').disabled = false;
	   } else {
			 document.getElementById('passWarning').innerHTML = 'Password must have at least one number and 7 characters';
			 document.querySelector('input[name="create"]').disabled = true;
	   }
    }
}

/*******************************************************************************
 * Check
 * -----------------------------------------------------------------------------
 * Checks pass and password to make sure the are the same. Tells 
 * wether the passwords match or not    
 ******************************************************************************/
function check() {      

   if (document.querySelector('input[name="create"]').style.visibility === 'visible') {
	//
	   if (document.getElementById('password').value ==
	       document.getElementById('pass').value) {
	          document.getElementById('messagePass').style.color = '#000080';
	          document.getElementById('messagePass').innerHTML = 'matching';
	          document.getElementById('messagePass1').style.color = '#000080';
	          document.getElementById('messagePass1').innerHTML = 'matching';
	    } else {
	       document.getElementById('messagePass').style.color = 'red';
	       document.getElementById('messagePass').innerHTML = 'not matching';
	       document.getElementById('messagePass1').style.color = 'red';
	       document.getElementById('messagePass1').innerHTML = 'not matching';

	    }
	}
}


