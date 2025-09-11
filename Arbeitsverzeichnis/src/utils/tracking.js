// Minimal Tracking Stub – echte Analytics Hooks können später injiziert werden
const variantKey = 'zoe_ui_variant';

export function getVariant(){
	if(typeof window === 'undefined') return 'minimal';
	return localStorage.getItem(variantKey) || 'minimal';
}

export function toggleVariant(){
	if(typeof window === 'undefined') return 'minimal';
	const current = getVariant();
	const next = current === 'minimal' ? 'experimental' : 'minimal';
	localStorage.setItem(variantKey, next);
	return next;
}

export function trackNav(payload){ debug('nav', payload); }
export function trackFooter(payload){ debug('footer', payload); }
export function trackVisualLayerActive(payload){ debug('visual-layer', payload); }
export function trackVariant(){ debug('variant', { current:getVariant() }); }
export function trackCta(payload){ debug('cta', payload); }
export function trackDesignMigrationComplete(version){ debug('design-migration-complete', { version }); }

export function measureFps(duration=500){
	return new Promise(resolve => {
		if(typeof window === 'undefined') return resolve(60);
		let frames=0; let start;
		function loop(ts){
			if(!start) start=ts;
			frames++;
			if(ts - start < duration) requestAnimationFrame(loop); else {
				const fps = frames / ((ts - start)/1000);
				resolve(fps);
			}
		}
		requestAnimationFrame(loop);
	});
}

function debug(channel, data){
	if(typeof window !== 'undefined' && window?.__DEV_TRACKING__){
		// eslint-disable-next-line no-console
		console.log(`[track:${channel}]`, data);
	}
}
