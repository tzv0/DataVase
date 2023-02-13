var fs = require("fs")
var path = require("path")
const { Snowflake } = require('@sapphire/snowflake');

class Gliph {
    constructor(name) {
        this.db = name
        this.tableName = ""
        this.dbPath = path.join(__dirname, this.db)
        this.tablePath;

        if (!fs.existsSync(this.dbPath)) fs.mkdirSync(this.dbPath)
    }

    table(name) {
        if(name == "" || name.match(/\W|\n/gi) != null ) return {success:false, string:"Error: Whitespaces are not allowed within table name."}

        this.tableName = name
        this.tablePath = path.join(this.dbPath, this.tableName)
        if(!fs.existsSync(this.tablePath)) fs.mkdirSync(this.tablePath)
        
        return {success:true, object:{path:this.tablePath}}
    }

    insert(data){
        if(this.tableName == "") return {success:false, string:"Error: The table has not been defined."}
        let time = new Date('2000-01-01T00:00:00.000Z')
        let id = new Snowflake(time).generate().toString(10)
        let docPath = path.join(this.tablePath, id)
        if(typeof data == "string"){
            try{
                data = JSON.parse(data)
            } catch {
                return {success:false, string:"Error: Data needs to be an object"}
            }
        }
        data.id = id
        let file = fs.writeFileSync(docPath, JSON.stringify(data))
        file = ""

        return {success:true, object:{id:id, path:docPath}}
    }
}

var test = new Gliph("test")
var h = test.table("users")
console.log(h)
console.log(test.insert({username:"kiwiscripter", email:"ronin@protheroe.net"}))