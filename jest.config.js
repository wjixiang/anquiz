module.exports = {  
	preset: 'ts-jest',  
	testEnvironment: 'node',  
	moduleNameMapper: {  
		'^obsidian$': '<rootDir>/__mocks__/obsidian.ts',  
		'^src/(.*)$': '<rootDir>/src/$1'  
	}  
  }
