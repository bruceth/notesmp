import { wx } from 'miniprogram-api-typings'

//公共参数的封装
fetch = (config, bash) => {
	let defaultConfig = {
		v: "1.0",
		timestamp: new Date().getTime(),
		devId: 'h5',
		reqId: 'h5'
	}
	return new Promise((resolve, reject) => {
		config.params = Object.assign(config.params, defaultConfig)
		let postData = {
			method: config.method,
			params: config.params,
			v: config.v
		}
		wx.request({
			url: config.url,
			data: postData,
			method: 'POST',
			header: { 'content-type': 'application/json' },
			success: (res) => {
				// 响应业务分析成功活着失败
				if (res.data.code == 0) {
					resolve(res.data)
				} else {
					wx.showToast({
						title: res.data.message || '网络异常',
						icon: 'none',
						duration: 2000
					})
					reject(res.data.message)
				}
			},
			fail: (e) => {
				reject('网络出错')
			}

		})
	});
}
module.exports = fetch
