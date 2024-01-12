import { DataVase } from './dist/index.js';

const dataVase = new DataVase();

// Test insert
const collectionInsert = 'testCollection';
const dataInsert = { name: 'John Doe', age: 30 };
const idGen = dataVase._IDGen = async () => '123';
const resultInsert = await dataVase.insert(collectionInsert, dataInsert);

if (
  idGen() === '123' &&
  resultInsert.success === true &&
  resultInsert.changed === 1 &&
  resultInsert.result._ID === '123'
) {
  console.log('✅ Insert test passed.');
} else {
  console.error('❎ Insert test failed.');
}

// Test retrieve
const collectionRetrieve = 'testCollection';
const idRetrieve = '123';
const documentRetrieve = { _ID: idRetrieve, name: 'John Doe', age: 30 };
const resultRetrieve = await dataVase.retrieve(collectionRetrieve, idRetrieve);

if (
  resultRetrieve.success === true &&
  resultRetrieve.changed === 0 &&
  JSON.stringify(resultRetrieve.result) === JSON.stringify(documentRetrieve)
) {
  console.log('✅ Retrieve test passed.');
} else {
  console.error('❎ Retrieve test failed.');
}