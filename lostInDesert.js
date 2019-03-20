// Calcul de la différence entre la valeur absolue personnelle et réponse
var crypto = require('crypto');
var find = require('lodash/find');

const userPack = require('./resources/userPack.json')
const paquetage = require('./resources/pack.json')
const resultPack = require('./resources/result.json')


/**
 * createHash
 * @description create a hash for a given object
 * @param {string} objectName the object name
 * @returns {string} hash
 */
function createHash(objectName) {
  const hash = crypto.createHash('md5').update(objectName).digest('hex');
  return hash.slice(0,5);
}

const generateStartPack = () => paquetage.map((objectName) => {
  const objectHash = createHash(objectName)
  return {
    hash: objectHash,
    name: objectName,
    score: 0
  }
})

/**
 * Generate a startPack
 */
const startPack = generateStartPack()
console.log('startPack', JSON.stringify(startPack));

/**
 * 
 * @param {Number} userObjectScore The score in user object
 * @param {Number} resultObjectFoundScore The score in result 
 * @param {Number} diff The diff between userObjectScore and resultObjectFoundScore
 */
const logger = (userObjectScore, resultObjectFoundScore, diff) => {
  console.log(`The user object score (${userObjectScore}) is more than the result object found (${resultObjectFoundScore}) and diff is ${diff}`)
}

/**
 * 
 * @param {Object} userObject The user item Object
 */
function checkDistance(userObject){
  const resultObjectFound = find(resultPack, { hash: userObject.hash })

  let diff;

  if (resultObjectFound.score < userObject.score){
    diff = userObject.score - resultObjectFound.score
    logger(userObject.score, resultObjectFound.score, diff)
    
    return { hash: resultObjectFound.hash, diff }
  } else if (resultObjectFound.score > userObject.score){
    diff = resultObjectFound.score - userObject.score;
    logger(userObject.score, resultObjectFound.score, diff)
    
    return { hash: resultObjectFound.hash, diff }
  }
  logger(userObject.score, resultObjectFound.score, 0)
  return { hash: resultObjectFound.hash, diff: 0 }
}


/**
 * 
 * @param {Object} startingPack The starting package for a person
 */
const workflow = (startingPack) => startingPack.map(obj => checkDistance(obj));

const diffedResult = workflow(userPack);
const userFinalScore = diffedResult.reduce((count, object) => count + object.diff, 0)

console.log('\n')
console.log('=======')
console.log('User final score is', userFinalScore)