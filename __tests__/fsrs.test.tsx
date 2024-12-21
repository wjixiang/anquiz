
import anquizFSRS from 'src/FSRS/fsrs';

// import { FsrsStudy ,sortMethod} from 'src/FSRS/component/study';
// import {render} from "@testing-library/react"
// import {   schedule } from 'src/FSRS/component/treeNode';
// import {  Card } from 'ts-fsrs';
// import sortFn from 'src/FSRS/sortMethod';
// import { obCard } from 'src/FSRS/fsrs';




describe("fsrs unit test",()=>{
	const fsrsapp = new anquizFSRS()
 
	
	// const data = fs.readFileSync('/Users/a123/Documents/GitHub/anquiz/__tests__/fsrsDB_test.json','utf-8')
	// const getDeckList = async ():Promise<string[][]>=>{
	// 	const decks =await fsrsapp.db.find({},{deck:1,_id:0})
	// 	return [...new Set(decks.map(doc=>doc.deck))]
	// }
	
	let deckList
	

	test("attach to virtual database",async()=>{
		await fsrsapp.db.init()
	})



	test("get deck list",async ()=>{
		deckList = await fsrsapp.db.getDeckList()
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

	// test.skip("render study componant",()=>{
	// 	const sorter:sortMethod = {
	// 		newLearnSortMethod: sortFn.sortByDueTimeAsc
	// 	}

	// 	render(<FsrsStudy deck={null} backHome={function (): void {
	// 		console.log('back home');
	// 	} } sortMethod={sorter} getFileName={function (nid: string): Promise<string> {
	// 		console.log(`open file: ${nid}`)
	// 		return new Promise<string>(()=>"open_file")
	// 	} } redirect={function (nid: string): void {
	// 		console.log(`redirect: ${nid}`)
	// 	} } submitRate={function (obcard: obCard, newCard: Card): Promise<obCard | null> {
	// 		throw new Error('Function not implemented.');
	// 	} } updateSchedule={function (deck: string[]): Promise<schedule> {
	// 		throw new Error('Function not implemented.');
	// 	} } />)
	// })

	test.todo('refresh the schedule after study action')
	
})
