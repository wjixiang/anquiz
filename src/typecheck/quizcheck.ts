import {z} from 'zod'

export const SingleChoiceQuizSchema = z.object({  
    question: z.string().min(1, "问题不能为空"),  
    options: z.array(z.string().min(1, "选项不能为空")).min(2, "至少需要2个选项"),  
    answer: z.enum(['A', 'B', 'C', 'D', 'E'])
})


