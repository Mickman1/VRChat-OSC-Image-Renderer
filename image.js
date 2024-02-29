(async function Main() {

const args = process.argv.slice(2)

const { Client, Server } = require('node-osc')
var PNG = require('png-js')

const client = new Client('127.0.0.1', 9000)

var oscServer = new Server(9001, '127.0.0.1', () => {
	console.log('OSC Server online')

	PNG.decode(`./img/${args[0]}.png`, async function(pixels) {
		let waitTimeMs = args[1]
		let pixelCounter = 0

		// pixels is a 1d array (in rgba order) of decoded pixel data
		console.log(`RGBA Length: ${pixels.length}`)

		let width = Math.sqrt(pixels.length / 4)
		let height = width

		client.send('/avatar/parameters/PaintEnabled', true)
		client.send('/avatar/parameters/ParticlesToggle', true)
		
		client.send('/avatar/parameters/ColorR', 0.0)
		client.send('/avatar/parameters/ColorG', 0.0)
		client.send('/avatar/parameters/ColorB', 0.0)
		client.send('/avatar/parameters/ColorA', 0.0)

		// Don't send repeat colors over OSC
		let previousColorR = 0.0
		let previousColorG = 0.0
		let previousColorB = 0.0
		let previousColorA = 0.0

		for (y = 0; y < height; y++) {
			let posY = 1 - (y / (height - 1))
			// Avoid Division by Zero
			if (posY === 0)
				posY = 0.00000001

			client.send('/avatar/parameters/PosY', posY)

			for (let x = 0; x < width; x++) {
				let posX = x / (width - 1)
				// Avoid Division by Zero / NaN
				if (posX === 0)
					posX = 0.00000001

				let colorR = (pixels[pixelCounter] / 255) + 0.0001
				let colorG = (pixels[pixelCounter + 1] / 255) + 0.0001
				let colorB = (pixels[pixelCounter + 2] / 255) + 0.0001
				let colorA = (pixels[pixelCounter + 3] / 255) + 0.0001
				
				client.send('/avatar/parameters/PosX', posX)

				if (colorR !== previousColorR) {
					client.send('/avatar/parameters/ColorR', colorR)
					previousColorR = colorR
				}
				if (colorG !== previousColorG) {
					client.send('/avatar/parameters/ColorG', colorG)
					previousColorG = colorG
				}
				if (colorB !== previousColorB) {
					client.send('/avatar/parameters/ColorB', colorB)
					previousColorB = colorB
				}
				if (colorA !== previousColorA) {
					client.send('/avatar/parameters/ColorA', colorA)
					previousColorA = colorA
				}

				await wait(waitTimeMs)

				pixelCounter += 4
			}

			y += 1
			posY = 1 - (y / (height - 1))
			client.send('/avatar/parameters/PosY', posY)

			pixelCounter += (width * 8)

			if (pixelCounter >= pixels.length) {
				continue
			}

			for (let x = width - 1; x >= 0; x--) {
				let posX = x / (width - 1)
				// Avoid Division by Zero
				if (posX === 0)
					posX = 0.00000001

				let colorR = (pixels[pixelCounter] / 255) + 0.0001
				let colorG = (pixels[pixelCounter + 1] / 255) + 0.0001
				let colorB = (pixels[pixelCounter + 2] / 255) + 0.0001
				let colorA = (pixels[pixelCounter + 3] / 255) + 0.0001
				
				client.send('/avatar/parameters/PosX', posX)

				if (colorR !== previousColorR) {
					client.send('/avatar/parameters/ColorR', colorR)
					previousColorR = colorR
				}
				if (colorG !== previousColorG) {
					client.send('/avatar/parameters/ColorG', colorG)
					previousColorG = colorG
				}
				if (colorB !== previousColorB) {
					client.send('/avatar/parameters/ColorB', colorB)
					previousColorB = colorB
				}
				if (colorA !== previousColorA) {
					client.send('/avatar/parameters/ColorA', colorA)
					previousColorA = colorA
				}
				
				await wait(waitTimeMs)

				pixelCounter -= 4
			}
		}
		
		await wait(100)
		client.send('/avatar/parameters/ParticlesToggle', false)
		await wait(100)

		process.exit()
	})
})

oscServer.on('message', function (msg) {
})

})()

function wait(ms) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(ms)
		}, ms )
	})
}
