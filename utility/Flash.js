class Flash {
    constractor(req) {
        this.req = req
        this.success = this.extractFlashMessage('success')
        this.failed = this.extractFlashMessage('failed')
    }

    extractFlashMessage(name) {
        let message = this.req.flash(name)
        return message.length > 0 ? message[0] : false
    }

    hasMessage() {
        return !this.success && !this.failed ? false : true
    }

    static getMessage(req) {
        let flash = new Flash(req)
        return {
            success : flash.success,
            failed : flash.failed,
            hasMessage : flash.hasMessage()
        }
    }
}

module.exports = Flash