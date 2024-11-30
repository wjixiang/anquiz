import { Modal, App , Setting, Notice, TFolder, normalizePath} from "obsidian";
import anquizFSRS from "src/FSRS/fsrs";


export default class createCardModal extends Modal {  
	private folderPath = "";
	private fsrs:anquizFSRS;
	constructor(app: App,fsrs:anquizFSRS) {
		super(app);
		this.fsrs = fsrs
	}

	onOpen() {
		const {contentEl} = this;
		
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

	private async moveNote() {  
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
			await this.app.vault.rename(activeFile, newFilePath);  
	
			new Notice(`Note moved to ${this.folderPath}`);  

			//add note to FSRS system
			this.fsrs.addCard(activeFile,this.folderPath)

			this.close();  
		} catch (error) {  
			console.error('Error moving note:', error);  
			new Notice('Failed to move note');  
		}  
	}  
}

