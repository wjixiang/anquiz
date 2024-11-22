import { TFile } from "obsidian";
import Anquiz from "src/main";
import manager from "../noteManager";
import { Card, createEmptyCard, FSRS, FSRSParameters, generatorParameters } from "ts-fsrs";

export interface obCard{
	nid: string;
	card: Card;
	deck: string[];
}

export default class anquizFSRS extends manager{
	fsrs: FSRS;
	constructor(plugin:Anquiz){
		super(plugin)
		this.fsrs = new FSRS({})
	}

	async addCard(file:TFile){
		const nid = await this.get_note_id(file)
		const noteStatus = await this.activateNote(file)

		switch (noteStatus){
			case 0:
				this.createNewCard(file)
		}
	}

	private async activateNote(file:TFile): Promise<0|1|2|3>{
		const frontmatter = this.plugin.app.metadataCache.getFileCache(file)?.frontmatter
		if(frontmatter){
			if(frontmatter['FSRS']=="on"){
				console.log(`FSRS of note ${file.basename} already activated`)
				return 1
			}else if(frontmatter['FSRS']=="off"){
				console.log(`FSRS of note ${file.basename} has been disabled`)
				return 2
			}else if(frontmatter['FSRS']== undefined){
				this.plugin.app.fileManager.processFrontMatter(file,(frontmatter)=>{
					frontmatter['FSRS'] = "on"
				})
				return 0
			}else{
				console.log(`Abnromal setting of FSRS status: ${file.basename}`)
				return 3
			}
		}else{
			this.plugin.app.fileManager.processFrontMatter(file,(frontmatter)=>{
				frontmatter['FSRS'] = "on"
			})
			return 0
		}
	}

	private async createNewCard(file:TFile): Promise<Card>{
		const newCard = createEmptyCard()
		const params: FSRSParameters = generatorParameters({
			maximum_interval: 1000
		})
		console.log(newCard)
		return newCard
	}

	private async saveCard(card:obCard){

	}
}
