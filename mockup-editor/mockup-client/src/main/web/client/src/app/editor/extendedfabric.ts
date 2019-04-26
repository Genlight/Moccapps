import { fabric } from 'fabric';
import { UUID } from 'angular2-uuid';

// das fabric objekt kann wie alles andere in JS per Object.prototype seine member
// anpassen. So funktioniert auch Typescript im wesentlichen.
// Diese Klasse wrappt also alles, was wir für alle fabric-Objekte gleich haben wollen.
//
// ff. snippet dazu gefunden unter https://stackoverflow.com/questions/34347336/the-toobject-function-in-fabric-js
fabric.Object.prototype.toObject = (function(toObject) {
        return function() {
            return fabric.util.object.extend(toObject.call(this), {
                uuid: this.uuid, // my custom property
            });
        };
    })(fabric.Object.prototype.toObject);

// copied original initialize function, added UUID, works for all objects on new-call
// see http://fabricjs.com/docs/fabric.js.html#line13062
fabric.Object.prototype.initialize = function(options) {
      if (options) {
        this.setOptions(options);
      }
      this.uuid = UUID.UUID();
};

// exportier das gewrappte fabric-Objekt; nicht zu verwechseln mit new fabric.Object()!
export { fabric };
