// Testing Service Workers

self.addEventListner('install', function (event) {
	// body...
	console.log('Service Worker Installing')
});

self.addEventListner('actiavte', function (event) {
	// body...
	console.log('Service Worker Activating')
});