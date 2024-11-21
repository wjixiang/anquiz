import { App, Editor, MarkdownView, Modal, Plugin, TFolder,Setting, Notice } from 'obsidian';
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



export default class Anquiz extends Plugin {
	settings: AnquizSettings;
	client:AIClient;
	quizDB: QuizManager;
	fsrs: anquizFSRS;

	async onload() {
		await this.loadSettings();
		await this.initQuizDB()

		this.client = new AIClient(this.settings.api_url,this.settings.api_key)
		this.fsrs = new anquizFSRS(this)

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
				new noteMovingModal(this.app).open()
				// new SampleModal(this.app).open()
				this.addFSRSschedule()
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

class noteMovingModal extends Modal {  
	private folderPath = "";
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		// contentEl.setText('hello!');
		contentEl.createEl('h2', { text: 'Move Note to Folder' })

		new Setting(contentEl)  
            .setName('Destination Folder')  
            .setDesc('Enter the destination folder path')  
            .addText(text => {  
                text.setValue(this.folderPath)  
                    .setPlaceholder('Enter folder path')  
                    .onChange(async (value) => {  
                        this.folderPath = value;  
                    })  
                    .inputEl.addEventListener('input', (e) => {  
                        this.updateFolderSuggestions(text.inputEl);  
                    });  
            });  
		contentEl.createDiv('suggestions-container'); 

		new Setting(contentEl)  
            .addButton(btn => {  
                btn.setButtonText('Move')  
                   .setCta()  
                   .onClick(() => this.moveNote());  
            })  
            .addButton(btn => {  
                btn.setButtonText('Cancel')  
                   .onClick(() => this.close());  
            });  
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}

	private updateFolderSuggestions(inputEl: HTMLInputElement) {  
        const suggestionsContainer = this.contentEl.querySelector('.suggestions-container');  
        if (!suggestionsContainer) return;  
        suggestionsContainer.empty();  

        const currentInput = inputEl.value.trim();  
        if (!currentInput) return;  

        // 获取所有文件夹  
        const allFolders = this.app.vault.getAllLoadedFiles()  
            .filter((file): file is TFolder => file instanceof TFolder)  
            .filter(folder =>   
                folder.path.toLowerCase().includes(currentInput.toLowerCase())  
            )  
            .slice(0, 5); // 限制建议数量  

        allFolders.forEach(folder => {  
            const suggestionEl = suggestionsContainer.createDiv('suggestion');  
            suggestionEl.setText(folder.path);  
            suggestionEl.onclick = () => {  
                inputEl.value = folder.path;  
                this.folderPath = folder.path;  
                suggestionsContainer.empty();  
            };  
        });  
    } 

	private moveNote() {  
		if (!this.folderPath) {  
			new Notice('Please enter a valid folder path');  
			return;  
		}  
	
		try {  
			// 获取当前活跃的笔记  
			const activeFile = this.app.workspace.getActiveFile();  
			if (!activeFile) {  
				new Notice('No active file to move');  
				return;  
			}  
	
			// 标准化路径  
			const normalizedPath = normalizePath(this.folderPath);  
	
			// 确保目标文件夹存在  
			const targetFolder = this.app.vault.getAbstractFileByPath(normalizedPath);  
			if (!(targetFolder instanceof TFolder)) {  
				this.app.vault.createFolder(normalizedPath);  
			}  
	
			// 构建新的完整文件路径  
			const newFilePath = normalizePath(`${this.folderPath}/${activeFile.name}`);  
	
			// 使用 rename 方法移动文件  
			this.app.vault.rename(activeFile, newFilePath);  
	
			new Notice(`Note moved to ${this.folderPath}`);  
			this.close();  
		} catch (error) {  
			console.error('Error moving note:', error);  
			new Notice('Failed to move note');  
		}  
	}  
}

