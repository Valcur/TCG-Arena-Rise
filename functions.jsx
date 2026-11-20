async function applySummonerStartHP(summonerCards, index) {
    if (!summonerCards) return
    const cardData = functions.getCardData(summonerCards)
    const hp = cardData?.hp ?? 0
    await functions.changeCounterValue(index, hp)
}

// Set player counters selon Summoner
// Set gold et ether selon ordre de tour
async function ini() {
    let summoner1 = cards?.Summoner1?.[0]
    let summoner2 = cards?.Summoner2?.[0]

    await applySummonerStartHP(summoner1, 0)
    await applySummonerStartHP(summoner2, 1)

    await functions.createCard("ALP-001", "Ether")
    await functions.createCard("ALP-002", "Stock")

    const myPlayOrder = game.turn.playOrder

    if (myPlayOrder === 0) {
        game.data.Manager.gold = 2
    } else {
        game.data.Manager.gold = 1
    }
}

async function onNewTurn() {
    if (game.turn.isMyTurn) {
        game.data.Restauration.show = true
    }
}

async function draw2() {
    await functions.chatLog("chose 2 cards and 1 coin")
    await functions.draw(2)
    game.data.Manager.gold += 1
    game.data.Restauration.show = false
}

async function draw1() {
     await functions.chatLog("chose 1 cards and 2 coins")
    await functions.draw(1)
    game.data.Manager.gold += 2
    game.data.Restauration.show = false
}

async function etherForDraw() {
    if (game.data.Manager.ether < 3) return
    await functions.draw(1)
    game.data.Manager.ether -= 3
    await functions.chatLog("spent 3 Ether to draw 1")
}

async function etherForGold() {
    if (game.data.Manager.ether < 3) return
    game.data.Manager.gold += 1
    game.data.Manager.ether -= 3
    await functions.chatLog("spent 3 Ether to add 1 to its Stock")
}

async function applyEtherChange(value, delta, deltaDisplay) {
    game.data.Manager.ether = Number(value)
    if (delta > 0) {
        functions.chatLog(`added ${delta} Ether`)
    } else if (delta < 0) {
        functions.chatLog(`removed ${Math.abs(delta)} Ether`)
    }
}

async function applyGoldChange(value, delta, deltaDisplay) {
    game.data.Manager.gold = Number(value)
    if (delta > 0) {
        functions.chatLog(`added ${delta} to its Stock`)
    } else if (delta < 0) {
        functions.chatLog(`removed ${Math.abs(delta)} from its Stock`)
    }
}

async function calcLevel(summoner) {
    const levelCards = cards?.["Level" + summoner]
    if (!levelCards) return
    game.data["LevelSummoner" + summoner].value = levelCards.length + 1
}

function tossCoin() {
    const isHeads = Math.random() < 0.5
    functions.chatLog(isHeads ? "play.logs.game.dice.heads" : "play.logs.game.dice.tails")
}