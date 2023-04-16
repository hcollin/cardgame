

import Arena from "./components/Arena";

import "./App.css";
import { TouchBackend } from "react-dnd-touch-backend";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const isMobile = false;


function App() {
	
	const dndOpts = {
		enableMouseEvents: true,
		enableTouchEvents: true,

	}

	const backend = isMobile ? TouchBackend : HTML5Backend;


	return (
		<DndProvider backend={backend}>
			<Arena />
		</DndProvider>
	)
}

export default App;
