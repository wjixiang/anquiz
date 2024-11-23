import ob_neDB from "src/Obsidian_nedb";
import * as Obsidian from '../__mocks__/obsidian';  
import { obCard } from "src/FSRS/fsrs";

jest.mock('obsidian')

describe("Adjust nedb to fit obsidian environment",()=>{
	

	const manifest:Obsidian.PluginManifest = {
		id: "",
		name: "",
		author: "",
		version: "",
		minAppVersion: "",
		description: ""
	}

	it("create nedb instance",()=>{
		const obnedb:ob_neDB<obCard> = new ob_neDB(Obsidian.app,manifest,"xxDB")
		expect(obnedb.dbName).toBe("xxdb")
	})

})
