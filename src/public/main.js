var app = {
	communes: [],

	loadCommunes: function() {
		$.ajax({
			url: '/api/communes',
			success: function(res) {
				var communeDropdown = $('#commune');

				app.communes = res.communes;
				$.each(app.communes, function(index, item) {
					communeDropdown.append($('<option />').val(item.id).text(item.name));
				});
			},
			error: function() {
				console.log('No se pueden cargar las comunas');
			}
		});
	},

	loadStores: function(communeId, name) {
		var params = 'communeId='+communeId+'&name='+name;
		var url = '/api/stores?'+params;

		$.ajax({
			url: url,
			success: function(res) {
				app.buildStoreCards(res.stores);
			},
			error: function() {
				console.log('No se pueden cargar las farmacias');
			}
		});
	},

	buildStoreCards: function(stores) {
		var resultsCont = $('#results');

		resultsCont.html('');
		var storesOk = stores.filter(function(item) {
			return ( item.lat !== '' && item.lng !== '');
		});

		$.each(storesOk, function(index, item) {
			var card = ' \
				<div class="col-sm-4 mt-4"> \
				    <div class="store-card shadow-sm"> \
					    <div style="height: 80px; margin-bottom: 5px;"> \
							<b>Nombre:</b> '+ item.store_name +' <br> \
							<b>Dirección:</b> '+ item.address +' <br> \
							<b>Teléfono:</b> '+ item.phone +' \
						</div> \
						<div id="map_'+index+'" style="height: 230px;"> </div> \
					</div> \
				</div> \
            ';
			resultsCont.append(card);
		});

		$.each(storesOk, function(index, item) {
			var lat = parseFloat(item.lat);
			var lng = parseFloat(item.lng);

			if (lat && lng) {
				var map = L.map('map_'+index, {
					center: [item.lat, item.lng],
					zoom: 16
				});

				L.marker([lat, lng]).addTo(map);
				L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
					attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
				}).addTo(map);
			}
		});
	},

	init: function() {
		app.loadCommunes();

		//set handlers
		$('#btnSearch').click(function() {
			var communeId = $('#commune').val();
			var name = $('#name').val();

			$('#results').html('<div class="col-sm-6 mt-4"><img class="alignnone" src="https://cdnjs.cloudflare.com/ajax/libs/galleriffic/2.0.1/css/loader.gif" alt="" width="48" height="48"></div>');
			app.loadStores(communeId, name);
		});
	}
}

$(function() {
	app.init();
});