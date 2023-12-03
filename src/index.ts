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
    private _DVase: { [index: string]: any }
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

    insert(collection: string, data: object) {
        return this._insert(collection, data, undefined)
    }

    retrieve(collection: string, ID: string) {
        return this._get(collection, ID)
    }

    private async _archive(collection: string, ID: string): Promise<void> {
        await fs.writeFile(`${this._BACKUP}/${collection}.${ID}.archive.json`, JSON.stringify(this._DVase[collection][ID])).finally(() => {
            this._DVase[collection][ID] = undefined
        })
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
        if (!this._DVase[collection]) this._DVase[collection] = {}
        let ID = ID_ != undefined ? ID_! : await this._IDGen()

        this._DVase[collection][ID] = data
        return await new Promise(async (resolve, reject) => {

            if (this._DVase[collection][ID] == data) {
                resolve({ success: true, changed: 1, result: { _ID: ID } })
                setTimeout(async () => await this._archive(collection, ID), this._TTL)
            } else {
                reject({ success: false, changed: 0, result: {} })
            }
        })
    }

    private async _get(collection: string, ID: string): Promise<DataVaseRes> {
        if (this._DVase[collection][ID]) {
            return await new Promise(async (resolve, reject) => {
                resolve({ success: true, changed: 0, result: this._DVase[collection][ID] })
                setTimeout(async () => await this._archive(collection, ID), this._TTL)
            })
        } else {
            return await new Promise(async (resolve, reject) => {
                try {
                    let document: DocumentRecord = JSON.parse((await fs.readFile(`${this._BACKUP}/${collection}.${ID}.archive.json`)).toString())
                    if ((await this._insert(collection, document, ID)).success) {
                        resolve({ success: true, changed: 0, result: document })
                        setTimeout(async () => await this._archive(collection, ID), this._TTL)
                    } else {
                        reject({ success: false, changed: 0, result: {} })
                    }
                } catch (e) {
                    reject({ success: false, changed: 0, result: {} })
                }
            })
        }
    }
}
