/* global Player Coin Lava Vec */
var Level = class Level {// eslint-disable-line no-unused-vars
  // ^^^ Just becuase we're hosting this in a different file so its actually used globally
  constructor (plan) {
    this.completeTime = parseInt(plan.replace(/\D/g, ''))
    let planNumbersRemoved = plan.replace(/\d+/g, '').slice(0, -3)
    let rows = planNumbersRemoved.trim().split('\n').map(l => [...l])
    for (let i = 0; i <= (rows.length - 2); i++) {
      rows[i].splice(-1, 1)
    }
    this.height = rows.length
    this.width = rows[0].length
    this.startActors = []

    this.rows = rows.map((row, y) => {
      return row.map((ch, x) => {
        let type = this.levelChars[ch]
        if (typeof type === 'string') return type
        this.startActors.push(
          type.create(new Vec(x, y), ch))
        return 'empty'
      })
    })
  }
}

Level.prototype.touches = function (pos, size, type) {
  let xStart = Math.floor(pos.x)
  let xEnd = Math.ceil(pos.x + size.x)
  let yStart = Math.floor(pos.y)
  let yEnd = Math.ceil(pos.y + size.y)

  for (let y = yStart; y < yEnd; y++) {
    for (let x = xStart; x < xEnd; x++) {
      let isOutside = x < 0 || x >= this.width ||
                y < 0 || y >= this.height
      let here = isOutside ? 'wall' : this.rows[y][x]
      if (here === type) return true
    }
  }
  return false
}

Level.prototype.levelChars = {
  '.': 'empty',
  '#': 'wall',
  '+': 'lava',
  '@': Player,
  'o': Coin,
  '=': Lava,
  '|': Lava,
  'v': Lava
}
