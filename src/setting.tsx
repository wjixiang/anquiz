import { App, PluginSettingTab,Setting} from "obsidian";
import Anquiz from './main';
import locale from "./lang";

export interface AnquizSettings {
	bank_path: string;
	api_url: string;
	api_key: string;
	card_marking_tag: string;
	max_new_card: number;
	new_card_schedule_order: string;
	next_day: number
}

export const DEFAULT_SETTINGS: AnquizSettings = {
	bank_path: 'quiz_bank',
	api_url: 'https://www.gptapi.us/v1/chat/completions',
	api_key: "sk-0SghhgFMzyNOoRwG981eDcFbEeCa4aEa9c1b831bDc73360b",
	card_marking_tag: "card",
	max_new_card: 5,
	new_card_schedule_order: "1",
	next_day: 2
}


export class AnquizSettingTab extends PluginSettingTab {
	plugin: Anquiz;

	constructor(app: App, plugin: Anquiz) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();
		new Setting(containerEl) 	 
          .setName("试题库目录")  
          .setDesc(locale.quiz_bank_path_desc)  
          .addText((text) =>  
              text  
                  .setPlaceholder("Enter a value")  
                  .setValue(this.plugin.settings.bank_path)  
                  .onChange(async (value) => {  
                      this.plugin.settings.bank_path = value;  
                      await this.plugin.saveSettings();  
                  })  
          );  

		new Setting(containerEl)
			.setName('API-URL')
			.setDesc('自定义API地址')
			.addText(text => text
			.setPlaceholder('Enter your url')
			.setValue(this.plugin.settings.api_url)
			.onChange(async (value) => {
				this.plugin.settings.api_url = value;
				await this.plugin.saveSettings();
			}));

		new Setting(containerEl)
			.setName('API-KEY')
			.setDesc("填入API-key")
			.addText(text => text
			.setPlaceholder('Enter your api-key')
			.setValue(this.plugin.settings.api_key)
			.onChange(async (value) => {
				this.plugin.settings.api_key = value;
				await this.plugin.saveSettings();
			}));

		new Setting(containerEl)
		.setName('MarkingTag')
		.setDesc(locale.card_marking_tag_desc)
		.addText(text => text
			.setPlaceholder('such as "flashcard"')
			.setValue(this.plugin.settings.card_marking_tag)
			.onChange(async (value) => {
			this.plugin.settings.card_marking_tag = value;
			await this.plugin.saveSettings();
			}));

		containerEl.createEl("h1",{text:"学习方案"}

		)
		new Setting(containerEl)
		.setName('新学笔记数量')
		.setDesc("每日最多学习的新卡片数目")
		.addText(text => text
			.setValue(this.plugin.settings.max_new_card.toString())
			.onChange(async (value) => {
			this.plugin.settings.max_new_card = parseInt(value);
			await this.plugin.saveSettings();
			}));

		new Setting(containerEl)
			.setName('新学笔记排序方案')
			.addDropdown((dropdown)=>{
				dropdown
					.addOption("1",'根据卡片加入时间')
					.setValue(this.plugin.settings.new_card_schedule_order)
					.onChange((value)=>{
						this.plugin.settings.new_card_schedule_order = value
						this.plugin.saveSettings()
					})
			})
		
		const nextDaySetting = new Setting(containerEl)
			.setName('下一天开始时间(小时)')
			.setDesc(`下一天将从${this.plugin.settings.next_day}:00开始计算`)
			.addText((text)=>{
				text
					.setValue(this.plugin.settings.next_day.toString())
					.onChange((value)=>{
						this.plugin.settings.next_day = parseInt(value)
						this.plugin.saveSettings()
						nextDaySetting.setDesc(`下一天将从${this.plugin.settings.next_day}:00开始计算`)
					})
			})

	}
}
