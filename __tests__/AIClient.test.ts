// __tests__/AIClient.test.ts  
import axios from 'axios';  
import { AIClient, AIRequest } from '../src/AIClient'; // 假设你的模块在 src/AIClient.ts 中  

jest.mock('axios'); // 模拟 axios  

describe('AIClient', () => {  
    const apiUrl = 'https://www.gptapi.us/v1/chat/completions';  
    const apiKey = 'sk-0SghhgFMzyNOoRwG981eDcFbEeCa4aEa9c1b831bDc73360b';  
    const client = new AIClient(apiUrl, apiKey);  

    it('should call API and return data', async () => {  
        const requestData: AIRequest = {  
            model: 'gpt-4o-mini',  
            messages: [{ role: 'user', content: 'Hello' }],  
        };  

        const mockResponse = { data: { success: true, message: 'Response from API' } };  
        (axios.post as jest.Mock).mockResolvedValue(mockResponse); // 模拟 axios.post 的返回值  

        const response = await client.callAPI(requestData);  
		console.log("response",response)
        expect(axios.post).toHaveBeenCalledWith(apiUrl, requestData, {  
            headers: {  
                'Authorization': `Bearer ${apiKey}`,  
                'Content-Type': 'application/json',  
            },  
        });  
        expect(response).toEqual(mockResponse.data);  
    });  

    it('should throw an error when API call fails', async () => {  
        const requestData: AIRequest = {  
            model: 'gpt-3.5-turbo',  
            messages: [{ role: 'user', content: 'Hello' }],  
        };  

        const mockError = new Error('Network Error');  
        (axios.post as jest.Mock).mockRejectedValue(mockError); // 模拟 axios.post 抛出错误  

        await expect(client.callAPI(requestData)).rejects.toThrow('Network Error');  
    });  
});
