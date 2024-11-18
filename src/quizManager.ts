

import * as quiz_format from './interface/quizInterface';
import Datastore from 'nedb'



export default class quizManager extends Dexie {
	quizA1: Dexie.Table<quiz_format.quiz_A1>
	constructor(){
		super("quizDB")

		this.version(1).stores({
			quizA1: '++id, class, mode, tags, unit'
		})
	}

}
