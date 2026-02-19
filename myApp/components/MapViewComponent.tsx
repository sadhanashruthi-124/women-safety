import React from 'react';
import MapView, { Circle, MapViewProps, MapCircleProps } from 'react-native-maps';

interface MapViewComponentProps extends MapViewProps {
    children?: React.ReactNode;
}

export const MapViewComponent = (props: MapViewComponentProps) => {
    return <MapView {...props}>{props.children}</MapView>;
};

export const MapCircle = (props: MapCircleProps) => {
    return <Circle {...props} />;
};
