import {useState} from 'react'
import ForceGraph2D from 'react-force-graph-2d'//2D
//import ForceGraph3D from 'react-force-graph-3d'//3D
import Axios from 'axios'

import './App.css';

const App = () => {
  const nodes = [];
  const links = [];

  const updateData = () => {
  Axios.get("https://jsonplaceholder.typicode.com/posts")
    .then(res => {
      console.log("successfully retrieved data", res.data)
      res.data.map(x => nodes.push({"userId": x.userId, "id": x.id}))
      res.data.map(y => links.push({"source": y.userId, "target": y.id, "value": 5})) 
      setGraphData({nodes, links})
    })
    .catch(err => {
      console.log("unable to pull data..dont panic")
    })
  }

 
  const [graphData, setGraphData] = useState({nodes, links})
  //TODO: Dynamically update remaining fields to pass to graph
  const [nodeId, setNodeId] = useState("")
  const [nodeVal, setNodeVal] = useState("")
  const [nodeLabel, setNodeLabel] = useState("")
  const [nodeAutoColorBy, setNodeAutoColorBy] = useState("")
  const [linkSource, setLinkSource] = useState("")
  const [linkTarget, setLinkTarget] = useState("")
  

  return (
    <div className="App">
      <button onClick={updateData}>Click for data</button>
      <ForceGraph2D 
        nodeLabel={x => x.innerHTML = "id"}
        nodeAutoColorBy="userId"
        nodeRelSize={6}
        graphData={graphData}
        linkDirectionalParticleColor={() => "red"}
        linkDirectionalParticleWidth={2}
        linkDirectionalParticles="value"
        linkDirectionalParticleSpeed={d => d.value * 0.001}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.id;
          const fontSize = 12/globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          const textWidth = ctx.measureText(label).width;
          const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding

          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);

          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = node.color;
          ctx.fillText(label, node.x, node.y);

          node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
        }}
        nodePointerAreaPaint={(node, color, ctx) => {
          ctx.fillStyle = color;
          const bckgDimensions = node.__bckgDimensions;
          bckgDimensions && ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);
        }}
        onNodeDragEnd={node => {
          node.fx = node.x;
          node.fy = node.y;
          node.fz = node.z;
        }}
        />
    </div>
  );
}

export default App;
