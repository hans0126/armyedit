   function thumbEdit() {
       var _self = this;
       _self.canvasElement = null;
       _self.canvasWidth = 320;
       _self.canvasHeight = 320;
       _self.crop = {
           w: 100,
           h: 100
       }

       var imgPos = {
           x: 0,
           y: 0
       }

       _self.output = {
           x: 0,
           y: 0
       }

       var pos = {
           ox: 0,
           oy: 0,
           dx: 0,
           dy: 0
       }

       var actors = [];

       var imageObj = new Image();
       var outputELement = null; 

       _self.loadData = function(_x, _y) {
           var _baseX = _self.canvasWidth / 2 - _self.crop.w / 2;
           var _baseY = _self.canvasHeight / 2 - _self.crop.h / 2;

           imgPos.x = _baseX + _x;
           imgPos.y = _baseY + _y;

           _self.output.x = _x;
           _self.output.y = _y

       }

       _self.init = function(_elementId, _imgUrl, _outputElement) {
           _self.canvasElement = document.getElementById(_elementId);
           _self.canvasElement.width = _self.canvasWidth;
           _self.canvasElement.height = _self.canvasHeight;

           //change cursor
           var style = document.createElement('style');
           var cssText = "#" + _elementId + ":active {cursor: crosshair;}";
           style.appendChild(document.createTextNode(cssText));
           document.getElementsByTagName('head')[0].appendChild(style);


           _self.canvasElement.style.border = "1px solid #aaa";

           // outputELement = _outputElement;
           outputELement = document.getElementById(_outputElement);
           imageObj.src = _imgUrl;

           var thumbCss = {
               "display": "block",
               "width": _self.crop.w + "px",
               "height": _self.crop.h + "px",
               "border": "1px solid #aaa",
               "backgroundRepeat": "no-repeat"
              
           }

           for (var key in thumbCss) {
               outputELement.style[key] = thumbCss[key];
           }

           thumbRender();

           drawStart();

           _self.canvasElement.addEventListener('mousedown', function(evt) {

               var mousePos = getMousePos(_self.canvasElement, evt);
               pos.ox = mousePos.x;
               pos.oy = mousePos.y;

               _self.canvasElement.addEventListener('mousemove', moveEvent);

           });

           _self.canvasElement.addEventListener('mouseup', function(evt) {

               _self.output.x = (imgPos.x - (_self.canvasWidth / 2) + _self.crop.w / 2);
               _self.output.y = (imgPos.y - (_self.canvasHeight / 2) + _self.crop.h / 2);

               _self.canvasElement.removeEventListener('mousemove', moveEvent);


               thumbRender();

           })
       }

       _self.renew = function(_imgUrl) {
           imageObj.src = _imgUrl;
       }


       imageObj.onload = function() {

           for (var i = 0; i < actors.length; i++) {
               if (actors[i]._id == "main") {
                   actors.splice(i, 1);
                   break;
               }
           }
           outputELement.style.backgroundImage = "url(" + imageObj.src + ")";

           imgPos.x = imgPos.y = imgPos.x = imgPos.y = 0;

           var _img = new actor();
           _img.zIndex = 10;
           _img.ctx = _self.canvasElement.getContext("2d");
           _img._id = "main"
           _img.draw = function() {
               if (this.renew) {
                   this.clearRect();
               }

               imgPos.x += pos.dx;
               imgPos.y += pos.dy;

               this.ctx.drawImage(imageObj, imgPos.x, imgPos.y);
           }

           actors.push(_img);         

           actors.sort(function(a, b) {
               return a.zIndex - b.zIndex;
           })

           render();
       };

       function drawStart() {

           var cropRect = new actor();
           cropRect.zIndex = 100;
           cropRect.ctx = _self.canvasElement.getContext("2d");
           cropRect.renew = false;
           cropRect.draw = function() {

               var _posX = _self.canvasWidth / 2 - _self.crop.w / 2,
                   _posY = _self.canvasHeight / 2 - _self.crop.h / 2;

               if (this.renew) {
                   this.clearRect()
               }

               this.ctx.strokeStyle = "#00FF00";
               this.ctx.lineWidth = 1;
               this.ctx.strokeRect(_posX, _posY, _self.crop.w, _self.crop.h);
           }

           actors.push(cropRect);

       }

       function actor() {
           this.zIndex = 0;
           this.draw = function() {};
           this._id = null;
           this.ctx = {};
           this.renew = true;
           this.clearRect = function() {
               this.ctx.clearRect(0, 0, _self.canvasWidth, _self.canvasHeight);
               this.ctx.beginPath();
           }
       }

       function getMousePos(canvas, evt) {
           var rect = canvas.getBoundingClientRect();

           return {
               x: evt.clientX - rect.left,
               y: evt.clientY - rect.top
           };
       }

       function moveEvent(evt) {

           var mousePos = getMousePos(_self.canvasElement, evt);

           pos.dx = mousePos.x - pos.ox;
           pos.dy = mousePos.y - pos.oy;

           render();

           pos.ox = mousePos.x;
           pos.oy = mousePos.y;
       }

       function render() {
           actors.forEach(function(doc) {
               doc.draw();
           })
       }

       function thumbRender() {
           outputELement.style.backgroundPosition = _self.output.x + "px " + _self.output.y + "px";
       }

   }
