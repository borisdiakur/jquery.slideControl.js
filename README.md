#jquery.slideControl.js

---

##Summary

jquery.slideControl.js is a lightweight, responsive, jQuery based slide control plugin which supports snapping into steps and includes callback functionality.

##Features

* Simple
* Robust (tested with jQuery v1.9.1 on IE6+ and all major desktop and mobile browsers)
* Responsive
* Snap into step functionality
* Callback functionality
  * onStart
  * onChanged
  * onTargetSnapPositionChanged 
  * onComplete

## Live Demo

### [http://borisdiakur.com/jquery.slideControl.js/demo.html](http://borisdiakur.com/jquery.slideControl.js/demo.html)

## Download

* Development [jquery.slideControl.js](https://raw.github.com/borisdiakur/jquery.slideControl.js/master/jquery.slideControl.js) 9KB
* Production [jquery.slideControl.min.js](https://raw.github.com/borisdiakur/jquery.slideControl.js/master/jquery.slideControl.min.js) 4.3KB (1.5KB Gzip)

## Browser Support

Tested with jQuery v1.9.1 on IE6+ and all major desktop and mobile browsers.

## Initialization options

* `currentRelativePosition` (default 0)
* `steps` (default `undefinded`)
* `currentStep` (default 0)
* `onStart` (default `function() {}`)
* `onChanged` (default `function() {}`)
* `onTargetSnapPositionChanged` (default `function() {}`)
* `onComplete` (default `function() {}`)

## API

### `slideToStep`(`Number`)

Only argument should be a zero-indexed integer.

### `slideToRelativePosition`(`Number`)

Only argument should be a float between 0 (slide left) and 1 (slide right).

## Usage suggestions

* Check out the [live demo](http://borisdiakur.com/jquery.slideControl.js/demo.html) source code
* Use either step options and API or current relative position option and API - do not try to use both on the same slide control.
* Put the slide control into a container. Set position, width and background image of the slide control by setting the according css on the container.

## Contributing

Issues and Pull-requests welcome.

## Change Log

v0.1.0 - Alpha

#### WTFPL License ([http://wtfpl.org/](http://wtfpl.org/))

Copyright © 2013 Boris Diakur [contact@borisdiakur.com](mailto:contact@borisdiakur.com)