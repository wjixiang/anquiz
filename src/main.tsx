import { App, Editor, MarkdownView, Modal, Plugin } from 'obsidian';
import { AnquizSettings,DEFAULT_SETTINGS, AnquizSettingTab } from './setting';
import { normalizePath } from 'obsidian';

import { AIClient } from './AIClient';

import QuizGenerator from './quizgenerator';
import { quizGenerateReq } from './quizgenerator';
import Quiz from './component/quiz';

import React from 'react';  
import { createRoot } from 'react-dom/client';  

// Remember to rename these classes and interfaces!


export default class Anquiz extends Plugin {
	settings: AnquizSettings;
	client:AIClient

	async onload() {
		await this.loadSettings();
		await this.initQuizDB()

		this.client = new AIClient(this.settings.api_url,this.settings.api_key)


		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', async (evt: MouseEvent) => {

			const currentFile = this.app.workspace.getActiveFile()
			if(currentFile!=null){
				
				const testreq: quizGenerateReq = {
					target_mode:"A1",
					source_note:{
						title: currentFile.basename,
						content: await this.app.vault.read(currentFile)
					},
					save_folder: this.settings.bank_path
				}

				const new_quzi = await new QuizGenerator(this.client,this).single_note_to_quiz(testreq)

				if(typeof new_quzi != 'undefined'){
					new QuizModal(this.app,new_quzi).open()
				}
				// console.log(new_quzi)
			}

		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				new SampleModal(this.app).open();
			}
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection('Sample Editor Command');
			}
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-sample-modal-complex',
			name: 'Open sample modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new AnquizSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async initQuizDB() {  
		// check DBFile exist
		const plugin_root_path = normalizePath(this.app.vault.configDir)
		console.log("plugin_root_path:",plugin_root_path)

    } 
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('hello!');
		const rootdiv = contentEl.createDiv()
		console.log(rootdiv.innerHTML)
		
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class QuizModal extends Modal {
	quiz:Quiz
	constructor(app: App,quiz_componant:Quiz) {
		super(app);
		this.quiz = quiz_componant
	}

	onOpen() {
		const {contentEl} = this;
		const rootdiv = contentEl.createDiv({
			cls: "anquiz-scope"
		})
		console.log(rootdiv.innerHTML)
		const root = createRoot(rootdiv);  
		console.log(rootdiv.innerHTML)
		root.render(<this.quiz.view />);  
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}
