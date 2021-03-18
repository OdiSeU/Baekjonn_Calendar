const mongo = require('mongodb'); 

/**
 * MongoDB Control Module
 * Please set 'MongoDB.url'
 */
class MongoDB {
    /**
     * MongoDB 연결
     * @param {string} db_name 연결할 DB
     * @param {function} callback 연결 후 실행할 콜백 함수
     * @returns {Promise} callback 함수에서 return한 값
     */
    static connect(db_name, callback) {
        let connected;
        return this.client.connect(this.url)
        .then((db) => {
            console.log('mongodb connected');
            connected = db;
            let dbo = db.db(db_name);
            return callback(dbo);
        })
        .catch((err) => {
            console.log(err);
            if(!this.url) console.log("\n\n\nPlease set\nMongoDB.url = '...'\n\n\n");
            return {code: 300, payload: 'mongodb error'};
        })
        .then((data) => {
            connected.close();
            console.log('mongodb closed');
            if(data.code == 300) return data;
            else return {code: 200, payload: data};
        });
    }

    /**
     * document 삽입
     * @param {string} db_name 연결할 DB
     * @param {string} collection 연결할 Collection
     * @param {object|array} doc 삽입할 document 또는 document 배열
     * @return {object} 삽입된 document의 _id 배열
     */
    static insert(db_name, collection, doc) {
        if(typeof(doc) == 'object') doc = [doc];
        return this.connect(db_name, (dbo) => {
            return dbo.collection(collection).insertMany(doc)
            .then((res) => {
                console.log(res.insertedCount + ' document(s) inserted');
                return res.insertedIds;
            });
        });
    }

    /**
     * 원하는 document 검색
     * @param {string} db_name 연결할 DB
     * @param {string} collection 연결할 Collection
     * @param {object} query 찾는 document의 내용
     * @param {object} proj 원하는 document의 속성
     * @returns {array} 검색 결과값 배열
     */
    static find(db_name, collection, query={}, proj={}) {
        if(query.hasOwnProperty('_id')) query._id = mongo.ObjectID(query._id);
        proj = {projection: proj};

        return this.connect(db_name, (dbo) => {
            return dbo.collection(collection).find(query, proj).toArray()
            .then((res) => {
                console.log(res.length + ' document(s) found');
                return res;
            });
        });
    }

    /**
     * 원하는 document 존재 유무 확인
     * @param {string} db_name 연결할 DB
     * @param {string} collection 연결할 Collection
     * @param {object} query 찾는 document의 내용
     * @returns {bool} 존재하면 true, 없으면 false 반환
     */
    static isExist(db_name, collection, query={}) {
        return this.find(db_name, collection, query)
        .then((res) => {
            if(res.code == 200) {
                let result = res.payload.length ? true : false
                return {code: res.code, payload: result};
            }
            return res;
        });
    }

    /**
     * 원하는 document 삭제
     * @param {string} db_name 연결할 DB
     * @param {string} collection 연결할 Collection
     * @param {object} query 삭제하려는 document의 내용
     * @returns {object} 삭제한 document의 내용과 삭제된 document의 개수
     */
    static delete(db_name, collection, query={}) {
        if(query.hasOwnProperty('_id')) query._id = mongo.ObjectID(query._id);

        return this.connect(db_name, (dbo) => {
            return dbo.collection(collection).deleteMany(query)
            .then((res) => {
                console.log(res.deletedCount + ' document(s) deleted.');
                return {query: query, count: res.deletedCount};
            });
        });
    }

    /**
     * 원하는 document 갱신
     * @param {string} db_name 연결할 DB
     * @param {string} collection 연결할 Collection
     * @param {object} query 갱신하려는 document의 내용
     * @param {object} values 갱신하려는 document의 속성
     * @returns {object} 갱신한 document의 속성
     */
    static update(db_name, collection, query={}, values={}) {
        if(query.hasOwnProperty('_id')) query._id = mongo.ObjectID(query._id);
        values = {$set: values};
        return this.connect(db_name, (dbo) => {
            return dbo.collection(collection).updateMany(query, values)
            .then((res) => {
                console.log(res);
                console.log(`${res.matchedCount} document(s) found.`);
                console.log(`${res.upsertedCount} document(s) updated.`);
                return values['$set'];
            });
        });
    }
}

MongoDB.client = mongo.MongoClient;
module.exports = MongoDB;