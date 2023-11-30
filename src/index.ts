import fs from "fs/promises"
import path from "path"

type DataVaseRes = {
    success: boolean,
    changed: number,
    result: undefined | object,
}

class DataVase {
    private _DVase: {[index: string]:any}
    private _TTL: number
    private _BACKUP: string
    constructor() {
        this._DVase = new Object()
        this._TTL = 5000
        this._BACKUP = "./archives"
    }

    set TTL(data: number) {
        this._TTL = data
    }

    set BackupDir(data: string) {
        this._BACKUP = data
    }

    insert(collection: string, data: object){
        return this._insert(collection,data)
    }

    private async _archive(collection: string, ID: number) {
        await fs.writeFile(`${this._BACKUP}/${collection}.${ID}.archive.json`, JSON.stringify(this._DVase[collection][ID])).finally(()=>{
            this._DVase[collection][ID] = undefined
        })

    }

    private async _insert(collection: string, data: object): Promise<DataVaseRes> {
        let ID = Date.now() + this._TTL
        if(!this._DVase[collection]) this._DVase[collection] = {}
        this._DVase[collection][ID] = data
        return await new Promise(async (resolve, reject) => {
            if (this._DVase[collection][ID] == data) {

                resolve({ success: true, changed: 1, result:{} })
                setTimeout(async () => await this._archive(collection, ID), this._TTL)
            } else {
                resolve({ success: false, changed: 0, result:{} })
            }
        })
    }

}