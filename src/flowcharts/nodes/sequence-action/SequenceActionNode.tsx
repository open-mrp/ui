import { Position } from '@xyflow/react';
import React from 'react';
import EdgeHandle from '../EdgeHandle';
import EventBadge from './EventBadge';

export interface SequenceActionNodeProps {
    label: React.ReactNode;
    event?: string;
    height?: number;
    width?: number;
    row?: number;
}
export interface SequenceActionNodeData {
    data: SequenceActionNodeProps;
    id: string;
}
export default function SequenceActionNode({ data, id }: SequenceActionNodeData) {
    return (
        <div
            className="flex items-center justify-center"
            style={{
                height: data.height || 145,
                width: data.width || 250,
            }}
        >
            <div
                className="relative bg-background rounded-lg px-6 py-2 flex items-center justify-center"
                style={{
                    backgroundColor: 'var(--background)',
                    flexBasis: '100%',
                    boxShadow: '0 1px 8px -2px var(--text-secondary)',
                }}
            >
                <EdgeHandle
                    id={`${id}-left-target`}
                    position={Position.Left}
                    type="target"
                    handlePosition={{ top: '50%', left: '0' }}
                />
                <EdgeHandle
                    id={`${id}-left-source`}
                    position={Position.Left}
                    type="source"
                    handlePosition={{ top: '50%', left: '0' }}
                />
                <EdgeHandle
                    id={`${id}-right-target`}
                    position={Position.Right}
                    type="target"
                    handlePosition={{ top: '50%', right: '0' }}
                />
                <EdgeHandle
                    id={`${id}-right-source`}
                    position={Position.Right}
                    type="source"
                    handlePosition={{ top: '50%', right: '0' }}
                />
                <EdgeHandle
                    id={`${id}-top-target`}
                    position={Position.Top}
                    type="target"
                    handlePosition={{ top: '0', left: '50%' }}
                />
                <EdgeHandle
                    id={`${id}-top-source`}
                    position={Position.Top}
                    type="source"
                    handlePosition={{ top: '0', left: '50%' }}
                />
                <EdgeHandle
                    id={`${id}-bottom-target`}
                    position={Position.Bottom}
                    type="target"
                    handlePosition={{ bottom: '0', left: '50%' }}
                />
                <EdgeHandle
                    id={`${id}-bottom-source`}
                    position={Position.Bottom}
                    type="source"
                    handlePosition={{ bottom: '0', left: '50%' }}
                />

                <p className="text-foreground text-center text-sm font-medium !p-0">{data.label}</p>

                {data.event && (
                    <EventBadge
                        event={data.event}
                        className="absolute top-0 right-0 bg-primary p-1 rounded-tr-md"
                    />
                )}
            </div>
        </div>
    );
}
