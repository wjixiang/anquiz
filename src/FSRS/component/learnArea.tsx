import styled from "styled-components";
import { obCard } from "../fsrs"
import { useEffect, useState } from "react";

const NoteLink = styled.div`  
	margin: auto;
	padding: 5px 0;  
	&:hover {  
    text-decoration: underline;  
  }  
`;  

const LearnArea:React.FC<{
	currentCard:obCard;
	getFileName:(nid:string)=>Promise<string>;
	redirect:(nid:string)=>void;
}> = (props)=>{
	const [fileName, setFileName] = useState<string | null>(null);  
    const [loading, setLoading] = useState(true);  

	useEffect(() => {  
        // 定义异步函数  
        const fetchFile = async () => {  
            try {  
                setLoading(true);  
                const name =  props.getFileName(props.currentCard.nid);  
                setFileName(await name);  
            } catch (error) {  
                console.error('Failed to fetch file name:', error);  
                setFileName(null);  
            } finally {  
                setLoading(false);  
            }  
        };  

        // 立即调用  
        fetchFile();  
    }, [props.currentCard.nid, props.getFileName]);

	return(
		<div>
			<NoteLink onClick={()=>props.redirect(props.currentCard.nid)}>
				{loading ? '加载中...' : (fileName ? fileName : '未找到文件')}
			</NoteLink>
		</div>
	)

}

export default LearnArea
