import { App, PluginSettingTab,Setting} from "obsidian";
import Anquiz from './main';

export interface AnquizSettings {
	mySetting: string;
}

export const DEFAULT_SETTINGS: AnquizSettings = {
	mySetting: 'default'
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
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
