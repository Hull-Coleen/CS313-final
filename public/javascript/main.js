//var dateFormat = require('dateformat');
function signin() {
	console.log("inside signin");
	document.querySelector('#name').style.visibility = "visible";
	document.querySelector('#pass').style.visibility = "visible";
	document.querySelector('input[name="signin"]').style.visibility = "visible";
}

function createAccount() {
	document.querySelector('#name').style.visibility = "visible";
	document.querySelector('#pass').style.visibility = "visible";
	document.querySelector('#password').style.visibility = "visible";
	document.querySelector('#username').style.visibility = "visible";
	document.querySelector('input[name="create"]').style.visibility = "visible";
}
function getDate () {
	var d = new Date();
	var formDate = (d.getMonth()+1) + '/' + d.getDate() + '/' + d.getFullYear();
	console.log(formDate);
	return formDate;

	 //return new Date().toDateString();
}

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
function weight(e) {
	console.log("getweight function");
    $.get("/getWeight", function(result) {
		if (result && result.success) {
            $("#status").text("Weight");
            const output = document.querySelector('#title')
           // console.log("getweight funct" + JSON.stringify(result))
            weightList(result.weight);
            output.innerText = "Weight Results";
		} else {
			$("#status").text("");
		}
	}).fail(function(result) {
		$("#status").text("Could not get Data. You need to be logged in.");
	});
}
function weightList(data){
    var objs = data.map(item => {
		var d = new Date(item.day_of_input);
		var formDate = (d.getMonth()+1) + '/' + d.getDate() + '/' + d.getFullYear();
		console.log("date" + formDate);
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

}
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

function insert(e) {
    console.log("insert function");
    var exercise = $("#exercise").val();
	var time = $("#time").val();
    var pulse = $("#pulse").val();
	var weight = $("#weight").val();
	//var date = $("#date").val();
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
			console.log("help " + result.name)
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
			$("#status").text("Error logging in.");
		}
	});

}
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


