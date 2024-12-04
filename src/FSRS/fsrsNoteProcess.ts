import { Notice, TFile } from "obsidian";
import Anquiz from "src/main";
import manager from "src/noteManager";
import { obCard } from "./fsrs";
import { createEmptyCard } from "ts-fsrs";

export default class fsrsNoteProcess extends manager{
	constructor(plugin:Anquiz){
		super(plugin)
	}
	async addCard(file:TFile,path:string){
		const noteStatus = await this.activateNote(file)
		const deck = path.split('/')
		console.log(deck)

		if(noteStatus==true){
			this.createNewCard(file,deck)
		}else{
			return;
		}
	}

	private async activateNote(file:TFile): Promise<boolean>{
		const frontmatter = this.plugin.app.metadataCache.getFileCache(file)?.frontmatter
		if(frontmatter){
			if(frontmatter['FSRS']=="on"){
				console.log(`FSRS of note ${file.basename} already activated`)
				new Notice(`FSRS of note ${file.basename} already activated`)
				return false
			}else if(frontmatter['FSRS']=="off"){
				console.log(`FSRS of note ${file.basename} has been disabled`)
				new Notice(`FSRS of note ${file.basename} has been disabled`)
				return false
			}else if(frontmatter['FSRS']== undefined){
				this.plugin.app.fileManager.processFrontMatter(file,(frontmatter)=>{
					frontmatter['FSRS'] = "on"
				})
				return true
			}else{
				console.log(`Abnromal setting of FSRS status: ${file.basename}`)
				new Notice(`❌error: Abnromal parameter of FSRS status: ${file.basename}`,3000)
				return false
			}
		}else{
			this.plugin.app.fileManager.processFrontMatter(file,(frontmatter)=>{
				frontmatter['FSRS'] = "on"
			})
			return true
		}
	}

	private async createNewCard(file:TFile,deck:string[]): Promise<obCard>{
		const nid = await this.get_note_id(file)
		// console.log(nid)
		const newCard:obCard = {
			nid: nid,
			card: [createEmptyCard()],
			deck: deck
		} 
		console.log(newCard)
		try{
			this.plugin.fsrsApp.db.saveCard(newCard)
		}catch(error){
			console.log(error)
		}
		return newCard
	}
}
