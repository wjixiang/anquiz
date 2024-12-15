import Datastore from "nedb-promises";
import { deckTree, schedule } from "src/FSRS/component/treeNode"
import { obCard } from "src/FSRS/fsrs"
import { Card } from "ts-fsrs"

interface scheduler {
	max_new_learn: number;
	new_learn_order: 1|-1;
	next_day: number
}

export default class fsrsDB{
	db:Datastore<obCard> = Datastore.create({   
		inMemoryOnly: true,  
		timestampData: false   
	});  

	hourToDate(hour: number) {  
		const date = new Date();  
		date.setHours(hour, 0, 0, 0);  
		return date;  
	} 

	getLearningAndReview = async(deck:string[],next_day:number) => {
		
		const reviewNotes = await this.fetchReview(
			deck,
			this.hourToDate(next_day)
		)
		console.log(`refrash:${this.hourToDate(next_day)}`)
		return reviewNotes
	}


	getSchedule = async(deck:string[],scheduleParam:scheduler):Promise<schedule>=>{
		const newLearn = await this.fetchNewLearn(deck,scheduleParam.max_new_learn,scheduleParam.new_learn_order,scheduleParam.next_day)
		const learn_and_review = await this.getLearningAndReview(deck,scheduleParam.next_day)
		const studying = learn_and_review.filter(d => d.card[d.card.length-1].state===1)
		const review = learn_and_review.filter(d => d.card[d.card.length-1].state===2)
	
		const schedule:schedule = {
			newLearn: newLearn,
			studying: studying,
			review: review
		}
		console.log(`${deck.join('/')}`,schedule)
		return schedule
	}

	async saveCard(
		card:obCard
	){
		try{
			const newCardRecord = await this.db.insert(card)
			// await this.save()
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
			// this.save()
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
			// this.save()
			return updatedCard
		}catch(err){
			console.log(err)
			throw(new Error(err))
		}
	}

	parseNode(node: deckTree, deckMatrix: string[][],scheduleParams:scheduler): deckTree {  
        const currentLevel = node.route.length;  
        node.leaf = [];  

        // 找到所有符合当前路径的子节点  
        const children = deckMatrix  
            .filter(path => {  
                // 检查路径是否匹配当前节点的路由  
                return (  
                    path.length > currentLevel &&   
                    JSON.stringify(path.slice(0, currentLevel)) ===   
                    JSON.stringify(node.route)  
                );  
            })  
            .map(path => path[currentLevel])  
            .filter((value, index, self) => self.indexOf(value) === index); // 去重  

        // 递归处理每个子节点  
        children.forEach(async child => {  
            const childRoute = [...node.route, child];  
            const childNode: deckTree = {  
                root: child,  
                leaf: [],  
                route: childRoute,
				schedule: await this.getSchedule(childRoute,scheduleParams)
            };  
            node.leaf.push(  
                this.parseNode(childNode, deckMatrix,scheduleParams)  
            );  
        });  

        // 如果没有子节点，将 leaf 设置为空数组  
        if (node.leaf.length === 0) {  
            node.leaf = [];  
        }  

        return node;  
    } 

}
