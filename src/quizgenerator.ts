import Anquiz from './main';
import { quiz_yaml_template } from "./prompt/quiz_template_prompt"
import mode_dict from "./prompt/mode_prompt"
import { AIRequest, message } from './AIClient';
import { parse } from "yaml"
import * as quizinterface from "./interface/quizInterface"
import { SingleChoiceQuizSchema } from "./typecheck/quizcheck";
import Quiz from "./component/quiz";
import { AIClient } from "./AIClient";
import { normalizePath, TFile } from 'obsidian';
import { v4 } from 'uuid';
import manager from './noteManager';




export interface quizGenerateReq{
	source_note:TFile,
	target_mode:quizinterface.quizMode,
}

export default class QuizGenerator extends manager{
	client: AIClient
	constructor(client:AIClient,app:Anquiz){
		super(app)
		this.client = client
	}
	async single_note_to_quiz(convert_req:quizGenerateReq){
		

		const messges = [{
			role:"system",
			content:"你是一个临床医学试题生成器，所有的回复必须是严格的yaml格式，并严格按照所给出的yaml模板返回结果，中除了yaml文本以外不要有其他任何内容，包括代码块"
		}]
		const new_messges = await this.add_message(convert_req,messges)
		const req:AIRequest={
			model:"gpt-4o",
			messages:new_messges,
		}

		const AI_res = await this.client.callAPI(req)
		const yaml_format_res = AI_res.replace(/\*/g,"")
		const raw_quiz = parse(yaml_format_res)

		try{
			SingleChoiceQuizSchema.parse(raw_quiz)
			console.log("quiz format validated")
		}catch(error){
			console.log("Validate AI-generated quiz failed:",error)
		}

		//check note id
		const nid = await this.plugin.app.fileManager.processFrontMatter(convert_req.source_note,(frontmatter)=>{
			const nid = frontmatter['nid']
			if(typeof nid == "undefined"){
				frontmatter['nid'] = v4()
			} 
		}).then(()=>{
			const frontmatter = this.plugin.app.metadataCache.getFileCache(convert_req.source_note)?.frontmatter
			if(frontmatter){
				return frontmatter['nid']
			}
		})
		console.log(nid)
		const quiz_data = this.createQuizData(raw_quiz,convert_req.target_mode,nid)

		//const quiz_data = this.dock_to_quiz_interface(convert_req.target_mode,raw_quiz,convert_req.source_note.title)
		// const res = raw_quiz
		if(typeof quiz_data != "undefined"){
			console.log(quiz_data)

			await this.save_quiz(quiz_data,this.plugin.settings.bank_path)
			await this.plugin.quizDB.createQuiz(quiz_data)
			return new Quiz(quiz_data)
		}
	}	

	private async generateDedupePrompt(note:TFile){
		const nid = await this.get_note_id(note)
		const historyQuiz = await this.plugin.quizDB.findQuizByNoteId(nid)
		if(historyQuiz){
			historyQuiz.map(quiz=>{
				return JSON.stringify(quiz.qa,null,2)
			}).join("\n")
		}else{
			return ""
		}
	}

	async add_message(convert_req:quizGenerateReq,messages:message[]):Promise<message[]>{
		
		const config = [
			"你是一个临床医学试题生成器，绝对严格根据所输入的内容出题,避免任何的自主内容，所有的回复必须是严格的yaml格式，并严格按照所给出的yaml模板返回结果，中除了yaml文本以外不要有其他任何内容，包括代码块",
			"若有双*标记加粗内容，则为出题重点",
			"所出题目的每一个关键字，以及正确选项中的每一个关键字，都必须是参考笔记中的原词，严格禁忌自主臆想",
			"你要生成的题型是：" + mode_dict[convert_req.target_mode],
			"每次生成的题目个数：1",
			`yaml模板：\n${quiz_yaml_template[convert_req.target_mode]}\n`,
			"答案为选项的字母标号，随机选取A~E中的任意一项",
			`避免与以下试题重复：${await this.generateDedupePrompt(convert_req.source_note)}`
		]
		const generate_config:message = {
			role: "system",
			content: config.join("\n- ")
		}

		messages[0]  = generate_config

		const title = convert_req.source_note.basename
		const content = await this.plugin.app.vault.read(convert_req.source_note)

		messages.push({	
			role: "user",
			content: title+"\n"+content
		})

		return messages
	}

	createQuizData<T extends quizinterface.quizMode,Y extends quizinterface.QAMode>(
		qaData: Y,
		quizMode: T,
		linkID: string //will be replaced in future
	): quizinterface.quizModel<T,Y>{
		return {
			subject:"",
			unit:"",
			mode:quizMode,
			tags:["AIquiz"],
			links:[linkID], //temporary
			disc: "",
			records: [""], //temporary
			qa: qaData
		}
	}

	async save_quiz<T extends quizinterface.quizMode,Y extends quizinterface.QAMode>(
		quiz:quizinterface.quizModel<T,Y>,
		save_folder:string,
	){
		const normalized_path = normalizePath(save_folder+"/test.json")
		const json_content = JSON.stringify(quiz,null,2)
		console.log(normalized_path)
		await this.plugin.app.vault.adapter.write(normalized_path,json_content).then(()=>{
			console.log("quiz file saved")
		})
	}
}
