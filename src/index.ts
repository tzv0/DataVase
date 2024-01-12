import { existsSync } from "fs"
import fs from "fs/promises"
import path from "path"

type DocumentRecord = { _ID: string | undefined, [index: string]: any }
type DataVaseRes = {
    success: boolean,
    changed: number,
    result: DocumentRecord | undefined,
}

class DataVase {
    private _TTL: number
    private _BACKUP: string
    constructor() {
        this._TTL = 5000
        this._BACKUP = "./archives"
    }

    set TTL(data: number) {
        this._TTL = data
    }

    set BackupDir(data: string) {
        this._BACKUP = data
    }

    insert(collection: string, data: object, ID?:string) {
        return this._insert(collection, data, ID)
    }

    retrieve(collection: string, ID: string) {
        return this._get(collection, ID)
    }

    private async _IDGen(): Promise<string> {
        return new Promise((resolve) => {
            const epoch = 946688400;
            const timestamp = Date.now() / epoch;
            const uniqueId = Math.floor(Math.random() * 1024);
            const snowflakeId = (timestamp << 10) | uniqueId;
            resolve(snowflakeId.toString());
        });
    }

    private async _insert(collection: string, data: object, ID_: string | undefined): Promise<DataVaseRes> {
        if(!existsSync(this._BACKUP)){
            fs.mkdir(this._BACKUP)
        }
        let ID = ID_ != undefined ? ID_! : await this._IDGen()
        let h

        return await new Promise(async (resolve, reject) => {
            h = await fs.writeFile(`${this._BACKUP}/${collection}.${ID}.archive.json`, JSON.stringify(data)).catch(e=>{
                reject({ success: false, changed: 0, result: {} })
            })
            resolve({ success: true, changed: 1, result: { _ID: ID } })
        })
    }

    private async _get(collection: string, ID: string): Promise<DataVaseRes> {
        return await new Promise(async (resolve, reject) => {
            try {
                let hs = await fs.readFile(`${this._BACKUP}/${collection}.${ID}.archive.json`).catch(e=>{
                    reject({ success: false, changed: 0, result: {} })
                })
                let document: DocumentRecord = JSON.parse(hs!.toString())
                resolve({ success: true, changed: 0, result: document })
            } catch (e) {
                reject({ success: false, changed: 0, result: {} })
            }
        })
    }
}

export {DataVase}