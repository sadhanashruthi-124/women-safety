/**
 * Mock KYC Service for Aadhaar Analysis
 */

export interface AnalysisResult {
    approved: boolean;
    gender: 'Female' | 'Male' | 'Unknown';
    message: string;
}

export const analyzeAadhaar = async (fileUri: string, fileName: string): Promise<AnalysisResult> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock logic: 
    // If the filename contains 'female' (case-insensitive), approve as female.
    // If it contains 'male', mark as male.
    // Otherwise, default to female for evaluation purposes, or random.

    const lowerName = fileName.toLowerCase();

    if (lowerName.includes('female')) {
        return {
            approved: true,
            gender: 'Female',
            message: 'KYC Approved: Female gender verified.'
        };
    } else if (lowerName.includes('male')) {
        return {
            approved: false,
            gender: 'Male',
            message: 'KYC Rejected: Only female users are allowed access.'
        };
    }

    // Default mock behavior if no keyword
    // For demonstration, let's say it's female if it's a PDF, otherwise randomly pick.
    if (lowerName.endsWith('.pdf')) {
        return {
            approved: true,
            gender: 'Female',
            message: 'KYC Approved: Female gender verified from PDF.'
        }
    }

    return {
        approved: true,
        gender: 'Female',
        message: 'KYC Approved: Female gender verified.'
    };
};
