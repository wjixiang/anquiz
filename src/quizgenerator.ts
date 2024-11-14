import Anquiz from "./main"
import { quiz_yaml_template } from "./prompt/quiz_template_prompt"
import mode_dict from "./prompt/mode_prompt"
import { AIRequest, message } from './AIClient';
import { parse } from "yaml"
import { quizMode,quiz_A1,QA_single} from "./interface/quizInterface";
import { SingleChoiceQuizSchema } from "./typecheck/quizcheck";
import Quiz from "./quiz";


interface note{
	title:string,
	content:string
}

export interface quizGenerateReq{
	source_note:note,
	target_mode:quizMode,
}

export default class QuizGenerator{
	app:Anquiz
	constructor(app:Anquiz){
		this.app = app
	}
	async single_note_to_quiz(convert_req:quizGenerateReq){
		const messges = [{
			role:"system",
			content:"你是一个临床医学试题生成器，所有的回复必须是严格的yaml格式，并严格按照所给出的yaml模板返回结果，中除了yaml文本以外不要有其他任何内容，包括代码块"
		}]
		const new_messges = this.add_message(convert_req,messges)
		const req:AIRequest={
			model:"gpt-4o-mini",
			messages:new_messges,
		}
		const raw_quiz = parse(await this.app.client.callAPI(req))
		
		try{
			SingleChoiceQuizSchema.parse(raw_quiz)
			console.log("quiz format validated")
			const quiz_data = this.dock_to_quiz_interface(convert_req.target_mode,raw_quiz)
			// const res = raw_quiz
			if(typeof quiz_data != "undefined"){
				return new Quiz(quiz_data)
			}
		}catch(error){
			console.log("Validate AI-generated quiz failed:",error)
		}
	}	

	add_message(convert_req:quizGenerateReq,messages:message[]):message[]{
		const config = [
			"你是一个临床医学试题生成器，严格根据所输入的内容出题，所有的回复必须是严格的yaml格式，并严格按照所给出的yaml模板返回结果，中除了yaml文本以外不要有其他任何内容，包括代码块",
			"你要生成的题型是：" + mode_dict[convert_req.target_mode],
			"每次生成的题目个数：1",
			`yaml模板：\n${quiz_yaml_template[convert_req.target_mode]}\n`,
			"答案为选项的字母标号"
		]
		const generate_config:message = {
			role: "system",
			content: config.join("\n- ")
		}

		messages[0]  = generate_config
		messages.push({	
			role: "user",
			content: convert_req.source_note.title+"\n"+convert_req.source_note.content
		})

		return messages
	}

	dock_to_quiz_interface(mode:quizMode,qa_data:QA_single){
		switch(mode){
			case "A1":
				return this.fine_A1(qa_data)
		}
	}

	fine_A1(qa_data:QA_single):quiz_A1{
		return {
			qa:qa_data,
			class: "",
			mode: "A1",
			tag: [],
			links: [],
			disc: "",
			source: null,
			unit: null
		}
	}
}
