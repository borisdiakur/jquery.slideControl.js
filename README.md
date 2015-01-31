#jquery.slideControl.js

jquery.slideControl.js is a lightweight, responsive, jQuery based slide control plugin which supports snapping into steps and includes callback functionality.

### Demo

[http://borisdiakur.github.io/jquery.slideControl.js/](http://borisdiakur.github.io/jquery.slideControl.js/)

### Browser Support

Tested with jQuery v1.9.1 on IE6+ and all major desktop and mobile browsers.

## Usage

Install with bower

    bower install slidecontrol --save

Or just download

[jquery.slideControl.js](https://raw.github.com/borisdiakur/jquery.slideControl.js/master/jquery.slideControl.js) 10KB<br>
[jquery.slideControl.min.js](https://raw.github.com/borisdiakur/jquery.slideControl.js/master/jquery.slideControl.min.js) 4.7KB (1.5KB Gzip)

Now check out the [demo source code](https://github.com/borisdiakur/jquery.slideControl.js/blob/master/demo.html).
Use either _step-wise slider options and API_ or _current relative position option and relative position API_ - do not try to use both on the same slide control.
Put the slide control into a container. Set position, width and background image of the slide control by setting the according css on the container.

### Initialization Options

* `currentRelativePosition` (default 0)
* `steps` (default `undefinded`)
* `currentStep` (default 0)
* `onStart` (default `function() {}`)
* `onChanged` (default `function() {}`)
* `onTargetSnapPositionChanged` (default `function() {}`)
* `onComplete` (default `function() {}`)

### API

#### `slideToStep`(`Number`)

Only argument should be an integer (starting from 0).

#### `slideToRelativePosition`(`Number`)

Only argument should be a float between 0 (slide left) and 1 (slide right).

### License

WTFPL License ([http://wtfpl.org/](http://wtfpl.org/))

Copyright © 2013 Boris Diakur
