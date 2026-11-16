async function applySummonerStartHP(summonerCards, index) {
    if (!summonerCards) return
    const cardData = functions.getCardData(summonerCards)
    const hp = 8
    await functions.changeCounterValue(index, hp)
}

// Set player counters selon Summoner
// Set gold et ether selon ordre de tour
async function ini() {
    let summoner1 = cards?.Summoner1?.[0]
    let summoner2 = cards?.Summoner2?.[0]

    await applySummonerStartHP(summoner1, 0)
    await applySummonerStartHP(summoner2, 1)

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
    await functions.draw(2)
    game.data.Manager.gold += 1
    game.data.Restauration.show = false
}

async function draw1() {
    await functions.draw(1)
    game.data.Manager.gold += 2
    game.data.Restauration.show = false
}