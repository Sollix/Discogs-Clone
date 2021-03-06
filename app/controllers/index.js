import Ember from 'ember';

export default Ember.Controller.extend({
	ajax: Ember.inject.service(),
	actions: {

		createNewRelease() {
			$('#addNew').removeClass('hidden')
		},

		cancelCreate() {
			$('#addNew').addClass('hidden')
			$('textarea').val('')
		},

		submitRelease() {
			var artistText = this.get('artistText')
			var titleText = this.get('titleText')
			var labelText = this.get('labelText')
			var year = this.get('year')
			var formatText = this.get('formatText')
			var notes = this.get('notesText')
			var thumbURL = this.get('thumbURL')

			var addRecord = this.store.createRecord('release', {
				artist: artistText,
				title: titleText,
				label: labelText,
				year: year,
				format: formatText,
				thumb: thumbURL
			})

			addRecord.save()

			$('textarea').val('')

			$('#addNew').addClass('hidden')
		},

		deleteRelease(release) {
			alert("This will delete this release, are you sure?")
			release.destroyRecord()
		},

		updateThumb(release) {
			var newURL = prompt("Please input the URL of the album cover")
			if (newURL === null || newURL === '') {
				return;
			} else {
				release.set('thumb', newURL)
				release.save()
			}
		},

		importCollection() {
			var username = prompt("What is your Discogs username?")
      		this.get('ajax').request('https://api.discogs.com/users/' + username + '/collection/folders/0/releases?page=1&per_page=20').then((response) => { //arrow functions allow for "this not to change within a function"
      			for (var i = 0; i < response.releases.length - 1; i++) {
      				var addRecord = this.store.createRecord('release', {
      					artist: response.releases[i].basic_information.artists[0].name,
      					title: response.releases[i].basic_information.title,
      					label: response.releases[i].basic_information.labels[0].name,
      					year: response.releases[i].basic_information.year,
      					format: response.releases[i].basic_information.formats[0].name,
						thumb: 'https://pixabay.com/static/uploads/photo/2013/07/13/12/07/record-159211_960_720.png' //discogs depricated allowing images, especially en masse
					})
      				addRecord.save()
      			}
      		})
      	}
      }
  });
