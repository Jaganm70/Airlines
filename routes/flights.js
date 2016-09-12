var express = require('express');
var router = express.Router();
var Store = require("jfs");
var db = new Store("data",{pretty:true});

/* GET users listing. */
router.get('/:id', function(req, res, next) {
	var date = req.query.date
	var obj = db.getSync("flight");
	var isRecordFound = false;
    	obj.flights.map(function(flight){
    		if(flight.id.toLowerCase()===(req.params.id).toLowerCase() && flight.departure_date === date){
    			isRecordFound = true;
    			res.send(flight);
    		}
    	});
    	if(!isRecordFound){
    		res.send({"message":"No Record Found"});
    	}
});

router.get('/book/search', function(req, res, next) {
	var date = req.query.date
	var from = req.query.from;
	var to = req.query.to;
	//var returndate = req.query.returndate;
	var obj = db.getSync("book-a-flight");
	var result = {
        "flights":[]
    };		
    	obj.flights.map(function(flight){
    		if(flight.departureairport.code === from && flight.arrivalairport.code === to &&
    			(flight.departuredate === date || flight.date === date)){
    			//flight.type = "going";
    			result.flights.push(flight);
    		} /*else if(flight.date === date && flight.departureairport.code === to && flight.arrivalairport.code === from){
               flight.type = "return";
               result.flights.push(flight);
    		}*/
    	});
    res.send(result);
    	
});

router.get('/instance/:id', function(req, res, next) {
	var obj = db.getSync("book-a-flight");
	var id = req.params.id
	
    	obj.flights.map(function(flight){
    		if(flight.id === id){
    		    res.send(flight);		
    		}
    	}); 	
});

router.post('/book/ticket', function(req, res, next) {
	var payload = req.body
	var obj = db.getSync("book-a-flight");
	
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for( var i=0; i < 4; i++ ){
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
  
	var result = null;
    var flights1 = obj.flights;
    var flights2 = obj.flights;
	  flights1.map(function(flight){
    		if(flight.UUID === payload.id){
                console.log('>>>1');
    			flight.bookingId = 'AL'+text;
    			flight.bookedclass = payload.category;
                result =null;
    		    result = flight;
    		}
    	});
      //if(typeof(payload.rid) !== 'undefined' && payload.rid &&  payload.rid !== "" && typeof(payload.rcategory) !== 'undefined'&& payload.rcategory && payload.rcategory !== ""){
      	flights2.map(function(flight1){
    		if(flight1.UUID === payload.rid){
                console.log('>>>2');
    			flight1.bookedclass = payload.rcategory;
                result.returnbooking =null;
    		    result.returnbooking = flight1;
    		}
    	});
      //}	
      
	  res.send(result);
});

router.post('/:modal', function(req, res, next){
	var modal = req.params.modal;
	var d = req.body;

	console.log(modal);
	db.saveSync(modal, d, function(err){
 	   console.log('Data stored succesfully.....');
	});
	res.send(db.getSync(modal));
});

module.exports = router;
