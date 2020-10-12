
declare var google: any;

export function CustomMarker(latlng, map, imageSrc, callback) {
    this.latlng_ = latlng;
    this.imageSrc = imageSrc;
    this.callback = callback;
    this.setMap(map);
  }
  
  CustomMarker.prototype = new google.maps.OverlayView();
  
  CustomMarker.prototype.draw = function () {
    // Check if the div has been created.
    var div = this.div_;
    if (!div) {
      // Create a overlay text DIV
      div = this.div_ = document.createElement('div');
      // Create the DIV representing our CustomMarker 
  
      div.onclick = () => this.callback();
      
      div.style.position = "absolute";
      div.style.cursor = "pointer";
      div.style.background = "#59C16A";
      div.style.width = "60px";
      div.style.height = "60px";
      div.style.marginLeft = "-30px";
      div.style.marginTop = "-66px";
      div.style.borderRadius = "100%";
      div.style.padding = "0px";
      div.className = "animate__animated animate__fadeInDown animate__faster";
  
      let afterDiv = document.createElement('div');
      afterDiv.style.content = "";
      afterDiv.style.position = "absolute";
      afterDiv.style.bottom = '-6px';
      afterDiv.style.left = '24px';
      afterDiv.style.borderWidth = "6px 6px 0";
      afterDiv.style.borderStyle = 'solid';
      afterDiv.style.borderColor = '#59C16A transparent'
      afterDiv.style.display = "block";
      afterDiv.style.width = "0";
  
  
      var img = document.createElement("img");
      img.src = this.imageSrc;
  
      img.style.width = "54px";
      img.style.height = "54px";
      img.style.margin = "3px";
      img.style.borderRadius = "100%";
  
  
      div.appendChild(afterDiv);
      div.appendChild(img);
      google.maps.event.addDomListener(div, "click", function (event) {
        google.maps.event.trigger(null, "click");
      });
  
      // Then add the overlay to the DOM
      var panes = this.getPanes();
      panes.overlayImage.appendChild(div);
    }
  
    // Position the overlay 
    var point = this.getProjection().fromLatLngToDivPixel(this.latlng_);
    if (point) {
      div.style.left = point.x + 'px';
      div.style.top = point.y + 'px';
    }
  };
  
  CustomMarker.prototype.remove = function () {
    // Check if the overlay was on the map and needs to be removed.
    if (this.div_) {
      this.div_.parentNode.removeChild(this.div_);
      this.div_ = null;
    }
  };
  
  CustomMarker.prototype.getPosition = function () {
    return this.latlng_;
  };
  