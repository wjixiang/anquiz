import { App, Modal, Plugin, WorkspaceLeaf } from 'obsidian';
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
import fsrsView from './FSRS/fsrsUI';




export default class Anquiz extends Plugin {
	settings: AnquizSettings;
	client:(api_url:string,api_key:string)=>AIClient;
	quizDB: QuizManager;
	fsrs: anquizFSRS;
	FSRSPANEL = "fsrs_panel"

	async onload() {
		await this.loadSettings();

		this.client = (api_url,api_key)=>{return new AIClient(api_url,api_key)}
		this.fsrs = new anquizFSRS(this)

		await this.initQuizDB()
		await this.fsrs.db.init()

		this.registerView(this.FSRSPANEL,(leaf)=>{
			return new fsrsView(leaf);
		})

		this.activateFSRSpanel()
		// new fsrsView()

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'random quiz', async (evt: MouseEvent) => {

			const currentFile = this.app.workspace.getActiveFile()
			if(currentFile!=null){
				const testreq: quizGenerateReq = {
					target_mode:"A1",
					source_note: currentFile,
				}

				const new_quzi = await new QuizGenerator(this.client(this.settings.api_url,this.settings.api_key),this).single_note_to_quiz(testreq)

				if(typeof new_quzi != 'undefined'){
					new QuizModal(this.app,new_quzi).open()
				}
			
			}

		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');

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
				const testNard = await this.fsrs.db.getCardByNid("7cfbeb6f-f20f-4908-b230-e2178a7e1037")
				const testSchedule = await this.fsrs.scheduleFromNow(testNard) 
				// const foundNote = await this.fsrs.getFileByNid("7cfbeb6f-f20f-4908-b230-e2178a7e1037")

				
				testNard.card.push(testSchedule['3'].card)
				
				this.fsrs.db.replaceCard(testNard)//simulate update card outright
			}
		});

		this.addSettingTab(new AnquizSettingTab(this.app, this));

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


	async activateFSRSpanel() {
		const { workspace } = this.app;

		let leaf: WorkspaceLeaf | null = null;
		const leaves = workspace.getLeavesOfType(this.FSRSPANEL);

		if (leaves.length > 0) {
			// A leaf with our view already exists, use that
			leaf = leaves[0];
		} else {
			// Our view could not be found in the workspace, create a new leaf
			// in the right sidebar for it
			leaf = workspace.getRightLeaf(false);
			await leaf.setViewState({ type:this.FSRSPANEL, active: true });
		}

		// "Reveal" the leaf in case it is in a collapsed sidebar
		workspace.revealLeaf(leaf);
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
		const root = createRoot(rootdiv);  
		root.render(<this.quiz.view />);  
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

