import * as fs from 'fs';  
import * as path from 'path';

export default class quizSynchronizer{
	localQuizFolderPath: string

	constructor(quizFolderPath:string){
		this.localQuizFolderPath = quizFolderPath
	}

	syncQuizFromfolder(){
		fs.readdir(this.localQuizFolderPath,(error,files)=>{
			if(error){
				console.error(error);
				return;
			}

			console.log(`found ${files.length} files under the path ${this.localQuizFolderPath}`)
			files.forEach(file=>{
				fs.readFile(path.join(this.localQuizFolderPath,file),(err,data)=>{
					const quiz = JSON.parse(data.toString('utf-8'))
					console.log(quiz)
				})
			})
		})
	}
}



// sync quiz

new quizSynchronizer('/Users/a123/Documents/GitHub/anquiz/test-vault/quiz_bank')
	.syncQuizFromfolder()
