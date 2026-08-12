const DB_NAME = 'gamezone';
const DB_VERSION = 1;
let DB;

export default {

	async getDb() {
		return new Promise((resolve, reject) => {

			if(DB) { return resolve(DB); }
			console.log('OPENING DB', DB);
			let request = window.indexedDB.open(DB_NAME, DB_VERSION);

			request.onerror = e => {
				console.log('Error opening db', e);
				reject('Error');
			};

			request.onsuccess = e => {
				DB = e.target.result;
				console.log('success')
				resolve(DB);
			};

			request.onupgradeneeded = e => {
				console.log('onupgradeneeded');
				let db = e.target.result;
				db.createObjectStore("sales", { autoIncrement: true, keyPath:'id' });
				db.createObjectStore("online", { autoIncrement: false, keyPath:'id' });
				db.createObjectStore("user", { autoIncrement: false, keyPath:'id' });
				db.createObjectStore("salesUploaded", { autoIncrement: true, keyPath:'id' });
				db.createObjectStore("prizes", { autoIncrement: true, keyPath:'id' });
				db.createObjectStore("visits", { autoIncrement: true, keyPath:'id' });
				db.createObjectStore("config", { autoIncrement: false, keyPath:'id' });
			};
		});
	},
	async delete(object, type, all) {
		console.log(object)
		console.log(type)
		console.log(all)

		let db = await this.getDb();

		return new Promise(resolve => {

			let trans = db.transaction([type],'readwrite');


			let store = trans.objectStore(type);
			let key = object
			if (all) {
				store.clear();
			}else{
				store.delete(key);
			}
			trans.oncomplete = () => {
				resolve();
			};
		});
	},
	async get(type) {
		console.log(type)

		let db = await this.getDb();

		return new Promise(resolve => {

			let trans = db.transaction([type],'readonly');
			trans.oncomplete = () => {
				resolve(array);
			};

			let store = trans.objectStore(type);
			let array = [];

			store.openCursor().onsuccess = e => {
				let cursor = e.target.result;
				if (cursor) {
					array.push(cursor.value)
					cursor.continue();
				}
			};

		});
	},
	async save(object, type) {
		let db = await this.getDb();
		return new Promise(resolve => {

			let trans = db.transaction([type],'readwrite');

			let store = trans.objectStore(type);
			store.put(object);
			trans.oncomplete = () => {
				resolve();
			};
		});
	},
	async put(object, type) {

		let db = await this.getDb();

		return new Promise(resolve => {

			let trans = db.transaction([type],'readwrite');

			let store = trans.objectStore(type);
			store.put(object);
			trans.oncomplete = () => {
				resolve();
			};

		});

	}

}