import { App, PluginSettingTab,Setting} from "obsidian";
import Anquiz from './main';
import locale from "./lang";

export interface AnquizSettings {
	bank_path: string;
	api_url: string;
	api_key: string;
	card_marking_tag: string;
}

export const DEFAULT_SETTINGS: AnquizSettings = {
	bank_path: 'quiz_bank',
	api_url: 'https://www.gptapi.us/v1/chat/completions',
	api_key: "sk-0SghhgFMzyNOoRwG981eDcFbEeCa4aEa9c1b831bDc73360b",
	card_marking_tag: "card",
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
	}
}
