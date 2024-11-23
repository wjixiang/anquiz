import Anquiz from "./main";
import { TFile } from "obsidian";
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
		const frontmatter = this.plugin.app.metadataCache.getFileCache(note)?.frontmatter

		if(frontmatter){
			const nid = frontmatter['nid']
			console.log(nid)
			return nid
		}else{
			const nid = v4()
			this.edite_note_id(note,nid)
			return nid
		}
	}
}
