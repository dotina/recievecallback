const fs = require('fs');
const {get,post} = require('./netUtils');
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3300;

app.use(cors());
// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.post('/recievecallback', async (req, res) => {
    // We will be coding here
    const body='body' in req ? req.body : null;
    const headers='headers' in req ? req.headers : null;
    const keyEndpoint = 'key-endpoint' in headers ? headers['key-endpoint'] : null;

    if (!body) {
    	fs.appendFileSync("./logs/error.log",JSON.stringify({message:'include a valid body',timestamp:new Date().toLocaleString()}));
    	res.status(400).json({responseCode:400,status:false,message: 'include a valid body'});
    }else if(!headers){
    	fs.appendFileSync("./logs/error.log",JSON.stringify({message:'include a valid headers',timestamp:new Date().toLocaleString()}));
    	res.status(400).json({responseCode:400,status:false,message: 'include a valid headers'});
    }else if(!keyEndpoint){
    	fs.appendFileSync("./logs/error.log",JSON.stringify({message:'missing destination endpoint in headers | check DB',timestamp:new Date().toLocaleString()}));
    	res.status(400).json({responseCode:400,status:false,message: 'missing destination endpoint in headers | check DB'});
    }else{
    	post(keyEndpoint,body,{},null,null)
    	.then(response=>{
    		console.log('Incoming response : ', response.body);
    		
    		if (response.statusCode != 200) {
    			fs.appendFileSync("./logs/error.log",JSON.stringify({...response.body,timestamp:new Date().toLocaleString()}));
    			res.status(response.statusCode).json({
	    			responseCode:response.statusCode,
	    			message: response.body,
	    			status:false
	    		})
    		}else{
    			fs.appendFileSync("./logs/response.log",JSON.stringify({...response.body,timestamp:new Date().toLocaleString()}));
	    		res.status(response.statusCode).json({
	    			responseCode:response.statusCode,
	    			message: response.body,
	    			status:true
	    		})
    		}
    	})
    	.catch(err=>{
    		console.log('Error : ', err);
    		fs.appendFileSync("./logs/error.log",JSON.stringify({err,timestamp:new Date().toLocaleString()}));
    		res.status(500).json({
    			responseCode:500,
    			message:'service error',
    			err,
    			status:false
    		})
    	})
    }

  
});
app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));
