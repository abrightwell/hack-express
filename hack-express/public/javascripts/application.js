$(document).ready(function() {
	
	$('.delete-button').on('click', function(event) {
				
		event.preventDefault();
		event.stopPropagation();

		var href = $(this).attr('href');
		var method = $(this).data('method');

		var form = $('<form method="post" action="' + href + '"></form>');
		form.append('<input name="_method" value="' + method + '" type="hidden" />');
		$("body").append(form);
		form.submit();
	});
		
	$('a[data-toggle="tab"]:first').tab('show');
	$('#user-tabs a[data-toggle="tab"]:first').tab('show');
});
