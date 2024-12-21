import ob_neDB from "src/Obsidian_nedb";
import { obCard } from './fsrs';
import Anquiz from "src/main";
import { Card } from "ts-fsrs";
import { PluginManifest } from "obsidian";

const testManifest:PluginManifest = {
	id: "anquiz",
	name: "Anquiz",
	author: "wjx",
	version: "0.0.0",
	minAppVersion: "",
	description: "test"
}

export default class fsrsDB extends ob_neDB<obCard> {
	constructor(plugin?:Anquiz){
		if(plugin){
			super(plugin.manifest,"fsrsDB",plugin.app)
		}else{
			//dev env
			super(testManifest,"fsrsDB")
		}
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

	async fetchNewLearn(deck:string[],maxNewLearn:number,order:1|-1,flashHour:number){
		const alreadyLearn = (await this.fetchTodayAlreadyLearn(deck,flashHour)).length
		const result = await this.db.find({
			card: {$size: 1}
		}).sort({ 'card.0.due':order}).limit((maxNewLearn-alreadyLearn)<0 ? 0 : maxNewLearn-alreadyLearn)

		return result.filter(doc => deck.every(d=>doc.deck.includes(d)))
	}

	async fetchReview(deck:string[],endTime:Date){
		/**
		 * @returns all cards due today of one deck, include 'learning' and 'review'
		 */
		const dueToday = (await this.db.find({}).sort({
			'card.-1.due': 1
		})).filter(d=>{
			// if(Date.parse(d.card[d.card.length-1].due.toDateString())>Date.parse(endTime.toDateString())){
			// 	console.log(d.card[d.card.length-1].due)
			// }
			d.card[d.card.length-1].due<endTime
		}) 
	
		return dueToday.filter(doc => deck.every(d=>doc.deck.includes(d))).filter(d=>d.card.length>1)
	}

	async fetchTodayAlreadyLearn(deck:string[],flashHour:number){
		const yesterday = new Date()
		yesterday.setDate(new Date().getDate()-1)
		yesterday.setHours(flashHour,0,0,0)
	
		const result = (await this.db.find({})).filter(d=>d.card.length>1 && d.card[d.card.length-2].state===0).filter(
			d=>d.card[d.card.length-2].due < new Date()
		).filter(
			d=>d.card[d.card.length-2].due > yesterday
		)

		return result.filter(doc => deck.every(d=>doc.deck.includes(d)))
	}

	async rateCard(obcard:obCard,newCard:Card):Promise<obCard|null>{
		try{
			obcard.card.push(newCard)
			const updatedCard = await this.db.update(
				{nid:obcard.nid},
				obcard,
				{returnUpdatedDocs:true}
			)
			this.save()
			return updatedCard
		}catch(err){
			console.log(err)
			throw(new Error(err))
		}
	}
}
