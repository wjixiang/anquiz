

import * as quizinterface from './interface/quizInterface';
import Datastore from 'nedb-promises';  
import Anquiz from './main';


import { normalizePath } from 'obsidian';


export class QuizManager {  
    private db: Datastore<quizinterface.quizModel<quizinterface.quizMode,quizinterface.QAMode>>;  
	private app: Anquiz;
	private quizDBpath: string;
	private documentCache: quizinterface.quizModel<quizinterface.quizMode,quizinterface.QAMode>[]
    constructor(app:Anquiz) {  
        this.app = app
		this.quizDBpath = normalizePath(`${this.app.app.vault.configDir}/plugins/${this.app.manifest.id}/quizzes.db`)
		this.documentCache = []
       
    }  

	async init(){
		if(!await this.app.app.vault.adapter.exists(this.quizDBpath)){
			console.log("quizDB file not exists, creating")
			await this.save()
		}

		this.db = Datastore.create({  
			filename: 'quizzes.db',  
			autoload: true,
			timestampData: false 
		}); 
	}

	async save(){
		return new Promise((resolve,reject)=>{
			try {
				this.app.app.vault.adapter.write(
					this.quizDBpath,
					JSON.stringify(this.documentCache,null,2)
				)
				console.log("quizDB save completed")
				resolve(this.documentCache)
			} catch(error){
				console.error("quizDB save failed",error)
				reject(error)
			}
		})
	}

    // 插入新的 Quiz  
    async createQuiz<T extends quizinterface.quizMode, Y extends quizinterface.QAMode>(  
        quiz: quizinterface.quizModel<T, Y>  
    ): Promise<quizinterface.quizModel<T, Y>> {  
		console.log("create quiz")
        return await this.db.insert(quiz);  
    }  

    // 根据 ID 查找 Quiz  
    async findQuizById<T extends quizinterface.quizMode, Y extends quizinterface.QAMode>(  
        id: string  
    ): Promise<quizinterface.quizModel<T, Y> | null> {  
        return await this.db.findOne({ _id: id });  
    }  

    // 按条件查找 Quiz  
    async findQuizzes<T extends quizinterface.quizMode, Y extends quizinterface.QAMode>(  
        query: Partial<quizinterface.quizModel<T, Y>>  
    ): Promise<Array<quizinterface.quizModel<T, Y>>> {  
        return await this.db.find(query);  
    }  

    // 更新 Quiz  
    async updateQuiz<T extends quizinterface.quizMode, Y extends quizinterface.QAMode>(  
        id: string,   
        update: Partial<quizinterface.quizModel<T, Y>>  
    ): Promise<number> {  
        return await this.db.update({ _id: id }, { $set: update });  
    }  

    // 删除 Quiz  
    async deleteQuiz(id: string): Promise<number> {  
        return await this.db.remove({ id: id },{multi:false});  
    }  

    // 按标签查找  
    async findQuizzesByTag<T extends quizinterface.quizMode, Y extends quizinterface.QAMode>(  
        tag: string  
    ): Promise<Array<quizinterface.quizModel<T, Y>>> {  
        return await this.db.find({ tags: tag });  
    }  

	// private async ensurePluginDirectoryExists(path: string): Promise<void> {  
    //     const adapter = this.app.app.vault.adapter;  
        
    //     // 检查目录是否存在，不存在则创建  
    //     if (!(await adapter.exists(path))) {  
    //         await adapter.mkdir(path);  
    //     }  
    // }  



} 
