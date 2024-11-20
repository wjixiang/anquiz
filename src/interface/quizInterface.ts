type optionID = "A" | "B" | "C" | "D" | "E" 

export interface quizModel<T extends quizMode,Y extends QAMode> {
	subject: string,
	unit:string,
	mode:T,
	tags: string[],
	links: string[],
	disc: string,
	records: string[],
	qa: Y
}

export interface QA_single{
	question:string,
	options:string[],
	answer: optionID
}

export interface QA_multiple{
	question:string,
	options:string[],
	answer: optionID
}

export interface QA_discourse{
	question:string,
	answer:string
}

export type QAMode = QA_single|QA_multiple|QA_discourse


export type quizMode = "A1"|"A2"|"A3"|"B"|"X"|"E"
