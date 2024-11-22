import ob_neDB from "src/Obsidian_nedb";
import { obCard } from "./fsrs";
import Anquiz from "src/main";

export default class fsrsDB extends ob_neDB<obCard> {
	constructor(plugin:Anquiz){
		super(plugin.app,plugin.manifest,"fsrsDB")
	}
}
