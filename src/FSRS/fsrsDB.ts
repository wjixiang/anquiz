import ob_neDB from "src/Obsidian_nedb";
import { obCard } from "./fsrs";
import Anquiz from "src/main";
import { error } from "console";


export default class fsrsDB extends ob_neDB<obCard> {
	constructor(plugin:Anquiz){
		super(plugin.app,plugin.manifest,"fsrsDB")
	}

	async saveCard(
		card:obCard
	){
		try{
			const newCardRecord = await this.db.insert(card)
			await this.save()
			return newCardRecord
		}catch(err){
			console.log(err)
		}
	}

	async getCardByNid(nid:string):Promise<obCard>{
		try{
			const retrievedCard = await this.db.findOne({nid: nid})
			if(retrievedCard !=null){
				return retrievedCard
			}else{
				throw(error(`card not found by nid:${nid}`))
			}
		}catch(err){
			console.log(err)
			throw(error(`card not found by nid:${nid}`))
		}
	}
}
