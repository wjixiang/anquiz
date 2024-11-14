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
	"A1": "single choice quiz",
	"A2": "single choice & case analysis quiz",
	"A3":"string",
	"B":"string",
	"X":"string",
	"E":"string",
}

const zh_cn:templateOption = {
	"A1": "普通单选题",
	"A2":"案例分析题",
	"A3":"string",
	"B":"string",
	"X":"string",
	"E":"string",
}

const locales: { [k: string]: Partial<templateOption> } = {
	en,
	'zh-cn': zh_cn
  };
  


const mode_dict:templateOption = Object.assign({},en,locales[moment.locale()])

export default mode_dict
