import { obCard } from "./fsrs"

export default class fsrsScheduler{
	async fsrsScheduler(card:obCard){
		const scheduling_cards:RecordLog = this.fsrs.repeat(card.card,new Date())
		console.log(scheduling_cards)
		return scheduling_cards
	}
}
