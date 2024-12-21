import { Notice, WorkspaceLeaf } from "obsidian";
import Anquiz from "src/main";
import { Card } from "ts-fsrs";
import fsrsDB from "./fsrsDB";
import FsrsDeck from "./fsrsDeck";
import { deckProps, schedule } from './component/treeNode';
import { deckTree } from './component/treeNode';
import fsrsNoteProcess from "./fsrsNoteProcess";
import React, { useState } from "react";
import { FsrsStudy } from "./component/study";

import sortMethod from "./sortMethod";
import fsrsView from "./fsrsView";

 
export interface obCard{
	nid: string; 
	card: Card[];
	deck: string[];
}

export interface fsrsAppProps {
	deckProps:deckProps;
	selectedDeck: deckTree|null;
	currentPage: string;
}


export default class anquizFSRS {
	db: fsrsDB;
	view : (leaf:WorkspaceLeaf)=>fsrsView;
	appProps: fsrsAppProps
	noteProcess: fsrsNoteProcess
	env = "release"
	plugin: Anquiz

	constructor(plugin?:Anquiz){
		if(plugin){
			this.plugin = plugin
			this.db = new fsrsDB(plugin)
			this.noteProcess = new fsrsNoteProcess(plugin)
			this.appProps = {
				deckProps:{
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
					openSchedule: this.openSchedule,
				},
				selectedDeck: null,
				currentPage: 'deck'
			}
			// this.view = (leaf:WorkspaceLeaf)=>{
			// 	return new fsrsView(leaf,this)
			// }
		}else{
			this.env = 'dev'
			this.db = new fsrsDB()
		}
		
	}
 
	async activateStudypanel() {
		const { workspace } = this.plugin.app;
		const viewType = "fsrs-study"
		let leaf: WorkspaceLeaf | null = null;
		const leaves = workspace.getLeavesOfType(viewType);

		if (leaves.length > 0) {
			// A leaf with our view already exists, use that
			leaf = leaves[0];
		} else {
			// Our view could not be found in the workspace, create a new leaf
			// in the right sidebar for it
			leaf = workspace.getRightLeaf(false);
			await leaf.setViewState({ type:viewType, active: true });
		}

		// "Reveal" the leaf in case it is in a collapsed sidebar
		workspace.revealLeaf(leaf);
	}

	async updateDeckList(){
		const raw_deckList = await this.db.getDeckList() //get every deck record
		
		const deduped_deckList = [...new Set(raw_deckList.map(r=>JSON.stringify(r)))].map(r=>JSON.parse(r)) //depude deck record
		console.log(deduped_deckList)
		const deckList = [...new Set(deduped_deckList.map(list => list[0]))]
		this.appProps.deckProps.deckTreeList =  await Promise.all(deckList.map(async root=>{
			return this.parseNode({
				root: root,
				leaf: [],
				route: [root],
				schedule: await this.getSchedule([root])
			},deduped_deckList)
		}))	



		console.log("update deck list:",this.appProps.deckProps.deckTreeList)

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


	hourToDate(hour: number) {  
		const date = new Date();  
		date.setHours(hour, 0, 0, 0);  
		return date;  
	} 

	getNewLearn = async(deck:string[]):Promise<obCard[]>=>{
		const newLearnNotes = await this.db.fetchNewLearn(
			deck,
			this.plugin.settings.max_new_card,
			this.plugin.settings.new_card_schedule_order,
			this.plugin.settings.next_day
		)
		return newLearnNotes 
	}


	getLearningAndReview = async(deck:string[]) => {
		
		const reviewNotes = await this.db.fetchReview(
			deck,
			this.hourToDate(this.plugin.settings.next_day)
		)
		console.log(`refrash:${this.hourToDate(this.plugin.settings.next_day)}`)
		return reviewNotes
	}
	
	getSchedule = async(deck:string[]):Promise<schedule>=>{
		const newLearn = await this.getNewLearn(deck)
		const learn_and_review = await this.getLearningAndReview(deck)
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

	openSchedule = async(deckTree:deckTree,update:()=>void)=>{
		this.appProps.currentPage = 'study'
		console.log(this.appProps,deckTree)
		update()
	} 

	schedulePanel: React.FC<{ //overview of selected deck's learning schedule
		refresh_date: Date;
		selected_deck: string[];
	}> = (scheduleData)=>{
		// 1 step: schedule notes of new learn
		const newLearn = this.db.fetchNewLearn(
			scheduleData.selected_deck,
			this.plugin.settings.max_new_card,
			this.plugin.settings.new_card_schedule_order,
			this.plugin.settings.next_day
		)
		return(
			<>{newLearn}</>
		)
	} 

	redirect = async (nid:string)=>{
		const targetTFile = await this.noteProcess.getFileByNid(nid)
		this.plugin.app.workspace.getLeaf().openFile(targetTFile)
		new Notice(`open ${targetTFile.name}`,500)
	}

	flashQueue = async(deck:string[]):Promise<obCard[]> =>{
		const toDayAlreadyLearned = await this.db.fetchTodayAlreadyLearn(deck,this.plugin.settings.next_day)
		console.log("today already learned:",toDayAlreadyLearned)
		return toDayAlreadyLearned
	}

	fsrsApp: React.FC = ()=>{
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const [appProps, setAppProps] = useState<fsrsAppProps>(this.appProps);  
		const [currentPage, setCurrentPage] = useState('deck');  
		const [selectedDeck, setSelectedDeck] = useState<deckTree | null>(null); 
	
	
	
		const openSchedule = (deckTree: deckTree, update: () => void) => {  
			setSelectedDeck(deckTree);  
			setCurrentPage('study');   
			update();  
		};  
	
		const backHome = async()=>{
			await this.updateDeckList()
			setCurrentPage('deck'); 
		}

		const submitRate = async(obcard:obCard,newcard:Card)=>{
			const rateRes = await this.db.rateCard(obcard,newcard)
			// await this.updateDeckList()
			return rateRes
		}
	
 
		const renderPage = ()=>{
			switch (currentPage){
				case 'deck':
					return <FsrsDeck 
						deckTreeList={appProps.deckProps.deckTreeList} 
						openSchedule={openSchedule} />
				case 'study':
					return <FsrsStudy 
						deck={selectedDeck} 
						backHome={backHome} 
						sortMethod={{
						newLearnSortMethod:sortMethod.sortByDueTimeAsc,
						reviewSortMethod:sortMethod.sortByDueTimeAsc,
					}} 
						getFileName={async (nid:string)=>{
							const file = await this.noteProcess.getFileByNid(nid)
							return file.basename
						}}
						redirect={(nid)=>this.redirect(nid)}
						submitRate={(obcard,newcard)=>submitRate(obcard,newcard)}
						updateSchedule={this.getSchedule}
						flashQueue={(deck)=>this.flashQueue(deck)}
					/>
			} 
		
		}
		return(
			<div>
				{renderPage()}
			</div>
		)
	}

	
}



