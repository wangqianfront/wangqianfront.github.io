var MonsterWorld = new function() {
	
	var isMobile = (navigator.userAgent.toLowerCase().indexOf('android') != -1) || (navigator.userAgent.toLowerCase().indexOf('iphone') != -1);
	
	var worldRect = { x: 0, y: 0, width: window.innerWidth, height: window.innerHeight };
	var dirtyRegion = new Region();
	
	var canvas;
	var context;
	
	var monsters = [];
	var nutritiens = [];
	
	var mouseX = worldRect.width*0.5;
	var mouseY = worldRect.height*0.5;
	var mouseIsDown = false;
	
	this.init = function() {
		
		canvas = document.getElementById( 'world' );
		
		if (canvas && canvas.getContext) {
			
			context = canvas.getContext('2d');
			
			// Mouse events
			document.addEventListener('mousemove', documentMouseMoveHandler, false);
			document.addEventListener('mousedown', documentMouseDownHandler, false);
			document.addEventListener('mouseup', documentMouseUpHandler, false);
			canvas.addEventListener('dblclick', documentDoubleClickHandler, false);
			
			// Touch events
			canvas.addEventListener('touchstart', documentTouchStartHandler, false);
			canvas.addEventListener('touchmove', documentTouchMoveHandler, false);
			canvas.addEventListener('touchend', documentTouchEndHandler, false);
			
			// Other events
			window.addEventListener('resize', windowResizeHandler, false);
			
			createMonster( window.innerWidth * 0.5, window.innerHeight * 0.5 );
			
			// Force a window resize to position all elements
			windowResizeHandler();
			
			setInterval( loop, 1000 / 60 );
		}
	};

	function documentMouseMoveHandler(event) {
		updateMousePosition( event );
	}
	
	function documentMouseDownHandler(event) {
		event.preventDefault();
		
		mouseIsDown = true;
		updateMousePosition( event );
		
		startDragging();
	}
	
	function documentDoubleClickHandler(event) {
		event.preventDefault();
		
		mouseIsDown = true;
		updateMousePosition( event );
	}
	
	function documentMouseUpHandler(event) {
		mouseIsDown = false;
		
		stopDragging();
	}
	
	function documentTouchStartHandler(event) {
		if(event.touches.length == 1) {
			event.preventDefault();
			
			mouseIsDown = true;
			
			mouseX = event.touches[0].pageX - (window.innerWidth - worldRect.width) * .5;
			mouseY = event.touches[0].pageY - (window.innerHeight - worldRect.height) * .5;
			
			startDragging();
		}
	}
	
	function documentTouchMoveHandler(event) {
		if(event.touches.length == 1) {
			event.preventDefault();

			mouseX = event.touches[0].pageX - (window.innerWidth - worldRect.width) * .5;
			mouseY = event.touches[0].pageY - (window.innerHeight - worldRect.height) * .5;
		}
	}
	
	function documentTouchEndHandler(event) {
		mouseIsDown = false;
		
		stopDragging();
	}
	
	function windowResizeHandler() {
		worldRect.width = window.innerWidth;
		worldRect.height = window.innerHeight;
		
		canvas.width = worldRect.width;
		canvas.height = worldRect.height;
		
		canvas.style.position = 'absolute';
		canvas.style.left = (window.innerWidth - canvas.width) * .5 + 'px';
		canvas.style.top = (window.innerHeight - canvas.height) * .5 + 'px';
	}
	
	// Convenience method called from many mouse event handles to update the current mouse position
	function updateMousePosition(event) {
		mouseX = event.clientX - (window.innerWidth - worldRect.width) * .5;
		mouseY = event.clientY - (window.innerHeight - worldRect.height) * .5;
	}
	
	function startDragging() {
		var closestDistance = 9999;
		var currentDistance = 9999;
		var closestIndex = -1;
		
		for( var i = 0, len = monsters.length; i < len; i++ ) {
			var monster = monsters[i];
			
			currentDistance = monster.distanceTo( { x: mouseX, y: mouseY } );
			
			if( currentDistance < closestDistance ) {
				closestDistance = currentDistance;
				closestIndex = i;
			}
		}
		
		if( monsters[closestIndex] ) {
			monsters[closestIndex].dragging = true;
		}
	}
	
	function stopDragging() {
		for (var i = 0, len = monsters.length; i < len; i++) {
			if( monsters[i].dragging == true ) {
				monsters[i].dragging = false;
				monsters[i].dropPosition = { x: mouseX, y: mouseY };
			}
		}
	}
	
	function createMonster( x, y ) {
		var monster = new Monster( !isMobile );
		
		monster.position.x = x;
		monster.position.y = y;
		
		monster.dropPosition.x = x;
		monster.dropPosition.y = y;
		
		monster.alh.x = x;
		monster.alh.y = y;
		
		monster.arh.x = x;
		monster.arh.y = y;
		
		monsters.push( monster );
	}
	
	function createFood( x, y ) {
		var food = new Food();
		
		food.position.x = x;
		food.position.y = y;
		
		nutritiens.push( food );
	}

	function loop() {
		
		var dirtySpread = 60;
		context.clearRect(dirtyRegion.left-dirtySpread,dirtyRegion.top-dirtySpread,dirtyRegion.right-dirtyRegion.left+(dirtySpread*2),dirtyRegion.bottom-dirtyRegion.top+(dirtySpread*2));
		
		// Reset the dirty region so that it can be expanded anew
		dirtyRegion.reset();
		
		var m, p, p2, i, len, j, jlen;
		var leftovers = [];
		
		for (i = 0, len = monsters.length; i < len; i++) {
			m = monsters[i];
			
			if( m.dragging ) {
				m.position.x += ( mouseX - m.position.x ) * 0.1;
				m.position.y += ( (mouseY+(m.radius*1.6)) - m.position.y ) * 0.1;
			}
			else if( m.dropPosition.x !== 0 || m.dropPosition.y !== 0 ) {
				m.position.x += ( m.dropPosition.x - m.position.x ) * 0.1;
				m.position.y += ( m.dropPosition.y - m.position.y ) * 0.1;
			}
			
			m.position.x = Math.max( Math.min( m.position.x, worldRect.width - (m.radius*0.7) ), (m.radius*0.7) );
			m.position.y = Math.max( Math.min( m.position.y, worldRect.height - (m.radius*0.7) ), (m.radius*0.7) );
			
			var time = new Date().getTime();
			
			if( m.eyeExposure.current < 0.012 ) {
				m.eyeExposure.target = 1;
			}
			else if( Math.random() > 0.98 && time - m.lastBlink > 1000 ) {
				m.eyeExposure.target = 0;
				m.lastBlink = time;
			}
			
			if( m.mouthExposure.current < 0.012 ) {
				m.mouthExposure.target = 1;
			}
			else if( Math.random() > 0.992 && time - m.lastChew > 1000 ) {
				m.mouthExposure.target = 0;
				m.lastChew = time;
			}
			
			m.eyeExposure.current += ( m.eyeExposure.target - m.eyeExposure.current ) * 0.3;
			m.mouthExposure.current += ( m.mouthExposure.target - m.mouthExposure.current ) * 0.2;
			
			// Eye left/right
			var el = { x: m.position.x - ( m.radius * 0.8 ), y: m.position.y - ( m.radius * 0.1 ) };
			var er = { x: m.position.x + ( m.radius * 0.8 ), y: m.position.y - ( m.radius * 0.1 ) };
			
			// Eye top/bottom
			var et = { x: m.position.x, y: m.position.y - ( m.radius * ( 0.5 + ( 0.5 * m.eyeExposure.current ) ) ) };
			var eb = { x: m.position.x, y: m.position.y - ( m.radius * ( 0.5 - ( 0.1 * m.eyeExposure.current ) ) ) };
			
			// Eye inner shadow top
			var eit = { x: m.position.x, y: m.position.y - ( m.radius * ( 0.5 + ( 0.4 * m.eyeExposure.current ) ) ) };
			
			// Eye iris
			var ei = { x: m.position.x, y: ( el.y + er.y ) / 2 - m.irisRadius };
			
			// Offset the iris depending on mouse position
			var eio = { 
				x: ( mouseX - ei.x ) / worldRect.width, 
				y: ( mouseY - ei.y ) / worldRect.height 
			};
			
			// Apply the iris offset
			ei.x += eio.x * 16;
			ei.y += eio.y * 8;
			
			// Mouth left/right
			var ml = { x: m.position.x - ( m.radius * 0.8 ), y: m.position.y + ( m.radius * 0.05 ) + ( 3 * m.mouthExposure.current ) };
			var mr = { x: m.position.x + ( m.radius * 0.8 ), y: m.position.y + ( m.radius * 0.05 ) + ( 3 * m.mouthExposure.current )  };
			
			// Mouth top/bottom
			var mt = { x: m.position.x, y: m.position.y + ( m.radius * ( 0.55 - ( 0.2 * m.mouthExposure.current ) ) ) };
			var mb = { x: m.position.x, y: m.position.y + ( m.radius * ( 0.8 + ( 0.4 * m.mouthExposure.current ) ) ) };
			
			var mby = m.position.y + ( ( mb.y - m.position.y ) * 0.65 );
			
			// Radius scaled by the mouth exposure
			var mouthRadius = m.radius * m.mouthExposure.current;
			
			// Arm left (body, elbow and hand points)
			var alb = { x: m.position.x - (m.radius*0.5), y: m.position.y + (m.radius*0.3) };
			var ale = { x: m.position.x - (m.radius*2.0), y: m.position.y + (m.radius*0.1) };
			var alh = { x: m.dropPosition.x-10, y: m.dropPosition.y-15 };
			
			// Arm right (body, elbow and hand points)
			var arb = { x: m.position.x + (m.radius*0.5), y: m.position.y + (m.radius*0.3) };
			var are = { x: m.position.x + (m.radius*2.0), y: m.position.y + (m.radius*0.1) };
			var arh = { x: m.dropPosition.x+10, y: m.dropPosition.y-15 };
			
			if( m.dragging ) {
				alh.x = mouseX-10;
				alh.y = mouseY;
				
				arh.x = mouseX+10;
				arh.y = mouseY;
			}
			
			m.alh.x += ( alh.x - m.alh.x ) * 0.3;
			m.alh.y += ( alh.y - m.alh.y ) * 0.3;
			
			m.arh.x += ( arh.x - m.arh.x ) * 0.3;
			m.arh.y += ( arh.y - m.arh.y ) * 0.3;
			
			// Arm/hand thickness
			var at = 5;
			var ht = 3;
			
			if( m.dragging ) {
				m.rotation.target = Math.atan2( mouseY - m.position.y, mouseX - m.position.x ); // Get angle between monster & mouse
				m.rotation.target *= 180 / Math.PI; // Convert to degrees
				m.rotation.target += 90; // Add 90 to normalize
				
				// Limits the rotation at -90 ranging to +90
				if( m.rotation.target > 180 || m.rotation.target > 90 ) {
					m.rotation.target = 180 - m.rotation.target;
				}
			}
			else {
				// If dragging has ended, normalize slowly
				m.rotation.target *= 0.95;
			}
			
			m.rotation.current = ( m.rotation.target - m.rotation.current ) * 0.2;
			
			// Apply rotation
			context.save();
			context.translate( m.position.x, m.position.y );
			context.rotate( m.rotation.current * Math.PI / 180 );
			context.translate( -m.position.x, -m.position.y );
			
			dirtyRegion.inflate( m.arh.x, m.arh.y );
			dirtyRegion.inflate( m.alh.x, m.alh.y );
			
			// Eye fill drawing
			context.fillStyle = 'rgba(255,255,255,1.0)';
			context.strokeStyle = 'rgba(100,100,100,1.0)';
			context.beginPath();
			context.lineWidth = 3;
			context.lineJoin = 'round';
			context.moveTo( el.x, el.y );
			context.quadraticCurveTo( et.x, et.y, er.x, er.y );
			context.quadraticCurveTo( eb.x, eb.y, el.x, el.y );
			context.closePath();
			context.stroke();
			context.fill();
			
			// Iris
			context.save();
			context.globalCompositeOperation = 'source-atop';
			context.translate(ei.x*0.1,0);
			context.scale(0.9,1);
			context.strokeStyle = 'rgba(0,0,0,0.5)';
			context.fillStyle = 'rgba(130,50,90,0.9)';
			context.lineWidth = 2;
			context.beginPath();
			context.arc(ei.x, ei.y, m.irisRadius, 0, Math.PI*2, true);
			context.fill();
			context.stroke();
			context.restore();
			
			// Iris inner
			context.save();
			context.globalCompositeOperation = 'source-atop';
			context.translate(ei.x*0.1,0);
			context.scale(0.9,1);
			context.fillStyle = 'rgba(255,255,255,0.2)';
			context.beginPath();
			context.arc(ei.x, ei.y, m.irisRadius * 0.7, 0, Math.PI*2, true);
			context.fill();
			context.restore();
			
			// Pupil
			context.save();
			context.globalCompositeOperation = 'source-atop';
			context.fillStyle = 'rgba(0,0,0,0.9)';
			context.beginPath();
			context.moveTo( ei.x, ei.y - ( m.pupilHeight * 0.5 ) );
			context.quadraticCurveTo( ei.x + ( m.pupilWidth * 0.5 ), ei.y, ei.x, ei.y + ( m.pupilHeight * 0.5 ) );
			context.quadraticCurveTo( ei.x - ( m.pupilWidth * 0.5 ), ei.y, ei.x, ei.y - ( m.pupilHeight * 0.5 ) );
			context.fill();
			context.restore();
			
			// Eye top inner shadow
			context.fillStyle = 'rgba(0,0,0,0.3)';
			context.beginPath();
			context.moveTo( el.x, el.y );
			context.quadraticCurveTo( et.x, et.y, er.x, er.y );
			context.quadraticCurveTo( eit.x, eit.y, el.x, el.y );
			context.closePath();
			context.fill();
			
			// Mouth cutout
			context.fillStyle = 'rgba(0,0,0,1.0)';
			context.beginPath();
			context.moveTo( ml.x, ml.y );
			context.quadraticCurveTo( mt.x, mt.y, mr.x, mr.y );
			context.bezierCurveTo( mb.x + mouthRadius, mby, mb.x - mouthRadius, mby, ml.x, ml.y );
			context.fill();
			
			// Bottom gum
			context.save();
			context.globalCompositeOperation = 'source-atop';
			context.fillStyle = 'rgba(80,80,80,1.0)';
			context.beginPath();
			context.moveTo( ml.x, ml.y );
			context.bezierCurveTo( mb.x - m.radius, ml.y + m.radius * 0.75, mb.x + m.radius, mr.y + m.radius * 0.75, mr.x, mr.y );
			context.bezierCurveTo( mb.x + m.radius, mr.y + m.radius * 0.48, mb.x - m.radius, ml.y + m.radius * 0.48, ml.x, ml.y );
			context.fill();
			context.restore();
			
			// Teeth drawing
			context.save();
			context.globalCompositeOperation = 'source-atop';
			context.fillStyle = 'rgba(255,255,255,1.0)';
			context.strokeStyle = 'rgba(0,0,0,0.5)';
			context.lineWidth = 0.7;
			context.lineJoin = 'round';
			context.beginPath();
			
			var teeth = 8;
			var teethDepth = 4;
			var teethHeight = m.radius * 0.26;
			var teethWidth = ( m.radius * 2.2 ) / ( teeth + 3 );
			var teethOutdent = 4;
			var teethLowerJawY = ( m.radius * 0.65 ) + ( 3 * m.mouthExposure.current );
			
			context.moveTo( ml.x, ml.y - teethDepth );
			
			// Top teeth
			for (j = 0, jlen = teeth; j < jlen; j++) {
				var yshift = ( (jlen-1) / 2 ) - (j > ((jlen-1) / 2) ? (jlen-1) - j : j);
				yshift *= 0.6;
				
				p = { x: ml.x, y: ml.y - teethDepth * yshift };
				p.x += j * teethWidth;
				p.y += teethHeight;
				
				p2 = { x: p.x, y: p.y };
				p2.x += teethWidth;
				
				context.lineTo( p.x, p.y-1 );
				context.quadraticCurveTo( p2.x + ( p.x - p2.x ) / 2, p2.y + teethOutdent + ( p.y - p2.y ) / 2, p2.x, p2.y-1 );
				context.lineTo( p2.x, ml.y - teethDepth );
			}
			
			context.fill();
			context.stroke();
			context.restore();
			
			context.save();
			context.globalCompositeOperation = 'source-atop';
			context.fillStyle = 'rgba(255,255,255,1.0)';
			context.strokeStyle = 'rgba(0,0,0,1.0)';
			context.lineWidth = 0.7;
			context.lineJoin = 'round';
			context.beginPath();
			
			context.moveTo( ml.x, ml.y + teethDepth + teethLowerJawY );
			
			// Bottom teeth
			for (j = 0, jlen = teeth; j < jlen; j++) {
				var yshift = ( (jlen-1) / 2 ) - (j > ((jlen-1) / 2) ? (jlen-1) - j : j);
				yshift *= -0.9;
				
				p = { x: ml.x, y: ml.y + teethLowerJawY + teethDepth * yshift };
				p.x += j * teethWidth;
				p.y -= teethHeight;
				
				p2 = { x: p.x, y: p.y };
				p2.x += teethWidth;
				
				context.lineTo( p.x, p.y+1 );
				context.quadraticCurveTo( p2.x + ( p.x - p2.x ) / 2, p2.y - teethOutdent + ( p.y - p2.y ) / 2, p2.x, p2.y+1 );
				context.lineTo( p2.x, ml.y + teethDepth + teethLowerJawY );
			}
			
			context.fill();
			context.stroke();
			context.restore();
			
			// Body color
			context.fillStyle = "#ffffff";
			color = context.createRadialGradient(m.position.x, m.position.y, 0, m.position.x, m.position.y, m.radius );
			color.addColorStop(0.9,'rgba(0,0,0,1.0)');
			color.addColorStop(1.0,'rgba(0,0,0,0.0)');
			
			// Move to the first anchor
			context.save();
			context.globalCompositeOperation = 'destination-over';
			context.beginPath();
			context.fillStyle = color;
			
			// Draw the body points
			for (j = -1, jlen = m.bodyPoints.length; j < jlen; j++) {
				p = getArrayElementByOffset( m.bodyPoints, j, 0 );
				p2 = getArrayElementByOffset( m.bodyPoints, j, 1 );
				
				p.position.x = m.position.x + p.normal.x;
				p.position.y = m.position.y + p.normal.y;
				
				p2.position.x = m.position.x + p2.normal.x;
				p2.position.y = m.position.y + p2.normal.y;
				
				if( j == -1 ) {
					context.moveTo( p.position.x + ( p2.position.x - p.position.x ) / 2, p.position.y + ( p2.position.y - p.position.y ) / 2 );
				}
				else {
					context.quadraticCurveTo( p.position.x, p.position.y, p.position.x + ( p2.position.x - p.position.x ) / 2, p.position.y + ( p2.position.y - p.position.y ) / 2 );
				}
			}
			
			// End the body fill
			context.fill();
			context.restore();
			
			// Draw particles if there are any
			if( m.bodyParticles.length > 0 ) {
				context.save();
				
				for (j = 0, jlen = m.bodyParticles.length; j < jlen; j++) {
					p = m.bodyParticles[j];
					
					p.rotation += p.rotationSpeed;
					
					p.position.x = m.position.x + p.normal.x + Math.cos( p.rotation ) * p.rotationRadius;
					p.position.y = m.position.y + p.normal.y + Math.sin( p.rotation ) * p.rotationRadius;
					
					context.fillStyle = 'rgba(0,0,0,0.8)';
					context.fillRect(p.position.x, p.position.y, p.size, p.size);
					
					dirtyRegion.inflate( p.position.x, p.position.y );
				}
				
				context.restore();
				context.fillStyle = "#ffffff";
			}
			
			// Left arm
			context.save();
			context.globalCompositeOperation = 'destination-over';
			context.fillStyle = 'rgba(0,0,0,1.0)';
			context.beginPath();
			context.moveTo( alb.x, alb.y );
			context.quadraticCurveTo( ale.x, ale.y, m.alh.x, m.alh.y );
			context.lineTo( m.alh.x + at, m.alh.y );
			context.quadraticCurveTo( ale.x + at, ale.y, alb.x, alb.y - at - at );
			context.fill();
			context.beginPath();
			
			// Hand
			context.moveTo( m.alh.x, m.alh.y );
			context.arc( m.alh.x + ( ht*0.5 ), m.alh.y, ht, 0, Math.PI*2, true);
			context.arc( m.alh.x + ( ht*0.5 ) - 2, m.alh.y - 2, 2, 0, Math.PI*2, true);
			context.arc( m.alh.x + ( ht*0.5 ) + 1, m.alh.y - 3.5, 2, 0, Math.PI*2, true);
			context.arc( m.alh.x + ( ht*0.5 ) + 3.5, m.alh.y - 1.5, 2, 0, Math.PI*2, true);
			context.fill();
			
			context.restore();
			
			// Right arm
			context.save();
			context.globalCompositeOperation = 'destination-over';
			context.fillStyle = 'rgba(0,0,0,1.0)';
			context.beginPath();
			context.moveTo( arb.x, arb.y );
			context.quadraticCurveTo( are.x, are.y, m.arh.x, m.arh.y );
			context.lineTo( m.arh.x - at, m.arh.y );
			context.quadraticCurveTo( are.x - at, are.y, arb.x, arb.y - at - at );
			context.fill();
			context.beginPath();
			
			// Hand
			context.moveTo( m.arh.x, m.arh.y );
			context.arc( m.arh.x - ( ht*0.5 ), m.arh.y, ht, 0, Math.PI*2, true);
			context.arc( m.arh.x - ( ht*0.5 ) + 2, m.arh.y - 2, 2, 0, Math.PI*2, true);
			context.arc( m.arh.x - ( ht*0.5 ) - 1, m.arh.y - 3.5, 2, 0, Math.PI*2, true);
			context.arc( m.arh.x - ( ht*0.5 ) - 3.5, m.arh.y - 1.5, 2, 0, Math.PI*2, true);
			context.fill();
			
			context.restore();
			
			// Resets rotation
			context.restore();
			
			dirtyRegion.inflate( m.position.x - m.radius, m.position.y - m.radius );
			dirtyRegion.inflate( m.position.x + m.radius, m.position.y + m.radius );
			
			/*
			if( nutritiens.length < 20 ) {
				createFood( worldRect.width * Math.random(), ( worldRect.height * 0.7 ) + ( worldRect.height * 0.3 * Math.random() ) );
			}
			
			for (j = 0, jlen = nutritiens.length; j < jlen; j++) {
				p = nutritiens[j];
				
				context.fillStyle = 'rgba(0,0,0,0.9)';
				context.beginPath();
				context.arc( p.position.x, p.position.y, p.size, 0, Math.PI*2, true);
				context.fill();
			}
			*/
		}
		
	}
		
	
};

/**
 * 
 */
function Point() {
	this.position = { x: 0, y: 0 };
}
Point.prototype.distanceTo = function(p) {
	var dx = p.x-this.position.x;
	var dy = p.y-this.position.y;
	return Math.sqrt(dx*dx + dy*dy);
};
Point.prototype.clonePosition = function() {
	return { x: this.position.x, y: this.position.y };
};

/**
 * 
 */
function Region() {
	this.left = 999999; 
	this.top = 999999; 
	this.right = 0; 
	this.bottom = 0;
}
Region.prototype.reset = function() {
	this.left = 999999; 
	this.top = 999999; 
	this.right = 0; 
	this.bottom = 0; 
};
Region.prototype.inflate = function( x, y ) {
	this.left = Math.min(this.left, x);
	this.top = Math.min(this.top, y);
	this.right = Math.max(this.right, x);
	this.bottom = Math.max(this.bottom, y);
};

/**
 * 
 */
function Monster( useParticles ) {
	this.position = { x: 0, y: 0 };
	this.dropPosition = { x: 0, y: 0 };
	
	this.radius = 60;
	
	this.rotation = { current: 0, target: 0 };
	
	this.bodyPoints = [];
	this.bodyParticles = [];
	
	this.dragging = false;
	this.blinking = false;
	
	this.lastBlink = 0;
	this.lastChew = 0;
	
	this.eyeExposure = { current: 0, target: 1 };
	this.mouthExposure = { current: 0, target: 1 };
	
	this.irisRadius = this.radius * 0.25;
	this.pupilHeight = this.irisRadius * 1.2;
	this.pupilWidth = 4;
	
	// Arm left/right hand positions
	this.alh = { x: 0, y: 0 };
	this.arh = { x: 0, y: 0 };
	
	this.createBodyPoints();
	
	// Only create the body particles if flagged
	if( useParticles ) {
		this.createBodyParticles();
	}
}
Monster.prototype = new Point();
Monster.prototype.createBodyPoints = function() {
	
	var q = 12;
	
	for( var i = 0; i < q; i++ ) {
		var p = new BodyPoint();
		
		var angle = (i / q ) * Math.PI * 2;
		var radius = this.radius + ( -2 + Math.random() * 4 );
		
		p.normal.x = Math.cos( angle ) * radius;
		p.normal.y = Math.sin( angle ) * radius;
		
		this.bodyPoints.push( p );
	}
	
};
Monster.prototype.createBodyParticles = function() {
	
	var q = 500;
	
	for( var i = 0; i < q; i++ ) {
		var p = new BodyParticle();
		
		var angle = (i / q ) * Math.PI * 2;
		
		p.normal.x = Math.cos( angle ) * this.radius;
		p.normal.y = Math.sin( angle ) * this.radius;
		
		this.bodyParticles.push( p );
	}
	
};

/**
 * 
 */
function BodyPoint() {
	this.position = { x: 0, y: 0 };
	this.normal = { x: 0, y: 0 };
}
BodyPoint.prototype = new Point();

/**
 * 
 */
function BodyParticle() {
	this.normal = { x: 0, y: 0 };
	this.size = 1;
	this.rotation = 0;
	this.rotationSpeed = -0.07+Math.random()*0.14;
	this.rotationRadius = Math.random()*6;
}
BodyParticle.prototype = new BodyPoint();

/**
 * 
 */
function Food() {
	this.position = { x: 0, y: 0 };
	this.size = 3 + Math.random()*2;
}
BodyParticle.prototype = new BodyPoint();


function getArrayElementByOffset( array, index, offset ) {
	if( array[index+offset] ) {
		return array[index+offset];
	}
	
	if( index+offset > array.length-1 ) {
		return array[index - array.length + offset];
	}
	
	if( index+offset < 0 ) {
		return array[array.length + ( index + offset )];
	}
}


MonsterWorld.init();
	
	