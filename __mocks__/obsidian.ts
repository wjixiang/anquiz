import { Debouncer,App, Constructor, EventRef,Keymap, OpenViewState, PaneType, Scope, SplitDirection, View, Workspace, WorkspaceContainer, WorkspaceItem, WorkspaceLeaf, WorkspaceParent, WorkspaceRibbon, WorkspaceRoot, WorkspaceSidedock, WorkspaceSplit, WorkspaceWindow, WorkspaceWindowInitData } from 'obsidian';  

const mock_Keymap: Keymap = {
	pushScope: function (scope: Scope): void {
		throw new Error('Function not implemented.');
	},
	popScope: function (scope: Scope): void {
		throw new Error('Function not implemented.');
	}
}

const mock_WorkspaceSidedock:WorkspaceSidedock  = {
	collapsed: false,
	toggle: function (): void {
		throw new Error('Function not implemented.');
	},
	collapse: function (): void {
		throw new Error('Function not implemented.');
	},
	expand: function (): void {
		throw new Error('Function not implemented.');
	},
	getRoot: function (): WorkspaceItem {
		throw new Error('Function not implemented.');
	},
	getContainer: function (): WorkspaceContainer {
		throw new Error('Function not implemented.');
	},
	on: function (name: string, callback: (...data: any) => any, ctx?: any): EventRef {
		throw new Error('Function not implemented.');
	},
	off: function (name: string, callback: (...data: any) => any): void {
		throw new Error('Function not implemented.');
	},
	offref: function (ref: EventRef): void {
		throw new Error('Function not implemented.');
	},
	trigger: function (name: string, ...data: any[]): void {
		throw new Error('Function not implemented.');
	},
	tryTrigger: function (evt: EventRef, args: any[]): void {
		throw new Error('Function not implemented.');
	}
}

const mock_WorkspaceRibbon: WorkspaceRibbon = {
	
}

const mock_BarProp: BarProp = {
	visible: false
}

const mock_win:Window = {
	clientInformation: navigator,
	closed: false,
	customElements: new CustomElementRegistry,
	devicePixelRatio: 0,
	document: new Document,
	event: undefined,
	external: new External,
	frameElement: null,
	frames: new Window,
	history: new History,
	innerHeight: 0,
	innerWidth: 0,
	length: 0,
	location: new Location,
	locationbar: new BarProp,
	menubar: mock_BarProp,
	name: '',
	navigator: navigator,
	ondevicemotion: null,
	ondeviceorientation: null,
	ondeviceorientationabsolute: null,
	onorientationchange: null,
	opener: undefined,
	orientation: 0,
	outerHeight: 0,
	outerWidth: 0,
	pageXOffset: 0,
	pageYOffset: 0,
	parent: new Window,
	personalbar: new BarProp,
	screen: new Screen,
	screenLeft: 0,
	screenTop: 0,
	screenX: 0,
	screenY: 0,
	scrollX: 0,
	scrollY: 0,
	scrollbars: new BarProp,
	self: new Window,
	speechSynthesis: undefined,
	status: '',
	statusbar: undefined,
	toolbar: undefined,
	top: null,
	visualViewport: null,
	window: undefined,
	alert: function (message?: any): void {
		throw new Error('Function not implemented.');
	},
	blur: function (): void {
		throw new Error('Function not implemented.');
	},
	cancelIdleCallback: function (handle: number): void {
		throw new Error('Function not implemented.');
	},
	captureEvents: function (): void {
		throw new Error('Function not implemented.');
	},
	close: function (): void {
		throw new Error('Function not implemented.');
	},
	confirm: function (message?: string): boolean {
		throw new Error('Function not implemented.');
	},
	focus: function (): void {
		throw new Error('Function not implemented.');
	},
	getComputedStyle: function (elt: Element, pseudoElt?: string | null): CSSStyleDeclaration {
		throw new Error('Function not implemented.');
	},
	getSelection: function (): Selection | null {
		throw new Error('Function not implemented.');
	},
	matchMedia: function (query: string): MediaQueryList {
		throw new Error('Function not implemented.');
	},
	moveBy: function (x: number, y: number): void {
		throw new Error('Function not implemented.');
	},
	moveTo: function (x: number, y: number): void {
		throw new Error('Function not implemented.');
	},
	open: function (url?: string | URL, target?: string, features?: string): WindowProxy | null {
		throw new Error('Function not implemented.');
	},
	postMessage: function (message: any, targetOrigin: string, transfer?: Transferable[]): void {
		throw new Error('Function not implemented.');
	},
	print: function (): void {
		throw new Error('Function not implemented.');
	},
	prompt: function (message?: string, _default?: string): string | null {
		throw new Error('Function not implemented.');
	},
	releaseEvents: function (): void {
		throw new Error('Function not implemented.');
	},
	requestIdleCallback: function (callback: IdleRequestCallback, options?: IdleRequestOptions): number {
		throw new Error('Function not implemented.');
	},
	resizeBy: function (x: number, y: number): void {
		throw new Error('Function not implemented.');
	},
	resizeTo: function (width: number, height: number): void {
		throw new Error('Function not implemented.');
	},
	scroll: function (options?: ScrollToOptions): void {
		throw new Error('Function not implemented.');
	},
	scrollBy: function (options?: ScrollToOptions): void {
		throw new Error('Function not implemented.');
	},
	scrollTo: function (options?: ScrollToOptions): void {
		throw new Error('Function not implemented.');
	},
	stop: function (): void {
		throw new Error('Function not implemented.');
	},
	addEventListener: function <K extends keyof WindowEventMap>(type: K, listener: (this: Window, ev: WindowEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void {
		throw new Error('Function not implemented.');
	},
	removeEventListener: function <K extends keyof WindowEventMap>(type: K, listener: (this: Window, ev: WindowEventMap[K]) => any, options?: boolean | EventListenerOptions): void {
		throw new Error('Function not implemented.');
	},
	activeWindow: undefined,
	activeDocument: undefined,
	sleep: function (ms: number): Promise<void> {
		throw new Error('Function not implemented.');
	},
	nextFrame: function (): Promise<void> {
		throw new Error('Function not implemented.');
	},
	dispatchEvent: function (event: Event): boolean {
		throw new Error('Function not implemented.');
	},
	cancelAnimationFrame: function (handle: number): void {
		throw new Error('Function not implemented.');
	},
	requestAnimationFrame: function (callback: FrameRequestCallback): number {
		throw new Error('Function not implemented.');
	},
	onabort: null,
	onanimationcancel: null,
	onanimationend: null,
	onanimationiteration: null,
	onanimationstart: null,
	onauxclick: null,
	onbeforeinput: null,
	onbeforetoggle: null,
	onblur: null,
	oncancel: null,
	oncanplay: null,
	oncanplaythrough: null,
	onchange: null,
	onclick: null,
	onclose: null,
	oncontextlost: null,
	oncontextmenu: null,
	oncontextrestored: null,
	oncopy: null,
	oncuechange: null,
	oncut: null,
	ondblclick: null,
	ondrag: null,
	ondragend: null,
	ondragenter: null,
	ondragleave: null,
	ondragover: null,
	ondragstart: null,
	ondrop: null,
	ondurationchange: null,
	onemptied: null,
	onended: null,
	onerror: null,
	onfocus: null,
	onformdata: null,
	ongotpointercapture: null,
	oninput: null,
	oninvalid: null,
	onkeydown: null,
	onkeypress: null,
	onkeyup: null,
	onload: null,
	onloadeddata: null,
	onloadedmetadata: null,
	onloadstart: null,
	onlostpointercapture: null,
	onmousedown: null,
	onmouseenter: null,
	onmouseleave: null,
	onmousemove: null,
	onmouseout: null,
	onmouseover: null,
	onmouseup: null,
	onpaste: null,
	onpause: null,
	onplay: null,
	onplaying: null,
	onpointercancel: null,
	onpointerdown: null,
	onpointerenter: null,
	onpointerleave: null,
	onpointermove: null,
	onpointerout: null,
	onpointerover: null,
	onpointerup: null,
	onprogress: null,
	onratechange: null,
	onreset: null,
	onresize: null,
	onscroll: null,
	onscrollend: null,
	onsecuritypolicyviolation: null,
	onseeked: null,
	onseeking: null,
	onselect: null,
	onselectionchange: null,
	onselectstart: null,
	onslotchange: null,
	onstalled: null,
	onsubmit: null,
	onsuspend: null,
	ontimeupdate: null,
	ontoggle: null,
	ontransitioncancel: null,
	ontransitionend: null,
	ontransitionrun: null,
	ontransitionstart: null,
	onvolumechange: null,
	onwaiting: null,
	onwebkitanimationend: null,
	onwebkitanimationiteration: null,
	onwebkitanimationstart: null,
	onwebkittransitionend: null,
	onwheel: null,
	onafterprint: null,
	onbeforeprint: null,
	onbeforeunload: null,
	ongamepadconnected: null,
	ongamepaddisconnected: null,
	onhashchange: null,
	onlanguagechange: null,
	onmessage: null,
	onmessageerror: null,
	onoffline: null,
	ononline: null,
	onpagehide: null,
	onpageshow: null,
	onpopstate: null,
	onrejectionhandled: null,
	onstorage: null,
	onunhandledrejection: null,
	onunload: null,
	localStorage: undefined,
	caches: undefined,
	crossOriginIsolated: false,
	crypto: undefined,
	indexedDB: undefined,
	isSecureContext: false,
	origin: '',
	performance: undefined,
	atob: function (data: string): string {
		throw new Error('Function not implemented.');
	},
	btoa: function (data: string): string {
		throw new Error('Function not implemented.');
	},
	clearInterval: function (id: number | undefined): void {
		throw new Error('Function not implemented.');
	},
	clearTimeout: function (id: number | undefined): void {
		throw new Error('Function not implemented.');
	},
	createImageBitmap: function (image: ImageBitmapSource, options?: ImageBitmapOptions): Promise<ImageBitmap> {
		throw new Error('Function not implemented.');
	},
	fetch: function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
		throw new Error('Function not implemented.');
	},
	queueMicrotask: function (callback: VoidFunction): void {
		throw new Error('Function not implemented.');
	},
	reportError: function (e: any): void {
		throw new Error('Function not implemented.');
	},
	setInterval: function (handler: TimerHandler, timeout?: number, ...arguments: any[]): number {
		throw new Error('Function not implemented.');
	},
	setTimeout: function (handler: TimerHandler, timeout?: number, ...arguments: any[]): number {
		throw new Error('Function not implemented.');
	},
	structuredClone: function <T = any>(value: T, options?: StructuredSerializeOptions): T {
		throw new Error('Function not implemented.');
	},
	sessionStorage: undefined
}

const mock_WorkspaceRoot: WorkspaceRoot = {
	win: new Window,
	doc: new Document,
	getRoot: function (): WorkspaceItem {
		throw new Error('Function not implemented.');
	},
	getContainer: function (): WorkspaceContainer {
		throw new Error('Function not implemented.');
	},
	on: function (name: string, callback: (...data: any) => any, ctx?: any): EventRef {
		throw new Error('Function not implemented.');
	},
	off: function (name: string, callback: (...data: any) => any): void {
		throw new Error('Function not implemented.');
	},
	offref: function (ref: EventRef): void {
		throw new Error('Function not implemented.');
	},
	trigger: function (name: string, ...data: any[]): void {
		throw new Error('Function not implemented.');
	},
	tryTrigger: function (evt: EventRef, args: any[]): void {
		throw new Error('Function not implemented.');
	}
}

const mock_Debuncer:Debouncer<unknown[], any> = {
	cancel: function (): Debouncer<unknown[], any> {
		throw new Error('Function not implemented.');
	},
	run: function () {
		throw new Error('Function not implemented.');
	}
}

const mock_Workspace: Workspace = {
	leftSplit: mock_WorkspaceSidedock,
	rightSplit: mock_WorkspaceSidedock,
	leftRibbon: mock_WorkspaceRibbon,
	rightRibbon: mock_WorkspaceRibbon,
	rootSplit: mock_WorkspaceRoot,
	activeLeaf: null,
	containerEl: new HTMLElement(),
	layoutReady: false,
	requestSaveLayout: mock_Debuncer,
	activeEditor: null,
	onLayoutReady: function (callback: () => any): void {
		throw new Error('Function not implemented.');
	},
	changeLayout: function (workspace: any): Promise<void> {
		throw new Error('Function not implemented.');
	},
	getLayout: function () {
		throw new Error('Function not implemented.');
	},
	createLeafInParent: function (parent: WorkspaceSplit, index: number): WorkspaceLeaf {
		throw new Error('Function not implemented.');
	},
	createLeafBySplit: function (leaf: WorkspaceLeaf, direction?: SplitDirection, before?: boolean): WorkspaceLeaf {
		throw new Error('Function not implemented.');
	},
	splitActiveLeaf: function (direction?: SplitDirection): WorkspaceLeaf {
		throw new Error('Function not implemented.');
	},
	duplicateLeaf: function (leaf: WorkspaceLeaf, direction?: SplitDirection): Promise<WorkspaceLeaf> {
		throw new Error('Function not implemented.');
	},
	getUnpinnedLeaf: function (): WorkspaceLeaf {
		throw new Error('Function not implemented.');
	},
	getLeaf: function (newLeaf?: 'split', direction?: SplitDirection): WorkspaceLeaf {
		throw new Error('Function not implemented.');
	},
	moveLeafToPopout: function (leaf: WorkspaceLeaf, data?: WorkspaceWindowInitData): WorkspaceWindow {
		throw new Error('Function not implemented.');
	},
	openPopoutLeaf: function (data?: WorkspaceWindowInitData): WorkspaceLeaf {
		throw new Error('Function not implemented.');
	},
	openLinkText: function (linktext: string, sourcePath: string, newLeaf?: PaneType | boolean, openViewState?: OpenViewState): Promise<void> {
		throw new Error('Function not implemented.');
	},
	setActiveLeaf: function (leaf: WorkspaceLeaf, params?: { focus?: boolean; }): void {
		throw new Error('Function not implemented.');
	},
	getLeafById: function (id: string): WorkspaceLeaf {
		throw new Error('Function not implemented.');
	},
	getGroupLeaves: function (group: string): WorkspaceLeaf[] {
		throw new Error('Function not implemented.');
	},
	getMostRecentLeaf: function (root?: WorkspaceParent): WorkspaceLeaf | null {
		throw new Error('Function not implemented.');
	},
	getLeftLeaf: function (split: boolean): WorkspaceLeaf {
		throw new Error('Function not implemented.');
	},
	getRightLeaf: function (split: boolean): WorkspaceLeaf {
		throw new Error('Function not implemented.');
	},
	getActiveViewOfType: function <T extends View>(type: Constructor<T>): T | null {
		throw new Error('Function not implemented.');
	},
	getActiveFile: function (): TFile | null {
		throw new Error('Function not implemented.');
	},
	iterateRootLeaves: function (callback: (leaf: WorkspaceLeaf) => any): void {
		throw new Error('Function not implemented.');
	},
	iterateAllLeaves: function (callback: (leaf: WorkspaceLeaf) => any): void {
		throw new Error('Function not implemented.');
	},
	getLeavesOfType: function (viewType: string): WorkspaceLeaf[] {
		throw new Error('Function not implemented.');
	},
	detachLeavesOfType: function (viewType: string): void {
		throw new Error('Function not implemented.');
	},
	revealLeaf: function (leaf: WorkspaceLeaf): void {
		throw new Error('Function not implemented.');
	},
	getLastOpenFiles: function (): string[] {
		throw new Error('Function not implemented.');
	},
	updateOptions: function (): void {
		throw new Error('Function not implemented.');
	},
	iterateCodeMirrors: function (callback: (cm: CodeMirror.Editor) => any): void {
		throw new Error('Function not implemented.');
	},
	on: function (name: 'quick-preview', callback: (file: TFile, data: string) => any, ctx?: any): EventRef {
		throw new Error('Function not implemented.');
	},
	off: function (name: string, callback: (...data: any) => any): void {
		throw new Error('Function not implemented.');
	},
	offref: function (ref: EventRef): void {
		throw new Error('Function not implemented.');
	},
	trigger: function (name: string, ...data: any[]): void {
		throw new Error('Function not implemented.');
	},
	tryTrigger: function (evt: EventRef, args: any[]): void {
		throw new Error('Function not implemented.');
	}
}

// 创建一个更严格的类型保护函数  
function createTypeSafeMockApp(): App {  
  // 使用类型断言和部分实现  
  const mockApp:App = {
	keymap: mock_Keymap,
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
