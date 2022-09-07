import dotenv from 'dotenv'
dotenv.config()
import ora from 'ora'
import { request} from 'https';
const API_KEY = process.env.API_KEY
import { Command } from 'commander';

import {getPerson, getPersons} from './requests.js'

const program = new Command();


program
  .name('Node CLI Project Assembler')
  .description('In this project we will use the command line to execute call to a third party API (moviesDB) and fetch relevant information.')
  .version('1.0.0');

  program.command('get-persons')
  .description('Make a network request to fetch the most popular persons')
  .argument('<page>', 'select page number to show persons')
  .requiredOption('--popular , -p', 'Fetch the popular persons')
  .requiredOption('--page', 'The page of persons data results to fetch')
  .action((page, options, command) => {

    const url = `https://api.themoviedb.org/3/person/popular?api_key=${API_KEY}&language=en-US&page=${page}`
    const spinner = ora(`Fetching the popular person's data...`).start()

 
    request(url, res => {
      let data = []
      
      res.on('data', chunk => {
        data.push(chunk)
        
      })
  
      res.on('end', () => {
        const obj = JSON.parse(Buffer.concat(data).toString())



        setTimeout(() => {
          getPersons(obj)
          spinner.succeed('data loded')


        }, 1000);

      })

      res.on('error', error => {
        ora.fail(error)
        return
      })
    
    }).end()



  })





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



  program.parse(process.argv);
