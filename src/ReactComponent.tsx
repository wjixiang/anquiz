import React, { useState } from 'react';  

const ReactComponent: React.FC = () => {  
  const [count, setCount] = useState(0);  

  return (  
    <div>  
      <h1>Obsidian React Component</h1>  
      <p>Count: {count}</p>  
      <button onClick={() => {
			setCount(count + 1)
			console.log("hello",count)
		}}>  
        Increment  
      </button>  
    </div>  
  );  
};  

export default ReactComponent; 
