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

	async getDeckList(): Promise<string[][]>{
		const decks =await this.db.find({},{deck:1,_id:0})
		return [...new Set(decks.map(doc=>doc.deck))]
	}

	async fetchNewLearn(deck:string[],maxNewLearn:number,order:1|-1){
		const result = await this.db.find({
			card: {$size: 1}
		}).sort({ 'card.0.due':order}).limit(maxNewLearn)

		return result.filter(doc => deck.every(d=>doc.deck.includes(d)))
	}

	async fetchReview(deck:string[],endTime:Date){
		/**
		 * @returns all cards due today of one deck, include 'learning' and 'review'
		 */
		const dueToday = (await this.db.find({}).sort({
			'card.-1.due': 1
		})).filter(d=>{
			d.card[d.card.length-1].due<endTime
		})
	
		return dueToday.filter(doc => deck.every(d=>doc.deck.includes(d))).filter(d=>d.card.length>1)
	}
}
