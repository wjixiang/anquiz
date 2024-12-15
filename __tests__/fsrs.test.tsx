
import * as fs from 'fs';

import { FsrsStudy ,sortMethod} from 'src/FSRS/component/study';
import {render} from "@testing-library/react"
import {   schedule } from 'src/FSRS/component/treeNode';
import {  Card } from 'ts-fsrs';
import sortFn from 'src/FSRS/sortMethod';
import fsrsDB from '__mocks__/_fsrsDB_';
import { obCard } from 'src/FSRS/fsrs';


describe("fsrs unit test",()=>{
	const fsrsdb = new fsrsDB()
 
	const data = fs.readFileSync('/Users/a123/Documents/GitHub/anquiz/__tests__/fsrsDB_test.json','utf-8')
	const getDeckList = async ():Promise<string[][]>=>{
		const decks =await fsrsdb.db.find({},{deck:1,_id:0})
		return [...new Set(decks.map(doc=>doc.deck))]
	}
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	let deckList:string[][]
	

	test("attach to virtual database",async()=>{
		try{
			await fsrsdb.db.insert(JSON.parse(data))
		}catch(err){
			console.log(data)
			throw new Error(data)
		}
		expect(await fsrsdb.db.find({}).then((data)=>{
			console.log(data)
			return data
		})).toBeDefined()
	})



	test("get deck list",async ()=>{
		deckList = await getDeckList()
		console.log(deckList)
		expect(deckList)
	})

	// test("parse deckTree",async()=>{
	// 	await Promise.all(deckList.map(async root=>{
	// 		return fsrsdb.parseNode({
	// 			root: root,
	// 			leaf: [],
	// 			route: [root],
	// 			schedule: await fsrsdb.getSchedule([root])
	// 		},deduped_deckList)
	// 	}))	
	// })

	test.todo("generate schedule for every deckTree node")

	test.skip("render study componant",()=>{
		const sorter:sortMethod = {
			newLearnSortMethod: sortFn.sortByDueTimeAsc
		}

		render(<FsrsStudy deck={null} backHome={function (): void {
			console.log('back home');
		} } sortMethod={sorter} getFileName={function (nid: string): Promise<string> {
			console.log(`open file: ${nid}`)
			return new Promise<string>(()=>"open_file")
		} } redirect={function (nid: string): void {
			console.log(`redirect: ${nid}`)
		} } submitRate={function (obcard: obCard, newCard: Card): Promise<obCard | null> {
			throw new Error('Function not implemented.');
		} } updateSchedule={function (deck: string[]): Promise<schedule> {
			throw new Error('Function not implemented.');
		} } />)
	})

	test.todo('refresh the schedule after study action')
	
})
