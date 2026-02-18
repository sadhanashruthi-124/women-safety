export interface RiskData {
    id: string;
    latitude: number;
    longitude: number;
    riskLevel: 'Low' | 'Moderate' | 'High';
    riskScore: number; // 0-100
}

// Mock data around a central point (approx. Delhi for example, or generic)
// We will generate random points around a provided center for the demo.
export const getRiskData = (centerLat: number, centerLong: number): RiskData[] => {
    const riskPoints: RiskData[] = [];
    const numPoints = 20;

    for (let i = 0; i < numPoints; i++) {
        // Random offset
        const latOffset = (Math.random() - 0.5) * 0.05;
        const longOffset = (Math.random() - 0.5) * 0.05;

        const score = Math.floor(Math.random() * 100);
        let level: 'Low' | 'Moderate' | 'High' = 'Low';
        if (score > 70) level = 'High';
        else if (score > 40) level = 'Moderate';

        riskPoints.push({
            id: `risk-${i}`,
            latitude: centerLat + latOffset,
            longitude: centerLong + longOffset,
            riskLevel: level,
            riskScore: score,
        });
    }

    return riskPoints;
};

// Function to simulate checking if a user is in a high risk zone
export const checkRiskZone = (userLat: number, userLong: number, riskData: RiskData[]): RiskData | null => {
    const threshold = 0.005; // Approx 500m

    for (const point of riskData) {
        if (point.riskLevel === 'High') {
            const latDiff = Math.abs(userLat - point.latitude);
            const longDiff = Math.abs(userLong - point.longitude);

            if (latDiff < threshold && longDiff < threshold) {
                return point;
            }
        }
    }
    return null;
};
