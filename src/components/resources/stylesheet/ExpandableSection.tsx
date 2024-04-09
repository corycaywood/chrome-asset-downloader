import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';

interface Props extends PropsWithChildren {
    expanded: boolean;
    className?: string;
}

const ANIMATION_DURATION_MS = 350;

function ExpandableSection(props: Props) {
	const [height, setHeight] = useState('0px');
	const expandableRef = useRef<HTMLDivElement>(null);

    const heightInPx = () => `${expandableRef?.current?.scrollHeight || 0}px`;

	useEffect(() => {
        if (props.expanded) {
            setHeight(heightInPx())
            setTimeout(() => setHeight('auto'), ANIMATION_DURATION_MS)
        } else {
            setHeight(height == 'auto' ? heightInPx() : '0px');
        }
    }, [props.expanded]);

    useEffect(() => {
        if (!props.expanded && height == heightInPx()) {
            setHeight('0px');
        }
    }, [height]);

    return (
        <div 
            className={`expandable ${props.expanded ? 'expanded' : 'collapsed'} ${props.className ? props.className : ''}`}
            style={{height, transition: `height ${ANIMATION_DURATION_MS}ms ease`}}
            ref={expandableRef}
        >
            {props.children}
        </div>
    );
}

export default ExpandableSection;
