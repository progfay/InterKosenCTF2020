var fs = require('fs').promises

const calc = (list) => {
  const [first, ...rest] = list

  let ans = first.remain
  while (true) {
    if (rest.reduce((flag, { mod, remain }) => flag && (ans % mod === remain), true)) return ans
    ans += first.mod
  }
}

const main = async () => {
  const files = await fs.readdir('./streams')
  const map = {}

  for (const file of files) {
    // chr(secret[index-1]) % mod == remain
    const content = (await fs.readFile(`./streams/${file}`)).toString('utf-8')
    const match1 = /^GET \/search\.php\?keyword=&search_max=%28SELECT\+unicode%28substr%28secret%2C\+(\d+)%2C\+1%29%29\+FROM\+account\+WHERE\+name%3D%22admin%22%29\+%25\+(\d+) HTTP\/1\.1/m.exec(content)
    if (!match1) continue
    const [, index, mod] = match1

    const match2 = content.match(/\<th scope="row">\d+\<\/th>/g)
    const remain = match2 ? match2.length : 0

    if (!map[index]) map[index] = []

    map[index].push({ mod: parseInt(mod, 10), remain })
  }

  const entries = Object.entries(map)
  const flag = new Array(entries.length)
  for (const [key, value] of entries) {
    flag[parseInt(key, 10)] = String.fromCharCode(calc(value))
  }

  console.log(flag.join(''))
}

main()
