
import dotenv from 'dotenv'
dotenv.config()
import ora from 'ora'
import { request} from 'https';
const API_KEY = process.env.API_KEY
import { Command } from 'commander';

import chalk from 'chalk'
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
        const {id, name, known_for_department: department, biography, also_known_as: otherNames, birthday, place_of_birth: from } = presonObj

        console.log(chalk.white('\n----------------------------------------'))
        console.log(chalk.white('Person: \n'))
        console.log(chalk.white(`ID: ${id}`))
        console.log(chalk.white('Name:'), chalk.bold.blue(name))
        console.log(chalk.white(`Birthday: ${birthday} | ${from}`))
        console.log(chalk.white('Department:'), department === 'Acting' ? chalk.magenta(department) : '')
        console.log(chalk.white('Biography:'), chalk.bold.blue(biography),'\n')
        otherNames.length > 0 ? console.log(chalk.white('Also Known As:')) : console.log(chalk.yellow(`${name} doesn't have any alternate name \n`))
        if(otherNames.length > 0) {
          
          console.log('\n')
          otherNames.map(name => console.log(chalk.white(name)))
        }
        
        setTimeout(() => {
          spinner.succeed('data loded')


        }, 1000);
      })
    }).end()
  })



  program.parse();