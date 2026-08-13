const SHELL_CACHE = 'navigation-shell-v30';
const MEDIA_CACHE = 'navigation-ticket-media-v1';
const APP_SHELL = [
	'/',
	'/manifest.webmanifest',
	'/favicon.ico',
	'/favicon.svg',
	'/icon-192.png',
	'/icon-512.png',
	'/apple-touch-icon.png',
	'/icons/bahnbonus.png',
	'/icons/bahncard.svg',
	'/icons/benefits.svg',
	'/icons/bike.png',
	'/icons/booking.svg',
	'/icons/construction.svg',
	'/icons/db-logo.svg',
	'/icons/deutschland-tarif.png',
	'/icons/fastest-connections.png',
	'/icons/journey-bell.svg',
	'/icons/journey-calendar.svg',
	'/icons/journey-map.svg',
	'/icons/journey-qr.svg',
	'/icons/journey-ticket-info.svg',
	'/icons/journey-time.svg',
	'/icons/journeys-plus.svg',
	'/icons/journeys.svg',
	'/icons/login-security.svg',
	'/icons/manage-settings.svg',
	'/icons/manage-subscriptions.svg',
	'/icons/map-bg.png',
	'/icons/nearby.svg',
	'/icons/no-trips.png',
	'/icons/payment.svg',
	'/icons/personal.svg',
	'/icons/profile.svg',
	'/icons/public-transport.png',
	'/icons/route-swap.svg',
	'/icons/scooter.png',
	'/icons/security-cross.svg',
	'/icons/security-date-line.png',
	'/icons/security-waves.svg',
	'/icons/swap.svg',
	'/icons/transport-options.svg',
	'/apple-startup/launch-1290x2796.png',
	'/apple-startup/launch-1284x2778.png',
	'/apple-startup/launch-1179x2556.png',
	'/apple-startup/launch-1170x2532.png',
	'/apple-startup/launch-1125x2436.png',
	'/apple-startup/launch-828x1792.png',
	'/apple-startup/launch-750x1334.png',
];

self.addEventListener('install', (event) => {
	event.waitUntil(
		(async () => {
			const cache = await caches.open(SHELL_CACHE);
			await cache.addAll(APP_SHELL);
			const home = await fetch('/', { cache: 'reload' });
			const html = await home.clone().text();
			await cache.put('/', home);
			const builtAssets = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
				.map((match) => new URL(match[1], self.location.origin))
				.filter((url) => url.origin === self.location.origin)
				.map((url) => url.pathname);
			await cache.addAll([...new Set(builtAssets)]);
		})(),
	);
	self.skipWaiting();
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		(async () => {
			const keys = await caches.keys();
			await Promise.all(
				keys
					.filter((key) => key.startsWith('navigation-shell-') && key !== SHELL_CACHE)
					.map((key) => caches.delete(key)),
			);
			await self.clients.claim();
		})(),
	);
});

self.addEventListener('fetch', (event) => {
	if (event.request.method !== 'GET') return;

	const url = new URL(event.request.url);
	const isLocal = url.origin === self.location.origin;
	const isImage = event.request.destination === 'image';
	if (!isLocal && !isImage) return;

	event.respondWith(
		(async () => {
			const cached = await caches.match(event.request);
			if (cached) return cached;

			try {
				const response = await fetch(event.request);
				if (response.ok || response.type === 'opaque') {
					const cacheName = isLocal ? SHELL_CACHE : MEDIA_CACHE;
					const cache = await caches.open(cacheName);
					await cache.put(event.request, response.clone());
				}
				return response;
			} catch (error) {
				if (event.request.mode === 'navigate') {
					const shell = await caches.match('/');
					if (shell) return shell;
				}
				throw error;
			}
		})(),
	);
});
