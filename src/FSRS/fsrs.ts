import { TFile,Notice } from "obsidian";
import Anquiz from "src/main";
import manager from "../noteManager";
import { Card, createEmptyCard, FSRS, RecordLog } from "ts-fsrs";
import fsrsDB from "./fsrsDB";



export interface obCard{
	nid: string;
	card: Card[];
	deck: string[];
}

export default class anquizFSRS extends manager{
	fsrs: FSRS;
	db: fsrsDB;
	constructor(plugin:Anquiz){
		super(plugin)
		this.fsrs = new FSRS({})
		this.db = new fsrsDB(plugin)
	}

	async addCard(file:TFile){
		const noteStatus = await this.activateNote(file)

		if(noteStatus==true){
			this.createNewCard(file)
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

	private async createNewCard(file:TFile): Promise<obCard>{
		const nid = await this.get_note_id(file)
		// console.log(nid)
		const newCard:obCard = {
			nid: nid,
			card: [createEmptyCard()],
			deck: []
		} 
		console.log(newCard)
		try{
			this.db.saveCard(newCard)
		}catch(error){
			console.log(error)
		}
		return newCard
	}

	async scheduleFromNow(card:obCard){
		const scheduling_cards:RecordLog = this.fsrs.repeat(card.card[card.card.length-1],new Date())
		// console.log(scheduling_cards)
		return scheduling_cards
	}

	// private async addCardToDB(card:obCard){

	// 	this.db.save()
	// }
}
