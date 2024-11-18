import { moment } from 'obsidian';

interface templateOption{
	"A1":string,
	"A2":string,
	"A3":string,
	"B":string,
	"X":string,
	"E":string,
}


const en:templateOption = {
	"A1": "question: ${Question of the quiz}\noptions:\n  - A.${optionA}\n  - B.${optionB}\n  - C.${optionC}\n  - D.${optionD}\n  - E.${optionE}\nanswer: ${correct option of this quiz}",
	"A2":"string",
	"A3":"string",
	"B":"string",
	"X":"string",
	"E":"string",
}

const zh_cn:templateOption = {
	"A1": "question: ${试题的问题}\noptions:\n  - ${选项A}\n  - ${选项B}\n  - ${选项C}\n  - ${选项D}\n  - ${选项E}\nanswer: ${试题的正确选项}",
	"A2":"string",
	"A3":"string",
	"B":"string",
	"X":"string",
	"E":"string",
}

const locales: { [k: string]: Partial<templateOption> } = {
	en,
	'zh-cn': zh_cn
  };
  

export const quiz_yaml_template:templateOption = Object.assign({},en,locales[moment.locale()])
