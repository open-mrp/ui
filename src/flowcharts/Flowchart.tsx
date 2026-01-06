'use client';

import { cn } from '@/utils/cn';
import {
    Background,
    BackgroundVariant,
    Edge,
    Node,
    NodeProps,
    ReactFlow,
    ReactFlowInstance,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import React, { useCallback, useState } from 'react';
import FlowchartControls from './FlowchartControls';
import SequenceActionNode from './nodes/sequence-action/SequenceActionNode';
import SequenceActorNode from './nodes/sequence-actor/SequenceActorNode';

// Define the node types for React Flow to use our custom nodes
const nodeTypes = {
    sequenceActor: SequenceActorNode,
    sequenceAction: SequenceActionNode,
};

export interface FlowchartProps {
    nodes: Node[];
    edges: Edge[];
    height?: number;
    className?: string;
    additionalNodeTypes?: Record<string, React.ComponentType<NodeProps>>;
    defaultViewport?: { x: number; y: number; zoom: number };
    isPro?: boolean;
}

/**
 * A reusable flowchart component that wraps ReactFlow with consistent styling
 */
export default function Flowchart({
    nodes,
    edges,
    height = 600,
    className = '',
    additionalNodeTypes = {},
    defaultViewport = { x: 0, y: 0, zoom: 0.5 },
    isPro = false,
}: FlowchartProps) {
    // Store the ReactFlow instance
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

    // Initialize the diagram
    const onInit = useCallback((instance: ReactFlowInstance) => {
        setReactFlowInstance(instance);
        instance.fitView();
    }, []);

    // Combine built-in node types with any additional ones
    const mergedNodeTypes = { ...nodeTypes, ...additionalNodeTypes };

    return (
        <div
            className={cn('rounded-lg my-4 relative', className)}
            style={{
                width: '100%',
                height: `${height}px`,
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
            }}
        >
            <ReactFlow
                proOptions={{
                    account: isPro ? 'paid-pro' : 'free',
                    hideAttribution: isPro,
                }}
                nodes={nodes}
                edges={edges}
                onInit={onInit}
                nodeTypes={mergedNodeTypes}
                fitView
                defaultViewport={defaultViewport}
            >
                <Background variant={BackgroundVariant.Dots} color="var(--border-color)" />
            </ReactFlow>
            <FlowchartControls reactFlowInstance={reactFlowInstance} />
        </div>
    );
}
