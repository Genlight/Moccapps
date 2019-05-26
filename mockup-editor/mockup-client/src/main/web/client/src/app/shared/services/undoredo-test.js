// Fabric.js Canvas object
var canvas;
// current unsaved state
var state;
// past states
var undo = [];
// reverted states
var redo = [];

/**
 * Push the current state into the undo stack and then capture the current state
 */
function save() {
  // clear the redo stack
  redo = [];
  $('#redo').prop('disabled', true);
  // initial call won't have a state
  if (state) {
    undo.push(state);
    $('#undo').prop('disabled', false);
  }
  state = JSON.stringify(canvas);
  console.log(state);
}

/**
 * Save the current state in the redo stack, reset to a state in the undo stack, and enable the buttons accordingly.
 * Or, do the opposite (redo vs. undo)
 * @param playStack which stack to get the last state from and to then render the canvas as
 * @param saveStack which stack to push current state into
 * @param buttonsOn jQuery selector. Enable these buttons.
 * @param buttonsOff jQuery selector. Disable these buttons.
 */
function replay(playStack, saveStack, buttonsOn, buttonsOff) {
  saveStack.push(state);
  state = playStack.pop();
  var on = $(buttonsOn);
  var off = $(buttonsOff);
  // turn both buttons off for the moment to prevent rapid clicking
  on.prop('disabled', true);
  off.prop('disabled', true);
  canvas.clear();
  canvas.loadFromJSON(state, function() {
    canvas.renderAll();
    // now turn the buttons back on if applicable
    on.prop('disabled', false);
    if (playStack.length) {
      off.prop('disabled', false);
    }
  });
}

$(function() {
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Set up the canvas
  canvas = new fabric.Canvas('canvas');
  canvas.setWidth(500);
  canvas.setHeight(500);
  // save initial state
  save();
  // register event listener for user's actions
  canvas.on('object:modified', function() {
    save();
  });
  // draw button
  $('#draw').click(function() {
    var imgObj = new fabric.Circle({
      fill: '#' + Math.floor(Math.random() * 16777215).toString(16),
      radius: Math.random() * 250,
      left: Math.random() * 250,
      top: Math.random() * 250
    });
    canvas.add(imgObj);
    canvas.renderAll();
    save();
  });
  //////////////////////////////////////
  $('#pattern').click(function() {

    var rect = new fabric.Rect({
      left: 100,
      top: 100,
      width: 100,
      height: 100
    });
    canvas.add(rect);

    fabric.Image.fromURL("https://css-tricks.com/wp-content/uploads/2015/05/kiwi.svg", function(img) {
      img.scaleToWidth(100).set({
        originX: 'left',
        originY: 'top'
      });


      var patternSourceCanvas = new fabric.StaticCanvas();
      patternSourceCanvas.add(img);
      var pattern = new fabric.Pattern({
        source: function() {
          patternSourceCanvas.setDimensions({
            width: img.getWidth() + 0,
            height: img.getHeight() + 0
          });
          return patternSourceCanvas.getElement();
        },
        repeat: 'repeat'
      });
      rect.set({
        fill: pattern
      });
      canvas.renderAll();
      save();

    });

    rect.on('scaling', function() {
      rect.set({
        width: rect.width * rect.scaleX,
        scaleX: 1,
        height: rect.height * rect.scaleY,
        scaleY: 1
      }); // apply the scale
      rect.setCoords(); // called so that the bounding box etc gets updated
      save();
    });


  });
  /////////////////////////////////////////
  // undo and redo buttons
  $('#undo').click(function() {
    replay(undo, redo, '#redo', this);
  });
  $('#redo').click(function() {
    replay(redo, undo, '#undo', this);
  })
});
