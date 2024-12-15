import Datastore from 'nedb-promises'; 
import { App, normalizePath, PluginManifest} from 'obsidian';

export default class ob_neDB<T> {
	public db: Datastore<T>
	public dbName: string
	private app: App
	private manifest: PluginManifest
	private DBpath: string

	constructor(app:App,manifest: PluginManifest, dbName:string) {
		this.app = app
		this.manifest = manifest
		this.dbName = dbName
		this.DBpath = normalizePath(`${this.app.vault.configDir}/plugins/${this.manifest.id}/${this.dbName}.json`)
	}

	async init() {  
        // create database instance
        this.db = Datastore.create({   
            inMemoryOnly: true,  
            timestampData: false   
        });  

        // file exists, loading
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
    } 

	async save() {  
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
    } 
}
