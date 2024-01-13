## About
Datavase is meant not as a replacement for conventional databases but an alternative to using a database you have to setup when you want to mess around with a project idea.

# How to use

Install 

`npm i datavase`

Add to project

`import { DataVase } from 'datavase'`

## Documentation 

### `DataVase.insert(collection, data)`
Insert data into a collection

Outputs: `Promise { success:boolean, changed:number, results:object{_ID?:string} }`


### `DataVase.retrieve(collection, ID)`
Get a document

Outputs: `Promise { success:boolean, changed:number, results:object{_ID?:string} }`


### `DataVase.remove(collection, ID)`
Remove a document

Outputs: `Promise { success:boolean, changed:number, results:object{_ID?:string} }`