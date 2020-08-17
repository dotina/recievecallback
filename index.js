const {get,post} = require('./netUtils');
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

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
    	res.send(400, 'include a valid body');
    }else if(!headers){
    	res.send(400, 'include a valid headers');
    }else if(!keyEndpoint){
    	res.send(400, 'missing destination endpoint in headers | check DB');
    }else{
    	post(keyEndpoint,body,{},null,null)
    	.then(response=>{
    		console.log('Incoming response : ', response.body);
    		if (response.statusCode != 200) {
    			res.status(response.statusCode).json({
	    			responsecode:response.statusCode,
	    			message: response.body,
	    			status:false
	    		})
    		}else{
	    		res.status(response.statusCode).json({
	    			responsecode:response.statusCode,
	    			message: response.body,
	    			status:true
	    		})
    		}
    	})
    	.catch(err=>{
    		console.log('Error : ', err);
    		res.status(500).json({
    			responsecode:500,
    			message:'service error',
    			err,
    			status:false
    		})
    	})
    }

  
});
app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));
