import {useState} from 'react'
//import ForceGraph2D from 'react-force-graph-2d'//2D
import ForceGraph3D from 'react-force-graph-3d'//3D
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
      <ForceGraph3D 
        width={1500}
        height={800}
        nodeLabel="id"
        nodeAutoColorBy="userId"
        nodeRelSize={6}
        graphData={graphData}
        linkDirectionalParticleColor={() => "red"}
        linkDirectionalParticleWidth={2}
        linkDirectionalParticles="value"
        linkDirectionalParticleSpeed={d => d.value * 0.001}
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
