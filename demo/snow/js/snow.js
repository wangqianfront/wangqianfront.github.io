(function() {
	
	var isIE = /msie/i.test(navigator.userAgent) && !window.opera;
	
	function mousePosition(e) {
		var event = e || window.event;
		if (event.pageX || event.pageY) {
			return {x:event.pageX, y:event.pageY};
		}
		return {
			x:event.clientX + document.body.scrollLeft - document.body.clientLeft,
			y:event.clientY + document.body.scrollTop - document.body.clientTop
		};
	}
	
	function getPosition(target) {
		var left = 0, top = 0;
		do {
			left += target.offsetLeft || 0;
			top += target.offsetTop || 0;
			target = target.offsetParent;
		} while(target);
		return {
			left: left,
			top: top
		};
	}
	
	var Class = (function() {  
      
        /** 
         * Initialze object from class. 
         * @param class object. 
         */  
        var initializeClass = (function() {  
            if (Object.create) {  
                return Object.create;  
            } else {  
                return function(o) {  
                    function F() {}    
                    F.prototype = o;    
                    return new F();  
                };  
            }  
        })();  
  
        /** 
         * The main function of Class. 
         *  
         * @param classContent 
         * @param superClass 
         */  
        return function() {  
  
            var classPrototype = arguments[arguments.length - 1] || {};  
  
            for (var index = 0; index < arguments.length - 1; index++) {  
  
                var superClass = arguments[index];  
                  
                if (typeof superClass["initialize"] == "function") {  
                    classPrototype.superclass = superClass["initialize"];  
                } else {  
                    classPrototype.superclass = function() {};  
                }  
                  
                for (var prop in superClass) {  
  
                    if (prop == "initialize" || prop == "newInstance") {  
                        continue;  
                    }  
                      
                    if (classPrototype.hasOwnProperty(prop)) {  
                        if (typeof superClass[prop] == "function") {  
                            classPrototype.superclass[prop] = superClass[prop];  
                        }  
                    } else {  
                        classPrototype[prop] = superClass[prop];  
                    }  
                }  
            }  
            classPrototype.newInstance = function() {  
                var instance = initializeClass(this);  
                if (instance["initialize"]) {  
                    instance["initialize"].apply(instance, arguments);  
                }  
                return instance;  
            };  
            return classPrototype;  
        };  
    })();  
	
	
	/**
	 * Canvas描绘工具类
	 */
	var GraphHelper = Class({
		container: null,
		width: null,
		height: null,
		ctx: null,
		initialize: function(containerId, width, height) {
			this.container = document.getElementById(containerId);
			this.width = width;
			this.height = height;
		},
		
		/**
		 * 初始化ctx
		 */
		getCtx: function() {
			if (!this.ctx) {
				var cvs = document.createElement('canvas');
				
				// 这里不能用style.width，否则drawImage会有bug
				cvs.width = this.width;
				cvs.height = this.height;
				cvs.style.position = 'absolute';
				
				this.container.appendChild(cvs);
				if (isIE) {
					G_vmlCanvasManager.initElement(cvs);
					cvs = document.getElementById(cvs.id);
				}
				this.canvas = cvs;
				this.ctx = cvs.getContext('2d');
			}
			return this.ctx;
		},
		
		/**
		 * 画圆
		 */
		drawCircle: function(x, y, radius, fillColor, strokeColor) {
			var ctx = this.getCtx();
			ctx.beginPath();
			ctx.moveTo(x, y);
			ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
			ctx.closePath();
			if (strokeColor) {
				ctx.strokeStyle = strokeColor;
				ctx.stroke();
			}
			
			if (fillColor) {
				ctx.fillStyle = fillColor;
				ctx.fill();
			}
		},
		
		drawImage: function(image, dx, dy, dw, dh, angle) {
			var ctx = this.getCtx();
			ctx.save();
			ctx.translate(dx, dy);
			ctx.rotate(angle);
			ctx.drawImage(image, dw / 2, dh / 2, dw, dh);
			ctx.restore();
		},
		
		/**
		 * 清除Canvas
		 */
		clear: function() {
			var ctx = this.getCtx();
			ctx.clearRect(0, 0, this.width, this.height);
		},
		
		/**
		 * 注册事件
		 */
		addEventListener: function(event, fn) {
			this.canvas.addEventListener(event, fn, false);
		},
		
		/**
		 * 注册Canvas Style
		 */
		setStyle: function(props) {
			for (var prop in props) {
				this.canvas.style[prop] = props[prop];
			}
		}
	
	});
	
	var PixelHelper = Class(GraphHelper, {
		
		imageData: null,
		
		initialize: function(containerId, width, height) {
			PixelHelper.superclass.call(this, containerId, width, height);
			
			this.createMask();
		},
		
		createMask: function() {
			var ctx = this.getCtx();
			ctx.globalCompositeOperation = "destination-out";
			this.imageData = ctx.createImageData(this.width, this.height);
			var data = this.imageData.data;
			
			for (var index = 0; index < data.length; index++) {
				
				if ((index + 1) % 4 == 0) {
					data[index] = 0;
				} else {
					data[index] = 255;
				}
			}
			ctx.putImageData(this.imageData, 0, 0);
		},
		
		nextPixel: function() {
			var ctx = this.getCtx();
			var imageData = ctx.getImageData(0, 0, this.width, this.height);
			
			var data = imageData.data;
			for (var index = 0; index < data.length; index++) {
				
				if ((index + 1) % 4 == 0) {
					if (data[index] <= 121) {
						data[index]++;
					}
					
					if (data[index] >=  130) {
						data[index] = 0;
					}
					
				} else {
					data[index] = 255;
				}
			}
			
			ctx.putImageData(imageData, 0, 0);
		}
	});
	
	var Snow = Class({
		photoSrc: null,
		width: null,
		height: null,
		direct: false,
		currentAngle: 0,
		rotation: 0,
		initialize: function(photoSrc, width, height) {
			this.photoSrc = photoSrc;
			this.width = width;
			this.height = height;
			this.initParam();
		},
		initParam: function() {
			this.arcX = this.random(30, this.width - 30);
			this.radius = this.random(200, 400);
			this.arcY = -(this.radius + 80);
			this.maxAngle = this.random(15, 33) * Math.PI / 180;
			this.secondAngle = this.random(4, 10) / 10 / this.radius;
			this.angle = (this.random(-300, 300) % 4) / 10;
			this.scaleNum = this.random(4, 8) / 10;
			this.moveY = this.random(3, 24) /  10;
			this.image = this.photoSrc[this.random(0, 300) % this.photoSrc.length];
		},
		random: function(min, max) {
			return Math.round(Math.random() * (max - min) + min);
		},
		toNextPoint: function() {
			
			this.arcY += this.moveY;
			
			if (this.direct) {
				this.currentAngle += this.secondAngle;
			} else {
				this.currentAngle -= this.secondAngle;
			}
			
			var x = Math.sin(this.currentAngle) * this.radius + this.arcX;
			var y = Math.cos(this.currentAngle) * this.radius + this.arcY;
			
			if (this.currentAngle >= this.maxAngle) {
				this.direct = false;
			} else if (this.currentAngle <= -this.maxAngle) {
				this.direct = true;
			}
			this.rotation += .01;
			this.currentX = x;
			this.currentY = y;
			
			if (this.arcY > this.height) {
				this.initParam();
			}
		}
	});
	
	var SnowCanvas = Class({
		
		photoArr: null,
		snowArr: null,
		initialize: function(containerId, width, height) {
			this.helper = GraphHelper.newInstance(containerId, width, height);
			this.helper.getCtx();
			this.helper.setStyle({
				zIndex: 2
			});
			
			this.loadSource(["images/b.png", "images/c.png"], this.eventWrapper(this.play, this));
			
		},
		
		loadSnow: function(width, height) {
			this.snowList = [];
			
			for (var index = 0; index < 7; index++) {
				var snow = Snow.newInstance(this.photoArr, width, height);
				this.snowList.push(snow);
			}
		},
		
		loadSource: function(sourceArr, handler) {
			
			this.photoArr = [];
			
			var count = 0;
			
			for (var index = 0; index < sourceArr.length; index++) {
				
				var image = new Image();
				
				image.onload = function() {
						
					count++;
					if (count == sourceArr.length) {
						handler();
					}
				};
				image.src = sourceArr[index];
				this.photoArr.push(image);
			}
		},
		
		eventWrapper: function(fn, target) {
			return function(event) {
				fn.call(target, event);
			};
		},
		
		play: function() {
			
			this.loadSnow(this.helper.width, this.helper.height);
			var helper = this.helper;
			var snowList = this.snowList;
			
			setInterval(function() {
				helper.clear();
				
				for (var index = 0; index < snowList.length; index++) {
					var snow = snowList[index];
					var scale = 40 * snow.scaleNum;
					helper.drawImage(snow.image, snow.currentX, snow.currentY, scale, scale, snow.rotation);
					snow.toNextPoint();
				}
			}, 1000 / 60);
		}
	});
	
	var MaskCanvas = Class({
		
		isDragStart:false,
		
		lastX: 0,
		lastY: 0,
		
		initialize: function(containerId, width, height) {
			var helper = PixelHelper.newInstance(containerId, width, height);
			helper.getCtx();
			
			helper.setStyle({
				zIndex: 3,
				cursor: "pointer"
			});
			setInterval(function() {
				helper.nextPixel();
			}, 1000 / 60);
			this.helper = helper;
			helper.addEventListener('mousedown', this.eventWrapper(this.mouseDownHandler, this));
			helper.addEventListener('mousemove', this.eventWrapper(this.mouseMoveHandler, this));
			helper.addEventListener('mouseup', this.eventWrapper(this.mouseUpHandler, this));
		},
		eventWrapper: function(fn, target) {
			return function(event) {
				fn.call(target, event);
			};
		},
		
		getMouseCoord: function(event) {
			var mousePos = mousePosition(event);
			var canvasPos = getPosition(this.helper.container);
			return {
				x: mousePos.x - canvasPos.left,
				y: mousePos.y - canvasPos.top
			};
		},
		mouseDownHandler: function(event) {
			
			var mouseCoord = this.getMouseCoord(event);
			
			this.lastX = mouseCoord.x;
			
			this.lastY = mouseCoord.y;
			
			this.helper.drawCircle(mouseCoord.x, mouseCoord.y, 30, "rgba(255, 255, 255, 136)");
			
			this.isDragStart = true;
		},
		
		mouseMoveHandler: function(event) {
			
			if (this.isDragStart == false) {
				return;
			}
			
			var mouseCoord = this.getMouseCoord(event);
			
			var xDos = mouseCoord.x - this.lastX;
			var yDos = mouseCoord.y - this.lastY;
			
			var dos = Math.max(xDos, yDos);
			var factor = 10;
			if (dos > 200) {
				factor = 30;
			}
			
			var xFactor = xDos / factor;
			
			var yFactor = yDos / factor;
			
			var currentX = 0;
			var currentY = 0;
			for (var i = 0; i < 10; i++) {
				currentX += xFactor;
				currentY += yFactor;
				this.helper.drawCircle(this.lastX + currentX, this.lastY + currentY, 30, "rgba(255, 255, 255, 136)");
			}
			
			this.helper.drawCircle(mouseCoord.x, mouseCoord.y, 30, "rgba(255, 255, 255, 136)");

			event.preventDefault();
			
			this.lastX = mouseCoord.x;
			
			this.lastY = mouseCoord.y;
		},
		
		mouseUpHandler: function(event) {
			this.isDragStart = false;
		}
	});
	
	var Background = Class({
		initialize: function(containerId, imageUrl, handler) {
			var image = new Image();
			var targetThis = this;
			image.onload = function() {
				
				var container = document.getElementById(containerId);
				
				container.style.display = "inline-block";
				
				targetThis.createBackground(container, image);
				
				handler({width: image.width, height: image.height});
			};
			image.src = imageUrl;
		},
		
		createBackground: function(container, image) {
			var imgTag = document.createElement("img");
			imgTag.src = image.src;
			imgTag.width = image.width;
			imgTag.height = image.height;
			imgTag.style.zIndex = 1;
			imgTag.style.position = "absolute";
			container.appendChild(imgTag);
		}
	});
	
	SnowFactory = Class({
		
		initialize: function(containerId, imageUrl) {
			Background.newInstance(containerId, imageUrl, function(imageInfo) {
				SnowCanvas.newInstance(containerId, imageInfo.width, imageInfo.height);
				MaskCanvas.newInstance(containerId, imageInfo.width, imageInfo.height);
			});
		}
	});
})();