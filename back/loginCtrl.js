const Mongodb = require('./mongo');

class LoginCtrl {
    static signUp(db_name, collection, doc) {
        return Mongodb.isExist(db_name, collection, {'email': doc['email']})
        .then((res) => {
            if(res.payload) throw 400;
            else return Mongodb.insert(db_name, collection, doc);
        })
        .catch((err) => {
            let res = {code: err};
            switch(err) {
                case 400: res.payload = 'sign up error: id already exist'; break;
                default: res.payload = err.payload;
            }
            return res;
        })
    }
    static signIn(db, collection, doc, session) {
        return Mongodb.find(db, collection, {'email': doc['email']})
        .then((res) => {
            if(res.payload.length == 0) throw 400;
            if(res.payload[0]['password'] != doc['password']) throw 401;
            session.email = res.payload[0]['email'];
            return {code: 200, payload: res.payload[0]['email']};
        })
        .catch((err) => {
            let res = {code: err};
            switch(err) {
                case 400: res.payload = 'sign in error : id does not exist'; break;
                case 401: res.payload = 'sign in error : password does not match'; break;
                default: res.payload = err.payload;
            }
            return res;
        })
    }
    static signSecede(db, collection, doc, session) {
        return this.signOut(session)
        .then(()=>Mongodb.delete(db, collection, doc));
    }

    static signCheck(session) {
        return new Promise((resolve) => {
            resolve(session.email);
        });
    }
    static signOut(session) {
        return new Promise((resolve) => {
            resolve(session.email);
            delete session.email;
        });
    }
}

module.exports = LoginCtrl;