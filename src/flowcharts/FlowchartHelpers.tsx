import { Edge, MarkerType, Node } from '@xyflow/react';
import React from 'react';

const strokeWidth = 1.8;

export interface SequenceActor {
    id: string;
    label: React.ReactNode;
    color: string;
    position?: number;
}

export interface SequenceAction {
    label: React.ReactNode;
    source: string;
    target: string;
    row: number;
    width?: number;
    event?: string;
    dashed?: boolean;
}

export interface SequenceDiagramConfig {
    actors: SequenceActor[];
    actions: SequenceAction[];
    actorSpacing?: number;
    rowHeight?: number;
    nodeSpacing?: number;
}

function genActionId(action: SequenceAction) {
    return `node-${action.row}-${action.source}-${action.target}`;
}

export function createSequenceDiagram({
    actors,
    actions,
    actorSpacing = 288,
    rowHeight = 66,
    nodeSpacing = 88,
}: SequenceDiagramConfig): {
    nodes: Node[];
    edges: Edge[];
} {
    // Calculate rowCount from actions if not provided
    const calculatedRowCount = Math.max(...actions.map((action) => action.row), 1);

    // Check if there's a self-referencing action in the last row
    const hasSelfRefInLastRow = actions.some(
        (action) => action.source === action.target && action.row === calculatedRowCount,
    );

    // Add 1 to effective row count if there's a self-referencing action in the last row
    const effectiveRowCount = hasSelfRefInLastRow ? calculatedRowCount + 1 : calculatedRowCount;

    // Calculate total height
    const totalHeight = (effectiveRowCount + 1) * rowHeight;

    // Calculate positions for all actors first
    const actorPositions = new Map<string, number>();
    actors.forEach((actor, index) => {
        const xPos = actor.position !== undefined ? actor.position : index * actorSpacing;
        actorPositions.set(actor.id, xPos);
    });

    // Map to track active rows for each actor
    const actorActiveRows: Record<string, Set<number>> = {};

    // Initialize sets for each actor
    actors.forEach((actor) => {
        actorActiveRows[actor.id] = new Set<number>();
    });

    // Track the source and target actors for each action
    actions.forEach((action) => {
        if (action.source === action.target) {
            // For self-referencing actions, highlight only the rows above and below
            // NOT the action row itself, as it has no direct edge connections
            actorActiveRows[action.source].add(action.row - 1);
            actorActiveRows[action.source].add(action.row + 1);
        } else {
            // Mark source and target as active
            actorActiveRows[action.source].add(action.row);
            actorActiveRows[action.target].add(action.row);
        }
    });

    // Create actor nodes
    const actorNodes: Node[] = actors.map((actor, index) => {
        const x = actorPositions.get(actor.id) ?? index * actorSpacing;

        // Use either predefined highlight sections or automatically calculated ones
        const highlightSections = Array.from(actorActiveRows[actor.id]);

        return {
            id: actor.id,
            type: 'sequenceActor',
            position: { x, y: 0 },
            data: {
                label: actor.label,
                color: actor.color,
                height: totalHeight,
                sections: createActorSections(highlightSections, effectiveRowCount),
            },
        };
    });

    // Create action nodes
    const actionNodes: Node[] = actions.map((action) => {
        // Get source and target actors' positions
        const sourceActor = actors.find((a) => a.id === action.source);
        const targetActor = actors.find((a) => a.id === action.target);

        if (!sourceActor || !targetActor) {
            throw new Error(`Actor not found: ${!sourceActor ? action.source : action.target}`);
        }

        // Generate an ID if not provided
        const id = genActionId(action);

        // Calculate position
        const sourceX =
            sourceActor.position !== undefined
                ? sourceActor.position
                : actors.indexOf(sourceActor) * actorSpacing;

        const targetX =
            targetActor.position !== undefined
                ? targetActor.position
                : actors.indexOf(targetActor) * actorSpacing;

        // Place node halfway between source and target
        const x = Math.min(sourceX, targetX) + Math.abs(targetX - sourceX) / 2;
        const y = action.row * rowHeight - rowHeight / 2 - 9; // Position at exact center of row

        // Calculate width based on distance between actors, but account for spacing
        const width = action.width || Math.max(Math.abs(targetX - sourceX) - nodeSpacing, 0);

        return {
            id,
            type: 'sequenceAction',
            position: {
                x: x - width / 2 + (sourceActor === targetActor ? 45 : 0),
                y,
            },
            data: {
                label: action.label,
                event: action.event,
                height: rowHeight,
                width,
                row: action.row,
            },
        };
    });

    // Create edges
    const edges: Edge[] = [];

    // Add edges for each action
    actions.forEach((action) => {
        // Generate an ID if not provided
        const id = genActionId(action);

        if (action.source === action.target) {
            // Self-loop: actor to node and back to actor
            edges.push({
                id: `e${action.row}-${action.source}-to-${id}`,
                source: action.source,
                target: id,
                sourceHandle: `${action.source}-${action.row - 1}-right-source`,
                targetHandle: `${id}-top-target`,
                type: 'smoothstep',
                animated: false,
                style: action.dashed ? { strokeDasharray: '5,5', strokeWidth } : { strokeWidth },
                markerEnd: { type: MarkerType.ArrowClosed },
            });

            edges.push({
                id: `e${action.row}-${id}-to-${action.target}`,
                source: id,
                target: action.target,
                sourceHandle: `${id}-bottom-source`,
                targetHandle: `${action.target}-${action.row + 1}-right-target`,
                type: 'smoothstep',
                animated: false,
                style: action.dashed ? { strokeDasharray: '5,5', strokeWidth } : { strokeWidth },
                markerEnd: { type: MarkerType.ArrowClosed },
            });
        } else {
            // Regular flow between different actors
            // Get the actors
            const sourceActor = actors.find((a) => a.id === action.source);
            const targetActor = actors.find((a) => a.id === action.target);

            if (!sourceActor || !targetActor) {
                throw new Error(`Actor not found: ${!sourceActor ? action.source : action.target}`);
            }

            // Determine handle positions based on which actor is on the left
            const sourceX =
                sourceActor.position !== undefined
                    ? sourceActor.position
                    : actors.indexOf(sourceActor) * actorSpacing;

            const targetX =
                targetActor.position !== undefined
                    ? targetActor.position
                    : actors.indexOf(targetActor) * actorSpacing;

            if (sourceX < targetX) {
                // Left to right connection
                // Edge from source actor to action node
                edges.push({
                    id: `e${action.row}-${action.source}-to-${id}`,
                    source: action.source,
                    target: id,
                    sourceHandle: `${action.source}-${action.row}-right-source`,
                    targetHandle: `${id}-left-target`,
                    type: 'straight',
                    animated: false,
                    style: action.dashed
                        ? { strokeDasharray: '5,5', strokeWidth }
                        : { strokeWidth },
                    markerEnd: { type: MarkerType.ArrowClosed },
                });

                // Edge from action node to target actor
                edges.push({
                    id: `e${action.row}-${id}-to-${action.target}`,
                    source: id,
                    target: action.target,
                    sourceHandle: `${id}-right-source`,
                    targetHandle: `${action.target}-${action.row}-left-target`,
                    type: 'straight',
                    animated: false,
                    style: action.dashed
                        ? { strokeDasharray: '5,5', strokeWidth }
                        : { strokeWidth },
                    markerEnd: { type: MarkerType.ArrowClosed },
                });
            } else {
                // Right to left connection
                // Edge from source actor to action node
                edges.push({
                    id: `e${action.row}-${action.source}-to-${id}`,
                    source: action.source,
                    target: id,
                    sourceHandle: `${action.source}-${action.row}-left-source`,
                    targetHandle: `${id}-right-target`,
                    type: 'straight',
                    animated: false,
                    style: action.dashed
                        ? { strokeDasharray: '5,5', strokeWidth }
                        : { strokeWidth },
                    markerEnd: { type: MarkerType.ArrowClosed },
                });

                // Edge from action node to target actor
                edges.push({
                    id: `e${action.row}-${id}-to-${action.target}`,
                    source: id,
                    target: action.target,
                    sourceHandle: `${id}-left-source`,
                    targetHandle: `${action.target}-${action.row}-right-target`,
                    type: 'straight',
                    animated: false,
                    style: action.dashed
                        ? { strokeDasharray: '5,5', strokeWidth }
                        : { strokeWidth },
                    markerEnd: { type: MarkerType.ArrowClosed },
                });
            }
        }
    });

    return {
        nodes: [...actorNodes, ...actionNodes],
        edges,
    };
}

/**
 * Create actor sections with optional highlights
 */
function createActorSections(
    highlights: number[] = [],
    count: number = 6,
): { highlight: boolean }[] {
    return Array.from({ length: count + 1 }, (_, i) => ({
        // Row numbers start at 1, but sections start at 0, so we need to adjust
        // We add 1 to i because i is 0-indexed, but the rows are 1-indexed
        highlight: highlights.includes(i + 1),
    }));
}
