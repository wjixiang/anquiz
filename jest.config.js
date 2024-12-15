module.exports = {  
    preset: 'ts-jest',  
    testEnvironment: 'jsdom',  
    moduleNameMapper: {  
        '^obsidian$': '<rootDir>/node_modules/obsidian/obsidian.d.ts',  
        '^src/(.*)$': '<rootDir>/src/\$1',
		'^__mocks__/(.*)$': '<rootDir>/__mocks__/\$1',  
        // 添加 nedb-promises 的映射  
        '^nedb-promises$': '<rootDir>/node_modules/nedb-promises'  
    },  
    // 可能需要添加这些配置  
    transform: {  
        '^.+\\.tsx?$': 'ts-jest'  
    },  
    // 确保包括第三方模块  
    transformIgnorePatterns: [  
        '/node_modules/(?!nedb-promises)/'  
    ]  
}
