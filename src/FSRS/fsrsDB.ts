import ob_neDB from "src/Obsidian_nedb";
import { obCard } from './fsrs';
import Anquiz from "src/main";


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

	async getCardByNid(NID:string):Promise<obCard>{
		try{
			const retrievedCard:obCard|null = await this.db.findOne({'nid': NID})
			console.log(retrievedCard)
			if(retrievedCard !=null){
				return retrievedCard
			}else{
				throw(`card not found by nid:${NID}`)
			}
		}catch(err){
			console.log(err)
			throw(`card not found by nid:${NID}`)
		}
	}

	async replaceCard(obCard:obCard){
		try{
			const updatedCard = await this.db.update(
				{nid:obCard.nid},
				obCard,
				{returnUpdatedDocs:true}
			)
			this.save()
			return updatedCard
		}catch(err){
			console.log(err)
		}
	}
}
