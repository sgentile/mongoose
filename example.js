var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var CommentSchema = new Schema({
	email: String,
	body: String
});

var PostSchema = new Schema({
	title: {type:String, required:true},
	body: String,
	//date: Date
	date: {type: Date, default: Date.now},
	state: {type: String, enum:['draft', 'published', 'private'], default:'draft'},
	author:{
		name: String,
		email: {
			type: String
			//required:true,
			//unique: true
		}
	},
	comments: [CommentSchema]
});

PostSchema.static('recent', function(callback){
	this.find({date: {$gte: Date.now() + 1000 * 60 * 60 *24}}, callback); //24 hours
});
PostSchema.static('published', function(callback){
	this.find({state:'published'}, callback);
});
PostSchema.static('byState', function(state, callback){
	this.find({state:state}, callback);
});

//virtual
PostSchema.virtual('shortBody').get(function(){
	return this.body.substring(0, 10) + "...";
});

mongoose.connect('mongodb://localhost/mydatabase');
mongoose.model('Post', PostSchema);
mongoose.model('Comment', CommentSchema);

var Post = mongoose.model('Post')
var Comment = mongoose.model('Comment');

var post = new Post();
post.title = "new post 3";
post.body = "sample post 3";
//post.date= Date.now();
post.state = 'published';

//post.author = {
//	name: "Steve",
//	email: "yo@yo.com"
//}
//or nested:
//post.author.name = ""
//post.author.email = ""

post.comments.push({email:"lalala@la.com", body:"what a great post!"});


var comment = new Comment();
comment.email = "foo@bar.com";
comment.body = "this is the contents";

post.comments.push(comment);


var post2 = new Post();
post2.title = "new post2";
post2.body = "posts with different state";

post2.save(function(err){
	if(err){throw err;}
	console.log('post2 saved');
});

post.save(function(err){
	if(err){
		throw err;
	}
	console.log('saved');
	
	//lookup records
	//Post.find({state:'published'}, function(err, posts){
	//	posts.forEach(function(aPost){
	//		console.log(aPost);
	//	})
	//});
	
	//using static methods defined above
	Post.published(function(err, posts){
		console.log("published posts:")
		posts.forEach(function(aPost){
			console.log(aPost.title + " : " + aPost.state + ' on ' + aPost.date);
		});
		console.log("---")
	});
	
	var draft = 'draft';
	Post.byState(draft, function(err, posts){
		console.log("published posts in state of " + draft);
		posts.forEach(function(aPost){
			console.log(aPost.title + " : " + aPost.state + ' on ' + aPost.date);
			console.log('body (using virtual getter): ' + aPost.shortBody);
		});
		console.log("---")
	});
	
	Post.recent(function(err, posts){
		console.log('recent posts:')
		posts.forEach(function(aPost){
			console.log(aPost.state + ' on ' + aPost.date);
		});
		console.log("---")
	});
	
	mongoose.disconnect();
});