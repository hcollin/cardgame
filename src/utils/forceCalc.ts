export type LocNode = {
	id: string;
	x: number;
	y: number;
	vx: number;
	vy: number;
};

export type LocNodeLink = {
	source: string;
	target: string;
};

function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

export function calculateForces(nodes: LocNode[], links: LocNodeLink[], iterations: number = 100) {
	const forceConstant = 2;
	const linkDistance = 150;
	const friction = 0.9;

	const minDistance = 300; // Set your minimum distance
	const maxDistance = 600; // Set your maximum distance

	for (let i = 0; i < iterations; i++) {
		// Calculate repulsive forces between nodes
		for (const nodeA of nodes) {
			for (const nodeB of nodes) {
				if (nodeA === nodeB) continue;

				const distance = calculateDistance(nodeA.x, nodeA.y, nodeB.x, nodeB.y);
				const force = forceConstant / Math.pow(distance, 2);

				const dx = (nodeA.x - nodeB.x) / distance;
				const dy = (nodeA.y - nodeB.y) / distance;

				nodeA.vx += dx * force;
				nodeA.vy += dy * force;
			}
		}

		// Calculate attractive forces between connected nodes
		for (const link of links) {
			const sourceNode = nodes.find((node) => node.id === link.source);
			const targetNode = nodes.find((node) => node.id === link.target);

			if (!sourceNode || !targetNode) continue;

			const distance = calculateDistance(sourceNode.x, sourceNode.y, targetNode.x, targetNode.y);
			let force = (distance - linkDistance) / linkDistance;

			if (distance < minDistance) {
				force = Math.min(force, (minDistance - distance) / distance);
			  } else if (distance > maxDistance) {
				force = Math.max(force, (maxDistance - distance) / distance);
			  }

			const dx = (sourceNode.x - targetNode.x) / distance;
			const dy = (sourceNode.y - targetNode.y) / distance;

			sourceNode.vx -= dx * force;
			sourceNode.vy -= dy * force;
			targetNode.vx += dx * force;
			targetNode.vy += dy * force;
		}

		// Update positions based on calculated forces
		for (const node of nodes) {
			node.x += node.vx;
			node.y += node.vy;

			node.vx *= friction;
			node.vy *= friction;
		}
	}
}
