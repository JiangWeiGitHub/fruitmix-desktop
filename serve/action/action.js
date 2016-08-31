var actions = {
	loggedin(obj) {
		return {
			type: 'LOGGEDIN',
			obj: obj
		}
	},

	loginFailed() {
		return {
			type: 'REJECTED'
		}
	},

	loginoff() {
		return {
			type: 'LOGIN_OFF'
		}
	},

	setDevice(device) {
		return {
			type: 'SET_DEVICE',
			device: device
		}
	},

	setDeviceUsedRecently(ip) {
		return {
			type: 'SET_DEVICE_USED_RECENTLY',
			ip: ip
		}
	}
}

module.exports = actions;