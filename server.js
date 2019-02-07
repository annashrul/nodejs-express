var express     = require('express');
var mysql       = require('mysql');
var app         = express();
var bodyParser  = require('body-parser');



/*
** Parse All Form Data
*/
app.use(bodyParser.urlencoded({ extended : true }));

/*
** Used For Formatting Dates
*/
var dateFormat = require('dateformat');
var now = new Date();

/*
** Template Parsing Using ejd Types
*/
app.set('view engine','ejs');

/*
** Import All Releated Javascript and CSS Files to Inject in our App
*/
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/tether/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));


/*
** Connect To Mysql
*/
const con = mysql.createConnection({
  host      : "localhost",
  user      : "root",
  password  : "",
  database  : "db_masjid"
});

/*
** Global Site Title and base url
*/
const siteTitle = "MyApp NodeJS";
const baseURL   = "http://localhost:4000/";


/*
** Connect To Server
*/
var server = app.listen(4000, function () {
  console.log('Server listening at port 3000');
});


app.get('/',function (req, res) {
  con.query("SELECT * FROM kel_assets",function (err,result) {
    res.render('pages/index',{
      siteTitle : siteTitle,
	    pageTitle : "List Kelompok Assets",
      items     : result
    });
  });
});

app.get('/event/add',function (req, res) {
	res.render('pages/add-kel-assets.ejs',{
		siteTitle : siteTitle,
		pageTitle : "Add Jamaah"
	});
});

app.post('/event/add',function (req, res) {
	var query = "INSERT INTO `kel_assets` (`nama_kel_assets`, `keterangan`) VALUES (";
    query += " '"+req.body.nama_kel_assets+"',";
    query += " '"+req.body.keterangan+"')";
    
    con.query(query,function (err, result) {
      res.redirect(baseURL);
    })
});

app.get('/event/edit/:id_kel_assets',function (req, res) {
  con.query("SELECT * FROM kel_assets WHERE id_kel_assets = '"+req.params.id_kel_assets+"'", function (err, result) {
	  res.render('pages/edit',{
		  siteTitle : siteTitle,
		  pageTitle : "Edit Kelompok Assets ( " + result[0].nama_kel_assets+ " )",
		  items     : result
	  });
  })
});

app.post('/event/update',function (req, res) {
	var query = "UPDATE `kel_assets` SET `nama_kel_assets` = '"+req.body.nama_kel_assets+"', `keterangan` = '"+req.body.keterangan+"' WHERE `kel_assets`.`id_kel_assets` = '"+req.body.id_kel_assets+"' ";
	con.query(query,function (err, result) {
		if(result.affectedRows) {
			res.redirect(baseURL);
		}
	})
});

app.get('/event/delete/:id_kel_assets',function (req,res) {
	con.query("DELETE FROM kel_assets WHERE id_kel_assets = '"+req.params.id_kel_assets+"'", function (err, result) {
		if(result.affectedRows){
			res.redirect(baseURL);
		}
	})
});


