import { TFile,Notice, WorkspaceLeaf } from "obsidian";
import Anquiz from "src/main";
import manager from "../noteManager";
import { Card, createEmptyCard, FSRS, RecordLog } from "ts-fsrs";
import fsrsDB from "./fsrsDB";
import fsrsDeckView from "./fsrsDeckView";
import fsrsDeck from "./fsrsDeck";
import { deckProps } from './fsrsDeck';



export interface obCard{
	nid: string;
	card: Card[];
	deck: string[];
}

export default class anquizFSRS extends manager{
	fsrs: FSRS;
	db: fsrsDB;
	deck: fsrsDeck
	deckView : (leaf:WorkspaceLeaf)=>fsrsDeckView
	

	constructor(plugin:Anquiz){
		super(plugin)
		this.fsrs = new FSRS({})
		this.db = new fsrsDB(plugin)
		
		const testDeckTree: deckProps= {
			deckTreeList: [
				{
					root: "pathology",
					leaf: null
				}
			]
		}

		this.deck = new fsrsDeck(testDeckTree)
		this.deckView = (leaf:WorkspaceLeaf)=>{
			return new fsrsDeckView(testDeckTree,leaf)
		}
	}

	async addCard(file:TFile,path:string){
		const noteStatus = await this.activateNote(file)
		const deck = this.pathToDeck(path)
		console.log(deck)

		if(noteStatus==true){
			this.createNewCard(file,deck)
		}else{
			return;
		}
	}

	private pathToDeck(path:string):string[]{
		return path.split('/')
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
			this.db.saveCard(newCard)
		}catch(error){
			console.log(error)
		}
		return newCard
	}

	async scheduleFromNow(card:obCard){
		const scheduling_cards:RecordLog = this.fsrs.repeat(card.card[card.card.length-1],new Date())
		return scheduling_cards
	}
}
