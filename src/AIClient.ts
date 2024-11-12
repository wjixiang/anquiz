import axios from 'axios';  

export interface AIRequest {  
    model: string;  
    messages: Array<{ role: string; content: string }>;  
}  

export class AIClient {  
    private apiUrl: string;  
    private apiKey: string;  

    constructor(apiUrl: string, apiKey: string) {  
        this.apiUrl = apiUrl;  
        this.apiKey = apiKey;  
    }  

    async callAPI(requestData: AIRequest):Promise<string> {  
        try {  
            const response = await axios.post(this.apiUrl, requestData, {  
                headers: {  
                    'Authorization': `Bearer ${this.apiKey}`,  
                    'Content-Type': 'application/json',  
                },  
            });  
			const choices = response.data.choices[0].message.content
            return choices
        } catch (error) {  
            console.error('Error calling OpenAI API:', error);  
            throw error;  
        }  
    }  

}  
