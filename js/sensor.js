(function($) {
	var ResizeSensor = function($container, options, callback) {
		this.defaults = {
			onlyWidth: false
		};

		this.options = $.extend({}, this.defaults, options);

		this.$expand      = null;
		this.$shrink      = null;
		this.$expandChild = null;
		this.$shrinkChild = null;

		this.lastWidth = 0;
		this.lastHeight = 0; 

		this.resetSensorStyles = function() {
			this.$expandChild.css('width', this.$expand.width() + 10 + 'px');
			this.$expandChild.css('height', this.$expand.height() + 10 + 'px');

			this.$expand.scrollLeft(this.$expand.innerWidth());
			this.$expand.scrollTop(this.$expand.innerHeight());

			this.$shrink.scrollLeft(this.$shrink.innerWidth());
			this.$shrink.scrollTop(this.$shrink.innerHeight());

			this.lastWidth  = $container.width();
			this.lastHeight = $container.height();

		};

		this.addChildStyles = function($div) {
			$div.css('position', 'absolute');
			$div.css('left', 0);
			$div.css('top', 0);
		};

		this.addContainerStyles = function($div) {
			this.addChildStyles($div);

			$div.css('right', 0);
			$div.css('bottom', 0);
			$div.css('overflow', 'hidden');
			$div.css('z-index', -1);
			$div.css('visibility', 'hidden');
		};

		this.createSensorDivs = function() {
			var $sensor          = $(document.createElement('div'));
			var $sensorContainer = $(document.createElement('div'));
			var $expand          = $(document.createElement('div'));
			var $shrink          = $(document.createElement('div'));
			var $expandChild     = $(document.createElement('div'));
			var $shrinkChild     = $(document.createElement('div'));

			this.addContainerStyles($sensor);
			this.addContainerStyles($expand);
			this.addContainerStyles($shrink);
			this.addChildStyles($expandChild);
			this.addChildStyles($shrinkChild);

			$shrinkChild.css('width', '200%');
			$shrinkChild.css('height', '200%');

			$sensor.addClass('resize-sensor');

			$expand.append($expandChild);
			$shrink.append($shrinkChild);

			$sensor.append($expand);
			$sensor.append($shrink);

			$sensorContainer.append($sensor);

			var sensorHeight = '100%';

			if ( this.options.onlyWidth === true ) {
				sensorHeight = '5px';
			}

			$sensorContainer.css('width', '100%');
			$sensorContainer.css('height', sensorHeight);
			$sensorContainer.css('position', 'relative');
			$sensorContainer.css('visibility', 'hidden');

			$container.append($sensorContainer);

			var timer = null;

			$expand.on('scroll', $.proxy(function() {
				if ( ($container.width() > this.lastWidth) || ($container.height() > this.lastHeight) ) {
					this.changed();
					this.resetSensorStyles();
				}
			}, this));

			$shrink.on('scroll', $.proxy(function() {
				if ( ($container.width() < this.lastWidth) || ($container.height() < this.lastHeight) ) {
					this.changed();
					this.resetSensorStyles();
				}
			}, this));

			this.$expand      = $expand;
			this.$expandChild = $expandChild;
			this.$shrink      = $shrink;
			this.$shrinkChild = $shrinkChild;
			this.$sensor      = $sensor;

			this.resetSensorStyles();
		};

		this.changed = function() {
			$container.trigger('sresize', [
				$container.width(),
				$container.height(),
				$container.outerWidth(),
				$container.outerHeight()
			]);
		};

		this.createSensorDivs();
	};

	$.fn.resizeSensor = function(options, callback) {
		this.each(function() {
			var sensor = new ResizeSensor($(this), options, callback);
			$(this).data('sensor', sensor);
		});
	};
})(jQuery);
