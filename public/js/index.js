function getData() {
	//clear the results:
	$("#results").empty();
	$.getJSON('http://localhost:3000/post', function(data) {
		var items = [];

		$.each(data, function(key, val) {
			items.push('<li id="' + key + '">Title: ' + val.title + " , body: " + val.body + " , state: " + val.state + ", on " + val.date + '</li>');
		});

		$('<ul/>', {
			'class' : 'my-new-list',
			html : items.join('')
		}).appendTo('#results');
	});
}

function addData(theTitle, theBody) {
	var post = {
		title : theTitle,
		body : theBody
	}

	$.post('http://localhost:3000/post', post, function(data) {
		getData();
	}, "json");
}


var posts = ko.observableArray();
$(function() {

	ko.applyBindings(posts);
	
	$.getJSON('http://localhost:3000/post', function(data) {
		posts(data);
	});

	//getData();

	$("#addDataBtn").click(function() {
		var title = $("#title").val();
		var body = $("#body").val();
		addData(title, body);
	});
});
