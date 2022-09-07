
import dotenv from 'dotenv'
dotenv.config()
import ora from 'ora'
import { request} from 'https';
const API_KEY = process.env.API_KEY
import { Command } from 'commander';


const program = new Command();


program.command('get-person')
  .description('Make a network request to fetch the data of a single person')
  .argument('<id>', 'select id to show perosn')
  .requiredOption('--id , -i', 'The id of the person')
  .action(id => {
    const url = `https://api.themoviedb.org/3/person/${id}?api_key=${API_KEY}&language=en-US`

     const spinner = ora(`Fetching the popular person's data...`).start()

    request(url, res => {
      let data = ''

      res.on('data', chunk => {
        data += chunk
      })


      res.on('end', () => {
        const presonObj = JSON.parse(data)

      
      res.on('error', (error) => ora.fail(error))

        setTimeout(() => {
          getPerson(presonObj)
          spinner.succeed('data loded')


        }, 1000);
      })
    }).end()
  })



  program.parse();

