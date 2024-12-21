
import anquizFSRS from 'src/FSRS/fsrs';
import '@testing-library/jest-dom'
import { render } from '@testing-library/react';

describe(anquizFSRS,()=>{
	const fsrsapp = new anquizFSRS()
	let deckList
	

	test("attach to virtual database",async()=>{
		await fsrsapp.db.init()
	})



	test("get deck list",async ()=>{
		deckList = await fsrsapp.db.getDeckList()
		console.log(deckList)
		expect(deckList)
	})

	test("render fsrs react app",async()=>{
		render(fsrsapp.fsrsApp)
	})

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
