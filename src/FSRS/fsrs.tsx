import { ItemView, WorkspaceLeaf } from "obsidian";
import Anquiz from "src/main";
import manager from "../noteManager";
import { Card, FSRS, RecordLog } from "ts-fsrs";
import fsrsDB from "./fsrsDB";
import FsrsDeck from "./fsrsDeck";
import { deckProps, schedule } from './component/treeNode';
import { deckTree } from './component/treeNode';
import fsrsNoteProcess from "./fsrsNoteProcess";
import React, { useState } from "react";
import { FsrsStudy } from "./component/study";
import { createRoot } from "react-dom/client";
import sortMethod from "./sortMethod";

 
export interface obCard{
	nid: string; 
	card: Card[];
	deck: string[];
}



export default class anquizFSRS extends manager{
	fsrs: FSRS;
	db: fsrsDB;
	deck: FsrsDeck
	view : (leaf:WorkspaceLeaf)=>fsrsView;
	appProps: fsrsAppProps
	noteProcess: fsrsNoteProcess
	

	constructor(plugin:Anquiz){
		super(plugin)
		this.fsrs = new FSRS({})
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
		this.view = (leaf:WorkspaceLeaf)=>{
			return new fsrsView(leaf,this)
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

	rateNote = ()=>{

	}

	fsrsApp: React.FC = ()=>{
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const [appProps, setAppProps] = useState<fsrsAppProps>(this.appProps);  
		const [currentPage, setCurrentPage] = useState('deck');  
		const [selectedDeck, setSelectedDeck] = useState<deckTree | null>(null); 
	
	
	
		const openSchedule = (deckTree: deckTree, update: () => void) => {  
			setSelectedDeck(deckTree);  
			setCurrentPage('study');  
			// 如果有额外的更新逻辑，执行传入的 update 函数  
			update();  
		};  
	
		const backHome = ()=>{
			setCurrentPage('deck'); 
		}
	
	
		const renderPage = ()=>{
			switch (currentPage){
				case 'deck':
					return <FsrsDeck 
						deckTreeList={appProps.deckProps.deckTreeList} 
						openSchedule={openSchedule} />
				case 'study':
					return <FsrsStudy deck={selectedDeck} backHome={backHome} sortMethod={{
						newLearnSortMethod:sortMethod.sortByDueTimeAsc
					}}/>
			}
		
		}
		return(
			<div>
				{renderPage()}
			</div>
		)
	}
}

export class fsrsView extends ItemView{
	fsrs:anquizFSRS
	root = createRoot(this.containerEl.children[1])
	constructor(leaf:WorkspaceLeaf,fsrs:anquizFSRS){
		super(leaf);
		this.fsrs = fsrs
	}  
 
	getViewType(): string {
		return "fsrsView" 
	}
	getDisplayText(): string { 
		return "fsrs-panel"
	}
	renderComponent(fsrsApp:React.FC<fsrsAppProps>) {  
        this.root.render(  
            React.createElement(fsrsApp, this.fsrs.appProps)  
        );  
    }  

    protected async onOpen(): Promise<void> {  
        this.renderComponent(this.fsrs.fsrsApp)
    }  

}

export interface fsrsAppProps {
	deckProps:deckProps;
	selectedDeck: deckTree|null;
	currentPage: string;
}
