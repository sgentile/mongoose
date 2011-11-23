var express = require('express'),
 mongoose = require('mongoose'),
	Schema = mongoose.Schema;
app = module.exports = express.createServer();

app.configure(function(){
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(app.router);
});

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

app.get("/", function(req, res){
	
	var draft = 'draft';
	Post.byState(draft, function(err, posts){
		res.json(posts);
	});
	
	//res.json({"name":"Steve"});
});
app.post('/', function(req, res){
	var post2 = new Post();
	post2.title = req.body.title;
	post2.body = req.body.body;
	
	post2.save(function(err){
		if(err){throw err;}
	});
	
	console.log(req.body);
  	res.send(req.body);
});

app.listen(3000);