type optionID = "A" | "B" | "C" | "D" | "E" 

export interface quizModel<T extends quizMode,Y extends QAMode> {
	id: string,
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

// export type quiz_format = quiz_A1|quiz_A2|quiz_A3|quiz_B|quiz_E|quiz_X
export type quizMode = "A1"|"A2"|"A3"|"B"|"X"|"E"

// export interface quiz_A1{
// 	id: string,
// 	class:string,
// 	mode: "A1",
// 	qa: QA_single,
// 	tags: string[],
// 	links: string[],
// 	disc: string,
// 	source: string|null,
// 	unit: string|null,
// 	record: string[]
// }

// export interface quiz_A2{
// 	id: string,
// 	class:string,
// 	mode: "A2",
// 	qa: QA_single,
// 	tags: string[],
// 	links: string[],
// 	disc: string,
// 	source: string|null,
// 	record: string[],
// 	unit: string|null
// }

// export interface quiz_X{
// 	id: string,
// 	class:string,
// 	mode: "X",
// 	qa: QA_single,
// 	tags: string[],
// 	links: string[],
// 	disc: string,
// 	source: string|null,
// 	record: string[],
// 	unit: string|null
// }

// export interface quiz_A3{
// 	id: string,
// 	class:string,
// 	mode: "A3",
// 	qa: {
// 		mainQ:string,
// 		subQA:QA_single[]
// 	},
// 	tags: string[],
// 	links: string[],
// 	disc: string,
// 	source: string|null,
// 	record: string[],
// 	unit: string|null
// }

// export interface quiz_B{
// 	id: string,
// 	class:string,
// 	mode: "B",
// 	q:string[],
// 	a:string[],
// 	tags: string[],
// 	links: string[],
// 	disc: string,
// 	source: string|null,
// 	record: string[],
// 	unit: string|null
// }

// export interface quiz_E{
// 	id: string,
// 	class:string,
// 	mode: "E",
// 	q:string[],
// 	a:string[],
// 	tags: string[],
// 	links: string[],
// 	disc: string,
// 	source: string|null,
// 	record: string[],
// 	unit: string|null
// }
