import styled from "styled-components";
import { obCard } from "../fsrs"
import { TFile } from "obsidian";
import { useEffect, useState } from "react";

const NoteLink = styled.div`  
  padding: 5px 0;  
`;  

const LearnArea:React.FC<{
	currentCard:obCard;
	getTFile:(nid:string)=>Promise<TFile>;
	redirect:(nid:string)=>void;
}> = (props)=>{
	const [file, setFile] = useState<TFile | null>(null);  
    const [loading, setLoading] = useState(true);  

	useEffect(() => {  
        // 定义异步函数  
        const fetchFile = async () => {  
            try {  
                setLoading(true);  
                const fetchedFile = await props.getTFile(props.currentCard.nid);  
                setFile(fetchedFile);  
            } catch (error) {  
                console.error('Failed to fetch file:', error);  
                setFile(null);  
            } finally {  
                setLoading(false);  
            }  
        };  

        // 立即调用  
        fetchFile();  
    }, [props.currentCard.nid, props.getTFile]);

	return(
		<div>{props.currentCard.nid}
			<NoteLink onClick={()=>props.redirect(props.currentCard.nid)}>
				{loading ? '加载中...' : (file ? file.name : '未找到文件')}
			</NoteLink>
		</div>
	)

}

export default LearnArea
