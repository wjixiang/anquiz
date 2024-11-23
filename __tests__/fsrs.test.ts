
import AnquizFSRS from '../src/FSRS/fsrs';  
import { TFile } from 'obsidian';  
import * as Obsidian from 'obsidian';  
import { obCard } from '../src/FSRS/fsrs';

// Mock 依赖  
jest.mock('obsidian');  
jest.mock('../src/FSRS/fsrsDB.ts');  

describe.skip('AnquizFSRS', () => {  
  let anquizFSRS: AnquizFSRS;  
  let mockPlugin: any;  
  let mockFile: TFile;  

  beforeEach(() => {  
    mockPlugin = {  
      app: Obsidian.App  
    };  
    anquizFSRS = new AnquizFSRS(mockPlugin);  
    mockFile = new TFile();  
    mockFile.basename = 'TestNote';  
  });  

  it("get card from db by nid",async ()=>{
	const retrived_obCard:obCard = await anquizFSRS.db.getCardByNid("1726364863072")
	expect(retrived_obCard).toHaveProperty('nid')
	expect(retrived_obCard).toHaveProperty('card')
	expect(retrived_obCard).toHaveProperty('deck')
  })
  
});
