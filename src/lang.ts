import { moment } from 'obsidian';

interface Locale{
	quiz_bank_path_desc:string
}

const en: Locale = {
	quiz_bank_path_desc: "Input the path of quiz.json files" 
}

const zh_cn: Locale = {
	quiz_bank_path_desc:  "输入试题文件所在文件夹的路径"
}

const locales: { [k: string]: Partial<Locale> } = {
	en,
	'zh-cn': zh_cn
  };
  
const locale: Locale = Object.assign({}, en, locales[moment.locale()]);

export default locale;
  