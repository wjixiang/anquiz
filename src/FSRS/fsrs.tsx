import { WorkspaceLeaf } from "obsidian";
import Anquiz from "src/main";
import manager from "../noteManager";
import { Card, FSRS, RecordLog } from "ts-fsrs";
import fsrsDB from "./fsrsDB";
import fsrsDeckView from "./fsrsDeckView";
import fsrsDeck from "./fsrsDeck";
import { deckProps, schedule } from './component/treeNode';
import { deckTree } from './component/treeNode';
import fsrsNoteProcess from "./fsrsNoteProcess";




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
	deckProps: deckProps
	noteProcess: fsrsNoteProcess
	

	constructor(plugin:Anquiz){
		super(plugin)
		this.fsrs = new FSRS({})
		this.db = new fsrsDB(plugin)
		this.noteProcess = new fsrsNoteProcess(plugin)
		
		this.deckProps = {
			deckTreeList: [
				{
					root: "(root)",
					leaf: [],
					route: [],
					schedule:{
						newLearn: [],
						studying: [],
						review: []
					}
				}
			],
			openSchedule: this.openSchedule
		}

		this.deck = new fsrsDeck(this.deckProps)
		this.deckView = (leaf:WorkspaceLeaf)=>{
			return new fsrsDeckView(this.deckProps,leaf)
		}
	}



	async updateDeckList(){
		const raw_deckList = await this.db.getDeckList() //get every deck record
		
		const deduped_deckList = [...new Set(raw_deckList.map(r=>JSON.stringify(r)))].map(r=>JSON.parse(r)) //depude deck record
		console.log(deduped_deckList)
		const deckList = [...new Set(deduped_deckList.map(list => list[0]))]
		this.deckProps.deckTreeList =  await Promise.all(deckList.map(async root=>{
			return this.parseNode({
				root: root,
				leaf: [],
				route: [root],
				schedule: await this.getSchedule([root])
			},deduped_deckList)
		}))
		console.log("update deck list:",this.deckProps.deckTreeList)

	}

	parseNode(node: deckTree, deckMatrix: string[][]): deckTree {  
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
				schedule: await this.getSchedule(childRoute)
            };  
            node.leaf.push(  
                this.parseNode(childNode, deckMatrix)  
            );  
        });  

        // 如果没有子节点，将 leaf 设置为空数组  
        if (node.leaf.length === 0) {  
            node.leaf = [];  
        }  

        return node;  
    }  


	async scheduleFromNow(card:obCard){
		const scheduling_cards:RecordLog = this.fsrs.repeat(card.card[card.card.length-1],new Date())
		return scheduling_cards
	}

	hourToDate(hour: number) {  
		const date = new Date();  
		date.setHours(hour, 0, 0, 0);  
		return date;  
	} 

	getNewLearn = async(deck:string[]):Promise<obCard[]>=>{
		const newLearnNotes = await this.db.fetchNewLearn(
			deck,
			this.plugin.settings.max_new_card,
			this.plugin.settings.new_card_schedule_order
		)
		return newLearnNotes
	}

	getStudying = async(deck:string[]) => {

	}

	getLearningAndReview = async(deck:string[]) => {
		
		const reviewNotes = await this.db.fetchReview(
			deck,
			this.hourToDate(this.plugin.settings.next_day)
		)
		return reviewNotes
	}
	
	getSchedule = async(deck:string[]):Promise<schedule>=>{
		console.log(deck)
		const newLearn = await this.getNewLearn(deck)
		const learn_and_review = await this.getLearningAndReview(deck)
		const studying = learn_and_review.filter(d => d.card[d.card.length-1].state===1)
		const review = learn_and_review.filter(d => d.card[d.card.length-1].state===2)

		const schedule:schedule = {
			newLearn: newLearn,
			studying: studying,
			review: review
		}
		return schedule
	}

	openSchedule = async(deck:string[])=>{
		console.log(deck)
		const newLearn = await this.getNewLearn(deck)
		const learn_and_review = await this.getLearningAndReview(deck)
		const studying = learn_and_review.filter(d => d.card[d.card.length-1].state===1)
		const review = learn_and_review.filter(d => d.card[d.card.length-1].state===2)

		const schedule:schedule = {
			newLearn: newLearn,
			studying: studying,
			review: review
		}
		console.log(schedule)
	}

	schedulePanel: React.FC<{ //overview of selected deck's learning schedule
		refresh_date: Date;
		selected_deck: string[];
	}> = (scheduleData)=>{
		// 1 step: schedule notes of new learn
		const newLearn = this.db.fetchNewLearn(
			scheduleData.selected_deck,
			this.plugin.settings.max_new_card,
			this.plugin.settings.new_card_schedule_order
		)
		return(
			<>{newLearn}</>
		)
	}

	rateNote = ()=>{

	}

	// studyPanel: React.FC<{}> = ()=>{

	// }
}
