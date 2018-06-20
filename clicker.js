let clicker = {
	clickerId: 0,
	repeterId: 0,
	nextThingToBuy: undefined,

	start: function(){
		this.clickerId = setInterval(() => {document.getElementById("bigCookie").click()}, 1)
		this.repeaterId = setInterval(() => {
			this.buy()

			let shimmers = document.querySelector(".shimmers");
				if(shimmers) shimmers.click()
		}, 1000)
	},

	stop: function(){
		clearInterval(this.clickerId)
		clearInterval(this.repeaterId)
	},

	buy: function(){
		switch(this.nextThingToBuy){
			case undefined:
					this.decideWhatToBuy()
					break;
			case "---upgrade---":
				if(Game.cookies > this.getNextUpgradePrice()){
					this.buyNextUpgrade()
					console.info("Bought upgrade: " + this.getNextUpgradeName())
					this.nextThingToBuy = undefined
				}
				break;

			default:
				if(Game.cookies > this.getProductPrice(this.nextThingToBuy)){
					this.buyProduct(this.nextThingToBuy)
					console.info("Bought product: " + this.getProductName(this.nextThingToBuy))
					this.nextThingToBuy = undefined
				}
		}
	},

	decideWhatToBuy: function(){
			let product = this.chooseBestProductToBuy()
			let upgradePrice = this.getNextUpgradePrice()

			if (upgradePrice < this.getProductPrice(product)){
				this.nextThingToBuy = "---upgrade---"
				console.info("Collecting money to buy upgrade: " + this.getNextUpgradeName())
			} else {
				this.nextThingToBuy = product
				console.info("Collecting money to buy product " + this.getProductName(product))
			}
	},

	chooseBestProductToBuy: function(){
		let bestItem = 0
		let bestItemValue = 0 // value = CPS / price

		for (i = 0; i < this.getProductsCount(); i++){
			let value = this.getProductCPS(i) / this.getProductPrice(i)

			if(value > bestItemValue){
				bestItemValue = value
				bestItem = i
			}
		}

		return bestItem
	},

	buyProduct: function(productId){
		let product = document.getElementById("product"+productId);
		if(product) product.click();
	},

	getProductsCount: function(){
		return document.querySelectorAll(".product").length
	},

	getProductPrice: function(productId){
		return Game.ObjectsById[productId].locked ? Infinity : Game.ObjectsById[productId].price
	},

	getProductCPS: function(productId){
		return Game.ObjectsById[productId].storedCps
	},

	getProductName: function(productId){
		return Game.ObjectsById[productId].name
	},

	getNextUpgradePrice(){
		return Game.UpgradesInStore[0].getPrice()
	},

	getNextUpgradeName(){
		return Game.UpgradesInStore[0].name
	},

	buyNextUpgrade(){
		Game.UpgradesInStore[0].buy()
	}
}
