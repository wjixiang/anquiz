import * as quizinterface from './interface/quizInterface';  
import Datastore from 'nedb-promises';  
import Anquiz from './main';  
import { normalizePath } from 'obsidian';  

export class QuizManager {  
    private db: Datastore<quizinterface.quizModel<quizinterface.quizMode,quizinterface.QAMode>>;  
    private app: Anquiz;  
    private quizDBpath: string;  

    constructor(app: Anquiz) {  
        this.app = app;  
        this.quizDBpath = normalizePath(`${this.app.app.vault.configDir}/plugins/${this.app.manifest.id}/quizzes.json`);  
    }  

    async init() {  
        // 创建内存数据库实例  
        this.db = Datastore.create({   
            inMemoryOnly: true,  
            timestampData: false   
        });  

        // 如果文件存在，则从文件加载数据  
        try {  
            if (await this.app.app.vault.adapter.exists(this.quizDBpath)) {  
                const data = await this.app.app.vault.adapter.read(this.quizDBpath);  
                const records = JSON.parse(data);  
                // 将数据加载到内存数据库  
                for (const record of records) {  
                    await this.db.insert(record);  
                }  
                console.log("QuizDB loaded from file");  
            } else {  
                console.log("QuizDB file not exists, starting with empty database");  
                await this.save(); // 创建空文件  
            }  
        } catch (error) {  
            console.error("Error loading QuizDB:", error);  
        }  
    }  

    async save() {  
        try {  
            // 从数据库获取所有文档并直接写入文件  
            const docs = await this.db.find({});  
            await this.app.app.vault.adapter.write(  
                this.quizDBpath,  
                JSON.stringify(docs, null, 2)  
            );  
            console.log("QuizDB save completed");  
            return docs;  
        } catch (error) {  
            console.error("QuizDB save failed", error);  
            throw error;  
        }  
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
