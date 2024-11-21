import Anquiz from "./main";
import { TFile } from "obsidian";
import { v4 } from "uuid";

export default class manager{
	plugin: Anquiz

	constructor(plugin:Anquiz){
		this.plugin = plugin
	}

	async get_note_id(note:TFile): Promise<string>{
		const nid = await this.plugin.app.fileManager.processFrontMatter(note,(frontmatter)=>{
			const nid = frontmatter['nid']
			if(typeof nid == "undefined"){
				frontmatter['nid'] = v4()
			} 
		}).then(()=>{
			const frontmatter = this.plugin.app.metadataCache.getFileCache(note)?.frontmatter
			if(frontmatter){
				return frontmatter['nid']
			}
		})

		return nid
	}
}
