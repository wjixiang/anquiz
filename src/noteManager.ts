import Anquiz from "./main";
import { TFile} from 'obsidian';
import { v4 } from "uuid";

export default class manager{
	plugin: Anquiz

	constructor(plugin:Anquiz){
		this.plugin = plugin
	}

	async edite_note_id(note:TFile,nid:string){
		this.plugin.app.fileManager.processFrontMatter(note,(frontmatter)=>{
			const file_nid = frontmatter['nid']
			if(typeof file_nid == "undefined"){
				frontmatter['nid'] = nid
			} 
		})
	}

	async get_note_id(note:TFile): Promise<string>{
		console.log("hello")
		const frontmatter = this.plugin.app.metadataCache.getFileCache(note)?.frontmatter

		if(frontmatter){
			const nid = frontmatter['nid']
			if(nid==undefined){
				const nid = v4()
				this.edite_note_id(note,nid)
				return nid
			}else{
				console.log(nid)
				return nid
			}
		}else{
			const nid = v4() 
			this.edite_note_id(note,nid)
			return nid
		}
	}

	async getFileByNid(nid:string):Promise<TFile>{
		const files = this.plugin.app.vault.getMarkdownFiles()
		const result: TFile[] = []
		for(const file of files){
			const cache = this.plugin.app.metadataCache.getFileCache(file)
			if(cache?.frontmatter){
				if(cache.frontmatter['nid']==nid){
					result.push(file)
				}
			}
		}

		if(result.length == 1){
			return result[0]
		}else if(result.length >1){
			throw new Error(`note corresponding to the nid(${nid}) is not unique`)
		}else {
			throw new Error(`note corresponding to the nid(${nid}) not found`)
		}
	}

}
