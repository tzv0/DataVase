import { DataVase } from './dist/index.js';

const dataVase = new DataVase();

// Test insert
const collectionInsert = 'testCollection';
const dataInsert = { name: 'John Doe', age: 30};
const resultInsert = await dataVase.insert(collectionInsert, dataInsert, '123');

if (
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
const documentRetrieve = { name: 'John Doe', age: 30, _ID: idRetrieve };
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

// Test Delete
const collectionDelete = 'testCollection';
const idDelete = '123';
const documentDelete = {};
const resultDelete = await dataVase.remove(collectionDelete, idDelete);

if (
  resultDelete.success === true &&
  resultDelete.changed === 1 &&
  JSON.stringify(resultDelete.result) === JSON.stringify(documentDelete)
) {
  console.log('✅ Delete test passed.');
} else {
  console.error('❎ Delete test failed.');
}