import anquizFSRS from "../src/FSRS/fsrs";
import Anquiz from "../src/main";
import { PluginManifest,TFile, Vault,FileStats } from "obsidian";

const filestate:FileStats = {
	ctime: 0,
	mtime: 0,
	size: 0
}

const test_note:TFile = {
	stat: filestate,
	basename: "",
	extension: "",
	vault: new Vault,
	path: "",
	name: "",
	parent: null
}

const manifest:PluginManifest = {
	id: "",
	name: "",
	author: "",
	version: "",
	minAppVersion: "",
	description: ""
}

describe('FSRS implantation of Obsidian',()=>{
	const test_fsrs = new anquizFSRS(new Anquiz(app,manifest))

	it('create empty obCard with nid,deck_arry',()=>{
		test_fsrs.addCard(test_note)
	})
})
