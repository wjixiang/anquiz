export interface QA_single{
	question:string,
	options:string[],
	answer: quizMode
}


export type quiz_format = quiz_A1|quiz_A2|quiz_A3|quiz_B|quiz_E|quiz_X
export type quizMode = "A1"|"A2"|"A3"|"B"|"X"|"E"

export interface quiz_A1{
	class:string,
	mode: "A1",
	qa: QA_single,
	tag: string[],
	links: string[],
	disc: string,
	source: string|null,
	unit: string|null
}

export interface quiz_A2{
	class:string,
	mode: "A2",
	qa: QA_single,
	tag: string[],
	links: string[],
	disc: string,
	source: string|null,
	unit: string|null
}

export interface quiz_X{
	class:string,
	mode: "X",
	qa: QA_single,
	tag: string[],
	links: string[],
	disc: string,
	source: string|null,
	unit: string|null
}

export interface quiz_A3{
	class:string,
	mode: "A3",
	qa: {
		mainQ:string,
		subQA:QA_single[]
	},
	tag: string[],
	links: string[],
	disc: string,
	source: string|null,
	unit: string|null
}

export interface quiz_B{
	class:string,
	mode: "B",
	q:string[],
	a:string[],
	tag: string[],
	links: string[],
	disc: string,
	source: string|null,
	unit: string|null
}

export interface quiz_E{
	class:string,
	mode: "E",
	q:string[],
	a:string[],
	tag: string[],
	links: string[],
	disc: string,
	source: string|null,
	unit: string|null
}
