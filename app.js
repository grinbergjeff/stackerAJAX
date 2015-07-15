$(document).ready( function() {
	$('.unanswered-getter').submit( function(event){
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		var tags = $(this).find("input[name='tags']").val();
		getUnanswered(tags);
	});
	//Run GetInspired here:
	$('.inspiration-getter').submit( function(event){
		console.log('running inspiration getter');
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		var answerers = $(this).find("input[name='answerers']").val();
		getUnanswered(answerers);
	});
});

// this function takes the question object returned by StackOverflow 
// and creates new result to be appended to DOM
var showQuestion = function(question) {
	
	// clone our result template code
	var result = $('.templates .question').clone();
	
	// Set the question properties in result
	var questionElem = result.find('.question-text a');
	questionElem.attr('href', question.link);
	questionElem.text(question.title);

	// set the date asked property in result
	var asked = result.find('.asked-date');
	var date = new Date(1000*question.creation_date);
	asked.text(date.toString());

	// set the #views for question property in result
	var viewed = result.find('.viewed');
	viewed.text(question.view_count);

	// set some properties related to asker
	var asker = result.find('.asker');
	asker.html('<p>Name: <a target="_blank" href=http://stackoverflow.com/users/' + question.owner.user_id + ' >' +
													question.owner.display_name +
												'</a>' +
							'</p>' +
 							'<p>Reputation: ' + question.owner.reputation + '</p>'
	);

	return result;
};
//Function to show user information
var showUser = function(parameter) {
	//Code based loosely off of showQuestion
	//clone template code
	var result = $('.templates .user').clone();
	
	//----What do I want to show??????---------
	
	//find profile photo
	var answererimage = results.find('.prof_img');
	console.log('displaying userimage');
	answererimage.html('<img src="' + parameter.user.profile_image + '">'); 
	//show name as a link
	var nameElem = result.find('.display-name');
	nameElem.html('<a href="' + parameter.user.link + '" target="_blank">' + parameter.user.display_name + '</a>'); 
	//show rep pts
	result.find('.reputation').text(parameter.user.reputation);
	result.find('.score').text(parameter.score);
	return results;
	
}

// this function takes the results object from StackOverflow
// and creates info about search results to be appended to DOM
var showSearchResults = function(query, resultNum) {
	var results = resultNum + ' results for <strong>' + query;
	return results;
};

// takes error string and turns it into displayable DOM element
var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};

// takes a string of semi-colon separated tags to be searched
// for on StackOverflow
var getUnanswered = function(tags) {
	
	// the parameters we need to pass in our request to StackOverflow's API
	var request = {tagged: tags,
								site: 'stackoverflow',
								order: 'desc',
								sort: 'creation'};
	
	var result = $.ajax({
		url: "http://api.stackexchange.com/2.2/questions/unanswered",
		data: request,
		dataType: "jsonp",
		type: "GET",
		})
	.done(function(result){
		var searchResults = showSearchResults(request.tagged, result.items.length);

		$('.search-results').html(searchResults);

		$.each(result.items, function(i, item) {
			var question = showQuestion(item);
			$('.results').append(question);
		});
	})
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};
//Starting Get Inspired Challenge
//Code loosely based off getUnanswered code
//Implementation of StackOverflow's second function
var getInspired = function(tags) {
	
	var request = {tagged: answerers,
				   				site: 'stackoverflow',
				   				
				  };
	var result =$.ajax({
		url: 'http://api.stackexchange.com/2.2/tags' + request.tagged + '/top-answerers/',
		data: request,
		dataType: 'jsonp',
		type: 'GET',
	})
	//done setup
	.done(function(result){
		console.log('Request was successful');
		var searchResult = showSearchResults(request.tagged, result.items.length);
		
		$('.search-results').html(searchResults);

		$.each(result.items, function(i, item) {
			//display the top users
			var topusers = showUser(item);
			$('.results').append(topusers);
		});
	})
	//fail setup
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};


