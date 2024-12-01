import { TFile,Notice, WorkspaceLeaf } from "obsidian";
import Anquiz from "src/main";
import manager from "../noteManager";
import { Card, createEmptyCard, FSRS, RecordLog } from "ts-fsrs";
import fsrsDB from "./fsrsDB";
import fsrsDeckView from "./fsrsDeckView";
import fsrsDeck from "./fsrsDeck";
import { deckProps } from './fsrsDeck';
import { deckTree } from './component/treeNode';



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
	deckTree: deckProps
	

	constructor(plugin:Anquiz){
		super(plugin)
		this.fsrs = new FSRS({})
		this.db = new fsrsDB(plugin)
		
		this.deckTree = {
			deckTreeList: [
				{
					root: "(root)",
					leaf: [],
					route: [],
				}
			]
		}

		this.deck = new fsrsDeck(this.deckTree)
		this.deckView = (leaf:WorkspaceLeaf)=>{
			return new fsrsDeckView(this.deckTree,leaf)
		}
	}

	async updateDeckList(){
		const raw_deckList = await this.db.getDeckList()
		
		const deduped_deckList = [...new Set(raw_deckList.map(r=>JSON.stringify(r)))].map(r=>JSON.parse(r))
		console.log(deduped_deckList)
		this.deckTree.deckTreeList = [...new Set(deduped_deckList.map(list => list[0]))].map(root=>{
			return this.parseNode({
				root: root,
				leaf: [],
				route: [root]
			},deduped_deckList)
		})

		console.log("update deck list:",this.deckTree.deckTreeList)

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
        children.forEach(child => {  
            const childRoute = [...node.route, child];  
            const childNode: deckTree = {  
                root: child,  
                leaf: [],  
                route: childRoute  
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

	async addCard(file:TFile,path:string){
		const noteStatus = await this.activateNote(file)
		const deck = this.pathToDeck(path)
		console.log(deck)

		if(noteStatus==true){
			this.createNewCard(file,deck)
		}else{
			return;
		}
	}

	private pathToDeck(path:string):string[]{
		return path.split('/')
	}


	private async activateNote(file:TFile): Promise<boolean>{
		const frontmatter = this.plugin.app.metadataCache.getFileCache(file)?.frontmatter
		if(frontmatter){
			if(frontmatter['FSRS']=="on"){
				console.log(`FSRS of note ${file.basename} already activated`)
				new Notice(`FSRS of note ${file.basename} already activated`)
				return false
			}else if(frontmatter['FSRS']=="off"){
				console.log(`FSRS of note ${file.basename} has been disabled`)
				new Notice(`FSRS of note ${file.basename} has been disabled`)
				return false
			}else if(frontmatter['FSRS']== undefined){
				this.plugin.app.fileManager.processFrontMatter(file,(frontmatter)=>{
					frontmatter['FSRS'] = "on"
				})
				return true
			}else{
				console.log(`Abnromal setting of FSRS status: ${file.basename}`)
				new Notice(`❌error: Abnromal parameter of FSRS status: ${file.basename}`,3000)
				return false
			}
		}else{
			this.plugin.app.fileManager.processFrontMatter(file,(frontmatter)=>{
				frontmatter['FSRS'] = "on"
			})
			return true
		}
	}

	private async createNewCard(file:TFile,deck:string[]): Promise<obCard>{
		const nid = await this.get_note_id(file)
		// console.log(nid)
		const newCard:obCard = {
			nid: nid,
			card: [createEmptyCard()],
			deck: deck
		} 
		console.log(newCard)
		try{
			this.db.saveCard(newCard)
		}catch(error){
			console.log(error)
		}
		return newCard
	}

	async scheduleFromNow(card:obCard){
		const scheduling_cards:RecordLog = this.fsrs.repeat(card.card[card.card.length-1],new Date())
		return scheduling_cards
	}
}
