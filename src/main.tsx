import { App, Modal, Plugin } from 'obsidian';
import { AnquizSettings,DEFAULT_SETTINGS, AnquizSettingTab } from './setting';
import { normalizePath } from 'obsidian';

import { AIClient } from './AIClient';

import QuizGenerator from './quizgenerator';
import { quizGenerateReq } from './quizgenerator';
import Quiz from './component/quiz';

import React from 'react';  
import { createRoot } from 'react-dom/client';  
import * as quizinterface from './interface/quizInterface'
import { QuizManager } from './quizManager';
import anquizFSRS from './FSRS/fsrs';
import locale from './lang';
import createCardModal from './component/createCardModal';



export default class Anquiz extends Plugin {
	settings: AnquizSettings;
	client:AIClient;
	quizDB: QuizManager;
	fsrs: anquizFSRS;

	async onload() {
		await this.loadSettings();

		this.client = new AIClient(this.settings.api_url,this.settings.api_key)
		this.fsrs = new anquizFSRS(this)

		await this.initQuizDB()
		await this.fsrs.db.init()

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'random quiz', async (evt: MouseEvent) => {

			const currentFile = this.app.workspace.getActiveFile()
			if(currentFile!=null){
				const testreq: quizGenerateReq = {
					target_mode:"A1",
					source_note: currentFile,
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
			id: 'activate-fsrs-of-current-note',
			name: locale.activate_fsrs_command,
			callback: ()=>{
				this.app.fileManager.getNewFileParent
				new createCardModal(this.app,this.fsrs).open()
		
			}

		});
		
		this.addCommand({
			id: 'test',
			name: 'test',
			callback: async () => {
				await this.fsrs.db.getCardByNid("2fda651c-4793-4254-bd6b-33692f94dfed")
			}
		});

		// This adds a complex command that can check whether the current state of the app allows execution of the command


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

		this.quizDB = new QuizManager(this)
		await this.quizDB.init()
    } 

	async addFSRSschedule() {
		const currentFile = this.app.workspace.getActiveFile()
		console.log(currentFile)
		if(currentFile!=null){
			this.fsrs.addCard(currentFile)
		}
	}
}


class QuizModal<T extends quizinterface.quizMode,Y extends quizinterface.QAMode> extends Modal {
	quiz:Quiz<T,Y>
	constructor(app: App,quiz_componant:Quiz<T,Y>) {
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

