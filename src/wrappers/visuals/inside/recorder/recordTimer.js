var PausableTimer = require('./../../../../util/timers/pausable')

module.exports = function(visuals, recordNote, options) {

    var recordTimerElement,

        nearComputed    = false,
        endNighComputed = false,

        pausableTimer,
        countdown

    function pad(n) {
        return n < 10 ? '0' + n : n
    }

    function thresholdReached(secs, threshold) {
        return secs >= options.video.limitSeconds * threshold
    }

    function isNear(secs) {
        if (!nearComputed && thresholdReached(secs, .6)) {
            nearComputed = true
            return true
        } else
            return false
    }

    function endIsNigh(secs) {
        if (!endNighComputed && thresholdReached(secs, .8)) {
            endNighComputed = true
            return true
        } else
            return false
    }

    function setNear() {
        recordTimerElement.classList.add('near')
    }

    function setNigh() {
        recordTimerElement.classList.add('nigh')
    }

    function update(cb) {
        // stop any existing ones first
        pausableTimer && pausableTimer.stop()

        var mins = parseInt(countdown / 60, 10),
            secs = countdown - mins * 60

        if (!nearComputed || !endNighComputed) {
            var remainingSeconds = options.video.limitSeconds - countdown

            if (isNear(remainingSeconds)) {

                recordNote.setNear()
                setNear()

                options.debug('End is near, ' + countdown + ' seconds to go')

            } else if (endIsNigh(remainingSeconds)) {

                recordNote.setNigh()
                setNigh()

                options.debug('End is nigh, ' + countdown + ' seconds to go')
            }
        }

        recordTimerElement.innerHTML = mins + ':' + pad(secs)

        // do not use 1000 but few milliseconds less due to CPU usage
        pausableTimer = new PausableTimer(980, function() {
            countdown--

            if (countdown < 0)
                cb()
            else
                update(cb)
        })
    }

    function hide() {
        recordTimerElement.classList.add('hide')
    }

    function show() {
        recordTimerElement.classList.remove('hide')
    }

    this.start = function(cb) {
        countdown    = options.video.limitSeconds
        nearComputed = endNighComputed = false

        show()
        recordNote.show()

        update(cb)
    }

    this.pause = function() {
        pausableTimer.pause()
        recordNote.hide()
    }

    this.resume = function() {
        pausableTimer.resume()
        recordNote.show()
    }

    this.stop = function() {
        hide()
        pausableTimer.stop()
        recordNote.stop()
    }

    this.build = function() {
        recordTimerElement = visuals.querySelector('.recordTimer')

        if (!recordTimerElement) {
            recordTimerElement = document.createElement('p')
            recordTimerElement.classList.add('recordTimer')

            hide()

            visuals.appendChild(recordTimerElement)
        } else
            hide()
    }
}