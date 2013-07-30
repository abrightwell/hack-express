/*
 *   Copyright 2013 Life Cycle Engineering
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 */

/*
 *Authors:  Adam Brightwell, Robert Dunigan
 */

$(document).ready(function() {
	
	$('.delete-button').on('click', function(event) {
				
		event.preventDefault();
		event.stopPropagation();

		var href = $(this).attr('href');
		var method = $(this).data('method');

		var form = $('<form method="post" action="' + href + '"></form>');
		form.append('<input name="_method" value="' + method + '" type="hidden" />');
		//Firefox fails to submit without appending form to body before submitting...
		$("body").append(form);
		form.submit();
	});
		
	$('a[data-toggle="tab"]:first').tab('show');
	$('#user-tabs a[data-toggle="tab"]:first').tab('show');
});
