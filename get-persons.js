
import dotenv from 'dotenv'
dotenv.config()
import ora from 'ora'
import { request} from 'https';
const API_KEY = process.env.API_KEY
import { Command } from 'commander';

import chalk from 'chalk'


const program = new Command();



const getPersons =  (url) => {
  let arrayOfPersons;
  request(url, res => {
    let data = []
    
    res.on('data', chunk => {
      data.push(chunk)
      
    })

    res.on('end', () => {
      const obj = JSON.parse(Buffer.concat(data).toString())
      arrayOfPersons = obj.results
     
    })
  
  }).end()

}


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
        const arrayOfPersons = obj.results
        const currentPage = obj.page
        const totalPages = obj.total_pages

         // page number for pagination 

         const pageNumberMsg = currentPage <= 500 && chalk.white(`
         ---------------------------------------- \n 
         Page: ${currentPage} of: ${totalPages}
         `)   
          console.log(pageNumberMsg)
        //persons data
        arrayOfPersons.map(person => {
          const moviesArray = person.known_for.filter(title => title.media_type === 'movie')
          const knownFor = person.known_for_department === "Acting" ? chalk.magenta(person.known_for_department) : ''

          console.log(chalk.white('---------------------------------------- \n'))
          console.log(chalk.white('Person: \n'))
          console.log(chalk.white(`ID: ${person.id}`))
          console.log(chalk.white(`Name:`), chalk.bold.blue(`${person.name}`))
          console.log(chalk.white(`Department:`), knownFor, '\n')
          moviesArray.length > 0 && console.log(chalk.white('Appearing in movies: \n'))
          moviesArray.map(({id, title, release_date}) => {
            if(moviesArray.length > 0) {
              console.log(chalk.white(`\t Movie:`))
              console.log(chalk.white(`\t ID: ${id}`))
              console.log(chalk.white(`\t Release Date: ${release_date}`))
              console.log(chalk.white(`\t Title: ${title} \n`))
            }

          })

          if(moviesArray.length === 0) console.log(chalk.red(`${person.name} does not appear in any movie `))

        })


        setTimeout(() => {
          spinner.succeed('data loded')


        }, 1000);

      })

      res.on('error', error => {
        ora.fail(error)
        return
      })
    
    }).end()



  })


  program.parse();

