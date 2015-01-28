var util         = require('util'),
    EventEmitter = require('events').EventEmitter

var VideomailEventEmitter = function(options, name) {

    if (options.debug) {

        if (!this.originalEmit)
            this.originalEmit = this.emit

        this.emit = function(event) {

            if (event != 'removeListener' && event != 'newListener')
                options.debug('%s emits: %s', name, event)

            var args = [].splice.call(arguments, 0)
            return this.originalEmit.apply(this, args)
        }
    }
}

util.inherits(VideomailEventEmitter, EventEmitter)

module.exports = VideomailEventEmitter