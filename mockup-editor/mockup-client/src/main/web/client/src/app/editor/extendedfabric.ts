import { fabric } from 'fabric';
import { UUID } from 'angular2-uuid';

// das fabric objekt kann wie alles andere in JS per Object.prototype seine member
// anpassen. So funktioniert auch Typescript im wesentlichen.
// Diese Klasse wrappt also alles, was wir für alle fabric-Objekte gleich haben wollen.
//
// ff. snippet dazu gefunden unter https://stackoverflow.com/questions/34347336/the-toobject-function-in-fabric-js
/**
 * overriding the toObject function from fabric.js to include the uuid correctly in the object
 * also adding a sendMe field to distinguish between changes "to be sent" and "already sent/applied" 
 */
fabric.Object.prototype.toObject = (function(toObject) {
    return function(propertiesToInclude) {
        propertiesToInclude = (propertiesToInclude || [])
        .concat(
          ['uuid']
        )
        .concat(
            ['sendMe']
        );
        return toObject.apply(this, [propertiesToInclude]);
    };
})(fabric.Object.prototype.toObject);

// copied original initialize function, added UUID, works for all objects on new-call
// also added sendMe flag
// see http://fabricjs.com/docs/fabric.js.html#line13062
fabric.Object.prototype.initialize = function(options) {
      if (options) {
        this.setOptions(options);
      }
      if(!this.uuid) this.uuid = UUID.UUID();
      if(this.sendMe === undefined) this.sendMe = true;
};


/**
 * overrides renderStroke to redraw the border of objects on resize,
 * so the border doesn't get scaled in x and y direction
 * based on https://stackoverflow.com/questions/39548747/fabricjs-how-to-scale-object-but-keep-the-border-stroke-width-fixed
 * TODO: still reverts back to original stroke when object is grouped
 */
fabric.Object.prototype._renderStroke = function(ctx) {
    if (!this.stroke || this.strokeWidth === 0) {
        return;
    }
    if (this.shadow && !this.shadow.affectStroke) {
        this._removeShadow(ctx);
    }
    ctx.save();
    if (this.group) {
        ctx.scale(1 / this.group.scaleX, 1 / this.group.scaleY);
    } else {
        ctx.scale(1 / this.scaleX, 1 / this.scaleY);
    }
    this._setLineDash(ctx, this.strokeDashArray, this._renderDashedStroke);
    this._applyPatternGradientTransform(ctx, this.stroke);
    ctx.stroke();
    ctx.restore();
};

/**
 * overrides getTransformationDimensions to get the correct bounding box
 * with the changes made to renderStroke
 * based on https://stackoverflow.com/questions/39548747/fabricjs-how-to-scale-object-but-keep-the-border-stroke-width-fixed
 */
fabric.Object.prototype._getTransformedDimensions = function(skewX, skewY) {
    if (typeof skewX === 'undefined') {
        skewX = this.skewX;
    }
    if (typeof skewY === 'undefined') {
        skewY = this.skewY;
    }
    const dimX = this.width / 2;
    const dimY = this.height / 2;

    const points = [{
        x: -dimX,
        y: -dimY
    }, {
        x: dimX,
        y: -dimY
    }, {
        x: -dimX,
        y: dimY
    }, {
        x: dimX,
        y: dimY
    }];
    const transformMatrix = this._calcDimensionsTransformMatrix(skewX, skewY, false);
    for (let i = 0; i < points.length; i++) {
        points[i] = fabric.util.transformPoint(points[i], transformMatrix);
    }
    const bbox = fabric.util.makeBoundingBoxFromPoints(points);
    return {
        y: bbox.height + this.strokeWidth,
        x: bbox.width + this.strokeWidth,
    };
};

fabric.Object.prototype.resizeToScale = function() {
    if  (this.type !== 'group') {
      this.strokeWidth = this._origStrokeWidth / Math.max(this.scaleX, this.scaleY);
    } else {
      this._objects.forEach( function(obj) {
        //console.log(obj);
        obj.strokeWidth = obj._origStrokeWidth / Math.max(obj.group.scaleX, obj.group.scaleY);
      });
    }
  };

  //overriding clone function to properly copy the custom uuid?
//fabric.Canvas.prototype.clone = function
// export wrapped fabric-object
export { fabric };
