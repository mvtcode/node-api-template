var conn = new Mongo('localhost:27017');
var db = conn.getDB("test");

// index db
db.users.ensureIndex({username: 1}, {unique: true, name: 'username_unique'});
db.users.ensureIndex({email: 1}, {unique: true, name: 'email_unique'});
db.users.ensureIndex({mobile: 1}, {unique: true, name: 'mobile_unique'});
db.users.ensureIndex({role: 1});

db.group_chat_members.createIndex({group_id: 1});
db.group_chat_members.createIndex({user_id: 1});

db.group_chat_messages.createIndex({group_id: 1, created_at: -1});

db.group_chat_message_reads.createIndex({group_id: 1, user_at: 1});

db.messages.createIndex({group_id: 1, created_at: -1});

// insert db
db.users.insert({
	email: 'macvantan@gmail.com',
	password: '2fbed7b7f0818fed2534ac41b7a9614ac277a63dae680d2632fe742d16baee63', // 123456
	name: 'admin',
	mobile: '0964335688',
	role: 'ADMIN',
	status: 'ACTIVATED',
	created_at: new Date(),
	updated_at: new Date()
});
