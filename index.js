var fs = require("fs")
var path = require("path")
const { Snowflake } = require('@sapphire/snowflake');

module.exports = class Gliph {
    constructor(name) {
        this.db = name
        this.tableName = ""
        this.dbPath = path.join(__dirname, this.db)
        this.tablePath;

        if (!fs.existsSync(this.dbPath)) fs.mkdirSync(this.dbPath)
    }

    table(name) {
        if (name == "" || name.match(/\W|\n/gi) != null) return { success: false, string: "Error: Whitespaces are not allowed within table name." }

        this.tableName = name
        this.tablePath = path.join(this.dbPath, this.tableName)
        if (!fs.existsSync(this.tablePath)) fs.mkdirSync(this.tablePath)

        return { success: true, object: { path: this.tablePath } }
    }

    insert(data) {
        if (this.tableName == "") return { success: false, string: "Error: The table has not been defined." }
        let time = new Date('2000-01-01T00:00:00.000Z')
        let id = new Snowflake(time).generate().toString(10)
        let docPath = path.join(this.tablePath, id)
        if (typeof data == "string") {
            try {
                data = JSON.parse(data)
            } catch {
                return { success: false, string: "Error: Data needs to be an object" }
            }
        }
        data.id = id
        let file = fs.writeFileSync(docPath, JSON.stringify(data))
        file = ""

        return { success: true, object: { id: id, path: docPath } }
    }

    search(filter) {
        if (this.tableName == "") return { success: false, string: "Error: The table has not been defined." }
        if (typeof filter != "object") return { success: false, string: "Error: The filter object must be an object." }

        let docs = fs.readdirSync(this.tablePath)
        let returns = []
        for (let i = 0; i < docs.length; i++) {
            let file = JSON.parse(fs.readFileSync(path.join(this.tablePath, docs[i])))
            let filtered = Object.values(file).filter(() => {
                let matches = 0
                for (let key in filter) {
                    if (filter[key] == file[key]) {
                        matches++
                        if (matches == Object.keys(filter).length) {
                            return true
                        }
                    }

                }
            })
            if (filtered.length > 0) {
                let obj = {}
                let i = 0
                for(let key in file){
                    obj[key] = filtered[i]
                    i++
                }
                returns.push(obj)
            }
        }
        return {success:true, array:returns}
    }
}