import { Position } from '@xyflow/react';
import React from 'react';
import EdgeHandle from '../EdgeHandle';
import SequenceActorLabel from './SequenceActorLabel';

const HIGHLIGHT_WIDTH = 6;

export interface SequenceActorNodeProps {
    id: string;
    label: React.ReactNode;
    color: string;
    height?: number;
    sections: { highlight: boolean }[];
}
export interface SequenceActorNodeData {
    data: SequenceActorNodeProps;
    id: string;
}
export default function SequenceActorNode({ data, id }: SequenceActorNodeData) {
    return (
        <div
            className="hover:cursor-auto bg-border rounded-sm"
            style={{ height: data.height || 870, width: '2px' }}
        >
            <SequenceActorLabel
                label={data.label}
                color={data.color}
                highlightWidth={HIGHLIGHT_WIDTH}
            />

            {data.sections.map((section, index) => {
                const row = index + 1;
                return (
                    <div
                        key={`${id}-section-${index}`}
                        className="relative"
                        style={{ height: `${100 / data.sections.length}%` }}
                    >
                        {section.highlight && (
                            <div
                                className="rounded-sm"
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    bottom: 0,
                                    backgroundColor: data.color,
                                    width: `${HIGHLIGHT_WIDTH}px`,
                                    left: '-2px',
                                }}
                            />
                        )}

                        <EdgeHandle
                            id={`${id}-${row}-left-target`}
                            position={Position.Left}
                            type="target"
                            handlePosition={{ top: '50%', left: '0' }}
                        />
                        <EdgeHandle
                            id={`${id}-${row}-left-source`}
                            position={Position.Left}
                            type="source"
                            handlePosition={{ top: '50%', left: '0' }}
                        />
                        <EdgeHandle
                            id={`${id}-${row}-right-target`}
                            position={Position.Right}
                            type="target"
                            handlePosition={{ top: '50%', right: '0' }}
                        />
                        <EdgeHandle
                            id={`${id}-${row}-right-source`}
                            position={Position.Right}
                            type="source"
                            handlePosition={{ top: '50%', right: '0' }}
                        />
                    </div>
                );
            })}
        </div>
    );
}
