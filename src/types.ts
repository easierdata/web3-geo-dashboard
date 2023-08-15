export interface Post {
	userId: number;
	id: number;
	title: string;
	body: string;
}

interface CustomFeatureProperties {
	ROW: string;
	PATH: string;
	CID: string;
	DATE: string; // Expected in ISO format, e.g., '2023-08-12T14:30:00Z'
	IPFS_NODES: number;
	FIL_DEALS: number;
	ON_S3: boolean;
}

export interface Web3EnrichedMapboxFeature extends mapboxgl.MapboxGeoJSONFeature {
	properties: CustomFeatureProperties;
}

export interface metadata {
	ipfs: number;
	filecoin: number;
	unsealed: number;
}
