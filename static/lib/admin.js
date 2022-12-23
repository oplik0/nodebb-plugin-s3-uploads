'use strict';

// eslint-disable-next-line import/prefer-default-export
export function init() {
	$('#aws-region option[value="{region}"]').prop('selected', true);

	$('#s3-upload-bucket').on('submit', function (e) {
		e.preventDefault();
		save('s3settings', this);
	});

	$('#s3-upload-credentials').on('submit', function (e) {
		e.preventDefault();
		var form = this;
		bootbox.confirm('Are you sure you wish to store your credentials for accessing S3 in the database?', function (confirm) {
			if (confirm) {
				save('credentials', form);
			}
		});
	});

	function save(type, form) {
		var data = {
			_csrf: '{csrf}' || $('#csrf_token').val(),
		};

		var values = $(form).serializeArray();
		for (var i = 0, l = values.length; i < l; i++) {
			data[values[i].name] = values[i].value;
		}

		$.post('{forumPath}api/admin/plugins/s3-uploads/' + type, data).done(function (response) {
			if (response) {
				ajaxify.refresh();
				app.alertSuccess(response);
			}
		}).fail(function (jqXHR) {
			ajaxify.refresh();
			app.alertError(jqXHR.responseJSON ? jqXHR.responseJSON.error : 'Error saving!');
		});
	}
}
