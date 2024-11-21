import { moment } from 'obsidian';

interface Locale{
	quiz_bank_path_desc:string,
	card_marking_tag_desc: string,
	activate_fsrs_command: string,
}

const en: Locale = {
	quiz_bank_path_desc: "Input the path of quiz.json files" ,
	card_marking_tag_desc: "Input the tag used to mark card conversion" ,
	activate_fsrs_command: "Add the current note to the FSRS schedule"
}

const zh_cn: Locale = {
	quiz_bank_path_desc:  "输入试题文件所在文件夹的路径",
	card_marking_tag_desc: "属于标签名（将被用于卡片转换的识别）" ,
	activate_fsrs_command: "将当前笔记加入FSRS排程"
}

const locales: { [k: string]: Partial<Locale> } = {
	en,
	'zh-cn': zh_cn
  };
  
const locale: Locale = Object.assign({}, en, locales[moment.locale()]);

export default locale;
  