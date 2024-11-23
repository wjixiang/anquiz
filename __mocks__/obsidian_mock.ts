import { App, Keymap, WorkspaceSidedock, WorkspaceRoot, View } from 'obsidian';

const mock_keymap:Keymap = {
	pushScope: function (scope: Scope): void {
		throw new Error("Function not implemented.");
	},
	popScope: function (scope: Scope): void {
		throw new Error("Function not implemented.");
	}
}

class Scope{
	register = jest.fn()
	unregister = jest.fn()
}

class Workspace {
	leftSplit: WorkspaceSidedock 
	rightSplit:WorkspaceSidedock
	leftRibbon = jest.fn()
	rightRibbon = jest.fn()
	rootSplit: WorkspaceRoot
	activeLeaf = new WorkspaceLeaf
	containerEl = jest.fn()
	layoutReady = false;
	requestSaveLayout =  jest.fn()
	activeEditor: null
	onLayoutReady  = jest.fn()
	changeLayout = jest.fn()
	getLayout = jest.fn()
	createLeafInParent = jest.fn()
	createLeafBySplit = jest.fn()
	splitActiveLeaf = jest.fn()
	duplicateLeaf = jest.fn()
	getUnpinnedLeaf = jest.fn()
	getLeaf = jest.fn()
	moveLeafToPopout = jest.fn()
	openPopoutLeaf = jest.fn()
	openLinkText = jest.fn()
	setActiveLeaf = jest.fn()
	getLeafById = jest.fn()
	getGroupLeaves = jest.fn()
	getMostRecentLeaf = jest.fn()
	getLeftLeaf = jest.fn()
	getRightLeaf = jest.fn()
	getActiveViewOfType = jest.fn()
	getActiveFile = jest.fn()
	iterateRootLeaves = jest.fn()
	iterateAllLeaves = jest.fn()
	getLeavesOfType = jest.fn()
	detachLeavesOfType = jest.fn()
	revealLeaf = jest.fn()
	getLastOpenFiles = jest.fn()
	updateOptions = jest.fn()
	iterateCodeMirrors = jest.fn()
	on = jest.fn()
	off = jest.fn()
	offref = jest.fn()
	trigger = jest.fn()
	tryTrigger = jest.fn()
}

class WorkspaceLeaf{
	view:View = {
		app:null,
		icon:null,
		navigation:null,
		leaf:null,
		containerEl:null,
		onOpen:null,
		onClose:null,
		getViewType:null,
		getState:null,
		setState:null,
		getEphemeralState:null,
		setEphemeralState:null,
		getIcon:null,
		onResize:null,
		getDisplayText:null,
		onPaneMenu:null,
		load:null,
		onload:null,
		unload:null,
		onunload:null,
		addChild:null,
		removeChild:null,
		register, registerEvent
	};
	openFile = jest.fn();
	open = jest.fn();
	getViewState= jest.fn();
	setViewState= jest.fn();


	getEphemeralState = jest.fn();

	setEphemeralState = jest.fn();

	togglePinned= jest.fn();

	setPinned= jest.fn();

	setGroupMember= jest.fn();
	setGroup= jest.fn();

	detach= jest.fn();


	getIcon= jest.fn();

	getDisplayText= jest.fn();


	onResize= jest.fn();
	on= jest.fn();
	getRoot= jest.fn();
	getContainer= jest.fn();
	off= jest.fn();
	offref= jest.fn();
	trigger= jest.fn();
	tryTrigger= jest.fn();
}

class View{

}

// 创建一个更严格的类型保护函数  
function createTypeSafeMockApp(): App {  
  // 使用类型断言和部分实现  
  const mockApp:App = {
	keymap:mock_keymap,
	scope: new Scope,
	workspace: new Workspace,
	vault: new Vault,
	metadataCache: new MetadataCache,
	fileManager: new FileManager,
	lastEvent: null
  };  

  return mockApp;  
}  

// 增强的类型安全 Mock 生成器  
function enhancedMockApp(customConfig: Partial<App> = {}): App {  
  const baseMock = createTypeSafeMockApp();  
  
  // 深度合并配置  
  return Object.assign(baseMock, customConfig);  
}  

export class TFile {  
	basename = '';  
	path = '';  
  }  
  
export class Notice {  
	constructor(message: string, duration?: number) {}  
}  

export const metadataCache = {  
	getFileCache: jest.fn()  
};  

export const fileManager = {  
	processFrontMatter: jest.fn((file, callback) => {  
		const mockFrontmatter = {};  
		callback(mockFrontmatter);  
	})  
};  


export interface PluginManifest {
	id: string,
	name: string,
	author: string,
	version: string,
	minAppVersion: string,
	description: string
}
