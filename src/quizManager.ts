import * as quizinterface from './interface/quizInterface';    
import Anquiz from './main';  
import ob_neDB from './Obsidian_nedb';

export class QuizManager extends ob_neDB<quizinterface.quizModel<quizinterface.quizMode,quizinterface.QAMode>>{  
    constructor(plugin: Anquiz) {  
		super(plugin.manifest,"quizDB",plugin.app)
    }  

    

    // 插入新的 Quiz  
    async createQuiz<T extends quizinterface.quizMode, Y extends quizinterface.QAMode>(  
        quiz: quizinterface.quizModel<T, Y>  
    ): Promise<quizinterface.quizModel<T, Y>> {  
        console.log("create quiz");  
        const newQuiz = await this.db.insert(quiz);  
        await this.save();  
        return newQuiz;  
    }  

	async findQuizByNoteId<T extends quizinterface.quizMode, Y extends quizinterface.QAMode>(
		nid: string
	): Promise<quizinterface.quizModel<T, Y>[] | null>{
		return this.db.find({ links: { $regex: new RegExp(nid) } })
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
        const result = await this.db.update({ _id: id }, { $set: update });  
        await this.save();  
        return result;  
    }  

    // 删除 Quiz  
    async deleteQuiz(id: string): Promise<number> {  
        const result = await this.db.remove({ id: id }, { multi: false });  
        await this.save();  
        return result;  
    }  

    // 按标签查找  
    async findQuizzesByTag<T extends quizinterface.quizMode, Y extends quizinterface.QAMode>(  
        tag: string  
    ): Promise<Array<quizinterface.quizModel<T, Y>>> {  
        return await this.db.find({ tags: tag });  
    }  
}
