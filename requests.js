import chalk from 'chalk'



export const getPerson = (responseObj) => {
  const {id, name, known_for_department: department, biography, also_known_as: otherNames, birthday, place_of_birth: from } = responseObj

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
  
} 

export const getPersons = (responseObj) => {
  const arrayOfPersons = responseObj.results
  const currentPage = responseObj.page
  const totalPages = responseObj.total_pages

  const pageNumberMsg = currentPage <= 500 && chalk.white(`
  ---------------------------------------- \n 
  Page: ${currentPage} of: ${totalPages}
  `)   
   console.log(pageNumberMsg)

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
}
