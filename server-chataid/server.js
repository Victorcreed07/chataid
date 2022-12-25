import cors from 'cors'
import express from 'express'
import * as dotenv from 'dotenv'
import {Configuration,OpenAIApi} from 'openai'

dotenv.config();

const configuration = new Configuration({

	apiKey : process.env.SECRET_KEY
})


const openai = new OpenAIApi(configuration)

const app = express()

app.use(cors())
app.use(express.json())//allows json data from frontend

app.get('/',(req,res) => {

	res.status(200).send({
		message:"Hey man how r ya"
	})
})

app.post('/',async(req,res) => {

	try{

		const question = req.body.ask;

		const response = await openai.createCompletion({
		  model: "text-davinci-003",
		  prompt: `${question}`,
		  temperature: 0.1,
		  max_tokens: 3000,
		  top_p: 1,
		  frequency_penalty: 0.5,
		  presence_penalty: 0,
		  
		});

		res.status(200).send({ 
			bot: response.data.choices[0].text
		})

	}
	catch(error)
	{
		console.log(error)
		res.status(401).send(error)

	}
})


app.listen(5000,() => {

	console.log('Listening on port 5000')
})