import Datastore from 'nedb-promises'; 
import { App, normalizePath, PluginManifest} from 'obsidian';
import * as fs from 'fs';


export default class ob_neDB<T> {
	public db: Datastore<T>
	public dbName: string
	private app: App
	private manifest: PluginManifest
	private DBpath: string
	env = 'release'

	constructor(manifest: PluginManifest, dbName:string,app?:App) {
		if(app){
			this.app = app
			this.DBpath = normalizePath(`${this.app.vault.configDir}/plugins/${this.manifest.id}/${this.dbName}.json`)
		}else{
			this.env = "dev"
		}
		this.manifest = manifest
		this.dbName = dbName
	}

	async init() {  
        // create database instance

        this.db = Datastore.create({   
            inMemoryOnly: true,  
            timestampData: false   
        });  

		if(this.env==="release"){
			try {  
				if (await this.app.vault.adapter.exists(this.DBpath)) {  
					const data = await this.app.vault.adapter.read(this.DBpath);  
					const records = JSON.parse(data);  
					// loading data into RAM 
					for (const record of records) {  
						await this.db.insert(record);  
					}  
					console.log("DB loaded from file");  
				} else {  
					console.log("DB file not exists, starting with empty database");  
					await this.save(); // create empty DB.json file  
				}  
			} catch (error) {  
				console.error("Error loading QuizDB:", error);  
			} 
			// file exists, loading 

		}else{
			const data = fs.readFileSync('/Users/a123/Documents/GitHub/anquiz/__tests__/fsrsDB_test.json','utf-8')
			try{
				await this.db.insert(JSON.parse(data))
			}catch(err){
				console.log(data)
				throw new Error(data)
			}
			console.log("fsrsDB has been initalized in dev env")
		}
    } 

	async save() {  
		if(this.env==="release"){
			try {  
				const docs = await this.db.find({});  
				await this.app.vault.adapter.write(  
					this.DBpath,  
					JSON.stringify(docs, null, 2)  
				);   
				return docs;  
			} catch (error) {  
				console.error("DB save failed", error);  
				throw error;  
			}  
		}else{
			console.log("save in dev env")
		}
    } 
}
